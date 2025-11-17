<template>
  <view>
    <!-- #ifdef MP-WEIXIN | MP-ALIPAY   -->
    <view class="pb70">
      <view class="custom-nav" :style="{ height: navTotalHeight + 'px' }">
        <view :style="{ height: statusBarHeight + 'px' }"></view>
        <view v-if="$global.systemInfo.homeNavTitleLogo" class="pl32">
          <image
            :src="$global.systemInfo.homeNavTitleLogo"
            mode="widthFix"
            class="logo"
          />
        </view>
        <view v-else class="nav-content g-bold">
          {{ $global.systemInfo.name }}
        </view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  const isIos = ref(false);

  const statusBarHeight = ref(0);
  // 导航栏内容高度
  const navContentHeight = ref(0);
  // 状态栏+导航栏总高度
  const navTotalHeight = ref(0);

  uni.getSystemInfo({
    success(e) {
      const { system } = e;
      if (system.includes('iOS')) {
        isIos.value = true;
      }
    },
  });

  onMounted(() => {
    const sysInfo = uni.getSystemInfoSync() as any;
    statusBarHeight.value = sysInfo.statusBarHeight;
    navTotalHeight.value = statusBarHeight.value + navContentHeight.value;
    hideNativeNavigation();
  });

  const hideNativeNavigation = () => {
    // #ifdef MP-ALIPAY
    // 方法1: 支付宝官方API隐藏导航栏
    my.setNavigationBar({
      hidden: true,
      animation: { duration: 0 },
    });

    // 方法2: 清空标题
    my.setNavigationBarTitle({ title: '' });

    // 方法4: 延迟再执行一次确保生效
    setTimeout(() => {
      my.setNavigationBar({ hidden: true });
      my.setNavigationBarTitle({ title: '' });
    }, 100);
    // #endif
  };
</script>

<style lang="scss" scoped>
  /* 导航栏容器 */
  ::v-deep .ap-navigation-bar {
    display: none !important;
    height: 0 !important;
    min-height: 0 !important;
    visibility: hidden !important;
  }

  /* 返回箭头 */
  ::v-deep .ap-navigation-bar__left {
    display: none !important;
  }

  /* 标题容器 */
  ::v-deep .ap-navigation-bar__title {
    display: none !important;
  }

  /* 右侧按钮区 */
  ::v-deep .ap-navigation-bar__right {
    display: none !important;
  }

  /* 支付宝可能的其他导航相关类 */
  ::v-deep .am-navbar {
    display: none !important;
  }
  ::v-deep .am-navbar-left {
    display: none !important;
  }
  ::v-deep .am-navbar-title {
    display: none !important;
  }

  /* 页面基础样式重置 */
  ::v-deep page {
    padding-top: 0 !important;
    margin-top: 0 !important;
  }

  /* 自定义导航样式 */
  .custom-nav {
    width: 100%;
    // position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: transparent;
  }

  .nav-content {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo {
    height: 66rpx;
    max-width: 500rpx;
  }
</style>
