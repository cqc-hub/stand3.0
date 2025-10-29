<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
  >
    <view class="medical-page">
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
        }"
      >
        <view class="module-title">
          <view class="title g-bold" v-if="item?.text">{{ item.text }}</view>
          <view class="sub-title f28 mt24" v-if="item?.subTitle">
            {{ item.subTitle }}
          </view>
        </view>
        <view class="external-icon ml24">
          <image
            src="https://phs-dev.oss-cn-hangzhou.aliyuncs.com/pcloud/jxfy/ico_jt%402x.png"
            mode="widthFix"
            class="icon-img"
          />
        </view>
      </view>

      <view class="triage-guide" v-if="tabJumpConfig?.showFlag">
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
        }
      >
    >[]
  );

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
     pageConfig.value = await ServerStaticData.getSystemConfig('RestOfConfig');
    console.log('pageConfig',pageConfig);
    
    if (pageConfig.value?.tabJumpConfig?.length) {
      if (pageProps.value?.entryType) {
        tabJumpConfig.value = pageConfig.value?.tabJumpConfig.find(
          (item) => item.entryType === pageProps.value.entryType
        );
      } else {
        tabJumpConfig.value = pageConfig.value?.tabJumpConfig[0];
      }
      options.value = tabJumpConfig.value?.tabs || [];
    }
  });

  onReady(() => {
    tabJumpConfig.value?.title &&
      uni.setNavigationBarTitle({
        title: tabJumpConfig.value?.title,
      });
  });

  onShow(() => {
    if (!isFirstIn) {
      uni.navigateBack({
        delta: 1,
      });
    }
    isFirstIn = false;
  });
</script>

<style lang="scss" scoped>
  .medical-page {
    padding: 20rpx;
    box-sizing: border-box;

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
</style>
