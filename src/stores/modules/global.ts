import { defineStore } from 'pinia';
import globalGl from '@/config/global';
import { getCurrentInstance } from 'vue';
import { getTcMallToken } from '@/common/utils';
import { useUserStore } from '@/stores';

type T_ENV_H5 = null | 'web' | 'wx' | 'alipay';

interface IStateGlobal {
  token: {
    accessToken: string;
    refreshToken: string;
    loginData?: string;
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
  isShowFlag: boolean; // 宁口隐私政策
  sysCode: string;
  modeOld: boolean; // 敬老模式?

  flagCaches: {
    [key: string]: {
      title: string;
      content: string;
    };
  };
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
      'isShowFlag',
      'flagCaches',
    ],
  },

  state: (): IStateGlobal => {
    return {
      // 所有这些属性都将自动推断其类型
      token: {
        accessToken: '',
        refreshToken: '',
        loginData: '',
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
      isShowFlag: false,
      flagCaches: {},
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

    // 是否中医style
    isTcmStyle(): boolean {
      return ['1001035', '1001077',  '1001086'].includes(this.sysCode);
      // return false
    },

    getPageClass(): string {
      let pageClass = '';

      if (this.modeOld) {
        pageClass += ' system-mode-old';
      }

      if (this.isTcmStyle) {
        pageClass += ' system-style-medical';
      }

      return pageClass;
    },

    h5MenuExtraData() {
      const userStore = useUserStore();
      return {
          PATIENTID: userStore.patChoose.patientId,
          HERENID: this.herenId,
          TOKEN: this.token.accessToken,
          OPENID: this.openId,
      };
    },
  },

  actions: {
    setFlagCaches(key, { content, title }) {
      this.flagCaches[key] = {
        content,
        title,
      };
    },

    clearFlagCaches() {
      this.flagCaches = {};
    },

    clearStore() {
      this.token = {
        accessToken: '',
        refreshToken: '',
        loginData: '',
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

        // #ifdef H5
        this.updataH5Info(opt);
        // #endif
      }
    },

    onAppLaunch(opt: any) {
      if (opt) {
        this.appLaunchData = opt;
        // #ifdef H5
        this.updataH5Info(opt);
        // #endif

        // #ifdef MP-WEIXIN
        if (this.sysCode === '1001063') {
          this.updateOralMallData();
        }

        if (this.sysCode === '1001066' && !this.token.accessToken) {
          this.setShowFlag(true);
        }
        // #endif
      }
    },
    updataH5Info(opt) {
      // #ifdef H5
      const { sysCode, token, openid } = opt.query;

      if (sysCode) {
        if (this.sysCode !== sysCode) {
          this.clearStore();
          uni.clearStorage();
          uni.clearStorageSync();
          uni.removeStorageSync('systemConfig');
        }
        this.sysCode = sysCode;
        uni.setStorageSync('mini_v3_sysCode', sysCode);
      }

      if (token) {
        uni.setStorageSync('mini_v3_sysCode_token', token);
      }

      if (openid && sysCode === '1001035') {
        uni.setStorageSync('mini_v3_sysCode_openId', openid);
      }
      // #endif
    },

    async updateOralMallData(app?, type?) {
      // 口腔商城
      let appData = app || getCurrentInstance()!.proxy;
      if (appData) {
        // @ts-ignore
        appData.globalData.configData = {
          env: 1, //不设或0或'或空-线上，1=测试，2=模测，3=预发布，4=开发环境env:1，//
          from: 1, // 小程序的渠道值，具体咨询组件方
          mallAppId: 'mallM39dpe4692n7',
          loginPage: '/pages/home/my?isWarningLogin=1', // 小程序的登录页面地址
          token: this.token.accessToken,
          openId: this.openId,
          sysCode: this.sysCode,
          getMallToken: getTcMallToken,
        };
        if (!type) {
          await getTcMallToken(app);
        }
      }
    },

    updateToken(token: typeof this.token) {
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

    setToken({ accessToken, refreshToken, loginData = '' }) {
      this.token = {
        accessToken,
        refreshToken,
        loginData,
      };
    },

    setHerenId(id: string) {
      this.herenId = id;
    },
    setModeOld(modeOld: boolean) {
      this.modeOld = modeOld;
    },

    setShowFlag(isShowFlag: boolean) {
      this.isShowFlag = isShowFlag;
    },
  },
});

export const useGlobalStore = function () {
  return globalStore();
};
