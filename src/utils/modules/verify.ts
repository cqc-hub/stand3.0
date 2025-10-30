import { idValidator } from './idCard';

export const rulePhone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
/**
 * 校验手机号
 * @param tel
 * @returns
 */
export const verifyPhone = (tel: string) => {
  if (tel) {
    return rulePhone.test(tel);
  }

  return false;
};

/**
 * 校验身份证
 * @param idCardNo
 * @returns
 */
export const verifyIdCard = (idCardNo: string) => {
  if (idValidator) {
    return idValidator.checkIdCardNo(idCardNo);
  }
  return false;
};

/**
 * 校验表情
 * @param str
 * @returns
 */
export const verifyEmoji = (str: string) => {
  if (str) {
    return /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/.test(
      str
    );
  }

  return false;
};


// 整数金额校验规则：正整数，不包含小数点和逗号
export const ruleIntegerAmount = /^[1-9]\d*$/;

/**
 * 校验整数金额
 * @param amount 金额字符串
 * @returns 是否为有效的整数金额
 */
export const verifyIntegerAmount = (amount: string) => {
  if (amount) {
    return ruleIntegerAmount.test(amount);
  }
  return false;
};

// 金额校验规则：支持整数或最多两位小数
// 严格模式，不允许以0开头多位数字（如012）
export const ruleAmountStrict = /^(?:0|(?!0)\d+)(?:\.\d{1,2})?$/;

/**
 * 校验金额（严格模式）
 * @param amount 金额字符串
 * @returns 是否为有效的金额
 */
export const verifyAmountStrict = (amount: string) => {
  if (amount) {
    return ruleAmountStrict.test(amount);
  }
  return false;
};


// 金额校验规则：支持整数或最多两位小数
export const ruleAmount = /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/;

/**
 * 校验金额（支持到小数点两位）
 * @param amount 金额字符串
 * @returns 是否为有效的金额
 */
export const verifyAmount = (amount: string) => {
  if (amount) {
    return  /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(amount);
  }
  return false;
};