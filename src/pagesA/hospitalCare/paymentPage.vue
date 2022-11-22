<template>
  <view class="box">
    <view>
      <view class="title">预缴费用</view>
      <view class="buttons">
        <view class="button">¥500</view>
        <view class="button">¥1000</view>
      </view>
      <view class="buttons">
        <view class="button">¥500</view>
        <view class="button">¥1000</view>
      </view>
      <view class="buttons">
        <view class="button">¥500</view>
        <view class="button">¥1000</view>
      </view>
      <view class="pay-input">
        <text>¥</text>
        <input class="uni-input" type="number" placeholder="输入自定义金额" />
      </view>
      <view class="submitBtn">确定</view>
    </view>
  </view>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.box {
  background-color: #fff;
  // width: 100%;
  height: 100%;
  padding: 40rpx 32rpx 0;
  .title {
    color: #444;
    margin-bottom: 40rpx;
  }
  .buttons {
    display: flex;
    margin-bottom: 16rpx;
    :first-child {
      margin-right: 18rpx;
    }
    .button {
      width: 48%;
      height: 112rpx;
      border: 1px solid #e9f0ff;
      background-color: #e9f0ff;
      color: #444;
      font-weight: 600;
      border-radius: 16rpx;
      text-align: center;
      line-height: 112rpx;
    }
  }
  .pay-input {
    display: flex;
    align-items: center;
    height: 144rpx;
    background-color: #f6f6f6;
    border-radius: 16rpx;
    text {
      padding: 0 32rpx;
      font-weight: 600;
    }
  }
  .submitBtn {
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #9ebeff;
    color: #fff;
    text-align: center;
    line-height: 96rpx;
    margin-top: 120rpx;
    font-size: 36rpx;
  }
}
</style>