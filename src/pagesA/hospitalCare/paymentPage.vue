<template>
  <view class="box">
    <view class="title">{{ pageProps.hospitalAccount ? "充值金额" : "预交费用" }}</view>
    <view class="buttons">
      <view
        :class="list[index] == defalutMoney ? 'activeButton' : 'button'"
        v-for="(item, index) in list"
        :key="index"
        @click="checkMoney(item)"
      >
        ¥{{ item }}</view
      >
    </view>
    <view class="pay-input">
      <view class="g-border-left util-content mb8">
        <text v-if="moneyUtil" class="g-split-line mr8"></text>
        <text v-if="moneyUtil">{{ moneyUtil }}</text>
      </view>

      <view class="flex-normal">
        <text class="m-util">¥</text>
        <input
          class="uni-input"
          maxlength="13"
          placeholder-style="font-size:32rpx;color:#888"
          type="number"
          v-model="defalutMoney"
          placeholder="输入自定义金额"
        />
      </view>
    </view>
    <button
      :disabled="defalutMoney == '' ? true : false"
      :class="defalutMoney == '' ? 'submitBtn' : 'activeSubmitBtn'"
      @click="toPay"
    >
      确定
    </button>
    <g-message />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onLoad, onReady } from "@dcloudio/uni-app";

import api from "@/service/api";
import { GStores, ServerStaticData, wait } from "@/utils";
import { payMoneyOnline, toPayPull } from "@/components/g-pay/index";
import { deQueryForUrl } from "@/common/utils";
import { hosParam } from "@/components/g-form";
import { payOrderResult } from "./utils/inpatientInfo";

type IPageProps = {
  hosId: string;
  patientName?: string; //扫码的时候传 支付用
  cardNumber?: string;
  hospitalAccount?: string;
  params?: string; //有值代表扫码来的
};
const gStores = new GStores();
const resultHos = ref<hosParam>({
  inPatientPrePay: "",
  isHosDaylist: "",
  isHosTotallist: "",
  tab: [],
});

const list = ref([]);
const defalutMoney = ref("");

const payOrder = ref<payOrderResult>({} as payOrderResult);
const pageProps = ref({} as IPageProps);
const checkMoney = (item) => {
  defalutMoney.value = String(item);
};
const toPay = async () => {
  await int();
  const res = await payMoneyOnline({
    phsOrderNo: payOrder.value.phsOrderNo,
    paySign: payOrder.value.paySign,
    totalFee: defalutMoney.value,
    phsOrderSource: pageProps.value.hospitalAccount
      ? pageProps.value.hospitalAccount
      : "3",
    source: gStores.globalStore.browser.source,
    ...pageProps.value,
  });

  await toPayPull(res, "住院缴费");
  payAfter();
};
const payAfter = async () => {
  uni.showLoading({});
  await wait(1000);
  uni.hideLoading(); 

  uni.navigateBack({
    delta: 1,
  });
};
const setData = async () => {
  const result = await ServerStaticData.getSystemConfig("hospitalCare");
  resultHos.value = result;
  list.value = JSON.parse(resultHos.value.inPatientPrePay);
};
const int = async () => {
  const { result } = await api.createInHospitalPayOrder<payOrderResult>({
    fee: defalutMoney.value,
    orderType: pageProps.value.hospitalAccount ? pageProps.value.hospitalAccount : "3",
    patientId: pageProps.value.params ? "" : gStores.userStore.patChoose.patientId,
    patientName: pageProps.value.patientName,
    cardNumber: pageProps.value.cardNumber,
  });
  payOrder.value = result;
};

const moneyUtil = computed(() => {
  return transformUnit(((defalutMoney.value as unknown) as number) * 1);
});

const transformUnit = (val: number) => {
  if (val) {
    const unitList = [
      "",
      "千",
      "万",
      "十万",
      "百万",
      "千万",
      "亿",
      "十亿",
      "百亿",
      "千亿",
      "兆",
    ];
    const v = (Math.floor(val / 1000) * 10).toString().length - 1;

    return unitList.length > v ? unitList[v] : "兆";
  } else {
    return "";
  }
};
onReady(() => {
  if (pageProps.value.hospitalAccount) {
    uni.setNavigationBarTitle({
      title: "充值",
    });
  }
});
onLoad((opt) => {
  pageProps.value = deQueryForUrl(opt);
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
    height: 144rpx;
    background-color: #f6f6f6;
    border-radius: 16rpx;
    .m-util {
      padding: 0 32rpx;
      font-weight: 600;
    }

    .util-content {
      // height: 64rpx;
      width: 100%;
      margin-left: 88rpx;
      &::after {
        content: "强";
        opacity: 0;
      }
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
    background: #f6f6f6;
  }
}
</style>
