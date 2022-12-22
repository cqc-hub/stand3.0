import { Login } from './../../utils/modules/login';
import api from '@/service/api';
import { GStores } from '@/utils';
import global from '@/config/global';
import { getSysCode } from '@/common';
// #ifdef MP-ALIPAY
import monitor from '@/js_sdk/alipay/alipayLogger.js';
// #endif
export interface IGPay {
  label: string;
  key: 'offline' | 'online' | 'medicare';
}

export interface IPayRes {
  code: string;
  defrayFee: string;
  tradeNo: string;
  appTradeNo: string;
  defrayStartTime: string;
  channel: string;
  sign: string;
  invokeData: {
    timeStamp: string;
    packAge: string;
    paySign: string;
    appId: string;
    signType: string;
    nonceStr: string;
  };
  defrayNo: string;
  buyerAccount: string;
  appId: string;
  tradeStatus: string;
  msgInfo: string;
  channelTradeNo: string;
}

export const payMoneyOnline = async (
  data: BaseObject,
  opt: BaseObject = {
    // showMessage: false,
    hideLoading: false,
  }
) => {
  const gStores = new GStores();
  const { cardNumber, patientId, patientName } = gStores.userStore.patChoose;

  let requestArg: BaseObject = {
    patientName,
    patientId,
    cardNumber,
    source: gStores.globalStore.browser.source,
  };

  //增加判断微信小程序扫码场景 无openId的情况
  // #ifdef  MP-WEIXIN
  if (gStores.globalStore.openId === '') {
    await getOpenid().then((openId) => {
      requestArg.openId = openId;
    });
  } else {
    requestArg.openId = gStores.globalStore.openId;
  }
  requestArg.channel = 'WX_MINI';
  // #endif

  // #ifdef MP-ALIPAY
  requestArg.userId = gStores.globalStore.openId;
  requestArg.channel = 'ALI_MINI';
  // #endif

  requestArg = {
    ...requestArg,
    ...data,
  };

  const { result } = await api.addHRPay<IPayRes>(requestArg, opt as any);

  return result;
};

type ITrackType = '门诊缴费' | '住院缴费' | '挂号缴费';

const packageAuthParams = (
  args: {},
  url: `/${string}`,
  payload: {
    isOutArgs?: boolean;
  } = {}
) => {
  const gStores = new GStores();
  const argsDefault = {
    ...args,
    sysCode: getSysCode(),
  };
  const { isOutArgs } = payload;
  let authParam = argsDefault;
  let outParam: BaseObject = {};

  if (isOutArgs) {
    (authParam as any) = undefined;
    outParam = argsDefault;
  }

  return {
    authParam: {
      args: authParam,
      ...outParam,
      token: gStores.globalStore.getToken,
    },
    sysCode: undefined,
    url,
  };
};

//微信获取小程序的openid
const getOpenid = async () => {
  const gStores = new GStores();
  return new Promise<void>((resolve, reject) => {
    wx.login({
      success: async ({ code }) => {
        if (code) {
          const accountType = gStores.globalStore.browser.accountType;
          const { result } = await api.allinoneAuthApi(
            packageAuthParams(
              {
                code,
                accountType,
              },
              '/wx/getAppletsOpenId',
              {
                isOutArgs: true,
              }
            )
          );
          if (result) {
            const { openId, sessionKey } = result;
            gStores.globalStore.setOpenId(openId);
            resolve(openId);
          }
        }
      },
    });
  });
};

export const toPayPull = async (data: IPayRes, type?: ITrackType) => {
  const gStores = new GStores();
  return new Promise(async (resolve, reject) => {
    const { invokeData } = data;

    const { timeStamp, nonceStr, packAge, signType, paySign } =
      invokeData || {};
    let provider: 'alipay' | 'wxpay' | 'baidu' | 'appleiap' = 'wxpay';

    const payData = {
      provider,
      orderInfo: data.channelTradeNo,
      timeStamp,
      nonceStr,
      package: packAge,
      signType,
      paySign,
    };

    // #ifdef MP-WEIXIN || MP-ALIPAY
    await new Promise((resolve) => {
      uni.getProvider({
        service: 'payment',
        success(result) {
          // @ts-expect-error
          payData.provider = result.provider[0];
          resolve(void 0);
        },
      });
    });

    uni.requestPayment({
      ...payData,
      success(e) {
        // #ifdef MP-ALIPAY
        alipayTrack(true, type); 

         if (e.resultCode == "9000") {
          //支付宝成功支付
          resolve({
            payedRes: e,
            payRes: payData,
          });
        } else {
          gStores.messageStore.showMessage("取消支付", 1500);
        }
         // #endif 
         
          // #ifdef  MP-WEIXIN
          resolve({
            payedRes: e,
            payRes: payData,
          });
          // #endif
      },

      fail(err) {
        // #ifdef MP-ALIPAY
        alipayTrack(false, type);
        // #endif
        gStores.messageStore.showMessage("取消支付", 1500);
        reject(err);
      },
    });
    // #endif
  });
};

//支付宝埋点
const alipayTrack = (isSuccess: boolean, type?: ITrackType) => {
  const alipayPid = global.systemInfo.alipayPid;
  console.log('缴费埋点', isSuccess, type);
  if (alipayPid && type) {
    monitor.api({
      api: type,
      success: isSuccess,
      c1: 'taSR_YL',
      time: '200',
    });
  }
};
