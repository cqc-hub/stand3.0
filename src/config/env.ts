import global from './global';
const env = {
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

export default env[global.env];
export {};
