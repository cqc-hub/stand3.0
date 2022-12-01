<template>
  <view class="page" v-if="costInfoDetal">
    <view class="container">
      <view class="top">
        <view class="title">{{costInfoDetal.costTypeName}}</view>
        <view class="information">
          <view class="item">
            <view class="item-title">患者姓名</view>
            <view class="item-content">{{patName}}({{patientId}})</view>
          </view>
          <view class="item">
            <view class="item-title">费用时间</view>
            <view class="item-content" v-if="param.isHosDaylist||props.isHosDaylist">{{costDate}}</view>
            <view class="item-content" v-if="param.isHosTotallist">{{param.startTime}}～{{param.endTime}}</view>
          </view>
          <view class="item">
            <view class="item-title">病区床号</view>
            <view class="item-content">{{costInfoDetal.hospitalWard}} {{costInfoDetal.inpatientBed}}床</view>
          </view>
          <view class="item" v-if="param.hospitalId">
            <view class="item-title">住院号</view>
            <view class="item-content">{{costInfoDetal.inpatientNo}}</view>
          </view>
          <view class="item">
            <view class="item-title">费用总额</view>
            <view class="item-content-money">{{costInfoDetal.totalCost}}元</view>
          </view>
        </view>
      </view>
      <view class="bottom">
        <view class="title">费用明细</view>
        <template v-for="(item,index) in costInfoDetal.costList" :key="index">
          <view class="item">
            <view @click="isShowBtn(index)" class="item-top">
              <view class="type">{{item.category}}</view>
              <view class="money">{{item.categoryCost}}元
                <text v-if="!isShow[index]" style="color:#888888;" class="iconfont">&#xe6c4;</text>
                <text v-else style="color:#888888;" class="iconfont">&#xe6c5;</text>
              </view>
            </view>
            <template v-if="item.category!='中药'">
              <view v-show="isShow[index]" v-for="(sub,i) in item.subCostList" :key="i">
                <view class="item-content" :class="{spacing:i>0}">
                  <view class="left">
                    <view class="name">{{sub.costName}}</view>
                    <view class="count">
                      <view class="unit">{{sub.unitPrice}}元/{{sub.unit}}</view>
                      <view class="quantity">x{{sub.quantity}}</view>
                    </view>
                  </view>
                  <view class="right">{{sub.valuationAmount}}元</view>
                </view>
              </view>
            </template>
            <template v-else>
              <view class="zcy-content" :class="{padding:isShow[index]}">
                <view v-show="isShow[index]" v-for="(sub,i) in item.subCostList" :key="i">
                  <view class="zcy-name">{{sub.costName}}&nbsp;&nbsp;<text style="color:#888888">{{sub.quantity}}{{sub.unit}}</text></view>
                </view>
              </view>
            </template>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import api from '@/service/api';
import { getQueryUrl } from '@/common/utils';
import {
  inHospitalCostInfo,
  inHospitalCostInfoParam,
} from '../utils/inpatientInfo';
import { onLoad } from '@dcloudio/uni-app';
import { GStores, ServerStaticData } from '@/utils';
import dayjs from 'dayjs';
const costInfoDetal = ref<inHospitalCostInfo>({} as inHospitalCostInfo);
const param = ref<inHospitalCostInfoParam>({
  costDay: '',
  costType: '',
  hosId: '',
  hospitalId: '',
  patientId: '',
  sysCode: '',
  timesHospitalization: '',
  startTime: '',
  endTime: '',
  isHosTotallist: '',
  isHosDaylist: '',
});
const costDate = ref('');
const costType = ref('');
const patName = ref('');
const patientId = ref('');
const gStores = new GStores();
let isShow = ref<boolean[]>([]);
const props = defineProps<{
  costDay?: string;
  isHosDaylist?: string;
  isHosTotallist?: string;
}>();
const emit = defineEmits(['detalResult']);

const isShowBtn = (index) => {
  isShow.value[index] = !isShow.value[index];
};

const init = async () => {
  patName.value = gStores.userStore.patChoose.patientName;
  patientId.value = gStores.userStore.patChoose._showId;
  // inpatientNo.value = param.value.hospitalId;
  if (props.isHosDaylist == '2') {
    costDate.value = dayjs(props.costDay).format('YYYY-MM-DD');
    costType.value = '1';
  } else if (props.isHosTotallist == '1') {
    costType.value = '3';
    costDate.value = '';
  } else {
    costDate.value = param.value.costDay;
  }
  const params = {
    hospitalId: param.value.hospitalId,
    costDay: costDate.value,
    costType: costType.value,
    patientId: gStores.userStore.patChoose.patientId,
    //   patientId: '10763642',
  };
  const { result } = await api.getInHospitalCostInfo<inHospitalCostInfo>(
    params
  );
  costInfoDetal.value = result;
};

const detalResultEvent = () => {
  emit('detalResult', costInfoDetal.value);
};

watch(
  () => (costDate.value = props.costDay),
  () => {
    if (props.costDay) {
      init();
    }
  }
);
onMounted(async () => {
  if (props.isHosDaylist || props.isHosTotallist) {
    await init();
    detalResultEvent();
  }
});
onLoad((val) => {
  param.value.costDay = val.costDate;
  param.value.hospitalId = val.inpatientNo;
  param.value.isHosTotallist = val.isHosTotallist;
  param.value.isHosDaylist = val.isHosDaylist;
  param.value.startTime = val.startTime;
  param.value.endTime = val.endTime;
  if (val.isHosDaylist) {
    costType.value = '1';
  } else if (val.isHosTotallist) {
    costType.value = '3';
  }
  if (val.isHosTotallist || val.isHosDaylist) {
    init();
  }
});
</script>
<style scoped lang="scss">
.page {
  height: auto;
  width: 100%;
  .container {
    height: auto;
    width: 686rpx;
    margin-left: 32rpx;
    .top {
      height: auto;
      width: 686rpx;
      background: linear-gradient(180deg, #ffffff 0%, #e9f0ff 100%);
      border: 1rpx solid #e6e6e6;
      border-radius: 16rpx 16rpx 0px 0px;
      padding-bottom: 40rpx;
      margin-top: 32rpx;
      .title {
        text-align: center;
        font-size: 36rpx;
        font-weight: 600;
        margin-top: 40rpx;
      }
      .information {
        margin-top: 20rpx;
        font-size: 28rpx;
        margin-left: 32rpx;
        .item {
          margin-top: 12rpx;
          display: flex;
          .item-title {
            width: 112rpx;
            height: 44rpx;
            color: #888888;
          }
          .item-content {
            color: #111111;
            margin-left: 24rpx;
          }
          .item-content-money {
            margin-left: 24rpx;
            color: #ff5040;
          }
        }
      }
    }
    .bottom {
      height: auto;
      width: 686rpx;
      border-radius: 0px 0px 16rpx 16rpx;
      background-color: #fff;
      border-left: 1rpx solid #e6e6e6;
      border-right: 1rpx solid #e6e6e6;
      border-bottom: 1rpx solid #e6e6e6;
      padding-bottom: 20rpx;
      .title {
        padding-top: 40rpx;
        margin-left: 32rpx;
        font-size: 32rpx;
        color: #888888;
      }
      .item {
        height: auto;
        width: 622rpx;
        margin-top: 8rpx;
        margin-left: 32rpx;
        .item-top {
          height: 96rpx;
          width: 622rpx;
          display: flex;
          justify-content: space-between;
          line-height: 96rpx;
          font-size: 32rpx;
          font-weight: 600;
          .money {
            color: #ff5040;
          }
        }
        .item-content {
          width: 622rpx;
          height: auto;
          background-color: #f6f6f6;
          display: flex;
          justify-content: space-between;
          font-size: 28rpx;
          padding-bottom: 16rpx;
          border-radius: 8rpx;
          &.spacing {
            margin-top: 8rpx;
          }
        }
        .left {
          margin-left: 24rpx;
          margin-top: 16rpx;
          .count {
            color: #888888;
            font-size: 24rpx;
            display: flex;
            margin-top: 4rpx;
            .quantity {
              margin-left: 40rpx;
            }
          }
        }
        .right {
          margin-top: 16rpx;
          margin-right: 24rpx;
        }
      }
      .zcy-content {
        width: 622rpx;
        height: auto;
        background-color: #f6f6f6;
        font-size: 28rpx;
        border-radius: 8rpx;
        display: flex;
        flex-flow: row wrap;
        &.padding {
          padding-bottom: 16rpx;
        }
        .zcy-name {
          height: auto;
          width: 287rpx;
          margin-left: 24rpx;
          margin-top: 16rpx;
        }
      }
    }
  }
}
</style>