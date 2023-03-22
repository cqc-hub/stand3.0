<script setup lang="ts">
  import { onLaunch, onShow } from '@dcloudio/uni-app';
  import { useGlobalStore, useUserStore } from '@/stores';
  import { beforeEach } from '@/router';
  import global from '@/config/global';
  import 'polyfill-object.fromentries';
  import '@/router/customRouter';
  import './styles/index.scss';

  // #ifdef MP-ALIPAY
  import monitor from '@/js_sdk/alipay/alipayLogger.js';
  // #endif

  const globalStore = useGlobalStore();
  let _cacheChangePatTime = '';

  onLaunch((opt) => {
    // console.log('App Launch', opt);

    globalStore.initBrowser();
    globalStore.onAppLaunch(opt);

    // #ifdef MP-ALIPAY
    const alipayPid = global.systemInfo.alipayPid;
    if (alipayPid) {
      console.log('支付宝入口埋点');
      monitor.init({
        pid: alipayPid,
        sample: 1,
        autoReportApi: true,
        autoReportPage: true,
        // Http请求返回数据中状态码字段名称
        code: ['code'],
        // Http返回数据中的error message字段名称
        msg: [],
      });
    }
    // #endif
  });
  onShow(async (opt) => {
    console.log('App Show', opt);
    if (opt && opt.query) {
      const { query, path, _pd } = opt as any;

      if (query) {
        const { qrCode } = query;

        // #ifdef MP-ALIPAY
        if (qrCode) {
          const _query = qrCode.split('?')[1];
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
          const _query = decodeURIComponent(query.q).split('?')[1];

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
        /**
         * _pd _pt(时间戳) 不分家
         */
        if (query._pd) {
          const userStore = useUserStore();
          if (
            userStore.patList.length &&
            userStore.patChoose.patientId != query._pd &&
            _cacheChangePatTime !== query._pt
          ) {
            _cacheChangePatTime = query._pt;
            const pat = userStore.patList.find(
              (o) => o.patientId === query._pd
            );
            userStore.updatePatChoose(pat!);
          }
        } else if (query._hosPd) {
          const userStore = useUserStore();
          if (
            userStore.patList.length &&
            userStore.patChoose.cardNumber != query._hosPd
          ) {
            const pat = userStore.patList.find(
              (o) => o.cardNumber === query._hosPd
            );
            userStore.updatePatChoose(pat!);
          }
        }
      }
    }

    globalStore.onAppShow(opt);

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
</script>
<style lang="scss">
  @import url('~@/static/iconfont-icon.css');
</style>
