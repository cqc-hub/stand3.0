<template>
  <view class="page">
    <scroll-view class="container" scroll-y></scroll-view>

    <view class="footer">
      <view class="g-border-right">
        <view class="iconfont icon-kefu">&#xe6e2;</view>
        <view>
          <view class="title">咨询客服</view>
          <view class="desc">咨询客服</view>
        </view>
      </view>
      <view class="g-flex-rc-cc">456</view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--hr-neutral-color-1);

    .container {
      flex: 1;
      height: 1px;
    }

    .footer {
      display: flex;
      background-color: #fff;
      box-shadow: 16rpx 0 80rpx rgba($color: #bbb, $alpha: 0.6);
      font-size: var(--hr-font-size-xl);
      > view {
        flex: 1;
        padding: 24rpx 0;
        display: flex;
        justify-content: center;
        border-radius: 0;

        box-sizing: content-box;
        padding-bottom: 68rpx;

        &:after {
          border: none;
        }
      }

      .icon-kefu {
        font-size: 56rpx;
      }


      .title {
        font-weight: 600;
      }
      .desc {
        font-size: 20rpx;
      }
    }
  }
</style>
