<template>
  <view class="page">
    <g-flag typeFg="600" isShowFg />
    <g-choose-pat @choosePat="choosePat" />
    <!-- <block v-if="expressList.length > 0">
      <expressItem :expressList="expressList"></expressItem>
    </block>
    <block class="empty-box" v-else>
      <page-state index="1" />
    </block> -->

    <view class="tab-box">
      <g-tabs v-model:value="tabCurrent" :tabs="resultHos.patientTab" :line-scale="0.8" field="headerName" all-blod @change="tabChange" />
    </view>
    <!-- 内容区域 -->
    <view class="content-box">
      <inpatientInfo v-show="tabStatus == 0"></inpatientInfo>
      <dailyExpenseList v-show="tabStatus == 1"></dailyExpenseList>
      <totalList v-show="tabStatus == 2"></totalList>
    </view>

    <!-- <swiper
      :current="tabCurrent"
      @change="(e) => tabChange(e.detail.current)"
      class="container"
    >
      <swiper-item v-for="(tab, i) in tabs" :key="tab.typeId">
        <view class="container-scroll"> </view>
      </swiper-item>
    </swiper> -->
  </view>
</template>

<script setup lang="ts">
// import api from '@/api/api';
import { ref, watch } from 'vue';
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
import inpatientInfo from './components/inpatientInfo.vue';
import dailyExpenseList from './components/dailyExpenseList.vue';
import totalList from './components/totalList.vue';
import { GStores, ServerStaticData } from '@/utils';
import { hosParam } from '@/components/g-form';
import { log } from 'console';
const gStores = new GStores();
const tabCurrent = ref(0);
const tabStatus = ref(0);
const resultHos = ref<hosParam>({
  inPatientPrePay: '',
  isHosDaylist: '',
  isHosTotallist: '',
  patientTab: [],
});
//切换就诊人
const choosePat = () => {};
const tabChange = (e: number) => {
  tabStatus.value = e;
  tabCurrent.value = e;
};
const scrollOption = ref({
  auto: false,
  size: 15,
  loadFailText: '加载失败',
  noMoreText: '没有更多了',
});
const setData = async () => {
  const result = await ServerStaticData.getSystemHospital();
  resultHos.value = result;
};
onLoad(() => {
  setData();
});
</script>

<style scoped lang="scss">
.tab-box {
  padding: 0 10rpx;
  :deep(.v-tabs__container-item) {
    flex: 1;
    justify-content: center;
  }
}
.content-box {
  // padding: 32rpx 32rpx 0 32rpx;
}
</style>
