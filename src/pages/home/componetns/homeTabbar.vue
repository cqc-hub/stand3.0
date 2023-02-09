<template>
  <view
    :class="{
      ios: isIos,
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
          mode="widthFix"
        />
        <text class="label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import global from '@/config/global';

  import { setLocalStorage, getLocalStorage } from '@/common';

  const SYS_TAB_KEY = 'SYS_TAB_KEY';
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

    if (url !== currentPath) {
      // if (item.url == "netHospital") {
      //   //目前只有咸阳对接是小程序
      //   let obj = global.sConfig.isOpenButtom as any;
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
  isIos.value = systemInfo.startsWith('iOS');

  onMounted(async () => {
    if (global.sConfig.isOpenButtom) {
      tabBars.value.splice(1, 0, {
        label: '互联网医院',
        icon: '/static/image/wlyy.png',
        iconActive: '/static/image/wlyy_active.png',
        url: '/pagesC/cloudHospital/cloudHospital',
      });
    }

    if (!isIos.value) {
      const { system } = await uni.getSystemInfo({});
      isIos.value = system.startsWith('iOS');

      setLocalStorage({
        [SYS_TAB_KEY]: system,
      });
    }
  });
</script>

<style lang="scss" scoped>
  .tabbar {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: var(--h-color-white);
    border-top: 1rpx solid var(--hr-neutral-color-2);
    box-shadow: 2rpx 0 6px rgba(0, 0, 0, 0.06);
    z-index: 2;
    padding-top: 20rpx;
    height: 120rpx;

    &.ios {
      height: 160rpx;
    }

    .tabbar-container {
      display: flex;
      justify-content: space-around;
      height: 100%;
      flex: 1;

      .tabbar-item {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        position: relative;
        flex: 1;
        height: 100%;

        .label {
          font-size: var(--h-size-40);
          color: var(--hr-neutral-color-8);
          margin-top: 10rpx;
        }

        image {
          width: 48rpx;
          height: 48rpx;
        }
      }
    }
  }
</style>
