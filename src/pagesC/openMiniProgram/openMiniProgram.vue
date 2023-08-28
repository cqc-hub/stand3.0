<template>
  <view class=""></view>
</template>

<script lang="ts" setup>
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { ref } from 'vue';
  import { apiAsync } from '@/utils';

  import { deQueryForUrl } from '@/common';

  const pageProps = ref(<{ appId: string; path: string }>{});
  let count = 0;
  onShow(() => {
    if (count) {
      uni.navigateBack({
        delta: 1,
      });
    } else {
      count++;
    }
  });

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));

    const { confirm } = await apiAsync(uni.showModal, {
      content: '确认跳转小程序?',
    });

    if (confirm) {
      uni.navigateToMiniProgram({
        ...pageProps.value,
        fail(e) {
          console.log(e);
        },
      });
    } else {
      uni.navigateBack({
        delta: 1,
      });
    }
  });
</script>

<style lang="scss" scoped></style>
