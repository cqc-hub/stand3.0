<template>
  <view class="">
    <view v-if="config" class="animate__animated animate__fadeIn">
      <image @click="goSomeWhere" class="nav" :src="config.src" mode="widthFix" />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { type TBannerConfig, useTBanner } from '@/utils';
  import { joinQuery } from '@/common';

  const props = defineProps<{
    config?: TBannerConfig;
  }>();

  const goSomeWhere = () => {
    useTBanner(props.config!);
  };
</script>

<style lang="scss" scoped>
  .nav {
    width: 100%;
    // height: 128upx;
    background: #fff;
  }
</style>
