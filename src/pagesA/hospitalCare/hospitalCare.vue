<template>
  <view
    class="g-page"
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
  >
    <g-flag typeFg="600" isShowFg />
    <g-choose-pat v-if="!pageProps.visitNo" @choosePat="pageRequest" />

    <view class="tab-box" v-if="pageLoading">
      <g-tabs
        v-if="!pageProps.tab"
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
      <template v-if="getValue('0')">
        <inpatientInfo
          ref="inpatientInfoRef"
          :isQueryPreRecord="resultHos.isQueryPreRecord"
          :isHidePay="resultHos.isHidePay"
          :tabCurrent="tabCurrent"
          :isShowAppointment="pageProps.openAppointment === '1'"
          :isShowCtypeBtn="pageProps.ctype === '1'"
          :pageProps="pageProps"
        />
      </template>
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
  import api from '@/service/api';

  const pageProps = ref(
    {} as {
      tabIndex?: 1 | 2;
      // 住院预约 ?
      openAppointment?: '1';
      ctype?: '1';

      //
      tab?: string; //指定某个tab(不显示其他tab)
      // 捆绑某条住院记录查询
      visitNo?: string;
      patientName?: string;
      patientPhone?: string;
      cardNumber?: string;
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
  const setData = async () => {
    const { tab } = pageProps.value;
    pageLoading.value = false;
    const result = await ServerStaticData.getSystemConfig('hospitalCare');
    resultHos.value = result as any;
    if (tab) {
      resultHos.value.tab = [
        {
          label: '随便叫什么',
          value: tab,
        },
      ];
    }

    pageLoading.value = true;
  };

  onLoad(async (opt) => {
    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
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
