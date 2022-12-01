import manifest from '@/manifest.json';
import systemConfig from './config.json';
const wxAppid = manifest['mp-weixin'].appid;

type TEnv = 'dev' | 'test' | 'prod';
export const BASE_IMG = 'https://phsdevoss.eheren.com/pcloud/phs3.0/'; //oss静态资源服务器
const YMD = '20221013'; //年月日，每次版本更新必须同步更新
const HM = '1723'; //时分，每次版本更新必须同步更新
const version = '0.0.1'; //暂定
const VERSION = version + '.' + YMD; //版本号
const TIMESTAMP = version + '.' + YMD + HM; //时间戳，修改时间戳会清理项目缓存
const env: TEnv = 'prod'; // dev 开发； test 测试； prod 生产
const isOpenDes = false; //测试环境是否开启加密 正式环境必加密
let authUrl = 'https://yyldevwwz.eheren.com/allinone-auth';

if ((env as string) === 'prod') {
  authUrl = 'https://auth.eheren.com/service-authentication';
}

export const SYS_CODE = systemConfig.sysCode; //系统码 台州
const systemInfo: ISystemGlobalItem = systemConfig.sysConfig[SYS_CODE];
const h5AppId = systemInfo.h5Appid;

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
  addPersonUrl: systemInfo.isSearchInHos
    ? '/pagesA/medicalCardMan/perfectReal'
    : '/pagesA/medicalCardMan/addMedical',
  isOpenDes,
};

export default globalGl;
