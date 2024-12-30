import api from '@/service/api';
import { GStores, packageAuthParams, apiAsync, LoginUtils } from '@/utils';
import global from '@/config/global';
import { getSysCode } from '@/common';

// #ifdef MP-ALIPAY
import monitor from '@/js_sdk/alipay/alipayLogger.js';
// #endif
export interface IGPay {
  label: string;
  key:
    | 'offline'
    | 'online'
    | 'medicare'
    | 'digital'
    | 'familyPay'
    | 'bizType'
    | 'navToMini';
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
    payUrl: string;
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
  requestArg.channel = aliPayOldSystemPayType();

  // #endif

  // #ifdef MP-ALIPAY
  requestArg.userId = gStores.globalStore.openId;
  if (!gStores.globalStore.openId) {
    requestArg.userId = await getOpenid2();
  }
  requestArg.channel = aliPayOldSystemPayType();
  // #endif

  requestArg = {
    ...requestArg,
    ...data,
  };

  const { result } = await api.addHRPay<IPayRes>(requestArg, opt as any);

  return result;
};

type ITrackType = '门诊缴费' | '住院缴费' | '挂号缴费';

//微信获取小程序的openid
export const getOpenid = async (): Promise<string> => {
  const gStores = new GStores();
  return new Promise<string>((resolve, reject) => {
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

// alipay
export const getOpenid2 = async (): Promise<string> => {
  return (await new LoginUtils().getAliOpenid()).userId;
};

// tt
export const getOpenidTt = async () => {
  const { openId } = await getOpenidTtResult();

  return openId;
};

export const getOpenId = async () => {
  // #ifdef MP-ALIPAY
  return await getOpenid2();
  // #endif

  // #ifdef  MP-WEIXIN
  return await getOpenid();
  // #endif

  // #ifdef MP-TOUTIAO
  return await getOpenidTt();
  // #endif

  return '';
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

        fail: reject,
      });
    });

    uni.requestPayment({
      ...payData,
      success(e) {
        // #ifdef MP-ALIPAY
        alipayTrack(true, type);

        if (e.resultCode == '9000') {
          //支付宝成功支付
          resolve({
            payedRes: e,
            payRes: payData,
          });
        } else {
          gStores.messageStore.showMessage('取消支付', 1500);
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
        console.error('支付错误---', err);

        // #ifdef MP-ALIPAY
        alipayTrack(false, type);
        // #endif
        gStores.messageStore.showMessage('取消支付', 1500);
        reject(err);
      },
    });
    // #endif
  });
};

//支付宝埋点
const alipayTrack = (isSuccess: boolean, type?: ITrackType) => {
  const alipayPid = global.systemInfo.alipayPid;
  console.warn('缴费埋点', isSuccess, type);
  if (alipayPid && type) {
    monitor.api({
      api: type,
      success: isSuccess,
      c1: 'taSR_YL',
      time: '200',
    });
  }
};

export const getOpenidTtResult = async (): Promise<{
  openId: string;
  sessionKeyEn: string;
}> => {
  const gStores = new GStores();
  const accountType = gStores.globalStore.browser.accountType;

  const { anonymousCode, code } = await apiAsync(uni.login, {});

  const { result } = await api.allinoneAuthApi(
    packageAuthParams(
      {
        code,
        anonymousCode,
        accountType,
      },
      '/tikTok/getTikTokOpenId'
    )
  );

  return result;
};

//判断该项目是否为2024年12月以前的项目，如是则payType使用ALI_MINI，否则使用ALI_JSAPI
export const aliPayOldSystemPayType = () => {
  const gStores = new GStores();
  let channel = '';
  // #ifdef  MP-WEIXIN
  channel = 'WX_MINI';
  const wxICBCJFTSystem = ['1001063'];
  wxICBCJFTSystem.includes(gStores.globalStore.sysCode) &&
    (channel = 'ICBC_JFT_H5');
  // #endif
  // #ifdef MP-ALIPAY
  channel = 'ALI_MINI';
  const aliMiniSystemList = [
    '1001033',
    '2001013',
    '1001052',
    '1001046',
    '1001060',
    '1001055',
    '1001054',
    '1001056',
    '1001057',
    '1001058',
    '1001040',
    '1001045',
    '1001066',
    '1001038',
    // '1001067',
    // '1001074',
  ];
  const aliICBCJFTSystem = ['1001063'];
  !aliMiniSystemList.includes(gStores.globalStore.sysCode) &&
    (channel = 'ALI_JSAPI');
  aliICBCJFTSystem.includes(gStores.globalStore.sysCode) &&
    (channel = 'ICBC_JFT_H5');
  // #endif
  return channel;
};
