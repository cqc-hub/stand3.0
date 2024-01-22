<template>
  <view class="g-page">
    <g-choose-pat @choose-pat="choosePat" />

    <view class="g-container">233</view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { GStores } from '@/utils';

  import api from '@/service/api';

  const gStores = new GStores();

  const choosePat = async () => {
    init();
  };

  const init = async () => {};

  onLoad(() => {
    init();
  });
</script>

<style lang="scss" scoped></style>
