<template>
  <view class="g-page">
    <view class="flex-normal header">
      <view
        :class="{
          'sel-active': false,
        }"
        class="flex-normal"
      >
        <view>111</view>
        <view class="iconfont">&#xe6e8;</view>
      </view>

      <view
        :class="{
          'sel-active': false,
        }"
        class="flex-normal"
      >
        <view>222</view>
        <view class="iconfont">&#xe6e8;</view>
      </view>
    </view>
    <view class="g-container">233</view>
  </view>
</template>

<script lang="ts" setup>
  import { GStores } from '@/utils';
  import { defineComponent, ref } from 'vue';

  const gStores = new GStores();
  const isSelPatient = ref(false);
  const isSelStatus = ref(false);

  const init = () => {};
</script>

<style lang="scss" scoped>
  .header {
    background-color: #fff;
    > view {
      flex: 1;
      justify-content: center;
      padding: 24rpx 0;
    }

    .sel-active {
      font-weight: 600;
      color: var(--hr-brand-color-6);
      .iconfont {
        transform: rotate(0.5turn);
      }
    }
  }
</style>
