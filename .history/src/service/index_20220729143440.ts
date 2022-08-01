import requestClass from './request'
import env from '@/config/env'

const Request = new requestClass()

// 请求拦截器
Request.interceptors.request((request: any) => {
  //loading
  uni.showLoading({
    title: '加载中...'
  })

  request.header = {
    'content-type': request.header.contentType ? 'application/json' : 'application/x-www-form-urlencoded',
    // "Authorization": getToken(),
    // phsId: '81681688',
    // phsSign: encryptDes(getSysCode()+'_'+new Date().getTime(),'W7ZEgfnv')
  }
  if (request.method === 'GET') {
    request.data = JSON.stringify(request.data)
    request.url = request.url + '?' + request.data
  }
  return request
})

// 响应拦截器
Request.interceptors.response((response: any) => {
  // const token = uni.getStorageSync('token')
  // if (response.data.code === 403) {
  //   uni.showToast({
  //     title: token ? '请重新登录' : '请先登录',
  //     icon: 'none',
  //     duration: 2000,
  //   })
  //   uni.removeStorageSync('token')
  //   uni.removeStorageSync('userInfo')
  // }
  return response
})

// 设置默认配置
Request.setConfig((config: any) => {
  config.baseURL = env.baseApi
  if (uni.getStorageSync('token')) {
    config.header['Authorization'] = 'Bearer ' + uni.getStorageSync('token')
  }
  return config
})

export default Request