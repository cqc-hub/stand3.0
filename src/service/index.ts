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
import { useGlobalStore, useMessageStore } from '@/stores';
import { LoginUtils, ServerStaticData, outLogin } from '@/utils';
import { beforeEach } from '@/router';
import globalGl from '@/config/global';
import { sm4_ecb_encrypt, sm4_ecb_decrypt } from '@/common/sm4.js';
// #ifdef MP-ALIPAY
import monitor from '@/js_sdk/alipay/alipayLogger.js';
// import { reportCmPV_YL } from '@/js_sdk/alipay/cloudMonitorHelper.js';
// #endif

const Request = new requestClass();
const globalStore = useGlobalStore();

let outLoginTimer: number;

//是否加密 正式环境默认开启sm4加密
const isDes = false;
const isOpenSm4 =
  (globalGl.env as string) === 'prod' ? true : globalGl.isOpenSm4;
const getShowUrl = (url, baseUrl) =>
  url.slice(baseUrl?.length || 0).split('=')[0];

// 请求拦截器
Request.interceptors.request((request: IRequest) => {
  // #ifdef H5
  if (
    globalStore.isLogin &&
    globalStore.envH5 === 'web' &&
    globalGl.WEB_OUT_LOGIN_TIME
  ) {
    if (outLoginTimer) {
      clearTimeout(outLoginTimer);
    }
    outLoginTimer = setTimeout(() => {
      outLogin({
        isHideMessage: false,
        isGoLoginPage: true,
      });
    }, globalGl.WEB_OUT_LOGIN_TIME);
  }
  // #endif

  if (!request.hideLoading) showLoading();
  // if (request.method === 'GET') {
  //   request.data = JSON.stringify(request.data)
  //   request.url = request.url + '?' + request.data
  // }
  //网关限流——除开发环境
  if (globalGl.env === 'prod') {
    request.url = request.url + '=' + encryptDes(getSysCode(), 'hrtest22');
  }

  // @ts-expect-error
  request._data = request.data;

  if (isDes || isOpenSm4) {
    request.data = requestInterfaceEncrp(request);
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

    const {
      code,
      message,
      functionVersion,
      signContent,
      innerMessage,
      showMessage: _showMessage,
    } = responseData;

    if (signContent) {
      responseData.result = responseInterfaceDecryp(signContent);
    }
    console.warn(getShowUrl(responseOptions?.url, responseOptions?.baseURL));

    // @ts-expect-error
    console.log('入参----', responseOptions?._data);
    console.log('出参----', responseData.result);
    console.log('总----', response);

    //处理清除缓存的操作
    if (functionVersion) {
      cleanSession(functionVersion);
    }

    // #ifdef MP-ALIPAY
    //支付宝埋点操作
    alipayRequestTrack(response);
    // #endif

    // 登录过期
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
      let _message = _showMessage || message || innerMessage;

      if (showMessage === undefined) {
        showMessage = true;
      }

      if (showMessage) {
        messageStore.showMessage(_message, 3000);
      }

      return Promise.reject(responseData);
    }

    return responseData;
  },
  (err) => {
    const messageStore = useMessageStore();

    messageStore.showMessage(
      err.data.message || err.data.error || '服务异常',
      3000
    );
    uni.hideLoading();

    return err.data;
  }
);

// 设置默认配置
Request.setConfig((config: any) => {
  config.baseURL = env.baseApi;
  config.header = {
    hrCode: encryptDes(getSysCode(), 'hrtest22'),
  };
  //判断是否携带token校验
  if (config.token) {
    config.header['Authorization'] = getToken();
  }
  if (isOpenSm4) {
    config.header.phsSign = encryptDes(
      getSysCode() + '_' + new Date().getTime(),
      'SkpOe3I1'
    );
    config.header.phsId = '81681766';
  } else {
    config.header.phsSign = encryptDes(
      getSysCode() + '_' + new Date().getTime(),
      'W7ZEgfnv'
    );
    config.header.phsId = '81681688';
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

//接口加密
const requestInterfaceEncrp = (request) => {
  //禁止删除
  console.log(
    '入参----',
    getShowUrl(request.url, request.baseURL?.length || 0),
    request.data
  );

  const data = JSON.parse(JSON.stringify(request.data));
  const desData = {
    args: {},
    signContent: '',
    token: data.token,
  };
  if (isOpenSm4) {
    desData.signContent = sm4_ecb_encrypt(JSON.stringify(data.args));
  } else if (isDes) {
    const key = 'reqv3-' + ('0' + new Date().getDate()).slice(-2);
    desData.signContent = encryptDes(JSON.stringify(data.args), key);
  }
  return desData;
};

const responseInterfaceDecryp = (signContent) => {
  let DecryptData = {};
  if (isOpenSm4) {
    try {
      DecryptData = JSON.parse(sm4_ecb_decrypt(signContent) || '{}');
    } catch (e) {
      DecryptData = sm4_ecb_decrypt(signContent);
    }
  } else if (isDes) {
    const key = 'resv3-' + ('0' + new Date().getDate()).slice(-2);
    try {
      DecryptData = JSON.parse(decryptDes(signContent, key));
    } catch (e) {
      DecryptData = decryptDes(signContent, key);
    }
  }
  return DecryptData;
};
export default Request;
