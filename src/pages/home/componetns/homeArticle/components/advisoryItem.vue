<template>
  <view @click="itemClick" class="mb24">
    <view v-if="isVideoTab && item.isVideo">
      <view class="g-break-word g-bold pb12">{{ item.title }}</view>

      <view
        v-if="item.titleImg && item.isVideo"
        class="video-img-container my-disabled"
      >
        <video
          :controls="false"
          :poster="item.titleImg"
          :duration="item.isVideo * 1"
          class="video-img pt12 pb12"
        />
      </view>

      <view class="info-description">
        <text class="mr12 pr12 g-split-line">{{ item.source }}</text>
        <text>{{ getTimeFormatter }}</text>
      </view>
    </view>

    <view v-else>
      <view class="advisoryItem">
        <view class="info">
          <view class="label">{{ item.title }}</view>
          <view class="info-description">
            <text class="mr12 pr12 g-split-line">
              {{ item.source || '官方' }}
            </text>
            <text>{{ getTimeFormatter }}</text>
          </view>
        </view>

        <view class="img-box" v-if="item.titleImg">
          <image :src="item.titleImg" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType, computed } from 'vue';
  import { ICms } from '../types';
  import dayjs from 'dayjs';

  export default defineComponent({
    props: {
      item: {
        type: Object as PropType<ICms>,
        default: () => ({} as ICms),
      },

      isVideoTab: {
        type: Boolean,
      },
    },

    emits: ['item-click'],

    setup(props, ctx) {
      const formatterTimer = (time: string) => {
        const timeLocal = new Date(time.replaceAll('-', '/')).toString();

        return dayjs(timeLocal).format('YYYY-MM-DD');
      };

      const getTimeFormatter = computed(() => {
        const time = props.item.createTime;
        if (time) {
          return formatterTimer(props.item.createTime);
        } else {
          return '';
        }
      });

      const itemClick = () => {
        ctx.emit('item-click', props.item);
      };

      return {
        getTimeFormatter,
        itemClick,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .advisoryItem {
    display: flex;
    padding: 32rpx 0;

    border-bottom: 1rpx solid #e6e6e6;

    .img-box {
      width: 192rpx;
      height: 120rpx;

      image {
        border-radius: 16rpx;
        width: 100%;
        height: 100%;
      }
    }
  }

  .info {
    flex: 1;
    padding-right: 40rpx;

    .label {
      font-weight: 600;
      font-size: var(--hr-font-size-xl);
      margin-bottom: 16rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .info-description {
    color: #888888;
    font-size: var(--hr-font-size-xxs);
    text {
      margin-right: 12rpx;
    }
  }

  .video-img-container {
    position: relative;

    .video-img {
      width: 100%;
      border-radius: 8rpx;
    }
  }
</style>
