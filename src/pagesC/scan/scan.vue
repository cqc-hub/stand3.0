<template>
  <view class="g-page bg-white">
    <g-message />

    <view class="g-container flex justify-center pt70">
      <image
        mode="aspectFit"
        class="cache-img pt70"
        :src="BASE_IMG + 'img_h5bg@3x.png'"
      />
    </view>
    <view class="color-888 f24 text-center pb70">
      浙江和仁科技股份有限公司@技术支持
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import {
    getLocation,
    GStores,
    TBannerConfig,
    useTBanner,
    wait,
  } from '@/utils';
  import api from '@/service/api';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';
  import { BASE_IMG } from '@/config/global';
  import { useScan } from './utils';

  const gStores = new GStores();
  const {
    pageProps,
    healthAdvisoryDetail,
    healthAdvisory,
    goMedicalAssistant,
    goMedicationQuery,
    goReport,
    goInvoice,
    goQuestion,
    initInvoice,
    initDrugDetail35,
    initTakeNumber,
    initQuestion,
    initAddPat,
    tjyy1001067
  } = useScan();

  const init = async () => {
    const { type, btn, _type, params } = pageProps.value;
    const _props = {
      ...pageProps.value,
      type: undefined,
    };

    if (btn) {
      const btnParse = JSON.parse(btn) as TBannerConfig;
      useTBanner(btnParse, 'navigateTo', gStores.globalStore.h5MenuExtraData);
      return;
    }

    if (_type === 'useTBanner') {
      console.log(pageProps.value, '---------');
      if (pageProps.value.addition) {
        pageProps.value.addition = JSON.parse(pageProps.value.addition);
      }
      if (pageProps.value.extraData) {
        pageProps.value.extraData = JSON.parse(pageProps.value.extraData);
      }
      useTBanner(
        pageProps.value as unknown as TBannerConfig,
        'navigateTo',
        gStores.globalStore.h5MenuExtraData
      );
      return;
    }

    switch (type) {
      // 温附二+3.0基线】扫描院内纸质凭条二维码，快捷绑定就诊人
      case '1':
        initAddPat();
        break;

      case '_1':
        tjyy1001067();
        break;

      // 2 温附二 满意度问卷
      case '2':
        initQuestion();
        break;

      // 3 温附二 化验排队
      case '3':
        initTakeNumber();
        break;

      // 江苏省中 用药详情
      case '4':
        initDrugDetail35();
        break;

      // 5 中电子发票
      case '5':
        initInvoice();
        break;

      // 满意度评价
      case '6':
        goQuestion();
        break;

      // 电子发票
      case '7':
        goInvoice();
        break;

      // 报告查询
      case '8':
        goReport();
        break;

      // 用药提醒
      case '9':
        goMedicationQuery();
        break;

      // 电子导诊单
      case '10':
        goMedicalAssistant();
        break;

      case '11':
        healthAdvisory();
        break;

      case '12':
        healthAdvisoryDetail();
        break;

      default:
        break;
    }
  };

  let isContinue = true;
  onLoad(async (opt) => {
    const queryParams = gStores.globalStore.appShowData?.query?.qrCode;
    if ((queryParams && !Object.keys(opt).length) || opt?.q) {
      console.log('截止-----', queryParams);
      isContinue = false;
      return;
    }

    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }

    console.log('获取到参数', pageProps.value);
  });

  onMounted(async () => {
    uni.showLoading({});

    if (!isContinue) {
      return;
    }
    await wait(600);
    uni.hideLoading();
    init();
  });
</script>
