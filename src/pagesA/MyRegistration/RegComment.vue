<template>
  <view class="g-page">
    <scroll-view class="g-container" scroll-y>
      <view class="pt24">
        <view class="comment-card">
          <view class="mb40 f36 g-bold">您对就医服务满意吗？</view>
          <view class="mb40">
            <Reg-Comment-Rate v-model:value="r" />
          </view>

          <view>
            <g-select-flatten
              :selectLength="99"
              :list="aimList"
              v-model:value="aimValue"
              multiple
            />
          </view>

          <view class="comment-input mb32">
            <uni-easyinput
              type="textarea"
              v-model="b"
              autoHeight
              :maxlength="200"
              :inputBorder="false"
              :placeholderStyle="'color: var(--hr-neutral-color-5);font-size: var(--hr-font-size-base);'"
              placeholder="请输入您对医院的建议和意见"
              disabled
            />
          </view>

          <view class="comment-input height-href">
            <uni-easyinput
              type="textarea"
              v-model="b"
              :maxlength="200"
              :inputBorder="false"
              :placeholderStyle="'color: var(--hr-neutral-color-5);font-size: var(--hr-font-size-base);'"
              placeholder="请输入您的其他意见或建议"
              autoHeight
            />
          </view>
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

  const _aimList = [''];
  const aimList = ref([]);
  const aimValue = ref('');

  const a = ref(false);
  const r = ref(5);
  const b = ref('');
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

      .comment-input {
        background-color: var(--hr-neutral-color-1);
        padding: 12rpx 24rpx;
        padding-right: 0;
        border: 1px solid var(--hr-neutral-color-11);
        border-radius: 8px;

        :deep(.uni-easyinput__content.is-textarea) {
          background-color: var(--hr-neutral-color-1) !important;

          .uni-easyinput__content-textarea {
            background-color: transparent;
            font-size: var(--hr-font-size-base);
            color: var(--hr-neutral-color-9);
          }
        }

        &.height-href {
          :deep(.uni-easyinput__content.is-textarea) {
            .uni-easyinput__content-textarea {
              min-height: 85rpx;
              height: auto;
            }
          }
        }
      }
    }
  }
</style>
