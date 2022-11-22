<template>
  <view class="page-state g-flex-rc-cc">
    <image
      :src="$global.BASE_IMG + states[current - 1].icon"
      :style="{
        height: imgHeight,
      }"
      mode="heightFix"
    />
    <view class="alt">{{ text || states[current - 1].label }}</view>

    <view class="g-flex-rc-cc empty-content">
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  const states = [
    {
      icon: 'img_404_no content@3x.png',
      label: '暂未查到相关信息',
    },
    {
      icon: 'img_404_no record@3x.png',
      label: '您没有相关的订单',
    },
    {
      icon: 'img_404_network@3x.png',
      label: '当前网络状态不佳',
    },
    {
      icon: 'img_404_no  search@3x.png',
      label: '未搜到相关内容',
    },
    {
      icon: 'img_404_no evaluation@3x.png',
      label: '还没有评论哦，赶快抢占沙发吧 ',
    },
    {
      icon: 'img_404_shopping cart empty@3x.png',
      label: '购物车竟然是空的',
    },
    {
      icon: 'img_404_message@3x.png',
      label: '暂时没有消息',
    },
    {
      icon: 'img_404_add@3x.png',
      label: '您还未添加地址',
    },
    {
      icon: 'img_404_message2@3x.png',
      label: '暂时没有问诊消息',
    },
    {
      icon: 'img_404_no follow@3x.png',
      label: '还没有关注任何内容哦',
    },
    {
      icon: 'img_404_message2@3x.png',
      label: '页面维护中...',
    },
  ] as const;

  withDefaults(
    defineProps<{
      current: typeof states.length;
      text?: string;
      imgHeight?: string;
    }>(),
    {
      imgHeight: '240rpx',
    }
  );

  // const a:  = 233
</script>

<style lang="scss" scoped>
  .page-state {
    flex-direction: column;
    height: 100%;

    position: relative;
    transform: translateY(-25%);
    .alt {
      margin-top: 16rpx;
      color: #888;
      font-size: 28rpx;
    }
  }

  .empty-content {
    margin-top: 32rpx;
  }
</style>
