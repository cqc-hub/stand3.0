<template>
  <view class="">
    <web-view v-if="src" :src="src"></web-view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import global from '@/config/global';

  const appId = global.systemInfo.h5Appid;
  const src = ref('');

  src.value = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(
    'https://health.eheren.com/h5/index.html'
  )}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;

  console.log(src.value);
</script>

<style lang="scss" scoped></style>
