<template>
  <view class="g-page bg-white">
    <g-message />
    <view class="g-container flex justify-center pt70">
      <image
        mode="aspectFit"
        class="cache-img pt70"
        :src="BASE_IMG + 'img_h5bg@3x.png'"
      />
    </view>
    <view class="color-888 f24 text-center pb70">
      浙江和仁科技股份有限公司@技术支持
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { GStores, TBannerConfig, useTBanner, wait } from '@/utils';
  import { deQueryForUrl, joinQuery } from '@/common';
  import { BASE_IMG } from '@/config/global';
  import { IPayRes, toPayPull } from '@/components/g-pay';

  const gStores = new GStores();
  const pageProps = ref({} as IPayRes);

  const init = async () => {
    await toPayPull(pageProps.value);
    uni.navigateBack({
      delta: 1,
    });
  };

  onLoad(async (opt: any) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    if (pageProps.value.invokeData) {
      try {
        // @ts-expect-error
        pageProps.value.invokeData = JSON.parse(pageProps.value.invokeData);
      } catch (error) {
        console.error(error);
      }
    }
  });

  onMounted(async () => {
    uni.showLoading({ title: '加载中' });

    await wait(600);
    uni.hideLoading();
    init();
  });
</script>
