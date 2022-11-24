import api from '@/service/api';
import { GStores } from '@/utils';
import global from '@/config/global';
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
}

export const payMoneyOnline = async (data: BaseObject) => {
  const gStores = new GStores();
  const { cardNumber, patientId, patientName } = gStores.userStore.patChoose;

  let requestArg: BaseObject = {
    patientName,
    patientId,
    cardNumber,
    source: gStores.globalStore.browser.source,
  };

  // #ifdef  MP-WEIXIN
  requestArg.openId = gStores.globalStore.openId;
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

  const { result } = await api.addHRPay<IPayRes>(requestArg);

  return result;
};

type ITrackType = "门诊缴费" | "住院缴费";

export const toPayPull = async (data: IPayRes,type?:ITrackType) => {
  return new Promise(async (resolve, reject) => {
    const { invokeData } = data;

    const { timeStamp, nonceStr, packAge, signType, paySign } = invokeData;
    let provider: 'alipay' | 'wxpay' | 'baidu' | 'appleiap' = 'wxpay';

    const payData = {
      provider,
      orderInfo: data.appTradeNo,
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
         alipayTrack(true,type)
          // #endif
        resolve({
          payedRes: e,
          payRes: payData,
        });
      },

      fail(err){
          // #ifdef MP-ALIPAY
          alipayTrack(false,type)
          // #endif
        reject(err)
      },
    });
    // #endif
  });
};


//支付宝埋点
const alipayTrack = (isSuccess:boolean,type?:ITrackType)=>{
  const alipayPid =  global.systemInfo.alipayPid
  if(alipayPid){
    monitor.api({
      api: "门诊缴费",
      success: isSuccess,
      c1: "taSR_YL",
      time: "200",
    });
  }
}
