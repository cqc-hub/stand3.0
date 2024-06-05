<template>
  <view class=""></view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';
  import { useTBanner, wait } from '@/utils';

  const pageProps = ref(<{}>{});

  onLoad(async (opt) => {
    uni.showLoading({});
    await wait(500);
    uni.hideLoading();
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    useTBanner({
      path: 'pagesC/question/questionAfterVisit2',
      type: 'h5',
      isSelfH5: '1',
      addition: {
        patientId: '_p',
      },
      extraData: {
        category: '51',
      },
    });
    // useTBanner({
    //   path: 'pagesC/question/questionAfterVisit',
    //   type: 'h5',
    //   isSelfH5: '1',
    //   addition: {
    //     patientId: '_p',
    //   },
    //   extraData: {
    //     type: 'hk'
    //   }
    // });
  });
</script>

<style lang="scss" scoped></style>
