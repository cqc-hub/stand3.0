<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <g-flag isShowFg typeFg="48" />
    <g-choose-pat
      :disabled="pageProps.params"
      :pat="selPat"
      @choose-pat="patChange(tabCurrent)"
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
        {{
          selListOption1.length > 1 ? '选择取药方式' : selListOption1[0].value
        }}
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
    apiAsync,
  } from '@/utils';
  import { decryptForPage } from '@/common/des';
  import {
    type IWaitListItem,
    isChineseMedical,
    isToBeFriedAndDelivery,
  } from './utils/medicalHelp';
  import {
    joinQuery,
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

  let defaultField = [
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
      deParams?: any;
      type?: string;
      patientName?: string;
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

  const selPat = computed(() => {
    if (pageProps.value.deParams) {
      return {
        patientName:
          pageProps.value.deParams?.patientName ||
          pageProps.value?.patientName ||
          '就诊人',
        _showId:
          pageProps.value.deParams?.cardNumber ||
          pageProps.value.deParams?.patientId,
      };
    } else {
      return gStores.userStore.patChoose;
    }
  });

  const currentTabKey = computed(() => {
    return tabField.value[tabCurrent.value]?.key;
  });

  const isShowSelItem = computed(() => {
    return (
      (listNow.value.length &&
        currentTabKey.value === '0' &&
        globalGl.SYS_CODE !== '1001067') ||
      false
    );
  });

  const tabFieldKeys = computed(() => {
    return tabField.value.map((o) => o.key);
  });

  const getSelOptList = (list) => {
    const [opt1, opt2] = [
      {
        label: '医院窗口取药',
        value: '医院窗口取药',
      },
      {
        label: '快递配送到家',
        value: '填写快递地址',
      },
    ];
    if (gStores.globalStore.sysCode === '1001035') {
      return list.every((item) => item.deliveryType === '5')
        ? [opt2]
        : [opt1, opt2];
    }
    let f = false;

    const idx = list.findIndex((o) => {
      return isToBeFriedAndDelivery(o);
    });

    if (idx > -1) {
      if (list.length === 1) {
        f = true;
      } else {
        const idx2 = list.findIndex((o) => {
          return !isChineseMedical(o) && o.deliveryType === '1';
        });

        if (idx2 === -1) {
          f = true;
        }
      }
    }
    return f ? [opt2] : [opt1, opt2];
  };

  const selListOption = computed(() => {
    return getSelOptList(selList.value);
  });

  const selListOption1 = computed(() => {
    return getSelOptList(listNow.value);
  });
  let patChange = (idx: number) => {
    pageProps.value.type === 'medicineDecoce' && getChineseMedicineList();
    tabChange(idx);
  };

  let tabChange = (idx: number) => {
    tabCurrent.value = idx;
    if (!tabField.value[idx]?.key) {
      console.error('takenDrug需必传');
      return;
    }
    getListData(tabField.value[idx]?.key);
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
      (sign && gStores.globalStore.sysCode === '1001038' && !takenDrugType) ||
      (gStores.globalStore.sysCode === '1001085' && !takenDrugType)
    ) {
      const idx = selList.value.findIndex((o) => o._id === item._id);

      if (idx === -1) {
        if (gStores.globalStore.sysCode === '1001035') {
          selSZPayListItem(item);
          return;
        }
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

  const selSZPayListItem = (item: IWaitListItem) => {
    const list = [...selList.value, item];

    if (list.length === 1) {
      selList.value = list;
      return;
    }

    if ([...new Set(list.map((o) => o.hosId))].length > 1) {
      //判断是否同院区
      gStores.messageStore.showMessage('不支持跨院区配送', 3000);
    } else if (
      !list.every((o) => o?.prescVisitType === list[0]?.prescVisitType)
    ) {
      //判断是否同种类
      gStores.messageStore.showMessage('不同就诊类型处方不能同时操作！', 3000);
    } else if (!list.every((o) => o?.deliveryType === list[0]?.deliveryType)) {
      //判断是否同种配送类型
      gStores.messageStore.showMessage('不同配送类型处方不能同时操作！', 3000);
    } else {
      selList.value = list;
      return;
    }
    selList.value = [item];
  };

  const listNow = computed(() => {
    return tabField.value[tabCurrent.value]?.key === '0'
      ? waitSelList.value
      : seledList.value;
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
    } else if (getSysCode() === '1001085') {
      //温州中西医特殊处理
      args.clinicCate = undefined;
    }

    const actionApi = sign ? api.getScanDrugDelivery : api.getDrugDelivery;
    pageProps.value.deParams = sign ? {} : undefined;

    const { result = {} } = await actionApi(args).finally(() => {
      isComplete.value[takenDrug] = true;
    });

    if (sign && result.drugList && result.drugList.length) {
      pageProps.value.deParams = {
        cardNumber: result.cardNumber || result.patientId,
        patientName: result.patientName,
      };
    }

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
      scan: pageProps.value?.params ? 1 : 0,
    };
    if (pageProps.value?.params) {
      pageArg.cardNumber = pageProps.value.deParams?.cardNumber;
    }

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

    await getListData(tabField.value[tabCurrent.value]?.key);
    dealWith1001067();
  };

  const wayClick = (item: IOptions) => {
    drayWaySelList.value = [item.value];
    if (item.value === '填写快递地址') {
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
    let mailMethod: any = undefined;
    mailMethod =
      gStores.globalStore.sysCode === '1001035' &&
      selList.value.some((item) => {
        // 只要包含中药自煎的 只可选择邮政配送
        if (item.drugTypeCode == '1' && item.tcmDecoctionIndicator == '0') {
          return true;
        }
      })
        ? 'isYZ'
        : undefined;
    !mailMethod && pageProps.value?.type && (mailMethod = pageProps.value.type);
    setTimeout(() => {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesC/medicationAssistant/helpChooseWay', {
          cardNumber: selPat.value._showId,
          patientName: selPat.value.patientName,
          ...pageProps.value,
          scan: pageProps.value?.params ? '1' : '0',
          mailMethod,
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
      getListData(tabField.value[tabCurrent.value]?.key);
      setLocalStorage({
        medicalHelp: '',
      });
    }
  });

  const pageHook = async () => {
    await wait(200);
    const patList = gStores.userStore.patList;
    if (!patList.length) {
      await beforeEach({
        _isPatient: true,
      });
    }
  };
  const getChineseMedicineList = async () => {
    const { patientId, cardNumber } = gStores.userStore.patChoose;
    try {
      const { result } = await api.getChineseMedicineList({
        cardNumber,
        patientId,
      });
      if (result?.results && result.results.length) {
        const { confirm, cancel } = await apiAsync(uni.showModal, {
          content: '本次缴费项目中含有中草药处方，是否需要代煎？',
          cancelText: '我要自煎',
          confirmText: '选药代煎',
        });

        if (confirm) {
          uni.navigateTo({
            url: joinQuery('/pagesA/clinicPay/medicineDecoce', {
              patientId,
              cardNumber,
            }),
          });
        }
      }
    } catch (error) {
      console.error('获取中药代煎数据失败:', error);
    }
  };
  onLoad(async (opt) => {
    const queryParams = gStores.globalStore.appLaunchData?.query?.qrCode;

    uni.showLoading({ title: '加载中'});;
    if ((queryParams && !opt?.params) || opt?.q) {
      if (opt?.a === '1' || opt?.type === 'isYZ') {
        await wait(650);
      } else {
        await wait(650);
        return;
      }
    }

    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }
    if (getSysCode() === '1001035') {
      uni.setNavigationBarTitle({
        title: '药品快递办理',
      });
      defaultField = [
        {
          label: '未选择',
          key: '0',
        },
        {
          label: '已选择',
          key: '1',
        },
      ];
      pageProps.value.type === 'medicineDecoce' && getChineseMedicineList();
    }

    const { tabIndex, params } = pageProps.value;

    if (!params) {
      await pageHook();
    }

   await init();
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
