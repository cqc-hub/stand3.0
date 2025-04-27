<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <g-flag isShowFg typeFg="48" />
    <g-choose-pat
      v-if="!pageProps.params"
      @choose-pat="tabChange(tabCurrent)"
    />
    <view v-if="tabField.length > 1" class="g-border-bottom">
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
      <swiper-item v-if="tabFieldKeys.includes('0')">
        <scroll-view scroll-y class="swiper-item uni-bg-red">
          <Htlp-List
            :list="waitSelList"
            :selUnPayList="selList"
            :systemModeOld="gStores.globalStore.modeOld"
            @sel-item="selPayListItem"
            @click-item="selItemClick"
            @arrow-item="selItemClick"
            @express-click="expressClick"
            :isCheck="isShowSelItem"
          />

          <view
            class="empty-list"
            v-if="isComplete['0'] && !waitSelList.length"
          >
            <g-empty :current="1" />
          </view>

          <view v-else class="safe-height" />
        </scroll-view>
      </swiper-item>

      <swiper-item v-if="tabFieldKeys.includes('1')">
        <scroll-view scroll-y class="swiper-item uni-bg-red">
          <Htlp-List
            :list="seledList"
            :systemModeOld="gStores.globalStore.modeOld"
            @click-item="selItemClick"
            @express-click="expressClick"
            show-status
          />

          <view class="empty-list" v-if="isComplete['1'] && !seledList.length">
            <g-empty :current="1" />
          </view>

          <view v-else class="safe-height" />
        </scroll-view>
      </swiper-item>
    </swiper>

    <view v-if="isShowSelItem" class="g-footer">
      <button
        :class="{
          'btn-disabled': !selList.length,
        }"
        @click="showDialog"
        class="btn btn-primary flex1"
      >
        选择取药方式
      </button>
    </view>

    <g-message />

    <!-- :sel-list="drayWaySelList" -->
    <sel-way-popup
      :sel-list="[]"
      :opt-list="selListOption"
      v-model:show="isShowDialog"
      @item-click="wayClick"
      ref="refAddDialog"
    />
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
  import { onMounted, ref, nextTick, computed, getCurrentInstance } from 'vue';
  import { onLoad, onShow, onHide } from '@dcloudio/uni-app';

  import { useCacheStore } from '@/stores';
  import {
    GStores,
    debounce,
    useTBanner,
    TButtonConfig,
    wait,
    throttle,
    cacheUtil,
  } from '@/utils';
  import { decryptForPage } from '@/common/des';
  import {
    type IWaitListItem,
    isChineseMedical,
    isToBeFriedAndDelivery,
  } from './utils/medicalHelp';
  import {
    setLocalStorage,
    getLocalStorage,
    joinQueryForUrl,
    deQueryForUrl,
    getSysCode,
  } from '@/common';
  import api from '@/service/api';

  import HtlpList from './components/HtlpList.vue';
  import selWayPopup from './components/SelWayPopup.vue';
  import { beforeEach } from '@/router';
  import globalGl from '@/config/global';

  const defaultField = [
    {
      label: '待取药',
      key: '0',
    },
    {
      label: '已取药',
      key: '1',
    },
  ];

  const gStores = new GStores();
  const cacheStore = useCacheStore();
  const pageProps = ref(
    {} as {
      tabIndex: number;
      params?: string;
    }
  );
  const tabCurrent = ref(0);
  const tabField = ref([] as typeof defaultField);
  const refAddDialog = ref<any>('');
  const isComplete = ref({
    '0': false,
    '1': false,
  });
  const fgTitle54 = ref('');
  const isFgShow54 = ref(false);
  let rPatientId = '';
  const ctx = getCurrentInstance();

  const waitSelList = ref<IWaitListItem[]>([]);
  const selList = ref<IWaitListItem[]>([]);
  const seledList = ref<IWaitListItem[]>([]);
  const drayWaySelList = ref<IOptions[]>([]);
  const currentTabKey = computed(() => {
    return tabField.value[tabCurrent.value].key;
  });

  const isShowSelItem = computed(() => {
    return currentTabKey.value === '0' && globalGl.SYS_CODE !== '1001067';
  });

  const tabFieldKeys = computed(() => {
    return tabField.value.map((o) => o.key);
  });

  const selListOption = computed(() => {
    const [opt1, opt2] = [
      {
        label: '医院窗口取药',
        value: '医院窗口取药',
      },
      {
        label: '快递配送到家',
        value: '快递配送到家',
      },
    ];
    let f = false;

    const idx = selList.value.findIndex((o) => {
      return isToBeFriedAndDelivery(o);
    });

    if (idx > -1) {
      if (selList.value.length === 1) {
        f = true;
      } else {
        const idx2 = selList.value.findIndex((o) => {
          return !isChineseMedical(o) && o.deliveryType === '1';
        });

        if (idx2 === -1) {
          f = true;
        }
      }
    }

    return f ? [opt2] : [opt1, opt2];
  });

  let tabChange = (idx: number) => {
    tabCurrent.value = idx;
    getListData(tabField.value[idx].key);
  };

  tabChange = throttle(tabChange, 120);

  const expressClick = (item: IWaitListItem) => {
    const { expressNo, expressCompany } = item;
    const args: TButtonConfig = {
      type: 'h5',
      path: 'pagesC/myExpress/expressDetail',
      text: '',
      isSelfH5: '1',
      extraData: {
        expressNo,
        expressCompany,
      },
      addition: {
        token: 'token',
      },
    };

    useTBanner(args);
  };

  const selPayListItem = (item: IWaitListItem) => {
    const { takenDrugType, supportEditAddr } = item;
    const { params: sign } = pageProps.value;
    if (
      takenDrugType === '0' ||
      supportEditAddr === '1' ||
      (sign && getSysCode() === '1001038' && !takenDrugType)
    ) {
      const idx = selList.value.findIndex((o) => o._id === item._id);

      if (idx === -1) {
        const list = [...selList.value, item];

        if (list.length === 1) {
          selList.value = list;
          return;
        }

        const hosIds = [...new Set(list.map((o) => o.hosId))];
        const types = [
          ...new Set(
            list.map((o) => isChineseMedical(o) && o.drugIsDelivery === '1')
          ),
        ];
        const isDJ = isToBeFriedAndDelivery(item);
        let [
          isDifferentHosErr,
          isDifferentTypeErr,
          isDifferentToBeFriedAndDeliveryErr,
        ] = [false, false, false];

        if (isDJ) {
          isDifferentToBeFriedAndDeliveryErr = !list.every((o) =>
            isToBeFriedAndDelivery(o)
          );
        } else {
          isDifferentToBeFriedAndDeliveryErr = list.some((o) =>
            isToBeFriedAndDelivery(o)
          );
        }

        if (hosIds.length > 1) {
          isDifferentHosErr = true;
        } else if (types.length > 1) {
          isDifferentTypeErr = true;
        } else if (!isDifferentToBeFriedAndDeliveryErr) {
          selList.value.push(item);
          return;
        }
        const { params: sign } = pageProps.value;

        if (
          isDifferentHosErr ||
          isDifferentTypeErr ||
          isDifferentToBeFriedAndDeliveryErr
        ) {
          if (list.length === 2) {
            selList.value = [item];
          } else {
            if (isDifferentHosErr) {
              gStores.messageStore.showMessage('不支持跨院区配送', 3000);
            } else if (isDifferentTypeErr) {
              gStores.messageStore.showMessage('请选择相同类型处方', 3000);
            } else if (isDifferentToBeFriedAndDeliveryErr) {
              gStores.messageStore.showMessage('请选择相同类型处方', 3000);
            }
          }
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

  const listNow = computed(() => {
    return tabField.value[tabCurrent.value].key === '0' ? waitSelList.value : seledList.value;
  });

  // 0-未取药 1-已取药
  const getListData = async (takenDrug: string) => {
    const listNow = takenDrug === '0' ? waitSelList : seledList;
    isComplete.value[takenDrug] = false;
    listNow.value = [];
    selList.value = [];

    const { params: sign } = pageProps.value;
    const { patientId } = gStores.userStore.patChoose;
    let args = {
      takenDrug,
      patientId: sign ? undefined : patientId,
      clinicCate: sign ? undefined : 0,
      sign,
    };
    //嘉二特殊处理
    if (sign && getSysCode() === '1001038') {
      const params = decryptForPage(sign);
      args = {
        ...args,
        ...params,
      };
    }

    const actionApi = sign ? api.getScanDrugDelivery : api.getDrugDelivery;

    const { result = {} } = await actionApi(args).finally(() => {
      isComplete.value[takenDrug] = true;
    });

    const { drugList: rList, patientId: _patientId } = result;
    rPatientId = _patientId;

    if (rList && rList.length) {
      const dateNow = new Date().getTime();
      rList.map((o, i) => {
        o._id = dateNow + '' + i;
      });

      listNow.value = result.drugList || [];

      listNow.value.map((o) => {
        o.drugIsDelivery = result.drugIsDelivery || '0';
        o.takenDrug = takenDrug;

        // o.visitType = '1';
      });
    }
  };

  const unSelItemClick = (item: IWaitListItem) => {};
  const selItemClick = (item: IWaitListItem) => {
    dealWith1001067();
    const pageArg = {
      ...item,
    };

    if (item.takenDrugType !== '0') {
      pageArg.takenDrug = '1';
    }

    uni.navigateTo({
      url: joinQueryForUrl(
        '/pagesB/medicationAssistant/medicalHelpDetail',
        pageArg
      ),
    });
  };

  const dealWith1001038 = () => {
    //嘉二，不考虑是否已经选择
  };

  const dealWith1001067 = () => {
    // 温fu2 扫码药品配送， 不需要进列表 直接详情
    if (globalGl.SYS_CODE === '1001067') {
      if (listNow.value.length) {
        selList.value = [...listNow.value];
        configToHome();
      } else {
        // uni.reLaunch({
        //   url: '/pages/home/home',
        // });
      }

      throw new Error('1001067');
    }
  };

  const init = async () => {
    const { MedicalHelp: config } = await cacheUtil.getSystemConfig(
      'MedicalHelp'
    )();
    const { tabs } = config;

    if (tabs) {
      tabField.value = tabs.map((o) => ({
        ...o,
        key: o.value,
      }));
    } else {
      tabField.value = defaultField;
    }

    let { tabIndex } = pageProps.value;

    if (tabIndex) {
      tabIndex = tabIndex * 1;
      if (tabIndex - 1 <= tabField.value.length) {
        tabCurrent.value = tabIndex;
      }
    }

    await getListData(tabField.value[tabCurrent.value].key);
    dealWith1001067();
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

    cacheStore.changeMedicalHelpSelList(selList.value);

    setTimeout(() => {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesC/medicationAssistant/helpChooseWay', {
          cardNumber: rPatientId,
          ...pageProps.value,
        }),
      });
    }, 200);
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
    gStores.messageStore.showMessage('选择医院窗口取药成功', 3000, {
      closeCallBack() {
        tabCurrent.value = 1;
      },
    });
  };

  const isShowDialog = ref(false);
  const showDialog = () => {
    isShowDialog.value = true;
  };

  onShow(() => {
    if (getLocalStorage('medicalHelp')) {
      getListData(tabField.value[tabCurrent.value].key);
      setLocalStorage({
        medicalHelp: '',
      });
    }
  });

  const pageHook = async () => {
    await wait(200);
    const patList = gStores.userStore.patList;
    if (!patList.length) {
      const pages = getCurrentPages();

      if (pages.length) {
        const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;
        await beforeEach({
          url: fullUrl,
          _isPatient: true,
        });
      }
    }
  };

  onLoad(async (opt) => {
    const queryParams = gStores.globalStore.appLaunchData?.query?.qrCode;
    uni.showLoading({});
    if ((queryParams && !opt?.params) || opt?.q) {
      await wait(650);
      return;
    }

    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }

    const { tabIndex, params } = pageProps.value;

    if (!params) {
      await pageHook();
    }

    init();
  });

  // onMounted(() => {
  //   init();
  // });
</script>

<style lang="scss" scoped>
  .swiper-item {
    height: 100%;
    padding: 0 32rpx;
    width: calc(100% - 64rpx);
  }
</style>
