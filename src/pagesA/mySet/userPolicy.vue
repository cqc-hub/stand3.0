<template>
  <view class="bg-white">
    <view class="p32c">
      <g-flag
        v-if="pageProps.typeFg"
        v-model:title="fgTitle"
        v-model:value="fgContent"
        isShowFgTip
        isHideTitle
        aaa
        :typeFg="pageProps.typeFg"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';
  const pageProps = ref({
    // typeFg: '1213',
  } as {
    typeFg: string;
  });

  const fgTitle = ref('');
  const fgContent = ref('');

  watch(
    () => fgContent.value,
    () => {
      uni.hideLoading();
      if (fgTitle.value) {
        uni.setNavigationBarTitle({
          title: fgTitle.value,
        });
      }
    }
  );

  onLoad(async (opt) => {
    uni.showLoading({ title: '加载中'});;
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
  });
</script>

<style lang="scss" scoped></style>
