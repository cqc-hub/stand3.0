<template>
  <view
    :class="{
      'system-mode-old': systemModeOld,
    }"
    :style="{
      'padding-bottom': heightPb + 'rpx',
    }"
    class="tabbar"
  >
    <view class="tabbar-container relative">
      <view v-if="hasCenterCode" class="center-code-mask"></view>
      <view
        v-for="(item, i) in tabBars"
        :key="i"
        :class="{
          'n-item': !isCenterCode(item),
        }"
        class="tabbar-item"
      >
        <g-login
          class="w100p h100p"
          @handler-next="changeTab(item)"
          :disabled="item.loginInterception === '0'"
        >
          <view class="w100p h100p" @click="changeTab(item)">
            <view
              :class="{
                'center-code': isCenterCode(item),
              }"
              class="pt20 column"
            >
              <view v-if="isCenterCode(item)" class="center-code-ico-box flex">
                <view class="center-code-ico flex justify-center items-center">
                  <view class="iconfont icon-size color-fff f48">&#xe6a7;</view>
                </view>
              </view>
              <image
                v-else
                :src="
                  currentPath === getPath(item.url)
                    ? item.iconActive
                    : item.icon
                "
                :class="{
                  animate__rubberBand:
                    animateItem(item) && clickCount % 2 === 0,
                }"
                mode="heightFix"
                class="animate__animated animate__fast"
                lazy-load
              />
              <text
                :class="{
                  'color-blue': isCenterCode(item),
                }"
                class="label text-no-wrap"
              >
                {{ getLangLabel(item.label) }}
              </text>
              <view
                class="badge"
                v-if="item.label === 'home-tabbar:消息中心' && unreadMes"
              >
                new
              </view>
            </view>
          </view>
        </g-login>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';

  import { setLocalStorage, getLocalStorage } from '@/common';

  import {
    useTBanner,
    throttle,
    GStores,
    cacheUtil,
    getSystemSafeBottom,
  } from '@/utils';
  import { isAreaProgram } from '@/stores';
  import { getLangLabel } from '@/config/lang';

  import globalGl from '@/config/global';
  import global from '@/config/global';
  import api from '@/service/api';

  defineProps<{ systemModeOld: boolean }>();
  const gStores = new GStores();

  const clickCount = ref(0);
  const heightPb = ref(0);
  const current = ref('');
  const tabBars = ref([
    {
      label: 'home-tabbar:首页',
      icon: '/static/image/home.png',
      iconActive: `/static/image/home_active${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      url: '/pages/home/home',
      loginInterception: '0',
      sort: 1,
    },
    {
      label: 'home-tabbar:我的',
      icon: '/static/image/my.png',
      iconActive: `/static/image/my_active${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`,
      url: '/pages/home/my',
      loginInterception: '0',
      sort: 4,
    },
  ]);

  const pages = getCurrentPages();
  const currentPage = pages.slice(-1)[0];
  // @ts-expect-error
  let currentPath = currentPage?.$page?.fullPath;
  if (!currentPath) {
    currentPath = '/' + currentPage.route;
  }

  const isIos = ref(false);
  const unreadMes = ref(false);

  const changeTab = async (item) => {
    const url = item.url;

    if (url === 'mDisease') {
      useTBanner({
        type: 'h5',
        isSelfH5: '1',
        path: 'mDisease/index/index',
        addition: {
          patientId: '_patientId',
        },
      });
      return;
    }
    if (url === 'healthMall') {
      useTBanner({
        type: 'self',
        path: 'pagesC/scan/scan',
        extraData: {
          _type: 'useTBanner',
          type: 'h5',
          path:
            globalGl.env === 'prod'
              ? 'https://shop.jshtcm.com/mobile/pages/login/index'
              : 'https://jksc.eheren.com/mobile/pages/login/index',
          addition: {
            TOKEN: 'token',
            PATIENTID: 'patientId',
            HERENID: 'herenId',
            OPENID: 'openId',
          },
          extraData: {
            sysCode: gStores.globalStore.sysCode,
            reqForward: 'true',
            source: gStores.globalStore.browser.source,
          },
        },
      });
      return;
    }

    if (url === '/pages/home/my') {
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

      if (isCenterCode(item)) {
        uni.navigateTo({
          url: item.url,
        });
      } else {
        uni.reLaunch({
          url: item.url,
        });
      }
      // }
    }
  };

  current.value = currentPath;

  const animateItem = (item) => {
    return currentPath === item.url && item.url === '/pages/home/my';
  };

  let getNum = () => {
    api
      .getStatus({
        str: `OPENID_${gStores.globalStore.h5OpenId}/${gStores.userStore.phoneNum}`,
      })
      .then(({ result }) => {
        unreadMes.value = result as boolean;
        // unreadMes.value = true;
      });
  };
  getNum = throttle(getNum, 1000);

  onMounted(async () => {
    getMenuBtn();
    if (
      global.sConfig.isOpenHomeTabBarMessageBtn &&
      global.sConfig.isMessageBtnShowNew
    ) {
      if (gStores.userStore.patChoose.patientId) {
        getNum();
      }
    }
    heightPb.value = await getSystemSafeBottom();
  });

  const hasCenterCode = ref(false);
  const getMenuBtn = async () => {
    let tabBarList = [
      {
        label: 'home-tabbar:首页',
        icon: '/static/image/home.png',
        iconActive: `/static/image/home_active${
          gStores.globalStore.isTcmStyle ? '-tcm' : ''
        }.png`,
        url: '/pages/home/home',
        loginInterception: '0',
        sort: 1,
      },
      {
        label: 'home-tabbar:互联网医院',
        icon: '/static/image/wlyy.png',
        iconActive: `/static/image/wlyy_active${
          gStores.globalStore.isTcmStyle ? '-tcm' : ''
        }.png`,
        url: '/pagesC/cloudHospital/cloudHospital',
        loginInterception: '0',
        sort: 2,
      },
      {
        label: 'home-tabbar:云诊室',
        icon: '/static/image/wlyy.png',
        iconActive: `/static/image/wlyy_active${
          gStores.globalStore.isTcmStyle ? '-tcm' : ''
        }.png`,
        url: '/pagesC/cloudHospital/myPath?path=/pagesA/MyRegistration/registrationTypeYun',
        loginInterception: '0',
        sort: 2,
      },
      {
        label: 'home-tabbar:健康商城',
        icon: global.BASE_IMG + 'oral-mall-home-icon.png',
        iconActive: `/static/image/oral-mall-home-icon-active${
          gStores.globalStore.isTcmStyle ? '-tcm' : ''
        }.png`,
        url: 'healthMall',
        loginInterception: '0',
        sort: 3,
      },
      {
        label: 'home-tabbar:健康管理',
        icon: global.BASE_IMG + 'leqin-mdisease-home-icon.png',
        iconActive: global.BASE_IMG + 'leqin-mdisease-home-icon.png',
        url: 'mDisease',
        loginInterception: '0',
        sort: 2,
      },
      {
        label: 'home-tabbar:服务',
        icon: '/static/image/wlyy.png',
        iconActive: `/static/image/wlyy_active${
          gStores.globalStore.isTcmStyle ? '-tcm' : ''
        }.png`,
        url: '/pages/home/home',
        loginInterception: '0',
        sort: 2,
      },
      {
        label: 'home-tabbar:科普',
        icon: global.BASE_IMG + 'oral-mall-home-icon.png',
        iconActive: global.BASE_IMG + 'oral-mall-home-icon-active.png',
        url: '/pagesC/commonHosNet/commonHosNet?returnUrl=pages%2Fv3%2FfreeClinic%2FchooseDept%3FhosId%3D480%26isHealthSciencePopularization%3D1',
        loginInterception: '1',
        sort: 2,
      },
      {
        label: 'home-tabbar:便民',
        icon: '/static/image/wlyy.png',
        iconActive: global.BASE_IMG + 'oral-mall-home-icon-active.png',
        url: '/pagesD/common/homeGrid?showTab=5',
        loginInterception: '0',
        sort: 3,
      },
      {
        label: 'home-tabbar:消息中心',
        icon: '/static/image/wlyy.png',
        iconActive: `/static/image/wlyy_active${
          gStores.globalStore.isTcmStyle ? '-tcm' : ''
        }.png`,
        url: '/pagesC/cloudHospital/myPath?path=/pagesB/historicalMess/historicalMess&query=["phone","h5OpenId"]&loginInterception=1',
        loginInterception: '1',
        sort: 3,
      },
      {
        label: 'home-tabbar:我的',
        icon: '/static/image/my.png',
        iconActive: `/static/image/my_active${
          gStores.globalStore.isTcmStyle ? '-tcm' : ''
        }.png`,
        url: '/pages/home/my',
        loginInterception: '0',
        sort: 4,
      },
    ];

    const tabList: (typeof tabBarList)[number]['label'][] = [
      'home-tabbar:首页',
      'home-tabbar:我的',
    ];

    if (global.sConfig.isOpenHomeTabBarNetWorkBtn) {
      tabList.push('home-tabbar:互联网医院');
    }

    if (
      global.sConfig.isOpenHomeTabBarMessageBtn &&
      gStores.globalStore.ev === 'wx'
    ) {
      tabList.push('home-tabbar:消息中心');
    }

    if (global.SYS_CODE === '1001052') {
      tabList.push('home-tabbar:健康管理');
    }

    if (global.SYS_CODE === '1001035') {
      // tabList.push('home-tabbar:云诊室');
      // tabList.push('home-tabbar:健康商城');
    }

    if (global.SYS_CODE === '1001036') {
      //东总煞笔需求
      tabList.push('home-tabbar:便民');
      tabList.push('home-tabbar:科普');
    }

    const {
      HomeTabBar: { tabs = [] },
    } = await cacheUtil.getSystemConfig('HomeTabBar')();

    tabList.push(...tabs);

    tabBars.value = tabBarList
      .filter((o) => tabList.includes(o.label))
      .sort((a, b) => a.sort - b.sort);

    // 固定插入中间
    if (
      !(tabBars.value.length % 2) &&
      !isAreaProgram() &&
      global.SYS_CODE !== '1001036'
    ) {
      const d = {
        label: 'home-tabbar:就诊码/医保码',
        icon: '/static/image/my.png',
        iconActive: `/static/image/my_active${
          gStores.globalStore.isTcmStyle ? '-tcm' : ''
        }.png`,
        url: '/pagesA/medicalCardMan/electronicMedicalCard?showNavBar=1&dp=1',
        loginInterception: '1',
        sort: 4,
      };
      tabBars.value.splice(tabBars.value.length / 2, 0, d);
      hasCenterCode.value = true;
    }
  };

  const isCenterCode = (item) => item.label === 'home-tabbar:就诊码/医保码';

  // 提取路径部分的函数
  const getPath = (url: string) => {
    return url.split('?')[0];
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

        &.n-item {
          &:active {
            background-color: var(--hr-neutral-color-1);
          }
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
          bottom: calc(
            var(--hr-font-size-xxl) + var(--hr-font-size-xxxs) + 35rpx
          );
          left: calc(var(--hr-font-size-xxl) / 2 + 5rpx);
        }
      }
    }
  }

  .center-code {
    position: relative;
    bottom: 24px;
    .tabbar-item {
      .label {
        color: var(--hr-brand-color-6);
      }
    }

    .center-code-ico-box {
      background: #fff;
      // box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
      border-radius: 50% 50% 0 0;

      padding: 12px;
      padding-bottom: 0;
    }

    .center-code-ico {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.04);
      background: linear-gradient(
        0deg,
        var(--h-qrcode-1),
        var(--h-qrcode-2) 100%
      );
    }
  }

  .center-code-mask {
    background: transparent;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
    border-radius: 50% 50% 0 0;
    position: absolute;
    transform: translateX(-50%);
    width: 52px;
    height: 42px;
    top: -15px;
    left: 50%;
    pointer-events: none;
  }
</style>
