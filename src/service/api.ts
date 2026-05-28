import envData from '@/config/env';
import service from './index';
import globalGl from '@/config/global';
import global from '@/config/global';
import { useGlobalStore, IPat } from '@/stores';

// 参数的额外配置
export const parm = (
  data: any,
  payload: {
    outArg?: boolean;
  } = {}
) => {
  const { outArg } = payload;
  const globalStore = useGlobalStore();
  const sysCode = globalStore.sysCode;

  const body = {
    sysCode,
    ...data,
  };

  if (!body.herenId) {
    body.herenId = globalStore.herenId;
  }
  if (!body.psnId) {
    body.psnId = globalStore.herenId;
  }

  if (outArg) {
    return body;
  }

  return {
    args: body,
    token: globalStore.token.accessToken,
    funcode: data.funcode,
  };
};
//入参新增sysCode 仅限透传接口
let parmsysCode = (data: any, payload: any = {}) => {
  const { outArg } = payload;
  const globalStore = useGlobalStore();
  const sysCode = globalStore.sysCode;
  const body = {
    sysCode,
    herenId: globalStore.herenId,
    ...data,
  };

  if (outArg) {
    return body;
  }

  return {
    args: body,
    sysCode,
    token: globalStore.token.accessToken,
    funcode: data.funcode,
  };
};

/**
 * @method 接口
 */
// 基础服务
const baseApi = {
  // 系统长信息协议详情
  getSysAppMore: (data) =>
    service.post<any>('/phs-base/sysCode/getSysAppMore', parm(data), {
      showMessage: false,
      hideLoading: true,
    }),
  getSysAppMores: (data) =>
    service.post<any>('/phs-base/sysCode/getSysAppMores', parm(data), {
      showMessage: false,
      hideLoading: true,
    }),

  complainsAndSuggestions: (data) =>
    service.post('/phs-base/complains/complainsAndSuggestions', parm(data)),

  getComplainsList: (data) =>
    service.post('/phs-base/complains/getComplainsList', parm(data)),

  // 资讯详情
  getCmsInfo: (data) =>
    service.post('/phs-base/cms/getCmsInfo', parm(data), {
      hideLoading: false,
    }),

  sendNetHos: (data) =>
    service.post('/phs-base/transparent/sendNetHos', parmsysCode(data), {
      hideLoading: false,
      showMessage: false,
    }),

  // 蚂蚁能量
  energySendReg: (data) =>
    service.post('/phs-user/ali/energySend/reg', parmsysCode(data), {
      hideLoading: false,
    }),

  //行政区划列表
  getAllDivision: (data) =>
    service.post('/phs-base/division/getAllDivision', parm(data), {
      hideLoading: false,
    }),

  //行政区划列表
  getDivisionByLevel: (data) =>
    service.post('/phs-base/division/getDivisionByLevel', parm(data), {
      hideLoading: false,
    }),

  //获取客服子标题列表
  getSubTypeList: (data) =>
    service.post('/phs-base/customerService/getSubTypeList', parm(data), {
      hideLoading: false,
    }),

  //获取客服资讯列表
  getCmsListBySubType: (data) =>
    service.post('/phs-base/customerService/getCmsListBySubType', parm(data), {
      hideLoading: false,
    }),

  //根据系统码与值域码查询术语域
  getTermsBySysAndCode: (data) =>
    service.post('/phs-base/sysCode/getTermsBySysAndCode', parm(data), {
      hideLoading: false,
    }),

  //sysCode查询多个系统配置参数
  getParamsMoreBySysCode: (data) =>
    service.post('/phs-base/sysCode/getParamsMoreBySysCode', parm(data), {
      hideLoading: false,
    }),

  //查询医院样式
  queryHospitalPattern: (data) =>
    service.post('/phs-base/firstPage/queryHospitalPattern', parm(data), {
      showMessage: false,
    }),

  //添加快递地址
  addExpressAddress: (data) =>
    service.post('/phs-base/expressAddress/addExpressAddress', parm(data)),

  //删除快递地址
  delExpressAddress: (data) =>
    service.post('/phs-base/expressAddress/delExpressAddress', parm(data)),

  //查询快递地址
  queryExpressAddress: (data) =>
    service.post('/phs-base/expressAddress/queryExpressAddress', parm(data), {
      hideLoading: false,
    }),

  //修改快递地址
  updateExpressAddress: (data) =>
    service.post('/phs-base/expressAddress/updateExpressAddress', parm(data)),

  //获取就诊人地址
  queryExpressAddressByPatient: (data) =>
    service.post(
      '/phs-base/expressAddress/queryExpressAddressByPatient',
      parm(data)
    ),

  //获取拆分后的地址
  getAddress: (data) =>
    service.post('/phs-base/division/getAddress', parm(data), {
      hideLoading: false,
    }),

  //获取公告资讯
  getAnnouncementCms: (data) =>
    service.post('/phs-base/firstPage/getAnnouncementCms', parm(data), {
      hideLoading: true,
    }),

  //查询对应版本号
  searchFunctionConfig: (data) =>
    service.post('/phs-base/hospital/searchFunctionConfig', parm(data), {
      hideLoading: true,
      showMessage: false,
    }),
};
// 查询服务
const queryApi = {
  // 获取填写过问卷
  getRiskCode: (data) =>
    service.post('/phs-query/escort/getRiskCode', parm(data)),

  loginHw: (data) => service.post('/phs-query/hw/loginHw', parm(data)),
  submitAdmissionApplication: (data) =>
    service.post(
      '/phs-query/preHospital/submitAdmissionApplication',
      parm(data)
    ),
  getIdCardAddress: (data) =>
    service.post('/phs-query/preHospital/getIdCardAddress', parm(data)),

  getProcessState: (data) =>
    service.post<any[]>('/phs-query/medical/getProcessState', parm(data)),

  familyPayment: (data) =>
    service.post<any[]>('/phs-query/medical/familyPayment', parm(data)),

  // 医保授权(微信国标)
  authorize: <T>(data) =>
    service.post<T>('/phs-base/medical/authorize', parm(data), {
      hideLoading: false,
    }),

  getSecurityCode: (data) =>
    service.post(
      '/phs-base/kaptcha/getSecurityCode',
      parm(data, {
        // outArg: true,
      }),
      {
        hideLoading: false,
      }
    ),

  // 医保授权
  medicalCostInfoUpload: <T>(data, hideLoading = false) =>
    service.post<T>('/phs-query/medical/medicalCostInfoUpload', parm(data), {
      hideLoading,
    }),
  // 医保授权
  medicalCostInfoUploadSz: <T>(data, hideLoading = false) =>
    service.post<T>('/phs-query/medical/medicalCostInfoUploadSz', parm(data), {
      hideLoading,
    }),

  getTodayVisit: <T = any>(data, hideLoading = false) =>
    service.post<T>('/phs-query/medical/getTodayVisit', parm(data), {
      hideLoading,
    }),

  getHistoryRecord: <T = any>(data, hideLoading = false) =>
    service.post<T>('/phs-message/message/getHistoryRecord', parm(data), {
      hideLoading,
    }),

  getIntelligenceVisit: <T = any>(data, hideLoading = false) =>
    service.post<T>('/phs-query/medical/getIntelligenceVisit', parm(data), {
      hideLoading,
    }),

  // 待缴费
  getUnpaidClinicList: <T>(data) =>
    service.post<T>('/phs-query/clinical/getUnpaidClinicList', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '门诊缴费',
    }),

  clinicPartRefund: <T>(data) =>
    service.post<T>('/phs-query/clinical/clinicPartRefund', parm(data), {
      hideLoading: false,
    }),

  sendMedicalMessage: <T>(data) =>
    service.post<T>('/phs-query/clinical/sendMedicalMessage', parm(data), {
      hideLoading: true,
    }),

  qrCodeQuery: <T>(data) =>
    service.post<T>('/phs-query/clinical/qrCodeQuery', parm(data), {
      hideLoading: false,
    }),

  getClinicPayRecord: <T = any>(data) =>
    service.post<T>(
      '/phs-query/hospitalAccount/getClinicPayRecord',
      parm(data),
      {
        hideLoading: false,
      }
    ),

  getRefundApplyByCardNumber: <T = any>(data) =>
    service.post<T>(
      '/phs-query/hospitalAccount/getRefundApplyByCardNumber',
      parm(data),
      {
        hideLoading: false,
      }
    ),

  // 已缴费
  getPrepaidClinicList: <T>(data) =>
    service.post<T>('/phs-query/clinical/getPrepaidClinicList', parm(data), {
      hideLoading: false,
      // reportCmPV_YLName: '门诊缴费',
    }),

  getPatientVisits: <T>(data) =>
    service.post<T>('/phs-query/clinical/getPatientVisits', parm(data), {
      hideLoading: false,
      // reportCmPV_YLName: '门诊缴费',
    }),

  // 预决算
  getClinicReservePay: <T>(data) =>
    service.post<T>('/phs-query/clinical/getClinicReservePay', parm(data), {
      hideLoading: false,
      // reportCmPV_YLName: '门诊缴费',
    }),

  // 预决算-扫码
  getScanClinicReservePay: <T>(data) =>
    service.post<T>('/phs-query/clinical/getScanClinicReservePay', parm(data), {
      hideLoading: false,
      // reportCmPV_YLName: '门诊缴费',
    }),

  //门诊创建订单
  createClinicOrder: <T = any>(
    data,
    opt = {
      hideLoading: false,
    }
  ) =>
    service.post<T>('/phs-query/clinical/createClinicOrder', parm(data), opt),

  clinicSpecialPayInform: <T = any>(data) =>
    service.post<T>('/phs-query/clinical/clinicSpecialPayInform', parm(data), {
      hideLoading: false,
    }),

  getScanPrepaidClinicList: <T = any>(data) =>
    service.post<T>(
      '/phs-query/clinical/getScanPrepaidClinicList',
      parm(data),
      {
        hideLoading: false,
      }
    ),

  getScanUnpaidClinicList: <T = any>(data) =>
    service.post<T>('/phs-query/clinical/getScanUnpaidClinicList', parm(data), {
      hideLoading: false,
    }),

  // 缴费详情
  getClinicalPayDetailList: <T = any>(data) =>
    service.post<T>(
      '/phs-query/clinical/getClinicalPayDetailList',
      parm(data),
      {
        hideLoading: false,
      }
    ),
  // 扫码直接进的缴费详情
  getScanClinicalPayDetailList: <T = any>(data) =>
    service.post<T>(
      '/phs-query/clinical/getScanClinicalPayDetailList',
      parm(data),
      {
        hideLoading: false,
      }
    ),

  getDrugDelivery: (data) =>
    service.post('/phs-query/delivery/getDrugDelivery', parm(data), {
      hideLoading: false,
    }),

  drugDeliveryCost: (data) =>
    service.post('/phs-query/delivery/drugDeliveryCost', parm(data), {
      hideLoading: false,
    }),
  freeOrder: (data) =>
    service.post('/phs-query/delivery/freeOrder', parm(data), {
      hideLoading: false,
    }),
  getScanExpressDrugCost: (data) =>
    service.post('/phs-query/delivery/getScanExpressDrugCost', parm(data), {
      hideLoading: false,
    }),

  getScanDrugDelivery: (data) =>
    service.post('/phs-query/delivery/getScanDrugDelivery', parm(data), {
      hideLoading: false,
    }),

  getScanDrugDeliveryDetail: (data) =>
    service.post('/phs-query/delivery/getScanDrugDeliveryDetail', parm(data), {
      hideLoading: false,
    }),

  addDrugDelivery: (data) =>
    service.post('/phs-query/delivery/addDrugDelivery', parm(data), {
      hideLoading: false,
    }),
  expressPay: (data) =>
    service.post('/phs-query/delivery/expressPay', parm(data), {
      hideLoading: false,
    }),

  getDrugDeliveryDetail: (data) =>
    service.post('/phs-query/delivery/getDrugDeliveryDetail', parm(data), {
      hideLoading: false,
    }),

  // 发送产科问卷
  sendQuestionnaireInfo: (data) =>
    service.post('/phs-query/hospital/sendObstetricsQuestionnaire', parm(data)),

  inHosChosePlace: (data) =>
    service.post('/phs-query/hospital/inHosChosePlace', parm(data)),

  // 门诊住院列表
  getOutpatientHospitalList: <T = any>(data, config: any = {}) =>
    service.post<T>(
      '/phs-query/operation/getOutpatientHospitalList',
      parm(data),
      {
        showMessage: false,
        hideLoading: false,
        ...config,
      }
    ),
  // 便民服务列表接口
  getConvenientServiceList: (data) =>
    service.post('/phs-query/billing/getConvenientServiceList', parm(data), {
      hideLoading: false,
    }),
  // 获取病案复印申请记录
  getCaseCopyList: <T>(data) =>
    service.post<T>('/phs-query/caseCopy/getCaseCopyList', parm(data), {
      reportCmPV_YLName: '病案复印',
    }),

  // 获取病案复印申请记录详情
  getCaseCopyDetail: <T>(data) =>
    service.post<T>('/phs-query/caseCopy/getCaseCopyDetail', parm(data)),

  // 病案复印保存申请记录
  copyOfCasePay: <T>(data) =>
    service.post<T>('/phs-query/caseCopy/copyOfCasePay', parm(data)),

  // 病案复印 tuifei
  copyRefund: <T>(data) =>
    service.post<T>('/phs-query/caseCopy/copyRefund', parm(data)),

  copyOfCasePaySupplement: <T = any>(data) =>
    service.post<T>('/phs-query/caseCopy/copyOfCasePaySupplement', parm(data)),

  // 获取住院信息
  getInHospitalInfo: <T = any>(data) =>
    service.post<T>('/phs-query/hospital/getInHospitalInfo', parm(data)),

  getInHospitalList: <T = any>(data) =>
    service.post<T>('/phs-query/hospital/getInHospitalList', parm(data)),

  queryHosCardInfo: <T>(data) =>
    service.post<T>('/phs-query/hospital/queryHosCardInfo', parm(data)),

  addHosCardInfo: <T>(data) =>
    service.post<T>('/phs-query/hospital/addHosCardInfo', parm(data)),

  queryInpVisit: <T = any>(data) =>
    service.post<T>('/phs-query/hospital/queryInpVisit', parm(data)),

  queryInpVisitWithNoMes: <T = any>(data) =>
    service.post<T>('/phs-query/hospital/queryInpVisit', parm(data), {
      showMessage: false,
    }),

  saveInpVisit: <T = any>(data) =>
    service.post<T>('/phs-query/hospital/saveInpVisit', parm(data)),

  //获取住院费用日清单列表
  getInHospitalDailyCostList: <T>(data) =>
    service.post<T>(
      '/phs-query/hospital/getInHospitalDailyCostList',
      parm(data),
      {
        reportCmPV_YLName: '住院日清单查询',
      }
    ),
  //出院患者确认结算
  outHospitalAffirmPay: <T>(data) =>
    service.post<T>('/phs-query/hospital/outHospitalAffirmPay', parm(data)),

  //出院预结算
  getOutHospitalPreparePay: <T>(data) =>
    service.post<T>('/phs-query/hospital/getOutHospitalPreparePay', parm(data)),
  //创建住院缴费订单
  createInHospitalPayOrder: <T = any>(data) =>
    service.post<T>(
      '/phs-query/hospital/createInHospitalPayOrder',
      parm(data),
      {
        reportCmPV_YLName: '住院缴费',
      }
    ),
  //获取住院缴费记录
  getInHospitalPayInfo: <T>(data) =>
    service.post<T>('/phs-query/hospital/getInHospitalPayInfo', parm(data), {
      reportCmPV_YLName: '缴费记录查询',
    }),
  //获取住院费用清单详情
  getInHospitalCostInfo: <T>(data) =>
    service.post<T>('/phs-query/hospital/getInHospitalCostInfo', parm(data)),
  //扫码获取住院信息
  getScanInHospitalInfo: <T>(data) =>
    service.post<T>('/phs-query/hospital/getScanInHospitalInfo', parm(data)),
  //查询患者院内账户
  getHospitalAccountDetail: <T>(data) =>
    service.post<T>(
      '/phs-query/hospitalAccount/getHospitalAccountDetail',
      parm(data)
    ),
  //账号提现
  accountWithdrawal: <T>(data) =>
    service.post<T>('/phs-query/hospitalAccount/accountWithdrawal', parm(data)),
  //自助开单-获取开单项目列表
  getItemList: <T>(data) =>
    service.post('/phs-query/billing/getItemList', parm(data)),
  //自助开单-创建开单订单
  createBillingOrder: <T = any>(data) =>
    service.post('/phs-query/billing/createBillingOrder', parm(data), {
      reportCmPV_YLName: '核酸检测预约',
      hideLoading: false,
    }),
  // 获取检验、检查、体检列表
  getReportsReportList: <T = any>(data) =>
    service.post<T>('/phs-query/examine/getReportsReportList', parm(data), {
      reportCmPV_YLName: '检查检验报告查询',
      monitorName: '报告查询',
    }),
  getExamineReportDetails: <T = any>(data) =>
    service.post('/phs-query/examine/getExamineReportDetails', parm(data)),
  getExamineReportDetailsNoLogin: <T = any>(data) =>
    service.post(
      '/phs-query/examine/getExamineReportDetailsNoLogin',
      parm(data)
    ),
  queryImgStatus: <T = any>(data) =>
    service.post('/phs-query/img/queryImgStatus', parm(data)),
  imgHosSettle: <T = any>(data) =>
    service.post('/phs-query/img/imgHosSettle', parm(data)),
  getCheckoutReportDetails: <T = any>(data) =>
    service.post('/phs-query/checkout/getCheckoutReportDetails', parm(data)),
  getMedicalReportDetails: <T = any>(data) =>
    service.post('/phs-query/examine/getMedicalReportDetails', parm(data)),
  getCheckoutReportInfo: <T = any>(data) =>
    service.post('/phs-query/checkout/getCheckoutReportInfo', parm(data)),
  getCloudReportUrl: <T = any>(data) =>
    service.post('/phs-query/examine/getCloudReportUrl', parm(data)),
  //获取云影像
  getCloudImageInfo: <T = any>(data) =>
    service.post('/phs-query/appointment/getCloudImageInfo', parm(data)),
  getScheme: <T = any>(data) =>
    service.post('/phs-user/message/getScheme', parm(data), {}),
  applyForAuth: <T = any>(data) =>
    service.post('/phs-user/trdfce/applyForAuth', parm(data), {}),
  getCmsList: <T = any>(data) =>
    service.post('/phs-base/cms/getCmsList', parm(data), {}),
  getCmsTypeList: <T = any>(data) =>
    service.post('/phs-base/cms/getCmsTypeList', parm(data), {}),
  getCmsListByWordSearch: <T = any>(data) =>
    service.post('/phs-base/cms/getCmsListByWordSearch', parm(data)),
  //电子导诊单
  getHosGuideSheet: (data) =>
    service.post<any[]>('/phs-query/medical/getHosGuideSheet', parm(data)),
  //草药代煎
  getChineseMedicineList: (data) =>
    service.post<any>('/phs-query/medicine/getChineseMedicineList', parm(data)),
  getChineseMedicineListNl: (data) =>
    service.post<any>(
      '/phs-query/medicine/getChineseMedicineListNl',
      parm(data)
    ),
  // 草药代煎创建订单
  chineseMedicinePay: (data) =>
    service.post<any>('/phs-query/medicine/chineseMedicinePay', parm(data)),
  chineseMedicinePayNl: (data) =>
    service.post<any>('/phs-query/medicine/chineseMedicinePayNl', parm(data)),
  // 江苏省中获取云影像
  getJSYunURL: (data) =>
    service.post<any>('/phs-query/examine/getJSYunURL', parm(data)),
  // 病历查询 列表
  getOutpatientList: (data) =>
    service.post<any>('/phs-query/operation/getOutpatientList', parm(data)),
  intAssistantQuery: (data) =>
    service.post<any>('/phs-query/intAssistant/query', parm(data)),
  intAssistantSave: (data) =>
    service.post<any>('/phs-query/intAssistant/save', parm(data)),
  addExamOrder: (data) =>
    service.post<any>('/phs-query/exam/addExamOrder', parm(data)),
  examPayInform: (data) =>
    service.post<any>('/phs-query/exam/examPayInform', parm(data)),
  getExamPayResult: (data) =>
    service.post<any>('/phs-query/exam/getExamPayResult', parm(data)),
};

// 挂号服务
const regApi = {
  // 预问诊留言提交
  subPreinquiryMessage: (data: any) =>
    service.post('/phs-reg/regDoc/subPreinquiryMessage', parm(data)),

  findByDocSchId: (data: any) =>
    service.post('/phs-reg/regDoc/findByDocSchId', parm(data)),

  getVisited: (data: any) =>
    service.post('/phs-reg/collect/getVisited', parm(data)),

  loginByThRegisterId: (data: any) =>
    service.post('/phs-reg/tencent/loginByThRegisterId', parm(data)),

  getAlternateSch: <T = any>(data: any) =>
    service.post<T>('/phs-reg/regAlt/getAlternateSch', parm(data)),

  getGuidanceUrl: <T = any>(data: any) =>
    service.post<T>('/phs-query/regIntelligence/getGuidanceUrl', parm(data)),

  addContribOrder: <T = any>(data: any) =>
    service.post<T>('/phs-query/contribution/addContribOrder', parm(data)),

  contribPayInform: <T = any>(data: any) =>
    service.post<T>('/contribution/contribution/contribPayInform', parm(data)),

  getConsultationUrl: <T = any>(data: any) =>
    service.post<T>(
      '/phs-query/regIntelligence/getConsultationUrl',
      parm(data)
    ),

  addDiseaseInformation: <T = any>(data: any) =>
    service.post<T>('/phs-reg/reg/addDiseaseInformation', parm(data)),

  cancelAlternate: <T = any>(data: any) =>
    service.post<T>('/phs-reg/regAlt/cancelAlternate', parm(data)),

  getAlternateList: <T = any>(data: any) =>
    service.post<T>('/phs-reg/regAlt/getAlternateList', parm(data)),

  addRegAlternate: <T = any>(data: any) =>
    service.post<T>('/phs-reg/regAlt/addRegAlternate', parm(data), {
      hideLoading: false,
      showMessage: false,
    }),

  canRegAlternate: <T = any>(data: any) =>
    service.post<T>('/phs-reg/regAlt/canRegAlternate', parm(data)),

  netAddHosSch: <T = any>(data: any) =>
    service.post<T>('/phs-reg/regAlt/netAddHosSch', parm(data)),

  getQnRecordTemp: (data: any) =>
    service.post('/phs-reg/regDoc/getQnRecordTemp', parm(data)),

  getPopularDoctors: (data: any) =>
    service.post('/phs-reg/regDoc/getPopularDoctors', parm(data)),

  addCollect: (data: any) =>
    service.post('/phs-reg/collect/addCollect', parm(data), {
      hideLoading: false,
    }),

  getCheckIn: (data: any) =>
    service.post('/phs-reg/reg/getCheckIn', parm(data), {
      hideLoading: false,
      showMessage: false,
    }),
  freeRegPay: (data: any) =>
    service.post('/phs-reg/reg/freeRegPay', parm(data), {
      hideLoading: false,
    }),
  GetBiosampleConsentRecord: (data: any) =>
    service.post('/phs-reg/reg/GetBiosampleConsentRecord', parm(data), {
      hideLoading: false,
    }),
  reappoint: <T = any>(data: any) =>
    service.post<T>('/phs-reg/reg/reappoint', parm(data)),

  getDeptDetail: <T = any>(data: any) =>
    service.post<T>('/phs-reg/reg/getDeptDetail', parm(data), {
      showMessage: false,
    }),

  regPreSettlement: (data: any) =>
    service.post('/phs-reg/reg/regPreSettlement', parm(data), {
      hideLoading: false,
    }),

  refundMedicalException: (data: any) =>
    service.post('/phs-reg/reg/refundMedicalException', parm(data), {
      hideLoading: false,
    }),

  getCheckInList: (data: any) =>
    service.post('/phs-reg/reg/getCheckInList', parm(data), {
      hideLoading: false,
    }),
  getCheckInListNew: (data: any) =>
    service.post('/phs-reg/reg/getCheckInListNew', parm(data), {
      hideLoading: false,
    }),
  getCheckInFeeHK: (data: any) =>
    service.post('/phs-reg/reg/getCheckInFeeHK', parm(data), {
      hideLoading: false,
    }),

  getExtHosDocSch: (data: any) =>
    service.post('/phs-reg/reg/getExtHosDocSch', parm(data), {
      hideLoading: false,
    }),

  bloodTestSignIn: (data: any) =>
    service.post('/phs-reg/regIntelligence/bloodTestSignIn', parm(data), {
      hideLoading: false,
    }),

  signInPositionAnalysis: (data: any) =>
    service.post(
      '/phs-reg/regIntelligence/signInPositionAnalysis',
      parm(data),
      {
        hideLoading: false,
      }
    ),

  confirmRegisterSettle: (data: any) =>
    service.post('/phs-reg/medical/confirmRegisterSettle', parm(data), {
      hideLoading: false,
    }),

  medicalUp: (data: any) =>
    service.post('/phs-reg/medical/medicalUp', parm(data), {
      hideLoading: false,
    }),

  addRegSatisfaction: <T = any>(data: any) =>
    service.post<T>('/phs-reg/regSatisfaction/addRegSatisfaction', parm(data), {
      hideLoading: false,
    }),

  findSatisfactionInfo: (data: any) =>
    service.post('/phs-reg/regSatisfaction/findSatisfactionInfo', parm(data), {
      hideLoading: false,
    }),

  getAllSatisfactions: (data: any) =>
    service.post('/phs-reg/regSatisfaction/getAllSatisfactions', parm(data), {
      hideLoading: false,
    }),

  orderPayValid: (data: any) =>
    service.post('/phs-reg/regNotify/orderPayValid', parm(data), {
      hideLoading: false,
    }),

  delMyCollect: (data: any) =>
    service.post('/phs-reg/collect/delMyCollect', parm(data), {
      hideLoading: false,
    }),

  queryCollect: (data: any) =>
    service.post('/phs-reg/collect/queryCollect', parm(data), {
      hideLoading: false,
    }),

  queryDeptInfo: (data: any) =>
    service.post('/phs-reg/regIntelligence/queryDeptInfo', parm(data), {
      hideLoading: true,
    }),

  // 挂号
  addReg: (data: any) =>
    service.post('/phs-reg/reg/addReg', parm(data), {
      hideLoading: false,
      showMessage: false,
      monitorName: '预约挂号',
      reportCmPV_YLName: '挂号缴费',
    }),

  addOrder: (data: any) =>
    service.post('/phs-reg/regOrder/addOrder', parm(data), {
      hideLoading: false,
      showMessage: false,
      monitorName: '预约挂号',
      reportCmPV_YLName: '挂号缴费',
    }),

  refundOrder: (data: any) =>
    service.post('/phs-reg/reg/refundOrder', parm(data), {
      hideLoading: false,
    }),

  refundHosReg: (data: any) =>
    service.post('/phs-reg/reg/refundHosReg', parm(data), {
      hideLoading: false,
    }),

  // 排班
  getDocSch: (data: any) =>
    service.post('/phs-reg/reg/getDocSch', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '预约挂号',
    }),

  cancelReg: (data: any) =>
    service.post('/phs-reg/reg/cancelReg', parm(data), {
      hideLoading: false,
    }),

  cancelHosReg: (data: any) =>
    service.post('/phs-reg/reg/cancelHosReg', parm(data), {
      hideLoading: false,
    }),

  findByDocId: (data: any) =>
    service.post('/phs-reg/regDoc/findByDocId', parm(data), {
      hideLoading: false,
    }),

  searchDocAndDeptByWords: (data: any) =>
    service.post('/phs-reg/regDoc/searchDocAndDeptByWords', parm(data), {
      hideLoading: false,
    }),

  // 挂号详情
  getRegOrderInfo: <T>(data: any) =>
    service.post<T>('/phs-reg/reg/getRegOrderInfo', parm(data), {
      hideLoading: false,
      monitorName: '挂号缴费',
    }),

  getRegOrderList: <T = any[]>(data: any) =>
    service.post<T>('/phs-reg/reg/getRegOrderList', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '挂号记录查询',
    }),

  getDeptLaterList: <T = any[]>(data: any) =>
    service.post<T>('/phs-reg/reg/getDeptLaterList', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '挂号记录查询',
    }),

  hosRegOrderList: <T>(data: any) =>
    service.post<T>('/phs-reg/reg/hosRegOrderList', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '挂号记录查询',
    }),

  getDeptList: (data: any) =>
    service.post('/phs-reg/reg/getDeptList', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '科室列表',
    }),

  getDeptTree: (data: any) =>
    service.post('/phs-reg/reg/getDeptTree', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '科室列表',
    }),

  // 科室排班-按医生挂号
  getDeptSchForDoc: <T>(data: any) =>
    service.post<T>('/phs-reg/reg/getDeptSchForDoc', parm(data), {
      hideLoading: false,
      // baseURL: 'https://api.51phs.com',
    }),

  dtSchByDoc: <T>(data: any) =>
    service.post<T>('/phs-reg/reg/dtSchByDoc', parm(data), {
      hideLoading: false,
    }),

  // 科室排班-按日期挂号
  getDeptSchByDate: <T>(data: any) =>
    service.post<T>('/phs-reg/reg/getDeptSchByDate', parm(data), {
      hideLoading: false,
    }),

  dtSchByDate: <T>(data: any) =>
    service.post<T>('/phs-reg/reg/dtSchByDate', parm(data), {
      hideLoading: false,
    }),

  // 科室排班-分时段号源
  getNumberSource: <T>(data: any) =>
    service.post<T>('/phs-reg/reg/getNumberSource', parm(data), {
      hideLoading: false,
    }),
  // 支付宝-获取智能导诊链接
  getTXGuidanceUrl: <T>(data: any) =>
    service.post<T>('/phs-reg/guidance/getTXGuidanceUrl', parm(data), {
      hideLoading: false,
    }),
  smartGuideDft: (data: any) =>
    service.post('/phs-reg/regIntelligence/smartGuideDft', parm(data)),

  //按名医类别查询科室
  getDeptByFamousDoctorType: (data: any) =>
    service.post('/phs-reg/deptDoc/getDeptByFamousDoctorType', parm(data)),

  // 按科室和机构查询名医
  getDoctorByDeptAndHos: (data: any) =>
    service.post('/phs-reg/deptDoc/getDoctorByDeptAndHos', parm(data)),

  getDeptCardList: (data: any) =>
    service.post('/phs-reg/deptDoc/getDeptList', parm(data), {
      hideLoading: false,
    }),

  getDeptCardListSearch: (data: any) =>
    service.post('/phs-reg/deptDoc/searchDeptDocByWord', parm(data), {
      hideLoading: false,
    }),

  getDeptCardDetail: (data: any) =>
    service.post('/phs-reg/deptDoc/getDeptDetail', parm(data), {
      hideLoading: false,
      showMessage: false,
    }),

  queryRegNum: (data: any) =>
    service.post('/phs-reg/deptDoc/queryRegNum', parm(data), {
      hideLoading: false,
    }),

  preregistrationSave: (data: any) =>
    service.post('/phs-reg/deptDoc/preregistrationSave', parm(data), {
      hideLoading: false,
    }),

  //东总远期预约
  cancelForwardReg: (data: any) =>
    service.post('/phs-reg/forwardReg/cancelForwardReg', parm(data)),

  updateRegDate: (data: any) =>
    service.post('/phs-reg/forwardReg/updateRegDate', parm(data)),

  getSchDateByDeptAndDoc: (data: any) =>
    service.post('/phs-reg/forwardReg/getSchDateByDeptAndDoc', parm(data)),

  getRegRecordInfo: (data: any) =>
    service.post('/phs-reg/forwardReg/getRegRecordInfo', parm(data)),

  getForwardRegList: <T = any>(data: any) =>
    service.post<T>('/phs-reg/forwardReg/getForwardRegList', parm(data)),

  hpCalendar: <T = any>(data: any) =>
    service.post<T>('/phs-reg/reg/hpCalendar', parm(data)),

  getHisDeptList: <T>(data: any) =>
    service.post<T>('/reg/getHisDeptList', parm(data), {}),
};

// 用户服务
const userApi = {
  //转发统一认证接口
  allinoneAuthApi: <T = any>(
    data,
    opt = {
      showMessage: true,
    }
  ) =>
    service.post<T>('/phs-user/authUser/allinoneAuthApi', parm(data), {
      isAuth: true,
      hideLoading: false,
    }),

  allinoneAuthApi1: (data) =>
    service.post('/phs-user/authUser/bindRegisterUserAuth', parm(data), {
      isAuth: true,
      hideLoading: false,
    }),

  // 注销用户
  logoutUser: (data) =>
    service.post('/phs-user/authUser/logoutUser', parm(data), {
      isAuth: true,
      hideLoading: false,
    }),

  // 发送短信验证码
  sendVerifyCode: (data) =>
    service.post('/phs-user/message/sendVerifyCode', parm(data), {
      hideLoading: false,
    }),
  sendVerifyCodeByCode: (data) =>
    service.post('/phs-user/message/sendVerifyCodeByCode', parm(data), {
      hideLoading: false,
    }),

  applyForSign: (data) =>
    service.post('/phs-user/freePay/applyForSign', parm(data), {
      hideLoading: false,
    }),

  quickAppointmentAddPat: (data) =>
    service.post('/phs-user/rePat/quickAppointmentAddPat', parm(data), {
      hideLoading: false,
    }),

  getRelPatientBindInfo: (data) =>
    service.post('/phs-user/rePat/getRelPatientBindInfo', parm(data), {
      hideLoading: false,
    }),

  rpGetPlain: (data) =>
    service.post('/phs-user/rePat/rpGetPlain', parm(data), {
      hideLoading: false,
    }),

  updateUserInfo: (data) =>
    service.post('/phs-user/rePat/updateUserInfo', parm(data), {
      hideLoading: false,
    }),

  updateGuardianInfo: (data) =>
    service.post('/phs-user/rePat/updateGuardianInfo', parm(data), {
      hideLoading: false,
    }),

  analyzePatInfoInHos: (data) =>
    service.post('/phs-user/rePat/analyzePatInfoInHos', parm(data), {
      hideLoading: false,
    }),

  wfePatSync: (data) =>
    service.post('/phs-user/rePat/wfePatSync', parm(data), {
      hideLoading: false,
    }),

  xjzyyPatSync: (data) =>
    service.post('/phs-user/rePat/xjzyyPatSync', parm(data), {
      hideLoading: false,
    }),

  wzrmPatSync: (data) =>
    service.post('/phs-user/rePat/wzrmPatSync', parm(data), {
      hideLoading: false,
    }),
  patSync: (data) =>
    service.post('/phs-user/rePat/patSync', parm(data), {
      hideLoading: false,
    }),

  mdifPhone: (data) =>
    service.post('/phs-user/rePat/mdifPhone', parm(data), {
      hideLoading: false,
    }),

  patDynamicCode: (data) =>
    service.post('/phs-user/rePat/patDynamicCode', parm(data), {
      hideLoading: false,
    }),

  patSign: (data) =>
    service.post('/phs-user/freePay/patSign', parm(data), {
      hideLoading: false,
    }),

  findSign: (data) =>
    service.post('/phs-user/freePay/findSign', parm(data), {
      hideLoading: false,
    }),

  mofHosPhone: (data) =>
    service.post('/phs-user/rePat/mofHosPhone', parm(data), {
      hideLoading: false,
    }),

  addPatAndMdPhoneById: (data) =>
    service.post('/phs-user/relevantPatient/addPatAndMdPhoneById', parm(data), {
      hideLoading: false,
    }),

  getFamilyId: (data) =>
    service.post('/phs-user/relevantPatient/getFamilyId', parm(data), {
      hideLoading: false,
    }),

  getIdCardAfter: (data) =>
    service.post('/phs-user/relevantPatient/getIdCardAfter', parm(data), {
      hideLoading: false,
    }),

  cachePat: (data) =>
    service.post('/phs-user/relevantPatient/cachePat', parm(data), {
      hideLoading: false,
    }),

  modifyHosPhoneByIdNum: (data) =>
    service.post(
      '/phs-user/relevantPatient/modifyHosPhoneByIdNum',
      parm(data),
      {
        hideLoading: false,
      }
    ),

  getPatByHosPatId: (data) =>
    service.post('/phs-user/relevantPatient/getPatByHosPatId', parm(data), {
      hideLoading: false,
    }),

  checkPat: (data) =>
    service.post('/phs-user/relevantPatient/checkPat', parm(data), {
      hideLoading: false,
    }),

  // 验证患者身份证后四位
  getFourCheck: (data) =>
    service.post('/phs-user/relevantPatient/getFourCheck', parm(data), {
      hideLoading: false,
    }),

  relatedFamilyInfo: (data) =>
    service.post('/phs-user/relevantPatient/relatedFamilyInfo', parm(data), {
      hideLoading: false,
    }),

  updateFamilyInfo: (data) =>
    service.post('/phs-user/relevantPatient/updateFamilyInfo', parm(data), {
      hideLoading: false,
    }),

  mdPhoneById: (data) =>
    service.post('/phs-user/relevantPatient/mdPhoneById', parm(data), {
      hideLoading: false,
    }),

  addPatByHosPatId: (data) =>
    service.post('/phs-user/relevantPatient/addPatByHosPatId', parm(data), {
      hideLoading: false,
    }),

  perfectPatByHosPatId: (data) =>
    service.post('/phs-user/relevantPatient/perfectPatByHosPatId', parm(data), {
      hideLoading: false,
    }),

  getAliMedicalPat: (data) =>
    service.post('/phs-user/relevantPatient/getAliMedicalPat', parm(data), {
      // hideLoading: false,
    }),

  // 获取卡包订单号
  getCardPackOrderId: (data) =>
    service.post('/phs-user/healthCard/getCardPackOrderId', parm(data), {
      hideLoading: false,
    }),

  //身份证OCR识别
  ocrIdCard: <T>(data) =>
    service.post<T>('/phs-user/authUser/ocrIdCard', parm(data)),
  wxFace: <T = any>(data) =>
    service.post<T>('/phs-user/authUser/wxFace', parm(data)),

  alipayFace: <T = any>(data) =>
    service.post<T>('/phs-user/authUser/alipayFace', parm(data)),

  faceResultAuth: <T = any>(data) =>
    service.post<T>('/phs-user/authUser/faceResultAuth', parm(data)),
  faceResultAuthPC: <T = any>(data) =>
    service.post<T>('/phs-user/authUser/faceResultAuthPC', parm(data)),

  //快速验证注册/绑卡接口
  quickRegisterHealthCard: (data, opt = {}) =>
    service.post(
      '/phs-user/healthCard/quickRegisterHealthCard',
      parm(data),
      opt
    ),

  // 注册电子健康卡
  registerHealthCard: (data, opt = {}) =>
    service.post('/phs-user/healthCard/registerHealthCard', parm(data), opt),

  // 注册电子健康卡
  regHealthCardByPatInfo: (data, opt = {}) =>
    service.post(
      '/phs-user/healthCard/regHealthCardByPatInfo',
      parm(data),
      opt
    ),

  // 快速关联电子健康卡
  quickLinkHealthCard: (data) =>
    service.post('/phs-user/healthCard/quickLinkHealthCard', parm(data), {
      hideLoading: true,
      reportCmPV_YLName: '电子健康卡',
    }),
  // 快速关联电子健康卡,加载动画
  quickLinkHealthCardWithLoad: (data) =>
    service.post('/phs-user/healthCard/quickLinkHealthCard', parm(data), {
      reportCmPV_YLName: '电子健康卡',
    }),

  // 电子健康卡绑卡验证授权接口
  registerHealthCardPreAuth: (data) =>
    service.post('/phs-user/healthCard/registerHealthCardPreAuth', parm(data), {
      reportCmPV_YLName: '电子健康卡',
    }),
  // 电子健康卡新建就诊人填写信息页面-验证注册/绑卡接口
  registerHealthCardPreFill: (data) =>
    service.post('/phs-user/healthCard/registerHealthCardPreFill', parm(data), {
      reportCmPV_YLName: '电子健康卡',
    }),
  // 电子健康卡实人用户信息获取接口
  getOrderInfoByOrderId: (data) =>
    service.post('/phs-user/healthCard/getOrderInfoByOrderId', parm(data), {
      reportCmPV_YLName: '电子健康卡',
    }),

  // 电子健康卡实人验证结果通知接口
  registerRealPersonAuthOrder: (data) =>
    service.post(
      '/phs-user/healthCard/registerRealPersonAuthOrder',
      parm(data),
      {
        reportCmPV_YLName: '电子健康卡',
      }
    ),
  //实人验证生成orderId接口
  registerUniformVerifyOrder: (data) =>
    service.post(
      '/phs-user/healthCard/registerUniformVerifyOrder',
      parm(data),
      {
        reportCmPV_YLName: '电子健康卡',
      }
    ),
  //实人验证结果查询接口
  checkUniformVerifyResult: (data) =>
    service.post('/phs-user/healthCard/checkUniformVerifyResult', parm(data), {
      reportCmPV_YLName: '电子健康卡',
    }),

  getHospital: <T>(data) =>
    service.post<T>('/phs-base/hospital/getHospital', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '医院介绍',
    }),
  hosArea: <T>(data) =>
    service.post<T>('/phs-base/hospital/hosArea', parm(data), {
      hideLoading: false,
    }),
  getHospitalGuidelines: <T>(data) =>
    service.post<T>('/phs-base/hospital/getHospitalGuidelines', parm(data)),
  getUndertakerInfo: <T>(data: any) =>
    service.post<T>('/phs-base/complains/getUndertakerInfo', parm(data), {}),

  //添加已就诊就诊人
  addPatByHasBeenTreatedEncry: (data) =>
    service.post(
      '/phs-user/relevantPatient/addPatByHasBeenTreatedEncry',
      parm(data),
      {
        reportCmPV_YLName: '在线建档',
      }
    ),

  updateHosInfo: (data) =>
    service.post('/phs-user/relevantPatient/updateHosInfo', parm(data), {}),

  upRealNameAuth: (data) =>
    service.post('/phs-user/relevantPatient/upRealNameAuth', parm(data), {}),

  altHosMedicalInfo: (data) =>
    service.post('/phs-user/relevantPatient/altHosMedicalInfo', parm(data), {}),

  //添加已就诊就诊人
  addPatientByHasBeenTreated: (data) =>
    service.post(
      '/phs-user/relevantPatient/addPatientByHasBeenTreated',
      parm(data),
      {
        reportCmPV_YLName: '在线建档',
      }
    ),

  //更新就诊人OpenId
  sysPatOpenIdAssignment: (data) =>
    service.post(
      '/phs-user/relevantPatient/sysPatOpenIdAssignment',
      parm(data),
      {
        hideLoading: false,
      }
    ),

  //设置默认就诊人
  updateDefaultPat: (data) =>
    service.post('/phs-user/relevantPatient/updateDefaultPat', parm(data), {
      hideLoading: true,
    }),

  //删除相关就诊人
  deletePat: (data) =>
    service.post('/phs-user/relevantPatient/deletePat', parm(data), {
      hideLoading: true,
    }),
  deletePatByHerenId: (data) =>
    service.post('/phs-user/relevantPatient/deletePatByHerenId', parm(data), {
      hideLoading: true,
    }),

  //添加相关就诊人
  addPat: (data) =>
    service.post('/phs-user/relevantPatient/addPat', parm(data)),
  //添加相关就诊人
  cacheAddPat: (data) =>
    service.post('/phs-user/relevantPatient/cacheAddPat', parm(data)),

  //根据姓名手机号查询院内卡列表
  getAllCardByName: (data) =>
    service.post('/phs-user/relevantPatient/getAllCardByName', parm(data)),

  //根据院内卡列表添加就诊人
  addPatByAllCard: (data) =>
    service.post('/phs-user/relevantPatient/addPatByAllCard', parm(data)),

  //获取就诊人列表
  getPatCardList: (data) =>
    service.post<IPat[]>(
      '/phs-user/relevantPatient/getPatCardList',
      parm(data)
    ),
  //获取就诊人详情
  getPatCardInfo: (data) =>
    service.post<IPat[]>(
      '/phs-user/relevantPatient/getPatCardInfo',
      parm(data)
    ),

  //获取就诊人信息（院内）
  getPatCardInfoByHospital: (data) =>
    service.post(
      '/phs-user/relevantPatient/getPatCardInfoByHospital',
      parm(data),
      {
        showMessage: false,
      }
    ),
  //首页授权接口
  authorization: (data) =>
    service.post<IPat[]>('/phs-user/ali/authorization', parm(data), {}),

  // 支付宝验证本人
  alipayVerifiSelf: (data) =>
    service.post<any>('/phs-user/relevantPatient/alipayVerifiSelf', parm(data)),

  // 判断是否关注公众号
  judgeSubscribeWxAccount: (data) =>
    service.post<any>(
      '/phs-user/authUser/judgeSubscribeWxAccount',
      parm(data),
      {
        showMessage: false,
      }
    ),

  updateRelationship: (data: any) =>
    service.post('/phs-user/relevantPatient/updateRelationship', parm(data), {
      hideLoading: false,
    }),

  customerAsk: (data: any) =>
    service.post('/phs-extend/customer/ask', parm(data), {
      hideLoading: true,
    }),
  customerAIask: (data: any) =>
    service.post('/phs-extend/customer/aiAsk', parm(data), {
      hideLoading: true,
    }),
  getReportInfo: (data: any) =>
    service.post('/phs-extend/customer/getReportInfo', parm(data), {
      hideLoading: true,
    }),
  customerEvaluate: (data: any) =>
    service.post('/phs-extend/customer/evaluate', parm(data), {
      hideLoading: false,
    }),
  ///检验分析
  inspectionAnalysis: (data: any) =>
    service.post('/phs-extend/customer/inspectionAnalysis', parm(data), {
      hideLoading: false,
    }),
  //提问
  customerPicTrans: (data: any) =>
    service.post('/phs-extend/customer/picTrans', parm(data), {
      hideLoading: false,
    }),
};
//统一认证服务
const authApi = {
  authLogin: (data) =>
    service.post('/login/authLogin', parm(data), {
      baseURL: global.authUrl,
    }),

  getTPAlipayUserInfoShare: (data) => {
    return service.post('/aliUserLogin/getTPAlipayUserInfoShare', parm(data), {
      baseURL: global.authUrl,
    });
  },

  userInfoByToken: (data) => {
    return service.post('/modifyUserInfo/userInfoByToken', parm(data), {
      baseURL: global.authUrl,
    });
  },

  getAppletsOpenId: <T = any>(data) => {
    return service.post<T>(
      '/wx/getAppletsOpenId',
      parm(data, { outArg: true }),
      {
        baseURL: global.authUrl,
      }
    );
  },

  wxLoginByPhoneNumberCode: (data) => {
    return service.post('/wx/wxLoginByPhoneNumberCode', parm(data), {
      baseURL: global.authUrl,
    });
  },

  addHRPay: <T>(
    data,
    opt = {
      hideLoading: false,
    }
  ) => {
    return service.post<T>('/phs-pay/pay/addHRPay', parm(data), opt);
  },

  clinicRefundByMessage: <T>(
    data,
    opt = {
      hideLoading: false,
    }
  ) => {
    return service.post<T>(
      '/phs-pay/pay/clinicRefundByMessage',
      parm(data),
      opt
    );
  },

  payResult: <T>(data) => {
    return service.post<T>('/phs-pay/pay/payResult', parm(data), {
      hideLoading: false,
    });
  },

  medicalPay: <T>(
    data,
    opt = {
      // showMessage: false,
      hideLoading: false,
    }
  ) => {
    return service.post<T>('/phs-pay/pay/medicalPay', parm(data), opt);
  },

  getStatus: <T>(data, opt = { hideLoading: false }) => {
    return service.post<T>('/phs-message/message/getStatus', parm(data), opt);
  },
};

const api1001035 = {
  baseURL: globalGl.isPersonal_1001035
    ? envData.baseApi
    : 'https://phs.jshtcm.com',
  // 科室列表
  getDeptList1001035: (data: any) => {
    return service.post(
      `${globalGl.isPersonal_1001035 ? '/phs-reg' : ''}` + '/reg/getDeptList',
      parm(data),
      {
        hideLoading: false,
        reportCmPV_YLName: '科室介绍',
        baseURL: api1001035.baseURL,
      }
    );
  },

  getDeptSchByDate1001035: <T>(data: any) => {
    return service.post<T>(
      `${globalGl.isPersonal_1001035 ? '/phs-reg' : ''}` +
        '/reg/getDeptSchByDate',
      parm(data),
      {
        hideLoading: false,
        baseURL: api1001035.baseURL,
      }
    );
  },
  getDeptSchForDoc1001035: <T>(data: any) => {
    return service.post<T>(
      `${globalGl.isPersonal_1001035 ? '/phs-reg' : ''}` +
        '/reg/getDeptSchForDoc',
      parm(data),
      {
        hideLoading: false,
        baseURL: api1001035.baseURL,
      }
    );
  },
  getDocSch1001035: (data: any) => {
    return service.post(
      `${globalGl.isPersonal_1001035 ? '/phs-reg' : ''}` + '/reg/getDocSch',
      parm(data),
      {
        hideLoading: false,
        baseURL: api1001035.baseURL,
      }
    );
  },

  getNumberSource1001035: <T>(data: any) =>
    service.post<T>(
      `${globalGl.isPersonal_1001035 ? '/phs-reg' : ''}` +
        '/reg/getNumberSource',
      parm(data),
      {
        hideLoading: false,
        baseURL: api1001035.baseURL,
      }
    ),
};

export default {
  ...baseApi,
  ...queryApi,
  ...regApi,
  ...userApi,
  ...authApi,
  ...api1001035,

  // 获取国籍
  async getCountryList() {
    const { data = [] } = await new Promise<{
      data: {
        name_zh: string;
        name_en: string;
        pinyin: string;
        short_lower: string;
        short_upper: string;
        tel: string;
        label: string;
        value: string;
      }[];
    }>((complete) => {
      uni.request({
        url: globalGl.BASE_IMG + 'country.json',
        complete: complete as any,
      });
    });

    data.map((o) => {
      o.label = o.name_zh;
      o.value = o.tel;
    });

    return data;
  },

  // 获取中国节假日（需每年手动维护）
  async getChineseHolidays() {
    const res = await new Promise<{
      data: {
        date: string;
        name: string;
        des: string;
      }[];
    }>((complete) => {
      uni.request({
        url: globalGl.BASE_IMG + 'holidays.json',
        complete: complete as any,
        success: (res) => {
          console.log(res)
        }
      });
    });
    console.log(res);
    const { data = [] } = res;
    return data;
  },
};
