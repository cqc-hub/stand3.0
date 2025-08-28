import { getLocalStorage, setLocalStorage } from '@/common';
import { useGlobalStore } from '@/stores';
import { getCurrentInstance, ref } from 'vue';

export const useLunchInit1001035 = () => {
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
  const globalStore = useGlobalStore();
  const encryptUrl = ref('');
  const app = getCurrentInstance()!.proxy;
  let uni_modules_libshadowesm_config: any = '';
  let shadowlib: any = '';
  try {
    // @ts-expect-error
    const _uni_modules_libshadowesm_config = require('./libshadowesm1001035/config.js');
    uni_modules_libshadowesm_config = _uni_modules_libshadowesm_config;

    const {
      shadowlib: _shadowlib,
      // @ts-expect-error
    } = require('./libshadowesm1001035/shadowlib.js');
    shadowlib = _shadowlib;
  } catch (error) {}

  const appLaunchInit1001035 = () => {
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

    const initPublicKey = async () => {
      if (!shadowlib) {
        return;
      }
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

    initPublicKey();

    uni.addInterceptor('request', {
      invoke(args) {
        if (!shadowlib) {
          return;
        }
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
    globalStore.setShowFlag(true);
  };

  return {
    appLaunchInit1001035,
  };
};
