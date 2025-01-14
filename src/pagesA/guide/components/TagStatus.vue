<template>
  <view
    :style="{
      '--circle-color': color,
    }"
    class="container-circle f26"
  >
    <view class="half-circle" />
    <view
      :style="{
        color: textColor || color,
      }"
      class="g-bold tip relative"
    >
      <view class="tip-inner text-no-wrap">{{ text }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      color?: string;
      textColor?: string;
      text: string;
    }>(),
    {
      color: 'var(--hr-brand-color-6)',
    }
  );
</script>

<style lang="scss" scoped>
  .container-circle {
    // $circleOutSize: 84rpx;
    $circleOutSize: 3.2em;
    $circleInSize: $circleOutSize * 0.7;
    border-radius: 50%;
    width: $circleOutSize;
    height: $circleOutSize;
    align-items: center;
    justify-content: center;
    position: relative;
    display: flex;
    transform: rotate(-20deg);
    border: var(--circle-color) solid 3rpx;
    opacity: 0.5;
    .half-circle {
      border: var(--circle-color) dotted 3rpx;
      position: absolute;
      width: $circleInSize;
      border-radius: 50%;
      height: $circleInSize;
      top: 50%;
      border-left-color: transparent;
      border-right-color: transparent;
      transform: translateY(-50%);
    }

    .tip,
    .tip-inner {
      &::before,
      &::after {
        content: '';
        position: absolute;
        display: block;
        top: 0;
        height: 1.5em;
        width: 0.5em;
        background-color: #fff;
      }

      &::before {
        left: -0.2em;
        transform: translateX(-50%);
      }

      &::after {
        right: -0.2em;
        transform: translateX(50%);
      }
    }

    .tip-inner {
      &::before,
      &::after {
        background-color: var(--circle-color);
        width: 8rpx;
        height: 8rpx;
        top: 0.6em;
        z-index: 1;
        border-radius: 20px;
      }
      &::before {
        left: -0.4em;
      }

      &::after {
        right: -0.4em;
      }
    }
  }
</style>
