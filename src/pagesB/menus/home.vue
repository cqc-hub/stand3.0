<template>
  <view class="container">
    <image class="fullscreen-image" :src="$global.BASE_IMG + 'hk-home.jpg'" mode="aspectFit" @click="gotoHome"></image>
  </view>
</template>

<script lang="ts" setup>
import { onLoad,onShareTimeline } from "@dcloudio/uni-app";
import global from '@/config/global';
import { useGlobalStore } from '@/stores';

const globalStore = useGlobalStore();

onLoad(() => {
  // #ifdef MP-WEIXIN
  //分享到朋友圈
  onShareTimeline(() => {
    return {
      title: global.systemInfo.name,
    };
  });
  // #endif
});

const gotoHome = () => {
    globalStore.setShowFlag(true)
  uni.reLaunch({
    url: "/pages/home/home",
  });
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}
.fullscreen-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
</style>
