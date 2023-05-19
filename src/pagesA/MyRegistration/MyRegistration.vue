<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <g-flag typeFg="405" isShowFg />
    <g-message />

    <view class="flex-normal header g-border-bottom f32">
      <view
        :class="{
          'sel-active': isSelStatus,
        }"
        class="flex-normal"
        @click="isSelStatus = !isSelStatus"
      >
        <view>{{ selStatusName }}</view>
        <view class="iconfont">&#xe6e8;</view>
      </view>

      <view
        :class="{
          'sel-active': isSelPatient,
        }"
        @click="isSelPatient = !isSelPatient"
        class="flex-normal"
      >
        <view>{{ selPatName }}</view>
        <view class="iconfont">&#xe6e8;</view>
      </view>
    </view>
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
          @ywz-click="ywzClick"
        />
      </block>

      <view class="empty-list" v-else-if="isComplete">
        <g-empty :current="1" />
      </view>
    </view>

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
        <view class="flex-normal header g-border-bottom f32">
          <view
            :class="{
              'sel-active': isSelStatus,
            }"
            class="flex-normal"
            @click="isSelStatus = !isSelStatus"
          >
            <view>{{ selStatusName }}</view>
            <view class="iconfont">&#xe6e8;</view>
          </view>

          <view
            :class="{
              'sel-active': isSelPatient,
            }"
            @click="isSelPatient = !isSelPatient"
            class="flex-normal"
          >
            <view>{{ selPatName }}</view>
            <view class="iconfont">&#xe6e8;</view>
          </view>
        </view>
      </template>
    </g-select>

    <g-select
      v-model:value="selPatId"
      v-model:show="isSelPatient"
      :option="patList"
      :field="{
        label: '_showLabel',
        value: '_showLabel',
      }"
      @change="patientChange"
      type="top"
    >
      <template #header>
        <view class="flex-normal header g-border-bottom f32">
          <view
            :class="{
              'sel-active': isSelStatus,
            }"
            class="flex-normal"
            @click="isSelStatus = !isSelStatus"
          >
            <view>{{ selStatusName }}</view>
            <view class="iconfont">&#xe6e8;</view>
          </view>

          <view
            :class="{
              'sel-active': isSelPatient,
            }"
            @click="isSelPatient = !isSelPatient"
            class="flex-normal"
          >
            <view>{{ selPatName }}</view>
            <view class="iconfont">&#xe6e8;</view>
          </view>
        </view>
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
  import {
    GStores,
    ServerStaticData,
    ISystemConfig,
    TButtonConfig,
    useTBanner,
  } from '@/utils';
  import { computed, ref } from 'vue';
  import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';

  import {
    OrderStatus,
    orderStatusMap,
    getOrderStatusTitle,
  } from './utils/regDetail';
  import { IRegistrationCardItem } from './utils/MyRegistration';
  import { isAreaProgram } from '@/stores';

  import api from '@/service/api';

  import MyRegistrationListCard from './components/MyRegistrationListCard/MyRegistrationListCard.vue';

  const gStores = new GStores();
  const isSelPatient = ref(false);
  const isSelStatus = ref(false);
  const isComplete = ref(false);

  const showYuanNeiDaoHanBtn = ref<string[]>([]);
  const showPaiDuiJiaoHaoBtn = ref<string[]>([]);
  const showFWBtn = ref<string[]>([]);

  const list = ref<IRegistrationCardItem[]>([]);
  const orderConfig = ref<ISystemConfig['order']>({} as ISystemConfig['order']);

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
        title: '未知',
        cardColr: 'var(--hr-neutral-color-7)',
      };
    }
  };

  const getList = async (patientId = '') => {
    isComplete.value = false;
    list.value = [];
    const { result } = await api
      .getRegOrderList<IRegistrationCardItem[]>({
        source: gStores.globalStore.browser.source,
        herenId: gStores.globalStore.herenId,
        patientId,
      })
      .finally(() => {
        isComplete.value = true;
      });

    if (result && result.length) {
      result.map(async (o) => {
        // o.orderStatus = '0';
        o._statusLabel = getOrderStatusTitle(
          o.orderStatus,
          orderConfig.value.isOrderPay
        );

        if (o._statusLabel === '未知') {
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
        hosDeptId
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
    await getList(item.patientId || '');

    if (item._showId) {
      gStores.userStore.updatePatChoose(item);
    }
  };

  let _firstIn = true;
  const getConfig = async () => {
    orderConfig.value = await ServerStaticData.getSystemConfig('order');

    const { isHosNavigation, isQueuing, isFWBtn, isOrderPay } =
      orderConfig.value;

    if (isHosNavigation) {
      showYuanNeiDaoHanBtn.value = isHosNavigation;
    }

    if (isQueuing) {
      showPaiDuiJiaoHaoBtn.value = isQueuing;
    }

    if (isFWBtn) {
      showFWBtn.value = isFWBtn;
    }

    if (_firstIn) {
      const o = gStores.userStore.patChoose;
      _firstIn = false;
      selPatId.value = getPatLabel(o);
    }
  };

  onPullDownRefresh(async () => {
    await init();
    uni.stopPullDownRefresh();
  });

  onShow(() => {
    init();
  });

  const getPatLabel = (o) => {
    return (
      o.patientNameEncry +
      (isAreaProgram() ? '' : o.cardNumber ? `(${o.cardNumber})` : '')
    );
  };

  const init = async () => {
    await getConfig();
    const item = patList.value.find(
      (o: any) => getPatLabel(o) === selPatId.value
    );

    await getList(item?.patientId || '');
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
    return selPatId.value;
  });

  const selStatusName = computed(() => {
    return statusList.value.find((o) => o.value === selStatus.value)?.label;
  });

  const showList = computed(() => {
    const _filterStatus = list.value.filter((o) =>
      selStatus.value ? o.orderStatus === selStatus.value : true
    );

    return _filterStatus;
  });

  const selPatId = ref('');
  const selStatus = ref('');

  // init();
</script>

<style lang="scss" scoped>
  .header {
    background-color: #fff;
    > view {
      flex: 1;
      justify-content: center;
      padding: 24rpx 0;
    }

    .sel-active {
      font-weight: 600;
      color: var(--hr-brand-color-6);
      .iconfont {
        transform: rotate(0.5turn);
        // color: var(--hr-neutral-color-9);
      }
    }
  }

  .g-container {
    padding: 0 32rpx;
    width: calc(100% - 64rpx);
  }
</style>
