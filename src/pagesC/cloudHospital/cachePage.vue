<template>
  <view v-if="isShow">
    <web-view :src="src" @message="handleMessage"></web-view>
  </view>
</template>
<script setup lang="ts">
  import { onLoad } from '@dcloudio/uni-app';
  import { useGlobalStore } from '@/stores';
  import { encryptDes, getSysCode, joinQuery } from '@/common';
  import { ref } from 'vue';
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
    let source; // 1 微信小程序 2 支付宝生活号 3 公众号 4 支付宝小程序  9 pc电脑端（5g云诊室）
    // #ifdef MP-WEIXIN
    source = 1;
    // #endif
    // #ifdef H5
    source = 3;
    // #endif
    // #ifdef MP-ALIPAY
    source = 4;
    // #endif

    let para = {
      token: globalStore.getToken,
      openid: globalStore.openId,
      source: source,
      ...options,
      // payment: options.payment,
      // registerId: options.registerId,
      // hosDocId: options.docId,
      // openHomePage: options.openHomePage,
      // receptionMode: options.receptionMode, //医生名片里面的跳转
      payBackParams: options.payBackParams && JSON.parse(decodeURIComponent(options.payBackParams))
    };
    getSrc(para);
  };

  //两种网络医院
  const getSrc = (para) => {
    // 网络医院有老版本和3.0版本
    const sysCodeList = ['1001033'];
    const sysCode = getSysCode();
    let netUrl = '';
    let params = '';
    if (sysCodeList.indexOf(sysCode) < 0) {
      //新的
      netUrl =
        (global.env as string) === 'prod'
          ? 'https://interhos.eheren.com/static/nhs/#/'
          : 'https://testwechatnethos.eheren.com/static/nhs/';
      params = encodeURIComponent(encryptDes(JSON.stringify(para)));
      src.value = `${netUrl}${sysCode}/#/?initSysCode=${sysCode}&params=` + params;
    } else {
      //老的
      netUrl =
        (global.env as string) === 'prod'
          ? 'https://interhos.eheren.com/static/netHospital/#/'
          : 'https://testwechatnethos.eheren.com/static/netHospital/#/';
      //暂时写死台州
      para.hospital = 'ty';

      params = encodeURIComponent(encryptDes(JSON.stringify(para)));
      src.value = `${netUrl}?params=` + params;
    }
    isShow.value = true;
    console.log('跳转网络医院携带数据', para);
    console.log('跳转网络医院的路径', src.value);
  };

  const handleMessage = (evt) => {
    // #ifdef MP-WEIXIN
    var data = evt.target.data;
    console.log('获取到返回--------------', data);
    var paymentData = data[0].invokeData;
    let registerId = data[0].registerId;
    let payBackParams = encodeURIComponent(JSON.stringify(data[0].payBackParams));
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
              payBackParams: payBackParams
            })
          });
        },
        fail: () => {
          uni.showToast({
            title: '已取消',
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateTo({
              url: joinQuery('/pages/cloudHospital/cloudHospital', {
                payment: 'back',
                registerId: registerId,
                payBackParams: payBackParams
              })
            });
          }, 1000);
        },
        provider: 'wxpay',
        orderInfo: ''
      });
    } else {
      uni.showToast({
        title: '数据错误',
        icon: 'none'
      });
    }
    console.log(evt);
    // #endif
  };
</script>

<style scoped></style>
