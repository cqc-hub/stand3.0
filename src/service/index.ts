import requestClass from './request';
import env from '@/config/env';
import {
  encryptDes,
  getSysCode,
  getToken,
  showLoading,
  hideLoading,
  getLocalStorage,
  setLocalStorage
} from '@/common';
import { IRequest, IResponseWrapper } from './type';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';
import { LoginUtils } from '@/utils';
import { beforeEach } from '@/router';
const Request = new requestClass();
// 请求拦截器
Request.interceptors.request((request: IRequest) => {
  if (!request.hideLoading) showLoading();
  // if (request.method === 'GET') {
  //   request.data = JSON.stringify(request.data)
  //   request.url = request.url + '?' + request.data
  // }
  return request;
});

// 响应拦截器
Request.interceptors.response(
  (response: IResponseWrapper) => {
    console.log({
      response,
    });

    const responseData = response.res.data;
    const responseOptions = response.options;
    const messageStore = useMessageStore();
    //判断返回状态 执行相应操作
    hideLoading();

    const { code, message, functionVersion } = responseData;

    //处理清除缓存的操作
    console.log(4444, functionVersion);

    if (functionVersion) {
      cleanSession(functionVersion);
    }
    // 请根据后端规定的状态码判定

    if (code === 4000) {
      const pages = getCurrentPages();

      //  需要重新登录4000  0 成功
      messageStore.showMessage(message, 1500, {
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
            });
          });
        },
      });
    } else if (code !== 0) {
      let showMessage = responseOptions && responseOptions.showMessage;
      if (showMessage === undefined) {
        showMessage = true;
      }

      console.log({ responseData, responseOptions, showMessage, message });

      if (showMessage) {
        messageStore.showMessage(message, 1500);
      }
    }

    if (code !== 0) {
      return Promise.reject(responseData);
    } else {
      return responseData;
    }
  },
  (err) => {
    const messageStore = useMessageStore();
    messageStore.showMessage(err.data.message, 1500);
    uni.hideLoading();

    return err.data;
  }
);

// 设置默认配置
Request.setConfig((config: any) => {
  config.baseURL = env.baseApi;
  config.header = {
    // "Authorization": getToken(),
    hrCode: encryptDes(getSysCode(),'hrtest22'),
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
      if (!deepEqual(localVersion, newVersion)) {
        //清除首页配置缓存
        setLocalStorage({
          systemConfigVersion: newVersion,
        });
        uni.removeStorageSync('systemConfig');
      }
    }
  } catch {}
};
function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let index = 0; index < keys1.length; index++) {
    const val1 = object1[keys1[index]];
    const val2 = object2[keys2[index]];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      console.log(2222, index, val1);

      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === 'object';
}

export default Request;
