<template>
  <view class="">
    <drag-button :edge="0" :zid="zid" @btnClick="backHome" isDock scrollY>
      <view class="out-btn f32 animate__animated animate__fadeIn">
        {{ text }}
      </view>
    </drag-button>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      text?: string;
      zid?: string;
      zurl?: string;
    }>(),
    {
      text: '返回首页',
      zid: 'backhome',
      zurl: '/pages/home/home',
    }
  );

  const backHome = () => {
    uni.reLaunch({
      url: props.zurl,
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
