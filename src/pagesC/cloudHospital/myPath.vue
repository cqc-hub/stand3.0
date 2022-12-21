<template>
  <view>
    <web-view
      :src="src"
      :webview-styles="webviewStyles"
      @message="handleMessage"
    ></web-view>
    <g-message />
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import global from "@/config/global";
import { getToken, getSysCode } from "@/common/useToken";
import { ref } from "vue";
import { useMessageStore } from "@/stores";
import { GStores } from "@/utils";
import { encryptDesParam } from "@/common/des";
import { joinQuery } from "@/common";
import { toPayPull } from "@/components/g-pay";
import { deQueryForUrl } from "@/common/utils";

type IPageProps = {
  hosId?: string;
  type?: string; // 扫码时候带
  path?: string;
};
// 自研h5页面统一入口
const messageStore = useMessageStore();
const gStores = new GStores();

const webviewStyles = {
  progress: {
    color: "#4C8FFF",
  },
};
const src = ref();
const allData = {
  sysCode: getSysCode(),
  token: gStores.globalStore.token.accessToken,
  hosId: "",
  herenId: gStores.globalStore.herenId,
  source: gStores.globalStore.browser.source,
  openId: gStores.globalStore.openId,
};
type A = keyof typeof allData;

const pageProp = ref({} as IPageProps);
// 页面固定携带 sysCode  加密参数（herenId patientid）
onLoad((options) => {
  pageProp.value = deQueryForUrl<IPageProps>(deQueryForUrl(options));
  getQueryPath(options);
  allData.hosId = pageProp.value.hosId || "";
  let query = getQueryPath(options);
  if (pageProp.value.type == "1") {
    //第三方的h5
    src.value = `${pageProp.value.path}?sysCode=${allData.sysCode}`;
    console.log("第三方页面路径", src.value);
  } else {
    //自研h5
    const baseUrl =
      (global.env as any) === "prod"
        ? "https://h5.eheren.com/v3/#"
       : 'http://10.10.82.78:5173/#';
          // "https://health.eheren.com/v3/#";
    //公告跳转的咨询
    if (pageProp.value.type == "2") {
      let path = decodeURIComponent(pageProp.value.path as string);
      src.value = `${baseUrl}${path}`;
    } else {
      //处理配置的参数query 目前为了my-h5 健康资讯对应tab typeId
      let newQuery = "";
      let obj = JSON.parse(JSON.stringify(options));
      console.log("path", obj);

      delete obj.path;
      delete obj.query;
      delete obj._pd;
      // 携带参数的情况
      if (JSON.stringify(obj) != "{}") {
        newQuery += "&" + joinQuery("", obj).slice(1);
      }
      src.value = `${baseUrl}${pageProp.value.path}${query}${newQuery}`;
    }
    console.log("v3页面路径", src.value);
  }
});
const getQueryPath = (options) => {
  // path里面需要传参的时候['sysCode'] options.query有值得时候
  //获取当前默认就诊人的patientid 或者是携带过来的_pd
  const patientId =
    options._pd || (gStores.userStore.patChoose && gStores.userStore.patChoose.patientId);
  const herenId = gStores.globalStore && gStores.globalStore.herenId;

  //默认加密参数
  let desObj = {
    _patientId: patientId,
    _herenId: herenId,
    _isHos: global.systemInfo.isSearchInHos, // 是否区域项目 新增就诊人跳转的地址
  };
  let _d = encryptDesParam(desObj);
  let query = "?_d=" + _d + "&sysCode=" + allData.sysCode + "&";
  if (options.query) {
    let queryArray: A[] = JSON.parse(options.query as string);
    queryArray.map((item) => {
      if (item in allData) {
        query = query + item + "=" + allData[item] + "&";
      } else {
        // messageStore.showMessage(`携带${item}参数有误`, 1000);
        console.log(`携带${item}参数有误`);
      }
    });
    return query.slice(0, -1);
  } else {
    return query.slice(0, -1);
  }
};

const handleMessage = (evt) => {
  console.log("返回数据", evt);
  var data = evt.target.data;
  var V3PageData = data[0];
  //表示支付
  if (V3PageData.appId) {
    //拉起支付
    toPayPull(V3PageData)
      .then((res: any) => {
        // #ifdef MP-ALIPAY
        if (res.payedRes.resultCode == "9000") {
          //支付宝成功支付
          if (V3PageData.miniUrl) {
            uni.navigateTo({
              url: "/pagesC/cloudHospital/myPath?path=" + V3PageData.miniUrl,
            });
          }
        } else {
          gStores.messageStore.showMessage("取消支付", 1500, {
            uniToast: true,
          });
        }
        // #endif

        // #ifdef MP-WEIXIN
        //处理跳转
        if (V3PageData.miniUrl) {
          uni.navigateTo({
            url: "/pagesC/cloudHospital/myPath?path=" + V3PageData.miniUrl,
          });
        }
        // #endif
      })
      .catch((err) => {
        let msg = err.errMsg.indexOf('cancel')!='-1'?'取消支付':"err.errMsg" 
        gStores.messageStore.showMessage(msg, 2000, {
          closeCallBack: () => {
            if (V3PageData.cancelUrl) {
              uni.navigateTo({
                url: "/pagesC/cloudHospital/myPath?path=" + V3PageData.cancelUrl,
              });
            }
          },
        });
      });
  } else {
    //打开地图
    uni.openLocation({
      latitude: Number(V3PageData.gisLat),
      longitude: Number(V3PageData.gisLng),
      name: V3PageData.hosName,
      address: V3PageData.address,
    });
  }
};
</script>

<style scoped></style>
