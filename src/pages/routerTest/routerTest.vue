<template>
  <view class="">
    <view
      :style="{
        '--circle-color': color,
      }"
      class="container-circle"
    >
      <view class="half-circle"></view>
      <view
        :style="{
          color: color,
        }"
        class="g-bold"
      >
        待完成
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      color?: string;
    }>(),
    {
      color: 'var(--hr-brand-color-6)',
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
    justify-content: center;
    position: relative;
    display: flex;
    transform: rotate(-20deg);

    border: var(--circle-color) solid 6rpx;
    opacity: 0.5;
    .half-circle {
      border: var(--circle-color) solid 6rpx;
      position: absolute;
      width: $circleInSize;
      border-radius: 50%;
      height: $circleInSize;
      top: 50%;
      border-left-color: transparent;
      border-right-color: transparent;

      transform: translateY(-50%);
    }
  }
</style>
