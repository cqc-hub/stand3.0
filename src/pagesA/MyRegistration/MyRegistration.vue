<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <g-flag v-if="isRender" :typeFg="'405'" isShowFg />
    <g-message />

    <g-choose-pat
      v-if="isWaitReg || props.isAllOrder1001094 === '1'"
      @choose-pat="patientChange"
    />
    <view
      v-if="pageConfig.MyRegistrationNavBtns && !isWaitReg"
      class="p32c pt12 pb12"
    >
      <g-tbbtns :btns="pageConfig.MyRegistrationNavBtns" />
    </view>
    <view
      class="tab-box"
      v-show="tabs.length > 1 && !isWaitReg && props.hideTab !== '1'"
    >
      <g-tabs
        v-model:value="tabCurrent"
        :tabs="tabs"
        :line-scale="0.8"
        field="headerName"
        all-blod
        @change="tabChange"
      />
    </view>
    <My-Registration-Head
      v-if="!isWaitReg && props.isAllOrder1001094 !== '1'"
      v-model:isSelStatus="isSelStatus"
      v-model:isSelPatient="isSelPatient"
      v-model:isSelOrderStatus="isSelOrderStatus"
      :isShowFilterOrderStatus="isShowFilterOrderStatus"
      :selStatusName="selStatusName"
      :selPatName="selPatName"
      :selOrderStatusName="selOrderStatusName"
    />

    <view class="g-container">
      <block v-if="showList.length && isComplete">
        <My-Registration-List-Card
          :typeId="tabCurrentDetail?.typeId"
          :fatherProps="props"
          :isWaitReg="isWaitReg || tabCurrentDetail?.typeId === 2"
          :list="showList"
          :showYuanNeiDaoHanBtn="showYuanNeiDaoHanBtn"
          :isShowYuWzBtn="isShowYuWzBtn"
          :showPaiDuiJiaoHaoBtn="showPaiDuiJiaoHaoBtn"
          :showReOrderBtn="isShowReOrderBtn"
          :systemModeOld="gStores.globalStore.modeOld"
          :showFWBtn="showFWBtn"
          :config="pageConfig"
          :thRegisterId="props.thRegisterId"
          :anotherYwzConditions="anotherYwzConditions"
          @ywz-click="ywzClick"
          @go-detail="goDetail"
          @go-hos-navigate="goHosNavigate"
          @cancel-reg="cancelReg"
        ></My-Registration-List-Card>
      </block>

      <view class="empty-list" v-else-if="isComplete">
        <g-empty :current="1" />
      </view>
    </view>
    <g-select
      v-model:value="selOrderStatus"
      v-model:show="isSelOrderStatus"
      :option="orderStatusList"
      :field="{
        label: 'label',
        value: 'value',
      }"
      @change="orderStatusChange"
      type="top"
    >
      <template #header>
        <My-Registration-Head
          v-model:isSelStatus="isSelStatus"
          v-model:isSelPatient="isSelPatient"
          v-model:isSelOrderStatus="isSelOrderStatus"
          :isShowFilterOrderStatus="isShowFilterOrderStatus"
          :selStatusName="selStatusName"
          :selPatName="selPatName"
          :selOrderStatusName="selOrderStatusName"
        />
      </template>
    </g-select>
    <g-select
      v-model:value="selStatus"
      v-model:show="isSelStatus"
      :option="statusList"
      :field="{
        label: 'label',
        value: 'value',
      }"
      type="top"
    >
      <template #header>
        <My-Registration-Head
          v-model:isSelStatus="isSelStatus"
          v-model:isSelPatient="isSelPatient"
          v-model:isSelOrderStatus="isSelOrderStatus"
          :isShowFilterOrderStatus="isShowFilterOrderStatus"
          :selStatusName="selStatusName"
          :selPatName="selPatName"
          :selOrderStatusName="selOrderStatusName"
        />
      </template>
    </g-select>
    <g-select
      v-model:value="selPatId"
      v-model:show="isSelPatient"
      :option="patList"
      :field="{
        label: '_showLabel',
        value: 'patientId',
      }"
      @change="patientChange"
      type="top"
    >
      <template #header>
        <My-Registration-Head
          v-model:isSelStatus="isSelStatus"
          v-model:isSelPatient="isSelPatient"
          v-model:isSelOrderStatus="isSelOrderStatus"
          :isShowFilterOrderStatus="isShowFilterOrderStatus"
          :selStatusName="selStatusName"
          :selPatName="selPatName"
          :selOrderStatusName="selOrderStatusName"
        />
      </template>
    </g-select>

    <xy-dialog
      title=""
      :content="dialogContent"
      :show="isCancelOrderDialogShow"
      @cancelButton="isCancelOrderDialogShow = false"
      @confirmButton="cancelOrderDialogConfirm1"
    />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import {
    onPullDownRefresh,
    onShow,
    onLoad,
    onReady,
  } from '@dcloudio/uni-app';

  import { IRegistrationCardItem, HosNavData } from './utils/MyRegistration';
  import { isAreaProgram, IPat } from '@/stores';
  import {
    deQueryForUrl,
    getSysCode,
    joinQueryForUrl,
    setLocalStorage,
  } from '@/common';
  import { beforeEach } from '@/router';

  import {
    GStores,
    ServerStaticData,
    ISystemConfig,
    TButtonConfig,
    useTBanner,
    handlerWeChatThRegLogin,
  } from '@/utils';
  import {
    getOrderStatusTitle,
    getStatusConfig,
    goAskForDoc1001045,
    RegDetailUtil,
  } from './utils/regDetail';

  import api from '@/service/api';

  import MyRegistrationListCard from './components/MyRegistrationListCard/MyRegistrationListCard.vue';
  import MyRegistrationHead from './components/MyRegistrationHead/MyRegistrationHead.vue';
  import TabList from '@/pagesC/components/tabLis.vue';

  type TTabItem = {
    typeId: number;
    headerName: string;
    searchType?: string;
  };

  const props = ref(
    <
      {
        thRegisterId?: string;
        allPData?: '1';
        type?: 'waitReg' | 'forwardReg'; // 候补预约
        tabIndex?: '0' | '1' | '2';
        hideTab?: '1';
        typeId?: number;
        isAllOrder1001094?: '1'; // 自费挂号医保报销
      }
    >{}
  );
  const gStores = new GStores();
  const isRender = ref(false);
  const isComplete = ref(false);
  const pat = ref<IPat>();

  const showYuanNeiDaoHanBtn = ref<string[]>([]);
  const showPaiDuiJiaoHaoBtn = ref<string[]>([]);
  const showFWBtn = ref<string[]>([]);

  const isSelPatient = ref(false);
  const isSelStatus = ref(false);
  const isSelOrderStatus = ref(false);
  const selPatId = ref('');
  const selStatus = ref('');
  const selOrderStatus = ref('');

  const list = ref<IRegistrationCardItem[]>([]);
  const pageConfig = ref({} as ISystemConfig['order']);
  const tabCurrent = ref(0);

  const tabs = ref<TTabItem[]>([]);
  const tabCurrentDetail = ref({} as TTabItem);
  const orderStatusList = ref([
    {
      label: '在线挂号',
      value: '',
    },
    {
      label: '全部挂号',
      value: '1',
    },
  ]);
  const isWaitReg = computed(() => {
    return props.value.type === 'waitReg';
  });

  const isShowFilterOrderStatus = computed(() => {
    // return false;
    // return pageConfig.value.isCanSelOrderStatus === '1' || isWaitReg.value;
    return isWaitReg.value;
  });

  const anotherYwzConditions = computed(() => {
    if (isShowFilterOrderStatus.value) {
      // return selOrderStatus.value === '1'; // 全部挂号
      return selOrderStatus.value === ''; // 在线挂号
    } else {
      return true;
    }
  });

  const listApi = computed(() => {
    if (isWaitReg.value) {
      return api.getAlternateList;
    }
    // "全部" 查院内接口
    // return tabCurrentDetail.value?.typeId === 1
    //   ? api.hosRegOrderList
    //   : tabCurrentDetail.value?.typeId === 0
    //   ? api.getRegOrderList
    //   : api.getAlternateList;

    if (tabCurrentDetail.value?.typeId === 1) {
      return api.hosRegOrderList;
    }

    if ([0, 3].includes(tabCurrentDetail.value?.typeId)) {
      return api.getRegOrderList;
    }
    if ([4].includes(tabCurrentDetail.value?.typeId)) {
      return api.getForwardRegList;
    }

    return api.getAlternateList;
  });

  const isCancelOrderDialogShow = ref(false);
  const dialogContent = ref('');
  let cancelOrderDialogConfirm: (any) => any = async () => {};
  const cancelOrderDialogConfirm1: (any) => any = async () => {
    cancelOrderDialogConfirm(void 0);
  };

  const isShowReOrderBtn = computed(
    () => pageConfig.value.isOpenReOrder === '1'
  );

  const isShowYuWzBtn = computed(() => {
    let tabShowCondition = tabCurrentDetail.value.typeId === 0;
    if (pageConfig.value.preConsultationBtn?.isSelOrderShow === '1') {
      tabShowCondition =
        tabCurrentDetail.value?.typeId === 1 || tabShowCondition;
    }
    return pageConfig.value.isOpenPreConsultation === '1' && tabShowCondition;
  });

  const tabChange = async (e: number) => {
    if (tabs.value[tabCurrent.value]) {
      tabCurrent.value = e;
    } else {
      tabCurrent.value = parseInt(e as any) - 1;
    }
    let patientId =
      pat.value?.patientId ?? gStores.userStore.patChoose?.patientId;
    let cardNumber =
      pat.value?.cardNumber ?? gStores.userStore.patChoose?.cardNumber;

    tabCurrentDetail.value = tabs.value[tabCurrent.value];
    selStatus.value = '';
    if (e) {
      if (!gStores.userStore.patChoose.patientId) {
        await pageHook({
          _isPatient: true,
        });
      }
    }
    if (!pat.value?.patientId && (e || e === 0)) {
      _patChange(gStores.userStore.patChoose);
      patientId =
        pat.value?.patientId ?? gStores.userStore.patChoose?.patientId;
      cardNumber =
        pat.value?.cardNumber ?? gStores.userStore.patChoose?.cardNumber;
    }
    await getList(patientId, cardNumber);
  };

  const getList = async (patientId = '', cardNumber = '') => {
    isComplete.value = false;
    list.value = [];
    let type: any = undefined;
    if (
      props.value.isAllOrder1001094 === '1' &&
      gStores.globalStore.sysCode === '1001094' &&
      tabCurrentDetail.value?.typeId === 1
    ) {
      type = 2;
    }

    const { result } = await listApi
      .value<IRegistrationCardItem[]>({
        source: gStores.globalStore.browser.source,
        searchType: tabCurrentDetail.value.searchType,
        patientId,
        cardNumber,
        type,
      })
      .finally(() => {
        isComplete.value = true;
      });
    if (result && result.length) {
      result.map(async (o) => {
        // o.orderStatus = '70';
        const { schDate, appointmentDate, appointmentTime } = o;
        o._statusLabel = getOrderStatusTitle(
          o.orderStatus,
          pageConfig.value.isOrderPay,
          isWaitReg.value || tabCurrentDetail.value?.typeId === 2
        );

        if (o._statusLabel.startsWith('未知')) {
          // @ts-expect-error
          o.orderStatus = '--';
        }

        if (gStores.globalStore.sysCode === '1001093') {
          if (!schDate) {
            o.schDate = appointmentDate;
          }
          if (!o.timeDesc) {
            o.timeDesc = appointmentTime;
          }
          if (!o.disNo) {
            o.disNo = o.appointmentNumber;
          }
        }
      });
    }

    list.value = result || [];
  };

  const ywzClick = async (item: IRegistrationCardItem) => {
    if (gStores.globalStore.sysCode === '1001045') {
      goAskForDoc1001045(item);
    } else if (pageConfig.value.preConsultationBtn) {
      //指定的预问诊跳转
      useTBanner(pageConfig.value.preConsultationBtn, 'navigateTo', item);
    } else {
      let path = 'pagesC/inquiries/inquiriesRes1';
      const { patientSex, patientAge, patientName } =
        gStores.userStore.patChoose;
      const {
        orderId,
        hosDeptId,
        hosOrderId,
        hosData = '',
        patientId,
        deptName,
        hosId,
        hosDocId,
        categor,
        categorName,
      } = item;
      if (
        categorName === '门诊MDT' &&
        categor === '22' &&
        getSysCode() === '1001035'
      ) {
        path = 'pagesC/inquiries/inquiriesResSzMDT';
      }
      const preConsultation: TButtonConfig = {
        type: 'h5',
        isSelfH5: '1',
        // path: 'pages/inquiries/inquiries3',
        path,
        text: '预问诊',
        extraData: {
          orderId,
          hosDeptId,
          hosOrderId,
          hosData: encodeURIComponent(hosData as string),
          patientId,
          patientName,
          patientAge,
          patientSex,
          deptName,
          hosId,
          hosDocId,
        },
        addition: {
          token: 'token',
          herenId: 'herenId',
        },
      };
      useTBanner(preConsultation);
    }
  };

  const goDetail = async (
    item: IRegistrationCardItem,
    payload: BaseObject = {}
  ) => {
    const { patList } = gStores.userStore;
    const { patientId, orderId, orderStatus } = item;
    const typeId = tabCurrentDetail.value?.typeId;

    if (patientId && patList.length) {
      const pat = patList.find((o) => o.patientId === patientId);

      if (pat) {
        gStores.userStore.updatePatChoose(pat);
      }
    }
    let _type = props.value.type;
    if (props.value.type !== 'waitReg' && typeId === 2 && !orderId) {
      _type = 'waitReg';
    } else if (tabCurrentDetail.value?.typeId === 4) {
      _type = 'forwardReg';
    }

    // app 挂号
    if (tabCurrentDetail.value?.typeId === 3 && orderStatus === '10') {
      const { title, content } = await gStores.getSysAppMore('1232');
      await new Promise(async (r) => {
        gStores.messageStore.showMessage(content, 0, {
          useDialog: true,
          dialogOpt: {
            title,
            isShowCancel: false,
            confirmText: '确认',
          },
          closeCallBack: r,
        });
      });
    }
    const query = {
      ...payload,
      ...props.value,
      ...item,
      searchType: tabCurrentDetail.value.searchType,
      orderId,
      hosOrderId: item.hosOrderId,
      preWz: item.orderStatus === '10' && '1',
      thRegisterId: props.value.thRegisterId,
      _type,
      typeId,
    };
    tabCurrentDetail.value.typeId === 4 &&
      (query.cardNumber =
        pat.value?.cardNumber ?? gStores.userStore.patChoose?.cardNumber);
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/RegDetail', query),
    });
  };

  const handlerCancelReg = async (item: IRegistrationCardItem) => {
    dialogContent.value = '确认取消该订单?';
    isCancelOrderDialogShow.value = true;

    const { initialText } = await gStores.getSysAppMore(1282);
    initialText && (dialogContent.value = initialText);
    await new Promise((confirm) => {
      cancelOrderDialogConfirm = confirm;
    });
    isCancelOrderDialogShow.value = false;
    const regDetailUtil = RegDetailUtil.getInstance(
      {
        prop: ref(item),
        orderConfig: pageConfig,
      },
      true
    );
    await regDetailUtil.getDataDetail();
    await regDetailUtil.cancelReg();
    getList();
  };

  const cancelReg = async (item: IRegistrationCardItem) => {
    if (gStores.globalStore.sysCode === '1001093') {
      handlerCancelReg(item);
    } else {
      goDetail(item);
    }
  };

  //多院区院内导航
  const goHosNavigate = (item: IRegistrationCardItem) => {
    useTBanner(HosNavData[item.hosId](item), 'navigateTo', item);
  };

  const _patChange = (item) => {
    selPatId.value = item.patientId;
    pat.value = item;
  };

  const patientChange = async ({ item }) => {
    _patChange(item);
    await getList(item.patientId || '', item.cardNumber || '');

    if (item.patientId) {
      gStores.userStore.updatePatChoose(item);
    }
  };

  const orderStatusChange = async () => {
    getList(
      gStores.userStore.patChoose.patientId || '',
      gStores.userStore.patChoose.cardNumber || ''
    );
  };

  const getConfig = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('order');

    const { isHosNavigation, isQueuing, isFWBtn, selOrderStatusDefault } =
      pageConfig.value;

    if (isHosNavigation) {
      showYuanNeiDaoHanBtn.value = isHosNavigation;
    }

    if (isQueuing) {
      showPaiDuiJiaoHaoBtn.value = isQueuing;
    }

    if (isFWBtn) {
      showFWBtn.value = isFWBtn;
    }

    if (isShowFilterOrderStatus.value) {
      // '1' 全部挂号 '' 在线挂号
      selOrderStatus.value = tabCurrentDetail.value?.typeId === 1 ? '1' : '';
    }
  };

  onPullDownRefresh(async () => {
    await init();
    uni.stopPullDownRefresh();
  });

  onShow(() => {
    if (list.value.length) {
      patientChange({
        item: pat.value,
      });
    }
  });

  const pageHook = async ({ _isPatient = false }) => {
    const routeArg = {
      url: joinQueryForUrl('/pagesA/MyRegistration/MyRegistration', props),
      _isPatient: true,
    };

    if (pageConfig.value.isOrderWithoutPat === '1' && !_isPatient) {
      routeArg._isPatient = false;
    }

    await beforeEach(routeArg);
  };

  onLoad(async (opt) => {
    const { sysCode } = gStores.globalStore;
    tabs.value = [];
    if (sysCode !== '1001093') {
      tabs.value.push({
        typeId: 0,
        headerName: sysCode === '1001035' ? '小程序挂号' : '在线挂号',
      });
    }
    props.value = deQueryForUrl(deQueryForUrl(opt));
    await getConfig();
    isRender.value = true;
    const thRegisterId = props.value.thRegisterId;
    thRegisterId &&
      setLocalStorage({
        thRegisterId,
      });

    pageConfig.value.isCanSelOrderStatus === '1' &&
      tabs.value.push({
        typeId: 1,
        headerName: '全部挂号',
      });

    if (gStores.globalStore.sysCode === '1001035') {
      tabs.value.push({
        typeId: 3,
        headerName: '老版挂号',
        searchType: '1',
      });
    }
    if (gStores.globalStore.sysCode === '1001036') {
      tabs.value.push({
        typeId: 4,
        headerName: '远期预约（肾脏科）',
        searchType: '2',
      });
    }

    pageConfig.value.isTabWaitReg === '1' &&
      tabs.value.push({
        typeId: 2,
        headerName: '候补登记',
      });

    pageConfig.value.isCancelOlineReg === '1' &&
      (tabs.value = tabs.value.filter((item) => {
        return item?.typeId !== 0;
      }));

    if (props.value?.tabIndex) {
      tabCurrent.value = parseInt(props.value?.tabIndex);
    }

    if (props.value.typeId) {
      // tabCurrent.value = parseInt(props.value?.typeId);
      const idx = tabs.value.findIndex(
        (o) => o.typeId === (props.value.typeId as unknown as number) * 1
      );

      idx > -1 && (tabCurrent.value = idx);
    }

    await handlerWeChatThRegLogin(props.value);
    let _isPatient = true;
    if (pageConfig.value.isOrderWithoutPat === '1') {
      _isPatient = false;
    }

    await pageHook({
      _isPatient,
    });

    tabCurrentDetail.value = tabs.value[tabCurrent.value];
    await init();
  });

  onReady(() => {
    uni.setNavigationBarTitle({
      title: '我的挂号',
    });
  });

  const getPatLabel = (o) => {
    return (
      gStores.userStore.getPatName(o) +
      (isAreaProgram() ? '' : o.cardNumber ? `(${o.cardNumber})` : '')
    );
  };

  const init = async () => {
    if (tabCurrentDetail.value?.typeId === 1) {
      patList.value[0]?.patientName === '所有就诊人' &&
        (pat.value = patList.value[0]);
    }
    // await getList(s
    //   pat.value?.patientId || gStores.userStore.patChoose?.patientId
    // );
    setTimeout(() => {
      tabChange(tabCurrent.value);
    }, 0);
  };

  const patList = computed(() => {
    let list: any[] = [
      ...gStores.userStore.patList.map((o) => ({
        ...o,
        _showLabel: getPatLabel(o),
      })),
    ];
    ![1, 4].includes(tabCurrentDetail.value?.typeId) &&
      (list = [
        {
          patientId: '',
          patientName: '所有就诊人',
          _showLabel: '所有就诊人',
        },
        ...list,
      ]);
    return list;
  });

  const statusList = computed(() => {
    // return
    const _listStatus = [...new Set(list.value.map((o) => o.orderStatus))].map(
      (status) => ({
        label: getStatusConfig(
          status,
          isWaitReg.value || tabCurrentDetail.value?.typeId === 2
        ).title,
        value: status,
      })
    );

    return [
      {
        label: '全部状态',
        value: '',
      },
      ..._listStatus,
    ];
  });

  const selPatName = computed(() => {
    return (
      patList.value.find((o) => o.patientId === selPatId.value)?._showLabel ||
      `${gStores.userStore.patChoose.patientName}(${gStores.userStore.patChoose._showId})`
    );
  });

  const selStatusName = computed(() => {
    return (
      statusList.value.find((o) => o.value === selStatus.value)?.label || ''
    );
  });

  const selOrderStatusName = computed(() => {
    return (
      orderStatusList.value.find((o) => o.value === selOrderStatus.value)
        ?.label || ''
    );
  });

  const showList = computed(() => {
    const _filterStatus = list.value.filter((o) =>
      selStatus.value ? o.orderStatus === selStatus.value : true
    );

    return _filterStatus;
  });

  // init();
</script>

<style lang="scss" scoped>
  .g-container {
    padding: 0 32rpx;
    width: calc(100% - 64rpx);
  }
  .tab-box {
    padding: 0 10rpx;
    :deep(.v-tabs__container-item) {
      flex: 1;
      justify-content: center;
    }
  }

  .footer-btns {
    button {
      white-space: nowrap;

      &:not(:last-child) {
        margin-right: 16rpx;
      }
    }
  }
</style>
