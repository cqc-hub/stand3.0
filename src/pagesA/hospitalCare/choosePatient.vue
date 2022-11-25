<template>
  <!-- 选择就诊人 不绑定就诊人模式 -->
  <view class="page">
    <view class="title">请查询就诊人</view>
    <view class="inputs">
      <view class="input-item border">
        <text>就诊人姓名</text>
        <input class="uni-input" placeholder-style="font-size:32rpx;color:#bbb" v-model="hosInfoParam.patientName" placeholder="请输入" />
      </view>
      <view class="input-item">
        <text>手机号码</text>
        <input class="uni-input" placeholder-style="font-size:32rpx;color:#bbb" type="number" v-model="hosInfoParam.patientPhone" placeholder="请输入" />
      </view>

    </view>
    <button :disabled="hosInfoParam.patientName==''?true:false"
            :class="hosInfoParam.patientName!=''||hosInfoParam.patientPhone!=''?'activeSubmitBtn':'submitBtn'" @click="toSearch">查询
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAvatar, isAreaProgram } from '@/stores';
import { GStores } from '@/utils';
import api from '@/service/api';
import { getInHospitalInfoResult } from './utils/inpatientInfo';
import { onLoad } from '@dcloudio/uni-app';
const hosInfoParam = ref({
  cardNumber: '',
  hosId: '1279',
  idCard: '',
  patientId: '10763642',
  // patientId: gStores.userStore.patChoose.patientId,
  patientName: '',
  patientPhone: '',
  phoneNumber: '',
});
const hosInfoResObj = ref<getInHospitalInfoResult>(
  {} as getInHospitalInfoResult
);
const toSearch = () => {
  uni.navigateTo({
    url: `choosePatientInfo`,
  });
};

const init = async () => {
  const { result } = await api.getInHospitalInfo<getInHospitalInfoResult>({
    hosId: hosInfoParam.value.hosId,
    patientId: hosInfoParam.value.patientId,
  });
  hosInfoResObj.value = result;
};
onLoad(() => {
  init();
});
</script>

<style scoped lang="scss">
.page {
  padding: 80rpx 32rpx 0;
  .title {
    font-size: 48rpx;
    color: #111;
    font-weight: 600;
    margin-bottom: 80rpx;
  }
  .inputs {
    height: 208rpx;
    background-color: #fff;
    border-radius: 16rpx;
    .input-item {
      display: flex;
      align-items: center;
      height: 50%;
      margin: 0 32rpx;
      &.border {
        border-bottom: 2rpx solid #f3f3f3;
      }
      text {
        padding-right: 32rpx;
        color: #666666;
        font-size: 32rpx;
      }
    }
    .uni-input {
    }
  }
  .submitBtn {
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #9ebeff;
    color: #fff;
    text-align: center;
    line-height: 96rpx;
    margin-top: 120rpx;
    font-size: 36rpx;
  }
  .activeSubmitBtn {
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #296fff;
    color: #fff;
    text-align: center;
    line-height: 96rpx;
    margin-top: 120rpx;
    font-size: 36rpx;
  }
}
</style>