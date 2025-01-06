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
          v-if="item.itemList && item.itemList.length"
          :class="{
            'line-play': item.itemList.length > 1,
          }"
          class="pt32 relative"
        >
          <GuideContentList
            :list="item.itemList"
            :mzqhBtns="mzqhBtns"
            @collapse-change="handCollapseChange(i)"
            @btn-click="($event) => $emit('btn-click', $event)"
            @go-report="($event) => $emit('go-report', $event)"
            @go-take-number="($event) => $emit('go-take-number', $event)"
            @go-address-map="($event) => $emit('go-address-map', $event)"
            @go-pay-page="($event) => $emit('go-pay-page', $event)"
            @open-hos-location="($event) => $emit('open-hos-location', $event)"
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
  const emits = defineEmits([
    'btn-click',
    'go-report',
    'go-take-number',
    'go-address-map',
    'go-pay-page',
    'open-hos-location',
    'collapse-change',
  ]);

  const collapseRefs = ref<any[]>();
  const handCollapseChange = async (idx) => {
    if (collapseRefs.value) {
      const itemRef = collapseRefs.value[idx];
      if (itemRef) {
        await wait(100);
        itemRef.init();
        await wait(100);
        itemRef.init();
        await wait(100);
        itemRef.init();
        await wait(100);
        itemRef.init();
      }
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
