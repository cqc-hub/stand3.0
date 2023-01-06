<template>
  <view class="">
    <web-view v-if="src" :src="src" @message="getMessage"></web-view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onShareAppMessage } from '@dcloudio/uni-app';

  // pagesA/webView/webView
  const props = defineProps<{
    https: string;
  }>();
  const src = ref('');

  if (props.https) {
    console.log(decodeURIComponent(props.https));

    src.value = decodeURIComponent(props.https);
  }

  const getMessage = (e) => {
    console.log('getMessage', e);
  };

  onShareAppMessage((opt) => {
    return {
      path:
        '/pagesA/webView/webView?https=' + encodeURIComponent(opt.webViewUrl!),
    };
  });
</script>

<style lang="scss" scoped>
</style>
