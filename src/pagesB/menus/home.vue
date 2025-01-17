<template>
  <view class="container">
  <view class="count" v-if="count >0">
  <text>{{count}}</text>
      秒后自动进入...</view>
    <image class="fullscreen-image" :src="$global.BASE_IMG + 'hk-home.jpg'" mode="aspectFit" @click="gotoHome"></image>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onShareTimeline } from "@dcloudio/uni-app";
import global from "@/config/global";
import { useGlobalStore } from "@/stores";
import { onMounted, onUnmounted, ref } from "vue";

const globalStore = useGlobalStore();
const count = ref(5);

let timer: null | number = null;

const countDown = () => {
  timer = setTimeout(() => {
    if (count.value > 1) {
      count.value--;
      countDown();
    }else{
      gotoHome()
    }
  }, 1000);
};

const gotoHome = () => {
  globalStore.setShowFlag(true);
  uni.reLaunch({
    url: "/pages/home/home",
  });
};

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
onMounted(() => {
  countDown();
});

onUnmounted(() => {
  // 清除计时器
  if (timer !== null) clearTimeout(timer)
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}
.count{
  width: 100%;
  margin: 0 auto;
  position: absolute;
  top: 75vh;
  z-index: 11;
  color: #111;
  font-size: 35rpx;
  line-height: 88rpx;
    display: flex;
    justify-content: center;
  text{
    color: #A71812;
    font-size: 44rpx;
    font-weight: bold;
    margin-right: 6rpx;
  }
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
