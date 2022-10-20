<template>
  <view class="address-box">
    <view class="header flex-normal-between">
      <view class="user-info text-ellipsis">
        <text class="mr16">杀手</text>
        <text>136****6789</text>
      </view>

      <view class="iconfont size-icon">&#xe66b;</view>
    </view>

    <view class="g-bold text-ellipsis address-content">
      浙江省杭州市滨江区西兴路128号
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
</script>

<style lang="scss" scoped>
  .address-box {
    padding: 32rpx;
    border-bottom: 8rpx solid transparent;
    border-radius: 8px;

    background: linear-gradient(#fff, #fff) padding-box,
      repeating-linear-gradient(
          -45deg,
          #7ca8ff 0 18rpx,
          transparent 0 35rpx,
          #fe7967 0 50rpx
        )
        border-box;

    .header {
      color: var(--hr-neutral-color-9);
      .user-info {
        font-size: var(--hr-font-size-xs);
        display: flex;
        max-width: calc(100% - 150rpx);
        text {
          word-break: break-all;
          white-space: nowrap;
        }
      }

      .size-icon {
        color: var(--hr-neutral-color-7);
        font-size: var(--hr-font-size-xxl);
      }
    }

    .address-content {
      -webkit-line-clamp: 2;
      font-size: var(--hr-font-size-xl);
    }
  }
</style>
