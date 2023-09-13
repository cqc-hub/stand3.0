<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <g-flag typeFg="405" isShowFg />
    <g-message />
    <g-choose-pat v-if="isShowFilterOrderStatus" @choose-pat="patientChange" />

    <My-Registration-Head
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
          :list="showList"
          :showYuanNeiDaoHanBtn="showYuanNeiDaoHanBtn"
          :isShowYuWzBtn="isShowYuWzBtn"
          :showPaiDuiJiaoHaoBtn="showPaiDuiJiaoHaoBtn"
          :showReOrderBtn="isShowReOrderBtn"
          :systemModeOld="gStores.globalStore.modeOld"
          :showFWBtn="showFWBtn"
          :config="orderConfig"
          :thRegisterId="thRegisterId"
          @ywz-click="ywzClick"
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
  import { joinQueryForUrl, setLocalStorage } from '@/common';
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
    OrderStatus,
    orderStatusMap,
    getOrderStatusTitle,
  } from './utils/regDetail';

  import api from '@/service/api';

  import MyRegistrationListCard from './components/MyRegistrationListCard/MyRegistrationListCard.vue';
  import MyRegistrationHead from './components/MyRegistrationHead/MyRegistrationHead.vue';

  const props = defineProps<{
    thRegisterId?: string;
    allPData?: '1';
  }>();
  const gStores = new GStores();
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
  const orderConfig = ref<ISystemConfig['order']>({} as ISystemConfig['order']);

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

  const isShowFilterOrderStatus = computed(() => {
    // return false;
    return orderConfig.value.isCanSelOrderStatus === '1';
  });

  const listApi = computed(() => {
    return isShowFilterOrderStatus.value
      ? api.hosRegOrderList
      : api.getRegOrderList;
  });

  const isCancelOrderDialogShow = ref(false);
  const dialogContent = ref('');
  let cancelOrderDialogConfirm: (any) => any = async () => {};

  const isShowReOrderBtn = computed(
    () => orderConfig.value.isOpenReOrder === '1'
  );

  const isShowYuWzBtn = computed(
    () => orderConfig.value.isOpenPreConsultation === '1'
  );

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

    if (result && result.length) {
      result.map(async (o) => {
        // o.orderStatus = '70';
        o._statusLabel = getOrderStatusTitle(
          o.orderStatus,
          orderConfig.value.isOrderPay
        );

        if (o._statusLabel.startsWith('未知')) {
          o.orderStatus = '--';
        }
      });
    }

    list.value = result || [];
  };

  const ywzClick = async (item: IRegistrationCardItem) => {
    const { orderId, hosDeptId } = item;

    const preConsultation: TButtonConfig = {
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/inquiries/inquiriesRes1',
      text: '预问诊',
      extraData: {
        orderId,
        hosDeptId,
      },
      addition: {
        token: 'token',
        herenId: 'herenId',
      },
      // isLocal: '1',
    };

    useTBanner(preConsultation);
  };

  const patientChange = async ({ item }) => {
    pat.value = item;
    await getList(item.patientId || '');

    if (item.patientId) {
      gStores.userStore.updatePatChoose(item);
    }
  };

  const getConfig = async () => {
    orderConfig.value = await ServerStaticData.getSystemConfig('order');

    const { isHosNavigation, isQueuing, isFWBtn } = orderConfig.value;

    if (isHosNavigation) {
      showYuanNeiDaoHanBtn.value = isHosNavigation;
    }

    if (isQueuing) {
      showPaiDuiJiaoHaoBtn.value = isQueuing;
    }

    if (isFWBtn) {
      showFWBtn.value = isFWBtn;
    }
  };

  onPullDownRefresh(async () => {
    await init();
    uni.stopPullDownRefresh();
  });

  onShow(() => {
    if (list.value.length) {
      init();
    }
  });

  onLoad(async () => {
    await handlerWeChatThRegLogin(props);
    await beforeEach({
      url: joinQueryForUrl('/pagesA/MyRegistration/MyRegistration', props),
      _isPatient: true,
    });
    await init();

    const thRegisterId = props.thRegisterId;
    thRegisterId &&
      setLocalStorage({
        thRegisterId,
      });
  });

  const getPatLabel = (o) => {
    return (
      o.patientNameEncry +
      (isAreaProgram() ? '' : o.cardNumber ? `(${o.cardNumber})` : '')
    );
  };

  const init = async () => {
    await getConfig();
    await getList(
      isShowFilterOrderStatus.value
        ? gStores.userStore.patChoose?.patientId
        : ''
    );
  };

  const patList = computed(() => {
    return [
      {
        patientId: '',
        patientName: '所有就诊人',
        _showLabel: '所有就诊人',
      },
      ...gStores.userStore.patList.map((o) => ({
        ...o,
        _showLabel: getPatLabel(o),
      })),
    ];
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
    return patList.value.find((o) => o.patientId === selPatId.value)
      ?._showLabel;
  });

  const selStatusName = computed(() => {
    return statusList.value.find((o) => o.value === selStatus.value)?.label;
  });

  const selOrderStatusName = computed(() => {
    return orderStatusList.value.find((o) => o.value === selOrderStatus.value)
      ?.label;
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
</style>
