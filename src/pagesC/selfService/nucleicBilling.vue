<template>
  <view class="g-page">
    <g-flag typeFg="801" isShowFg />
    <g-choose-pat />
    <scroll-view
      v-if="pageLoading && NucleResult && NucleResult.length > 0"
      class="g-container box"
      scroll-y
    >
      <view
        class="box-tips box-card"
        v-if="NucleResult[0].itemTime || NucleResult[0].itemAddress"
      >
        <view>
          <label>检测时间</label>
          <label>{{ NucleResult[0].itemTime }}</label>
        </view>
        <view>
          <label>检测地点</label>
          <label>{{ NucleResult[0].itemAddress }}</label>
        </view>
      </view>
      <!-- <view class="box-date box-card">
        <label>检测日期</label>
        <label>2022-10-27</label>
        <text :class="`iconfont icon-resize`">&#xe66b;</text>
      </view> -->
      <view class="box-list box-card">
        <view
          v-for="(item, i) in NucleResult"
          :key="i"
          @tap="clickItem(i)"
          :class="{ active: currentIndex == i }"
        >
          <label>{{ item.itemName }}</label>
          <label>{{ item.fee }}元</label>
          <block v-if="currentIndex == i">
            <text class="iconfont ico-checkbox">&#xe6d0;</text>
          </block>
          <block v-else>
            <text class="iconfont">&#xe6ce;</text>
          </block>
        </view>
      </view>
      <g-flag typeFg="45" isShowFgTip />
    </scroll-view>
    <view class="g-footer" v-if="pageLoading && NucleResult && NucleResult.length > 0">
      <button class="btn btn-primary" @click="submit">确定开单</button>
    </view>
    <view v-if="pageLoading && NucleResult && NucleResult.length == 0" class="empty-box">
      <g-empty :current="1" />
    </view>
    <g-message />
  </view>
</template>

<script setup lang="ts">
import api from "@/service/api";
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { GStores, wait, getTimeStamp } from "@/utils";
import { payMoneyOnline, toPayPull } from "@/components/g-pay/index";

interface INucle {
  billingType: string;
  fee: string;
  itemAddress: string;
  itemCode: string;
  itemName: string;
  itemTime: string;
  tips: string;
}

const props = defineProps<{
  hosName: string;
  hosId: string;
  isPay: string; //是否需要缴费 表示支付方式
  openId: string;
  type: number;
}>();

const NucleResult = ref<INucle[]>([]);
const gStores = new GStores();
const pageLoading = ref(false);
const currentIndex = ref(0);

onLoad(async (opt) => {
  //针对支付宝扫普通二维码跳转的处理 一开始没拿到参数不掉接口
  const queryParams = gStores.globalStore.appLaunchData?.query?.qrCode;

  uni.showLoading({});

  if (queryParams && !props?.hosId) {
    return;
  }
  if (opt) {
    if (props.hosId) {
      gStores.globalStore.onAppLaunch({});
    }
  }
  await wait(650);

  //针对微信扫普通二维码跳转的处理 一开始没拿到参数不掉接口
  if (opt?.q) {
    return;
  }

  initConfig();

  // await gStores.userStore.getPatList();
});

//初始化页面数据
const initConfig = async () => {
  pageLoading.value = false;
  let billingType = props.type ? props.type : props.isPay === "1" ? 3 : 99999; // 不配type 默认 3-需要支付 99999-去门诊不需要支付
  await api
    .getItemList({
      billingType: billingType,
      hosId: props.hosId,
    })
    .then(({ result }) => {
      if (result.length > 0) {
        NucleResult.value = result[0].items;
      }
    })
    .finally(() => {
      pageLoading.value = true;
      uni.stopPullDownRefresh();
    });
};
const clickItem = (i) => {
  currentIndex.value = i;
};
//确定开单
const submit = async () => {
  const { patientId, patientName, cardNumber } = gStores.userStore.patChoose;
  const source = gStores.globalStore.browser.source;
  const reBillingUrl = `/pagesC/selfService/nucleicBilling?hosId=${props.hosId}&isPay=${props.isPay}`;
  const res1 = await api.createBillingOrder({
    hosId: props.hosId,
    patientId: patientId,
    items: [NucleResult.value[currentIndex.value]],
    totalCost: NucleResult.value[currentIndex.value].fee,
    source: source,
    hosName: props.hosName,
    reBillingUrl: reBillingUrl, //再次开单路径
  });

  if (props.isPay == "1") {
    const data = {
      businessType: "",
      hosId: props.hosId,
      hosName: props.hosName,
      patientId: patientId,
      phsOrderNo: res1.result.phsOrderNo,
      phsOrderSource: 11,
      totalFee: NucleResult.value[currentIndex.value].fee,
      patientName,
      cardNumber,
    };
    const res = await payMoneyOnline(data);
    await toPayPull(res);
    payAfter(patientId);
  } else {
    console.log("跳转门诊缴费");
    gStores.messageStore.showMessage("开单成功", 1500, {
      closeCallBack: () => {
        //跳转门诊缴费页面
        uni.reLaunch({
          url: `/pagesA/clinicPay/clinicPayDetail`,
        });
      },
    });
  }
};
const payAfter = async (patientId) => {
  uni.showLoading({});
  await wait(1000);
  uni.hideLoading();
  //去我的开单页面
  uni.reLaunch({
    url: `/pagesC/cloudHospital/myPath?path=/pagesC/selfService/myOrder&_pd=${patientId}&_pt=${getTimeStamp(
      6
    )}`,
  });
};
</script>
<style lang="scss" scoped>
.g-page {
  .empty-box {
    padding-top: 200rpx;
  }
  .box {
    box-sizing: border-box;
    padding: 24rpx 32rpx 40rpx;
    width: 100%;
    .box-card {
      background: #ffffff;
      border: 1rpx solid var(--hr-neutral-color-2);
      border-radius: 16rpx;
      box-sizing: border-box;
    }

    .iconfont {
      font-size: var(--hr-font-size-xxl);
    }
    .box-tips {
      width: 100%;
      padding: 32rpx;
      label {
        font-size: var(--hr-font-size-xs);
        text-align: left;
        color: var(--hr-neutral-color-7);
        line-height: 44rpx;
        &:last-child {
          margin-top: 8rpx;
          color: var(--hr-neutral-color-10);
          margin-left: 16rpx;
        }
      }
    }
    .box-date {
      margin-top: 16rpx;
      padding: 28rpx 32rpx;
      display: flex;
      label {
        color: -var(-hr-neutral-color-10);
        line-height: 48rpx;
        font-weight: 600;
        font-size: var(--hr-font-size-base);
        margin-right: 32rpx;

        &:nth-child(2) {
          flex: 1;
          font-weight: 400;
        }
      }
    }
    .box-list {
      margin-top: 16rpx;
      view {
        display: flex;
        padding: 28rpx 0;
        margin: 0 32rpx;
        box-shadow: 0px -1px 0px 0px #e6e6e6 inset;
        &:last-child {
          box-shadow: none;
        }
        label {
          color: -var(-hr-neutral-color-10);
          line-height: 48rpx;
          font-weight: 600;
          font-size: var(--hr-font-size-base);
          margin-right: 32rpx;

          &:nth-child(2) {
            flex: 1;
            text-align: right;
            white-space: nowrap;
          }
        }
      }
      .active {
        label {
          color: var(--hr-brand-color-6);
        }
      }

      .ico-checkbox {
        color: var(--hr-brand-color-6);
      }
    }
  }
  .g-footer {
    .btn {
      flex: 1;
    }
  }
}
</style>
