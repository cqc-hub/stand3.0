<template>
  <!--  #ifdef MP-WEIXIN -->
  <view
    class="navbar-row"
    :style="{
      paddingTop: `${navLocationInfo.top}px`,
      height: `${navLocationInfo.height}px`,
    }"
  >
    <view class="back-icon">
        {{ `<` }}
    </view>
    <view class="tilte">
      <!-- {{ props.title || '默认标题' }} -->
      <text>默认标题</text>
    </view>
  </view>
  <!--  #endif -->
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  const navLocationInfo = ref({
    top: 51,
    height: 32,
    bottom: 83,
  });
  onMounted(() => {
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    navLocationInfo.value = {
      top: menuButtonInfo[0].top,
      height: menuButtonInfo[0].height,
      bottom: menuButtonInfo[0].bottom,
    };
    console.log(menuButtonInfo);
  });
  //   const props = defineProps<{
  //     title: string;
  //   }>();
</script>
<style lang="scss" scoped>
  .navbar-row {
    z-index: 999;
    background-color: #fff;
  }
</style>
