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

    <canvas
      canvas-id="myCanvas"
      id="myCanvas"
      style="
        width: 300px;
        height: 200px;
        background: #f5f5f5;
        border: 1px solid #ccc;
      "
      :width="canvasWidth"
      :height="canvasHeight"
    />
    <view style="margin-top: 20px">Canvas 调试区域</view>
  </view>
</template>

<script lang="ts" setup>
  import api from '@/service/api';
  import { getShareTotalUrl, LoginUtils } from '@/utils';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import sm from 'miniprogram-sm-crypto';
  import { getCurrentInstance, onMounted, ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      color?: string;
    }>(),
    {
      color: 'var(--hr-brand-color-6)',
    }
  );
  const inst = getCurrentInstance();
  const { createCanvasContext, getSystemInfo, getImageInfo } = uni;
  const canvasWidth = ref(300);
  const canvasHeight = ref(200);
  const dpr = ref(1);

  onLoad(async () => {
    console.log('object');
  });

  const testClick = async (e) => {
    getShareTotalUrl(
      {
        e: '温附二(瓯江口院区)',
        l: '',
        h: '2025-08-26',
        d: '20250826017084',
        type: '2',
        k: '',
        c: '18858832891',
        f: '内科门诊',
        b: '30340263',
        a: '王小平',
        i: '20250826017084',
        category: '50',
        g: '侯翰凇',
        n: '13011',
      },
      '/pagesC/scan/scan'
    );
  };

  // 绘制文字和图片
  const drawContent = (ctx, displayWidth, displayHeight) => {
    // 1. 绘制文字（旧模式用 setFillStyle 而非 fillStyle =）
    ctx.setFillStyle('#888888');
    ctx.setFontSize(16);
    // 坐标需 ÷ dpr（因为已 scale(dpr, dpr)，实际会 × dpr 还原）
    ctx.fillText('旧模式文字', 20 / dpr.value, 40 / dpr.value);
    ctx.save();
    ctx.draw();
  };
  onMounted(async () => {
    const is2DSupported = uni.canIUse('createCanvasContext.type.2d');
    console.log('2D 模式是否支持：', is2DSupported);
    // 1. 获取设备像素比
    // @ts-expect-error
    const { devicePixelRatio } = await getSystemInfo();
    dpr.value = devicePixelRatio || 2;

    // 2. 计算实际像素尺寸（显示尺寸 × dpr）
    const displayWidth = 300;
    const displayHeight = 200;
    canvasWidth.value = displayWidth * dpr.value;
    canvasHeight.value = displayHeight * dpr.value;

    // 3. 获取 2D 上下文（Vue 3 中无需传递 this）
    const canvasContext = createCanvasContext('myCanvas', inst);
    if (!canvasContext) {
      console.error('获取 2D 上下文失败');
      return;
    }

    // 4. 缩放上下文（避免模糊）
    canvasContext.scale(dpr.value, dpr.value);

    // 5. 绘制内容
    drawContent(canvasContext, displayWidth, displayHeight);
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
