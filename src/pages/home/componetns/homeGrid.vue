<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="grid-box"
  >
    <g-grid :list="list" :type="type" @gridClick="useCommonTo" />
  </view>
</template>

<script setup lang="ts">
  import { useCommonTo } from '@/common/checkJump';

  import { GStores } from '@/utils';

  interface IGridProps {
    list: IRoute[];
    type?: 1 | 2 | 3; //首页图标样式1 默认2 老人版本3
  }
  const props = defineProps<IGridProps>();
  const gStores = new GStores();
</script>

<style lang="scss" scoped>
  .grid-box {
    &.system-mode-old {
      transform: translateX(15rpx);
    }
  }
</style>
