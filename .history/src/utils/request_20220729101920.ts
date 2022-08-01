import env from '@/config/env'

export default class Request {
  // 默认配置
  config = {
    baseUrl: '',
    header: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success() { },
    fail() { },
    complete() { }
  }

  // http(param) {
  //   // 请求参数
  //   var url = param.url,
  //     method = param.method,
  //     header = {},
  //     data = param.data || {},
  //     token = param.token || "",
  //     hideLoading = param.hideLoading || false;

  //   //拼接完整请求地址
  //   var requestUrl = env.baseApi + url;

  //   //请求方式:GET或POST(POST需配置
  //   // header: {'content-type' : "application/x-www-form-urlencoded"},)
  //   if (method) {
  //     method = method.toUpperCase(); //小写改为大写
  //     if (method == "POST") {
  //       header = {
  //         'content-type': "application/x-www-form-urlencoded"
  //       };
  //     } else {
  //       header = {
  //         'content-type': "application/json"
  //       };
  //     }
  //   }

  //   //加载圈
  //   if (!hideLoading) {
  //     uni.showLoading({
  //       title: '加载中...'
  //     });
  //   }

  //   // 返回promise
  //   return new Promise((resolve, reject) => {
  //     // 请求
  //     uni.request({
  //       url: requestUrl,
  //       data: data,
  //       method: method,
  //       header: header,
  //       success: (res) => {
  //         // code判断:200成功,不等于200错误
  //         if (res.data.code) {
  //           if (res.data.code != '200') {
  //             uni.showToast({
  //               title: "" + res.data.msg,
  //               icon: 'none'
  //             });
  //             return;
  //           }
  //         } else {
  //           uni.showToast({
  //             title: "code!=200" + res.data.msg,
  //             icon: 'none'
  //           });
  //           return;
  //         }
  //         // 将结果抛出
  //         resolve(res.data)
  //       },
  //       //请求失败
  //       fail: (e) => {
  //         uni.showToast({
  //           title: "" + e.data.msg,
  //           icon: 'none'
  //         });
  //         resolve(e.data);
  //       },
  //       //请求完成
  //       complete() {
  //         //隐藏加载
  //         if (!hideLoading) {
  //           uni.hideLoading();
  //         }
  //         resolve();
  //         return;
  //       }
  //     })
  //   })
  // }
}