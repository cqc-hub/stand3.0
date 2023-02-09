<template>
  <view class="">
    <view class="green-power">
      <image
        class="green-power-circle"
        mode="widthFix"
        :src="$global.BASE_IMG + 'shaox_circle_绿色能量@2x.png'"
      />

      <view>预约挂号预计得蚂蚁森林能量</view>
      <view class="power-util">227g</view>
      <image
        @click="isGreenModelShow = true"
        class="power-tip"
        mode="widthFix"
        :src="$global.BASE_IMG + 'shaox_tip.png'"
      />
    </view>

    <My-Popup v-model:value="isGreenModelShow">
      <view class="power-dialog">
        <view class="power-hos-bg">
          <image
            class="power-hos-img"
            mode="widthFix"
            :src="$global.BASE_IMG + 'shaox_hos_绿色能量@2x.png'"
          />
        </view>

        <view class="power-dialog-title">预约挂号、查报告得绿色能量</view>

        <view class="power-dialog-content">
          <view class="display-li">
            完成预约挂号，得绿色能量 277g/笔， 每月上限5笔
          </view>
          <view class="display-li">
            完成报告查询，得绿色能量 2g/笔， 每月上限10次
          </view>
          <view class="display-li">
            得到的绿色能量可以前往【蚂蚁森林】用来种树，改善我们的环境
          </view>
        </view>

        <view class="power-dialog-foot">
          <text @click="isGreenModelShow = false">知道了</text>
        </view>
      </view>
    </My-Popup>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import MyPopup from '@/components/uni-my-popup/uni-my-popup.vue'

  const isGreenModelShow = ref(false);
</script>

<style lang="scss" scoped>
  .green-power {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20upx 0;

    > view {
      color: #333333;
      font-size: var(--hr-font-size-xs);
    }

    .green-power-circle {
      width: 45upx;
      margin-right: 15upx;
      position: relative;
      top: -3upx;
    }

    .power-util {
      margin: 0 10upx;
      color: #0d8c00;
      text-shadow: 1upx 1upx 2upx;
    }

    .power-tip {
      width: 30upx;
      position: relative;
      top: -10upx;
    }
  }

  .power-dialog {
    width: calc(100vw - 100upx);
    min-height: 400upx;
    background-color: #ffffff;
    border-radius: 16px;
    position: relative;
    top: -100upx;

    .power-hos-bg {
      height: 200upx;
      width: calc(100%);
      position: relative;
      display: flex;
      justify-content: center;

      .power-hos-img {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        margin: 0 auto;
      }
    }

    .power-dialog-title {
      width: 100%;
      text-shadow: 1upx 1upx 2upx;
      color: #333333;
      font-size: var(--hr-font-size-xl);
      text-align: center;
    }

    .power-dialog-content {
      display: grid;
      width: calc(100% - 50upx * 2);
      padding: 20upx 50upx;

      .display-li {
        word-break: break-all;
        color: #666666;
        margin-bottom: 20upx;
        position: relative;

        &::before {
          content: '';
          display: flex;
          width: 10upx;
          height: 10upx;
          border-radius: 20upx;
          background-color: #666666;
          position: absolute;
          left: -30upx;
          top: 20upx;
        }
      }
    }

    .power-dialog-foot {
      display: grid;
      outline: 0.5upx solid #66666682;
      padding: 20upx 0;
      margin: 0 auto;
      justify-content: center;

      color: #1677ff;
      font-size: var(--hr-font-size-xl);
    }
  }
</style>
