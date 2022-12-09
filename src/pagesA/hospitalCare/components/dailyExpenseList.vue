<template>
  <!-- 日费用清单 -->
  <view>
    <view class="page" v-if="props.isHosDaylist=='1'&&dailyResList.inHospitalDailyCostsResultList.length>0">
      <view class="progress" v-for="(item,index) in dailyResList.inHospitalDailyCostsResultList" :key="index">
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

    <view v-if="(props.isHosDaylist=='2')">
      <view class="page">
        <view class="datetime-picker">
          <uni-datetime-picker type="date" v-model="costDay">{{dayjs(costDay).format("YYYY-MM-DD")}}</uni-datetime-picker>
          <view class="iconfont down">&#xe6e8;</view>
        </view>
        <dailyExpenseListDetial ref="dailyExpenseRef" :costDay="costDay" :isHosDaylist="props.isHosDaylist" />
      </view>

    </view>

    <view class="empty-box" v-if="props.isHosDaylist=='1'&&dailyResList.inHospitalDailyCostsResultList.length==0">
      <g-empty :current="1" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { GStores, ServerStaticData } from '@/utils';
import api from '@/service/api';
import { dailyParam, dailyResult } from '../utils/inpatientInfo';
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
import { hosParam } from '@/components/g-form';
import dailyExpenseListDetial from './dailyExpenseListDetial.vue';
import dayjs from 'dayjs';
const gStores = new GStores();
const props = defineProps<{
  isHosDaylist?: string;
  tabCurrent?: number;
}>();
const InfoList = ref();
const InfoObject = ref();
const timestamp = new Date().getTime();
const yesterDayTime = timestamp - 24 * 60 * 60 * 1000;
const costDay = ref(dayjs(yesterDayTime).format('YYYY-MM-DD'));
const dailyInfoParam = ref({
  inHospitalId: '',
  timesHospitalization: '',
  patientId: gStores.userStore.patChoose.patientId,
});
const dailyResList = ref<dailyResult>({
  inHospitalDailyCostsResultList: [],
});

const dailyExpenseRef = ref<any>('');

const init = async () => {
  console.log(222,props);
  
  if(props.isHosDaylist == '1'){
    //调用日费用清单列表
    const { result } = await api.getInHospitalDailyCostList<dailyResult>({
    patientId: gStores.userStore.patChoose.patientId,
    costType: '1',
  });
  dailyResList.value = result;
  }else if(props.isHosDaylist == '2'){
   //调用日费用清单详情
   dailyExpenseRef.value.init()
  }
 
};

const gotoListExpenses = (data) => {
  uni.navigateTo({
    url: `listExpenses?costDay=${data.costDate}&isHosDaylist='1'`,
  });
};
//下拉刷新
onPullDownRefresh(() => {
  if (props.tabCurrent == 1) {
    setTimeout(() => {
      uni.stopPullDownRefresh();
      init();
    }, 1000);
  }
});
// watch(
//   () => {
//     gStores.userStore.patChoose.patientId;
//   },
//   () => {
//     if (gStores.userStore.patChoose.patientId) {
//       console.log(2222,'watch');
      
//       init();
//     }
//   }
// );
onMounted(async () => {
  console.log(2222,'mount',props);
  
  await init();
});
defineExpose({
  init
  });
</script>

<style scoped lang="scss">
.page {
  padding-top: 40rpx;
  //日清单 详情模式 样式
  .datetime-picker {
    width: 244rpx;
    height: 56rpx;
    font-weight: 600;
    font-size: 26rpx;
    background-color: #fff;
    border-radius: 12rpx;
    margin-left: 32rpx;
    text-align: center;
    line-height: 56rpx;
    margin-bottom: 16rpx;
    display: flex;
    .iconfont {
      padding-right: 16rpx;
    }
  }
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
.empty-box {
  margin-top: 200rpx;
}
.no-data {
  padding: 80rpx 0;
  background-color: #fff;
  text-align: center;
  margin: 0 32rpx;
  color: #888;
  font-size: 28rpx;
  .no-data-img {
    width: 200rpx;
    height: 200rpx;
  }
}
</style>
