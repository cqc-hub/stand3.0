<template>
  <view class="cache">
    <view class="cache-img-container">
      <image
        mode="aspectFit"
        class="cache-img"
        :src="BASE_IMG + 'img_h5bg@3x.png'"
      />
    </view>
    <view class="cache-fixbottom">浙江和仁科技股份有限公司@技术支持</view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

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
      useTBanner(btnParse,'navigateTo', gStores.globalStore.h5MenuExtraData);
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

  onLoad(async (opt) => {
    // const q = {
    //   type: '1',
    //   params:
    //     'Yn+CgX9eWg/4k+B61aXruyitCtvf7g4TV+/8D81ihLDYvmiwH78NMGxwQjEdke0asui4LjzbaBDnKbqPraVLHP7vya4r3P7rCSSWtEnL27EQtKbq0EhclF8uPF5TzPJEaI0AZRMh2L32RZAN7QWPeA==',
    // } as any;

    const queryParams = gStores.globalStore.appShowData?.query?.qrCode;

    // uni.showLoading({});
    // await wait(600);
    if ((queryParams && !Object.keys(opt).length) || opt?.q) {
      console.log('截止-----', queryParams);
      return;
    }

    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }

    console.log('获取到参数', pageProps.value);

    init();
  });
</script>


<style scoped lang="scss">
  .cache {
    width: 100%;
    height: 100vh;
    background-color: #fff;

    .cache-img-container {
      display: flex;
      justify-content: center;
      position: relative;
      top: 240upx;
    }
    .cache-fixbottom {
      position: absolute;
      bottom: 144upx;
      width: 100%;
      text-align: center;

      font-size: var(--hr-font-size-xxxs);
      font-weight: 400;
      color: #999;
    }
  }
</style>

