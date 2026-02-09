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
    getMedicalAuthCode,
    aliPayMedicalPluginPayInit,
    handlerMedicalPayDongRuan,
    getQxMedicalNation,
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

  // const getClinicUtils = async () => {
  //   return new Promise(async (r, j) => {
  //     uni.showLoading({ title: '加载中'});;

  //     // @ts-expect-error
  //     require('../../pagesA/clinicPay/utils/clinicPayDetail', async (utils) => {
  //       uni.hideLoading();
  //       r(utils);
  //     });
  //   });
  // };

  const getAuthCodeWx1001035 = async ({ userName, idCard }) => {
    // const clinicUtils = await getClinicUtils();

    return new Promise(async (r, j) => {
      const { confirm } = await apiAsync(uni.showModal, {
        content: '请点击确定跳转医保小程序?',
      });

      if (!confirm) {
        j('取消请求授权...');
        return;
      }

      uni.showLoading({ title: '加载中' });

      require('../../pagesA/clinicPay/utils/clinicPayDetail', async (utils) => {
        uni.hideLoading();
        await utils.getMedicalArgWithFamily();
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

  const handleWxMedicalPay1001035 = async ({ uploadRes, info }) => {
    const { orderIdSM4, sourcebusinessBj, medOrgOrd, orderId, payOrderId } =
      uploadRes;

    const { openid, source, userName, userCardNo, payAuthNo, ocToken } = info;

    return new Promise(async (r, j) => {
      const { confirm } = await apiAsync(uni.showModal, {
        content: '请点击确定跳转医保小程序?',
      });

      if (!confirm) {
        j('取消请求授权...');
        return;
      }

      uni.showLoading({ title: '加载中' });
      gStores.globalStore.assignCacheData({
        uploadRes: {
          ...uploadRes,
          orderIdSM4,
          sourcebusinessBj,
          medOrgOrd,
          orderId,
          payOrderId,
        },
        info: {
          ...info,
          openid,
          source,
          userName,
          userCardNo,
          payAuthNo,
          ocToken,
        },
      });

      require('../../pagesA/clinicPay/utils/clinicPayDetail', async (utils) => {
        uni.hideLoading();
        await utils.handlerMedicalPay1001035({
          phsOrderSource: sourcebusinessBj === '11' ? '1' : '2',
        });
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
      insuranceParams1001035,
      cardNumber,
    } = fd;

    if (cardNumber) {
      if (gStores.userStore.patChoose.cardNumber !== cardNumber) {
        const pat = gStores.userStore.patList.find(
          (o) => o.cardNumber === cardNumber
        );

        if (pat) {
          gStores.userStore.updatePatChoose(pat);
        }
      }
    }

    if (insuranceParams1001035) {
      handleWxMedicalPay1001035(insuranceParams1001035);
    }

    const registerType =
      insuranceParamsWx?.registerType || payBackParams?.registerType;

    if (insuranceParamsWx) {
      let { authCode, payAuthNo } = insuranceParamsWx;

      if (payAuthNo === 1) {
        authCode = 1;
      }

      if (insuranceParamsWx.authCode === 1) {
        let payBackParams = JSON.stringify(fd.payBackParams);
        setLocalStorage({
          'get-wx-medical-netWork-path': encodeURIComponent(
            JSON.stringify({
              path: insuranceParamsWx.backUrl,
              query: {
                payBackParams: payBackParams,
              },
              payAuthNo: payAuthNo || '',
            })
          ),
        });
        let authCode = await getMedicalAuthCode(data);

        // if (authCode) {
        //   console.warn('授权码', authCode);

        //   const authInfo =
        //     gStores.globalStore.appShowData.referrerInfo?.extraData || {};
        //   uni.navigateTo({
        //     url: joinQueryForUrl('/pagesC/cloudHospital/cachePage', {
        //       ...authInfo,
        //       _url: insuranceParamsWx.backUrl,
        //       payBackParams,
        //       authCode,
        //     }),
        //   });
        // }
        return;
      }

      if (
        ['1001048', '1001084'].includes(gStores.globalStore.sysCode) &&
        registerType
      ) {
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
          if (err === '取消请求授权...') {
            uni.navigateTo({
              url: joinQueryForUrl('/pagesC/cloudHospital/cachePage', {
                _url: `pages/v3/order/detail?registerId=${registerId}`,
              }),
            });
          }
          throw new Error(err);
        });

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
      // aliPayMedicalPluginPay(yibaoRegisterId, yibaoPayBackParams);
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

  const handleMessage1001048 = async ({
    insuranceParams,
    payBackParams = {},
    registerId,
  }) => {
    // registerType 1 医保支付 2 医保退号( 2 暂时不存在)
    const { registerType, medOrgOrd } = insuranceParams;

    if ([1].includes(registerType)) {
      handlerMedicalPayDongRuan({
        medOrgOrd,
        resultConfig: {
          cancelUrl: '/pagesC/cloudHospital/cloudHospital',
          successUrl: '/pagesC/cloudHospital/cloudHospital',
        },
      });
    } else {
      const url = joinQueryForUrl('/pagesC/cloudHospital/cloudHospital', {
        payment: 'next',
        registerId,
        payBackParams: JSON.stringify(payBackParams),
      });

      handlerMedicalPayDongRuan({
        medOrgOrd,
        resultConfig: {
          cancelUrl: url,
          successUrl: url,
        },
      });
    }
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
    aliPayMedicalPluginPayInit();

    setTimeout(() => {
      // 测试医保-1
      // getMedicalAuthCode([
      //   {
      //     hosId: 'virtualHosId',
      //   },
      // ]);
    }, 3000);
  });

  onShow(async () => {
    console.log('');
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
        // 测试医保-2
        // await getQxMedicalNation({});
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
