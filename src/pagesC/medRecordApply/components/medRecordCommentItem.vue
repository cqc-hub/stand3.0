<template>
  <view class="comment-item f32">
    <view class="flex f26">
      <text class="mr24">{{ item.createName }}</text>
      <text class="color-888">{{ item.createTime }}</text>
    </view>

    <view
      class="mt8 g-break-word color-444 f32"
      :class="{
        'ellipsis-line-clamp3': ellipsis,
      }"
    >
      {{ item.docMessage }}
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  const props = defineProps<{
    item: any;
    systemModeOld?: boolean;
    ellipsis?: boolean;
  }>();
</script>

<style lang="scss" scoped>
  .comment-item {
    padding: 36rpx 0;

    background-color: #fff;

    .tag {
      margin-top: 20rpx;
      flex-wrap: wrap;
      .tag-item {
        border-radius: 8rpx;
        background-color: var(--hr-neutral-color-1);
        margin-right: 8rpx;
        padding: 4rpx 16rpx;
      }
    }
  }
</style>
