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
    globalStore.onAppShow(opt);

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
         * (_pd | _hosPd) & _pt(时间戳) 不分家
         */
        change_pat: {
          const { _pt, _pd, _hosPd } = query;

          if (_pt) {
            if (_cacheChangePatTime !== _pt) {
              _cacheChangePatTime = _pt;
            } else {
              break change_pat;
            }
          }

          const userStore = useUserStore();

          if (userStore.patList.length) {
            if (_pd) {
              if (userStore.patChoose.patientId != _pd) {
                const pat = userStore.patList.find((o) => o.patientId === _pd);
                userStore.updatePatChoose(pat!);
              }
            } else if (_hosPd) {
              if (userStore.patChoose.cardNumber != _hosPd) {
                const pat = userStore.patList.find(
                  (o) => o.cardNumber === _hosPd
                );
                userStore.updatePatChoose(pat!);
              }
            }
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

    if (uni.canIUse('getUpdateManager')) {
      const updateManager = uni.getUpdateManager();

      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function (res) {
            uni.showModal({
              title: '更新提示',
              content: '新版本已经准备好，请重启小程序避免影响业务',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              },
            });
          });
        }
      });

      // 新的版本下载失败
      updateManager.onUpdateFailed(function () {
        uni.showModal({
          title: '已有新版本~',
          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开~',
        });
      });
    }
  });
</script>
<style lang="scss">
  @import url('~@/static/iconfont-icon.css');
</style>
