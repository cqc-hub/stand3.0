<template>
  <view class="">
    <web-view v-if="src" :src="src"></web-view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import global from '@/config/global';

  const appId = global.systemInfo.h5Appid;
  const isStartComeTest = global.systemInfo.isStartComeTest;
  const src = ref('');

  let baseUrl = `https://health.eheren.com`;

  // 需要在微信公众号内配置回调域名权限, 一个公众号最多只能配置2个
  if (global.env === 'prod' || !isStartComeTest) {
    baseUrl = 'https://h5.eheren.com';
  }

  if (global.SYS_CODE === '1001033') {
    baseUrl = 'https://tzwwz.eheren.com';
  }

  if (isStartComeTest) {
    src.value =
      (global.env as string) === 'prod'
        ? `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(
            baseUrl + '/h5/index.html'
          )}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
        : `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxac2942d44e7c2bd9&redirect_uri=${encodeURIComponent(
            baseUrl + '/h5/index.html'
          )}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
  } else {
    src.value = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(
      baseUrl + '/h5/index.html'
    )}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
  }

  console.log(src.value);
</script>

<style lang="scss" scoped></style>
https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx56d1a143ff27e903&redirect_uri=https%3A%2F%2Fhealth.eheren.com%2Fh5%2Findex.html&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
