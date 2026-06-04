<template>
  <view class="">
    <view
      class="flex-between mb24"
      v-if="globalGl.sConfig.isHideHomeSearch !== '1'"
    >
      <!-- 在有搜索框的前提下 是否开启助老版本 -->
      <view
        class="notice-button g-bold"
        v-if="gStores.globalStore.sysCode === '1001036'"
        @click="showQR1001036"
      >
        关注联勤集结号
      </view>
      <view class="w-full" @click.prevent="goSearch">
        <!-- :placeholder="viewerStore.homeSearchPlaceholder" -->
        <view class="my-disabled mr12">
          <uni-search-input
            :type="'2'"
            :inputBorder="!isHomeStyle1"
            :rounded="isHomeStyle1"
            :placeholder="viewerStore.homeSearchPlaceholder"
          />
        </view>
      </view>
      <view v-if="globalGl.sConfig.isLangUygur === '1'" class="ml16 mr12">
        <chooseLang />
      </view>

      <!-- #ifdef MP-WEIXIN -->
      <view
        v-if="globalGl.sConfig.isWxShowToggleEcZh === '1'"
        :style="{
          'border-radius': '100px',
          padding: '6px',
        }"
        @click="emits('wx-show-translate-tip')"
        class="mr12 flex items-center justify-center bg-white g-border"
      >
        <img
          :style="{
            width: '42rpx',
            height: '42rpx',
          }"
          :src="`${globalGl.BASE_IMG}stand3-home-en-zh-translate.png`"
        />
      </view>
      <!-- #endif -->

      <view
        v-if="globalGl.sConfig.isOpenHelpOld === '1'"
        class="bg-white flex items-center help-old pr24 pl8 pt6 pb6 g-border"
      >
        <image
          :src="
            globalGl.BASE_IMG +
            `stand3-home-help-old${
              gStores.globalStore.isTcmStyle ? '-tcm' : ''
            }.png`
          "
          mode="scaleToFill"
          class="img-help-old mr12 relative"
        />
        <view
          :style="{
            color: 'var(--other-1)',
          }"
          @click="openModeOld"
          class="text-no-wrap f32 font-semibold h-full"
        >
          长辈版
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { GStores, ServerStaticData, useTBanner } from '@/utils';
  import globalGl from '@/config/global';
  import { useViewerStore } from '@/stores/modules/viewer';
  import chooseLang from './chooseLang.vue';

  const gStores = new GStores();
  const viewerStore = useViewerStore();
  const emits = defineEmits(['open-mode-old', 'wx-show-translate-tip', 'open-share']);

  const isHomeStyle1 = computed(() => {
    return globalGl.sConfig.homeStyle === '1';
  });

  const showQR1001036 = () => {
    console.log(9999);
    emits(
      'open-share',
      {
        imageCode: 'dongzong_gzhCode.jpg',
        title: '欢迎关注',
        subTitle: '长按识别二维码，关注服务号',
        isHideInfo: true,
        theme: '公众号',
        name: '联勤集结号',
      },
      'showCareModel'
    );
  };

  const goSearch = async () => {
    const pageConfig = await ServerStaticData.getSystemConfig(
      'Electronic_Consultation_Sheet'
    );

    if (pageConfig?.intelMedicalAssistConfig?.isReplaceHomeSearch === '1') {
      uni.navigateTo({
        url: '/pagesA/intelMedicalAssist/intelMedicalAssist',
      });
      return;
    }
    let searchConfig = viewerStore.viewConfig[8]?.showFlag;
    if (searchConfig == 1) {
      uni.navigateTo({
        url: '/pagesA/MyRegistration/RegSearch',
      });
    } else {
      let url =
        (globalGl.env as string) === 'prod'
          ? 'https://h5.eheren.com/V3_h5/#/pagesA/diseaseCyclopedia/smartChatRoom'
          : 'https://health.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/smartChatRoom';
      uni.navigateTo({
        url: '/pagesC/cloudHospital/myPath?type=1&path=' + url,
      });
    }
  };

  const openModeOld = () => {
    emits('open-mode-old');
  };

  onLoad(async () => {});
</script>

<style lang="scss" scoped>
  .help-old {
    // border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 18px;
    backdrop-filter: blur(15px);

    .img-help-old {
      width: 52rpx;
      height: 52rpx;
      // top: -2rpx;
    }
  }
  .notice-button {
    background-color: var(--hr-brand-color-6);
    display: inline-block;
    line-height: 60rpx;
    border-radius: 32rpx;
    color: #fff;
    font-size: var(--hr-font-size-xs);
    width: 310rpx;
    position: relative;
    text-align: center;
    padding: 5rpx 10rpx 6rpx;
    margin-right: 10rpx;
  }
</style>
