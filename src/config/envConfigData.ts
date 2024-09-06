import { type TBannerConfig } from '@/utils';

/**
 * 容器为 develop 环境(开发版)下 替换 sysConfig
 */

export const sysConfigEnv = <const>{
  'person.isSmsVerify': '1',
  'person.isUserInfoShareAgree': '1',
  // 'person.isVerifyIdCardLastFourNumber': '1',
  // 'reportQuery.isOpenFilterReportByTime': '1',
  // 'reportQuery.isOpenCollect': '1',
  // 'person.realNameAuth': ['ocrVerify', 'faceVerify'],
  // 'person.isSkipPerfect': '1',
  // 'order.isOrderPreSettle': '1',
  // 'order.wxOrderSubscribeMessage': [
  //   '1SqO2V7A19EdxKrIzZQ4wQqwR5zpjwYyKMsT-OLvwM0',
  // ],
  // 'person.isDropAddress': '1',
  // 'order.isShowFilterOrderSourceBtn': '1',
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
  // 'medRecord.0.isCustomPatRecord': '1',
  // 'medRecord.0.material': ['病案首页','入院记录','手术记录','病理报告','检查报告','出院记录'],
  // 'patProxy':0,
  // 'order.orderRegBtnLabel': '预约',
};

export const apiConfigEnv = <const>{
  // 'GlobalConfig.refreshQrCode': ['pagesA/medicalCardMan/electronicMedicalCard'],
};
