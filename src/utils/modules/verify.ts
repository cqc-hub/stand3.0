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
