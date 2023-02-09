<template>
  <view class="item">
    <view class="left">
      <template v-if="data.reportType">
        <view
          class="item-icon"
          :class="{
            itemiconOutpatient: data.reportType == 1,
            itemiconEmergency: data.reportType == 2,
            itemiconCheckup: data.reportType == 3,
            itemiconHospitalization: data.reportType == 4,
            itemiconOutpatientEmergency: data.reportType == 5,
          }"
        >
          {{
            data.reportType == 1
              ? "门诊"
              : data.reportType == 2
              ? "急诊"
              : data.reportType == 3
              ? "体检"
              : data.reportType == 4
              ? "住院"
              : "门急诊"
          }}
        </view>
      </template>
      <template v-else>
        <text v-if="props.type == 'jy'" class="icon-font ico_sy_test-tube"></text>
        <text
          v-if="props.type == 'jc'"
          class="icon-font ico_sy_physicalexamination3"
        ></text>
        <text
          v-if="props.type == 'tj'"
          class="icon-font ico_sy_physicalexamination1"
        ></text>
      </template>
      <view class="item-title">{{ data.repName }}</view>
    </view>
    <view class="right">
      <!-- <view class="iconerror-circle" :class="`iconfont`">&#xe6d6;</view> -->
      <view class="icon-resize" :class="`iconfont`">&#xe66b;</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  type: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss" scoped>
.item {
  background-color: #fff;
  width: calc(100% - 32rpx);
  box-sizing: border-box;
  min-height: 104rpx;
  border-radius: 16rpx;
  margin-left: 31rpx;
  margin-top: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    display: flex;
    align-items: center;
    margin-left: 24rpx;
    .icon-font {
      width: 36rpx;
      height: 36rpx;
    }
    .item-icon {
      white-space: nowrap;
      width: auto;
      height: 36rpx;
      border-radius: 8rpx;
      font-size: var(--hr-font-size-xxxs);
      line-height: 36rpx;
      text-align: center;
      padding: 0 12rpx;
    }
    .item-title {
      margin-left: 8rpx;
      width: calc(100% - 24rpx);
      white-space: normal;
      word-break: break-all;
      font-size: var(--hr-font-size-base);
      font-weight: 600;
      margin-right: 24rpx;
      padding: 28rpx 0;
    }
    //住院
    .itemiconHospitalization {
      background-color: #e9f0ff;
      color: #296fff;
    }
    //门诊
    .itemiconOutpatient {
      background-color: #f1ecff;
      color: #7747ff;
    }
    //急诊
    .itemiconEmergency {
      background-color: #ffeee8;
      color: #ff5040;
    }
    //体检
    .itemiconCheckup {
      background-color: #e7fff8;
      color: #00b39e;
    }
    //门急诊
    .itemiconOutpatientEmergency {
      background-color: #fff3e0;
      color: #ff8a00;
    }
  }

  .right {
    margin-right: 24rpx;
    .iconerror-circle {
      font-size: var(--hr-font-size-xl);
      color: red;
    }
    .icon-resize {
      font-size: var(--hr-font-size-xl);
    }
  }
}
</style>
