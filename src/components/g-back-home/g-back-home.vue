<template>
  <view class="">
    <drag-button :edge="0" @btnClick="backHome" isDock scrollY zid="backhome">
      <view class="out-btn f32 animate__animated animate__fadeIn">
        {{ text }}
      </view>
    </drag-button>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  withDefaults(
    defineProps<{
      text?: string;
    }>(),
    {
      text: '返回首页',
    }
  );

  const backHome = () => {
    uni.reLaunch({
      url: '/pages/home/home',
    });
  };
</script>

<style lang="scss" scoped>
  .out-btn {
    border-radius: 32upx 0px 0px 32upx;
    text-align: center;
    padding: 12rpx 24rpx;
    white-space: nowrap;

    background: linear-gradient(0deg, #296fff, #30afff);
    border-radius: 100px 0px 0px 100px;
    opacity: 0.9;
    color: #fff;
  }
</style>
