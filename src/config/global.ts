// import  {version} from '../package.json'
type TEnv = 'dev' | 'test' | 'prod';
const BASE_IMG = "https://phsdevoss.eheren.com/pcloud/phs3.0/"; //oss静态资源服务器
const YMD = '20220506' //年月日，每次版本更新必须同步更新
const HM = '0955' //时分，每次版本更新必须同步更新
// const VERSION = version + '.' + YMD; //版本号
// const TIMESTAMP = version + '.' + YMD + HM; //时间戳，修改时间戳会清理项目缓存
const env: TEnv = 'test' // dev 开发； test 测试； prod 生产
// import HTMLParser from '@/common/html-parser'
export const SYS_CODE = '1001033';//系统码

export default {
  SYS_CODE,
  BASE_IMG,
  // VERSION,
  // TIMESTAMP,
  env,
  // HTMLParser
};