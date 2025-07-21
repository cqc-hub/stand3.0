<template>
  <view>
    <web-view
      :src="src"
      :webview-styles="webviewStyles"
      @message="handleMessage"
    ></web-view>
    <!-- <button @tap="handleMessage">点击</button> -->
    <g-message />
  </view>
</template>

<script setup lang="ts">
  import { onLoad, onShareTimeline } from '@dcloudio/uni-app';
  import global from '@/config/global';
  import { getToken, getSysCode } from '@/common/useToken';
  import { ref } from 'vue';
  import { useMessageStore, useCacheStore } from '@/stores';
  import {
    GStores,
    addHosIdForSelfH5Path,
    handWebMessage,
    thirdWxPay,
  } from '@/utils';
  import { encryptDesParam } from '@/common/des';
  import { joinQuery } from '@/common';
  import { deQueryForUrl } from '@/common/utils';
  import globalGl from '@/config/global';

  type IPageProps = {
    hosId?: string;
    type?: string; // 扫码时候带
    path?: string;
  };
  // 自研h5页面统一入口
  const messageStore = useMessageStore();
  const gStores = new GStores();
  const cacheStore = useCacheStore();

  const webviewStyles = {
    progress: {
      color: '#4C8FFF',
    },
  };
  const src = ref();
  const pageProp = ref({} as IPageProps);

  const allData = {
    sysCode: getSysCode(),
    token: gStores.globalStore.token.accessToken,
    hosId: '',
    herenId: gStores.globalStore.herenId,
    source: gStores.globalStore.browser.source,
    openId: gStores.globalStore.openId,
    h5OpenId: gStores.globalStore.h5OpenId,
    phone: gStores.userStore.phoneNum, //账号下的手机号（仅微信）
  };
  type A = keyof typeof allData;

  // 页面固定携带 sysCode  加密参数（herenId patientid）
  onLoad((options) => {
    pageProp.value = deQueryForUrl<IPageProps>(deQueryForUrl(options));

    allData.hosId = pageProp.value.hosId || '';
    let query = getQueryPath(pageProp.value);
    if (pageProp.value.type == '1') {
      //第三方的h5  ?sysCode=${allData.sysCode}
      let newQuery = getQueryPath(pageProp.value);
      src.value = `${pageProp.value.path}${newQuery}`;
    } else {
      //自研h5
      const baseUrl = global.h5Url.slice(0, -1);
      //公告跳转的咨询
      if (pageProp.value.type == '2') {
        let path = decodeURIComponent(pageProp.value.path as string);
        src.value = `${baseUrl}${path}`;
      } else {
        //处理配置的参数query 目前为了my-h5 健康资讯对应tab typeId
        let newQuery = '';
        let obj = JSON.parse(JSON.stringify(options));

        delete obj.path;
        delete obj.query;
        delete obj._pd;

        // 携带参数的情况
        if (JSON.stringify(obj) != '{}') {
          newQuery += '&' + joinQuery('', obj).slice(1);
        }
        //额外处理 类似杭口 必须携带院区数据
        if (cacheStore.isShowChooseHos && cacheStore.hosId !== '') {
          src.value = addHosIdForSelfH5Path(
            `${baseUrl}${pageProp.value.path}${query}${newQuery}`
          );
        } else {
          src.value = `${baseUrl}${pageProp.value.path}${query}${newQuery}`;
        }
      }
      console.warn('v3页面路径', src.value);
    }
  });
  const getQueryPath = (options) => {
    // path里面需要传参的时候['sysCode'] options.query有值得时候
    //获取当前默认就诊人的patientid 或者是携带过来的_pd
    const patientId =
      options._pd ||
      (gStores.userStore.patChoose && gStores.userStore.patChoose.patientId);
    const herenId = gStores.globalStore && gStores.globalStore.herenId;

    //默认加密参数
    let desObj = {
      _patientId: patientId,
      _herenId: herenId,
      _isHos: global.systemInfo?.isSearchInHos, // 是否区域项目 新增就诊人跳转的地址
      _isDes: global.isOpenDes,
    };
    let _d = encryptDesParam(desObj);
    let modeOld = gStores.globalStore.modeOld
      ? '1'
      : gStores.globalStore.modeOld;

    let query = '?';
    let isTcmStyle = (gStores.globalStore.isTcmStyle && '1') || '0';
    if (options.type !== '1') {
      query = `?_d=${_d}&sysCode=${allData.sysCode}&modeOld=${modeOld}`;
      // 中医风格
      if (isTcmStyle !== '0') {
        query += `&isTcmStyle=${isTcmStyle}&`;
      }
    }

    if (options.query) {
      let queryArray: A[];
      if (options.type == '1') {
        queryArray = JSON.parse(options.query as string)?.query;
      } else {
        queryArray = JSON.parse(options.query as string);
      }
      try {
        queryArray.map((item) => {
          if (item in allData) {
            // #ifdef MP-WEIXIN
            if (
              item === 'h5OpenId' &&
              !gStores.globalStore.h5OpenId &&
              globalGl.h5AppId
            ) {
              uni.reLaunch({
                url: '/pages/home/startCome',
              });
            }
            // #endif
            query = query + item + '=' + allData[item] + '&';
          } else {
            // messageStore.showMessage(`携带${item}参数有误`, 1000);
            console.warn(`携带${item}参数有误`);
          }
        });
      } catch (e) {
        console.warn(e);
        return '';
      }

      return query.slice(0, -1);
    } else {
      return query.slice(0, -1);
    }
  };

  const handleMessage = (evt) => {
    console.warn('返回数据', evt);
    handWebMessage(evt);
    var data = evt.target.data;
    var V3PageData = data[0];
    if (
      V3PageData &&
      (V3PageData.appId ||
        (V3PageData.paymentData && V3PageData.paymentData.appId))
    ) {
      thirdWxPay(V3PageData);
    } else if (V3PageData.gisLat) {
      //打开地图
      uni.openLocation({
        latitude: Number(V3PageData.gisLat),
        longitude: Number(V3PageData.gisLng),
        name: V3PageData.hosName,
        address: V3PageData.address,
      });
    }
  };

  onShareTimeline(() => {
    return {};
  });
</script>

<style scoped></style>
