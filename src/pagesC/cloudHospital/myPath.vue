<template>
  <view>
    <web-view :src="src" :webview-styles="webviewStyles" @message="handleMessage"></web-view>
    <g-message />
  </view>
</template>

<script setup lang="ts">
  import { onLoad } from '@dcloudio/uni-app';
  import global from '@/config/global';
  import { getToken, getSysCode } from '@/common/useToken';
  import { ref } from 'vue';
  import { useMessageStore } from '@/stores';
  import { GStores } from '@/utils';
  // 自研h5页面统一入口
  const messageStore = useMessageStore();
  const gStores = new GStores();

  const webviewStyles = {
    progress: {
      color: '#4C8FFF'
    }
  };
  const src = ref();
  const allData = {
    sysCode: getSysCode(),
    token: gStores.globalStore.token.accessToken,
    hosId: '12882',
    herenId: gStores.globalStore.herenId
  } as const;
  type A = keyof typeof allData;

  onLoad((options) => {
    console.log(999, options);

    getQueryPath(options);
    let query = getQueryPath(options);
    if (options.type == '1') {
      //第三方的h5
      src.value = `${options.path}${query}`;
      console.log('第三方页面路径', src.value);
    } else {
      //自研h5
      const baseUrl = (global.env as any) === 'prod' ? 'https://h5.eheren.com/v3/#' : 'http://10.10.117.70:3000/#';
      src.value = `${baseUrl}${options.path}${query}`;
      console.log('v3页面路径', src.value);
    }
  });
  const getQueryPath = (options) => {
    // path里面需要传参的时候['sysCode'] options.query有值得时候
    let query = '?';
    if (options.query) {
      let queryArray: A[] = JSON.parse(options.query as string);
      queryArray.map((item) => {
        if (item in allData) {
          query = query + item + '=' + allData[item] + '&';
        } else {
          // messageStore.showMessage(`携带${item}参数有误`, 1000);
          console.log(`携带${item}参数有误`);
        }
      });
      return query.slice(0, -1);
    } else {
      return query;
    }
  };

  const handleMessage = (evt) => {
    // #ifdef MP-WEIXIN
    console.log('返回数据', evt);
    var data = evt.target.data;
    var V3PageData = data[0];
    uni.openLocation({
      latitude: Number(V3PageData.gisLat),
      longitude: Number(V3PageData.gisLng),
      name: V3PageData.hosName,
      address: V3PageData.address,
      success: () => {
        console.log('成功打开地图');
      }
    });
    // #endif
  };
</script>

<style scoped></style>
