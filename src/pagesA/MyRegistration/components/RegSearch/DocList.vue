<template>
  <view class="">
    <block v-if="list.length">
      <view v-for="item in list" :key="item.hosDocId" class="doc-info">
        <view class="doc-info-container">
          <image
            :src="
              item.docPhoto || '/static/image/order/order-doctor-avatar.png'
            "
            @click="avatarClick(item)"
            class="doc-info-avatar"
            mode="aspectFill"
          />

          <view @click="avatarClick(item)" class="doc-info-introduce">
            <view class="doc-info-introduce-header">
              <view class="doc-info-introduce-name f36">
                {{ item.docName }}
              </view>
              <view
                v-if="item.docTitleName"
                class="doc-info-introduce-title mr12"
              >
                {{ item.docTitleName }}
              </view>

              <view v-if="item.docJobName" class="doc-info-introduce-title">
                {{ item.docJobName }}
              </view>
            </view>

            <view class="doc-info-introduce-goodat text-ellipsis">
              <text v-if="item.deptName">
                {{ item.deptName }}
              </text>
            </view>
          </view>
        </view>

        <view @click="avatarClick(item)" class="flex">
          <text class="icon-font ico_major good_at_icon mr12" />
          <view class="flex-1">
            <rich-text
              v-if="item.goodAt"
              class="color-888 f28 text-ellipsis ellipsis-line-clamp2"
              :nodes="HTMLParser(throughCharacterLineFeed(item.goodAt, '\n'))"
            />
          </view>
        </view>
      </view>
    </block>

    <view class="empty-list" v-else>
      <g-empty :current="1" />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { IDocResItem } from '../../utils/RegSearch';
  import HTMLParser from '@/common/html-parser';
  import { throughCharacterLineFeed } from '@/utils';

  defineProps<{
    list: IDocResItem[];
  }>();

  const emits = defineEmits(['item-click']);

  const avatarClick = (item: IDocResItem) => {
    emits('item-click', item);
  };
</script>

<style lang="scss" scoped>
  .doc-info {
    background-color: #fff;
    border-radius: 16rpx;

    padding: 24rpx 32rpx;
    padding-top: 40rpx;
    margin-bottom: 16rpx;

    font-size: var(--hr-font-size-xs);

    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.05);

    &:first-child {
      margin-top: 24rpx;
    }

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

  .good_at_icon {
    width: 60rpx;
    height: 24rpx;
    position: relative;
    top: 4rpx;
    flex-basis: 60rpx;
  }
</style>
