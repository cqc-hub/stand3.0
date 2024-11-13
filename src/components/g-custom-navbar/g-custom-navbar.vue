<template>
  <!--  #ifdef MP-WEIXIN -->
  <view
    class="navbar-row"
    :style="{
      height: `${navLocationInfo?.height}px`,
      paddingTop: `${navLocationInfo?.top}px`,
    }"
  >
    <view class="back-icon" @click="goBack">
      <image
        :src="globalGl.BASE_IMG + 'back-icon.png'"
        class="w-full"
        :style="{
          width: `${navLocationInfo.height}px`,
          height: `${navLocationInfo.height}px`,
        }"
      />
    </view>
    <view class="tilte">
      <view
        class="text f32"
        :style="{
          left: `${navLocationInfo.titleLeft}px;`,
        }"
      >
        {{ props.title || '默认标题' }}
      </view>
    </view>
  </view>
  <!--  #endif -->
</template>
<script setup lang="ts">
  import { ref, onBeforeMount } from 'vue';
  import globalGl from '@/config/global';
  const props = defineProps<{
    title?: string;
  }>();
  const navLocationInfo = ref({
    top: 51,
    height: 32,
    bottom: 83,
    titleLeft: 175,
  });
  const goBack = () => {
    const curPagesList = getCurrentPages();
    if (curPagesList && curPagesList.length > 1) {
      uni.navigateBack();
    } else {
      uni.reLaunch({ url: '/pages/home/home' });
    }
  };
  onBeforeMount(() => {
    // #ifdef MP-WEIXIN
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    uni.getSystemInfo({
      success: function (window) {
        navLocationInfo.value = {
          top: menuButtonInfo[0]?.top || 51,
          height: menuButtonInfo[0]?.height || 32,
          bottom: menuButtonInfo[0]?.bottom || 83,
          titleLeft: window.screenWidth / 2 - (menuButtonInfo[0]?.height || 32),
        };
      },
    });
    // #endif
  });
</script>
<style lang="scss" scoped>
  .navbar-row {
    z-index: 999;
    background-color: #ffffff00;
    display: flex;
    .back-icon {
      image {
        padding-top: 2px;
      }
    }
    .tilte {
      display: flex;
      // flex: 1 1 auto;
      align-items: center;
      justify-content: center;

      .text {
        position: relative;
        transform: translate(-50%, 0px);
        font-weight: 600;
      }
    }
  }
</style>
