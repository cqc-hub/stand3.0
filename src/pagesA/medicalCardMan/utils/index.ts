import { ref } from 'vue';
import type { TInstance } from '@/components/g-form/index';
import { cloneUtil } from '@/common';
import { decryptDes } from '@/common/des';
import {
  idValidator,
  ServerStaticData,
  GStores,
  AliPayLoginHandler,
  apiAsync,
  wait,
  PatientUtils,
  routerJump,
  getH5OpenidParam,
  useTBanner,
} from '@/utils';
import api from '@/service/api';
import globalGl, { SYS_CODE } from '@/config/global';

/**
 * 完善、 新增就诊人页面
 */
// 修改值  需要单独修改 addMedical 页面的 prop
export const formKey = <const>{
  patientType: 'patientType',
  // patientType: 'patientType',
  idType: 'idType',
  idCard: 'idCard',
  patientName: 'patientName',
  patientPhone: 'patientPhone',
  birthday: 'birthday',
  sex: 'sex',
  upName: 'upName',
  upIdCard: 'upIdCard',
  address: 'address',
  location: 'location',
  verifyCode: 'verifyCode',
  defaultFalg: 'defaultFalg',
  nation: 'nation',
  isUserInfoShareAgree: 'isUserInfoShareAgree',
};

export type TCardPat = {
  inHospitalId: string;
  cardBalance: string;
  cardNumber: string;
  cardType: string;
  createTime: string;
  patientName: string;
  idTypeName: string;
  idCard: string;
};

export type FormKey = typeof formKey;

export type TFormKeys = keyof FormKey;

export const tempList: TInstance[] = [
  {
    required: true,
    showSuffixArrowIcon: true,
    label: '就诊人类型',
    placeholder: '请选择',
    key: formKey.patientType,
    field: 'select',
    options: [],
    autoOptions: 'patientTypeTerms',
    labelWidth: '220rpx',
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '民族',
    placeholder: '请选择',
    key: formKey.nation,
    field: 'select',
    options: [],
    autoOptions: 'nationTerms',
    rowStyle: 'margin-bottom: 16rpx;',
    labelWidth: '220rpx',
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '证件类型',
    placeholder: '请选择',
    key: formKey.idType,
    field: 'select',
    options: [],
    autoOptions: 'idTypeTerms',
    labelWidth: '220rpx',
  },

  {
    required: true,
    label: '证件号码',
    field: 'input-text',
    placeholder: '请输入',
    key: formKey.idCard,
    labelWidth: '220rpx',
  },

  {
    required: true,
    label: '真实姓名',
    field: 'input-text',
    placeholder: '请输入',
    key: formKey.patientName,
    labelWidth: '220rpx',
    maxlength: 50,
    validator(value) {
      const v = <string>value;

      if (v) {
        if (v.length < 2) {
          return Promise.resolve({
            success: false,
            message: '真实姓名需要大于2个字符',
          });
        }
        const isEng = v.match(/^[A-Za-z]+\s?[A-Za-z]+$/);

        if (isEng) {
          return Promise.resolve({
            success: true,
          });
        } else {
          // const result = v.match(
          //   /^[\u4e00-\u9fa5]{1,10}\.?\·?[\u4e00-\u9fa5]{1,10}$/
          // );

          // if (!result) {
          //   return Promise.resolve({
          //     success: false,
          //     message: '中文名字不能大于 20 个字符',
          //   });
          // }

          if (v.length > 50) {
            return Promise.resolve({
              success: false,
              message: '真实姓名不能大于 50 个字符 ',
            });
          }
        }
      }

      return Promise.resolve({
        success: true,
      });
    },
  },

  {
    required: true,
    label: '手机号',
    field: 'input-text',
    placeholder: '请输入',
    maxlength: 11,
    key: formKey.patientPhone,
    rule: [
      {
        message: '请确认手机号是否有误',
        rule: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      },
    ],
    labelWidth: '220rpx',
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '出生日期',
    placeholder: '请选择',
    key: formKey.birthday,
    field: 'time-picker',
    type: 'date',
    end: new Date().getTime(),
    start: '1900-01-01',
    labelWidth: '220rpx',
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '性别',
    placeholder: '请选择',
    key: formKey.sex,
    field: 'select',
    options: [
      {
        label: '男',
        value: '男',
      },
      {
        label: '女',
        value: '女',
      },
    ],
    labelWidth: '220rpx',
  },

  {
    required: true,
    label: '监护人姓名',
    field: 'input-text',
    placeholder: '请输入',
    key: formKey.upName,
    labelWidth: '220rpx',
    maxlength: 50,
  },

  {
    required: true,
    label: '监护人证件号',
    field: 'input-text',
    placeholder: '请输入',
    key: formKey.upIdCard,
    validator: async (v: unknown, item: any) => {
      if (typeof v === 'string' && v && idValidator.checkIdCardNo(v)) {
        const { ageGuardian } = await ServerStaticData.getSystemConfig(
          'person'
        );

        const info = idValidator.getIdCardInfo(v);

        if (info.age < ageGuardian) {
          return Promise.resolve({
            success: false,
            message: `监护人年龄必须大于: ${ageGuardian}岁`,
          });
        }

        return Promise.resolve({
          success: true,
        });
      }

      return Promise.resolve({
        success: false,
        message: '请确认证件号码是否有误',
      });
    },
    labelWidth: '220rpx',
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '所在地区',
    placeholder: '请选择',
    key: formKey.address,
    field: 'address',
    labelWidth: '220rpx',
  },

  {
    required: true,
    label: '详细地址',
    field: 'input-text',
    placeholder: '请输入街道、小区、门牌号等',
    key: formKey.location,
    rowStyle: 'border-radius: 0 0 16rpx 16rpx;',
    maxlength: 100,
    labelWidth: '220rpx',
    validator(value) {
      const v = <string>value;

      if (v) {
        if (v.length < 4) {
          return Promise.resolve({
            success: false,
            message: '详细地址需要大于4个字符',
          });
        }
      }

      return Promise.resolve({
        success: true,
      });
    },
  },

  {
    required: true,
    maxlength: 6,
    label: '验证码',
    field: 'input-verify',
    placeholder: '请输入',
    key: formKey.verifyCode,
    verifyBtnText: '获取验证码',
    inputType: 'number',
    verifySecond: 60,
    rule: {
      message: '验证码必须是数字',
      rule: /\d+/,
    },
    phoneKey: formKey.patientPhone,
    labelWidth: '220rpx',
  },

  {
    field: 'switch',
    key: formKey.isUserInfoShareAgree,
    label: '允许该平台访问院内此用户的就诊数据',
    showRequireIcon: true,
    required: true,
    emptyMessage: '请允许该平台访问院内此用户的就诊数据',
    validator(v) {
      if (!v) {
        return Promise.resolve({
          success: false,
          message: '请允许该平台访问院内此用户的就诊数据',
        });
      }

      return Promise.resolve({
        success: true,
      });
    },
  },

  {
    field: 'switch',
    key: formKey.defaultFalg,
    label: '设为默认就诊人',
    labelWidth: '260rpx',
    rowStyle: 'margin-top: 16rpx;',
  },
];

export const pickTempItem = function <T = TFormKeys>(
  keys: TFormKeys[]
): TInstance[] {
  const dKeys = keys.map((key) => formKey[key]);

  return cloneUtil<TInstance[]>(tempList)
    .filter((item) => dKeys.includes(<any>item.key))
    .sort((a, b) => {
      const aIndex = dKeys.findIndex((key) => key === a.key);
      const bIndex = dKeys.findIndex((key) => key === b.key);
      return aIndex - bIndex;
    });
};

/**
 * 就诊人详情页面
 */
export const patCardDetailFormKey = <const>{
  patientType: 'patientType',
  patientName: 'patientNameEncry',
  idType: 'idType',
  idCard: 'idCard',
  patientPhone: 'patientPhone',
  nation: 'nation',
  address: 'address',
  patientSex: 'patientSex',
  upName: 'upName',
  upIdCard: 'upIdCard',
  defaultFlag: 'defaultFlag',
};

export type PatCardKeys = keyof typeof patCardDetailFormKey;

export const patCardDetailTempList: TInstance[] = [
  {
    label: '就诊人类型',
    key: patCardDetailFormKey.patientType,
    field: 'select',
    disabled: true,
    isForShow: true,
    options: [],
    autoOptions: 'patientTypeTerms',
  },

  {
    label: '真实姓名',
    field: 'input-text',
    disabled: true,
    key: patCardDetailFormKey.patientName,
    isForShow: true,
  },

  {
    label: '性别',
    field: 'input-text',
    key: patCardDetailFormKey.patientSex,
    disabled: true,
    isForShow: true,
  },

  {
    label: '证件类型',
    field: 'select',
    disabled: true,
    isForShow: true,
    options: [],
    key: formKey.idType,
    autoOptions: 'idTypeTerms',
  },
  {
    label: '证件号码',
    field: 'input-text',
    disabled: true,
    key: patCardDetailFormKey.idCard,
    isForShow: true,
  },

  {
    label: '手机号',
    field: 'input-text',
    disabled: true,
    key: patCardDetailFormKey.patientPhone,
    isForShow: true,
  },

  {
    label: '民族',
    field: 'input-text',
    key: patCardDetailFormKey.nation,
    disabled: true,
    isForShow: true,
  },

  {
    label: '详细地址',
    field: 'input-text',
    key: patCardDetailFormKey.address,
    disabled: true,
    isForShow: true,
  },

  {
    label: '监护人姓名',
    field: 'input-text',
    key: patCardDetailFormKey.upName,
    disabled: true,
    isForShow: true,
  },

  {
    label: '监护人身份证号',
    field: 'input-text',
    key: patCardDetailFormKey.upIdCard,
    labelWidth: '260rpx',
    disabled: true,
    isForShow: true,
  },

  {
    field: 'switch',
    key: patCardDetailFormKey.defaultFlag,
    label: '设为默认就诊人',
    labelWidth: '260rpx',
    rowStyle: 'margin-top: 16rpx; padding: 10rpx 32rpx;',
  },
];

/**
 * 获取姓名、手机号 默认值
 * @param pageType
 * @returns
 */
export const getDefaultFormData = async (
  pageType: 'addPatient' | 'perfectReal'
) => {
  const data: Record<string, any> = {};
  const gStores = new GStores();

  if (pageType === 'perfectReal') {
    // #ifdef MP-ALIPAY
    const { userName, mobile } = gStores.userStore.cacheUser;
    data[formKey.patientName] = userName;
    data[formKey.patientPhone] = mobile;
    // #endif

    // #ifdef MP-WEIXIN
    const wxPhone = decryptDes(gStores.userStore.phoneNum, 'N1@ae^T:phone');
    data[formKey.patientPhone] = wxPhone;
    // #endif
  } else {
    // #ifdef MP-ALIPAY
    const patList = gStores.userStore.patList;

    if (!patList.length) {
      const { userName, mobile, certNo } = gStores.userStore.cacheUser;
      if (userName) {
        data[formKey.patientName] = userName;
      }
      if (mobile) {
        data[formKey.patientPhone] = mobile;
      }
      if (certNo) {
        data[formKey.idCard] = certNo;
      }
    }
    // #endif
  }

  return data;
};

export const getHealthCardCode = async (): Promise<{
  success: boolean;
  res: any;
}> => {
  // #ifdef  MP-WEIXIN
  const plugin = requirePlugin('healthCardPlugins');

  return new Promise((resolve) => {
    uni.showLoading({
      title: '请求授权中',
      mask: true,
    });

    plugin.login(
      (isok, res) => {
        uni.hideLoading();
        if (res.result.type !== 3) {
          // 用户在微信授权过，可直接获取登录信息
          resolve({
            success: true,
            res,
          });
        } else {
          // 未授权 显示 healthCardLogin 登录组件，引导用户同意授权
          resolve({
            success: false,
            res,
          });
        }
      },
      {
        wechatcode: true,
      }
    );
  });
  // #endif
};

/** 对提交后的数据重新过滤格式化 */
export const formatterSubPatientData = (data: BaseObject) => {
  const cloneData = {
    ...data,
  };

  const patientName = <string>cloneData.patientName;

  if (patientName) {
    // 新疆要求不要有英文的 '•' -> '·'
    cloneData.patientName = patientName.replace(/\•/g, '·');
  }

  return cloneData;
};

export const loginAuthAlipay = async (init: Function) => {
  const gStores = new GStores();

  const { cacheUser, patList } = gStores.userStore;

  const { userName, certNo } = cacheUser;
  // #ifdef MP-ALIPAY
  if (!certNo) {
    await new AliPayLoginHandler()
      .handlerAuth({ onlyLogin: true })
      .catch((e) => {
        gStores.messageStore.showMessage(
          '授权获取用户数据失败, 请重新进入授权',
          3000,
          {
            closeCallBack() {
              uni.reLaunch({
                url: '/pages/home/my',
              });
            },
          }
        );
        throw new Error(e);
      });

    init && init();
  }
  // #endif
};

export const useProgramPaySign = () => {
  const gStores = new GStores();
  const regDialogConfirmSign = ref(<any>'');
  const flagTitle1203 = ref('温馨提示');
  const patientUtils = new PatientUtils();
  // 存在签约功能?
  const isSignExist = ref(false);
  let isAfterSign = false;
  let _patientId = '';

  let containerEnv: 'wx' | 'ali';
  // #ifdef MP-WEIXIN
  containerEnv = <any>'wx';
  // #endif

  // #ifdef MP-ALIPAY
  containerEnv = <any>'ali';
  // #endif
  const isAgreeSign = ref(false);
  const disagreeSign = () => {
    isAgreeSign.value = false;
    // const pages = getCurrentPages();
    // if (pages && pages.length > 1) {
    //   uni.navigateBack({
    //     delta: 1,
    //   });
    // } else {
    //   uni.reLaunch({
    //     url: '/pages/home/home',
    //   });
    // }
  };

  let signAfterCount = 0;
  type TSingnPayload = {
    type: 'addPat' | 'order';
    cb?: any;
  };
  const signAfterOnPageShow = async (payload = {} as TSingnPayload) => {
    const { type = 'addPat', cb } = payload;
    // 目前只有微信是异步的
    if (
      !isAfterSign ||
      // 微信点击开通的签约授权
      gStores.globalStore.appShowData?.referrerInfo?.extraData?.return_code !==
        'SUCCESS'
    ) {
      return;
    }

    isAfterSign = false;
    signAfterCount = 0;
    if (type === 'addPat') {
      await signAfter(_patientId);
    } else {
      await orderSignAfter(_patientId, cb);
    }
  };

  const signAfter = async (patientId?: string) => {
    if (++signAfterCount > 2) {
      uni.hideLoading();
      gStores.messageStore.showMessage(
        '查询免密代扣签约失败, 添加就诊人可能失败, 请稍后再试',
        0,
        {
          useDialog: true,
          dialogOpt: {
            title: '提示',
          },
        }
      );

      throw new Error('查询免密代扣签约失败');
    }

    const {
      browser: { source },
    } = gStores.globalStore;

    uni.showLoading({
      title: '查询签约中...',
      mask: true,
    });
    await wait(5000);
    const {
      result: { message, signFlag, showFlag },
    } = await api.patSign({
      patientId,
      source,
    });

    if (showFlag) {
      await signAfter(patientId);
    } else if (signFlag) {
      await patientUtils.getPatCardList();
      routerJump('/pages/home/home');
    } else {
      gStores.messageStore.closeMessage();
      await wait(20);
      gStores.messageStore.showMessage(message, 0, {
        useDialog: true,
        dialogOpt: {
          title: '提示',
        },
      });
      throw new Error('查询免密代扣签约失败');
    }
    // await patientUtils.getPatCardList();
    // const pat = gStores.userStore.patList.find(
    //   (o) => o.patientId === patientId
    // );
    // if (!pat) {
    //   return await signAfter(patientId);
    // }
  };

  const orderSignAfter = async (patientId: string, cb: any = () => {}) => {
    if (++signAfterCount > 2) {
      uni.hideLoading();
      gStores.messageStore.showMessage(
        '查询免密代扣签约失败, 就诊人授权免密代扣可能失败, 请稍后再试',
        0,
        {
          useDialog: true,
          dialogOpt: {
            title: '提示',
          },
        }
      );

      throw new Error('查询免密代扣签约失败');
    }

    const {
      browser: { source },
    } = gStores.globalStore;

    uni.showLoading({
      title: '查询签约中...',
      mask: true,
    });
    await wait(5000);
    const {
      result: { message, signFlag, showFlag },
    } = await api.patSign({
      patientId,
      source,
    });

    if (showFlag) {
      await orderSignAfter(patientId, cb);
    } else if (signFlag) {
      await patientUtils.getPatCardList();
      await cb();
    } else {
      gStores.messageStore.closeMessage();
      await wait(20);
      gStores.messageStore.showMessage(message, 0, {
        useDialog: true,
        dialogOpt: {
          title: '提示',
        },
      });
      throw new Error('查询免密代扣签约失败');
    }
  };

  return {
    signAfterOnPageShow,
    disagreeSign,
    isAgreeSign,
    isAgreeSignChange(v) {
      if (v) {
        regDialogConfirmSign.value.show();
      } else {
        isAgreeSign.value = v;
      }
    },
    flagTitle1203,
    regDialogConfirmSign,
    isSignExist,
    async initSign() {
      const { isPayWithoutSecretAuth } = await ServerStaticData.getSystemConfig(
        'person'
      );

      if (isPayWithoutSecretAuth === '1') {
        // regDialogConfirmSign.value.show();
        isSignExist.value = true;
      }
    },

    async goPaySign(patientId, payload = {} as TSingnPayload) {
      const { type = 'addPat', cb } = payload;

      const { isPayWithoutSecretAuth } = await ServerStaticData.getSystemConfig(
        'person'
      );
      if (isPayWithoutSecretAuth !== '1') {
        return;
      }
      let { phoneNum, cacheUser, cellPhoneNum } = gStores.userStore;
      const {
        browser: { source },
        openId: _openId,
      } = gStores.globalStore;
      let channel = 'WX_JSAPI_SIGN';
      let payType = 'WX_MINI';
      let openId = '';
      let userId = '';
      // await new AliPayLoginHandler().handlerAuth()

      // #ifdef MP-WEIXIN
      channel = 'WX_MINI_SIGN';
      openId = _openId;
      // #endif

      // #ifdef MP-ALIPAY
      channel = 'ALI_MINI_SIGN';
      payType = 'ALI_MINI';
      userId = _openId;

      // if (!cacheUser.certNo) {
      //   await new AliPayLoginHandler().handlerAuth();
      // }

      // #endif

      const args = {
        channel,
        openId,
        userId,
        patientId,
        source,
        payType,
        phone: phoneNum,
        // buyerAccount: cacheUser.mobile,
        buyerAccount: cellPhoneNum,
        userIdCard: cacheUser.certNo,
        userName: cacheUser.userName,
        showUrl: '/pagesA/medicalCardMan/sign?isBack=1',
      };
      const {
        result: { invokeData, continueWxSign },
      } = await api.applyForSign(args);
      _patientId = patientId;

      if (containerEnv === 'wx') {
        if (!continueWxSign) {
          await apiAsync(wx.navigateToMiniProgram, {
            appId: 'wxbd687630cd02ce1d',
            path: 'pages/index/index',
            extraData: invokeData,
          });
          isAfterSign = true;
          // 微信签约成功后需要在 onShow 中继续走
          throw new Error('签约');
        }
      } else if (containerEnv === 'ali') {
        const { result: _aliRes, resultStatus } = await apiAsync(
          my.paySignCenter,
          {
            signStr: encodeURIComponent(invokeData.signStr),
          }
        );
        if (resultStatus !== '7000') {
          throw new Error('未签约');
        }
        let aliRes: any = {};
        try {
          aliRes = JSON.parse(_aliRes);
        } catch (error) {
          aliRes = {};
        }

        if (
          aliRes &&
          aliRes.alipay_user_agreement_page_sign_response?.code === '10000'
        ) {
          if (type === 'addPat') {
            await signAfter(_patientId);
          } else {
            await orderSignAfter(_patientId, cb);
          }
        } else {
          throw new Error('签约异常');
        }
      }
    },
  };
};
const commonQuery = {
  sysCode: globalGl.SYS_CODE,
};
const healthCardQuery = {
  ...commonQuery,

  domainChannel: 2,
  faceUrl: '/pagesA/medicalCardMan/medicalCardMan',
  failRedirectUrl:
    `mini:${globalGl.addPersonUrl}?_healthType=failRedirect&regInfoCode=` +
    '${regInfoCode}',
  successRedirectUrl:
    `mini:/pagesA/medicalCardMan/medicalCardMan?_healthType=associate&healthCode=` +
    '${healthCode}',
  verifyFailRedirectUrl:
    'mini:/pagesA/medicalCardMan/medicalCardMan?_healthType=verifyFail',
  userFormPageUrl:
    `mini:${globalGl.addPersonUrl}?_healthType=addPat&authCode=` +
    '${authCode}',
  // userFormPageUrl:
  // `mini:${globalGl.addPersonUrl}?_healthType=addPat&authCode=` +
  // '${authCode}',
};
export const healthCardBind = async () => {
  const gStores = new GStores();
  const globalStore = gStores.globalStore;
  const { success, res } = await getHealthCardCode();
  if (success) {
    const {
      result: { wechatCode },
    } = res;
    const hospitalId = globalGl.systemInfo.isOpenHealthCard!.hospitalId;
    const requestArg = {
      hospitalId,
      wechatCode,
      herenId: gStores.globalStore.herenId,
      openId: gStores.globalStore.openId,
      source: gStores.globalStore.browser.source,
      ...healthCardQuery,
    };
    const {
      result: { bindCardUrl: h5Url },
    } = await api.registerHealthCardPreAuth(requestArg);
    useTBanner(
      {
        type: 'h5',
        path: h5Url,
      },
      'redirectTo'
    );
  }
};

export const healthCardLink = async (healthCode: string, cb?: Function) => {
  const gStores = new GStores();
  const globalStore = gStores.globalStore;
  if (globalGl.systemInfo.isOpenHealthCard && healthCode) {
    // #ifdef MP-WEIXIN
    const hospitalId = globalGl.systemInfo.isOpenHealthCard!.hospitalId;

    const requestArg = {
      healthCode,
      hospitalId,
      herenId: globalStore.herenId,
      source: globalStore.browser.source,
    };

    getH5OpenidParam(requestArg);
    await api.quickLinkHealthCardWithLoad(requestArg).catch(async (e) => {
      const { respCode, message } = e;
      if (respCode === 884801) {
        gStores.messageStore.closeMessage();
        const { confirm } = await apiAsync(uni.showModal, {
          content: '患者存在建档记录但手机号不匹配，是否立即修改？',
        });
        if (confirm) {
          await api.mofHosPhone({
            healthCode,
            source: gStores.globalStore.browser.source,
          });
        }
      }
    });
    gStores.messageStore.showMessage('关联成功', 1500, {
      closeCallBack() {
        //刷新就诊人列表
        new PatientUtils().getPatCardList();
        if (cb) {
          cb.call(this);
        } else {
          uni.reLaunch({
            url: '/pages/home/home',
          });
        }
      },
    });
    // #endif
  } else {
    console.error('addPatByHealthCode方法只支持腾讯健康卡通过healthCode建档');
    gStores.messageStore.showMessage('绑定失败', 1500, {});
  }
};

export const gotoChosseVerifyPage = async (
  requestData,
  authCode: string,
  type?: 'quickRegisterHealthCard' | 'registerHealthCardPreFill',
  errCB?: Function
) => {
  const gStores = new GStores();
  const globalStore = gStores.globalStore;
  const hospitalId = globalGl.systemInfo.isOpenHealthCard!.hospitalId;
  if (type !== 'quickRegisterHealthCard') {
    const {
      idCard: idNumber,
      patientPhone: phone1,
      patientName: name,
      nation,
    } = requestData;
    const list = await ServerStaticData.getNationTerms();
    const nationItem: any = list.find((o) => o.value === nation);
    const idCardInfo = getInfoFromIdCard(idNumber);
    const requestArg = {
      ...requestData,
      ...idCardInfo,
      ...healthCardQuery,
      herenId: gStores.globalStore.herenId,
      openId: gStores.globalStore.openId,
      source: gStores.globalStore.browser.source,
      nation: nationItem.label,
      authCode,
      phone1,
      name,
      idNumber,
      hospitalId,
    };
    const {
      result: { verifyUrl: h5Url },
    } = await api.registerHealthCardPreFill(requestArg);
    useTBanner(
      {
        type: 'h5',
        path: h5Url,
      },
      'redirectTo'
    );
  } else {
    const requestArg = {
      ...requestData,
      ...healthCardQuery,
      herenId: gStores.globalStore.herenId,
      openId: gStores.globalStore.openId,
      source: gStores.globalStore.browser.source,
      authCode,
      hospitalId,
    };
    const {
      result: { verifyUrl: h5Url },
    } = await api.quickRegisterHealthCard(requestArg).catch((err) => {
      errCB && errCB(err);
      return { result: { verifyUrl: '' } };
    });
    h5Url &&
      useTBanner(
        {
          type: 'h5',
          path: h5Url,
        },
        'redirectTo'
      );
  }
};

// export const reportVerifyJudge =async (cb) => {
//   const { success, res } = await getHealthCardCode();
//   if (success) {
//     const {
//       result: { wechatCode },
//     } = res;
//     const gStores = new GStores();
//     const args = {
//       patientId: gStores.userStore.patChoose.patientId,
//       wechatCode,
//       herenId: gStores.globalStore.herenId,
//       openId: gStores.globalStore.openId,
//       source: gStores.globalStore.browser.source,
//       sysCode: globalGl.SYS_CODE,
//       hospitalId: globalGl.systemInfo.isOpenHealthCard!.hospitalId,
//     };
//     const { result } = await api.registerUniformVerifyOrder(args);
//     const {
//       patAndOrderId,
//       verifyType,
//       verifyOrderId,
//       verifyData,
//       protectState,
//     } = result;
//     if (verifyType !== 0) {
//       cb.call(verifyData);
//     } else {
//       //去验证
//       const {
//         result: { userData, userIdKey },
//       } = await api.getOrderInfoByOrderId({ ...args, verifyType: '1' });
//       const { verifyResult } = await wxFacialVerifyByKey(userIdKey);
//       console.log('verifyResult', verifyResult);
//     }
//   } else {
//     throw new Error('获取健康卡授权失败');
//   }
// };

export const backWithFaceVerify = async (
  orderId: string,
  redirectUrl: string,
  verifyType: string,
) => {
  const gStores = new GStores();
  const globalStore = gStores.globalStore;
  const hospitalId = globalGl.systemInfo.isOpenHealthCard!.hospitalId;
  const requestOrderArg = {
    herenId: gStores.globalStore.herenId,
    openId: gStores.globalStore.openId,
    source: gStores.globalStore.browser.source,
    ...commonQuery,
    orderId,
    verifyType: parseInt(verifyType),
    hospitalId,
  };
  const {
    result: { userData, userIdKey },
  } = await api.getOrderInfoByOrderId(requestOrderArg);
  const { verifyResult } = await wxFacialVerifyByKey(userIdKey);
  const { success, res } = await getHealthCardCode();
  let wechatCode = '';
  if (success) wechatCode = res.result.wechatCode;
  else {
    gStores.messageStore.showMessage('授权失败', 3000);
    return;
  }
  const requestResultArg = {
    ...requestOrderArg,
    userData,
    result: verifyResult && '01',
    wechatCode,
  };
  const {
    result: { verifyBool, verifyOrderId },
  } = await api.registerRealPersonAuthOrder(requestResultArg);
  if (verifyBool) {
    useTBanner(
      {
        type: 'h5',
        path: decodeURIComponent(
          `${redirectUrl}&verify_order_id=${verifyOrderId}`
        ),
      },
      'redirectTo'
    );
  } else {
    useTBanner(
      {
        type: 'h5',
        path: decodeURIComponent(`${redirectUrl}&verify_order_id=-1`),
      },
      'redirectTo'
    );
  }
};

const wxFacialVerifyByKey = async (
  userIdKey: string
): Promise<{ verifyResult: string; errCode: string; errMsg: string }> => {
  const gStores = new GStores();
  return new Promise((rl, rj) => {
    uni.showLoading({});
    wx.checkIsSupportFacialRecognition({
      checkAliveType: 2,
      success() {
        wx.startFacialRecognitionVerify({
          checkAliveType: 2,
          userIdKey,
          success(e: { verifyResult: string; errCode: '0'; errMsg: string }) {
            //识别成功
            console.warn('人脸识别成功', e);
            uni.hideLoading();
            rl(e);
          },
          fail(err) {
            //识别失败
            uni.hideLoading();
            gStores.messageStore.showMessage('人脸识别失败', 3000);
            console.error('人脸识别失败', err);
            rj(err);
          },
        });
      },
      fail(err) {
        //识别失败
        uni.hideLoading();
        gStores.messageStore.showMessage('当前设备不支持人脸识别', 3000);
        console.error('当前设备不支持人脸识别', err);
        rj(err);
      },
    });
  });
};

const getInfoFromIdCard = (idCard) => {
  if (idCard.length !== 18) {
    throw new Error('Invalid ID card length');
  }
  const gender = parseInt(idCard.charAt(16), 10) % 2 === 1 ? '男' : '女';
  const birthday = idCard.substring(6, 14);
  const year = parseInt(birthday.substring(0, 4), 10);
  const month = parseInt(birthday.substring(4, 6), 10);
  const day = parseInt(birthday.substring(6, 8), 10);
  return {
    gender,
    birthday: `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`,
  };
};

// module.exports = { reportVerifyJudge}
