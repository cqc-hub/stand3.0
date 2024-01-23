import { type TBannerConfig } from '@/utils';

/**
 * 容器为 develop 环境(开发版)下 替换 sysConfig
 */

export const sysConfigEnv = <const>{
  'person.isSmsVerify': '0',
  // 'person.isSkipPerfect': '1',
  // 'order.isOrderPreSettle': '1',
  // 'order.isOpenOutHosSch': '1',
  // 'order.isOpenOrderWaiting': '1',
  // 'order.inWx.handlerOutHosSchClick': <TBannerConfig>{
  //   type: 'otherProgram',
  //   appId: 'wxb173aba2842c1438',
  //   path: 'subPackage/pages/appointment/specialDoctorNums',
  //   addition: {
  //     hosDocId: 'doctorId',
  //     hosDeptId: 'deptId',
  //     docName: 'doctorName',
  //     deptName: 'deptName',
  //   },
  // },
  'medRecord.0.isCustomPatRecord': '1',
};

export const apiConfigEnv = <const>{};
