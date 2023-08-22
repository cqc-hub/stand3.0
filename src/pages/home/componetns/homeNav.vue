<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <view
      :class="{
        'is-ios': isIos,
      }"
      class="nav"
    >
      <view
        :class="{
          'is-ios': isIos,
        }"
        class="nav-safe-h"
      ></view>
      <image
        v-if="$global.systemInfo.homeNavTitleLogo"
        class="logo"
        :src="$global.BASE_IMG + 'xianyannavtitle.png'"
        mode="widthFix"
      />

      <view v-else class="nav-title f40 g-bold">
        {{ $global.systemInfo.name }}
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const isIos = ref(false);

  uni.getSystemInfo({
    success(e) {
      const { system } = e;
      if (system.includes('iOS')) {
        isIos.value = true;
      }
    },
  });
</script>

<style lang="scss" scoped>
  .nav {
    display: flex;
    padding: 0 10px;
    padding-left: 32rpx;
    flex-direction: column;
    height: 66px;
    font-size: var(--hr-font-size-xxxs);
    background-color: #fff;

    &.is-ios {
      height: 88px;
    }

    // padding-top: 100rpx;

    .nav-safe-h {
      height: 3em;
      width: 1px;
      &.is-ios {
        height: 4.5em;
      }
    }

    .logo {
      height: 66rpx;
      max-width: 500rpx;
    }
  }

  .uni-navbar--shadow {
    box-shadow: 0 1px 6px #ccc;
  }
</style>
