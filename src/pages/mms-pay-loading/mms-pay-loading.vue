<template>
  <view class="page">
    <view>
      <icon type="waiting" size="60" />
      <button @tap="tap">去支付</button>
      <text>正在处理，请稍后</text>
    </view>

    <text class="note">本页面的滞留时长，取决于当前业务指令的处理速度</text></view
  >
</template>
<script>
export default {
  data() {
    return { };
  },
  onLoad(options) {
    console.log("跳转来了", options); 
  },
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
<style lang="scss" scoped>
.page {
  view {
    position: fixed;
    top: 20%;
    left: 50%;
    text-align: center;
    transform: translate(-50%, -50%);
  }

  view text {
    display: block;
    margin-top: 10px;
  }

  .title {
    display: block;
    padding: 10px;
    text-align: center;
    font-weight: bold;
  }

  .note {
    display: block;
    position: fixed;
    left: 0;
    top: 40%;
    padding: 0 30px;
    width: 100%;
    color: #999999;
    font-weight: lighter;
    line-height: 1.5em;
    text-align: center;
    word-wrap: break-word;
    word-break: break-all;
    box-sizing: border-box;
  }
}
</style>
