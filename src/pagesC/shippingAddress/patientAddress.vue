<template>
  <view class="page">
    <view class="address-box">
      <view class="box-item active" @tap="clickSelect">
        <view class="svg">
          <text class="icon-font ico_selected" />
        </view>
        <view class="item-title flex-between">
          <view class="item-title-left">
            <text>陆强强</text>
            <text>16544346789</text>
          </view>
        </view>
        <text class="box-content">浙江省杭州市滨江区新联路625号和仁科技大厦17楼</text>
      </view>
      <view class="box-item">
        <view class="item-title flex-between">
          <view class="item-title-left">
            <text>陆强强</text>
            <text>16544346789</text>
          </view>
        </view>
        <text class="box-content">浙江省杭州市滨江区新联路625号和仁科技大厦17楼</text>
      </view>
    </view>
    <xy-dialog
      :show="isAddShow"
      content="请补充地址信息"
      confirmText="立即补充"
      @confirmButton="clickConfirm"
    ></xy-dialog>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  const isAddShow = ref(false);
  const clickSelect = () => {
    isAddShow.value = true;
  };
  const clickConfirm = () => {
    uni.navigateTo({
      url: '/pagesC/shippingAddress/addAddress?pageType=edit'
    });
  };
</script>

<style scoped lang="scss">
  .page {
    background-color: #f6f6f6;
    padding: 24rpx 32rpx;
    .address-box {
      .box-item {
        position: relative;
        background: var(--h-color-white);
        margin-bottom: 16rpx;

        border: 2rpx solid var(--hr-neutral-color-4);
        border-radius: 16rpx;
        padding: 32rpx;
        .item-title {
          margin-bottom: 32rpx;
          .item-title-left {
            text {
              font-size: var(--hr-font-size-xs);
              color: var(--hr-neutral-color-9);
              margin-right: 16rpx;
              line-height: 44rpx;
            }
          }
        }
        .box-content {
          font-size: var(--hr-font-size-xl);
          font-weight: var(--h-weight-2);
          text-align: left;
          color: var(--hr-neutral-color-10);
        }
      }
      .active {
        border-color: var(--hr-brand-color-6);
      }
      .svg {
        font-size: var(--h-size-40);
        position: absolute;
        right: 0;
        bottom: -12rpx;
      }
    }
  }
</style>
