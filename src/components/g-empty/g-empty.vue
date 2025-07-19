<template>
  <view
    :class="{
      ty: !noTransformY,
    }"
    class="page-state g-flex-rc-cc"
  >
    <image
      :src="$global.BASE_IMG + states[current - 1].icon"
      :style="{
        height: imgHeight,
      }"
      mode="heightFix"
    />
    <view class="pr32 pl32 alt f28 text-center">
      {{ text || states[current - 1].label }}
    </view>

    <view class="g-flex-rc-cc empty-content">
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { GStores } from '@/utils';
  import { computed, defineComponent, ref } from 'vue';

  const states = computed(() => [
    {
      icon: `img_404_no content@3x${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      label: '暂未查到相关信息',
    },
    {
      icon: `img_404_no record@3x${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      label: '暂未查到相关信息',
    },
    {
      icon: `img_404_network3x${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      label: '当前网络状态不佳',
    },
    {
      icon: `img_404_no  search3x${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      label: '未搜到相关内容',
    },
    {
      icon: `img_404_no evaluation3x${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      label: '还没有评论哦，赶快抢占沙发吧 ',
    },
    {
      icon: `img_404_shopping cart empty3x${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      label: '购物车竟然是空的',
    },
    {
      icon: `img_404_message3x${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      label: '暂时没有消息',
    },
    {
      icon: `img_404_add3x${gStores.globalStore.isTcmStyle ? '-tcm' : ''}.png`,
      label: '您还未添加地址',
    },
    {
      icon: `img_404_message23x${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      label: '暂时没有问诊消息',
    },
    {
      icon: `img_404_no follow3x${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      label: '还没有关注任何内容哦',
    },
    {
      icon: `img_404_message23x${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      label: '页面维护中...',
    },
  ]);

  const gStores = new GStores();

  withDefaults(
    defineProps<{
      current: number;
      text?: string;
      imgHeight?: string;
      noTransformY?: boolean;
    }>(),
    {
      imgHeight: '240rpx',
      current: 1,
    }
  );

  // const a:  = 233
</script>

<style lang="scss" scoped>
  .page-state {
    flex-direction: column;
    position: relative;
    animation-name: fadeIn;
    animation-fill-mode: both;
    animation-duration: 1s;

    &.ty {
      transform: translateY(-25%);
    }
    .alt {
      margin-top: 16rpx;
      color: #888;
    }
  }

  .empty-content {
    margin-top: 32rpx;
  }
</style>
