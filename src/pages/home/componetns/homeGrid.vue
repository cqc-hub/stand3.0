<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="grid-box"
  >
    <g-grid :list="list" :type="type" @gridClick="gridClick" />
  </view>
</template>

<script setup lang="ts">
  import {
    useCommonTo,
    openServicesChat,
    isSubscribeWx,
  } from '@/common/checkJump';
  import globalGl from '@/config/global';
  import { GStores } from '@/utils';

  const emits = defineEmits(['open-share']);

  interface IGridProps {
    list: IRoute[];
    type?: 1 | 2 | 3; //首页图标样式1 默认2 老人版本3
  }
  const props = defineProps<IGridProps>();
  const gStores = new GStores();

  const gridClick = async (item) => {
    console.warn(item);
    // 新增功能页面弹出关注弹窗 attention 为1  和showCareModel不可同时配置
    if (gStores.globalStore.ev === 'wx') {
      if (
        item.query &&
        JSON.parse(item.query).attention === '1' &&
        globalGl.h5AppId &&
        !(await isSubscribeWx())
      ) {
        emits('open-share', item, 'attention');
        return;
      }
    }
    if (item.path && item.path == 'showCareModel') {
      //关注组件拦截跳转 弹框
      emits('open-share', item.query && JSON.parse(item.query));
    } else if (item.path == 'openWxService') {
      openServicesChat(item.query);
    } else {
      useCommonTo(item);
    }
  };
</script>

<style lang="scss" scoped></style>
