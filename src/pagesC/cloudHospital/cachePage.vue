<template>
  <view v-if="isShow">
    <!-- <button @tap="handleMessage">点击</button> -->
    <web-view :src="src" @message="handleMessage"></web-view>
  </view>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
  import { useGlobalStore } from '@/stores';
  import {
    encryptDes,
    joinQuery,
    setLocalStorage,
    joinQueryForUrl,
  } from '@/common';
  import global from '@/config/global';
  import {
    wxPay,
    aliPayMedicalPluginGetAuthCode,
    aliPayMedicalPluginPay,
    getMedicalAuthCode,
  } from './utils/cloudHospital';

  //第三方h5页面入口——网络医院
  const src = ref('');
  const isShow = ref(false);
  const yibaoPayBackParams = ref({});
  const yibaoRegisterId = ref('');
  const globalStore = useGlobalStore();
  const shareData = ref<any>({});

  onLoad((options) => {
    // #ifdef MP-ALIPAY
     aliPayMedicalPluginPay(yibaoRegisterId, yibaoPayBackParams);
    // #endif
    console.warn('跳转参数',options)
    getparams(options);
  });
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
    getSrc(para, options);
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

    src.value = fPath;

    isShow.value = true;

    console.warn('跳转网络医院携带数据', para);
    console.warn('跳转网络医院的路径', src.value);
  };

  const handleMessage = async (evt) => {
    var data = evt.target.data;
    console.warn('获取到返回--------------', data);
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
    let insuranceParamsWx = data[0].insuranceParams;

    if (insuranceParamsWx) {
      if (insuranceParamsWx.authCode == 1) {
        let payBackParams =
          JSON.stringify(data[0].payBackParams)
        ;
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
        console.log('触发获取授权码')
        let authCode = await getMedicalAuthCode(data);
        console.warn('授权码', authCode);
        return;
      }
      if (insuranceParamsWx.payAppId) {
          uni.showModal({
            content: '即将打开医保支付小程序',
            showCancel: false,
            confirmText: '确定',
            complete:  () => {
              uni.navigateToMiniProgram({
              appId: insuranceParamsWx.payAppId,
              path: insuranceParamsWx.payUrl,
          });
          },
        });
      }
    }
     else if (data[0].invokeData) {
      wxPay(data);
    }

    // #endif

    // #ifdef MP-ALIPAY
    // 国标医保授权支付
    let insuranceParams = data.insuranceParams;
    yibaoPayBackParams.value = data.payBackParams;
    yibaoRegisterId.value = data.registerId;
    if (insuranceParams) {
      aliPayMedicalPluginGetAuthCode(insuranceParams);
    }
    // #endif

    //支持分享
    // 隐藏分享按钮
    if (data[0].shareData) {
      let newShareData = data[data.length - 1].shareData
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
  onShareAppMessage((res) => {
    console.warn('分享', res, shareData.value);
    let path = `/pagesC/commonHosNet/commonHosNet?returnUrl=${encodeURIComponent(
      shareData.value.path
    )}`;
    return {
      title: shareData.value.title,
      path: path,
      imageUrl: shareData.value.imageUrl,
      desc: shareData.value.desc,
    };
  });
</script>

<style scoped></style>
