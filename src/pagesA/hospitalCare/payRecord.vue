<template>
  <!-- 日费用清单 -->
  <view class="page">
    <view class="progress" v-for="(item,index) in payResList.hospitalPayResultList " :key="index">
      <view class="right">
        <view class="date">{{item.date}}</view>
        <view class="detail" v-for="(i,j) in item.hospitalPay" :key="j">
          <view class="details" v-for="(m,n) in i.costListResultList" :key="n">
            <view class="detail-item">
              <text class="date">{{i.hosName}}</text>
              <text class="money">{{m.paymentAmount}}元 </text>
            </view>
            <view class="detail-date">
              <text>{{m.payTime}}</text>
              <text class="lines"></text>
              <text>{{m.moneyType}}</text>
            </view>
          </view>
        </view>
      </view>
      <text class='iconfont date'>&#xe6c6;</text>
      <view class="line"></view>
    </view>
  </view>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { GStores } from '@/utils';
import api from '@/service/api';
import { hospitalPayResult } from './utils/inpatientInfo';
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
const gStores = new GStores();
const payParam = ref({
  hosId: '1279',
  // patientId: '10763642',
  patientId: gStores.userStore.patChoose.patientId,
});
const payResList = ref<hospitalPayResult>({} as hospitalPayResult);
const init = async () => {
  const { result } = await api.getInHospitalPayInfo<hospitalPayResult>({
    patientId: payParam.value.patientId,
    hosId: payParam.value.hosId,
  });
  payResList.value = result;
};
//下拉刷新
onPullDownRefresh(() => {
  setTimeout(() => {
    uni.stopPullDownRefresh();
    init();
  }, 1000);
});
onLoad(() => {
  init();
});
</script>


<style scoped lang="scss">
.page {
  padding-bottom: 40rpx;
}
// 步骤样式
.progress {
  position: relative;
  padding: 0 24rpx 0px 90rpx;
  .right {
    height: 100%;
    padding-top: 30rpx;
    .detail {
      .details {
        margin-top: 16rpx;
        background: #ffffff;
        border: 1px solid #e6e6e6;
        border-radius: 16rpx;
        padding: 32rpx;
      }
    }
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 36rpx;
      font-weight: 600;
      margin-bottom: 8rpx;
    }
    .detail-date {
      color: #888;
      font-size: 28rpx;
      display: flex;
      text {
        display: block;
      }
      .lines {
        width: 2rpx;
        height: 24rpx;
        background-color: #e6e6e6;
        margin: auto 14rpx;
      }
    }
  }
  .iconfont {
    &.date {
      color: #ddd;
      position: absolute;
      font-size: 24rpx;
      z-index: 999;
      top: 40rpx;
      left: 38rpx;
    }
  }
  .line {
    position: absolute;
    border-right: 2px dotted #ddd;
    height: 100%;
    width: 1px;
    left: 45rpx;
    top: 50rpx;
    bottom: auto;
  }
}
.progress:last-child {
  .line {
    height: 90%;
  }
}
</style>
