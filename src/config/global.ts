import manifest from '../manifest.json';
import systemConfig from './config.json';
import { getSConfig } from './sConfig';

export const BASE_IMG = 'https://phsdevoss.eheren.com/pcloud/phs3.0/' as const; //oss静态资源服务器
export const SYS_CODE = systemConfig.sysCode;

let env = <'dev' | 'test' | 'prod'>'test'; // dev 开发； test 测试； prod 生产

const WEB_OUT_LOGIN_TIME = 0 as const; // web 环境下自动退出登录时间 ms
const wxAppid = manifest['mp-weixin'].appid;
const YMD = '20230118'; //年月日，每次版本更新必须同步更新
const HM = '1723'; //时分，每次版本更新必须同步更新
const version = '0.0.1'; //暂定
const VERSION = version + '.' + YMD; //版本号
const TIMESTAMP = version + '.' + YMD + HM; //时间戳，修改时间戳会清理项目缓存
const isOpenDes = false; //测试环境是否开启加密 正式环境必加密
let authUrl = 'https://yyldevwwz.eheren.com/allinone-auth';

// @ts-ignore
if (process.env.NODE_ENV === 'production') {
  // #ifndef H5
  env = 'prod';
  // #endif
}

if (env === 'prod') {
  authUrl = 'https://auth.eheren.com/service-authentication';
}

const systemInfo: ISystemGlobalItem = systemConfig.sysConfig[SYS_CODE];
let h5AppId = systemInfo.h5Appid;
if (systemInfo.h5AppidDisabledInTest && env !== 'prod') {
  h5AppId = '';
}

const netUrl =
  env === 'prod'
    ? `https://interhos.eheren.com/static/nhs/`
    : `https://testwechatnethos.eheren.com/static/nhs/`;

const h5Url =
  env === 'prod'
    ? 'https://h5.eheren.com/v3/#/'
    : 'https://health.eheren.com/v3/#/';

const globalGl = {
  SYS_CODE,
  BASE_IMG,
  VERSION,
  TIMESTAMP,
  env,
  authUrl,
  wxAppid,
  h5AppId,
  systemInfo,
  systemConfig: systemConfig.sysConfig[SYS_CODE],
  addPersonUrl: systemInfo.isSearchInHos
    ? '/pagesA/medicalCardMan/perfectReal'
    : '/pagesA/medicalCardMan/addMedical',
  isOpenDes,
  netUrl,
  h5Url,
  sConfig: getSConfig(SYS_CODE),
  WEB_OUT_LOGIN_TIME,
} as const;

export default globalGl;
