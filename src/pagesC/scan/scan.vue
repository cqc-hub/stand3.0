<template>
  <view class="">
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { GStores, useTBanner, wait } from '@/utils';
  import api from '@/service/api';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';

  const gStores = new GStores();
  const pageProps = ref(
    {} as {
      type: '1' | '2'; // 1 温fu2 2 温fu2
      [key: string]: any;
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
    });
  };

  const init = async () => {
    const { type } = pageProps.value;

    switch (type) {
      // 温附二+3.0基线】扫描院内纸质凭条二维码，快捷绑定就诊人
      case '1':
        initAddPat();
        break;

      // 温附二 满意度问卷
      case '2':
        initQuestion();
        break;

      default:
        break;
    }
  };

  onLoad(async (opt) => {
    // const q = {
    //   type: '1',
    //   params:
    //     'Yn+CgX9eWg/4k+B61aXruyitCtvf7g4TV+/8D81ihLDYvmiwH78NMGxwQjEdke0asui4LjzbaBDnKbqPraVLHP7vya4r3P7rCSSWtEnL27EQtKbq0EhclF8uPF5TzPJEaI0AZRMh2L32RZAN7QWPeA==',
    // } as any;

    const queryParams = gStores.globalStore.appLaunchData?.query?.qrCode;

    uni.showLoading({});
    await wait(600);
    if ((queryParams && !opt?.params) || opt?.q) {
      return;
    }

    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }

    console.log('获取到参数', pageProps.value);

    init();
  });
</script>

<style lang="scss" scoped></style>
