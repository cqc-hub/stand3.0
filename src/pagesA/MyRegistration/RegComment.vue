<template>
  <view class="g-page">
    <scroll-view class="g-container" scroll-y>
      <view class="pt24">
        <view class="comment-card">
          <Reg-Comment-Rate />
        </view>
      </view>
    </scroll-view>

    <!-- <image
      :class="{
        'sel-no': !a,
      }"
      :src="$global.BASE_IMG + '1-order-comment-sel.png'"
      class="sel"
    />
    <image
      @click="a = !a"
      :src="$global.BASE_IMG + '1-order-comment-sel.png'"
      :class="{
        'sel-no': a,
      }"
    /> -->
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
</script>

<style lang="scss" scoped>
  .sel-no {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  }

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
