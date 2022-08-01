import requestClass from './request'
import env from '@/config/env'
import { encryptDes } from '@/utils'

const Request = new requestClass()

// 请求拦截器
Request.interceptors.request((request: any) => {
  //loading
  uni.showLoading({
    title: '加载中...'
  })
  if (request.method === 'GET') {
    request.data = JSON.stringify(request.data)
    request.url = request.url + '?' + request.data
  }
  return request
})

// 响应拦截器
Request.interceptors.response((response: any) => {
  //判断返回状态 执行相应操作
  uni.hideLoading()
  // 请根据后端规定的状态码判定
  if (response.data.code === 401) {//token失效
    // return response.data = await doRequest(response, url)//动态刷新token,并重新完成request请求
  } else {
    console.log('************************');
    const res = response.data;
    console.log(response);
    if (res.code !== 200 && res.msg) {
      uni.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1500
      })
    } else if (res.code != '0') {
      uni.showToast({
        title: res.message,
        icon: 'none',
        duration: 1500
      })

      if (['4001'].includes(res.code)) {
        setTimeout(() => {
          // wx.miniProgram.redirectTo({
          // 	url: '/pages/home/my'
          // })
        }, 1800)
      }

      return Promise.reject({
        success: false,
        data: res
      })
    }
  }

  return response.data;
})

// 设置默认配置
Request.setConfig((config: any) => {
  config.header = {
    // 'content-type': request.header.contentType ? 'application/json' : 'application/x-www-form-urlencoded',
    // "Authorization": getToken(),
    phsId: '81681688',
    phsSign: encryptDes(getSysCode() + '_' + new Date().getTime(), 'W7ZEgfnv')
  }

  if (uni.getStorageSync('token')) {
    config.header['Authorization'] = 'Bearer ' + uni.getStorageSync('token')
  }

  return config
})

export default Request