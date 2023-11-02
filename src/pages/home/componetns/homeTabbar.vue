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
        <g-login
          class="box"
          @handler-next="changeTab(item)"
          :disabled="item.loginInterception === '0'"
        >
          <view class="column w100p h100p pt20" @click="changeTab(item)">
            <image
              :src="currentPath === item.url ? item.iconActive : item.icon"
              :class="{
                animate__rubberBand: animateItem(item) && clickCount % 2 === 0,
              }"
              mode="heightFix"
              class="animate__animated animate__fast"
            />
            <text class="label">{{ item.label }}</text>
          </view>
        </g-login>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';

  import { setLocalStorage, getLocalStorage } from '@/common';

  import global from '@/config/global';

  defineProps<{ systemModeOld: boolean }>();

  const SYS_TAB_KEY = 'SYS_TAB_KEY';
  const clickCount = ref(0);
  const current = ref('');
  const tabBars = ref([
    {
      label: '首页',
      icon: '/static/image/home.png',
      iconActive: '/static/image/home_active.png',
      url: '/pages/home/home',
      loginInterception: '0',
      sort: 1,
    },
    {
      label: '我的',
      icon: '/static/image/my.png',
      iconActive: '/static/image/my_active.png',
      url: '/pages/home/my',
      loginInterception: '0',
      sort: 4,
    },
  ]);

  const pages = getCurrentPages();
  const currentPage = pages.slice(-1)[0];
  const currentPath = '/' + currentPage.route;
  const isIos = ref(false);

  const changeTab = (item) => {
    const url = item.url;

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
      uni.reLaunch({
        url: item.url,
      });
      // }
    }
  };

  current.value = currentPath;

  const systemInfo = getLocalStorage(SYS_TAB_KEY) || '';
  isIos.value = !!systemInfo;

  const animateItem = (item) => {
    return currentPath === item.url && item.url === '/pages/home/my';
  };

  onMounted(async () => {
    getMenuBtn();
    if (systemInfo === '') {
      const e = await uni.getSystemInfo({});
      // @ts-expect-error
      const { system, osName } = e;
      isIos.value = system.startsWith('iOS') || osName === 'ios';

      setLocalStorage({
        [SYS_TAB_KEY]: isIos.value,
      });
    }
  });

  const getMenuBtn = () => {
    const tabBarList = [
      {
        label: '首页',
        icon: '/static/image/home.png',
        iconActive: '/static/image/home_active.png',
        url: '/pages/home/home',
        loginInterception: '0',
        sort: 1,
      },
      {
        label: '互联网医院',
        icon: '/static/image/wlyy.png',
        iconActive: '/static/image/wlyy_active.png',
        url: '/pagesC/cloudHospital/cloudHospital',
        loginInterception: '1',
        sort: 2,
      },
      {
        label: '消息中心',
        icon: '/static/image/wlyy.png',
        iconActive: '/static/image/wlyy_active.png',
        url: '/pagesC/cloudHospital/myPath?path=/pagesB/historicalMess/historicalMess&query=["phone","openId"]&loginInterception=1',
        loginInterception: '1',
        sort: 3,
      },
      {
        label: '我的',
        icon: '/static/image/my.png',
        iconActive: '/static/image/my_active.png',
        url: '/pages/home/my',
        loginInterception: '0',
        sort: 4,
      },
    ] as const;

    const tabList: (typeof tabBarList)[number]['label'][] = ['首页', '我的'];

    if (global.sConfig.isOpenHomeTabBarNetWorkBtn) {
      tabList.push('互联网医院');
    }

    if (global.sConfig.isOpenHomeTabBarMessageBtn) {
      tabList.push('消息中心');
    }

    tabBars.value = tabBarList
      .filter((o) => tabList.includes(o.label))
      .sort((a, b) => a.sort - b.sort);
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
        .box {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
</style>
