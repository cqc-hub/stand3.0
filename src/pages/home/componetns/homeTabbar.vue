<template>
  <view class="tabbar">
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
  import { ref } from 'vue';

  const current = ref('');
  const tabBars = [
    {
      label: '首页',
      icon: '/static/image/home.png',
      iconActive: '/static/image/home_active.png',
      url: '/pages/home/home'
    },
    {
      label: '我的',
      icon: '/static/image/my.png',
      iconActive: '/static/image/my_active.png',
      url: '/pages/home/my'
    }
  ];

  const pages = getCurrentPages();
  const currentPage = pages.slice(-1)[0];
  const currentPath = '/' + currentPage.route;

  const changeTab = (item) => {
    const url = item.url;

    if (url !== currentPath) {
      uni.reLaunch({
        url: item.url
      });
    }
  };

  current.value = currentPath;
</script>

<style lang="scss" scoped>
  .tabbar {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: var(--h-color-white);
    height: 180rpx;
    border-top: 1rpx solid var(--hr-neutral-color-2);
    box-shadow: 2rpx 0 6px rgba(0, 0, 0, 0.06);
    z-index: 2;
    padding-top: 20rpx;


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
          font-size: 20rpx;
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
