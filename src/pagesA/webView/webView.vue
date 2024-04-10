<template>
  <view class="">
    <!-- @vue-skip -->
    <web-view v-if="src" :src="src" @message="getMessage"></web-view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onShareAppMessage } from '@dcloudio/uni-app';
  import { useCommonTo,openServicesChat } from '@/common/checkJump';

  // pagesA/webView/webView
  const props = defineProps<{
    https: string;
  }>();
  const src = ref('');

  if (props.https) {
    console.warn(decodeURIComponent(props.https));

    // src.value = 'https://miying.qq.com/guide-h5?openId=167530487655455046&partnerId=100000416&timestamp=1675304876554&signature=91c64c5c1f6fe1a045d1681d3014f92b0db6336c9e0b0169c875b1f4c5e09b67&loginType=h5&appid=wxf57d660046a04f49_1'
    src.value = decodeURIComponent(props.https);
  }

  const getMessage = (evt) => {
    console.warn('返回数据', evt);
    var data = evt.target.data;
    var V3PageData = data[0];
    if (V3PageData.type=='hosLoaction') {
      //打开地图
      uni.openLocation({
        latitude: Number(V3PageData.gisLat),
        longitude: Number(V3PageData.gisLng),
        name: V3PageData.hosName,
        address: V3PageData.address,
      });
    }else if(V3PageData.type=='backAndToPath'){
      useCommonTo(V3PageData.pageData)
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
