<template>
  <view v-if="isShow">
    <web-view :src="src" @message="handleMessage"></web-view>
  </view>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { useGlobalStore } from '@/stores';
  import { encryptDes, getSysCode, joinQuery } from '@/common';
  import global from '@/config/global';

  //第三方h5页面入口——网络医院
  const src = ref('');
  const isShow = ref(false);
  const globalStore = useGlobalStore();

  onLoad((options) => {
    console.log(888, options);
    getparams(options);
  });
  //封装网络医院参数
  const getparams = (options) => {
    const opt = options._outPara ? {} : options
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
    console.log(para, '---------');
    const payload = {};
    for(const key in _payload) {
      if (!(key in para)) {
        payload[key] = _payload[key]
      }
    }

    // 网络医院有老版本和3.0版本
    const sysCodeList = ['1001033'];
    const sysCode = global.SYS_CODE;
    let netUrl = '';
    let params = '';
    let netPath = '';

    if (para._url) {
      netPath = decodeURIComponent(para._url);
      delete para._url;
    } else if(_payload._url) {
      netPath = decodeURIComponent(_payload._url);
      delete _payload._url;
    }
    //新的
    netUrl = global.netUrl;
    params = encodeURIComponent(encryptDes(JSON.stringify(para)));

    let fPath = netUrl + `${sysCode}/#/` + netPath;
    fPath = joinQuery(fPath, {
      initSysCode: sysCode,
      params,
      ...payload
    })

    src.value = fPath;

    isShow.value = true;
    console.log({
      netUrl,
    });

    console.log('跳转网络医院携带数据', para);
    console.log('跳转网络医院的路径', src.value);
  };

  const handleMessage = (evt) => {
    // #ifdef MP-WEIXIN
    var data = evt.target.data;
    console.log('获取到返回--------------', data);
    var paymentData = data[0].invokeData;
    let registerId = data[0].registerId;
    let payBackParams = encodeURIComponent(
      JSON.stringify(data[0].payBackParams)
    );
    console.log('编码----------------');
    console.log(payBackParams);
    if (paymentData) {
      uni.requestPayment({
        timeStamp: paymentData.timeStamp,
        nonceStr: paymentData.nonceStr,
        package: paymentData.package,
        signType: paymentData.signType,
        paySign: paymentData.paySign,
        success: () => {
          uni.navigateTo({
            url: joinQuery('/pages/cloudHospital/cloudHospital', {
              payment: 'next',
              registerId: registerId,
              payBackParams: payBackParams,
            }),
          });
        },
        fail: () => {
          uni.showToast({
            title: '已取消',
            icon: 'none',
          });
          setTimeout(() => {
            uni.navigateTo({
              url: joinQuery('/pages/cloudHospital/cloudHospital', {
                payment: 'back',
                registerId: registerId,
                payBackParams: payBackParams,
              }),
            });
          }, 1000);
        },
        provider: 'wxpay',
        orderInfo: '',
      });
    } else {
      uni.showToast({
        title: '数据错误',
        icon: 'none',
      });
    }
    console.log(evt);
    // #endif
  };
</script>

<style scoped></style>
