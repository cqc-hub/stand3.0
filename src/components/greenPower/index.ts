import { ref } from 'vue';
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

// 报告查询
const getReportPower = async function (repId) {
  const { authCode } = (await getMyPowerQx()) as any;
  const sysCode = uni.getStorageSync('sysCode');

  if (authCode) {
    const { result } = await api.energySendReg({
      orderId: sysCode + repId,
      sysCode,
      scene: 'hoinquire', // 挂号 horegister 报告 hoinquire
      userId: uni.getStorageSync('openid'),
    });

    if (result && result.totalEnergy && result.totalEnergy != 0) {
      return result.totalEnergy;
    }
  }
};

export const useReportPowerEnerg = function () {
  const contentTitle = ref('本次查询得绿色能量');
  const greenToastContent = ref('');
  const greenToastDuration = ref(1500);

  const getPowerEnerg = async (repId: string) => {
    // #ifdef MP-ALIPAY
    getReportPower(repId).then((res) => {
      greenToastContent.value = res;
    });
    // #endif
  };

  return {
    contentTitle,
    greenToastContent,
    greenToastDuration,
    getPowerEnerg,
  };
};
