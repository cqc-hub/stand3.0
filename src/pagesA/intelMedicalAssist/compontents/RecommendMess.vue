<template>
  <view
    v-for="(item, index) in messFormData"
    :key="`${index}-mess`"
    class="guess-server float-from-top Second-Recommend newMessage-card pb24"
  >
    <view class="item">
      <!-- <view class="info-time">
        {{ item.createTime }}
      </view> -->
      <view class="info-box" @click="goToLink(item)" :class="'unactive'">
        <view class="title">{{ item.title }}</view>
        <view class="description">
          {{ item.first }}
        </view>
        <view class="info-main" v-if="item.data">
          <template
            v-for="(infoItem, InfoI) in Object.entries(item.data)"
            :key="`${InfoI}`"
          >
            <view class="info-item">
              <view class="info-item-left">{{ infoItem[0] }}</view>
              <view
                class="info-item-right"
                :class="{ notAll: infoItem[0] !== '推送备注' || showAll }"
              >
                {{ infoItem[1] }}
              </view>
              <view
                v-if="infoItem[0] === '推送备注' && showAll"
                @click.stop="showAll = !showAll"
                class="doc-show-intro f26"
              >
                <text class="iconfont">&#xe66b;</text>
              </view>
            </view>
          </template>
        </view>
        <view class="goto-detail" v-if="item.redirectUrl">
          <view class="goto-detail-text">查看详情</view>
          <view class="goto-detail-avatr">
            <text class="iconfont">&#xe66b;</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { nextTick, ref, onMounted } from 'vue';
  import { messFormData } from '../utils/utils';
  import { joinQueryForUrl } from '@/common';
  import { useTBanner } from '@/utils';
  const showAll = ref(true);
  const goToLink = (item) => {
    // #ifdef H5
    if (item.appId && item.self) {
      item.redirectUrl = item.redirectUrl.replace(/^\//, '');
    } else {
      if (!item.redirectUrl.startsWith('/')) {
        item.redirectUrl = '/' + item.redirectUrl; // 添加前导斜杠
      }
    }
    // #endif

    // #ifndef H5
    if (!item.redirectUrl.startsWith('/')) {
      item.redirectUrl = '/' + item.redirectUrl; // 添加前导斜杠
    }
    // #endif
    if (item.appId && item.self) {
      useTBanner({
        type: 'self',
        path: item.redirectUrl.replace(/^\//, ''),
      });
    } else if (item.appId) {
      // #ifndef H5
      useTBanner({
        type: 'otherProgram',
        path: item.redirectUrl,
        appId: item.appId,
      });
      // #endif

      // #ifdef H5
      useTBanner({
        type: 'self',
        path: joinQueryForUrl('pagesC/openMiniProgram/openMiniProgram', {
          appId: item.appId,
          path: item.redirectUrl,
        }),
      });
      // #endif
    } else {
      // #ifndef H5
      useTBanner({
        type: 'h5',
        path: item.redirectUrl,
      });
      // #endif

      // #ifdef H5
      useTBanner({
        type: 'self',
        path: joinQueryForUrl('pagesC/h5Url/thirdUrl', {
          query: {
            myType: 'https',
            url: item.redirectUrl,
          },
        }),
      });
      // #endif
    }
  };
</script>

<style lang="scss" scoped>
  .newMessage-card {
    .noData {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .item {
      margin: 18rpx 32rpx;
    }

    .dianpian {
      height: 40rpx;
      width: 100%;
    }

    .info-time {
      text-align: center;
      color: #999;
      font-size: 28rpx;
      font-weight: 400;
      margin-bottom: 28rpx;
    }

    .active {
      border: 2rpx solid var(--hr-brand-color-6);
    }

    .unactive {
      border: 0.5px solid #e6e6e6;
    }

    .info-box {
      left: 5vw;
      width: 80vw;
      background: linear-gradient(180deg, #f2faff 3%, #ffffff);
      border: 0.0625rem solid #ffffff;
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);

      padding: 3vw 5vw;

      .title {
        font-size: 32rpx;
        font-weight: 600;
        text-align: left;
        color: #111;
      }

      .description {
        line-height: 45rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 28rpx;
        margin-top: 16rpx;
      }
    }

    .info-item {
      display: flex;
      flex-direction: row;

      .info-item-left {
        flex: 0 0 180rpx;
        line-height: 64rpx;
        color: #888;
        font-weight: 400;
        font-size: 28rpx;
      }

      .info-item-right {
        flex: 1 1 auto;
        line-height: 64rpx;
        color: #111;
        font-weight: 400;
        font-size: 28rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 8; /* 显示3行 */
        overflow: hidden;
        // text-overflow: ellipsis;
      }
      .notAll {
        -webkit-line-clamp: 1 !important; /* 显示3行 */
      }
    }

    .goto-detail {
      margin: 24rpx 0 0 0;
      padding: 24rpx 0 12rpx 0;
      border-top: 2rpx solid #f3f3f3;
      display: flex;
      justify-content: space-between;
      font-weight: 400;
      font-size: 30rpx;
      color: #111111;
      .goto-detail-text {
      }
      .goto-detail-avatr {
        font-size: 34rpx;
      }
    }
  }
  .doc-show-intro {
    right: 32rpx;
    bottom: 0;
    z-index: 2;
    display: flex;
    padding-left: 1.5em;
    align-items: center;
    justify-content: flex-end;
    background: linear-gradient(
      270deg,
      #fbfdff 40%,
      #fbfeff 0,
      rgba(255, 255, 255, 0.3) 100%
    );
  }
</style>
