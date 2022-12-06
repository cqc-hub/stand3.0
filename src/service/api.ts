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
    ...data,
  };

  if (outArg) {
    return body;
  }

  return {
    args: body,
    // token: '1'
    token: globalStore.token.accessToken,
    funcode: data.funcode,
    sysCode: getSysCode(),
    // token: 'a6e8289c389d8ece73750fe57fc12011f75c7558a06d87cc127fee52ce594e0dbf4996051b4ba4126f4f643e03fa3bee4e642af1ac30f0c07c1b567cfdf11b599c968d4faefc96d548b04f62abfe54aaf315033472b3a8f4a4ede91d9df046e92bc7bc7a86e690bcc8263a89c4f2100cd36c74c7faaeb90a428f3789811edd9f698e56eda0e7bca200b5d59ef551b6ed0eb1a6d3a1da5b8a29a2c6c427926d9caf9960e4d3049c77fe852a0f425767d72a3de7d67911ae2338aeced63421ceb55fc00ed68823cbfbe0e9b2e0682558f0f873865b3bab0d814aeab5eccfbebc773902356253a88c5bd7de346708b9d0f4'
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
    service.post('/phs-base/transparent/sendNetHos', parm(data), {
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
      monitorName: '预约挂号',
      reportCmPV_YLName: '',
    }),
};
// 查询服务
const queryApi = {
  // 获取填写过问卷
  getRiskCode: (data) =>
    service.post('/phs-query/escort/getRiskCode', parm(data)),

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
      reportCmPV_YLName: '门诊缴费',
    }),

  createClinicOrder: <T = any>(data) =>
    service.post<T>('/phs-query/clinical/createClinicOrder', parm(data), {
      hideLoading: false,
    }),

  // 缴费详情
  getClinicalPayDetailList: (data) =>
    service.post('/phs-query/clinical/getClinicalPayDetailList', parm(data), {
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
    service.post<T>('/phs-query/hospital/createInHospitalPayOrder', parm(data)),
  //获取住院缴费记录
  getInHospitalPayInfo: <T>(data) =>
    service.post<T>('/phs-query/hospital/getInHospitalPayInfo', parm(data), {
      reportCmPV_YLName: '缴费记录查询',
    }),
  //获取住院费用清单详情
  getInHospitalCostInfo: <T>(data) =>
    service.post<T>('/phs-query//hospital/getInHospitalCostInfo', parm(data)),
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

  delMyCollect: (data: any) =>
    service.post('/phs-reg/collect/delMyCollect', parm(data), {
      hideLoading: false,
    }),

  // 挂号
  addReg: (data: any) =>
    service.post('/phs-reg/reg/addReg', parm(data), {
      hideLoading: false,
      monitorName: '预约挂号',
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
  addPatientByHasBeenTreated: (data) =>
    service.post(
      '/phs-user/relevantPatient/addPatByHasBeenTreatedEncry',
      parm(data)
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

  addHRPay: <T>(data) => {
    return service.post<T>('/phs-pay/pay/addHRPay', parm(data), {
      // showMessage: false,
      hideLoading: false,
    });
  },
};
export default { ...baseApi, ...queryApi, ...regApi, ...userApi, ...authApi };
