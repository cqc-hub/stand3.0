<template>
  <view class="">
    <!-- @vue-expect-error -->
    <web-view v-if="src" :src="src" @message="getMessage"></web-view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
  import { useCommonTo } from '@/common/checkJump';
  import { handWebMessage, thirdWxPay, GStores, useTBanner } from '@/utils';
  import { deQueryForUrl } from '@/common';
  import { CanWrite } from '@/typeUtils';

  const gStores = new GStores();

  // pagesA/webView/webView
  const props = defineProps<{
    https: string;
    _type?: string; // 1 表示h5携带登录相关信息跳转过去
    query?: any;
  }>();
  const pageProps = ref({} as CanWrite<typeof props>);
  const src = ref('');

  const getMessage = (evt) => {
    console.warn('返回数据', evt);
    handWebMessage(evt);
    var data = evt.target.data;
    var V3PageData = data[0];
    if (V3PageData.type == 'hosLoaction') {
      //打开地图
      uni.openLocation({
        latitude: Number(V3PageData.gisLat),
        longitude: Number(V3PageData.gisLng),
        name: V3PageData.hosName,
        address: V3PageData.address,
      });
    } else if (V3PageData.type == 'backAndToPath') {
      useCommonTo(V3PageData.pageData);
    } else if (V3PageData.appId) {
      thirdWxPay(V3PageData);
    }
  };

  const init = () => {
    if (pageProps.value.https) {
      console.warn(decodeURIComponent(pageProps.value.https));

      src.value = decodeURIComponent(pageProps.value.https);
    }
    if (pageProps.value._type === '3') {
      let query =
        (pageProps.value.query && JSON.parse(pageProps.value.query)) || {};
      useTBanner(
        {
          type: 'h5',
          path: query?.path,
          addition: {
            TOKEN: 'token',
            PATIENTID: 'patientId',
            HERENID: 'herenId',
          },
          extraData: {
            source: gStores.globalStore.browser.source,
            sysCode: gStores.globalStore.sysCode,
            reqForward: true,
            openId: gStores.globalStore.openId,
            ...(query?.extraData || {}),
          },
        },
        'navigateTo',
        gStores.globalStore.h5MenuExtraData
      );
    }
  };

  onLoad((opt) => {
    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }

    init();
  });

  onShareAppMessage((opt) => {
    return {};
  });
</script>

<style lang="scss" scoped></style>
