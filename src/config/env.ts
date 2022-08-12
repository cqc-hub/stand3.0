import global from './global';
const env = {
  dev: {
    // baseApi: 'https://yyldevwwz.eheren.com' as const  //api
    baseApi: 'http://10.10.76.230:9002/gateway' as const  //api
  },
  test: {
    baseApi: 'https://testphs.eheren.com' as const
  },
  prod: {
    baseApi: 'https://netphs.eheren.com' as const
  }
}
export default env[global.env]