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
    | string
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
    tkInfo?: any;
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
  // #endif

  // #ifdef MP-ALIPAY
  requestArg.userId = gStores.globalStore.openId;
  if (!gStores.globalStore.openId) {
    requestArg.userId = await getOpenid2();
  }
  // #endif

  requestArg.channel = aliPayOldSystemPayType();

  requestArg = {
    ...requestArg,
    ...data,
  };

  const { result } = await api.addHRPay<IPayRes>(requestArg, opt as any);

  return result;
};

type ITrackType =
  | '门诊缴费'
  | '住院缴费'
  | '挂号缴费'
  | '药品配送下单'
  | '中药代煎';

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
  const { ev } = gStores.globalStore;
  return new Promise(async (resolve, reject) => {
    const { invokeData } = data;

    const { timeStamp, nonceStr, packAge, signType, paySign } =
      invokeData || {};
    let provider: 'alipay' | 'wxpay' | 'baidu' | 'appleiap' | 'toutiao' =
      'wxpay';

    let payData: any = {
      provider,
      orderInfo: data.channelTradeNo,
      timeStamp,
      nonceStr,
      package: packAge,
      signType,
      paySign,
    };

    // #ifdef MP-TOUTIAO
    payData = {
      service: '1',
      provider,
      orderInfo: invokeData?.tkInfo,
      payChannel: {
        default_pay_channel: 'alipay', // wx || alipay
      },
      _debug: 1,
    };
    // #endif

    if (['wx', 'alipay', 'tt'].includes(ev || '')) {
      await new Promise((resolve) => {
        uni.getProvider({
          service: 'payment',
          success(result) {
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

          // #ifdef MP-TOUTIAO
          // 目前抖音测试来看 支付宝支付成功是0 微信成功是9 取消是4
          // if(e.code === 9 || e.code === 0){
          //    resolve({
          //     payedRes: e,
          //     payRes: payData,
          //   });
          // }
          console.log('抖音支付出参', e);
          if (e.code === 4) {
            gStores.messageStore.showMessage('取消支付', 1500);
          } else {
            resolve({
              payedRes: e,
              payRes: payData,
            });
          }
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
    }
  });
};

//支付宝埋点
const alipayTrack = (isSuccess: boolean, type?: ITrackType) => {
  const alipayPid = global.systemInfo.alipayPid;
  // console.warn('缴费埋点', isSuccess, type);
  // if (alipayPid && type) {
  //   monitor.api({
  //     api: type,
  //     success: isSuccess,
  //     c1: 'taSR_YL',
  //     time: '200',
  //   });
  // }
};

export const getOpenidTtResult = async (): Promise<{
  openId: string;
  sessionKeyEn: string;
  anonymousCode: string;
  code: string;
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

  return {
    ...result,
    code,
    anonymousCode,
  };
};

//判断该项目是否为2024年12月以前的项目，如是则payType使用ALI_MINI，否则使用ALI_JSAPI
export const aliPayOldSystemPayType = () => {
  const gStores = new GStores();
  const { sysCode, ev } = gStores.globalStore;
  let channel = '';

  if (ev === 'wx') {
    switch (sysCode) {
      case '1001093':
        channel = 'LIANZHONG_ICBC_H5';
        break;

      case '1001063':
        channel = 'ICBC_JFT_H5';
        break;

      case '1001048':
        channel = 'UN_MINI_WX';
        break;

      case '1001071':
        channel = 'CITIC_WX_JSAPI';
        break;
      case '1001036':
        channel = 'BCM_WX_MINI';
        break;

      default:
        channel = 'WX_MINI';
        break;
    }
  } else if (ev === 'alipay') {
    const aliMiniSystemList = [
      '1001033',
      '1001044',
      '1001035',
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

    switch (sysCode) {
      case '1001093':
        channel = 'LIANZHONG_ICBC_H5';
        break;

      case '1001063':
        channel = 'ICBC_JFT_H5';
        break;

      case '1001048':
        channel = 'UN_MINI_ALI';
        break;

      case '1001036':
        channel = 'BCM_ALI_MINI';
        break;

      default:
        if (aliMiniSystemList.includes(sysCode)) {
          channel = 'ALI_MINI';
        } else {
          channel = 'ALI_JSAPI';
        }
        break;
    }
  } else if (ev === 'tt') {
    // 1001035
    channel = 'ALI_APP';
  }

  return channel;
};
