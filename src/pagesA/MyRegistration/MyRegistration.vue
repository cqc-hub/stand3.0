<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <g-flag
      v-if="isRender"
      :typeFg="isWaitReg || tabCurrent === 2 ? '1113' : '405'"
      isShowFg
    />
    <g-message />

    <g-choose-pat v-if="isWaitReg" @choose-pat="patientChange" />

    <view
      v-if="pageConfig.MyRegistrationNavBtns && !isWaitReg"
      class="p32c pt12 pb12"
    >
      <g-tbbtns :btns="pageConfig.MyRegistrationNavBtns" />
    </view>
    <view class="tab-box" v-show="tabs.length > 1 && !isWaitReg">
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
      v-if="!isWaitReg"
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
          :isWaitReg="isWaitReg || tabCurrent === 2"
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
        />
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
      @confirmButton="cancelOrderDialogConfirm"
    />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onPullDownRefresh, onShow, onLoad } from '@dcloudio/uni-app';

  import { IRegistrationCardItem } from './utils/MyRegistration';
  import { isAreaProgram, IPat } from '@/stores';
  import { deQueryForUrl, joinQueryForUrl, setLocalStorage } from '@/common';
  import { beforeEach } from '@/router';

  import {
    GStores,
    ServerStaticData,
    ISystemConfig,
    TButtonConfig,
    useTBanner,
    handlerWeChatThRegLogin,
    wait,
  } from '@/utils';
  import {
    OrderStatus,
    orderStatusMap,
    getOrderStatusTitle,
  } from './utils/regDetail';

  import api from '@/service/api';

  import MyRegistrationListCard from './components/MyRegistrationListCard/MyRegistrationListCard.vue';
  import MyRegistrationHead from './components/MyRegistrationHead/MyRegistrationHead.vue';

  const props = ref(
    <
      {
        thRegisterId?: string;
        allPData?: '1';
        type?: 'waitReg'; // 候补预约
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
  const pageConfig = ref<ISystemConfig['order']>({} as ISystemConfig['order']);
  // 已改 begin
  const tabCurrent = ref(0);
  const tabCurrentDetail = ref({
    typeId: 0,
    headerName: '在线挂号',
  });
  const tabs = ref([
    {
      typeId: 0,
      headerName: '在线挂号',
    },
  ]);
  //已改 end
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
    return tabCurrentDetail.value.typeId === 1
      ? api.hosRegOrderList
      : tabCurrentDetail.value.typeId === 0
      ? api.getRegOrderList
      : api.getAlternateList;
  });

  const isCancelOrderDialogShow = ref(false);
  const dialogContent = ref('');
  let cancelOrderDialogConfirm: (any) => any = async () => {};

  const isShowReOrderBtn = computed(
    () => pageConfig.value.isOpenReOrder === '1'
  );

  const isShowYuWzBtn = computed(
    () =>
      pageConfig.value.isOpenPreConsultation === '1' && tabCurrent.value === 0
  );

  const tabChange = async (e: number) => {
    tabCurrent.value = e;
    tabCurrentDetail.value = tabs.value[tabCurrent.value];
    // pat.value = patList.value[0];
    if (!pat.value?.patientId && e) {
      _patChange(gStores.userStore.patChoose);
    }
    const patientId =
      pat.value?.patientId ?? gStores.userStore.patChoose?.patientId;
    await getList(patientId);
  };

  const getStatusConfig = (status: OrderStatus) => {
    if (orderStatusMap[status]) {
      return orderStatusMap[status];
    } else {
      return {
        title: `未知(${status})`,
        cardColor: 'var(--hr-neutral-color-7)',
      };
    }
  };

  const getList = async (patientId = '') => {
    isComplete.value = false;
    list.value = [];
    const { result } = await listApi
      .value<IRegistrationCardItem[]>({
        source: gStores.globalStore.browser.source,
        herenId: gStores.globalStore.herenId,
        patientId,
      })
      .finally(() => {
        isComplete.value = true;
      });
    console.log('getList', result, isWaitReg.value);
    if (result && result.length) {
      result.map(async (o) => {
        // o.orderStatus = '70';
        o._statusLabel = getOrderStatusTitle(
          o.orderStatus,
          pageConfig.value.isOrderPay,
          isWaitReg.value || tabCurrent.value === 2
        );

        if (o._statusLabel.startsWith('未知')) {
          // @ts-expect-error
          o.orderStatus = '--';
        }
      });
    }

    list.value = result || [];
  };

  const ywzClick = async (item: IRegistrationCardItem) => {
    if (pageConfig.value.preConsultationBtn) {
      //指定的预问诊跳转
      useTBanner(pageConfig.value.preConsultationBtn, 'navigateTo', item);
    } else {
      const { orderId, hosDeptId, hosOrderId, hosData } = item;
      const patientId = isShowFilterOrderStatus.value
        ? pat.value?.patientId || gStores.userStore.patChoose?.patientId
        : '';
      const preConsultation: TButtonConfig = {
        type: 'h5',
        isSelfH5: '1',
        // path: 'pages/inquiries/inquiries3',
        path: 'pagesC/inquiries/inquiriesRes1',
        text: '预问诊',
        extraData: {
          orderId,
          hosDeptId,
          hosOrderId,
          hosData,
          patientId,
        },
        addition: {
          token: 'token',
          herenId: 'herenId',
        },
      };
      useTBanner(preConsultation);
    }
  };

  const goDetail = (item: IRegistrationCardItem) => {
    const { patList } = gStores.userStore;
    const { patientId } = item;

    if (patientId && patList.length) {
      const pat = patList.find((o) => o.patientId === patientId);

      if (pat) {
        gStores.userStore.updatePatChoose(pat);
      }
    }
    let _type = props.value.type;
    if (props.value.type !== 'waitReg' && tabCurrent.value === 2) {
      _type = 'waitReg';
    }
    console.log('/pagesA/MyRegistration/RegDetail', {
      ...item,
      orderId: item.orderId,
      hosOrderId: item.hosOrderId,
      preWz: item.orderStatus === '10' && '1',
      thRegisterId: props.value.thRegisterId,
      _type,
    });
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/RegDetail', {
        ...item,
        orderId: item.orderId,
        hosOrderId: item.hosOrderId,
        preWz: item.orderStatus === '10' && '1',
        thRegisterId: props.value.thRegisterId,
        _type,
      }),
    });
  };

  const _patChange = (item) => {
    selPatId.value = item.patientId;
    pat.value = item;
  };

  const patientChange = async ({ item }) => {
    _patChange(item);
    await getList(item.patientId || '');

    if (item.patientId) {
      gStores.userStore.updatePatChoose(item);
    }
  };

  const orderStatusChange = async () => {
    getList(gStores.userStore.patChoose.patientId || '');
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
      selOrderStatus.value = tabCurrent.value === 0 ? '1' : '';
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

  onLoad(async (opt) => {
    props.value = deQueryForUrl(deQueryForUrl(opt));
    isRender.value = true;

    uni.setNavigationBarTitle({
      title: isWaitReg.value ? '候补记录' : '我的挂号',
    });

    await handlerWeChatThRegLogin(props.value);
    await beforeEach({
      url: joinQueryForUrl('/pagesA/MyRegistration/MyRegistration', props),
      _isPatient: true,
    });
    await init();

    const thRegisterId = props.value.thRegisterId;
    thRegisterId &&
      setLocalStorage({
        thRegisterId,
      });

    // 已改 begin
    pageConfig.value.isCanSelOrderStatus === '1' &&
      tabs.value.push({
        typeId: 1,
        headerName: '全部挂号',
      });
    pageConfig.value.isTabWaitReg === '1' &&
      tabs.value.push({
        typeId: 2,
        headerName: '候补挂号',
      });

    // 已改 end
  });

  const getPatLabel = (o) => {
    return (
      o.patientNameEncry +
      (isAreaProgram() ? '' : o.cardNumber ? `(${o.cardNumber})` : '')
    );
  };

  const init = async () => {
    await getConfig();
    patList.value[0]?.patientName === '所有就诊人' &&
      (pat.value = patList.value[0]);
    // await getList(
    //   pat.value?.patientId || gStores.userStore.patChoose?.patientId
    // );
    tabChange(0);
  };

  const patList = computed(() => {
    let list: any[] = [
      ...gStores.userStore.patList.map((o) => ({
        ...o,
        _showLabel: getPatLabel(o),
      })),
    ];
    tabCurrent.value !== 1 &&
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
        label: getStatusConfig(status).title,
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
</style>
