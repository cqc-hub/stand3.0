import type { TInstance } from '@/components/g-form/index';
import { cloneUtil } from '@/common';
import {
  idValidator,
  ServerStaticData,
  GStores,
  AliPayLoginHandler,
} from '@/utils';
import { decryptDes } from '@/common/des';

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

          if (v.length > 20) {
            return Promise.resolve({
              success: false,
              message: '真实姓名不能大于 20 个字符',
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

      data[formKey.patientName] = userName;
      data[formKey.patientPhone] = mobile;
      data[formKey.idCard] = certNo;
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

export const loginAuthAlipay = async () => {
  const gStores = new GStores();

  const { authPhoneVerify } = gStores.userStore;
  if (!authPhoneVerify) {
    // #ifdef MP-ALIPAY
    await new AliPayLoginHandler().handlerAuth().catch((e) => {
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
    // #endif
  }
};
