import manifest from '../manifest.json';
import systemConfig from './config.json';
export const BASE_IMG = 'https://phsdevoss.eheren.com/pcloud/phs3.0/'; //oss静态资源服务器

export let SYS_CODE = systemConfig.sysCode;

let env: 'dev' | 'test' | 'prod' = 'prod'; // dev 开发； test 测试； prod 生产

const WEB_OUT_LOGIN_TIME = 0; // web 环境下自动退出登录时间 ms
const wxAppid = manifest['mp-weixin'].appid;
const YMD = '20250408'; //年月日，每次版本更新必须同步更新
const HM = '1723'; //时分，每次版本更新必须同步更新
const version = '0.0.2'; //暂定

const VERSION = version + '.' + YMD; //版本号
const TIMESTAMP = version + '.' + YMD + HM; //时间戳，修改时间戳会清理项目缓存
const isOpenDes = false; //测试环境是否开启加密 正式环境必加密
const isOpenSm4 = false; //测试环境是否开启sm4加密
let authUrl = 'https://yyldevwwz.eheren.com/allinone-auth';

// @ts-ignore
if (process.env.NODE_ENV === 'production') {
  // #ifndef H5 | MP-HARMONY
  env = 'prod';
  // #endif
}

if (env === 'prod') {
  authUrl = 'https://auth.eheren.com/service-authentication';
}
const systemInfo: ISystemGlobalItem = systemConfig.sysConfig[SYS_CODE];

/**
 * 互联网需要添加的白名单路径
 * https://phsdevoss.eheren.com
 * https://interhos.eheren.com
 * https://testwechatnethos.eheren.com
 *
 */
const netUrl =
  env === 'prod'
    ? `https://interhos.eheren.com/static/nhs/`
    : `https://testwechatnethos.eheren.com/static/nhs/`;

const h5Url =
  env === 'prod'
    ? // ? 'https://h5.eheren.com/v4/#/'
      'https://h5.eheren.com/v3/#/'
    : // : 'https://health.eheren.com/v3dev/#/';
      'https://health.eheren.com/v3/#/';

const getK = (k: string) => {
  return 're$v3'.replace('$', k);
};

const globalGl = {
  SYS_CODE,
  BASE_IMG,
  VERSION,
  TIMESTAMP,
  env,
  authUrl,
  wxAppid,
  h5AppId: '',
  systemInfo,
  systemConfig: systemConfig.sysConfig,
  addPersonUrl: systemConfig.sysConfig.isSearchInHos
    ? '/pagesA/medicalCardMan/perfectReal'
    : '/pagesA/medicalCardMan/addMedical',
  isOpenDes,
  isOpenSm4,
  netUrl,
  h5Url,
  sConfig: (systemConfig.sysConfig.sConfig || {}) as unknown as ISConfig,
  WEB_OUT_LOGIN_TIME,
  q: getK('q'),
  r: getK('s'),
};

Object.defineProperties(globalGl, {
  systemInfo: {
    get() {
      return systemConfig.sysConfig || {};
    },
  },

  wxAppid: {
    get() {
      return this.systemInfo.wxAppid;
    },
  },

  h5AppId: {
    get() {
      if (this.systemInfo.h5AppidDisabledInTest && env !== 'prod') {
        return '';
      }
      return this.systemInfo.h5Appid;
    },
  },
});

export default globalGl;
export const sysConfig = systemConfig;