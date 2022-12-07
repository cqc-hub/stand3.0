<template>
  <view class="box">
    <view class="title">预交费用</view>
    <view class="buttons">
      <view :class="list[index]==defalutMoney?'activeButton':'button'" v-for="(item,index) in list" :key="index" @click="checkMoney(item)">
        ¥{{item}}</view>
    </view>
    <view class="pay-input">
      <text>¥</text>
      <input class="uni-input" placeholder-style="font-size:32rpx;color:#888" type="number" v-model="defalutMoney" placeholder="输入自定义金额" />
    </view>
    <button :disabled="defalutMoney==''?true:false" :class="defalutMoney==''?'submitBtn':'activeSubmitBtn'" @click="toPay">确定</button>
    <g-message />
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { GStores, ServerStaticData } from '@/utils';
import { hosParam } from '@/components/g-form';
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
import api from '@/service/api';
import { payOrderResult,payParam } from './utils/inpatientInfo';
import {
    type IGPay,
    payMoneyOnline,
    toPayPull,
  } from '@/components/g-pay/index';
  import { wait } from '@/utils';
const gStores = new GStores();
const resultHos = ref<hosParam>({
  inPatientPrePay: '',
  isHosDaylist: '',
  isHosTotallist: '',
  tab: [],
});

const list = ref([]);
const defalutMoney = ref('');
const payOrderParam = ref({
  fee: '',
  orderType: '3',
   patientId: gStores.userStore.patChoose.patientId,
});
const payOrder = ref<payOrderResult>({} as payOrderResult);
const checkMoney = (item) => {
  defalutMoney.value = String(item);
};
const toPay =async () => {
  payOrderParam.value.fee = defalutMoney.value;
 await int();
const res = await payMoneyOnline({
        phsOrderNo:  payOrder.value.phsOrderNo,
       patientId:gStores.userStore.patChoose.patientId,
     //  patientId:'10763642',
      totalFee:payOrderParam.value.fee,
      phsOrderSource: '3',
      hosId:'1279',
      source: gStores.globalStore.browser.source,
    });

    await toPayPull(res);
     payAfter();

};
const payAfter = async () => {
    uni.showLoading({});
    await wait(1000);
    uni.hideLoading();

    uni.reLaunch({
      url: '/pagesA/hospitalCare/hospitalCare',
    });
  };
const setData = async () => {
  const result = await ServerStaticData.getSystemHospital();
  resultHos.value = result;
  list.value = JSON.parse(resultHos.value.inPatientPrePay);
};
const int = async () => {
  const { result } = await api.createInHospitalPayOrder<payOrderResult>({
    fee: payOrderParam.value.fee,
    orderType: payOrderParam.value.orderType,
    patientId: payOrderParam.value.patientId,
  });
  payOrder.value = result;
};
onLoad(() => {
  setData();
});
</script>

<style scoped lang="scss">
.box {
  background-color: #fff;
  // width: 100%;
  height: 100%;
  padding: 40rpx 32rpx 0;
  .title {
    color: #444;
    margin-bottom: 40rpx;
  }
  .buttons {
    display: flex;
    flex-wrap: wrap;
    :first-child {
      margin-right: 18rpx;
    }
    :nth-child(3) {
      margin-right: 18rpx;
    }
    :nth-child(5) {
      margin-right: 18rpx;
    }
    .button {
      width: 48%;
      height: 112rpx;
      border: 1px solid #e9f0ff;
      background-color: #e9f0ff;
      color: #444;
      font-weight: 600;
      border-radius: 16rpx;
      text-align: center;
      line-height: 112rpx;
      margin-bottom: 16rpx;
    }
    .activeButton {
      width: 48%;
      height: 112rpx;
      border: 1px solid #e9f0ff;
      background-color: #296fff;
      color: #fff;
      font-weight: 600;
      border-radius: 16rpx;
      text-align: center;
      line-height: 112rpx;
      margin-bottom: 16rpx;
    }
  }
  .pay-input {
    display: flex;
    align-items: center;
    height: 144rpx;
    background-color: #f6f6f6;
    border-radius: 16rpx;
    text {
      padding: 0 32rpx;
      font-weight: 600;
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
  .uni-input {
    font-weight: 600;
    font-size: 56rpx;
  }
}
</style>
