<template>
  <view
    class="g-page"
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
  >
    <scroll-view class="g-container" scroll-y>
      <ls-skeleton :skeleton="skeletonProps.skeleton" :loading="skeletonProps.loading">
        <view class="top-bg" />
        <personRecord />

        <view class="my-menu" v-if="!gStores.globalStore.modeOld">
          <view v-if="menu1List && menu1List.length" class="list">
            <view class="title">我的订单</view>
            <homeGrid :list="menu1List"  @open-share="openShare"></homeGrid>
          </view>
          <view v-if="menu2List && menu2List.length" class="list">
            <view class="title">我的服务</view>
            <homeGrid :list="menu2List"  @open-share="openShare"></homeGrid>
          </view>
          <view v-if="menu3List && menu3List.length" class="list">
            <view class="title">我的工具</view>
            <homeGrid :list="menu3List"  @open-share="openShare"></homeGrid>
          </view>
        </view>
        <view class="my-menu old" v-if="gStores.globalStore.modeOld">
          <homeGrid :list="menu1List" :type="3"></homeGrid>
          <view class="isCloseOld flex-normal" @tap="openModeOld">
            <view class="iconfont icon-size">&#xe700;</view>
            关闭长辈模式
          </view>
        </view>
      </ls-skeleton>

      <view class="safe-height" />
    </scroll-view>

    <homePopup ref="refOldDialog" />
    <homeH5SharePopup ref="homeH5SharePopupRef" :imageUrl="$global.BASE_IMG+h5QrCodeImg"  />
    <home-Tabbar :systemModeOld="gStores.globalStore.modeOld" />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
import { defineComponent, ref, nextTick, onMounted, reactive } from "vue";
import { useUserStore, useMessageStore, useRouterStore } from "@/stores";
import { onLoad } from "@dcloudio/uni-app";
import { ServerStaticData, GStores, outLogin } from "@/utils";
import { encryptDes, getSysCode, joinQuery, joinQueryForUrl } from "@/common";
import { beforeEach } from "@/router/index";

import personRecord from "./componetns/personRecord.vue";
import homeTabbar from "./componetns/homeTabbar.vue";
import homeGrid from "./componetns/homeGrid.vue";
import homePopup from "./componetns/homePopup.vue";
import homeH5SharePopup from './componetns/homeH5SharePopup.vue';

const homeH5SharePopupRef = ref('' as any);
const h5QrCodeImg =ref('lqCode.jpg')

//骨架屏配置
const skeletonProps = ref({
  loading: true,
  skeleton: [
    "circle+line-sm*2",
    56,
    "card+card",
    24,
    "line-sm",
    "card+card+card+card",
    16,
    "line-sm",
    "card+card+card+card",
    16,
    "line-sm",
    "card+card+card+card",
  ],
});

interface TPageType extends ILoginBack {
  isWarningLogin?: "1";

  // 微信小程序必须显示写出来， 否则接收不到
  _p?: string;
  _url?: string;
  _query?: string;
  _type?: "1" | "2";
  _isOutLogin?: "1";
  _pageInfo?: "1" | "2";
}

const props = defineProps<TPageType>();
const messageStore = useMessageStore();
const routeStore = useRouterStore();
const gStores = new GStores();
const refOldDialog = ref();

const menu1List = ref([]); //我的订单
const menu2List = ref([]); //我的服务
const menu3List = ref([]); //我的工具

// 互联网医院
const dealHosNet = async (opt: {
  myhosType: "0" | "1";
  query: any;
  returnUrl: string;
}) => {
  /**
   * myhosType  '0' 需要登录  '1' 需要就诊人
   * query: '{}'
   * returnUrl  'pages/v3/collect/collectList'
   */

  let { myhosType, returnUrl, query } = opt;

  query = (query && JSON.parse(query)) || {};

  const fullUrl = joinQueryForUrl("/pagesC/cloudHospital/cloudHospital", {
    _url: encodeURIComponent(joinQueryForUrl(returnUrl, query)),
  });

  await beforeEach({
    url: fullUrl,
    _isLogin: myhosType === "0",
    _isPatient: myhosType === "1",
  });
};

onLoad((opt) => {
  // #ifdef MP-WEIXIN
  wx.showShareMenu({
    // 要求小程序返回分享目标信息
    withShareTicket: true,
  });
  // #endif

  if (opt) {
    const { myEnvir } = opt;

    if (myEnvir && myEnvir === "hosnet") {
      dealHosNet(<any>opt);
    }
  }
});

onMounted(async () => {
  routeStore.receiveQuery(props);

  getHomeConfig();
  if (props.isWarningLogin) {
    messageStore.showMessage("未登录,请先登录", 1000);
  } else if (props._isOutLogin) {
    messageStore.showMessage("登录过期,请重新登录", 1000);
  }

  if (gStores.globalStore.isLogin && !gStores.userStore.authPhoneVerify) {
    outLogin({
      isHideMessage: true,
    });
  }
});
const openModeOld = () => {
  if (refOldDialog.value) {
    refOldDialog.value.show();
  }
};
//获取配置数据
const getHomeConfig = async () => {
  skeletonProps.value.loading = true;
  const homeConfig = await ServerStaticData.getHomeConfig();
  if (homeConfig) {
    menu1List.value = homeConfig[5].functionList;
    menu2List.value = homeConfig[6].functionList;
    menu3List.value = homeConfig[7].functionList;
    skeletonProps.value.loading = false;
  }
};
 
  //打开关注框
  const openShare = (item)=>{ 
    h5QrCodeImg.value = item
    homeH5SharePopupRef.value.show()
  } 
</script>

<style lang="scss" scoped>
.top-bg {
  height: 500upx;
  width: 100%;
  position: absolute;
  pointer-events: none;
  z-index: 1;

  background: linear-gradient(160deg, #13b8ff2a, #13b8ff2a, rgba(255, 0, 0, 0) 50%),
    linear-gradient(-160deg, #c1d4ff97, #c1d4ff59, rgba(0, 255, 0, 0) 50%);
}
.my-menu {
  padding: 0 32rpx;
  margin-bottom: 188rpx;
  .list {
    background: var(--h-color-white);
    border: 1rpx solid var(--hr-neutral-color-2);
    border-radius: 16rpx;
    box-shadow: 0px 8rpx 24rpx 0px rgba(0, 0, 0, 0.05);
    padding-bottom: 12rpx;
    margin-bottom: 16rpx;

    .title {
      padding: 32rpx 32rpx 16rpx 32rpx;
      color: var(--hr-neutral-color-10);
      font-weight: var(--h-weight-2);
    }
  }
}
.old{
  background-color: #fff;
  padding:32rpx;
}
.icon-camera {
  position: relative;
  font-size: 40px;
  color: red;
  mask: linear-gradient(to bottom, #283237, transparent);
}

.isCloseOld {
  width: 384rpx;
  color: #444;
  padding: 24rpx 0 22rpx;
  background: #ffffff;
  border: 2rpx solid #cccccc;
  border-radius: 50px;
  margin: 40rpx auto;
  justify-content: center;
  font-size: 32rpx;
  .icon-size {
    font-size: 42rpx;
  }
}
</style>
