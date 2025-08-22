<template>
  <view class="">
    <view v-for="(item, i) in list" class="g-border-bottom" :key="item">
      <g-collapse
        :open="!i"
        ref="collapseRef"
        @change="(v) => change(v, { idx: i, item })"
        :border="false"
      >
        <template #header="{ isShow: arrowBottom }">
          <view
            :class="{
              'collapse-header-open': arrowBottom,
              'collapse-header-close': !arrowBottom,
            }"
            class="pl24 pr24 pt32 pb32 bg-white animate__animated relative collapse-header"
          >
            <view class="flex items-center">
              <view class="f32">{{ item }}</view>
              <view class="flex-1"></view>
              <view
                :class="{
                  arrowBottom,
                }"
                class="iconfont right-icon color-888 f48"
              >
                &#xe66b;
              </view>
            </view>
          </view>
        </template>

        <view class="bg-white collapse-content f28 row">
          <view v-if="getContent(item)" class="pl24 pr24 pt32 pb32 bg-white">
            <view
              v-for="(p, pi) in getContent(item).list"
              :key="p.id"
              @click="goDetail(p)"
              :class="{
                mb24: pi !== getContent(item).list.length - 1,
              }"
              class="flex"
            >
              <view class="flex-1 f32">{{ p.title }}</view>
              <view class="iconfont color-888 f48">&#xe66b;</view>
            </view>

            <view
              v-if="
                getContent(item).isComplete && !getContent(item).list.length
              "
            >
              暂无数据
            </view>
          </view>
        </view>
      </g-collapse>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, watch } from 'vue';

  import { GStores, wait } from '@/utils';
  import api from '@/service/api';

  const props = defineProps<{
    list: string[];
  }>();
  const gStores = new GStores();

  const collapseRef = ref(<any>'');
  const secondList = ref(
    {} as {
      [key: string]: {
        isComplete: boolean;
        list: any[];
      };
    }
  );

  const change = async (isShow, { item, idx }) => {
    if (!isShow) {
      return;
    }

    let d = secondList.value[item];
    if (!d) {
      d = {
        isComplete: false,
        list: [],
      };

      secondList.value[item] = d;
    }

    if (d.isComplete) {
      return;
    }

    const list = await getSecondList(item).finally(() => {
      secondList.value[item].isComplete = true;
    });
    secondList.value[item].list.push(...list);
    d.isComplete = true;

    await wait(0);
    collapseRef.value[idx]?.init();
  };

  const getContent = (item) => {
    return secondList.value[item] || {};
  };

  const getSecondList = async (subType) => {
    const actionApi = api.getCmsListBySubType;
    const { result } = await actionApi({
      subType,
      searchContent: subType,
    });

    return result;
  };

  const goDetail = (item) => {
    const { id, informationLink } = item;

    if (informationLink) {
      uni.navigateTo({
        url: `/pagesA/webView/webView?https=${encodeURIComponent(
          informationLink
        )}`,
      });
    } else {
      uni.navigateTo({
        url: '/pagesA/serviceCenter/serviceCenterDetail?id=' + id,
      });
    }
  };

  watch(
    () => props.list,
    async (v) => {
      if (v.length) {
        await change(true, {
          item: v[0],
          idx: 0,
        });
      }
    },
    {
      immediate: true,
    }
  );
</script>

<style lang="scss" scoped>
  .right-icon {
    transform: rotate(90deg);
    transition: 0.4s all;
    position: relative;
    // right: 0upx;

    &.arrowBottom {
      transform: rotate(-90deg);
    }
  }
</style>
