<template>
  <view class="doc-info">
    <view class="doc-info-container">
      <image
        :src="item.docPhoto || '/static/image/order/order-doctor-avatar.png'"
        @click="avatarClick"
        class="doc-info-avatar"
        mode="aspectFill"
      />

      <view @click="avatarClick" class="doc-info-introduce">
        <view class="doc-info-introduce-header">
          <view class="doc-info-introduce-name f36 text-no-wrap">
            {{ item.docName }}
          </view>
          <view
            v-if="item.docTitleName"
            class="doc-info-introduce-title flex-normal"
          >
            <view
              :class="{
                'g-split-line': item.docJobName,
              }"
              class="mr12 pr12 text-no-wrap"
            >
              {{ item.docTitleName }}
            </view>
            <view v-if="item.docJobName" class="text-ellipsis">
              {{ item.docJobName }}
            </view>
          </view>
        </view>

        <view v-if="appointmentDate" class="flex-normal color-444 f24">
          <view>服务完成时间:</view>
          <view>{{ appointmentDate }}</view>
        </view>
      </view>
    </view>

    <slot name="footer" :item="item" />
  </view>
</template>

<script lang="ts" setup>
  import { IDocListAll } from '../../utils';

  const props = defineProps<{
    item: IDocListAll;
    appointmentDate?: string;
  }>();

  const emits = defineEmits(['avatar-click']);

  const avatarClick = () => {
    emits('avatar-click', props.item);
  };

  const splitSpecialDeptName = (name: string) => name.split(',');
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
  }
</style>
