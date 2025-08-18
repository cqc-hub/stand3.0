<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
  >
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { GStores } from '@/utils';

  let isFirstIn = true;

  const gStores = new GStores();

  onLoad(async () => {});

  onShow(() => {
    if (!isFirstIn) {
      uni.navigateBack({
        delta: 1,
      });
    }
    isFirstIn = false;
  });
</script>

<style lang="scss" scoped></style>
