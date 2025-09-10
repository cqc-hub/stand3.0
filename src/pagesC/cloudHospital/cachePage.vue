<template>
  <view v-if="isShow">
    <!-- <button @tap="handleMessage">点击</button> -->
    <web-view :src="src" @message="handleMessage"></web-view>
  </view>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app';
  import { useCacheStore, useGlobalStore } from '@/stores';
  import {
    encryptDes,
    joinQuery,
    setLocalStorage,
    joinQueryForUrl,
    getLocalStorage,
  } from '@/common';
  import global from '@/config/global';
  import {
    wxPay,
    aliPayMedicalPluginGetAuthCode,
    aliPayMedicalPluginPay,
    getMedicalAuthCode,
  } from './utils/cloudHospital';
  import { apiAsync, GStores, wait } from '@/utils';

  //第三方h5页面入口——网络医院
  const src = ref('');
  const isShow = ref(false);
  const yibaoPayBackParams = ref({});
  const yibaoRegisterId = ref('');
  const globalStore = useGlobalStore();
  const shareData = ref<any>({});
  const gStores = new GStores();
  const cacheStore = useCacheStore();

  const getAuthCodeWx = async () => {
    return new Promise(async (r, j) => {
      const { confirm } = await apiAsync(uni.showModal, {
        content: '请点击确定跳转医保小程序?',
      });

      if (!confirm) {
        j('取消');
        return;
      }

      uni.showLoading({});

      // @ts-expect-error
      require('../../pagesA/clinicPay/utils/clinicPayDetail', async (utils) => {
        uni.hideLoading();
        const authCode = await utils.getMedicalAuthCode().catch((err) => {
          console.log(err, 'err');
          if (!(typeof err === 'string' && err === '请求授权...')) {
            j(err);
          }
        });
        r(authCode);
      });
    });
  };

  const getAuthCodeWx1001035 = async ({ userName, idCard }) => {
    return new Promise(async (r, j) => {
      const { confirm } = await apiAsync(uni.showModal, {
        content: '请点击确定跳转医保小程序?',
      });

      if (!confirm) {
        j('取消请求授权...');
        return;
      }

      uni.showLoading({});

      // @ts-expect-error
      require('../../pagesA/clinicPay/utils/clinicPayDetail', async (utils) => {
        uni.hideLoading();
        const authCode = await utils
          .getWxMedicalAuth1001035({ userName, idCard })
          .catch((err) => {
            console.log(err, 'err');
            if (!(typeof err === 'string' && err === '请求授权...')) {
              j(err);
            }
          });
        r(authCode);
      });
    });
  };
  //封装网络医院参数
  const getparams = (options) => {
    const opt = options._outPara ? {} : options;
    let para = {
      token: globalStore.getToken,
      openid: globalStore.openId,
      source: globalStore.browser.source,
      ...opt,
      // payment: options.payment,
      // registerId: options.registerId,
      // hosDocId: options.docId,
      // openHomePage: options.openHomePage,
      // receptionMode: options.receptionMode, //医生名片里面的跳转
      payBackParams:
        options.payBackParams &&
        JSON.parse(decodeURIComponent(options.payBackParams)),
    };

    return para;
  };

  //两种网络医院
  const getSrc = (para, _payload: any = {}) => {
    const payload: any = {};
    for (const key in _payload) {
      if (!(key in para)) {
        payload[key] = _payload[key];
      }
    }

    // 网络医院有老版本和3.0版本
    const sysCodeList = ['1001033'];
    let sysCode = global.SYS_CODE;
    let netUrl = '';
    let params = '';
    let netPath = '';

    // 演示乐清项目, 对应互联网嘉兴
    // if (sysCode === '1001052') {
    //   sysCode = '1001038';
    // }
    if (para._url) {
      netPath = decodeURIComponent(para._url);
      delete para._url;
    } else if (_payload._url) {
      netPath = decodeURIComponent(_payload._url);
      delete payload._url;
    }
    //新的
    netUrl = global.netUrl;
    params = encodeURIComponent(encryptDes(JSON.stringify(para)));

    let fPath = netUrl + `${sysCode}/#/` + netPath;
    // let fPath = netUrl + `/#/` + netPath;
    fPath = joinQuery(fPath, {
      initSysCode: sysCode,
      params,
      ...payload,
    });

    return fPath;
  };

  const handleMessage = async (evt) => {
    // if (globalStore.sysCode === '1001048') {
    //   handleMessage1001048(evt);
    //   return;
    // }
    var data = evt.target.data;
    const fd = data[0] || {};
    console.warn('获取到返回--------------', data && fd);
    console.warn('编码----------------');
    // #ifdef MP-WEIXIN

    // let data=[{
    //   insuranceParams:{
    //   authCode:1,
    //   backUrl:'pages/v3/outpatientPay/detail'
    // },
    // payBackParams:{
    //   hosPatientld:100023882
    // }
    // }]
    const {
      insuranceParams: insuranceParamsWx,
      payBackParams,
      registerId,
      cardNumber,
    } = fd;

    // if (cardNumber) {
    //   if (gStores.userStore.patChoose.cardNumber !== cardNumber) {
    //     const pat = gStores.userStore.patList.find(
    //       (o) => o.cardNumber === cardNumber
    //     );
    //     gStores.userStore.updatePatChoose(pat!);
    //   }
    // }

    const registerType =
      insuranceParamsWx.registerType || payBackParams.registerType;

    if (insuranceParamsWx) {
      if (globalStore.sysCode === '1001048' && registerType) {
        await wait(60);
        handleMessage1001048(fd);
        return;
      }

      if (globalStore.sysCode === '1001035') {
        const { userName, idCard, registerId } = fd;
        cacheStore.changeCacheData(fd);
        await getAuthCodeWx1001035({
          userName,
          idCard,
        }).catch((err) => {
          console.log(err);
          if (err === '取消请求授权...') {

          }
          throw new Error(err);
        });

        return;
      }

      if (insuranceParamsWx.authCode == 1) {
        let payBackParams = JSON.stringify(fd.payBackParams);
        setLocalStorage({
          'get-wx-medical-netWork-path': encodeURIComponent(
            JSON.stringify({
              path: insuranceParamsWx.backUrl,
              query: {
                payBackParams: payBackParams,
              },
            })
          ),
        });
        console.log('触发获取授权码');
        let authCode = await getMedicalAuthCode(data);
        console.warn('授权码', authCode);
        return;
      }
      if (insuranceParamsWx.payAppId) {
        uni.showModal({
          content: '即将打开医保支付小程序',
          showCancel: false,
          confirmText: '确定',
          complete: () => {
            uni.navigateToMiniProgram({
              appId: insuranceParamsWx.payAppId,
              path: insuranceParamsWx.payUrl,
            });
          },
        });
      }
    } else if (fd.invokeData) {
      const { confirm } = await apiAsync(uni.showModal, {
        content: '是否立即支付？',
        cancelText: '取消',
        confirmText: '确认',
      });

      if (!confirm) {
        uni.navigateTo({
          url: joinQuery('/pagesC/cloudHospital/cachePage', {
            payment: 'back',
            registerId,
            payBackParams:
              payBackParams &&
              encodeURIComponent(JSON.stringify(payBackParams)),
          }),
        });
        return;
      }
      wxPay(data);
    }

    // #endif

    // #ifdef MP-ALIPAY
    // 国标医保授权支付
    let insuranceParams = data.insuranceParams;
    yibaoPayBackParams.value = data.payBackParams;
    yibaoRegisterId.value = data.registerId;
    if (insuranceParams) {
      aliPayMedicalPluginPay(yibaoRegisterId, yibaoPayBackParams);
      await wait(600);

      aliPayMedicalPluginGetAuthCode(insuranceParams);
    }
    // #endif

    //支持分享
    // 隐藏分享按钮
    if (fd.shareData) {
      let newShareData = data[data.length - 1].shareData;
      if (newShareData.closeShare) {
        uni.hideShareMenu({
          hideShareItems: [],
        });
      } else {
        shareData.value = newShareData;
        console.warn('开启分享按钮');
        uni.showShareMenu({});
      }
    }
  };

  const resultConfig1001048 = ref('');
  const handleMessage1001048 = async ({
    insuranceParams,
    payBackParams,
    registerId,
  }) => {
    // registerType 1 医保支付 2 医保退号
    const { registerType } = insuranceParams;

    if ([1].includes(registerType)) {
      resultConfig1001048.value = encodeURIComponent(
        JSON.stringify({
          cancelAuthRedirectUrl: '/pagesC/cloudHospital/cloudHospital',
          orderStatusRedirectUrl: '/pagesC/cloudHospital/cloudHospital',
        })
      );
      uni.setStorageSync('MEDORGORD', insuranceParams.medOrgOrd);

      uni.setStorageSync(
        'resultConfigQuery',
        encodeURIComponent(
          JSON.stringify({
            path: '/pagesC/cloudHospital/cloudHospital?myHosType=ybyjf',
            successQuery: {},
          })
        )
      );
    } else if (registerType === 2) {
      uni.setStorageSync('netWorkghback', true);
      uni.setStorageSync(
        'resultConfigQuery',
        encodeURIComponent(
          JSON.stringify({
            path: '/pagesC/cloudHospital/cloudHospital',
            successQuery: {
              payBackParams: payBackParams,
            },
          })
        )
      );
    } else {
      resultConfig1001048.value = encodeURIComponent(
        JSON.stringify({
          cancelAuthRedirectUrl: '/pagesC/cloudHospital/cloudHospital',
          orderStatusRedirectUrl: '/pagesC/cloudHospital/cloudHospital',
        })
      );
      uni.setStorageSync('MEDORGORD', insuranceParams.medOrgOrd);

      uni.setStorageSync(
        'resultConfigQuery',
        encodeURIComponent(
          JSON.stringify({
            path: '/pagesC/cloudHospital/cloudHospital',
            successQuery: {
              payment: 'next',
              registerId,
              payBackParams,
            },
            failQuery: {
              payment: 'back',
              registerId,
              payBackParams,
            },
          })
        )
      );
    }
    uni.setStorageSync('resultConfig', resultConfig1001048.value);
    await getAuthCodeWx().catch(async (err) => {
      console.error(err);

      const resultConfig = JSON.parse(
        decodeURIComponent(uni.getStorageSync('resultConfigQuery'))
      );
      //
      uni.removeStorage({
        key: 'resultConfig',
      });

      await wait(20);
      uni.reLaunch({
        url: joinQueryForUrl(resultConfig.path, resultConfig.failQuery),
      });
    });
  };

  // const

  onShareAppMessage((res) => {
    console.warn('分享', res, shareData.value);
    let path = '';
    if (JSON.stringify(shareData.value) === '{}' && res.webViewUrl) {
      path = joinQueryForUrl('/pagesA/webView/webView', {
        https: res.webViewUrl,
      });
    } else {
      path = `/pagesC/commonHosNet/commonHosNet?returnUrl=${encodeURIComponent(
        shareData.value.path
      )}`;
    }
    return {
      title: shareData.value.title,
      path: path,
      imageUrl: shareData.value.imageUrl,
      desc: shareData.value.desc,
    };
  });

  onLoad((options) => {
    // #ifdef MP-ALIPAY
    // aliPayMedicalPluginPay(yibaoRegisterId, yibaoPayBackParams);
    // #endif
    console.warn('跳转参数', options);
    const para = getparams(options);
    const path = getSrc(para, options);

    src.value = path;
    isShow.value = true;

    console.warn('跳转网络医院携带数据', para);
    console.warn('跳转网络医院的路径', src.value);
    // setTimeout(async () => {
    //   const r = await getAuthCodeWx();
    //   console.log(r, 233);
    // }, 1000);
  });

  onShow(() => {
    const medicalWx = getLocalStorage('get-wx-medical-auth-code');
    // 微信医保小程序跳回来后中断了链路 重新走下
    if (medicalWx === '1') {
      setLocalStorage({
        'get-wx-medical-auth-code': '',
        'get-ali-medical-auth-code': '',
      });

      const authCode =
        gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode;
      if (authCode) {
      } else {
        gStores.messageStore.showMessage(
          '未完成电子医保凭证授权,无法继续医保结算',
          1500,
          {
            uniToast: true,
          }
        );
      }
    }
  });
</script>

<style scoped></style>
