<template>
  <view class="cache">
    <view class="cache-img-container">
      <image
        mode="aspectFit"
        class="cache-img"
        :src="BASE_IMG + 'img_h5bg@3x.png'"
      />
    </view>
    <view v-if="$global.sConfig.isHideHomeLogo !== '1'" class="cache-fixbottom">
      浙江和仁科技股份有限公司@技术支持
    </view>
    <g-message />
  </view>
</template>

<script setup lang="ts">
  import { onLoad, onShow } from '@dcloudio/uni-app';

  import { BASE_IMG } from '@/config/global';
  import { useCacheStore, useGlobalStore } from '@/stores';
  import { wait, GStores, useTBanner } from '@/utils';
  import {
    setLocalStorage,
    getLocalStorage,
    joinQueryForUrl,
    joinQuery,
    encryptDes,
  } from '@/common';
  import { handlerMedicalPayDongRuan } from './utils/cloudHospital';
  const globalStore = useGlobalStore();
  const gStores = new GStores();
  const cacheStore = useCacheStore();

  const gotoNext = (options) => {
    setTimeout(() => {
      uni.navigateTo({
        url: joinQuery('/pagesC/cloudHospital/cachePage', {
          ...options,
        }),
      });
    }, 1000);
  };

  const afterGetMedicalAuthCode1001035 = async () => {
    const { registerId } = cacheStore.cacheData;
    const authInfo = gStores.globalStore.appShowData.referrerInfo.extraData;

    // const params = encodeURIComponent(encryptDes(JSON.stringify(authInfo)));

    await wait(20);
    uni.navigateTo({
      url: joinQueryForUrl('/pagesC/cloudHospital/cachePage', {
        _url: `pages/v3/order/detail?registerId=${registerId}&payAuthNo=1`,
        ...authInfo,
      }),
    });
  };

  onShow(async () => {
    const authInfo =
      gStores.globalStore.appShowData.referrerInfo?.extraData || {};
    const authCode = authInfo.authCode || authInfo.payAuthNo;
    // 微信医保小程序跳回来后中断了链路 重新走下
    if (getLocalStorage('get-wx-medical-auth-code') === '1') {
      await wait(300);
      setLocalStorage({
        'get-wx-medical-auth-code': '',
      });

      if (authCode) {
        // 获取授权码
        if (getLocalStorage('get-wx-medical-netWork-path')) {
          const resultConfig = JSON.parse(
            decodeURIComponent(getLocalStorage('get-wx-medical-netWork-path'))
          );
          console.warn('有授权码的路径', resultConfig);
          console.warn('有授权码的路径参数', resultConfig.query);
          setLocalStorage({
            'get-wx-medical-netWork-path': '',
          });
          try {
            uni.navigateTo({
              url: joinQueryForUrl('/pagesC/cloudHospital/cachePage', {
                _url: resultConfig.path,
                ...resultConfig.query,
                ...authInfo,
                authCode: authCode,
              }),
            });
          } catch (error) {
            gStores.messageStore.showMessage('网络医院地址参数配置错误', 2000);
            console.error('网络医院地址参数配置错误', error);
          }
        }

        if (['1001048', '1001084'].includes(gStores.globalStore.sysCode)) {
          handlerMedicalPayDongRuan(cacheStore.cacheData3);
          return;
        }

        if (gStores.globalStore.sysCode === '1001035') {
          afterGetMedicalAuthCode1001035();
        }
      } else {
        const registerId = cacheStore.cacheData?.registerId;
        if (registerId) {
          uni.navigateTo({
            url: joinQueryForUrl('/pagesC/cloudHospital/cachePage', {
              _url: `pages/v3/order/detail?registerId=${registerId}`,
            }),
          });
        }
      }
    }

    // if (['1001048', '1001084'].includes(gStores.globalStore.sysCode)) {
    //   gStores.globalStore.onAppShow({});
    // }
  });

  onLoad(async (options) => {
    console.log('cloudHospital Options', options);
    await wait(200);
    if (options?.loginInterception == '1') {
      if (!globalStore.isLogin) {
        uni.showToast({
          title: '未登录，请先登录!',
          icon: 'none',
        });
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/home/my',
          });
        }, 1000);

        return;
      }
    }
    gotoNext(options);
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
      top: 140upx;
      .cache-img {
        width: 95vw;
        height: 60vh;
      }
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
