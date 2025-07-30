<template>
  <!--  #ifdef MP-WEIXIN -->
  <view
    class="navbar-row"
    :style="{
      height: `${navLocationInfo?.height}px`,
      paddingTop: `${navLocationInfo?.top}px`,
    }"
  >
    <view class="back-icon" v-if="props?.showBack" @click="goBack">
      <image
        :src="globalGl.BASE_IMG + 'back-icon.png'"
        class="w-full"
        :style="{
          width: `${navLocationInfo.height}px`,
          height: `${navLocationInfo.height}px`,
        }"
      />
    </view>
    <slot/>
    <!-- <view class="tilte"> -->
      <view class="text f32">
        {{ props.title || '' }}
      </view>
    <!-- </view> -->
  </view>
  <!--  #endif -->
</template>
<script setup lang="ts">
  import { ref, onBeforeMount, withDefaults } from 'vue';
  import globalGl from '@/config/global';
  const props = withDefaults(
    defineProps<{
      title?: string;
      showBack: boolean;
    }>(),
    {
      showBack: true,
    }
  );
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
    position: relative;
    width: 100vw;
    align-items: center;
    .back-icon {
      image {
        padding-top: 2px;
      }
    }
    // .tilte {
    //   width: 100vw;
    //   position: relative;

      .text {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0px);
        font-weight: 600;
      }
    // }
  }
</style>
