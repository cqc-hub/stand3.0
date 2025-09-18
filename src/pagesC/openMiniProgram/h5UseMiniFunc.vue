<template>
  <view class=""></view>
</template>
<script lang="ts" setup>
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { nextTick, ref, warn } from 'vue';
  import { apiAsync, GStores, useTBanner, type TButtonConfig } from '@/utils';

  import { deQueryForUrl, encryptDes } from '@/common';

  const gStores = new GStores();
  const pageProps = ref(
    <
      {
        type: 'scanCode'; //scanCode:扫码
        backUrl: string; //返回路径
        routeType?: 'redirectTo' | 'reLaunch';
      }
    >{}
  );
  let count = 0;
  const backUrl = ref(<TButtonConfig>{});
  onShow(() => {
    if (count) {
      useTBanner(backUrl.value, pageProps.value?.routeType || 'reLaunch');
    } else {
      count++;
    }
  });
  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    try {
      backUrl.value = JSON.parse(pageProps.value.backUrl);
    } catch (e) {
      backUrl.value = {
        type: 'h5',
        isSelfH5: '1',
        path: pageProps.value.backUrl,
        text: '',
        extraData: {},
        addition: {},
      };
    }
    nextTick(async () => {
      switch (pageProps.value.type) {
        case 'scanCode': {
          const { result } = await apiAsync(uni.scanCode, {
            autoZoom: true,
          });
          backUrl.value.extraData = {
            ...backUrl.value.extraData,
            sacnData: result,
          };
        }
      }
    });
  });
</script>
