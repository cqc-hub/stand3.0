<template>
  <view class="box">
    <view class="title">预交费用</view>
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
import { onLoad } from "@dcloudio/uni-app";

import api from "@/service/api";
import { GStores, ServerStaticData, wait } from "@/utils";
import { payMoneyOnline, toPayPull } from "@/components/g-pay/index";
import { deQueryForUrl } from '@/common/utils';

import { hosParam } from "@/components/g-form";
import { payOrderResult } from "./utils/inpatientInfo";

type IPageProps = {
  hosId: string;
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
const payOrderParam = ref({
  fee: "",
  orderType: "3",
  patientId: gStores.userStore.patChoose.patientId,
});
const payOrder = ref<payOrderResult>({} as payOrderResult);
const pageProps = ref({} as IPageProps);

const checkMoney = (item) => {
  defalutMoney.value = String(item);
};
const toPay = async () => {
  payOrderParam.value.fee = defalutMoney.value;
  await int();
  const res = await payMoneyOnline({
    phsOrderNo: payOrder.value.phsOrderNo,
    paySign: payOrder.value.paySign,
    patientId: gStores.userStore.patChoose.patientId,
    totalFee: payOrderParam.value.fee,
    phsOrderSource: "3",
    hosId: pageProps.value.hosId,
    source: gStores.globalStore.browser.source,
  });

  await toPayPull(res);
  payAfter();
};
const payAfter = async () => {
  uni.showLoading({});
  await wait(1000);
  uni.hideLoading();

  // uni.reLaunch({
  //   url: "/pagesA/hospitalCare/choosePatient",
  // });

  uni.navigateBack({
    delta: 1
  })
};
const setData = async () => {
  const result = await ServerStaticData.getSystemConfig('hospitalCare');
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

onLoad((opt) => {
  pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(opt));
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
  }
}
</style>
