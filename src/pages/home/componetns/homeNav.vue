<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <view class="nav">
      <view class="nav-safe-h"></view>
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
  import { defineComponent, ref } from 'vue';
</script>

<style lang="scss" scoped>
  $nav-height: 88px;

  .nav {
    display: flex;
    padding: 0 10px;
    flex-direction: column;
    height: $nav-height;
    font-size: 12px;
    background-color: var(--hr-brand-color-6);

    // padding-top: 100rpx;

    .nav-safe-h {
      height: 4.5em;
      width: 1px;
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
