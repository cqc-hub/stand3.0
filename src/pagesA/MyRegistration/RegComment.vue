<template>
  <view class="g-page">
    <scroll-view class="g-container" scroll-y>
      <view class="pt24">
        <view class="comment-card">
          <Reg-Comment-Rate v-model:value="r" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import RegCommentRate from './components/RegComment/RegCommentRate.vue';

  /**
   *
   * [1-5]-order-comment-sel.png
   * [1-5]-order-comment-unsel.png
   */

  const a = ref(false);
  const r = ref(0);
</script>

<style lang="scss" scoped>

  .g-page {
    background-color: var(--hr-neutral-color-1);

    .g-container {
      width: calc(100% - 64rpx);
      padding-left: 32rpx;
    }

    .comment-card {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.04);
      padding: 32rpx;
    }
  }
</style>
