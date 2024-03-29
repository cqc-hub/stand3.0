import global from './global';
const env = {
  dev: {
    baseApi: 'https://devphs.eheren.com/gateway' as const,
  },
  test: {
    baseApi: 'https://testphs.eheren.com/gateway' as const,
  },
  prod: {
    baseApi: 'https://netphs.eheren.com/gateway' as const,
  },
};
export default env[global.env];
export {};
