<template>
  <view class="g-page">
    <view class="g-container">
      <view class="head-bg" />
      <view class="container">23</view>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import {
    usePayPage,
    usePayDetailPage,
    type TPayDetailProp,
  } from './utils/clinicPayDetail';
  import { deQueryForUrl } from '@/common';

  const props = ref({} as TPayDetailProp);

  const { getDetailData, detailData } = usePayDetailPage();

  onLoad((opt) => {
    props.value = deQueryForUrl(opt);
    // getDetailData(props.value);
  });
</script>

<style lang="scss" scoped>
  .head-bg {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;

    &::after {
      content: '';
      display: block;
      height: 400rpx;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      background: linear-gradient(
        0deg,
        rgba(41, 111, 255, 0) 1%,
        #296fff 38%,
        #296fff 96%
      );
    }
  }

  .container {
    position: relative;
    z-index: 2;
    padding: 0 32rpx;
  }
</style>
