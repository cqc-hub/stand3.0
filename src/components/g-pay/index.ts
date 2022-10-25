import api from '@/service/api';

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
  const { result } = await api.addHRPay<IPayRes>(data);

  return result;
};

export const toPayPull = async (data: IPayRes) => {
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
          // @ts-ignore
          payData.provider = result.provider[0];
          resolve(void 0);
        },
      });
    });

    uni.requestPayment({
      ...payData,
      success(e) {
        resolve({
          payedRes: e,
          payRes: payData,
        });
      },

      fail: reject,
    });
    // #endif
  });
};
