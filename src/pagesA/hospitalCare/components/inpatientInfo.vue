<template>
  <!-- 住院信息 -->
  <view>
    <view class="box" v-if="Obj==false && hosInfoResObj">
      <view :class="gStores.userStore.patChoose.patientSex=='女'?'card card-lady':'card card-man'">
        <view class="user">
          <image v-show="isLoad" class="user-avatar" :src="getAvatar(gStores.userStore.patChoose.patientSex)" mode="widthFix" @load="loadImg"></image>

          <view class="user-info">
            <text class="user-info-name">
              {{ hosInfoResObj.patientNameDes }}</text>
            <text class="user-info-id">({{ hosInfoResObj.cardNumber }})</text>
          </view>

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
        <view v-if="gStores.userStore.patChoose.patientSex=='女'" class="iconfont woman">&#xe6a9;</view>
        <view v-if="gStores.userStore.patChoose.patientSex=='男'" class="iconfont man">&#xe6aa;</view>
      </view>
      <view class="card-detail">
        <view class="card-detail-item">
          <text class="name">已预交金额 </text>
          <view class="record" v-if="props.isQueryPreRecord=='1'">
            <view class="triangle-left"></view>
            <view class="records" @click="toPayRecord" >
              <text class="text">查看记录</text>
              <view class="iconfont right">&#xe66b;</view>
            </view>
          </view>

          <text class="money">{{hosInfoResObj.prepaidCost}}元</text>
        </view>
        <view class="card-detail-item">
          <text class="name">已产生费用</text>
          <text class="money">{{hosInfoResObj.totalCost}}元</text>
        </view>
        <view class="card-detail-item" v-if="hosInfoResObj.insuranceFee">
          <text class="name">医保报销</text>
          <text class="money">{{hosInfoResObj.insuranceFee}}元</text>
        </view>
        <view class="card-detail-item" v-if="hosInfoResObj.defrayFee">
          <text class="name">自费金额</text>
          <text class="money">{{hosInfoResObj.defrayFee}}元</text>
        </view>
        <view class="card-detail-item last">
          <text class="name">账户余额</text>
          <text class="money">{{hosInfoResObj.accountBalance}}元</text>
        </view>

        <view class="button" @click="toPayPage">预交费用</view>
      </view>
      <g-flag typeFg="17" isShowFg />
    </view>
    <view class="empty-box" v-else>
      <g-empty :current="1" />
    </view>
    <g-message />

  </view>

</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { getAvatar, isAreaProgram } from '@/stores';
import { GStores } from '@/utils';
import api from '@/service/api';
import {
  getInHospitalInfoParam,
  getInHospitalInfoResult,
  hospitalPayResult,
} from '../utils/inpatientInfo';
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
const Obj = ref();
const props = defineProps<{
  isQueryPreRecord?: string;
  tabCurrent?: number;
}>();
const gStores = new GStores();
const isLoad = ref(false);
const loadImg = () => {
  isLoad.value = true;
}; 
const hosInfoResObj = ref<getInHospitalInfoResult>(
  {} as getInHospitalInfoResult
); 
const toPayRecord = async () => { 
  uni.navigateTo({
    url: `payRecord?hosId=${hosInfoResObj.value.hosId}`,
  });
};
const toPayPage = () => {
  uni.navigateTo({
    url: `paymentPage?hosId=${hosInfoResObj.value.hosId}`,
  });
};
onPullDownRefresh(() => {
  if (props.tabCurrent == 0) {
    setTimeout(() => {
      uni.stopPullDownRefresh();
      init();
    }, 1000);
  }
});
const init = async () => {
  const { result } = await api.getInHospitalInfo<getInHospitalInfoResult>({
    patientId: gStores.userStore.patChoose.patientId,
  });
  hosInfoResObj.value = result;
  Obj.value = JSON.stringify(hosInfoResObj.value) == '{}';
}; 
onMounted(() => {
  init();
});
defineExpose({
  init
  });
</script>

<style scoped lang="scss">
.box {
  padding: 32rpx 32rpx 0 32rpx;
}
.empty-box {
  padding-top: 200rpx;
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
  margin: 16rpx 0 20rpx;
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
</style>
