<template>
  <view class="g-page">
    <!-- <g-flag isShowFg typeFg="48" /> -->
    <g-choose-pat />
    <view class="g-border-bottom">
      <g-tabs
        v-model:value="tabCurrent"
        :tabs="tabField"
        :scroll="false"
        @change="tabChange"
        zIndex="20"
        field="label"
        style="width: 100%"
      />
    </view>

    <swiper
      :current="tabCurrent"
      :duration="300"
      @change="({ detail: { current } }) => tabChange(current)"
      class="g-container"
    >
      <swiper-item>
        <scroll-view scroll-y class="swiper-item uni-bg-red">
          <Htlp-List
            :list="waitSelList"
            :selUnPayList="selList"
            @sel-item="selPayListItem"
            @click-item="unSelItemClick"
            isCheck
          />
        </scroll-view>
      </swiper-item>

      <swiper-item>
        <scroll-view scroll-y class="swiper-item uni-bg-red">
          <Htlp-List :list="seledList" @click-item="selItemClick" />
        </scroll-view>
      </swiper-item>
    </swiper>

    <view v-if="tabCurrent == 0" class="g-footer">
      <button
        :class="{
          'btn-disabled': !selList.length,
        }"
        @click="refAddDialog.show"
        class="btn btn-primary flex1"
      >
        选择取药方式
      </button>
    </view>

    <sel-Way-Popup ref="refAddDialog" />
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  import { GStores, debounce } from '@/utils';
  import { type IWaitListItem } from './utils/medicalHelp';

  import api from '@/service/api';

  import HtlpList from './components/htlpList.vue';
  import SelWayPopup from './components/selWayPopup.vue';

  api.getDrugDelivery = () =>
    Promise.resolve(<any>{
      code: 0,
      respCode: 999002,
      message: '成功',
      result: {
        patientId: '000001978',
        takenDrug: '0',
        drugList: [
          {
            hosId: '13001',
            hosName: '乐清市人民医院',
            drugTypeCode: '0',
            drugTypeName: '西药',
            deliveryType: '1',
            prescId: '20221215000000000203',
            prescNo: '2022121500003949',
            takenDrugType: '0',
          },
          {
            hosId: '13001',
            hosName: '乐清市人民医院',
            drugTypeCode: '0',
            drugTypeName: '西药',
            deliveryType: '1',
            prescId: '20221214000000000803',
            prescNo: '2022121400005983',
            takenDrugType: '0',
          },
        ],
      },
    });

  const gStores = new GStores();
  const tabCurrent = ref(0);
  const tabField = [
    {
      label: '待选择',
      key: '0',
    },
    {
      label: '已选择',
      key: '1',
    },
  ] as const;
  const refAddDialog = ref<any>('');

  const waitSelList = ref<IWaitListItem[]>([]);
  const selList = ref<IWaitListItem[]>([]);
  const seledList = ref<IWaitListItem[]>([]);

  let tabChange = (idx: number) => {
    tabCurrent.value = idx;

    getListData(tabField[idx].key);
  };

  tabChange = debounce(tabChange, 80);

  const selPayListItem = (item: IWaitListItem) => {
    const idx = selList.value.findIndex((o) => o._id === item._id);

    if (idx === -1) {
      selList.value.push(item);
    } else {
      selList.value.splice(idx, 1);
    }
  };

  // 0-未取药 1-已取药
  const getListData = async (takenDrug: '0' | '1') => {
    const listNow = takenDrug === '0' ? waitSelList : seledList;
    listNow.value = [];
    selList.value = [];

    const { patientId } = gStores.userStore.patChoose;
    const args = {
      takenDrug,
      patientId,
    };

    const { result } = await api.getDrugDelivery(args);

    const rList = result && result.drugList;
    if (rList && rList.length) {
      const dateNow = new Date().getTime();
      rList.map((o, i) => {
        o._id = dateNow + '' + i;
      });

      listNow.value = result.drugList || [];
    }
  };

  const unSelItemClick = (item: IWaitListItem) => {};
  const selItemClick = (item: IWaitListItem) => {};

  const init = () => {
    getListData('0');
  };

  onMounted(() => {
    init();
  });
</script>

<style lang="scss" scoped>
  .swiper-item {
    height: 100%;
    padding: 0 32rpx;
    width: calc(100% - 64rpx);
  }
</style>
