<template>
  <!-- 总计费用清单 -->
  <view>
    <view
      class="page"
      v-if="
        props.isHosTotallist == '1' &&
        dailyResList.inHospitalDailyCostsResultList.length > 0
      "
    >
      <view
        class="progress"
        v-for="(item, index) in dailyResList.inHospitalDailyCostsResultList"
        :key="index"
      >
        <view class="right" v-for="(i, j) in item.costSecondaries" :key="j">
          <view v-for="(m, n) in i.costListResultList" :key="n">
            <!-- <view class="dates">{{m.startTime}}～{{m.endTime}}</view> -->
            <view class="dates">{{ item.date }}</view>
            <view class="details" @click="gotoListExpenses(m)">
              <view class="date">{{ i.hosName }}</view>
              <view class="details-right">
                <view class="money">{{ m.cost }}元 </view>
                <view class="iconfont right">&#xe66b;</view>
              </view>
            </view>
          </view>
        </view>
        <text class="iconfont date">&#xe6c6;</text>
        <view class="line"></view>
      </view>
    </view>

    <view class="page" v-if="props.isHosTotallist == '2'">
      <dailyExpenseListDetial
        ref="dailyExpenseListDetialRef"
        :isHosTotallist="props.isHosTotallist"
      />
    </view>

    <view
      class="empty-box"
      v-if="
        props.isHosTotallist == '1' &&
        dailyResList.inHospitalDailyCostsResultList.length == 0
      "
    >
      <g-empty :current="1"  />
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { GStores } from "@/utils";
import api from "@/service/api";
import { dailyResult } from "../utils/inpatientInfo";
import dailyExpenseListDetial from "./dailyExpenseListDetial.vue";
const gStores = new GStores();
const props = defineProps<{
  isHosTotallist?: string;
}>();
const dailyInfoParam = ref({
  inHospitalId: "",
  timesHospitalization: "",
  patientId: gStores.userStore.patChoose.patientId,
});
const InHospitalCostInfo = ref(0);
const dailyExpenseListDetialRef = ref<any>("");
const dailyResList = ref<dailyResult>({
  inHospitalDailyCostsResultList: [],
});
const init = async () => {
  if (props.isHosTotallist == "1") {
    //列表
    dailyResList.value = {
      inHospitalDailyCostsResultList: [],
    }
    const { result } = await api.getInHospitalDailyCostList<dailyResult>({
      patientId: gStores.userStore.patChoose.patientId,
      costType: "3",
    });

    dailyResList.value = result;
  } else if (props.isHosTotallist == "2") {
    //详情
    dailyExpenseListDetialRef.value.init();
  }
};
const detalResult = (val) => {
  InHospitalCostInfo.value = Object.keys(val).length;
};
const gotoListExpenses = (data) => {
  uni.navigateTo({
    url: `listExpenses?isHosTotallist='2'`,
  });
};
onMounted(async () => {
  await init();
  // await detalResult(InHospitalCostInfo);
});
defineExpose({
  init,
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
    .details {
      background: #ffffff;
      border: 1px solid #e6e6e6;
      border-radius: 16rpx;
      padding: 32rpx;
      margin: 16rpx 0 20rpx;
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
      white-space: nowrap;
    }
    .iconfont {
      font-size: 48rpx;
      // margin: auto 0;
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
  padding-top: 200rpx;
}
</style>
