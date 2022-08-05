import global from '@/config/global';
import globalData from '@/config/globalData';
// import store from '@/store'
export default {
  //清除缓存
  clearData() {
    uni.clearStorageSync();
    uni.clearStorage();
    // store.dispatch('bussiness/resetData');
    uni.setStorageSync('sysCode', global.SYS_CODE)
  },
  // 获取新的token
  setVersions() {
    //解决第一次加载页面data方法获取不到storage的问题
    // if (!uni.getStorageSync('GD') || uni.getStorageSync('TIMESTAMP') != global.TIMESTAMP) {
    //   let gParams = globalData.paramsBySysCode.find(item => item.sysCode == global.SYS_CODE)
    //   uni.setStorageSync('GD', gParams.params) //全局配置参数
    //   uni.setStorageSync('TIMESTAMP', global.TIMESTAMP) //时间戳
    // }
  },
  setState() {
    //判断来源
    //source(PHS)：1.IOS，2.安卓，3.微网站（公众号），4.服务窗（生活号） 5.web（PC）6.湖南乐众7 趣医网 8 就医160  9 健康之路 10 凯歌 20其他(附属同步)，19-微信小程序  21-支付宝小程序
    //accountType: 1-微信公众号，11-微信小程序，2-支付宝生活号，22-支付宝小程序 3-银联账号，4-中行账号
    //payType: 支付渠道判断 ALI_WAP-支付宝支付 WX_JSAPI-微信支付 CCB_JSAPI建行支付
    if (!uni.getStorageSync('browser') || uni.getStorageSync('TIMESTAMP') != global.TIMESTAMP) {
      // #ifdef H5
      var browser = navigator.userAgent.toLowerCase();
      if (browser.match(/Alipay/i) == "alipay") {
        console.log("支付宝app的浏览器");
        uni.setStorageSync('browser', {
          source: 4,
          accountType: 2,
          payType: 'ALI_WAP'
        })
      } else if (browser.match(/MicroMessenger/i) == "micromessenger") {
        console.log("微信app的浏览器");
        uni.setStorageSync('browser', {
          source: 3,
          accountType: 1,
          payType: 'WX_JSAPI'
        })
      } else {
        console.log("其它浏览器");
        uni.setStorageSync('browser', {
          source: 25,
          accountType: 1,
          payType: ''
        })
      }
      // #endif
      // #ifdef MP-WEIXIN
      uni.setStorageSync('browser', {
        source: 19,
        accountType: 11
      })
      // #endif
      // #ifdef MP-ALIPAY
      uni.setStorageSync('browser', {
        source: 21,
        accountType: 22
      })
      // #endif
    }

    // if (!uni.getStorageSync('GD') || uni.getStorageSync('TIMESTAMP') != global.TIMESTAMP) {
    //   let gParams = globalData.paramsBySysCode.find(item => item.sysCode == global.SYS_CODE)
    //   uni.setStorageSync('GD', gParams.params) //全局配置参数
    //   uni.setStorageSync('TIMESTAMP', global.TIMESTAMP) //时间戳
    // }
  },
};
