import requestClass from './request';
import env from '@/config/env';
import {
  encryptDes,
  getSysCode,
  getToken,
  showLoading,
  hideLoading,
} from '@/common';
import { IRequest, IResponseWrapper } from './type';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';
import { LoginUtils } from '@/utils';
import { beforeEach } from '@/router';
import { joinQuery } from '@/common';

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

    const { code, message } = responseData;
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

          // console.log('过期了');
          // uni.redirectTo({
          //   url: '/pages/home/my?_p=1&_isOutLogin=1'
          // });
          //清除缓存？
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
    hrCode: getSysCode(),
    phsId: '81681688',
    phsSign: encryptDes(getSysCode() + '_' + new Date().getTime(), 'W7ZEgfnv'),
  };
  //判断是否携带token校验
  if (config.token) {
    config.header['Authorization'] = getToken();
  }

  return config;
});

export default Request;
