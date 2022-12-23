import requestClass from './request';
import env from '@/config/env';
import {
  encryptDes,
  decryptDes,
  getSysCode,
  getToken,
  showLoading,
  hideLoading,
  getLocalStorage,
  setLocalStorage,
} from '@/common';
import { IRequest, IResponseWrapper } from './type';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';
import { LoginUtils, ServerStaticData } from '@/utils';
import { beforeEach } from '@/router';
import globalGl from '@/config/global';
// #ifdef MP-ALIPAY
import monitor from '@/js_sdk/alipay/alipayLogger.js';
// import { reportCmPV_YL } from '@/js_sdk/alipay/cloudMonitorHelper.js';
// #endif

const Request = new requestClass();

//是否加密
const isDes = (globalGl.env as string) === 'prod' ? true : globalGl.isOpenDes;

// 请求拦截器
Request.interceptors.request((request: IRequest) => {
  if (!request.hideLoading) showLoading();
  // if (request.method === 'GET') {
  //   request.data = JSON.stringify(request.data)
  //   request.url = request.url + '?' + request.data
  // }
  //网关限流——除开发环境
  if ((globalGl.env as string) !== 'dev') {
    request.url = request.url + '=' + encryptDes(getSysCode(), 'hrtest22');
  }

  if (isDes) {
    //禁止删除
    console.log(request.url, request.data);
    const key = 'reqv3-' + ('0' + new Date().getDate()).slice(-2);
    const data = JSON.parse(JSON.stringify(request.data));
    const desData = {
      args: {},
      signContent: encryptDes(JSON.stringify(data.args), key),
      token: data.token,
    };

    request.data = desData;
  }
  return request;
});

// 响应拦截器
Request.interceptors.response(
  (response: IResponseWrapper) => {
    const responseData = response.res.data;
    const responseOptions = response.options;
    const messageStore = useMessageStore();
    if (responseOptions) {
      const { hideLoading: iHideLoading } = responseOptions;

      if (!iHideLoading) {
        hideLoading();
      }
    } else {
      hideLoading();
    }

    const { code, message, functionVersion, signContent } = responseData;

    //解密
    if (isDes && signContent) {
      const key = 'resv3-' + ('0' + new Date().getDate()).slice(-2);
      responseData.result = JSON.parse(decryptDes(signContent, key));
      //禁止删除
      console.log('出参', responseData.result);
    } else {
      console.log(response);
    }
    //处理清除缓存的操作
    if (functionVersion) {
      cleanSession(functionVersion);
    }

    // #ifdef MP-ALIPAY
    //支付宝埋点操作
    alipayRequestTrack(response);
    // #endif

    // 请根据后端规定的状态码判定
    if (code === 4000) {
      const pages = getCurrentPages();

      //  需要重新登录4000  0 成功
      messageStore.showMessage(message, 3000, {
        closeCallBack: () => {
          const fullUrl: string = (pages[pages.length - 1] as any).$page
            .fullPath;

          new LoginUtils().outLogin({
            isHideMessage: true,
            isGoLoginPage: false,
          });

          setTimeout(() => {
            beforeEach({
              url: fullUrl,
              _isLogin: true,
            });
          });
        },
      });

      return Promise.reject(responseData);
    } else if (code != 0) {
      let showMessage = responseOptions && responseOptions.showMessage;
      if (showMessage === undefined) {
        showMessage = true;
      }

      if (showMessage) {
        messageStore.showMessage(message, 3000);
      }

      return Promise.reject(responseData);
    }

    return responseData;
  },
  (err) => {
    const messageStore = useMessageStore();
    messageStore.showMessage(err.data.message, 3000);
    uni.hideLoading();

    return err.data;
  }
);

// 设置默认配置
Request.setConfig((config: any) => {
  config.baseURL = env.baseApi;
  config.header = {
    // "Authorization": getToken(),
    hrCode: encryptDes(getSysCode(), 'hrtest22'),
    phsId: '81681688',
    phsSign: encryptDes(getSysCode() + '_' + new Date().getTime(), 'W7ZEgfnv'),
  };
  //判断是否携带token校验
  if (config.token) {
    config.header['Authorization'] = getToken();
  }

  return config;
});

//根据后端接口返回 清除缓存
const cleanSession = (functionVersion) => {
  const localVersion = getLocalStorage('systemConfigVersion');

  try {
    const newVersion = JSON.parse(functionVersion);
    if (!localVersion) {
      setLocalStorage({
        systemConfigVersion: newVersion,
      });
    } else {
      //对比不一致 清除缓存
      deepEqualClean(localVersion, newVersion);
    }
  } catch (err) {
    // catch 不获取异常 支付宝直接 💥
    console.error(err);
  }
};

//支付宝埋点
const alipayRequestTrack = (response: IResponseWrapper) => {
  const alipayPid = globalGl.systemInfo.alipayPid;
  const monitorName = response.options?.monitorName;
  const reportCmPV_YLName = response.options?.reportCmPV_YLName;
  const code = response.res.data.code;
  if (alipayPid && (monitorName || reportCmPV_YLName)) {
    if (monitorName) {
      monitor.api({
        api: monitorName,
        success: code == 0 ? true : false,
        c1: 'taSR_YL',
        time: response.res.data.timeTaken,
      }); 
    }
    //支付宝新规则 不需要拆解埋点了
    // if (reportCmPV_YLName) {
    //   reportCmPV_YL({
    //     title: reportCmPV_YLName,
    //   }); 
    // }
  }
};

function deepEqualClean(localVersion, newVersion) {
  const keys1 = Object.keys(localVersion);
  const keys2 = Object.keys(newVersion);

  for (let index = 0; index < keys1.length; index++) {
    const val1 = localVersion[keys1[index]];
    const val2 = newVersion[keys2[index]];
    if (val1.version != val2.version) {
      if (val1.functionType == 1) {
        uni.removeStorageSync('systemConfig');
      }
      if (val1.functionType == 2) {
        uni.removeStorageSync('viewConfig');
        //重新请求首页配置
        ServerStaticData.getHomeConfig();
      }
      setLocalStorage({
        systemConfigVersion: newVersion,
      });
    }
  }
}

export default Request;
