<template>
  <view class="">
    <view v-if="config && config.src" class="animate__animated animate__fadeIn">
      <image
        v-if="config.src"
        @click="goSomeWhere"
        class="nav"
        :src="config.src"
        mode="widthFix"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { type TBannerConfig, useTBanner } from '@/utils';

  const props = defineProps<{
    config?: TBannerConfig;
    disabled?: boolean;
  }>();

  const emits = defineEmits(['click']);

  const goSomeWhere = () => {
    emits('click');
    if (!props.disabled) {
      useTBanner(props.config!);
    }
  };
</script>

<style lang="scss" scoped>
  .nav {
    width: 100%;
    // height: 128upx;
    background: #fff;
  }
</style>
