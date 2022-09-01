<template>
  <view class="page">
    <view class="address-top flex-between">
      <view class="item g-flex-rc-cc" @tap="gotoPatient">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#ico_people"></use>
        </svg>
        <text>获取就诊人地址</text>
      </view>
      <view class="item g-flex-rc-cc">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#ico_wechat"></use>
        </svg>
        <text>获取就诊人地址</text>
      </view>
    </view>
    <view class="address-box">
      <view class="box-item">
        <view class="item-title flex-between">
          <view class="item-title-left">
            <text>陆强强</text>
            <text>16544346789</text>
            <!-- <text>默认</text> -->
            <uni-hr-label fontColor="#FF8A00" fontBackColor="#FFF3E0">
              默认
            </uni-hr-label>
          </view>
          <view class="item-title-right flex-normal">
            <text :class="`iconfont ico_editor`" />
            编辑
          </view>
        </view>
        <text class="box-content">浙江省杭州市滨江区新联路625号和仁科技大厦17楼</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const gotoPatient = () => {
  uni.navigateTo({
    url: "/pagesC/shippingAddress/patientAddress",
  });
};
</script>

<style scoped lang="scss">
.page {
  background-color: #f6f6f6;
  padding: 24rpx 32rpx;
  .address-top {
    margin-bottom: 24rpx;
    width: 100%;
    view.item {
      width: 50%;
      height: 128rpx;
      background: var(--h-color-white);
      border: 2rpx solid #cccccc;
      border-radius: 16rpx;
      margin-right: 14rpx;
      .icon {
        margin-right: 14rpx;
        font-size: var(--hr-font-size-xxl);
      }
      text {
        color: var(--hr-neutral-color-10);
        font-size: var(--hr-font-size-base);
      }
    }
  }
  .address-box {
    .box-item {
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
        .item-title-right {
          color: var(--hr-brand-color-6);
          .iconfont {
            font-size: var(--h-size-40);
            color: var(--hr-brand-color-6);
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
  }
}
</style>
