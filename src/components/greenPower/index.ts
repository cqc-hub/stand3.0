import { GStores } from '@/utils';
import api from '@/service/api';

// 支付宝蚂蚁能量
export const getMyPowerQx = function (scopes = 'mfrstre') {
  return new Promise((resolve, reject) => {
    const gStores = new GStores();
    my.getAuthCode({
      scopes: [scopes], // 蚂蚁能量授权：mfrstre。或者其它scope
      success: async (res) => {
        // console.log(res, 'qcqc');
        // return

        if (res.authCode) {
          await api.authorization({
            accountType: gStores.globalStore.browser.accountType,
            code: res.authCode,
            userId: gStores.globalStore.openId,
            scope: scopes,
          });
          resolve(res);
        } else {
          reject(res);
        }
      },

      fail: (e) => {
        reject(e);
      },
    });
  });
};
