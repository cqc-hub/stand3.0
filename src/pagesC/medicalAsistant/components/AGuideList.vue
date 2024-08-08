<template>
  <view class="flex-normal">
    <view class="flex-normal">
      <view
        v-for="(item, idx) in list"
        :key="item.label"
        @click="itemClick(item, idx)"
        class="item g-border text-no-wrap color-444 f28 active"
      >
        <view class="label">{{ item.label }}</view>
      </view>
    </view>
    <view class="safe-width">2</view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },

    value: {
      type: String,
      default: "",
    },

    disposeTime: {
      type: String,
      default: "",
    },
  },

  methods: {
    itemClick({ code, hosId }, idx) {
      const subOrgCode = "SUB_ORG9051101";
      // #ifdef MP-WEIXIN
      if (hosId == "03") {
        //越城院区
        let path =
          "?buildId=0C3V01&url=" +
          encodeURIComponent(`https://his.ipalmap.com/navigation/dist/index.html#/map?appsId=10259&deptId=${code}`);
        uni.navigateToMiniProgram({
          appId: "wx83884e3a215b20f4",
          path: "pages/map/mapView" + path,
        });
      } else {
        wx.navigateToMiniProgram({
          appId: "wx0aeb52a97a73acc3",
          path: `/subPackages/hospital/pages/classification/index?subOrgCode=${subOrgCode}&type=${code}`,
        });
      }
      // #endif

      // #ifdef MP-ALIPAY
      my.navigateToMiniProgram({
        appId: "2021003142699208",
        path: "pages/classification/index",
        query: {
          subOrgCode,
          type:code,
        },
      });
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  padding: 0 10rpx;
  margin-bottom: 1rpx;

  border-radius: 50px 50px 50px 50px;
  margin-right: 16rpx;

  .label {
    text-align: left;
    font-weight: normal;
  }

  &.active {
    border-color: var(--hr-brand-color-6) !important;
    color: var(--hr-brand-color-6) !important;
  }
}

.safe-width {
  width: 200rpx;
  height: 1px;
  display: inline-block;
  opacity: 0;
}
</style>
