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
  import { onMounted, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { GStores, TBannerConfig, useTBanner, wait } from '@/utils';
  import api from '@/service/api';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';
  import { BASE_IMG } from '@/config/global';

  const gStores = new GStores();
  const pageProps = ref(
    {} as {
      /**
       * - 1 温附二+3.0基线】扫描院内纸质凭条二维码，快捷绑定就诊人
       * - 2 温附二 满意度问卷
       * - 3 温附二 化验排队
       */
      type: '1' | '2' | '3';
      [key: string]: any;
      // TBannerConfig
      btn?: string;
    }
  );

  const initAddPat = async () => {
    const { params } = pageProps.value;
    const {
      result: { patientName, patientPhone },
    } = await api.analyzePatInfoInHos({
      patData: params,
      source: gStores.globalStore.browser.source,
    });
    await wait(400);

    if (patientName && patientPhone) {
      const pat = gStores.userStore.patList.find(
        (p) => p.patientName === patientName
      );

      if (!pat) {
        uni.reLaunch({
          url: joinQueryForUrl('/pagesA/medicalCardMan/perfectReal', {
            patientPhone,
            patientName,
          }),
        });

        return;
      }
    }

    uni.reLaunch({
      url: `/pages/home/home`,
    });
  };

  const initQuestion = async () => {
    const {
      category, //  50 门诊  55 住院
      a: patientName,
      b: cardNumber,
      c: patientPhone,
      d: visitNo,
      e: hosName,
      f: deptName,
      g: docName,
      h: visitDate,
      i: inHospitalNo,
      j: source = gStores.globalStore.browser.source,
      k: outTime,
      l: hospitalWard,
      n: hosId,
    } = pageProps.value;

    useTBanner({
      type: 'h5',
      isLocal: '1',
      isSelfH5: '1',
      path: 'pagesC/question/questionAfterVisit1',
      extraData: {
        category,
        patientName,
        cardNumber,
        hospitalWard,
        deptName,
        docName,
        visitDate,
        visitNo,
        outTime,
        hosId,
        source,
        inHospitalNo,
        patientPhone,
        hosName,
      },
      addition: {
        patientId: 'patientId',
      },
    });
  };

  // 化验排队 https://h5.eheren.com/scan/1001067/scan?type=3&windowId=233
  const initTakeNumber = async () => {
    const { windowId } = pageProps.value;

    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/queueNumber/queueNumber',
      text: '化验排队',
      extraData: {
        windowId,
        type: '3',
      },
      addition: {
        herenId: 'herenId',
        patientId: 'aaa',
        token: 'token',
      },
      isLocal: '1',
    });
  };

  const init = async () => {
    const { type, btn } = pageProps.value;

    if (btn) {
      const btnParse = JSON.parse(btn) as TBannerConfig;
      useTBanner(btnParse, 'navigateTo', gStores.globalStore.h5MenuExtraData);
      return;
    }

    switch (type) {
      case '1':
        initAddPat();
        break;

      case '2':
        initQuestion();
        break;

      case '3':
        initTakeNumber();
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
    await wait(200);
    uni.hideLoading();
    init();
  });
</script>
