<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="grid-box"
  >
    <g-grid :list="list" :type="type" @gridClick="gridClick" />
  </view>
</template>

<script setup lang="ts">
  import { useCommonTo } from '@/common/checkJump';
  import { GStores } from '@/utils';

  const emits = defineEmits(['open-share']);

  interface IGridProps {
    list: IRoute[];
    type?: 1 | 2 | 3; //首页图标样式1 默认2 老人版本3
  }
  const props = defineProps<IGridProps>();
  const gStores = new GStores();

  const gridClick = (item) => {
    console.warn(item)
    if (item.path && item.path == 'showCareModel') {
      //关注组件拦截跳转 弹框
      emits('open-share', item.query && JSON.parse(item.query).imageCode);
    } else {
      useCommonTo(item);
    }
  };
</script>

<style lang="scss" scoped></style>
