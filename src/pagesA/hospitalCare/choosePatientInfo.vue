<template>
  <g-flag typeFg="600" isShowFg />
  <!-- 预交金代缴信息页面 -->
  <view class="box" v-if="Obj == false">
    <view :class="hosInfoResObj.sexCode == '2' ? 'card card-lady' : 'card card-man'">
      <view class="user">
        <image
          class="user-avatar"
          :src="
            hosInfoResObj.sexCode == '1'
              ? '../../static/image/img_tx_patient_male.png'
              : '/static/image/img_tx_patient_female.png'
          "
          mode="widthFix"
        ></image>
        <view class="user-info">
          <text class="user-info-name"> {{ hosInfoResObj.patientNameDes }}</text>
          <text v-if="hosInfoResObj.cardNumber" class="user-info-id"
            >({{ hosInfoResObj.cardNumber }})</text
          >
        </view>
      </view>
      <view class="user-del yard">
        <text>{{ hosInfoResObj.hosName }}</text>
        <text class="line"></text>
        <text>{{ hosInfoResObj.inpatientWard }}</text>
        <text class="line"></text>
        <text>{{ hosInfoResObj.inpatientBed }}床</text>
      </view>
      <view class="user-del date">
        <text>{{ hosInfoResObj.beHosDate }} </text>
        <text>入院</text>
      </view>
      <view v-if="hosInfoResObj.sexCode == '2'" class="iconfont woman">&#xe6a9;</view>
      <view v-if="hosInfoResObj.sexCode == '1'" class="iconfont man">&#xe6aa;</view>
    </view>
    <view class="card-detail">
      <view class="card-detail-item">
        <text class="name">已预交金额 </text>
        <!-- <view class="record">
          <view class="triangle-left"></view>
          <view class="records" @click="toPayRecord" v-if="resultHos.isQueryPreRecord=='1'">
            <text class="text">查看记录</text>
            <view class="iconfont right">&#xe66b;</view>
          </view>
        </view> -->
        <text class="money">{{ hosInfoResObj.prepaidCost }}元</text>
      </view>
      <view v-if="hosInfoResObj.totalCost" class="card-detail-item">
        <text class="name">已产生费用</text>
        <text class="money">{{ hosInfoResObj.totalCost }}元</text>
      </view>
      <view v-if="hosInfoResObj.insuranceFee" class="card-detail-item">
        <text class="name">医保报销</text>
        <text class="money">{{ hosInfoResObj.insuranceFee }}元</text>
      </view>
      <view v-if="hosInfoResObj.defrayFee" class="card-detail-item">
        <text class="name">自费金额</text>
        <text class="money">{{ hosInfoResObj.defrayFee }}元</text>
      </view>
      <view v-if="hosInfoResObj.accountBalance" class="card-detail-item last">
        <text class="name">账户余额</text>
        <text class="money">{{ hosInfoResObj.accountBalance }}元</text>
      </view>

      <view class="button" @click="toPayPage">预交费用</view>
    </view>
  </view>
  <view class="empty-box" v-else>
    <g-empty :current="1" />
  </view>
  <g-message />
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";

import api from "@/service/api";
import { isAreaProgram } from "@/stores";
import { GStores, ServerStaticData } from "@/utils";
import { hosParam } from "@/components/g-form";
import { joinQuery } from "@/common";

import {
  getInHospitalInfoParam,
  getInHospitalInfoResult,
  hospitalPayResult,
} from "./utils/inpatientInfo";
import { deQueryForUrl } from "@/common/utils";

type IPageProps = {
  patientName?: string;
  patientPhone?: string; // 代缴的时候带
  params?: string; // 扫码时候带的加密参数
};
const pageProps = ref<IPageProps>({} as IPageProps);

const resultHos = ref<hosParam>({
  inPatientPrePay: "",
  isHosDaylist: "",
  isHosTotallist: "",
  tab: [],
  isQueryPreRecord: "",
});

const Obj = ref();
const gStores = new GStores();
const hosInfoResObj = ref<getInHospitalInfoResult>({} as getInHospitalInfoResult);
// const payParam = ref({
//   hosId: '1279',
//   // patientId: '10763642',
//   patientId: gStores.userStore.patChoose.patientId,
// });
// const payResList = ref<hospitalPayResult>({} as hospitalPayResult);
const isLoad = ref(false);

const loadImg = () => {
  isLoad.value = true;
};

const toPayPage = () => {
  const { hosId, cardNumber, patientName, hosName } = hosInfoResObj.value;
  const data = {
    hosId,
    cardNumber,
    patientName,
    type: 1, //表示预交来的
    hosName
  };
  uni.navigateTo({
    url: joinQuery("/pagesA/hospitalCare/paymentPage", data),
  });
};

//根据姓名手机号查询的接口
const init = async () => {
  const { result } = await api.getInHospitalInfo<getInHospitalInfoResult>({
    patientName: pageProps.value.patientName,
    patientPhone: pageProps.value.patientPhone,
  });
  hosInfoResObj.value = result;
  Obj.value = JSON.stringify(hosInfoResObj.value) == "{}";
};

//根据扫码获取住院信息
const getScanInHospitalInfo = async () => {
  const { result } = await api.getScanInHospitalInfo<getInHospitalInfoResult>({
    desSecret: decodeURIComponent(pageProps.value.params as string),
  });
  hosInfoResObj.value = result;
  Obj.value = JSON.stringify(hosInfoResObj.value) == "{}";
};

//查看记录暂时注释
// const toPayRecord = async () => {
//   const { result } = await api.getInHospitalPayInfo<hospitalPayResult>({
//     patientId: payParam.value.patientId,
//     hosId: payParam.value.hosId,
//   });
//   payResList.value = result;
//   uni.navigateTo({
//     url: 'payRecord',
//   });
// };

// //获取住院参数配置
// const setData = async () => {
//   const result = await ServerStaticData.getSystemConfig('hospitalCare');
//   resultHos.value = result;
// };

onLoad(async (opt) => {
  pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(opt));
  console.log(22222, "onload", pageProps.value);
  // await setData();
});

onShow(async () => {
  console.log(2222, "show", pageProps.value);
  if (pageProps.value.params) {
    //扫码进入
    uni.setNavigationBarTitle({
      title: "住院服务",
    });
    await getScanInHospitalInfo();
  }
  if (pageProps.value.patientName) {
    await init();
  }
});
</script>

<style scoped lang="scss">
.box {
  padding: 32rpx 32rpx 0 32rpx;
}
.card {
  height: 244rpx;
  border: 1rpx solid #e6e6e6;
  border-radius: 16rpx;
  padding: 40rpx 32rpx 0;
  overflow: hidden;
  &.card-man {
    background: linear-gradient(90deg, #ffffff, #e9f0ff 99%);
  }
  &.card-lady {
    background: linear-gradient(90deg, #ffffff, #fff0eb 99%);
  }
  .user {
    display: flex;
    .user-avatar {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
    }
    .user-info {
      margin-left: 8rpx;
      .user-info-name {
        font-weight: 600;
        font-size: 40rpx;
      }
      .user-info-id {
        color: #888;
        font-size: 32rpx;
        margin-left: 8rpx;
      }
    }
  }
  .user-del {
    color: #444;
    font-size: 28rpx;
    display: flex;

    &.yard {
      margin-top: 24rpx;
    }
    &.date {
      margin-top: 16rpx;
    }
    text {
      display: block;
    }
    .line {
      width: 2rpx;
      height: 24rpx;
      margin: auto 20rpx;
      background-color: #e6e6e6;
    }
  }
  .iconfont {
    font-size: 240rpx;
    margin-top: -120rpx;
    margin-right: -60rpx;
    float: right;
    &.man {
      color: #296fff;
      opacity: 0.05;
    }
    &.woman {
      color: #ff5040;
      opacity: 0.05;
    }
  }
}
.card-detail {
  background-color: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 16rpx;
  margin-top: 16rpx;
  padding: 40rpx 32rpx;

  .card-detail-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32rpx;
    &.last {
      margin-bottom: 80rpx;
    }
    .name {
      color: #888;
      font-size: 32rpx;
    }
    .triangle-left {
      margin: auto 0;
      width: 0;
      height: 2rpx;
      border-top: 10rpx solid transparent;
      border-right: 16rpx solid #f3f3f3;
      border-bottom: 10rpx solid transparent;
    }
    .record {
      display: flex;
    }
    .records {
      width: 152rpx;
      height: 48rpx;
      border-radius: 8rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #e9f0ff;
      margin-right: 70rpx;

      .text {
        color: #296fff;
        font-size: 24rpx;
        font-weight: 600;
        text-align: center;
      }
      .right {
        font-size: 32rpx;
        color: #296fff;
      }
    }
    .money {
      font-size: 32rpx;
      color: #111;
      font-weight: 600;
    }
  }
  .button {
    border: 2rpx solid #296fff;
    border-radius: 16rpx;
    height: 96rpx;
    color: #296fff;
    font-weight: 600;
    text-align: center;
    line-height: 96rpx;
    margin-top: 28rpx;
  }
}
.empty-box {
  padding-top: 200rpx;
}
</style>
