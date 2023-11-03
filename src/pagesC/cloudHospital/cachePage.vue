<template>
  <view v-if="isShow">
    <!-- <button @tap="handleMessage">点击</button> -->
    <web-view :src="src" @message="handleMessage"></web-view>
  </view>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

import { useGlobalStore } from "@/stores";
import { encryptDes, getSysCode, joinQuery } from "@/common";
import global from "@/config/global";

//第三方h5页面入口——网络医院
const src = ref("");
const isShow = ref(false);
const yibaoPayBackParams = ref({});
const yibaoRegisterId = ref("");
const globalStore = useGlobalStore();

onLoad((options) => {
  // #ifdef MP-ALIPAY
  yibaoPay();
  // #endif
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
    payBackParams: options.payBackParams && JSON.parse(decodeURIComponent(options.payBackParams)),
  };
  getSrc(para, options);
};

const yibaoPay = () => {
  const authPayPlugin = requirePlugin("auth-pay-plugin");
  console.log("authPayPlugin", authPayPlugin);
  authPayPlugin.initMethods({
    // 医保授权后，预结算接口报错回调函数（处理逻辑示例）
    catchException: (error) => {
      console.log("catchException error: ", error, yibaoRegisterId, yibaoPayBackParams);
      uni.reLaunch({
        url: joinQuery("/pagesC/cloudHospital/cachePage", {
          payment: "back",
          registerId: yibaoRegisterId.value,
          payBackParams: JSON.stringify(yibaoPayBackParams.value),
        }),
      });
    },
    // 支付回调函数
    payComplete: (status, ampTraceId) => {
      console.log("payComplete", status, ampTraceId, yibaoRegisterId, yibaoPayBackParams);
      uni.reLaunch({
        url: joinQuery("/pagesC/cloudHospital/cachePage", {
          status,
          ampTraceId,
          payment: "next",
          registerId: yibaoRegisterId.value,
          payBackParams: JSON.stringify(yibaoPayBackParams.value),
        }),
      });
    },
    // 支付模块-取消医保授权（处理逻辑示例，建议直接回跳至订单待支付页面）
    payCancelAuth: () => {
      console.log("payCancelAuth", yibaoRegisterId, yibaoPayBackParams);
      uni.reLaunch({
        url: joinQuery("/pagesC/cloudHospital/cachePage", {
          payment: "cancel",
          registerId: yibaoRegisterId.value,
          payBackParams: JSON.stringify(yibaoPayBackParams.value),
        }),
      });
    },
  });
};

//两种网络医院
const getSrc = (para, _payload: any = {}) => {
  const payload = {};
  for (const key in _payload) {
    if (!(key in para)) {
      payload[key] = _payload[key];
    }
  }

  // 网络医院有老版本和3.0版本
  const sysCodeList = ["1001033"];
  let sysCode = global.SYS_CODE;
  let netUrl = "";
  let params = "";
  let netPath = "";

  // 演示乐清项目, 对应互联网嘉兴
  if (sysCode === '1001052') {
    sysCode = '1001038'
  }

  if (para._url) {
    netPath = decodeURIComponent(para._url);
    delete para._url;
  } else if (_payload._url) {
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
    ...payload,
  });
  // let fPath = "https://interhos.eheren.com/static/nhs/1001060/#/?initSysCode=1001060&params=H3tiGzGqpbh31rG5v%2FFV6smFfZbiVwlm2eAxqYEVQ5t%2BCnnGYyPy41wG%2BR8fQ%2F01BrOV69n9QXKJ1x%2FkeHlXV7sGdk%2BjYiOR5gSPViXu4aDao%2Fwwyj8X0TSwyTkodphzwRiGrqC8mMT%2BxnEfDRC1%2FmJk0PL%2BBOqPHMCsCJ0ThkwinzJrFff0JZ8EYyOggi9HYEcfvAVZGS2luN%2Bl8UwIBZxm22FhatgDSX8wH3SfgsRfwMdvgZJnw4hYI53xl9%2FII6kQE42R0CmnLrkaUlOBUMhWpJ9Nf9Ff%2F%2F2ThjO3jRGAZhUg%2FEAHwDjW6BMafM%2FeuDr4ZtrNW98A0heE5oidT%2FUh%2BEKy3qTCYytvvuVdZQZrDTGCGdSKMHFoP4YP5DH0OghRfkf290uR4aIc5xcaanRcEEsEJkg3FPH4Xo2UhH%2FlsYbsRF3RBme04qsM4P%2FdkpmmM7xQawPLTjWfV%2FSH1uCI6V1MekC956M1SW2aFu%2BOtWyDpbJwkVWyW957Zn5g0ry2wldvtDIMvkHGpvom1uToKsB8DgQC6mexXegzTU8gPrAd406iyH5ejZ2WJinJwdCBy70LzGSBi0OL9Z6%2Bu6dSVOqGddTe7c2zgiarSqc01iz2yoBKOsYt2MBZpquuTv%2FezoUllvpwPV%2Fymgf%2F9nvkmiVF82v5fJgnokS8b4v%2BM3DpwdmdhBtL7TWpB40n%2FpsNxJ0deDQ%3D"

  src.value = fPath;

  isShow.value = true;

  console.warn("跳转网络医院携带数据", para);
  console.warn("跳转网络医院的路径", src.value);
};

const handleMessage = (evt) => {
  var data = evt.target.data;
  console.warn("获取到返回--------------", data);
  console.warn("编码----------------");
  // #ifdef MP-WEIXIN
  var paymentData = data[0].invokeData;
  let registerId = data[0].registerId;
  let payBackParams = encodeURIComponent(JSON.stringify(data[0].payBackParams));
  console.warn(payBackParams);
  if (paymentData) {
    uni.requestPayment({
      timeStamp: paymentData.timeStamp,
      nonceStr: paymentData.nonceStr,
      package: paymentData.package,
      signType: paymentData.signType,
      paySign: paymentData.paySign,
      success: () => {
        uni.navigateTo({
          url: joinQuery("/pagesC/cloudHospital/cachePage", {
            payment: "next",
            registerId: registerId,
            payBackParams: payBackParams,
          }),
        });
      },
      fail: () => {
        uni.showToast({
          title: "已取消",
          icon: "none",
        });
        setTimeout(() => {
          uni.navigateTo({
            url: joinQuery("/pagesC/cloudHospital/cachePage", {
              payment: "back",
              registerId: registerId,
              payBackParams: payBackParams,
            }),
          });
        }, 1000);
      },
      provider: "wxpay",
      orderInfo: "",
    });
  }
  // #endif
  // #ifdef MP-ALIPAY
  let insuranceParams = data.insuranceParams;
  yibaoPayBackParams.value = data.payBackParams;
  yibaoRegisterId.value = data.registerId;
  if (insuranceParams) {
    let params = {
      // 机构ID
      orgId: insuranceParams.orgId,
      // 院内卡 卡号
      cardNo: insuranceParams.cardNo,
      // 院内卡 卡类型
      cardType: insuranceParams.cardType,
      // 医疗机构订单号
      medOrgOrd: insuranceParams.medOrgOrd,
    };
    console.log("获取到医保数据", insuranceParams, params);
    const authPayPlugin = requirePlugin("auth-pay-plugin");
    // 调用支付方法前，需要获取授权
    my.getAuthCode({
      scopes: ["auth_user", "nhsamp"],
      success: (res) => {
        const { authCode } = res;
        authPayPlugin.toAuthAndPay({
          // 授权获取的authCode
          authCode,
          // 请求接口所需参数
          params,
        });
      },
    });
  }
  // #endif
};
</script>

<style scoped></style>
