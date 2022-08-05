import requestClass from './request'
import env from '@/config/env'
import { encryptDes, getSysCode, getToken, showLoading, hideLoading } from '@/utils'
import { IRequest, IResponseWrapper } from './type'

const Request = new requestClass()
// 请求拦截器
Request.interceptors.request((request: IRequest) => {
  //loading 默认有

  if (!request.hideLoading)
    showLoading()
  // if (request.method === 'GET') {
  //   request.data = JSON.stringify(request.data)
  //   request.url = request.url + '?' + request.data
  // }
  return request
})

// 响应拦截器
Request.interceptors.response((response: IResponseWrapper) => {
  const responseData = response.res.data;
  const responseOptions = response.options;
  //判断返回状态 执行相应操作
  hideLoading()
  // 请根据后端规定的状态码判定
  if (responseData.code === 401) {//token失效
    // return responseData = await doRequest(response, url)//动态刷新token,并重新完成request请求
  } else {
    console.log(response);
    //判断是否成功响应 code:200 成功 401:token失效 4001 需要重新登录
    console.log(3333, responseOptions);
    if (responseData.code !== 200 && responseData.message) {
      if (responseOptions && !responseOptions.hideMessage) {
        uni.showToast({
          title: responseData.message,
          icon: 'none',
          duration: 1500
        })
      }
      //判断token
      if ([4001].includes(responseData.code)) {
        setTimeout(() => {
          uni.redirectTo({
            url: '/pages/home/my'
          })
        }, 1800)
      }

    }
    // else if (res.code != '0') {
    // uni.showToast({
    //   title: res.message,
    //   icon: 'none',
    //   duration: 1500
    // })

    // return Promise.reject({
    //   success: false,
    //   data: res
    // })
    // }
  }

  console.log(222, response)
  return responseData;
}, (err) => {
  uni.showToast({
    title: err.data.message,
    icon: 'none',
    duration: 1500
  })
  return err.data
})

// 设置默认配置
Request.setConfig((config: any) => {
  config.baseURL = env.baseApi;
  config.header = {
    // "Authorization": getToken(),
    phsId: '81681688',
    phsSign: encryptDes(getSysCode() + '_' + new Date().getTime(), 'W7ZEgfnv')
  }
  //判断是否携带token校验
  if (config.token) {
    config.header['Authorization'] = getToken()
  }

  return config
})

export default Request