<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useGlobalStore, useUserStore } from "@/stores";
import { beforeEach } from "@/router";
import { IPat } from "@/stores/type";
import global from "@/config/global";
import { joinQuery } from "./common";
import "polyfill-object.fromentries";
import "@/router/customRouter";
import "./styles/index.scss";

// #ifdef MP-ALIPAY
import monitor from "@/js_sdk/alipay/alipayLogger.js";
import { isGeneratorFunction } from "util/types";
// #endif

onLaunch((opt) => {
  // console.log('App Launch', opt);
  const globalStore = useGlobalStore();
  globalStore.initBrowser();

  // #ifdef MP-ALIPAY
  const alipayPid = global.systemInfo.alipayPid;
  if (alipayPid) {
    console.log("支付宝入口埋点");
    monitor.init({
      pid: alipayPid,
      sample: 1,
      autoReportApi: true,
      autoReportPage: true,
      // Http请求返回数据中状态码字段名称
      code: ["code"],
      // Http返回数据中的error message字段名称
      msg: [],
    });
  }
  // #endif
});
onShow(async (opt) => {
  console.log("App Show", opt);
  if (opt && opt.query) {
    const { query, path, _pd } = opt as any;

    if (query) {
      const { qrCode } = query;

      // #ifdef MP-ALIPAY
      if (qrCode) {
        const _query = qrCode.split("?")[1];
        setTimeout(() => {
          uni.reLaunch({
            url: `/${path}?${_query}`,
          });
        }, 600);
        return;
      }
      // #endif

      // wx 普通二维码
      if (query.q) {
        const _query = decodeURIComponent(query.q).split("?")[1];

        if (_query) {
          setTimeout(() => {
            uni.reLaunch({
              url: `/${path}?${_query}`,
            });
          }, 600);
          return;
        }
      }

      //携带就诊人数据和默认就诊人不一致的情况
      if (query._pd) {
        const userStore = useUserStore();
        if (userStore.patList.length && userStore.patChoose.patientId != query._pd){
          const pat = <IPat>userStore.patList.find((o) => o.patientId === query._pd);
          userStore.updatePatChoose(pat);
        }
      }

      //携带院内就诊人数据
      if (query._hosPd) {
        const userStore = useUserStore();
        if (userStore.patList.length && userStore.patChoose.cardNumber != query._hosPd) {
          const pat = <IPat>userStore.patList.find((o) => o.cardNumber === query._hosPd);
          userStore.updatePatChoose(pat);
        }
      }
    }
  }

  setTimeout(() => {
    const pages = getCurrentPages();

    if (pages.length) {
      const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;

      beforeEach({
        url: fullUrl,
      });
    }
  }, 600);
});
onHide(() => {
  // console.log('App Hide');
});
</script>
<style lang="scss">
@import url("~@/static/iconfont-icon.css");
</style>
