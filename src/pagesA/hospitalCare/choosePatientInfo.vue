<template>
  <!-- 预交金代缴信息页面 -->
  <view class="box" v-if="Obj==false">
    <view :class="hosInfoResObj.sexCode=='2'?'card card-lady':'card card-man'">
      <view class="user">
        <image v-show="isLoad" class="user-avatar" :src="getAvatar(gStores.userStore.patChoose.patientSex)" mode="widthFix" @load="loadImg"></image>

        <view class="user-info">
          <text class="user-info-name">
            {{ hosInfoResObj.patientName }}</text>
          <text class="user-info-id">({{ gStores.userStore.patChoose._showId }})</text>
        </view>

        <!-- {{
            `${gStores.userStore.patChoose.patientName}  ${
              (!isAreaProgram() && gStores.userStore.patChoose._showId) || ""
            }`
          }}
        </view> -->
      </view>
      <view class="user-del yard">
        <text>{{hosInfoResObj.hosName}}</text>
        <text class="line"></text>
        <text>{{hosInfoResObj.inpatientWard}}</text>
        <text class="line"></text>
        <text>{{hosInfoResObj.inpatientBed}}床</text>
      </view>
      <view class="user-del date">
        <text>{{hosInfoResObj.beHosDate}} </text>
        <text>入院</text>
      </view>
      <view v-if="hosInfoResObj.sexCode=='2'" class="iconfont woman">&#xe6a9;</view>
      <view v-if="hosInfoResObj.sexCode=='1'" class="iconfont man">&#xe6aa;</view>
    </view>
    <view class="card-detail">
      <view class="card-detail-item">
        <text class="name">已预交金额 </text>
        <view class="records" @click="toPayRecord">
          <text class="text">查看记录</text>
          <view class="iconfont right">&#xe66b;</view>
        </view>
        <text class="money">{{hosInfoResObj.prepaidCost}}元</text>
      </view>
      <view class="card-detail-item">
        <text class="name">已产生费用</text>
        <text class="money">{{hosInfoResObj.totalCost}}元</text>
      </view>
      <view class="card-detail-item">
        <text class="name">医保报销</text>
        <text class="money">{{hosInfoResObj.insuranceFee}}元</text>
      </view>
      <view class="card-detail-item">
        <text class="name">自费金额</text>
        <text class="money">{{hosInfoResObj.defrayFee}}元</text>
      </view>
      <view class="card-detail-item last">
        <text class="name">账户余额</text>
        <text class="money">{{hosInfoResObj.accountBalance}}元</text>
      </view>

      <view class="button" @click="toPayPage">预交费用</view>
    </view>
  </view>
  <view class="empty-box" v-else>
    <g-empty :current="1" />
  </view>

</template>
<script setup lang="ts">
import { ref } from 'vue';
import { getAvatar, isAreaProgram } from '@/stores';
import { GStores } from '@/utils';
import api from '@/service/api';
import {
  getInHospitalInfoParam,
  getInHospitalInfoResult,
} from './utils/inpatientInfo';
import { onLoad } from '@dcloudio/uni-app';
const Obj = ref();
const gStores = new GStores();
const isLoad = ref(false);
const loadImg = () => {
  isLoad.value = true;
};
const hosInfoParam = ref<getInHospitalInfoParam>({
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
const toPayPage = () => {
  uni.navigateTo({
    url: `paymentPage`,
  });
};
const toPayRecord = () => {
  uni.navigateTo({
    url: 'payRecord',
  });
};
const init = async () => {
  const { result } = await api.getInHospitalInfo<getInHospitalInfoResult>({
    patientName: hosInfoParam.value.patientName,
    patientPhone: hosInfoParam.value.patientPhone,
  });
  hosInfoResObj.value = result;
  Obj.value = JSON.stringify(hosInfoResObj.value) == '{}';
};
onLoad((val) => {
  hosInfoParam.value.patientName = val.patientName;
  hosInfoParam.value.patientPhone = val.patientPhone;
  init();
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
  & .card-man {
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
