import { type TBannerConfig } from '@/utils';

/**
 * 容器为 develop 环境(开发版)下 替换 sysConfig
 */

export const sysConfigEnv = <const>{
  // 'person.isSmsVerify': '0',
  // 'person.isCanAddPatCardNo': '1',
  'order.isConfirmOrderWithPay': '1',
};

/**
 * 容器为 Trial 环境(体验版)下 替换 sysConfig
 */
export const sysConfigTrial = <const>{
  // 'person.isSmsVerify': '0',
  // 'person.isCanAddPatCardNo': '1',
  // 'order.isConfirmOrderWithPay': '1',
  'pay.medical': {
    isMedicalOrder: '1',
    isMedicalPay: '1',
  },
};

export const apiConfigEnv = <const>{
  // 'GlobalConfig.refreshQrCode': ['pagesA/medicalCardMan/electronicMedicalCard'],
};
