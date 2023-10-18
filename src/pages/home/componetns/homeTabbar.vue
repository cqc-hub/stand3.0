<template>
  <view
    :class="{
      ios: isIos,
      'system-mode-old': systemModeOld,
    }"
    class="tabbar"
  >
    <view class="tabbar-container">
      <view
        v-for="(item, i) in tabBars"
        :key="i"
        @click="changeTab(item)"
        class="tabbar-item"
      >
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
    },
    {
      label: '我的',
      icon: '/static/image/my.png',
      iconActive: '/static/image/my_active.png',
      url: '/pages/home/my',
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
      //   let obj = global.sConfig.isOpenButton as any;
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
    if (global.sConfig.isOpenButton) {
      tabBars.value.splice(1, 0, {
        label: '互联网医院',
        icon: '/static/image/wlyy.png',
        iconActive: '/static/image/wlyy_active.png',
        url: '/pagesC/cloudHospital/cloudHospital',
      });
    }

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
        padding-top: 20rpx;

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
      }
    }
  }
</style>
