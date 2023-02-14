<template>
  <view class="g-page">
    <g-flag isShowFg typeFg="48" />
    <g-choose-pat @choose-pat="tabChange(tabCurrent)" />
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

    <!-- :sel-list="drayWaySelList" -->
    <sel-Way-Popup :sel-list="[]" @item-click="wayClick" ref="refAddDialog" />
    <xy-dialog
      :title="fgTitle54"
      :show="isFgShow54"
      @confirmButton="_getMedicalInHos"
      @cancelButton="isFgShow54 = false"
      isMaskClick
      isReverseBtn
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag
          v-model:title="fgTitle54"
          isHideTitle
          isShowFgTip
          typeFg="54"
          aaa
        />
      </scroll-view>
    </xy-dialog>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref, nextTick } from 'vue';
  import { onLoad, onShow, onHide } from '@dcloudio/uni-app';

  import { GStores, debounce } from '@/utils';
  import { type IWaitListItem } from './utils/medicalHelp';
  import { setLocalStorage, getLocalStorage, joinQueryForUrl } from '@/common';
  import api from '@/service/api';

  import HtlpList from './components/HtlpList.vue';
  import SelWayPopup from './components/selWayPopup.vue';

  const gStores = new GStores();
  const tabCurrent = ref(0);
  const tabField = [
    {
      label: '待取药',
      key: '0',
    },
    {
      label: '已取药',
      key: '1',
    },
  ] as const;
  const refAddDialog = ref<any>('');
  const isComplete = ref({
    '0': false,
    '1': false,
  });
  const fgTitle54 = ref('');
  const isFgShow54 = ref(false);

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
    const { takenDrugType } = item;

    if (takenDrugType === '0') {
      const idx = selList.value.findIndex((o) => o._id === item._id);

      if (idx === -1) {
        const list = [...selList.value, item];
        const hosIds = [...new Set(list.map((o) => o.hosId))];

        if (hosIds.length > 1) {
          gStores.messageStore.showMessage('不支持跨院区配送');
        } else {
          selList.value.push(item);
        }
      } else {
        selList.value.splice(idx, 1);
      }
    } else {
      let errWord = '该处方已选择取药方式，请前往窗口取药';

      if (takenDrugType === '2') {
        errWord = '该处方已选择取药方式，请等待快递员取药';
      }

      gStores.messageStore.showMessage(errWord, 3000);
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
  const selItemClick = (item: IWaitListItem) => {
    uni.navigateTo({
      url: joinQueryForUrl('/pagesB/medicationAssistant/medicalHelpDetail', item),
    });
  };

  const init = () => {
    getListData('0');
  };

  const wayClick = (item: IOptions) => {
    drayWaySelList.value = [item.value];
    if (item.value === '快递配送到家') {
      configToHome();
    } else {
      // 医院窗口取药
      // getMedicalInHos();

      isFgShow54.value = true;
    }
  };

  const _getMedicalInHos = () => {
    isFgShow54.value = false;
    getMedicalInHos();
  };

  const configToHome = () => {
    setLocalStorage({
      medicalHelp: selList.value,
    });
    nextTick(() => {
      uni.navigateTo({
        url: '/pagesC/medicationAssistant/helpChooseWay',
      });
    });
  };

  const getMedicalInHos = async () => {
    const hosId = selList.value[0].hosId;
    const { cardNumber, patientId, patientName } = gStores.userStore.patChoose;
    const { herenId } = gStores.globalStore;

    const args = {
      prescIdList: selList.value.map((o) => o.prescId),
      prescNoList: selList.value.map((o) => o.prescNo),
      deptName: selList.value.map((o) => o.deptName).join(','),
      deliveryType: '1',
      hosId,
      cardNumber,
      patientId,
      patientName,
      herenId,
    };

    await api.addDrugDelivery(args);
    gStores.messageStore.showMessage('您已选择为医院窗口取药', 3000, {
      closeCallBack() {
        tabCurrent.value = 1;
      },
    });
  };

  onShow(() => {
    if (getLocalStorage('medicalHelp')) {
      getListData(tabField[tabCurrent.value].key);
      setLocalStorage({
        medicalHelp: '',
      });
    }
  });

  onLoad((opt) => {
    if (opt) {
      const { tabIndex } = opt;

      if (tabIndex) {
        tabCurrent.value = <any>tabIndex * 1;
      }
    }
  });

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

  .reg-tip {
    max-height: 550rpx;
    width: calc(100% - 64rpx);
    margin-left: 32rpx;
  }
</style>
