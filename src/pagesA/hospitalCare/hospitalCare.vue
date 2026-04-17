<template>
  <view
    class="g-page"
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
  >
    <g-flag typeFg="600" isShowFg />
    <g-choose-pat v-if="!pageProps.visitNo" @choosePat="pageRequest" />
    <g-message />

    <view class="tab-box" v-if="pageLoading">
      <g-tabs
        v-if="resultHos.tab.length > 1"
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
      <!-- 带时间的日费用 -->
      <dailyExpenseList
        ref="dailyExpenseListRef"
        v-if="getValue('1')"
        :isHosDaylist="resultHos.isHosDaylist"
        :tabCurrent="tabCurrent"
        :pageProps="pageProps"
      ></dailyExpenseList>
      <!-- 总计清单 -->
      <totalList
        ref="totalListRef"
        v-if="getValue('2')"
        :isHosTotallist="
          getCurrentTab.isHosTotallist || resultHos.isHosTotallist
        "
        :tabCurrent="tabCurrent"
        :pageProps="pageProps"
      ></totalList>

      <totalList
        ref="totalListRef3"
        v-if="getValue('3')"
        :isHosTotallist="
          getCurrentTab.isHosTotallist || resultHos.isHosTotallist
        "
        :tabCurrent="tabCurrent"
        :pageProps="pageProps"
        type="outList"
      ></totalList>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { IPat } from '@/stores';
  import { computed, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import inpatientInfo from './components/inpatientInfo.vue';
  import dailyExpenseList from './components/dailyExpenseList.vue';
  import totalList from './components/totalList.vue';
  import { GStores, ServerStaticData, ISystemConfig } from '@/utils';
  import { deQueryForUrl } from '@/common';
  import api from '@/service/api';
  import { beforeEach } from '@/router';

  const pageProps = ref(
    {} as {
      tabIndex?: 1 | 2;
      // 住院预约 ?
      openAppointment?: '1';
      ctype?: '1';

      //
      tab?: '1' | '2' | '3'; //指定某个tab(不显示其他tab)
      // 捆绑某条住院记录查询
      visitNo?: string;
      patientName?: string;
      patientPhone?: string;
      cardNumber?: string;
      // 有代表是登录进来的（非手输入）
      patientId?: string;
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

  const getCurrentTab = computed(() => {
    const tab = resultHos.value.tab || [];
    const item = tab[tabCurrent.value] || {};
    return item;
  });

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

    // api.getPatCardInfo({
    //   patientId: gStores.userStore.patChoose.patientId
    // })
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
      const tabs = tab.split(',');

      if (tabs.length === 1) {
        resultHos.value.tab = [
          {
            label: '随便叫什么',
            value: tab,
          },
        ];
      } else {
        const tabTemp = [
          {
            value: '0',
            label: '住院信息',
          },
          {
            value: '1',
            label: '日费用清单',
          },
          {
            value: '2',
            label: '总计清单',
          },
        ] as const;

        resultHos.value.tab = tabTemp.filter((o) => tabs.includes(o.value));
      }
    }

    pageLoading.value = true;
  };

  onLoad(async (opt) => {
    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }

    if (!Object.keys(pageProps.value).length) {
      await beforeEach({
        _isPatient: true,
      });
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
