import { joinQuery, joinQueryForUrl } from '@/common';
import { GStores, apiAsync } from '@/utils';
import globalGl from '@/config/global';
import { setLocalStorage } from '@/common';
import { useCacheStore } from '@/stores';

export const getClinicUtils = async (): Promise<any> => {
  return new Promise(async (r, j) => {
    uni.showLoading({});

    // @ts-expect-error
    require('../../../pagesA/clinicPay/utils/clinicPayDetail', async (
      utils
    ) => {
      uni.hideLoading();
      r(utils);
    });
  });
};

export const handlerMedicalPayDongRuan = async ({
  medOrgOrd,
  resultConfig,
}: {
  /**
   * - cancelUrl 失败、取消回调
   * - successUrl 成功支付回调
   */
  resultConfig: {
    cancelUrl: string;
    successUrl: string;
  };
  medOrgOrd: string;
}) => {
  const clinicUtils = await getClinicUtils();
  const cacheStore = useCacheStore();
  await clinicUtils.getMedicalArgWithFamily();

  return new Promise(async (r, j) => {
    const { confirm } = await apiAsync(uni.showModal, {
      content: '请点击确定跳转医保小程序?',
    });

    if (!confirm) {
      uni.reLaunch({
        url: resultConfig.cancelUrl,
      });
      j('取消');

      return;
    }

    cacheStore.changeCacheData3({
      medOrgOrd,
      resultConfig,
    });
    await clinicUtils.handlerMedicalPayDongRuan({
      medOrgOrd,
      resultConfig,
    });
  });
};

export const getMedicalAuthCode = async (data): Promise<string> => {
  let fCode = '';

  const gStores = new GStores();
  const {
    sConfig: { medicalMHelp },
  } = globalGl;
  const { alipay, wx: _wx } = medicalMHelp!;

  if (gStores.globalStore.ev === 'wx') {
    // 授权码只能使用一次 每次必须重新授权
    const { appId, path } = _wx!.medicalNation!;

    setLocalStorage({
      'get-wx-medical-auth-code': '1',
    });
    let registerId = data[0].registerId;
    let payBackParams = encodeURIComponent(
      JSON.stringify(data[0].payBackParams)
    );

    uni.navigateToMiniProgram({
      appId,
      path,
      envVersion: globalGl.env === 'prod' ? 'release' : 'trial',
      fail({ errMsg }) {
        if (errMsg.includes('fail cancel')) {
          setLocalStorage({
            'get-wx-medical-auth-code': '',
          });

          gStores.messageStore.showMessage(
            '未完成电子医保凭证授权,无法继续医保结算'
          );
          setTimeout(() => {
            uni.navigateTo({
              url: joinQuery('/pagesC/cloudHospital/cachePage', {
                payment: 'back',
                registerId: registerId,
                payBackParams: payBackParams,
              }),
            });
          }, 1000);
        }
      },
    });

    return Promise.reject('请求授权...');
  } else if (gStores.globalStore.ev === 'alipay') {
    const { authCode } = await apiAsync(my.getAuthCode, {
      scopes: ['nhsamp', 'auth_user'],
    });

    fCode = authCode;
  }

  return fCode;
};

/**微信自费支付 */
export const wxPay = (data) => {
  var paymentData = data[0].invokeData;
  let registerId = data[0].registerId;
  let payBackParams = encodeURIComponent(JSON.stringify(data[0].payBackParams));
  uni.requestPayment({
    timeStamp: paymentData.timeStamp,
    nonceStr: paymentData.nonceStr,
    package: paymentData.package,
    signType: paymentData.signType,
    paySign: paymentData.paySign,
    success: () => {
      uni.navigateTo({
        url: joinQuery('/pagesC/cloudHospital/cachePage', {
          payment: 'next',
          registerId: registerId,
          payBackParams: payBackParams,
        }),
      });
    },
    fail: () => {
      uni.showToast({
        title: '已取消',
        icon: 'none',
      });
      setTimeout(() => {
        uni.navigateTo({
          url: joinQuery('/pagesC/cloudHospital/cachePage', {
            payment: 'back',
            registerId: registerId,
            payBackParams: payBackParams,
          }),
        });
      }, 1000);
    },
    provider: 'wxpay',
    orderInfo: '',
  });
};

/**支付宝插件授权 */
export const aliPayMedicalPluginGetAuthCode = (insuranceParams) => {
  let params = {
    // 机构ID
    orgId: insuranceParams.orgId,
    // 院内卡 卡号
    cardNo: insuranceParams.cardNo,
    // 院内卡 卡类型
    cardType: insuranceParams.cardType,
    // 医疗机构订单号
    medOrgOrd: insuranceParams.medOrgOrd,
  };
  console.warn('获取到医保数据', insuranceParams);
  // const gStores = new GStores();

  // 调用支付方法前，需要获取授权
  my.getAuthCode({
    scopes: ['auth_user', 'nhsamp'],
    success: (res) => {
      const authPayPlugin = requirePlugin('auth-pay-plugin');

      console.log(res, '000000', 'authPayPlugin', authPayPlugin);
      const { authCode } = res;

      authPayPlugin.toAuthAndPay({
        // 授权获取的authCode
        authCode,
        // 请求接口所需参数
        params,
      });
    },
  });
};

export const aliPayMedicalPluginPay = (yibaoRegisterId, yibaoPayBackParams) => {
  const {
    sConfig: { medicalMHelp },
  } = globalGl;
  if (medicalMHelp) {
    const { alipay } = medicalMHelp;
    if (alipay?.medicalPlugin) {
      console.log('object hhhhh', yibaoRegisterId, yibaoPayBackParams);
      const authPayPlugin = requirePlugin('auth-pay-plugin');
      console.log('authPayPlugin', authPayPlugin);
      authPayPlugin.initMethods({
        // 医保授权后，预结算接口报错回调函数（处理逻辑示例）
        catchException: (error) => {
          console.log(
            'catchException error: ',
            error,
            yibaoRegisterId,
            yibaoPayBackParams
          );
          uni.reLaunch({
            url: joinQuery('/pagesC/cloudHospital/cachePage', {
              payment: 'back',
              registerId: yibaoRegisterId.value,
              payBackParams: JSON.stringify(yibaoPayBackParams.value),
            }),
          });
        },
        // 支付回调函数
        payComplete: (status, ampTraceId) => {
          console.log(
            'payComplete',
            status,
            ampTraceId,
            yibaoRegisterId,
            yibaoPayBackParams
          );
          uni.reLaunch({
            url: joinQuery('/pagesC/cloudHospital/cachePage', {
              status,
              ampTraceId,
              payment: 'next',
              registerId: yibaoRegisterId.value,
              payBackParams: JSON.stringify(yibaoPayBackParams.value),
            }),
          });
        },
        // 支付模块-取消医保授权（处理逻辑示例，建议直接回跳至订单待支付页面）
        payCancelAuth: () => {
          console.log('payCancelAuth', yibaoRegisterId, yibaoPayBackParams);
          uni.reLaunch({
            url: joinQuery('/pagesC/cloudHospital/cachePage', {
              payment: 'cancel',
              registerId: yibaoRegisterId.value,
              payBackParams: JSON.stringify(yibaoPayBackParams.value),
            }),
          });
        },
      });
    }
  }
};

export const aliPayMedicalPluginPayInit = () => {
  const {
    sConfig: { medicalMHelp },
  } = globalGl;
  if (medicalMHelp) {
    const { alipay } = medicalMHelp;
    if (alipay?.medicalPlugin) {
      const authPayPlugin = requirePlugin('auth-pay-plugin');
      const b = (arg) => {
        uni.reLaunch({
          url: joinQueryForUrl('/pagesC/cloudHospital/cloudHospital', arg),
        });
      };
      authPayPlugin.initMethods({
        // 医保授权后，预结算接口报错回调函数（处理逻辑示例）
        catchException: (error) => {
          console.log('catchException error: ', error);
          b({
            _url: 'pages/v3/prescriptionPay/list',
          });
        },
        // 支付回调函数
        payComplete: (status, ampTraceId) => {
          b({
            _url: 'pages/v3/prescriptionPay/list?current=1',
          });
        },
        // 支付模块-取消医保授权（处理逻辑示例，建议直接回跳至订单待支付页面）
        payCancelAuth: () => {
          b({
            _url: 'pages/v3/prescriptionPay/list',
          });
        },
      });
    }
  }
};
