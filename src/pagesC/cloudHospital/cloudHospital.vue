<template>
  <view class="cache">
    <view class="cache-img-container">
      <image
        v-if="globalStore.sysCode === '1001063'"
        mode="aspectFit"
        class="cache-img"
        :src="BASE_IMG + 'img_h5bg_hk@3x.png'"
      />
      <image
        v-else
        mode="aspectFit"
        class="cache-img"
        :src="BASE_IMG + 'img_h5bg@3x.png'"
      />
    </view>
    <view v-if="!$global.systemInfo.isHideHomeLogo" class="cache-fixbottom">
      浙江和仁科技股份有限公司@技术支持
    </view>
    <g-message />
  </view>
</template>

<script setup lang="ts">
  import { onLoad, onShow } from '@dcloudio/uni-app';

  import { BASE_IMG } from '@/config/global';
  import { useGlobalStore } from '@/stores';
  import { wait, GStores, useTBanner } from '@/utils';
  import {
    setLocalStorage,
    getLocalStorage,
    joinQueryForUrl,
    joinQuery,
  } from '@/common';
  const globalStore = useGlobalStore();
  const gStores = new GStores();

  const gotoNext = (options) => {
    setTimeout(() => {
      uni.navigateTo({
        url: joinQuery('/pagesC/cloudHospital/cachePage', {
          ...options,
        }),
      });
    }, 1000);
  };

  const goYB1001048 = (authCode) => {
    console.log(authCode);
    if (uni.getStorageSync('netWorkghback')) {
      uni.setStorageSync('netWorkghback', false);
      if (uni.getStorageSync('resultConfig')) {
        const resultConfig = JSON.parse(
          decodeURIComponent(uni.getStorageSync('resultConfig'))
        );
        uni.removeStorage({
          key: 'resultConfig',
        });
        if (
          resultConfig.orderStatusRedirectUrl ==
          '/pagesB/cloudHospital/cloudHospital1'
        ) {
          const resultConfigQuery = JSON.parse(
            decodeURIComponent(uni.getStorageSync('resultConfigQuery'))
          );
          uni.removeStorage({
            key: 'resultConfigQuery',
          });
          setTimeout(() => {
            uni.navigateTo({
              url: joinQueryForUrl(resultConfigQuery.path, {
                authCode,
                ...resultConfigQuery.successQuery,
              }),
            });
          }, 100);
        }
      }

      return;
    }
    // 哈哈哈哈哈哈哈
    let H5_BASE_URL = 'https://ybj.jszwfw.gov.cn/mms/hsa-tiap-ui';
    let OPENID = gStores.globalStore.openId;
    let MEDORGORD = uni.getStorageSync('MEDORGORD');
    let ORGCODG = 'H32028200358';
    let APPID = '1GU9S5QVB01M76430B0A000038F064B8';
    let resultConfig = uni.getStorageSync('resultConfig');
    console.log(
      'MEDORGORD',
      uni.getStorageSync('MEDORGORD'),
      MEDORGORD,
      resultConfig
    );
    let url = `${H5_BASE_URL}/#/pay-loading?openid=${OPENID}&medOrgOrd=${MEDORGORD}&orgCodg=${ORGCODG}&appId=${APPID}&authCode=${authCode}&resultConfig=${resultConfig}`;
    useTBanner({
      type: 'h5',
      path: url,
    });
  };

  onShow(async () => {
    const options = globalStore.appShowData;
    console.log(options, '哈哈哈哈哈哈哈哈');
    console.warn('网络医院授权回来', gStores.globalStore.appShowData);
    const authCode =
      gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode;
    // 微信医保小程序跳回来后中断了链路 重新走下
    if (getLocalStorage('get-wx-medical-auth-code') === '1' && authCode) {
      await wait(300);
      setLocalStorage({
        'get-wx-medical-auth-code': '',
      });

      if (gStores.globalStore.sysCode === '1001048') {
        goYB1001048(authCode);
        return;
      }
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
              authCode: authCode,
            }),
          });
        } catch (error) {
          gStores.messageStore.showMessage('网络医院地址参数配置错误', 2000);
          console.error('网络医院地址参数配置错误', error);
        }
      }
    }

    if (options) {
      const { scene, path } = options;

      if (scene === 1038 && globalStore.sysCode === '1001048') {
        await wait(200);

        if (path == 'pages/mms-pay-loading/mms-pay-loading') {
          if (uni.getStorageSync('resultConfig')) {
            const resultConfig = JSON.parse(
              decodeURIComponent(uni.getStorageSync('resultConfig'))
            );
            uni.removeStorage({
              key: 'resultConfig',
            });

            if (
              resultConfig.orderStatusRedirectUrl ==
              '/pagesC/cloudHospital/cloudHospital'
            ) {
              const resultConfigQuery = JSON.parse(
                decodeURIComponent(uni.getStorageSync('resultConfigQuery'))
              );
              uni.removeStorage({
                key: 'resultConfigQuery',
              });

              uni.navigateTo({
                url: joinQueryForUrl(
                  resultConfigQuery.path,
                  resultConfigQuery.successQuery
                ),
              });
            } else {
              uni.reLaunch({
                url: resultConfig.orderStatusRedirectUrl,
              });
            }
          }
        }
      }
    }
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
      } else {
        gotoNext(options);
      }
    } else {
      gotoNext(options);
    }
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
