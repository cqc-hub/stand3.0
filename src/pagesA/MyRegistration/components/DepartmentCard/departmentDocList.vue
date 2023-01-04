<template>
  <view class="">
    <view v-for="(item, i) in list" :key="i" class="doc-info g-border">
      <view class="doc-info-container">
        <image
          :src="item.docPhoto || '/static/image/order/order-doctor-avatar.png'"
          class="doc-info-avatar"
          mode="aspectFill"
        />

        <view class="doc-info-introduce">
          <view class="doc-info-introduce-header">
            <view class="doc-info-introduce-name f36 text-no-wrap">
              {{ item.docName }}
            </view>
          </view>

          <view class="doc-info-introduce-goodat text-ellipsis">
            <text>
              {{ item.docTitleName }}
            </text>
          </view>
        </view>
      </view>

      <view>
        <view
          v-if="item.intro"
          class=" doc-intro text-ellipsis ellipsis-line-clamp2"
        >
          <image
            :src="$global.BASE_IMG + 'department-doc-intro-text.png'"
            mode="widthFix"
            class="logo-intro-text"
          />

          <text class="color-888 f28">
            {{ item.intro }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { TDepartmentDocItem } from '../../utils/DepartmentCard';

  const props = defineProps<{
    list: TDepartmentDocItem[];
  }>();
</script>

<style lang="scss" scoped>
  .doc-info {
    background-color: #fff;
    border-radius: 16rpx;

    padding: 24rpx 32rpx;
    padding-top: 40rpx;

    font-size: var(--hr-font-size-xs);

    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.04);
    margin-bottom: 16rpx;

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
        // justify-content: space-between;

        .doc-info-introduce-header {
          display: flex;
          align-items: center;
          .doc-info-introduce-name {
            font-weight: 600;
            color: var(--hr-neutral-color-10);
            margin-right: 8rpx;
          }

          .doc-info-introduce-title {
            color: var(--hr-neutral-color-7);
          }
        }

        .doc-info-introduce-goodat {
          color: var(--hr-neutral-color-9);
          font-weight: 400;

          .doc-job-name {
            margin-right: 26rpx;
            position: relative;

            &::after {
              content: '';
              display: inline-block;
              background-color: var(--hr-neutral-color-2);
              width: 1rpx;
              height: 30rpx;
              position: absolute;
              right: -14rpx;
              top: 5rpx;
            }
          }
        }
      }
    }

    .logo-intro-text {
      width: 60rpx;
      margin-right: 12rpx;
      margin-top: 7rpx;
    }

    .doc-intro {
      align-items: flex-start;
    }
  }
</style>
