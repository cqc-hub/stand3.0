<template>
  <view class="g-page">
    <view class="g-container">
      <view class="head-bg" />

      <view class="container">
        <view class="g-border box page-first-item">
          <view class="g-bold f36 g-break-word">门诊医生支付订单</view>

          <view class="flex-normal f28 mt24">
            <text class="mr16 color-888">支付给</text>
            <text class="color-444">湖州市中心医院</text>
          </view>
        </view>

        <view class="g-border box mt16 f32">
          <view
            v-for="(item, idx) in details"
            :key="item.key"
            :class="{
              mb32: idx !== details.length - 1,
            }"
            class="row flex-between mb32"
          >
            <view class="label">{{ item.label }}</view>
            <view
              :class="{
                'color-error': item.key === 'a3',
              }"
              class="value g-bold"
            >
              1621.97元
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="g-footer">
      <view class="flex1 flex-normal count-money">
        <text class="color-444 f28 mr8">合计</text>
        <text class="f36 g-bold color-error">{{ '233' }}元</text>
      </view>

      <button class="btn g-border btn-warning pay-btn">缴费</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  const details = ref([
    {
      label: '订单总额',
      key: 'a',
    },
    {
      label: '医保支付',
      key: 'a1',
    },
    {
      label: '院内账户支付',
      key: 'a2',
    },
    {
      label: '自费支付',
      key: 'a3',
    },
  ]);
</script>

<style lang="scss" scoped>
  .head-bg {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;

    &::after {
      content: '';
      display: block;
      height: 400rpx;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      background: linear-gradient(
        0deg,
        rgba(41, 111, 255, 0) 1%,
        #296fff 38%,
        #296fff 96%
      );
    }
  }

  .container {
    position: relative;
    z-index: 2;
    padding: 0 32rpx;

    .box {
      background: #ffffff;
      border-radius: 8px;
      padding: 32rpx;
    }
  }

  .page-first-item {
    margin-top: 48rpx;
  }

  .count-money {
    margin-right: 24rpx;
  }

  .pay-btn {
    flex: .8;
  }
</style>
