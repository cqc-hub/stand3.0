<template>
  <view class="page">
    <dailyExpenseListDetial
      :isHosDaylist="pageProps.isHosDaylist"
      :isHosTotallist="pageProps.isHosTotallist"
      :hospitalId="pageProps.hospitalId"
      :costDay="pageProps.costDay"
      :pageProps1="pageProps"
      ref="aaa"
    />
  </view>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import dailyExpenseListDetial from './components/dailyExpenseListDetial.vue';
  import { deQueryForUrl } from '@/common';


  const pageProps = ref(
    {} as {
      endDay?: string;
      inDay?: string;
      costDay?: string;
      isHosDaylist?: string;
      isHosTotallist?: string;
      hospitalId?: string;
    }
  );

  const aaa = ref<any>('');

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));

    uni.showLoading({
      mask: true,
    });
    setTimeout(async () => {
      await aaa.value.init(opt);
      uni.hideLoading();
    }, 600);
  });
</script>
<style scoped lang="scss">
  .page {
    height: auto;
    width: 100%;
    padding-top: 20rpx;
  }
</style>
