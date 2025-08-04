<template>
  <view
    :class="{
      ios: isIos,
      'system-mode-old': systemModeOld,
    }"
    class="tabbar"
  >
    <view class="tabbar-container">
      <view v-for="(item, i) in tabBars" :key="i" class="tabbar-item">
        <g-login class="w100p h100p" @handler-next="changeTab(item)" :disabled="item.loginInterception === '0'">
          <view class="w100p h100p" @click="changeTab(item)">
            <view class="pt20 column">
              <image
                :src="currentPath === getPath(item.url) ? item.iconActive : item.icon"
                :class="{
                  animate__rubberBand: animateItem(item) && clickCount % 2 === 0,
                }"
                mode="heightFix"
                class="animate__animated animate__fast"
              />
              <text class="label">{{ item.label }}</text>
              <view class="badge" v-if="item.label === '消息中心' && unreadMes"> new </view>
            </view>
          </view>
        </g-login>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUpdated } from "vue";

import { setLocalStorage, getLocalStorage } from "@/common";

import global from "@/config/global";
import { useTBanner, throttle, GStores } from "@/utils";
import api from "@/service/api";

defineProps<{ systemModeOld: boolean }>();
const gStores = new GStores();

const SYS_TAB_KEY = "SYS_TAB_KEY";
const clickCount = ref(0);
const current = ref("");
const tabBars = ref([
  {
    label: "首页",
    icon: "/static/image/home.png",
    iconActive: `/static/image/home_active${gStores.globalStore.isTcmStyle ? "-tcm" : ""}.png`,
    url: "/pages/home/home",
    loginInterception: "0",
    sort: 1,
  },
  {
    label: "我的",
    icon: "/static/image/my.png",
    iconActive: `/static/image/my_active${gStores.globalStore.isTcmStyle ? "-tcm" : ""}.png`,
    url: "/pages/home/my",
    loginInterception: "0",
    sort: 4,
  },
]);

const pages = getCurrentPages();
const currentPage = pages.slice(-1)[0];
const currentPath = "/" + currentPage.route;
const isIos = ref(false);
const unreadMes = ref(false);

const changeTab = async (item) => {
  const url = item.url;

  if (url === "mDisease") {
    useTBanner({
      type: "h5",
      isSelfH5: "1",
      path: "mDisease/index/index",
      addition: {
        patientId: "_patientId",
      },
    });
    return;
  }
  if (url === "healthMall") {
    useTBanner({
      type: "self",
      path: "pagesC/scan/scan",
      extraData: {
          _type: "useTBanner",
          type: "h5",
          path: "https://jksc.eheren.com/mobile/pages/login/index",
          addition: { TOKEN: "token", PATIENTID: "patientId", HERENID: "herenId", OPENID: "openId" },
          extraData: { sysCode: gStores.globalStore.sysCode, reqForward: "true", source: gStores.globalStore.browser.source },
      },
    });
    return;
  }

  if (url === "/pages/home/my") {
    clickCount.value++;

    setTimeout(() => {
      clickCount.value--;
    }, 100);
  }

  if (url !== currentPath) {
    // if (item.url == "netHospital") {
    //   //目前只有咸阳对接是小程序
    //   let obj = global.sConfig.isOpenHomeTabBarNetWorkBtn as any;
    //   uni.navigateToMiniProgram({
    //     appId: obj.appId,
    //     path: obj.path,
    //   });
    // } else {

    uni.reLaunch({
      url: item.url,
    });
    // }
  }
};

current.value = currentPath;

const systemInfo = getLocalStorage(SYS_TAB_KEY) || "";
isIos.value = !!systemInfo;

const animateItem = (item) => {
  return currentPath === item.url && item.url === "/pages/home/my";
};

let getNum = () => {
  api
    .getStatus({
      str: `OPENID_${gStores.globalStore.openId}/${gStores.userStore.phoneNum}`,
    })
    .then(({ result }) => {
      unreadMes.value = result as boolean;
      // unreadMes.value = true;
    });
};
getNum = throttle(getNum, 1000);

onMounted(async () => {
  getMenuBtn();
  if (systemInfo === "") {
    const e = await uni.getSystemInfo({});
    // @ts-expect-error
    const { system, osName } = e;
    isIos.value = system.startsWith("iOS") || osName === "ios";

    setLocalStorage({
      [SYS_TAB_KEY]: isIos.value,
    });
  }
  if (global.sConfig.isOpenHomeTabBarMessageBtn && global.sConfig.isMessageBtnShowNew) {
    if (gStores.userStore.patChoose.patientId) {
      getNum();
    }
  }
});

const getMenuBtn = () => {
  let tabBarList = [
    {
      label: "首页",
      icon: "/static/image/home.png",
      iconActive: `/static/image/home_active${gStores.globalStore.isTcmStyle ? "-tcm" : ""}.png`,
      url: "/pages/home/home",
      loginInterception: "0",
      sort: 1,
    },
    {
      label: "互联网医院",
      icon: "/static/image/wlyy.png",
      iconActive: `/static/image/wlyy_active${gStores.globalStore.isTcmStyle ? "-tcm" : ""}.png`,
      url: "/pagesC/cloudHospital/cloudHospital",
      loginInterception: "0",
      sort: 2,
    },
    {
      label: "云诊室",
      icon: "/static/image/wlyy.png",
      iconActive: `/static/image/wlyy_active${gStores.globalStore.isTcmStyle ? "-tcm" : ""}.png`,
      url: "/pagesC/cloudHospital/myPath?path=/pagesA/MyRegistration/registrationTypeYun",
      loginInterception: "0",
      sort: 2,
    },
    {
      label: "健康商城",
      icon: global.BASE_IMG + "oral-mall-home-icon.png",
      iconActive: `/static/image/oral-mall-home-icon-active${gStores.globalStore.isTcmStyle ? "-tcm" : ""}.png`,
      url: "healthMall",
      loginInterception: "0",
      sort: 3,
    },
    {
      label: "健康管理",
      icon: global.BASE_IMG + "leqin-mdisease-home-icon.png",
      iconActive: global.BASE_IMG + "leqin-mdisease-home-icon.png",
      url: "mDisease",
      loginInterception: "0",
      sort: 2,
    },
    {
      label: "口腔商城",
      icon: global.BASE_IMG + "oral-mall-home-icon.png",
      iconActive: global.BASE_IMG + "oral-mall-home-icon-active.png",
      url:
        "/pagesE/miniprogram_dist/pages/oralMall/oralMall?hospitalId=202505190001&subhospitalId=202505191001&isHome=true",
      loginInterception: "0",
      sort: 2,
    },
    {
      label: "服务",
      icon: "/static/image/wlyy.png",
      iconActive: `/static/image/wlyy_active${gStores.globalStore.isTcmStyle ? "-tcm" : ""}.png`,
      url: "/pages/home/home",
      loginInterception: "0",
      sort: 2,
    },
    {
      label: "消息中心",
      icon: "/static/image/wlyy.png",
      iconActive: `/static/image/wlyy_active${gStores.globalStore.isTcmStyle ? "-tcm" : ""}.png`,
      url:
        '/pagesC/cloudHospital/myPath?path=/pagesB/historicalMess/historicalMess&query=["phone","h5OpenId"]&loginInterception=1',
      loginInterception: "1",
      sort: 3,
    },
    {
      label: "我的",
      icon: "/static/image/my.png",
      iconActive: `/static/image/my_active${gStores.globalStore.isTcmStyle ? "-tcm" : ""}.png`,
      url: "/pages/home/my",
      loginInterception: "0",
      sort: 4,
    }
  ] ;

  const tabList: typeof tabBarList[number]["label"][] = ["首页", "我的"];

  if (global.sConfig.isOpenHomeTabBarNetWorkBtn) {
    tabList.push("互联网医院");
  }

  if (global.sConfig.isOpenHomeTabBarMessageBtn) {
    // #ifdef MP-WEIXIN
    tabList.push("消息中心");
    // #endif
  }

  if (global.SYS_CODE === "1001052") {
    tabList.push("健康管理");
  }

  // #ifdef MP-WEIXIN
  if (global.SYS_CODE === "1001063") {
    tabList.push("口腔商城");
  }
  // #endif

  if (global.SYS_CODE === "1001035") {
    // tabList.push("云诊室");
    // tabList.push("健康商城");
  }

  if (global.SYS_CODE === "1001082") {
    tabList.push("服务");
    tabBarList[0].url = "/pagesA/intelMedicalAssist/intelMedicalAssist";
  }


  tabBars.value = tabBarList.filter((o) => tabList.includes(o.label)).sort((a, b) => a.sort - b.sort);
};

// 提取路径部分的函数
const getPath = (url: string) => {
  return url.split("?")[0];
};
</script>

<style lang="scss" scoped>
@keyframes rubberBandHref {
  from {
    transform: scale3d(1, 1, 1);
  }

  to {
    transform: scale3d(1.15, 1.05, 1);
  }
}

.tabbar {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: var(--h-color-white);
  border-top: 1rpx solid var(--hr-neutral-color-2);
  box-shadow: 2rpx 0 6px rgba(0, 0, 0, 0.06);
  z-index: 2;
  height: 120rpx;

  &.ios {
    height: 160rpx;
  }

  .tabbar-container {
    display: flex;
    justify-content: space-around;
    flex: 1;
    height: 100%;

    .tabbar-item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      // padding-top: 20rpx;

      position: relative;
      flex: 1;

      &:active {
        background-color: var(--hr-neutral-color-1);
      }

      .label {
        font-size: var(--hr-font-size-xxxs);
        color: var(--hr-neutral-color-8);
        margin-top: 10rpx;
        user-select: none;
      }

      image {
        width: var(--hr-font-size-xxl);
        height: var(--hr-font-size-xxl);
      }

      &:active {
        .animate__rubberBand {
          animation: rubberBandHref ease 0.2s both;
        }
      }

      .column {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .badge {
        border: 1rpx solid red;
        border-radius: 17rpx;
        line-height: 28rpx;
        font-size: var(--h-size-18);
        padding: 0 8rpx;
        z-index: 1;
        background-color: var(--h-color-white);
        box-sizing: border-box;
        text-align: center;
        background-color: red;
        color: white;
        position: relative;
        font-weight: 700;
        bottom: calc(var(--hr-font-size-xxl) + var(--hr-font-size-xxxs) + 35rpx);
        left: calc(var(--hr-font-size-xxl) / 2 + 5rpx);
      }
    }
  }
}
</style>
