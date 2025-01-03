<template>
  <view class="">
    <view v-for="(item, i) in list" :key="item.uuid" class="mb24">
      <g-collapse ref="collapseRefs">
        <template #header="{ isShow }">
          <view
            class="bg-white pr32 pl32 pt16 pb16 rounded-xl g-border flex items-center justify-between"
          >
            <view>
              <text class="f40 color-666">
                {{
                  `${dayjs(item.disposeTime).format('MM-DD')} ${item.deptName}`
                }}
              </text>
            </view>

            <text
              :class="{
                arrowBottom: isShow,
              }"
              class="iconfont right-icon f80 color-888"
            >
              &#xe665;
            </text>
          </view>
        </template>

        <view
          v-if="item.processResultList && item.processResultList.length"
          :class="{
            'line-play':
              item.processResultList && item.processResultList.length > 1,
          }"
          class="pt32 relative"
        >
          <GuideContentList
            :list="item.processResultList"
            :mzqhBtns="mzqhBtns"
            @collapse-change="handCollapseChange(i)"
          />
        </view>
      </g-collapse>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { TButtonConfig } from '@/types';
  import GuideContentList from './GuideContentList.vue';
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import { wait } from '@/utils';

  const props = defineProps<{
    list: any[];
    mzqhBtns: TButtonConfig[];
  }>();

  const collapseRefs = ref<any[]>();
  const handCollapseChange = async (idx) => {
    await wait(300);
    if (collapseRefs.value) {
      const itemRef = collapseRefs.value[idx];
      itemRef && itemRef.init();
    }
  };
</script>

<style lang="scss" scoped>
  .right-icon {
    transition: 0.4s all;

    &.arrowBottom {
      transform: rotate(90deg);
    }
  }

  .line-play {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      height: 32rpx;

      left: 20rpx;
      width: 1rpx;
      border-left: 1px dashed #cccccc;
      z-index: 0;
    }
  }
</style>
