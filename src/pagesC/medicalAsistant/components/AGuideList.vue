<template>
  <view class="flex-normal" v-if="list && list.length">
    <view class="flex-normal">
      <view
        v-for="(item, idx) in list"
        :key="item?.text + idx"
        @click="useTBanner(item, 'navigateTo',data)"
        class="item g-border text-no-wrap color-444 f28 active"
      >
        <view class="label">{{ item.text }}</view>
      </view>
    </view>
    <view class="safe-width">2</view>
  </view>
</template>
<script setup lang="ts">
  import { TButtonConfig } from '@/types/modules/serverStaticData';
  import { useTBanner } from '@/utils';
  import { HosGuideSheet } from '../types';
  const props = defineProps<{
    list: TButtonConfig[] | undefined;
    data: HosGuideSheet | undefined;
  }>();
  console.log('props', props);
</script>

<style lang="scss" scoped>
  .item {
    padding: 10rpx 20rpx;
    margin-bottom: 1rpx;

    border-radius: 50px 50px 50px 50px;
    margin-right: 16rpx;

    .label {
      text-align: left;
      font-weight: normal;
    }

    &.active {
      border-color: var(--hr-brand-color-6) !important;
      color: var(--hr-brand-color-6) !important;
    }
  }

  .safe-width {
    width: 200rpx;
    // height: 1px;
    overflow-y: scroll;
    display: inline-block;
    opacity: 0;
  }
</style>
