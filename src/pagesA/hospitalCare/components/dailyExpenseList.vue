<template>
  <!-- 日费用清单 -->
  <view class="page">
    <view class="progress" v-for="(item,index) in dailyResList " :key="index">
      <view class="right">
        <view class="dates">{{item.date}}</view>
        <view class="detail-item" v-for="(i,j) in item.costSecondaries" :key="j">
          <view class="details" v-for="(m,n) in i.costListResultList" :key="n" @click="gotoListExpenses(m)">
            <view class="date">{{m.costDate}}</view>
            <view class="details-right">
              <view class="money">{{m.cost}}元 </view>
              <view class="iconfont right">&#xe66b;</view>
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
import { dailyParam, dailyResult } from '../utils/inpatientInfo';
import { onLoad } from '@dcloudio/uni-app';
const gStores = new GStores();
const dailyInfoParam = ref({
  inHospitalId: '',
  timesHospitalization: '',
  patientId: '10763642',
  // patientId: gStores.userStore.patChoose.patientId,
});
const dailyResList = ref<dailyResult>({} as dailyResult);
const init = async () => {
  const { result } = await api.getInHospitalDailyCostList<dailyResult>({
    patientId: dailyInfoParam.value.patientId,
  });
  dailyResList.value = result;
  console.log(dailyResList.value, 'xxxxx');
};
onLoad(() => {
  init();
});
const tabs = ref([
  { name: '住院信息', typeId: 0, date: '2022-12-12', money: '20' },
  { name: '日费用清单', typeId: 1, date: '2022-12-12', money: '20' },
  { name: '总计清单', typeId: 2, date: '2022-12-12', money: '20' },
]);
const gotoListExpenses = (data) => {
  uni.navigateTo({
    url: `listExpenses?costDate=${data.costDate}&inpatientNo=${data.inHospitalId}`,
  });
};
</script>


<style scoped lang="scss">
.page {
  padding-top: 40rpx;
}
// 步骤样式
.progress {
  position: relative;
  padding: 0 24rpx 0px 90rpx;
  .right {
    height: 100%;
    .dates {
      padding-top: 10rpx;
    }
    .detail-item {
      .details {
        background: #ffffff;
        border: 1px solid #e6e6e6;
        border-radius: 16rpx;
        padding: 32rpx;
        margin-top: 16rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .date {
        font-size: 36rpx;
        font-weight: 600;
      }
      .details-right {
        display: flex;
        align-items: center;
      }
      .money {
        font-size: 36rpx;
      }
      .iconfont {
        font-size: 48rpx;
        // margin: auto 0;
      }
    }
  }
  .iconfont {
    &.date {
      color: #ddd;
      position: absolute;
      font-size: 24rpx;
      z-index: 999;
      top: 20rpx;
      left: 38rpx;
    }
  }
  .line {
    position: absolute;
    border-right: 2px dotted #ddd;
    height: 100%;
    width: 1px;
    left: 45rpx;
    top: 30rpx;
    bottom: auto;
  }
}
.progress:last-child {
  .line {
    height: 80%;
  }
}
</style>
