<template>
  <view class="g-page">
    <g-flag typeFg="1009" isShowFg />
    <!-- <g-choose-pat @choose-pat="getListData" /> -->

    <view class="top p32 f28">
      <view class="row flex-start mb8">
        <text class="row-t mr16 color-888">执行医院</text>
        <text>{{ hosName }}</text></view
      >
      <!-- <view class="row flex-start">
        <text class="row-t mr16 color-888">就诊人</text>
        <text>张三{{}}</text
      ></view> -->
    </view>
    <view class="container ml32">
      <view class="content mt16" v-if="isComplete && lists?.length">
        <Confirm-List :list="lists" />
        <view class="bottom"> </view>
      </view>
      <view class="empty-list" v-else-if="isComplete">
        <g-empty :current="1" />
      </view>
      <g-message />
    </view>

    <!-- 底部按钮 -->
    <view class="footer">
      <view class="amount">
        <text class="f28 color-444 mr8">合计</text>
        <text class="money f36 color-error g-bold">{{ totalMoney }}元</text></view
      >
      <button class="btn g-bord btn-primary f36" @click="confirm">
        <text>缴费</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import api from "@/service/api";
import { ref } from "vue";
import { onLoad, onPullDownRefresh } from "@dcloudio/uni-app";
import { GStores, debounce, wait,getTimeStamp } from "@/utils";
import { type IConfirmList } from './utils/index';
import { payMoneyOnline, toPayPull } from "@/components/g-pay/index";
import ConfirmList from "./components/confirmList.vue";
const gStores = new GStores();
const isComplete = ref(true);

const props = defineProps<{
  lists: string;
  totalNum?: string | number;
  totalMoney?: string | number;
  hosId: string;
  hosName: string;
}>();

const lists = ref<IConfirmList[]>(JSON.parse(props.lists) || []);

const confirm = async () => {
  const { patientId, patientName, cardNumber } = gStores.userStore.patChoose;
  const source = gStores.globalStore.browser.source;
  const BillingItem = lists.value.map(element => {
    const { billingType, fee, itemName } = element;
    return {
      billingType,
      fee,
      itemName,
      itemCode: element.itemId
    }
  });
  const reBillingUrl = `/pagesC/convenienceService/convenienceService?hosId=${props.hosId}`;
  const res1 = await api.createBillingOrder({
    hosId: props.hosId,
    patientId: patientId,
    items: BillingItem,
    totalCost: props.totalMoney,
    source: source,
    reBillingUrl: reBillingUrl,//再次开单路径
  });
  const data = {
    businessType: "",
    hosId: props.hosId,
    patientId: patientId,
    phsOrderNo: res1.result.phsOrderNo,
    phsOrderSource: 11,
    totalFee: props.totalMoney,
    patientName,
    cardNumber,
  };
  const res = await payMoneyOnline(data);
  await toPayPull(res);
  payAfter(patientId);
};

const payAfter = async (patientId) => {
  uni.showLoading({});
  await wait(1000);
  uni.hideLoading();
  //去我的开单页面
  uni.reLaunch({
    url:`/pagesC/cloudHospital/myPath?path=/pagesC/selfService/myOrder&_pd=${patientId}&_pt=${getTimeStamp(6)}&convenienceService=true`,
  });
};
</script>
<style lang="scss" scoped>
.top {
  background: var(--h-color-white);
  .row-t {
    min-width: 112rpx;
  }
}
.container {
  flex: 1;
  width: calc(100% - 64rpx);
}
.footer {
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  background-color: var(--h-color-white);
  border-top: 1rpx solid var(--hr-neutral-color-2);
  .amount {
    margin: 24rpx 32rpx 68rpx 32rpx;
  }
  .btn {
    background-color: var(--hr-warning-color-6);
    width: 40%;
    margin: 24rpx 32rpx 68rpx 32rpx;
  }
}
.icon-2 {
  color: #fff;
  font-size: var(--h-iconfont-64);
}
.bottom {
  height: 200rpx;
}
</style>
