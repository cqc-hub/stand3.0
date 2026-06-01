<template>
  <view class="container-scroll fade-in">
    <view
      v-for="(item, index) in list"
      :key="`RecommendArticle${index}`"
      @click="itemClick(item)"
      class="mb24 recommend-article-item"
    >
      <view v-if="item.isVideo">
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
          <text class="mr12 pr12 g-split-line">
            {{ item.source || '官方' }}
          </text>
          <text>{{ getTimeFormatter(item) }}</text>
        </view>
      </view>

      <view v-else>
        <view class="advisoryItem">
          <view class="info">
            <view class="label">{{ item.title }}</view>
            <view class="desc" v-if="item.desc">{{ item.desc }}</view>
            <view class="info-description">
              <text v-if="item.source" class="mr12 pr12 g-split-line">
                {{ item.source }}
              </text>
              <text v-if="item.createTime">{{ getTimeFormatter(item) }}</text>
            </view>
          </view>

          <view class="img-box" v-if="item.titleImg">
            <image :src="item.titleImg" lazy-load />
          </view>
          <!-- <view class="link-icon">
            <text>›</text>
          </view> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType, computed } from 'vue';
  import { type TButtonConfig, useTBanner } from '@/utils';
  import dayjs from 'dayjs';

  export default defineComponent({
    props: {
      list: {
        type: Array as PropType<any[]>,
        default: () => [],
      },
    },

    emits: ['item-click'],

    setup(props, ctx) {
      const formatterTimer = (time: string) => {
        const timeLocal = new Date(time.replaceAll('-', '/')).toString();

        return dayjs(timeLocal).format('YYYY-MM-DD');
      };

      const getTimeFormatter = (item) => {
        if (!item) {
          return '';
        }

        const time = item.createTime;
        if (time) {
          return formatterTimer(item.createTime);
        }

        return '';
      };

      const itemClick = (item) => {
        // ctx.emit('item-click', item);
        // console.log('item', item);
        useTBanner(item.action);
      };

      return {
        getTimeFormatter,
        itemClick,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .recommend-article-item {
    background: #ffffff;
    padding: 24rpx 24rpx 20rpx;
    border-radius: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  }

  .advisoryItem {
    display: flex;
    padding: 0;
    align-items: flex-start;
    gap: 20rpx;
    border-bottom: none;
  }

  .img-box {
    width: 180rpx;
    height: 120rpx;
    flex-shrink: 0;

    image {
      border-radius: 16rpx;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .info {
    flex: 1;
    padding-right: 20rpx;

    .label {
      font-weight: 600;
      font-size: var(--hr-font-size-xl);
      margin-bottom: 12rpx;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .desc {
      color: #666666;
      font-size: var(--hr-font-size-sm);
      line-height: 1.6;
      margin-bottom: 12rpx;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .info-description {
    color: #888888;
    font-size: var(--hr-font-size-xxs);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10rpx;

    text {
      margin-right: 12rpx;
    }
  }

  .link-icon {
    width: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c8c8c8;
    font-size: var(--hr-font-size-xl);
  }

  .video-img-container {
    position: relative;

    .video-img {
      width: 100%;
      border-radius: 8rpx;
    }
  }
</style>
