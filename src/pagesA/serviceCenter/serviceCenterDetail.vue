<template>
  <view class="page">
    <g-message />
    <view class="page-title g-border-bottom">
      {{ pageInfo.title }}
    </view>

    <!-- <view v-if="pageInfo.createTime" class="info-description">
      <text>{{ pageInfo.source }}</text>
      <text class="info-time">{{ pageInfo.createTime }}</text>
      <text>阅读3次</text>
    </view> -->

    <view class="page-content">
      <rich-text :nodes="HTMLParser(pageInfo.content)" />
      <!-- <view v-html="pageInfo.content" /> -->
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import HTMLParser from '@/common/html-parser';
  import api from '@/service/api';

  interface IInfo {
    title: string;
    content: string;
    createTime: string;
    source: string;
  }

  const props = defineProps<{
    id: string;
  }>();

  const pageInfo = ref({} as IInfo);

  const init = async () => {
    const titleId = props.id;

    if (titleId) {
      const { result } = await api.getCmsInfo({
        titleId,
      });

      pageInfo.value = result;
    } else {
      uni.showToast({
        title: '请携带咨询 id 访问',
        icon: 'none',
      });
    }
  };

  init();
</script>

<style lang="scss" scoped>
  .page {
    width: calc(100% - 64rpx);
    height: calc(100% - 80rpx);
    overflow-y: scroll;
    background-color: #fff;

    padding: 40rpx 32rpx;

    .page-title {
      font-weight: 600;
      color: #111111;
      font-size: var(--hr-font-size-xxl);
      padding-bottom: 24rpx;
      margin-bottom: 40rpx;
    }

    .info-description {
      color: #888888;
      font-size: var(--hr-font-size-xxs);

      padding: 16rpx 0 40rpx 0;
      text {
        margin-right: 12rpx;
      }
      .info-time {
        padding: 0 12rpx;
        border: 1rpx solid #e6e6e6;
        border-width: 0 1rpx;
      }
    }

    .page-content {
      font-size: var(--hr-font-size-base);
      font-weight: 400;
      color: #444444;
    }
  }
</style>
