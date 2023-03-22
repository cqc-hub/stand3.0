import service from './index';
import { getToken, getSysCode } from '@/common/useToken';
import { IResponseWrapper } from './type';
import global from '@/config/global';
import { useGlobalStore, useUserStore, IPat } from '@/stores';
import { hideLoading } from '../common/utils';
// ss
//请求的额外配置
const options = {
  showLoading: false,
};

// 参数的额外配置
let parm = (data: any, payload: any = {}) => {
  const { outArg } = payload;
  const globalStore = useGlobalStore();
  const body = {
    sysCode: getSysCode(),
    herenId: globalStore.herenId,
    ...data,
  };

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
  const body = {
    sysCode: getSysCode(),
    herenId: globalStore.herenId,
    ...data,
  };

  if (outArg) {
    return body;
  }

  return {
    args: body,
    sysCode: getSysCode(),
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
    service.post('/phs-base/sysCode/getSysAppMore', parm(data), {
      showMessage: false,
      hideLoading: true,
    }),

  // 资讯详情
  getCmsInfo: (data) =>
    service.post('/phs-base/cms/getCmsInfo', parm(data), {
      hideLoading: false,
    }),

  sendNetHos: (data) =>
    service.post('/phs-base/transparent/sendNetHos', parmsysCode(data), {
      hideLoading: false,
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
    service.post('/phs-base/firstPage/queryHospitalPattern', parm(data)),

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
    }),
};
// 查询服务
const queryApi = {
  // 获取填写过问卷
  getRiskCode: (data) =>
    service.post('/phs-query/escort/getRiskCode', parm(data)),

  // 医保授权(微信国标)
  authorize: <T>(data) =>
    service.post<T>('/phs-query/medical/authorize', parm(data), {
      hideLoading: false,
    }),

  // 医保授权
  medicalCostInfoUpload: <T>(data) =>
    service.post<T>('/phs-query/medical/medicalCostInfoUpload', parm(data), {
      hideLoading: false,
    }),

  // 待缴费
  getUnpaidClinicList: <T>(data) =>
    service.post<T>('/phs-query/clinical/getUnpaidClinicList', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '门诊缴费',
    }),

  // 已缴费
  getPrepaidClinicList: <T>(data) =>
    service.post<T>('/phs-query/clinical/getPrepaidClinicList', parm(data), {
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
  getClinicalPayDetailList: (data) =>
    service.post('/phs-query/clinical/getClinicalPayDetailList', parm(data), {
      hideLoading: false,
    }),

  getDrugDelivery: (data) =>
    service.post('/phs-query/delivery/getDrugDelivery', parm(data), {
      hideLoading: false,
    }),

  addDrugDelivery: (data) =>
    service.post('/phs-query/delivery/addDrugDelivery', parm(data), {
      hideLoading: false,
    }),

  getDrugDeliveryDetail: (data) =>
    service.post('/phs-query/delivery/getDrugDeliveryDetail', parm(data), {
      hideLoading: false,
    }),

  // 发送产科问卷
  sendQuestionnaireInfo: (data) =>
    service.post('/phs-query/hospital/sendObstetricsQuestionnaire', parm(data)),

  // 门诊住院列表
  getOutpatientHospitalList: (data) =>
    service.post('/phs-query/operation/getOutpatientHospitalList', parm(data), {
      showMessage: false,
      hideLoading: false,
    }),
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
  // 获取住院信息
  getInHospitalInfo: <T>(data) =>
    service.post<T>('/phs-query/hospital/getInHospitalInfo', parm(data)),
  //获取住院费用日清单列表
  getInHospitalDailyCostList: <T>(data) =>
    service.post<T>(
      '/phs-query/hospital/getInHospitalDailyCostList',
      parm(data),
      {
        reportCmPV_YLName: '住院日清单查询',
      }
    ),
  //创建住院缴费订单
  createInHospitalPayOrder: <T>(data) =>
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
    service.post('/phs-query/examine/getReportsReportList', parm(data), {
      reportCmPV_YLName: '检查检验报告查询',
      monitorName: '报告查询',
    }),
  getExamineReportDetails: <T = any>(data) =>
    service.post('/phs-query/examine/getExamineReportDetails', parm(data)),
  getCheckoutReportDetails: <T = any>(data) =>
    service.post('/phs-query/checkout/getCheckoutReportDetails', parm(data)),
  getCloudReportUrl: <T = any>(data) =>
    service.post('/phs-query/examine/getCloudReportUrl', parm(data)),
  getScheme: <T = any>(data) =>
    service.post('/phs-user/message/getScheme', parm(data)),
};

// 挂号服务
const regApi = {
  // 预问诊留言提交
  subPreinquiryMessage: (data: any) =>
    service.post('/phs-reg/regDoc/subPreinquiryMessage', parm(data)),

  addCollect: (data: any) =>
    service.post('/phs-reg/collect/addCollect', parm(data), {
      hideLoading: false,
    }),

  getCheckIn: (data: any) =>
    service.post('/phs-reg/reg/getCheckIn', parm(data), {
      hideLoading: false,
    }),

  getCheckInList: (data: any) =>
    service.post('/phs-reg/reg/getCheckInList', parm(data), {
      hideLoading: false,
    }),

  addRegSatisfaction: (data: any) =>
    service.post('/phs-reg/regSatisfaction/addRegSatisfaction', parm(data), {
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

  queryDeptInfo: (data: any) =>
    service.post('/phs-reg/regIntelligence/queryDeptInfo', parm(data), {
      hideLoading: true,
    }),

  // 挂号
  addReg: (data: any) =>
    service.post('/phs-reg/reg/addReg', parm(data), {
      hideLoading: false,
      monitorName: '预约挂号',
      reportCmPV_YLName: '挂号缴费',
    }),

  refundOrder: (data: any) =>
    service.post('/phs-reg/reg/refundOrder', parm(data), {
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

  getRegOrderList: <T>(data: any) =>
    service.post<T>('/phs-reg/reg/getRegOrderList', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '挂号记录查询',
    }),

  // 科室列表
  getDeptList: (data: any) =>
    service.post('/phs-reg/reg/getDeptList', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '科室介绍',
    }),

  // 科室排班-按医生挂号
  getDeptSchForDoc: <T>(data: any) =>
    service.post<T>('/phs-reg/reg/getDeptSchForDoc', parm(data), {
      hideLoading: false,
    }),

  // 科室排班-按日期挂号
  getDeptSchByDate: <T>(data: any) =>
    service.post<T>('/phs-reg/reg/getDeptSchByDate', parm(data), {
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
};

// 用户服务
const userApi = {
  //转发统一认证接口
  allinoneAuthApi: (data) =>
    service.post('/phs-user/authUser/allinoneAuthApi', parm(data), {
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

  // 获取卡包订单号
  getCardPackOrderId: (data) =>
    service.post('/phs-user/healthCard/getCardPackOrderId', parm(data), {
      hideLoading: false,
    }),

  //身份证OCR识别
  ocrIdCard: <T>(data) =>
    service.post<T>('/phs-user/authUser/ocrIdCard', parm(data)),

  // 注册电子健康卡
  registerHealthCard: (data, opt = {}) =>
    service.post('/phs-user/healthCard/registerHealthCard', parm(data), opt),

  // 快速关联电子健康卡
  quickLinkHealthCard: (data) =>
    service.post('/phs-user/healthCard/quickLinkHealthCard', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '电子健康卡',
    }),

  getHospital: <T>(data) =>
    service.post<T>('/phs-base/hospital/getHospital', parm(data), {
      hideLoading: false,
      reportCmPV_YLName: '医院介绍',
    }),

  //添加已就诊就诊人
  addPatByHasBeenTreatedEncry: (data) =>
    service.post(
      '/phs-user/relevantPatient/addPatByHasBeenTreatedEncry',
      parm(data),
      {
        reportCmPV_YLName: '在线建档',
      }
    ),

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

  //添加相关就诊人
  addPat: (data) =>
    service.post('/phs-user/relevantPatient/addPat', parm(data)),

  //获取就诊人列表
  getPatCardList: (data) =>
    service.post<IPat[]>(
      '/phs-user/relevantPatient/getPatCardList',
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
    service.post<IPat[]>('/phs-user/ali/authorization', parm(data)),

  // 支付宝验证本人
  alipayVerifiSelf: (data) =>
    service.post<any>('/phs-user/relevantPatient/alipayVerifiSelf', parm(data)),

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

  getAppletsOpenId: (data) => {
    return service.post('/wx/getAppletsOpenId', parm(data, { outArg: true }), {
      baseURL: global.authUrl,
    });
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
};
export default { ...baseApi, ...queryApi, ...regApi, ...userApi, ...authApi };
