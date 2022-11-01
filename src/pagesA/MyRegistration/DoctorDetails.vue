<template>
  <view class="">
    <image
      :src="$global.BASE_IMG + 'v3_doctor_card_top.png'"
      mode="widthFix"
      class="header-bg my-disabled"
    />

    <view class="content">
      <view class="header-box">
        <view class="content-box g-border">
          <view class="header-transform">
            <view class="header mb16 flex-between">
              <image
                :src="'/static/image/order/order-doctor-avatar.png'"
                class="doc-avatar g-border"
              />

              <view class="flex-normal header-btn">
                <button class="btn btn-warning btn-round btn-size-small">
                  <text class="iconfont">&#xe6b8;</text>
                  <text>关注</text>
                </button>

                <button class="btn btn-warning btn-round btn-size-small">
                  <text class="iconfont">&#xe6b8;</text>
                  <text>分享</text>
                </button>
              </view>
            </view>

            <view class="p32c header-content">
              <view class="doc-info flex-normal">
                <view class="doc-name mr24 f48 g-bold">王柏恒</view>

                <view class="color-444 f28">荣誉职称</view>
                <view class="color-444 f28">主任医师</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import globalGl from '@/config/global';
</script>

<style lang="scss" scoped>
  .header-bg {
    width: 100%;
    position: absolute;
    z-index: 1;
  }

  .content-box {
    // padding: 0 32rpx;
    background-color: #fff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
  }

  .content {
    position: relative;
    z-index: 2;
    padding: 0 32rpx;
  }

  .header-box {
    .header-transform {
      position: relative;

      transform: translateY(-50rpx);
    }

    .header {
      padding: 0 32rpx;
      position: relative;
      z-index: 2;
      align-items: flex-start;

      .doc-avatar {
        width: 136rpx;
        height: 136rpx;
        border-radius: 50%;
      }

      .header-btn {
        margin-top: 20rpx;
        button {
          &:not(:last-child) {
            margin-right: 16rpx;
          }
        }
      }
    }

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 88rpx;
      background-color: transparent;
    }
  }
</style>
