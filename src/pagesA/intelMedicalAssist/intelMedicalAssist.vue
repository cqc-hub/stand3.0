<template>
  <view class="cache">
    <view
      v-if="gStores.globalStore.sysCode === '1001093'"
      class="w-full h-full"
    >
      <img
        :src="BASE_IMG + 'stand3-netcache-page-bg-1001093.png'"
        class="w-full h-full"
        mode="widthFix"
      />
    </view>
    <view v-else>
      <view class="cache-img-container">
        <image
          mode="aspectFit"
          class="cache-img"
          :src="BASE_IMG + 'img_h5bg@3x.png'"
        />
      </view>
      <view
        v-if="$global.sConfig.isHideHomeLogo !== '1'"
        class="cache-fixbottom"
      >
        浙江和仁科技股份有限公司@技术支持
      </view>
    </view>
    <g-message />
  </view>
</template>

<script setup lang="ts">
  import { onLoad } from '@dcloudio/uni-app';

  import { BASE_IMG } from '@/config/global';
  import { wait, GStores } from '@/utils';
  const gStores = new GStores();

  onLoad(async (options) => {
    await wait(300);
    uni.navigateTo({
      url: '/z-ai/intelMedicalAssist/intelMedicalAssist',
    });
  });
</script>

<style scoped lang="scss">
  .cache {
    width: 100%;
    height: 100vh;
    background-color: #fff;

    .cache-img-container {
      display: flex;
      justify-content: center;
      position: relative;
      top: 140upx;
      .cache-img {
        width: 95vw;
        height: 60vh;
      }
    }
    .cache-fixbottom {
      position: absolute;
      bottom: 144upx;
      width: 100%;
      text-align: center;

      font-size: var(--hr-font-size-xxxs);
      font-weight: 400;
      color: #999;
    }
  }
</style>
