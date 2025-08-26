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
      <button @click="testClick" class="btn1">233</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import api from '@/service/api';
  import { getShareTotalUrl, LoginUtils } from '@/utils';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import sm from 'miniprogram-sm-crypto';
  import { ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      color?: string;
    }>(),
    {
      color: 'var(--hr-brand-color-6)',
    }
  );

  onLoad(async () => {
    console.log('object');
  });

  const testClick = async (e) => {
    getShareTotalUrl(
      {
        k: '',
        h: '2025-08-25',
        e: '温附二鹿城院区(学院路)',
        b: '24762175',
        category: '50',
        i: '20250825019115',
        c: '',
        n: '13012',
        d: '20250825019115',
        l: '',
        f: '儿童急诊医学科',
        g: '叶楚远',
        type: '2',
        a: '',
      },
      '/pagesC/scan/scan'
    );
  };
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
