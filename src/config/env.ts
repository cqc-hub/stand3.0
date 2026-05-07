import { T_ENV_H5 } from '@/stores';
import global from './global';

const _envBasic = {
  dev: {
    baseApi: 'https://devphs.eheren.com/gateway',
  },
  test: {
    baseApi: 'https://testphs.eheren.com/gateway',
  },
  prod: {
    baseApi: 'https://netphs.eheren.com/gateway',
  },

  ev: 'wx' as T_ENV_H5,
};

// #ifdef H5
_envBasic.ev = 'web';
// #endif

// #ifdef MP-ALIPAY
_envBasic.ev = 'alipay';
// #endif

const env = {
  ..._envBasic,
};

if (global.SYS_CODE === '1001035') {
  Object.assign(env, {
    dev: {
      baseApi: 'https://devphs.eheren.com/gateway',
    },
    test: {
      baseApi: 'https://testphs.eheren.com/gateway',
    },
    prod: {
      // baseApi: 'https://netphs.eheren.com/gateway',
      baseApi: 'https://netphs.jshtcm.com.cn/gateway',
    },
  });
}

export const globalEv = env;
export const envBasic = _envBasic[global.env];
export default env[global.env];
export {};
