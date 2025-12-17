<template>
  <view class="assist-card animate__animated animate__fadeIn">
    <view class="flex-normal-between">
      <view class="flex p24v f32">
        <text class="iconfont icon-location ml24 f40">&#xe6d7;</text>
        <view class="hos p12c">朝晖院区</view>
        <view class="dept p12c">皮肤-脱发专科</view>
      </view>
      <view class="color-666 flex pr24 more">
        <text class="f28">详情</text>
        <text class="iconfont f48">&#xe66b;</text>
      </view>
    </view>
    <view class="info-area">
      <view class="p24 f28 flex-normal-between">
        <view class="flex">
          <view class="name pr24">陈伟</view>
          <view class="date pr24">09-15</view>
          <view class="time pr24">下午16：00</view>
          <view class="number pr24">24号</view>
        </view>
        <view class="tag f24">三日后就诊</view>
      </view>
      <view class="dot-area">
        <view class="line">
          <view class="line-background"></view>
          <view class="line-cover"></view>
          <view class="dots">
            <view class="dot active"></view>
            <view class="dot active"></view>
            <view class="dot active"></view>
            <view class="dot"></view>
          </view>
          <view class="dots-name color-888 f28 g-bold">
            <view class="name text-ellipsis">挂号</view>
            <view class="name text-ellipsis">取号</view>
            <view class="name text-ellipsis active">候诊</view>
            <view class="name text-ellipsis">接诊</view>
          </view>
        </view>
      </view>
      <view class="notice flex p24">
        <view class="title f24 text-ellipsis">
          <text class="iconfont color-warn mr12">&#xe6d1;</text>
          <text class="color-warn f26 mr12">温馨提示:</text>
          <text class="content color-888 f26">
            这是内容内容内容内容内内容内容内容内容内容内容内容内容内内容内容内容内容
          </text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { GStores, useTBanner } from '@/utils';

  const gStores = new GStores();
  onMounted(() => {
    reLoad();
  });
  const list = ref([] as any[]);
  const reLoad = () => {
    console.log(8888);

    list.value = [
      {
        visitNo: 'v1234567890',
        cardNumber: 'c92014101',
        sysCode: '1001036',
        hosId: '12675',
        appointmentDate: '2025-11-21',
        timeDesc: '14:10-14:20',
        ampmName: '上午',
        disNo: '7',
        schQukCategor: '快捷号别',
        orderStatus: '2',
        deptName: '呼吸内科',
        docName: '潘医生',
      },
      {},
    ];
  };
</script>

<style lang="scss" scoped>
  .assist-card {
    background: radial-gradient(
      var(--hr-brand-color-4),
      var(--hr-brand-color-5)
    );
    border: 2rpx solid var(--hr-brand-color-3-light);
    border-radius: 24rpx;
    .icon-location {
      color: var(--hr-brand-color-6);
    }
    .hos {
      color: var(--hr-brand-color-6);
      border-right: 2rpx #cccccc solid;
    }
    .dept {
      color: $hr-neutral-color-10;
    }
    .more {
      justify-content: center;
      align-items: center;
    }
    .info-area {
      background-color: #ffffff;
      border-radius: 24rpx 24rpx 0 0;
      .tag {
        color: var(--hr-brand-color-8);
        background-color: var(--hr-brand-color-8-light);
        padding: 6rpx 12rpx;
      }
    }
    .dot-area {
      padding: 16rpx 24rpx 24rpx;
      .line {
        position: relative;
        padding-bottom: 42rpx;
        .line-background {
          height: 8rpx;
          width: 100%;
          background-color: var(--hr-brand-color-3-light);
          position: absolute;
        }
        .line-cover {
          height: 8rpx;
          width: 63.4%;
          background: linear-gradient(
            90deg,
            var(--hr-brand-color-6-light-3),
            var(--h-qrcode-1)
          );
          position: absolute;
        }
        .dots {
          view {
            position: absolute;
            width: 8rpx;
            height: 8rpx;
            background-color: var(--hr-brand-color-6);
            border-radius: 50%;
          }
          .active {
            background-color: #ffffff !important;
            border: 4rpx solid var(--h-qrcode-1) !important;
            top: -4rpx;
          }
          :nth-child(1) {
            left: 10%;
          }
          :nth-child(2) {
            left: 36.4%;
          }
          :nth-child(3) {
            left: 63.4%;
          }
          :nth-child(4) {
            left: 90%;
          }
        }
        .dots-name {
          .name {
            position: absolute;
            transform: translate(-30%, 20rpx);
          }

          .active {
            color: var(--hr-brand-color-6) !important;
          }
          :nth-child(1) {
            left: 10%;
          }
          :nth-child(2) {
            left: 36.4%;
          }
          :nth-child(3) {
            left: 63.4%;
          }
          :nth-child(4) {
            left: 90%;
          }
        }
        .notice {
        }
      }
    }
  }
</style>
