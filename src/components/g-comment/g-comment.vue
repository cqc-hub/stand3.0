<template>
  <view class="g-comment">
    <view class="header flex-between">
      <view class="flex-normal">
        <text class="g-bold f36">患者评价</text>
        <text class="f28">(178)</text>
      </view>

      <view>
        <text class="f28 color-888">查看全部</text>
        <text class="iconfont color-888">&#xe66b;</text>
      </view>
    </view>

    <view>
      <Comment-Item />
      <Comment-Item />
      <Comment-Item />
      <Comment-Item />
      <Comment-Item />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import CommentItem from './g-comment-item.vue';
</script>

<style lang="scss" scoped>
  .g-comment {
    .header {
      align-items: center;
      padding: 16rpx 0;
    }
  }
</style>
