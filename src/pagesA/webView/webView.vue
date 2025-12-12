<template>
  <view class="">
    <!-- @vue-expect-error -->
    <web-view
      v-if="src"
      :src="src"
      @message="getMessage"
      ref="refWebView"
    ></web-view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app';
  import { useCommonTo } from '@/common/checkJump';
  import { handWebMessage, thirdWxPay, GStores, useTBanner } from '@/utils';
  import { deQueryForUrl, getLocalStorage, removeLocation } from '@/common';
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
  const src = ref('');
  const refWebView = ref('' as any);

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

  onShow(() => {
    console.log('我出来哈哈哈哈哈');
    console.log(refWebView.value);

    if (getLocalStorage('back-address')) {
      removeLocation('back-address');
    }
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
    return {};
  });
</script>

<style lang="scss" scoped></style>
