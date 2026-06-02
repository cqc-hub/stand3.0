<template>
  <view class="">
    <!-- @vue-expect-error -->
    <web-view
      :src="src"
      @message="getMessage"
      ref="refweb"
      id="webview"
    ></web-view>
  </view>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref } from 'vue';
  import {
    onLoad,
    onReady,
    onShareAppMessage,
    onShow,
  } from '@dcloudio/uni-app';
  import { useCommonTo } from '@/common/checkJump';
  import {
    handWebMessage,
    thirdWxPay,
    GStores,
    useTBanner,
    wait,
  } from '@/utils';
  import {
    deQueryForUrl,
    getLocalStorage,
    joinQuery,
    removeLocation,
  } from '@/common';
  import { CanWrite } from '@/typeUtils';
  import { useCacheStore } from '@/stores';

  const gStores = new GStores();
  const cacheStore = useCacheStore();

  // pagesA/webView/webView
  const props = defineProps<{
    https: string;
    query?: any;

    cache?: '1';
  }>();
  const pageProps = ref({} as CanWrite<typeof props>);
  const inst = getCurrentInstance();

  const src = ref('');
  let webViewContext: any = null;

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

  onReady(async () => {
    await wait(1000);
  });

  const init = () => {
    const { https, cache } = pageProps.value;

    if (cache === '1') {
      src.value = cacheStore.cacheData;
    } else if (https) {
      console.warn(decodeURIComponent(pageProps.value.https));
      src.value = decodeURIComponent(pageProps.value.https);
    }
  };

  onLoad((opt) => {
    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }

    init();
  });

  onShareAppMessage((opt) => {
    return {
      path: joinQuery('/pagesA/webView/webView', {
        cache: '0',
        https: encodeURIComponent(src.value || cacheStore.cacheData),
      }),
    };
  });
</script>

<style lang="scss" scoped></style>
