<template>
  <view class="">
    <web-view v-if="src" :src="src"></web-view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import global from '@/config/global';

  const appId = global.systemInfo.h5Appid;
  const isStartComeTest =  global.systemInfo.isStartComeTest
  const src = ref('');
  if(isStartComeTest){
    src.value = (global.env as string) === 'prod' ? `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(
    'https://h5.eheren.com/h5/index.html')}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect` : 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxac2942d44e7c2bd9&redirect_uri=https%3a%2f%2fhealth.eheren.com%2fh5%2findex.html&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
  ;
  }else{
    src.value = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(
    'https://h5.eheren.com/h5/index.html')}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
  }


  console.log(src.value);
</script>

<style lang="scss" scoped></style>
