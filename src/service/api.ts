import service from './index';
import { getToken, getSysCode } from '@/common/useToken';
import { IResponseWrapper } from './type';
import global from '@/config/global';
import { useGlobalStore, useUserStore, IPat } from '@/stores';

//请求的额外配置
const options = {
  showLoading: false
};

// 参数的额外配置
let parm = (data: any, payload: any = {}) => {
  const { outArg } = payload;
  const globalStore = useGlobalStore();
  const body = {
    sysCode: getSysCode(),
    ...data
  };

  if (outArg) {
    return body;
  }

  return {
    args: body,
    // token: '1'
    token: globalStore.token.accessToken
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
    service.post('/phs-base/sysCode/getSysAppMore', parm(data)),

  addPatientByHasBeenTreated: (data) =>
    service.post(
      '/phs-user/relevantPatient/addPatientByHasBeenTreated',
      parm(data)
    ),

  addPat: (data) =>
    service.post('/phs-user/relevantPatient/addPat', parm(data)),

  getPatCardList: (data) =>
    service.post<IPat[]>(
      '/phs-user/relevantPatient/getPatCardList',
      parm(data)
    ),

  getPatCardInfoByHospital: (data) =>
    service.post(
      '/phs-user/relevantPatient/getPatCardInfoByHospital',
      parm(data)
    ),

  getAllDivision: (data) =>
    service.post('/phs-base/division/getAllDivision', parm(data)),

  getTermsBySysAndCode: (data) =>
    service.post('/phs-base/sysCode/getTermsBySysAndCode', parm(data)),

  getParamsMoreBySysCode: (data) =>
    service.post('/phs-base/sysCode/getParamsMoreBySysCode', parm(data)),

  allinoneAuthApi: (data) =>
    service.post('/phs-user/authUser/allinoneAuthApi', parm(data), {
      isAuth: true
    }),

  authLogin: (data) => {
    return service.post('/login/authLogin', parm(data), {
      baseURL: global.authUrl
    });
  },

  getTPAlipayUserInfoShare: (data) => {
    return service.post(
      '/aliUserLogin/getTPAlipayUserInfoShare',
      parm(data),
      {
        baseURL: global.authUrl
      }
    );
  },

  userInfoByToken: (data) => {
    return service.post('/modifyUserInfo/userInfoByToken', parm(data), {
      baseURL: global.authUrl
    });
  },

  getAppletsOpenId: (data) => {
    return service.post(
      '/wx/getAppletsOpenId',
      parm(data, { outArg: true }),
      {
        baseURL: global.authUrl
      }
    );
  },

  wxLoginByPhoneNumberCode: (data) => {
    return service.post('/wx/wxLoginByPhoneNumberCode', parm(data), {
      baseURL: global.authUrl
    });
  },
  //查询医院样式
  queryHospitalPattern: (data) => {
    return service.post(
      '/phs-base/firstPage/queryHospitalPattern',
      parm(data)
    );
  }
};

// 查询服务
const queryApi = {
  // 获取填写过问卷
  getRiskCode(data) {
    return service.post('/phs-query/escort/getRiskCode', parm(data));
  },

  // 发送产科问卷
  sendQuestionnaireInfo(data) {
    return service.post(
      '/phs-query/hospital/sendObstetricsQuestionnaire',
      parm(data)
    );
  },
  //核酸混检结果查询
  getNucleicResult(data) {
    return service.post(
      '/phs-query/test/getNucleicResult',
      parm(data)
    );
  },
};

// 挂号服务
const regApi = {
  // 预问诊留言提交
  subPreinquiryMessage: (data: any) =>
    service.post('/phs-reg/regDoc/subPreinquiryMessage', parm(data))
};

// export function testGet(data: any) {
//   return service.get('/testGet', data)
// }

// export function testPost(data: any) {
//   return service.post('/testPost', data, options)
// }

// export function testPut(data: any) {
//   return service.post('/testPut', data)
// }

// export function testDelete(data: any) {
//   return service.delete('/testDelete', data)
// }

export default { ...baseApi, ...queryApi, ...regApi };
