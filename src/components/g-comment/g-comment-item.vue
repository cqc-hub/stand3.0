<template>
  <view class="comment-item">
    <view class="flex-between">
      <uni-rate :value="4" :size="14" readonly />

      <view class="f26 flex-normal">
        <text class="mr24">胡**</text>
        <text class="color-888">2021.05.21</text>
      </view>
    </view>

    <view class="mt8 g-break-word color-444 f32">
      医生回复速度很快，很耐心的解答了问题，给出了专业建议，谢谢医生！
    </view>

    <view class="flex-normal tag">
      <view
        v-for="(tag, idx) in tags"
        :key="tag.value"
        :class="{
          mb8: idx !== tags.length - 1,
        }"
        class="tag-item color-666 f24 mb8"
      >
        {{ tag.label }}
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  const tags = ref<IOptions[]>([
    {
      label: '医生亲切',
      value: '医生亲切',
    },
    {
      label: '认真负责',
      value: '认真负责',
    },
    {
      label: '医术高明',
      value: '医术高明',
    },
    {
      label: '有耐心',
      value: '有耐心',
    },
    {
      label: '专业',
      value: '专业',
    },
  ]);
</script>

<style lang="scss" scoped>
  .comment-item {
    padding: 36rpx 0;

    box-shadow: 0 -1rpx 0 0 #e6e6e6 inset;

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
