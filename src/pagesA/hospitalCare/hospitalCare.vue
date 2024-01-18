<template>
  <view
    class="g-page"
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
  >
    <g-flag typeFg="600" isShowFg />
    <g-choose-pat @choosePat="pageRequest" />

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
    <view class="container" v-if="pageLoading">
      <inpatientInfo
        ref="inpatientInfoRef"
        v-if="getValue('0')"
        :isQueryPreRecord="resultHos.isQueryPreRecord"
        :tabCurrent="tabCurrent"
      ></inpatientInfo>
      <dailyExpenseList
        ref="dailyExpenseListRef"
        v-if="getValue('1')"
        :isHosDaylist="resultHos.isHosDaylist"
        :tabCurrent="tabCurrent"
      ></dailyExpenseList>
      <totalList
        ref="totalListRef"
        v-if="getValue('2')"
        :isHosTotallist="resultHos.isHosTotallist"
        :tabCurrent="tabCurrent"
      ></totalList>
      <totalList
        ref="totalListRef3"
        v-if="getValue('3')"
        :isHosTotallist="resultHos.isHosTotallist"
        :tabCurrent="tabCurrent"
        type="outList"
      ></totalList>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { IPat } from '@/stores';
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import inpatientInfo from './components/inpatientInfo.vue';
  import dailyExpenseList from './components/dailyExpenseList.vue';
  import totalList from './components/totalList.vue';
  import { GStores, ServerStaticData, ISystemConfig } from '@/utils';
  import { deQueryForUrl } from '@/common';

  const pageProps = ref(
    {} as {
      tabIndex?: 1 | 2;
    }
  );

  const gStores = new GStores();
  const tabCurrent = ref(0);
  const tabStatus = ref(0);
  const resultHos = ref<ISystemConfig['hospitalCare']>(<any>{});
  const inpatientInfoRef = ref<any>('');
  const dailyExpenseListRef = ref<any>('');
  const totalListRef = ref<any>('');
  const totalListRef3 = ref<any>('');
  const pageLoading = ref(false);
  const tabList = ref(false);
  const tab1List = ref(false);
  const tab2List = ref(false);
  const currentTabValue = ref(false);

  //获取当前的value
  const getValue = (value) => {
    const tab = resultHos.value?.tab;
    if (tab && tab.length) {
      const item = tab[tabCurrent.value]!;
      return item.value === value;
    } else {
      return false;
    }
  };

  //入口不同调用不同接口
  const pageRequest = () => {
    const v = resultHos.value.tab[tabCurrent.value].value;
    switch (v) {
      case '0':
        inpatientInfoRef?.value.init();

        break;
      case '1':
        dailyExpenseListRef!.value.init();

        break;
      case '2':
        totalListRef?.value.init();

        break;
      case '3':
        totalListRef3?.value.init();

        break;

      default:
        break;
    }
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
    pageLoading.value = false;
    const result = await ServerStaticData.getSystemConfig('hospitalCare');
    resultHos.value = result as any;

    tabList.value = result.tab.find((o) => o.value === '0') ? true : false;
    tab1List.value = result.tab.find((o) => o.value === '1') ? true : false;
    tab2List.value = result.tab.find((o) => o.value === '2') ? true : false;

    pageLoading.value = true;
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
