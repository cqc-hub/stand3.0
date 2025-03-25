<template>
  <view class="page">
    <view @click="tap">去支付</view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad(options) {
    console.log("跳转来了", options);
  },
  onShow() {},
  methods: {
    tap() {
      const options = getCurrentPages()[getCurrentPages().length - 1].options;
      // 获取当前页面的对象
      const paramsStr = options.payParams || {};
      const params = JSON.parse(paramsStr);
      wx.navigateToMiniProgram({
        appId: params.pay_appid,
        path: decodeURIComponent(params.pay_url),
        success(res) {
          // 打开成功
          console.log("navigateToMiniProgram success:", res);
        },
        fail(error) {
          console.log("navigateToMiniProgram fail:", error);
        },
        complete(res) {
          console.log("navigateToMiniProgram complete:", res);
        },
      });
    },
  },
};
</script>
