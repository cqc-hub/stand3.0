<template>
  <view class="">
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { GStores } from '@/utils';
  import api from '@/service/api';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';

  const gStores = new GStores();
  const pageProps = ref(
    {} as {
      type: '1'; // 1 温fu2
      [key: string]: any;
    }
  );

  const addPatInit = async () => {
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

  const init = async () => {
    const { type } = pageProps.value;

    switch (type) {
      // 温附二+3.0基线】扫描院内纸质凭条二维码，快捷绑定就诊人
      case '1':
        addPatInit();
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

    if ((queryParams && !opt?.params) || opt?.q) {
      return;
    }

    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }

    init();
  });
</script>

<style lang="scss" scoped></style>
