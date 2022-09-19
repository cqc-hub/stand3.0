<template>
  <view class="doc-info">
    <view class="doc-info-container">
      <image :src="item.docPhoto" class="doc-info-avatar" />

      <view class="doc-info-introduce">
        <view class="doc-info-introduce-header">
          <view class="doc-info-introduce-name">{{ item.docName }}</view>
          <view class="doc-info-introduce-title">{{ item.docTitleName }}</view>
        </view>

        <view class="doc-info-introduce-goodat text-ellipsis">
          {{ item.goodAt }}
        </view>
      </view>
    </view>

    <slot name="footer" :item="item" />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { IDocListAll } from '../../utils';

  const props = defineProps<{
    item: IDocListAll;
  }>();
</script>

<style lang="scss" scoped>
  .doc-info {
    background-color: #fff;
    border-radius: 16rpx;

    padding: 24rpx 32rpx;
    padding-top: 40rpx;

    font-size: var(--hr-font-size-xs);

    &-container {
      display: flex;
      margin-bottom: 24rpx;

      .doc-info-avatar {
        border-radius: 50%;
        border: 1rpx solid var(--hr-neutral-color-3);
        width: 96rpx;
        height: 96rpx;
        margin-right: 24rpx;
      }

      .doc-info-introduce {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .doc-info-introduce-header {
          display: flex;
          align-items: center;
          .doc-info-introduce-name {
            font-size: var(--hr-font-size-xl);
            font-weight: 600;
            color: var(--hr-neutral-color-10);
            margin-right: 4rpx;
          }

          .doc-info-introduce-title {
            color: var(--hr-neutral-color-7);
          }
        }

        .doc-info-introduce-goodat {
          color: var(--hr-neutral-color-9);
          font-weight: 400;
        }
      }
    }
  }
</style>
