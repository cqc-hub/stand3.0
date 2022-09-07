import requestClass from './request';
import env from '@/config/env';
import {
  encryptDes,
  getSysCode,
  getToken,
  showLoading,
  hideLoading
} from '@/common';
import { IRequest, IResponseWrapper } from './type';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';
import { LoginUtils } from '@/utils';

const Request = new requestClass();
// 请求拦截器
Request.interceptors.request((request: IRequest) => {
  //loading 默认有

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
    const responseData = response.res.data;
    const responseOptions = response.options;
    const messageStore = useMessageStore();
    //判断返回状态 执行相应操作
    hideLoading();

    const { code, message } = responseData;
    // 请根据后端规定的状态码判定
    console.log(responseData);

    if (code === 4000) {
      //  需要重新登录4000  0 成功
      messageStore.showMessage(message, 0, {
        maskClickCallBack: () => {
          console.log('过期了');
          uni.redirectTo({
            url: '/pages/home/my?_p=1&_isOutLogin=1'
          });
          //清除缓存？
          new LoginUtils().outLogin({
            isHideMessage: true,
            isGoLoginPage: true
          });
        }
      });
    } else if (code !== 0) {
      messageStore.showMessage(message);
    }


    if (code !== 0) {
      return Promise.reject(responseData);
      // return responseData;
    } else {

      return responseData;
    }
  },
  (err) => {
    const messageStore = useMessageStore();
    messageStore.showMessage(err.data.message);
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
    phsSign: encryptDes(
      getSysCode() + '_' + new Date().getTime(),
      'W7ZEgfnv'
    )
  };
  //判断是否携带token校验
  if (config.token) {
    config.header['Authorization'] = getToken();
  }

  return config;
});

export default Request;
