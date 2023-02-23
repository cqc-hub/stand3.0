<template>
  <view class="g-page"   :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }">
    <g-flag typeFg="600" isShowFg />
    <g-choose-pat @choosePat="choosePat" />

    <view class="tab-box" v-if="pageLoading">
      <g-tabs
        v-model:value="tabCurrent"
        :tabs="resultHos.tab"
        :line-scale="0.8"
        field="label"
        zIndex="1"
        all-blod
        @change="tabChange"
      />
    </view>
    <!-- 内容区域 -->
    <view class="g-container" v-if="pageLoading">
      <inpatientInfo
        ref="inpatientInfoRef"
        v-if="tabCurrent == 0"
        :isQueryPreRecord="resultHos.isQueryPreRecord"
        :tabCurrent="tabCurrent"
      ></inpatientInfo>
      <dailyExpenseList
        ref="dailyExpenseListRef"
        v-if="tabCurrent == 1"
        :isHosDaylist="resultHos.isHosDaylist"
        :tabCurrent="tabCurrent"
      ></dailyExpenseList>
      <totalList
        ref="totalListRef"
        v-if="tabCurrent == 2"
        :isHosTotallist="resultHos.isHosTotallist"
        :tabCurrent="tabCurrent"
      ></totalList>
    </view>
  </view>
</template>

<script setup lang="ts">
import { IPat } from "@/stores";
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import inpatientInfo from "./components/inpatientInfo.vue";
import dailyExpenseList from "./components/dailyExpenseList.vue";
import totalList from "./components/totalList.vue";
import { GStores, ServerStaticData } from "@/utils";
import { hosParam } from "@/components/g-form";
import { deQueryForUrl } from "@/common";

const pageProps = ref(
  {} as {
    tabIndex?: 1 | 2;
  }
);

const gStores = new GStores();
const patList = ref(gStores.userStore.patChoose);
const tabCurrent = ref(0);
const tabStatus = ref(0);
const resultHos = ref<hosParam>({
  inPatientPrePay: "",
  isHosDaylist: "",
  isHosTotallist: "",
  tab: [],
  isQueryPreRecord: "",
});
const inpatientInfoRef = ref<any>("");
const dailyExpenseListRef = ref<any>("");
const totalListRef = ref<any>("");
const pageLoading = ref(false);

//切换就诊人
const choosePat = ({ item }: { item: IPat; number: number }) => {
  patList.value = item;
  pageRequest()
};

//入口不同调用不同接口
const pageRequest = () => {
  if (tabCurrent.value == 0) {
    inpatientInfoRef?.value.init();
  } else if (tabCurrent.value == 1) {
    dailyExpenseListRef!.value.init();
  } else if (tabCurrent.value == 2) {
    totalListRef?.value.init();
  }
};

const tabChange = (e: number) => {
  tabStatus.value = e;
  tabCurrent.value = e;
};
const scrollOption = ref({
  auto: false,
  size: 15,
  loadFailText: "加载失败",
  noMoreText: "没有更多了",
});
const setData = async () => {
  pageLoading.value = false
  const result = await ServerStaticData.getSystemConfig('hospitalCare');
  resultHos.value = result as any;
  pageLoading.value = true
};

onLoad(async (opt) => {
  if (opt) {
    pageProps.value = deQueryForUrl(opt);
  }
  setData();
  if (pageProps.value.tabIndex) {
    tabCurrent.value = pageProps.value.tabIndex;
  }
});

</script>

<style scoped lang="scss">
.tab-box {
  // padding: 0 10rpx;
  :deep(.v-tabs__container-item) {
    flex: 1;
    justify-content: center;
  }
}
</style>
