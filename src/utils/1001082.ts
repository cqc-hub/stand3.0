export const getUtils1001082 = async (): Promise<any> => {
  return new Promise(async (r, j) => {
    uni.showLoading({ title: '加载中'});;

    // @ts-expect-error
    require('../cacheUtil/1001082Util', async (utils) => {
      uni.hideLoading();
      r(utils);
    });
  });
};
