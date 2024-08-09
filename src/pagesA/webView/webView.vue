<template>
  <view class="">
    <web-view
      v-if="src"
      :src="src"
      :message="getMessage"
      @message="getMessage"
    ></web-view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onShareAppMessage } from '@dcloudio/uni-app';
  import { useCommonTo } from '@/common/checkJump';
  import { handWebMessage, thirdWxPay } from '@/utils';

  // pagesA/webView/webView
  const props = defineProps<{
    https: string;
  }>();
  const src = ref('');

  if (props.https) {
    console.warn(decodeURIComponent(props.https));

    src.value = decodeURIComponent(props.https);
  }

  const getMessage = (evt) => {
    console.warn('返回数据', evt);
    handWebMessage(evt);
    var data = evt.target.data;
    var V3PageData = data[0];
    if (V3PageData.type == 'hosLoaction') {
      //打开地图
      uni.openLocation({
        latitude: Number(V3PageData.gisLat),
        longitude: Number(V3PageData.gisLng),
        name: V3PageData.hosName,
        address: V3PageData.address,
      });
    } else if (V3PageData.type == 'backAndToPath') {
      useCommonTo(V3PageData.pageData);
    } else if (V3PageData.appId) {
      thirdWxPay(V3PageData);
    }
  };

  onShareAppMessage((opt) => {
    return {
      path:
        '/pagesA/webView/webView?https=' + encodeURIComponent(opt.webViewUrl!),
    };
  });
</script>

<style lang="scss" scoped></style>
