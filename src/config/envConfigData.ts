import { type TBannerConfig } from '@/utils';

/**
 * 容器为 develop 环境(开发版)下 替换 sysConfig
 */

export const sysConfigEnv = <const>{
  'person.isSmsVerify': '0',
  // 'person.isUserInfoShareAgree': '1',
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
  // 'order.AfterConfirmNoShowGoPayBtn': '1',
  // 'order.AfterConfirmNoShowQRcodeBtn': '1',
  // 'medRecord.0.isCustomPatRecord': '1',
  // 'medRecord.0.material': ['病案首页','入院记录','手术记录','病理报告','检查报告','出院记录'],
  // 'patProxy':0,
  // 'order.orderRegBtnLabel': '预约',
  // 'RestOfConfig.customBtn': [
  //   {
  //     label: '自定义按', // 标题
  //     subLabel: '副标题', // 副标题
  //     icon: 'ico_sy_yygh',
  //     config: {
  //       type: 'h5',
  //       isSelfH5: '1',
  //       path: 'pagesC/queryCase/queryCase',
  //       text: '意见反馈',
  //       extraData: {
  //         pageType: 2,
  //       },
  //       addition: {
  //         herenId: 'herenId',
  //         pageType: '2',
  //       },
  //       isLocal: '1',
  //     },
  //   },
  // ],
  // 'Electronic_Consultation_Sheet.medicalAsistantConfig':
  // JSON.parse(`{"timeLineBtn":[],"contentBtn":[{"type":"self","path":"pagesB/reportQuery/reportQuery","text":"查看报告","addition":{"orderClassTabIndex":"tabIndex"}},{"type":"mini","path":"pages/index?id=QFadbKUMCl","text":"院内导航","appId":"wx0fb39a1dc27c5e6d"},{"type":"h5","isSelfH5":"1","path":"pagesC/medicationQuery/medicationQuery","text":"用药查询","addition":{"herenId":"herenId","patientId":"_patientId"}},{"type":"h5","isSelfH5":"1","path":"pagesC/choosePat/choosePat","text":"检查预约","addition":{"herenId":"herenId","patientId":"_patientId"},"extraData":{"_type":"LQJcyy","nextDo":"true"}},{"type":"h5","isSelfH5":"1","path":"pagesC/choosePat/choosePat","text":"检查预约","addition":{"herenId":"herenId","patientId":"_patientId"},"extraData":{"_type":"LQJcyy","nextDo":"true"}}],"bottomBtn":[{"type":"self","path":"pagesA/clinicPay/clinicPayDetail","text":"缴费账单","icon":"ico_pay"},{"type":"self","path":"pagesB/reportQuery/reportQuery","text":"报告查询","icon":"ico_document"},{"type":"self","path":"pagesA/hospitalCare/hospitalCare","text":"住院信息"},{"type":"self","path":"pagesA/medicalCardMan/electronicMedicalCard","text":"就诊码"}]}`)
  //  'order.isTakeNumerWithPay':'1'
  //  'order.isCancelOlineReg':'1'
};

export const apiConfigEnv = <const>{
  // 'GlobalConfig.refreshQrCode': ['pagesA/medicalCardMan/electronicMedicalCard'],
};
