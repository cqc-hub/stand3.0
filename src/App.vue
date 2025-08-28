<script setup lang="ts">
  import { onLaunch, onShow } from '@dcloudio/uni-app';
  import { useGlobalStore, useUserStore } from '@/stores';
  import { getCurrentInstance, ref } from 'vue';
  import { beforeEach } from '@/router';
  import {
    getLocalStorage,
    getSysCode,
    setLocalStorage,
  } from '@/common/useToken';
  import global from '@/config/global';
  import 'polyfill-object.fromentries';
  import '@/router/customRouter';
  import './styles/index.scss';
  // #ifdef MP-ALIPAY
  import monitor from '@/js_sdk/alipay/alipayLogger.js';
  // #endif
  import { shadowlib } from './uni_modules/libshadowesm/shadowlib.js';
  import uni_modules_libshadowesm_config from './uni_modules/libshadowesm/config.js';
  // import shadowlib from './uni_modules/libshadowesm/shadowlib.js';
  // const uni_modules_libshadowesm_shadowlib = require('./uni_modules/libshadowesm/shadowlib.js');
  // const uni_modules_libshadowesm_config = require('./uni_modules/libshadowesm/config.js');
  // const t = require('./uni_modules/libshadowesm/tt.js');
  // import { fn } from './uni_modules/libshadowesm/tt.js'
  // import { fn } from '@/utils/tt.js'
  // const fn1 = require('./utils/tt.js');

  const globalStore = useGlobalStore();
  let _cacheChangePatTime = '',
    showTime = 0;

  const initPublicKey = async () => {
    const requestOptions = {
      url: uni_modules_libshadowesm_config.ar_shadow_publickeyurl,
      method: 'GET',
      success: (res) => {
        var _a;
        console.log(res, 'res');
        if (
          res.statusCode === 200 &&
          ((_a = res.data) == null ? void 0 : _a.publicKey)
        ) {
          // @ts-expect-error
          app.globalData.isPubKeyInit = true;
          setLocalStorage({
            ar_shadow_publicKey: res.data.publicKey,
          });
        } else {
          console.error('返回数据错误:');
          setLocalStorage({
            ar_shadow_publicKey: '',
          });
        }
      },
      fail: (err) => {
        console.error('初始化公钥失败:', err);
        setLocalStorage({
          ar_shadow_publicKey: '',
        });
      },
    };

    uni.request(requestOptions as any);
  };

  const app = getCurrentInstance()!.proxy;
  const arshadow$vData = ref({
    gyroscope: { x: 0, y: 0, z: 0 },
    sysv: '',
    battery: 100,
    brand: '',
    arlang: '',
    touchStartCount: 0,
    touchMoveCount: 0,
    inputCount: 0,
  });
  const clientData = ref('');
  const encryptUrl = ref('');
  const getClientData = () => {
    let u = getLocalStorage('ar_shadow_token1017');
    const {
      gyroscope: o,
      battery: e,
      sysv: l,
      brand: g,
      arlang: n,
      touchStartCount: $,
      touchMoveCount: b,
      inputCount: d,
    } = arshadow$vData.value;
    let r = `x:${o.x} y:${o.y} z:${o.z}`;
    let D = Math.floor(10 * Math.random());
    let y = `0000000000000000000${
      /* @__PURE__ */ new Date().getTime()
    }||||${u}|${String(
      /* @__PURE__ */ new Date().getTime()
    )}||-$-$-$-$-$${b}$${$}$${d}$1$-$-$4$${r}$${e}$${l}$${g}$-$${n}$-$-$-|||||||||${D}|`;
    clientData.value = y;
    return y;
  };
  onLaunch(async (opt) => {
    // console.log('App Launch', opt);
    globalStore.initBrowser();
    globalStore.onAppLaunch(opt);
    if (globalStore.sysCode === '1001035') {
      initPublicKey();

      uni.addInterceptor('request', {
        invoke(args) {
          try {
            const publicKey = getLocalStorage('publicKey');
            let encr = shadowlib.ar_shadow_addparametertourl(
              args.url,
              '',
              getClientData(),
              publicKey
            );

            args.url = encr.requrl;
            encryptUrl.value = encr.requrl;
            Object.assign(arshadow$vData.value, {
              touchStartCount: 0,
              touchMoveCount: 0,
              inputCount: 0,
            });
          } catch (error) {
            console.error('省中加密报错----', error);
          }
        },
      });

      let arshadowtoken = getLocalStorage('ar_shadow_token1017');
      if (!arshadowtoken) {
        arshadowtoken = (
          shadowlib.ar_shadow_getrandom() + /* @__PURE__ */ new Date().getTime()
        ).padStart(32, '0');
        setLocalStorage({ ar_shadow_token1017: arshadowtoken });
      }
      if (globalStore.sysCode === '1001035') {
        globalStore.setShowFlag(true);
      }
    }

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

    if (globalStore.sysCode === '1001082') {
      uni.reLaunch({
        url: 'pagesA/intelMedicalAssist/intelMedicalAssist',
      });
    }
  });

  onShow(async (opt) => {
    console.log('App Show', opt);

    globalStore.onAppShow(opt);

    // #ifdef MP-WEIXIN
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
    // #endif

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
