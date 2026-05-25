<template>
  <view class="g-page bg-white"></view>
  <Order-Reg-Confirm
    :headerIcon="`${$global.BASE_IMG}v3-order-reg-confirm${
      gStores.globalStore.isTcmStyle ? '-tcm' : ''
    }.png`"
    @confirm="resolve()"
    @cancel="reject()"
    :title="'人脸识别认证须知'"
    ref="faceDialog"
  >
    <g-flag
      title="人脸识别认证须知"
      :typeFg="'1250'"
      isShowFgTip
      isHideTitle
      aaa
    />
  </Order-Reg-Confirm>
  <g-message />
</template>
<script lang="ts" setup>
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { nextTick, ref, warn } from 'vue';
  import {
    apiAsync,
    GStores,
    PatientUtils,
    useTBanner,
    type TButtonConfig,
  } from '@/utils';
  import { BASE_IMG } from '@/config/global';
  import { deQueryForUrl, encryptDes } from '@/common';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';

  const gStores = new GStores();
  const showNum = ref(0);
  const pageProps = ref(
    <
      {
        type:
          | 'scanCode' //scanCode:扫码
          | 'openLocation' //openLocation:定位
          | 'getUserInfo' //微信用户信息
          | 'scanCodeAndgetUserInfo' //扫码并微信用户信息
          | 'faceVerify';
        backUrl: string; //返回路径
        routeType?: 'redirectTo' | 'reLaunch';
        [key: string]: any;
      }
    >{}
  );
  const backUrl = ref(<TButtonConfig>{});
  const faceDialog = ref(<any>'');
  let resolve: (...any) => any = () => {};
  let reject: (...any) => any = () => {};

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
        case 'faceVerify': {
          const { routeType, idCard, name } = pageProps.value;
          backUrl.value.extraData = {
            ...pageProps.value,
            backStatus: 'fail',
            herenId: gStores.globalStore.herenId,
          };
          // backUrl.value.extraData.pata = encodeURIComponent('123123');
          // backUrl.value.extraData.backStatus = 'success';
          // gStores.messageStore.showMessage('模拟人脸识别成功', 3000, {
          //   closeCallBack: () => {
          //     useTBanner(
          //       backUrl.value,
          //       pageProps.value?.routeType || 'reLaunch'
          //     );
          //   },
          // });
          // break;
          function backWithErr() {
            console.log(' 看看有没有走到这里');

            gStores.messageStore.showMessage('人脸识别失败', 3000, {
              closeCallBack: () => {
                useTBanner(
                  backUrl.value,
                  pageProps.value?.routeType || 'reLaunch'
                );
              },
            });
          }
          await new Promise((rl, rj) => {
            resolve = rl;
            reject = () => {
              backWithErr();
              rj();
            };
            faceDialog.value.show();
          });
          const patientUtils = new PatientUtils();
          const { pData } = await patientUtils
            .faceVerifyAndPData({
              idCardNumber: idCard,
              name,
            })
            .catch((e) => {
              backWithErr();
              throw e;
            });

          backUrl.value.extraData.pata = encodeURIComponent(pData);
          backUrl.value.extraData.backStatus = 'success';
          useTBanner(backUrl.value, pageProps.value?.routeType || 'reLaunch');
          break;
        }
      }
    });
  });
</script>
