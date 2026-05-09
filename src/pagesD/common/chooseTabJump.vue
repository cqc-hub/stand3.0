<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
  >
    <view class="medical-page">
      <view v-if="imageOptions">
        <view
          class="top-image"
          v-if="imageOptions?.topImages"
          @click="useTBanner(imageOptions?.topImages)"
          :style="{
            backgroundImage: `url('${
              imageOptions?.topImages?.bgSrc ||
              'https://phsdevoss.eheren.com/pcloud/phs3.0/xianyang_pic1.png'
            }')`,
          }"
        ></view>
        <view
          class="middle-image"
          v-if="
            imageOptions?.middleImages &&
            imageOptions?.middleImages?.length >= 3
          "
        >
          <view
            class="left-image"
            @click="useTBanner(imageOptions?.middleImages[0])"
            :style="{
              backgroundImage: `url('${
                imageOptions?.middleImages[0]?.bgSrc ||
                'https://phsdevoss.eheren.com/pcloud/phs3.0/xianyang_pic2.png'
              }')`,
            }"
          ></view>
          <view class="right-image">
            <view
              class="right-image-item"
              @click="useTBanner(imageOptions?.middleImages[1])"
              :style="{
                backgroundImage: `url('${
                  imageOptions?.middleImages[1]?.bgSrc ||
                  'https://phsdevoss.eheren.com/pcloud/phs3.0/xianyang_pic3.png'
                }')`,
              }"
            ></view>
            <view
              class="right-image-item"
              @click="useTBanner(imageOptions?.middleImages[2])"
              :style="{
                backgroundImage: `url('${
                  imageOptions?.middleImages[2]?.bgSrc ||
                  'https://phsdevoss.eheren.com/pcloud/phs3.0/xianyang_pic4.png'
                }')`,
              }"
            ></view>
          </view>
        </view>
        <view
          class="bottom-image"
          v-if="imageOptions?.bottomImages"
          @click="useTBanner(imageOptions?.bottomImages)"
          :style="{
            backgroundImage: `url('${
              imageOptions?.bottomImages?.bgSrc ||
              'https://phsdevoss.eheren.com/pcloud/phs3.0/xianyang_pic5.png'
            }')`,
          }"
        ></view>
      </view>
      <view
        class="module home-doctor mb12"
        @click="useTBanner(item)"
        v-for="(item, index) in options"
        :key="`jump-${index}`"
        :style="{
          backgroundImage: `url('${
            item.bgSrc ||
            'https://phs-dev.oss-cn-hangzhou.aliyuncs.com/pcloud/jxfy/bg_zndz%402x.png'
          }')`,
          height: `${item?.height || '245'}rpx`,
        }"
      >
        <view class="module-title">
          <view class="title g-bold" v-if="item?.text">{{ item.text }}</view>
          <view class="sub-title f28 mt24" v-if="item?.subTitle">
            {{ item.subTitle }}
          </view>
        </view>
        <view class="external-icon ml24" v-if="item?.text || item?.subTitle">
          <image
            src="https://phs-dev.oss-cn-hangzhou.aliyuncs.com/pcloud/jxfy/ico_jt%402x.png"
            mode="widthFix"
            class="icon-img"
          />
        </view>
      </view>

      <view class="triage-guide mt48" v-if="tabJumpConfig?.showFlag">
        <g-flag :typeFg="tabJumpConfig?.showFlag" isShowFgTip aaa />
      </view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import {
    GStores,
    type ISystemConfig,
    type TButtonConfig,
    ServerStaticData,
    useTBanner,
  } from '@/utils';
  import { deQueryForUrl, joinQueryForUrl } from '@/common/utils';
  import { onLoad, onShow, onReady } from '@dcloudio/uni-app';

  let isFirstIn = true;
  const pageProps = ref(<{ entryType?: string }>{});
  const gStores = new GStores();
  const pageConfig = ref(<ISystemConfig['RestOfConfig']>{});
  const tabJumpConfig = ref(<any>{});
  const options = ref(
    <
      Array<
        TButtonConfig & {
          bgSrc?: string;
          subTitle?: string;
          height?: string;
        }
      >
    >[]
  );
  const imageOptions = ref(
    <
      {
        topImages?: TButtonConfig & {
          bgSrc?: string;
        };
        middleImages?: Array<
          TButtonConfig & {
            bgSrc?: string;
          }
        >;
        bottomImages?: TButtonConfig & {
          bgSrc?: string;
        };
      }
    >{}
  );
  const imageHeight = ref(300);

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    pageConfig.value = await ServerStaticData.getSystemConfig('RestOfConfig');
    console.log('pageConfig', pageConfig);

    if (pageConfig.value?.tabJumpConfig?.length) {
      if (pageProps.value?.entryType) {
        tabJumpConfig.value = pageConfig.value?.tabJumpConfig.find(
          (item) => item.entryType === pageProps.value.entryType
        );
      } else {
        tabJumpConfig.value = pageConfig.value?.tabJumpConfig[0];
      }
      options.value = tabJumpConfig.value?.tabs || [];
      imageOptions.value = tabJumpConfig.value?.imageOptions || [];
    }
  });

  onReady(() => {
    tabJumpConfig.value?.title &&
      uni.setNavigationBarTitle({
        title: tabJumpConfig.value?.title,
      });
  });
</script>

<style lang="scss" scoped>
  .medical-page {
    padding: 20rpx;
    box-sizing: border-box;
    width: 100vw;

    .module {
      display: flex;
      align-items: center;
      justify-content: ‌space-around‌;
      height: 245rpx;
      padding: 0 30rpx;
      color: #fff;

      &.home-doctor {
        // background: linear-gradient(90deg, #409EFF, #66B1FF);
        // width: 100%;
        // height: 100%;
        background-image: url('https://phs-dev.oss-cn-hangzhou.aliyuncs.com/pcloud/jxfy/bg_zndz%402x.png');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
      }

      &.intelligent-diagnosis {
        background: url('https://phs-dev.oss-cn-hangzhou.aliyuncs.com/pcloud/jxfy/bg_ta.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      .module-title {
        font-size: 36rpx;
        // font-weight: bold;
      }

      .external-icon {
        .icon-img {
          width: 36rpx;
          height: auto; // 高度自适应
          top: 6rpx;
          left: 15rpx;
          position: relative;
        }
      }
    }

    .triage-guide {
      margin-top: 30rpx;

      .guide-title {
        font-size: 32rpx;
        display: block;
        margin-bottom: 16rpx;
      }

      .guide-detail {
        display: flex;
        margin-bottom: 16rpx;
        font-size: 28rpx;
        line-height: 44rpx;
      }
    }
  }
  .top-image {
    height: 280rpx;
    width: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('https://phsdevoss.eheren.com/pcloud/phs3.0/xianyang_pic1.png');
  }
  .middle-image {
    display: flex;
    margin-top: 20rpx;
    width: 100%;
    height: 340rpx;
    .left-image {
      flex: 1;
      background-image: url('https://phsdevoss.eheren.com/pcloud/phs3.0/xianyang_pic2.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }

    .right-image {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
      // width: 400rpx;

      .right-image-item {
        height: 165rpx;
        background-size: 100% 100%;
        background-repeat: no-repeat;

        &:first-child {
          background-image: url('https://phsdevoss.eheren.com/pcloud/phs3.0/xianyang_pic3.png');
          margin-bottom: 10rpx;
        }

        &:last-child {
          background-image: url('https://phsdevoss.eheren.com/pcloud/phs3.0/xianyang_pic4.png');
        }
      }
    }
  }
  .bottom-image {
    margin-top: 20rpx;
    width: 100%;
    height: 160rpx;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('https://phsdevoss.eheren.com/pcloud/phs3.0/xianyang_pic5.png');
  }
</style>
