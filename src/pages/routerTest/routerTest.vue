<template>
  <view class="">
    <view
      :style="{
        '--circle-color': color,
      }"
      class="container-circle"
    >
      <view class="half-circle"></view>
      <view>待完成</view>
    </view>

    <view class="loader-container">
      <view class="circle circle_outer"></view>
      <view class="circle circle_inner"></view>
      <view class="circle circle_logo-color-switch"></view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      color?: string;
    }>(),

    {
      color: 'red',
    }
  );
</script>

<style lang="scss" scoped>
  .container-circle {
    $circleOutSize: 120rpx;
    $circleInSize: $circleOutSize * 0.7;
    border-radius: 50%;
    width: $circleOutSize;
    height: $circleOutSize;
    align-items: center;
    justify-self: center;
    position: relative;
    display: flex;

    border: var(--circle-color) solid 6rpx;
    .half-circle {
      border: var(--circle-color) solid 6rpx;
      position: absolute;
      width: $circleInSize;
      border-radius: 50%;
      height: $circleInSize;
      top: 0;
      right: 0;
      border-left-color: transparent;
      border-right-color: transparent;
    }
  }

  .loader-container {
    height: 30vh;
    width: 30vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .circle {
    position: absolute;
    box-sizing: border-box;
    border-color: rgb(195 210 231 / 40%);
    border-style: solid;
    border-radius: 50%;
  }

  .circle_outer {
    height: 100%;
    width: 100%;
    border-width: 10px;
    border-top-color: transparent;
    border-bottom-color: transparent;
    transform: rotate(-45deg);
    border-radius: 100%;
  }

  .circle_inner {
    width: 60%;
    height: 60%;
    border-width: 2px;
    border-top-color: transparent;
    transform: rotate(70deg);
  }

  /* TODO change to svg to get more accurate circle part size */
  .circle_logo-color-switch {
    width: calc(60% - 30px);
    height: calc(60% - 30px);
    border-width: 10px;
    border-color: transparent;
    /* TODO extract color vars */
    border-top-color: #f0673e;
  }

  .logo {
    position: relative;
    width: calc(60% - 70px);
    height: calc(60% - 70px);
  }

  .logo-part_top-static {
    fill: #5d6977;
    /* When logo-part_top rotates, static part is visible on the background.
  Here is crunch to shrink static part. */
    transform: scale(0.99);
    transform-origin: 50% 5%;
  }

  .logo-part_top {
    fill: #f0673e;
    /* Center of svg */
    transform-origin: center;
  }

  .logo-part_bottom {
    fill: #5d6977;
  }
</style>
