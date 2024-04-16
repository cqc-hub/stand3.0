<template>
  <view class="g-page">
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
    <view class="g-footer">
      <button class="btn1">233</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import sm from 'miniprogram-sm-crypto';

  const props = withDefaults(
    defineProps<{
      color?: string;
    }>(),
    {
      color: 'var(--hr-brand-color-6)',
    }
  );

  onLoad(async () => {
    const sm4 = sm.sm4;
    const msg = 'hello world! 我是 juneandgreen.'; // 可以为 utf8 串或字节数组
    const key = '0123456789abcdeffedcba9876543210'; // 可以为 16 进制串或字节数组，要求为 128 比特

    let encryptData = sm4.encrypt(msg, key); // 加密，默认输出 16 进制字符串，默认使用 pkcs#7 填充（传 pkcs#5 也会走 pkcs#7 填充）
    // let encryptData = sm4.encrypt(msg, key, { padding: 'none' }); // 加密，不使用 padding
    // let encryptData = sm4.encrypt(msg, key, {
    //   padding: 'none',
    //   output: 'array',
    // }); // 加密，不使用 padding，输出为字节数组
    // let encryptData = sm4.encrypt(msg, key, {
    //   mode: 'cbc',
    //   iv: 'fedcba98765432100123456789abcdef',
    // }); // 加密，cbc 模式

    console.log(encryptData);
    console.log(sm4.decrypt(encryptData, key));


  });
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

  .btn1 {
    all: unset;
  }
</style>
