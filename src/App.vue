<script setup lang="ts">
  // #ifdef MP-ALIPAY
  import monitor from '@/js_sdk/alipay/alipayLogger.js';
  // #endif
  import { onLaunch, onShow } from '@dcloudio/uni-app';
  import { beforeEach } from '@/router';
  import global from '@/config/global';
  import 'polyfill-object.fromentries';
  import '@/router/customRouter';
  import './styles/index.scss';
  import '@/utils/dynamicUtil';
  import { useLunchInit1001035 } from '@/utils/1001035';
  import { reloadUni } from './utils/reloadUni';
  import { GStores } from './utils';
  import globalGl from '@/config/global';

  const gStores = new GStores();

  let _cacheChangePatTime = '',
    showTime = 0;

  onLaunch(async (opt) => {
    console.log('App Launch', opt);
    reloadUni();
    gStores.globalStore.initBrowser();
    gStores.globalStore.onAppLaunch(opt);

    if (gStores.globalStore.sysCode === '1001035') {
      // const { appLaunchInit1001035 } = useLunchInit1001035({
      //   onShow,
      // });
      // appLaunchInit1001035();
    }

    gStores.globalStore.setShowFlag(true);
    // #ifdef MP-ALIPAY
    const alipayPid = global.systemInfo.alipayPid;
    if (alipayPid) {
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
    // #ifdef MP-TOUTIAO
    uni.login();
    // #endif

    // #ifndef MP-TOUTIAO
    // uni.loadFontFace({
    //   global: true,
    //   family: 'custom-font',
    //   source: `url("${globalGl.BASE_IMG}font/custom.ttf")`,
    //   fail: (err) => console.error('字体加载失败', err),
    // });
    // #endif
  });

  onShow(async (opt: any) => {
    console.log('App Show', opt);

    gStores.globalStore.onAppShow(opt);

    if (gStores.globalStore.ev === 'wx') {
      if (!showTime) {
        showTime = ((new Date() as unknown as number) * 1) / 1000;
        wx.login();
      } else {
        setTimeout(() => {
          const nowTime = ((new Date() as unknown as number) * 1) / 1000;
          const difTimeHour = Math.ceil(nowTime - showTime) / 60 / 60 / 6;

          if (difTimeHour >= 6) {
            showTime = ((new Date() as unknown as number) * 1) / 1000;
            wx.login();
          }
        }, 3000);
      }
    }

    if (opt && opt.query) {
      const { query, path, _pd } = opt as any;

      if (query) {
        const { qrCode } = query;

        // #ifdef MP-ALIPAY
        if (qrCode) {
          const _query = qrCode.split('?')[1];
          _query &&
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

          if (gStores.userStore.patList.length) {
            if (_pd) {
              if (gStores.userStore.patChoose.patientId !== _pd) {
                const pat = gStores.userStore.patList.find(
                  (o) => o.patientId === _pd
                );
                gStores.userStore.updatePatChoose(pat!);
              }
            } else if (_hosPd) {
              if (gStores.userStore.patChoose.cardNumber !== _hosPd) {
                const pat = gStores.userStore.patList.find(
                  (o) => o.cardNumber === _hosPd
                );
                gStores.userStore.updatePatChoose(pat!);
              }
            }
          }
        }
      }
    }

    setTimeout(() => {
      const pages = getCurrentPages();
      if (pages.length) {
        const fullUrl: string = (pages[pages.length - 1] as any).$page
          ?.fullPath;
        fullUrl &&
          beforeEach({
            url: fullUrl,
          });
      }
    }, 600);

    if (uni.canIUse('getUpdateManager')) {
      const updateManager = uni.getUpdateManager && uni.getUpdateManager();

      if (updateManager) {
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
    }
  });
</script>
<style lang="scss">
  @import url('~@/static/iconfont-icon.css');
</style>
