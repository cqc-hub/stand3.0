<template>
  <view class="cache">
    <view class="cache-img-container">
      <image v-if="globalStore.sysCode === '1001063' " mode="aspectFit" class="cache-img" :src="BASE_IMG + 'img_h5bg_hk@3x.png'" />
      <image v-else mode="aspectFit" class="cache-img" :src="BASE_IMG + 'img_h5bg@3x.png'" />
    </view>
    <view v-if="!$global.systemInfo.isHideHomeLogo" class="cache-fixbottom"> 浙江和仁科技股份有限公司@技术支持 </view>
    <g-message />
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from "@dcloudio/uni-app";

import { BASE_IMG } from "@/config/global";
import { useGlobalStore } from "@/stores";
import { wait, GStores } from "@/utils";
import { setLocalStorage, getLocalStorage, joinQueryForUrl, joinQuery } from "@/common";
const globalStore = useGlobalStore();
const gStores = new GStores();

const gotoNext = (options) => {
  setTimeout(() => {
    uni.navigateTo({
      url: joinQuery("/pagesC/cloudHospital/cachePage", {
        ...options,
      }),
    });
  }, 1000);
};
onShow(async () => {
  console.warn("网络医院授权回来", gStores.globalStore.appShowData);
  // 微信医保小程序跳回来后中断了链路 重新走下
  if (getLocalStorage("get-wx-medical-auth-code") === "1" && gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode) {
    await wait(300);
    setLocalStorage({
      "get-wx-medical-auth-code": "",
    });
    if (gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode) {
      //获取授权码
      if (getLocalStorage("get-wx-medical-netWork-path")) {
        const resultConfig = JSON.parse(decodeURIComponent(getLocalStorage("get-wx-medical-netWork-path")));
        console.warn("有授权码的路径", resultConfig);
        console.warn("有授权码的路径参数", resultConfig.query);
        setLocalStorage({
          "get-wx-medical-netWork-path": "",
        });
        try {
          uni.navigateTo({
            url: joinQueryForUrl("/pagesC/cloudHospital/cachePage", {
              _url: resultConfig.path,
              ...resultConfig.query,
              authCode:gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode
            }),
          });
        } catch (error) {
          gStores.messageStore.showMessage("网络医院地址参数配置错误", 2000);
          console.error("网络医院地址参数配置错误", error);
        }
      } 
    } else {
      gStores.messageStore.showMessage("未完成电子医保凭证授权,无法继续医保结算");
    }
  } 
});

onLoad(async (options) => {
  //先登录拦截
  console.log('cloudHospital Options',options)
  await wait(200);
  if (options?.loginInterception == "1") {
    if (!globalStore.isLogin) {
      uni.showToast({
        title: "未登录，请先登录!",
        icon: "none",
      });
      setTimeout(() => {
        uni.reLaunch({
          url: "/pages/home/my",
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
    .cache-img{
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
