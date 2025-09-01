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
};

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
      baseApi: 'https://netphs.eheren.com/gateway',
    },
  });
}

if (global.SYS_CODE === '1001082') {
  Object.assign(env, {
    dev: {
      baseApi: 'https://eservice.wzswsj.gov.cn/gateway',
    },
    test: {
      baseApi: 'https://eservice.wzswsj.gov.cn/gateway',
    },
    prod: {
      baseApi: 'https://eservice.wzswsj.gov.cn/gateway',
    },
  });
}

export const envBasic = _envBasic[global.env];
export default env[global.env];
export {};
