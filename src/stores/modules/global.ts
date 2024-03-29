import { defineStore } from 'pinia';
import globalGl from '@/config/global';

type T_ENV_H5 = null | 'web' | 'wx' | 'alipay';
interface IStateGlobal {
  token: {
    accessToken: string;
    refreshToken: string;
  };

  browser: {
    source: number;
    accountType: number;
    payType: string;
  };

  openId: string;
  h5OpenId: string;
  herenId: string;
  appShowData: BaseObject;
  appLaunchData: BaseObject;
  cacheData: BaseObject;
  envH5: T_ENV_H5;

  sysCode: typeof globalGl.SYS_CODE;
  modeOld: boolean; // 敬老模式?
}
//页面存储token brower等
const globalStore = defineStore('global', {
  /**
   * 数据存在 storage 中
   * 大小存在限制
   * 所有 storage 10mb
   * 单个 storage key   wx 1mb  alipay  200kb
   */
  persist: {
    key: 'global',
    paths: [
      'token',
      'openId',
      'h5OpenId',
      'herenId',
      'sysTerms',
      'nationTerms',
      'patientTypeTerms',
      'browser',
      'modeOld',
      'envH5',
    ],
  },

  state: (): IStateGlobal => {
    return {
      // 所有这些属性都将自动推断其类型
      token: {
        accessToken: '',
        refreshToken: '',
      },
      //来源
      browser: {
        source: 4,
        accountType: 2,
        payType: 'ALI_WAP',
      },
      openId: '',
      h5OpenId: '',
      herenId: '',
      appShowData: {},
      appLaunchData: {},

      sysCode: globalGl.SYS_CODE,
      modeOld: false,
      cacheData: {},
      envH5: null,
    };
  },

  getters: {
    getToken(): any {
      return this.token.accessToken;
    },

    getBrowser(): any {
      return this.browser;
    },

    isLogin(): boolean {
      if (this.token.accessToken) {
        return true;
      }
      return false;
    },
  },

  actions: {
    clearStore() {
      this.token = {
        accessToken: '',
        refreshToken: '',
      };

      this.openId = '';
      // this.h5OpenId = '';
      this.herenId = '';
    },

    assignCacheData(data) {
      this.cacheData = data;
    },

    changeEnvH5(env: T_ENV_H5) {
      this.envH5 = env;
    },

    onAppShow(opt: any) {
      if (opt) {
        this.appShowData = opt;
      }
    },

    onAppLaunch(opt: any) {
      if (opt) {
        this.appLaunchData = opt;
      }
    },

    updateToken(token) {
      this.token = token;
    },
    updateBrowser(browser) {
      this.browser = browser;
    },

    initBrowser() {
      const { updateBrowser } = this;
      // #ifdef H5
      const browser = navigator.userAgent.toLowerCase();

      if (browser) {
        // @ts-ignore
        if (browser.match(/Alipay/i) == 'alipay') {
          this.changeEnvH5('alipay');
          updateBrowser({
            source: 4,
            accountType: 2,
            payType: 'ALI_WAP',
          });
        } else if (
          // @ts-ignore
          browser.match(/MicroMessenger/i) == 'micromessenger'
        ) {
          this.changeEnvH5('wx');
          updateBrowser({
            source: 3,
            accountType: 1,
            payType: 'WX_JSAPI',
          });
        } else {
          this.changeEnvH5('web');
        }
      }
      // #endif

      // #ifdef MP-WEIXIN
      updateBrowser({
        source: 19,
        accountType: 11,
      });
      // #endif

      // #ifdef MP-ALIPAY
      updateBrowser({
        source: 21,
        accountType: 22,
      });
      // #endif

      // #ifdef MP-TOUTIAO
      updateBrowser({
        source: 66,
        accountType: 66,
      });
      // #endif
    },

    setOpenId(id: string) {
      this.openId = id;
    },

    setH5OpenId(id: string) {
      this.h5OpenId = id;
    },

    setToken({ accessToken, refreshToken }) {
      this.token = {
        accessToken,
        refreshToken,
      };
    },

    setHerenId(id: string) {
      this.herenId = id;
    },
    setModeOld(modeOld: boolean) {
      this.modeOld = modeOld;
    },
  },
});

export const useGlobalStore = function () {
  return globalStore();
};
