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
