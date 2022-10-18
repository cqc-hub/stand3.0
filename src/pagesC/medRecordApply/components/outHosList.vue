<template>
  <view class="">
    <view v-for="(item, idx) in list" :key="idx" class="g-border item">
      <view class="iconfont item-choose-icon">&#xe6ce;</view>

      <view class="item-container">
        <view class="title g-border-bottom">
          <text>2021-09-01</text>
          <text class="time-split">至</text>
          <text>2021-09-21</text>
        </view>

        <view class="row flex-normal">
          <view class="row-title">住院号</view>
          <view class="row-content">20210801201</view>
        </view>

        <view class="row flex-normal">
          <view class="row-title">诊断</view>
          <view class="row-content">肺部感染</view>
        </view>

        <view class="row flex-normal">
          <view class="row-title">医生</view>
          <view class="row-content">朝晖院区施天明</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { TOutHosInfo } from '../../utils/recordApply';

  const props = defineProps<{
    list: TOutHosInfo[];
    value: TOutHosInfo[];
  }>();
</script>

<style lang="scss" scoped>
  .item {
    margin-bottom: 16rpx;
    display: flex;
    padding: 32rpx;
    background-color: #fff;
    border-radius: 8px;

    .item-choose-icon {
      font-size: var(--hr-font-size-xxl);
      margin-right: 22rpx;
    }

    &:first-child {
      margin-top: 16rpx;
    }

    .item-container {
      flex: 1;

      .title {
        font-weight: 600;
        font-size: var(--hr-font-size-xl);
        padding-bottom: 14rpx;

        // #ifdef MP-ALIPAY
        line-height: 60rpx;
        // #endif

        word-break: break-all;

        .time-split {
          margin: 0 10rpx;
        }
      }

      .row {
        display: flex;
        margin-top: 16rpx;

        font-size: var(--hr-font-size-xs);

        .row-title {
          color: var(--hr-neutral-color-7);
          width: 96rpx;
        }

        .row-content {
          word-break: break-all;
        }
      }
    }
  }
</style>
