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

          <view
            class="empty-list"
            v-if="isComplete['0'] && !waitSelList.length"
          >
            <g-empty :current="1" />
          </view>
        </scroll-view>
      </swiper-item>

      <swiper-item>
        <scroll-view scroll-y class="swiper-item uni-bg-red">
          <Htlp-List :list="seledList" @click-item="selItemClick" show-status />

          <view class="empty-list" v-if="isComplete['1'] && !seledList.length">
            <g-empty :current="1" />
          </view>
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

    <g-message />

    <sel-Way-Popup
      :sel-list="drayWaySelList"
      @item-click="wayClick"
      ref="refAddDialog"
    />
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  import { GStores, debounce } from '@/utils';
  import { type IWaitListItem } from './utils/medicalHelp';

  import api from '@/service/api';

  import HtlpList from './components/htlpList.vue';
  import SelWayPopup from './components/selWayPopup.vue';

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
  const isComplete = ref({
    '0': false,
    '1': false,
  });

  const waitSelList = ref<IWaitListItem[]>([]);
  const selList = ref<IWaitListItem[]>([]);
  const seledList = ref<IWaitListItem[]>([]);
  const drayWaySelList = ref<IOptions[]>([]);

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
    isComplete.value[takenDrug] = false;
    listNow.value = [];
    selList.value = [];

    const { patientId } = gStores.userStore.patChoose;
    const args = {
      takenDrug,
      patientId,
      clinicCate: 0,
    };

    const { result } = await api.getDrugDelivery(args).finally(() => {
      isComplete.value[takenDrug] = true;
    });

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

  const wayClick = (item: IOptions) => {
    drayWaySelList.value = [item.value];
    if (item.value === '快递配送到家') {
      console.log('233');
    } else {
      // 医院窗口取药
    }
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
