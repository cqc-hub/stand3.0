<template>
  <view class="page">
    <g-flag typeFg="600" isShowFg />
    <g-choose-pat @choosePat="choosePat" />

    <view class="tab-box">
      <g-tabs v-model:value="tabCurrent" :tabs="resultHos.tab" :line-scale="0.8" field="label" all-blod @change="tabChange" />
    </view>
    <!-- 内容区域 -->
    <view class="content-box">
      <inpatientInfo v-show="tabCurrent == 0" :isQueryPreRecord="resultHos.isQueryPreRecord" :tabCurrent="tabCurrent"></inpatientInfo>
      <dailyExpenseList v-show="tabCurrent == 1" :isHosDaylist=" resultHos.isHosDaylist" :tabCurrent="tabCurrent"></dailyExpenseList>
      <totalList v-show="tabCurrent == 2" :isHosTotallist="resultHos.isHosTotallist" :tabCurrent="tabCurrent"></totalList>
    </view>
  </view>
</template>

<script setup lang="ts">
// import api from '@/api/api';
import { getAvatar, isAreaProgram, useUserStore, IPat } from '@/stores';
import { ref, watch } from 'vue';
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
import inpatientInfo from './components/inpatientInfo.vue';
import dailyExpenseList from './components/dailyExpenseList.vue';
import totalList from './components/totalList.vue';
import { GStores, ServerStaticData } from '@/utils';
import { hosParam } from '@/components/g-form';
const gStores = new GStores();
const patList = ref(gStores.userStore.patChoose);
const tabCurrent = ref(0);
const tabStatus = ref(0);
const resultHos = ref<hosParam>({
  inPatientPrePay: '',
  isHosDaylist: '',
  isHosTotallist: '',
  tab: [],
  isQueryPreRecord: '',
});
//切换就诊人
const choosePat = ({ item }: { item: IPat; number: number }) => {
  patList.value = item;
  console.log(item, patList.value, 'patList');
};
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

onLoad(async () => {
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
