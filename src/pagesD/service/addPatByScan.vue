<template>
  <view class="g-page">
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';
  import { apiAsync, LoginUtils, wait } from '@/utils';
  import api from '@/service/api';
  import { GStores } from '@/utils/modules/login';

  const gStores = new GStores();
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
    await wait(600);
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    const { idCard: idCardNumber, name, sign } = pageProps.value;
    if (!name) {
      return;
    }
    const { pData } = await new LoginUtils().faceVerifyAndPData({
      idCardNumber,
      name,
    });

    await api
      .cacheAddPat({
        pData,
        sign,
      })
      .catch(async (err) => {
        const respCode = err?.respCode || err?.err?.respCode;

        if (respCode === 884801) {
          gStores.messageStore.closeMessage();
          await apiAsync(uni.showModal, {
            content:
              '患者存在建档记录但手机号不匹配，请到小程序绑定修改手机号！',
          });

          uni.reLaunch({
            url: '/pages/home/my',
          });
        }

        throw new Error(err?.message || '添加就诊人失败');
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
