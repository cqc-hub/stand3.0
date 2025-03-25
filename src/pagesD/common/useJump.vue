<template>
  <view class=""></view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad, onShow } from '@dcloudio/uni-app';

  let isFirstIn = true;
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
