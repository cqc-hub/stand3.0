<template>
  <view class="g-page bg-white"></view>
</template>
<script lang="ts" setup>
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { nextTick, ref, warn } from 'vue';
  import { apiAsync, GStores, useTBanner, type TButtonConfig } from '@/utils';
  import { BASE_IMG } from '@/config/global';
  import { deQueryForUrl, encryptDes } from '@/common';

  const gStores = new GStores();
  const showNum = ref(0);
  const pageProps = ref(
    <
      {
        type:
          | 'scanCode'
          | 'openLocation'
          | 'getUserInfo'
          | 'scanCodeAndgetUserInfo'; //scanCode:扫码 openLocation:定位;微信用户信息
        backUrl: string; //返回路径
        routeType?: 'redirectTo' | 'reLaunch';
        [key: string]: any;
      }
    >{}
  );
  const backUrl = ref(<TButtonConfig>{});
  onShow(() => {
    switch (pageProps.value.type) {
      case 'openLocation': {
        showNum.value++;
        if (showNum.value >= 2) {
          uni.navigateBack();
        }
      }
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
      console.log('pageProps.value.type', pageProps.value.type);
      switch (pageProps.value.type) {
        case 'scanCode': {
          const { result } = await apiAsync(uni.scanCode, {
            autoZoom: true,
          });
          console.log('扫码反参', result);
          backUrl.value.extraData = {
            ...backUrl.value.extraData,
            sacnData: encodeURIComponent(result),
          };
          useTBanner(backUrl.value, pageProps.value?.routeType || 'reLaunch');
          break;
        }
        case 'getUserInfo': {
        const { userInfo } = await apiAsync(wx.getUserInfo, {});
          console.log('用户信息', userInfo);
          backUrl.value.extraData = {
            ...backUrl.value.extraData,
            uuserInfo: encodeURIComponent(JSON.stringify(userInfo)),
          };
          useTBanner(backUrl.value, pageProps.value?.routeType || 'reLaunch');
          break;
        }
        case 'openLocation': {
          const { gisLat, gisLng, hosName, address } = pageProps.value;
          uni.openLocation({
            latitude: Number(gisLat),
            longitude: Number(gisLng),
            name: hosName,
            address: address,
            success: (res) => {
              console.log('success', res);
            },
          });
          break;
        }
      }
    });
  });
</script>
