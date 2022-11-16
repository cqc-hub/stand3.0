<template>
  <view class="">
    <web-view :src="src" v-if="src" @message="getMessage"></web-view>

    <cover-view class="operation-list lh-cent">
      <button open-type="share">
        <view>
          <cover-view class="iconfont">&#xe6e0;</cover-view>
          <cover-view>转发给好友</cover-view>
        </view>
      </button>
    </cover-view>
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
.operation-list {
  position: fixed;
  top: 100rpx;
  left: 0;
  z-index: 999999;
}
</style>
