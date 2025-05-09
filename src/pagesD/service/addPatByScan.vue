<template>
  <view class=""></view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';
  import { apiAsync, LoginUtils } from '@/utils';
  import api from '@/service/api';
  const pageProps = ref(
    {} as {
      name: string;
      idCard: string;
      sign: string;
    }
  );

  onLoad(async (opt) => {
    uni.showLoading({});
    uni.setNavigationBarTitle({
      title: '新增就诊人',
    });
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    const { idCard: idCardNumber, name, sign } = pageProps.value;
    if (!name) {
      return;
    }
    const { pData } = await new LoginUtils().faceVerifyAndPData({
      idCardNumber,
      name,
    });

    await api.cacheAddPat({
      pData,
      sign,
    });

    await apiAsync(uni.showModal, {
      title: '提示',
      content: '添加成功',
      showCancel: false,
    });

    uni.reLaunch({
      url: '/pages/home/home',
    });
  });
</script>

<style lang="scss" scoped></style>
