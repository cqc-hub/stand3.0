<template>
  <view class="g-page">
    <g-flag typeFg="405" isShowFg />

    <view class="flex-normal header g-border-bottom">
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
          :showPaiDuiJiaoHaoBtn="showPaiDuiJiaoHaoBtn"
          :showFWBtn="showFWBtn"
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
        <view class="flex-normal header g-border-bottom">
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
      type="top"
    >
      <template #header>
        <view class="flex-normal header g-border-bottom">
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
  import { GStores, ServerStaticData } from '@/utils';
  import { computed, ref } from 'vue';
  import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';

  import api from '@/service/api';
  import { OrderStatus, orderStatusMap } from './utils/regDetail';
  import { IRegistrationCardItem } from './utils/MyRegistration';
  import MyRegistrationListCard from './components/MyRegistrationListCard/MyRegistrationListCard.vue';

  // api.getRegOrderList = (() =>
  //   Promise.resolve({
  //     result: [
  //       {
  //         sysCode: '1001033',
  //         deptName: '眼科',
  //         ampm: '2',
  //         orderId: '2210252785400048',
  //         patientId: '222980921',
  //         numId: '20221029820200605000000000045221',
  //         hosDeptId: '10206000',
  //         idCard: '1101**********7438',
  //         fee: 12,
  //         ampmName: '下午',
  //         hisResult: '',
  //         orderStatus: '10',
  //         source: 19,
  //         upIdCard: '',
  //         schId: '20200605000000000045',
  //         visitingArea: '',
  //         docName: '林优',
  //         categorName: '普通',
  //         appointmentTime: '17:00',
  //         clinicalType: '1',
  //         hosName: '台州第一人民医院',
  //         patientName: '大洒店',
  //         cardType: '19',
  //         appointmentNumber: '21',
  //         hosId: '1279',
  //         herenId: 4276159,
  //         patientPhone: '138****9891',
  //         filing: '',
  //         hosOrderId: '2022102500000008',
  //         createTime: '2022-10-25T07:44:17.000+0000',
  //         categor: '2',
  //         hosDocId: '0000003060',
  //         appointmentDate: '2022-10-25',
  //         cardNumber: '10831186',
  //         schQukCategor: '眼科林优[普]',
  //       },
  //       {
  //         sysCode: '1001033',
  //         deptName: '眼科',
  //         ampm: '2',
  //         orderId: '2210252782900033',
  //         patientId: '222980921',
  //         numId: '20221029820200605000000000045221',
  //         hosDeptId: '10206000',
  //         idCard: '1101**********7438',
  //         fee: 12,
  //         ampmName: '下午',
  //         hisResult: '',
  //         orderStatus: '45',
  //         source: 19,
  //         upIdCard: '',
  //         schId: '20200605000000000045',
  //         visitingArea: '',
  //         docName: '林优',
  //         categorName: '普通',
  //         appointmentTime: '17:00',
  //         clinicalType: '1',
  //         hosName: '台州第一人民医院',
  //         patientName: '大洒店',
  //         cardType: '19',
  //         appointmentNumber: '21',
  //         hosId: '1279',
  //         herenId: 4276159,
  //         patientPhone: '138****9891',
  //         filing: '',
  //         hosOrderId: '2022102500000007',
  //         createTime: '2022-10-25T07:43:49.000+0000',
  //         categor: '2',
  //         hosDocId: '0000003060',
  //         appointmentDate: '2022-10-25',
  //         cardNumber: '10831186',
  //         schQukCategor: '眼科林优[普]',
  //       },
  //       {
  //         sysCode: '1001033',
  //         deptName: '眼科',
  //         ampm: '2',
  //         orderId: '2210252636900026',
  //         patientId: '222980921',
  //         numId: '20221029820200605000000000045218',
  //         hosDeptId: '10206000',
  //         idCard: '1101**********7438',
  //         fee: 12,
  //         ampmName: '下午',
  //         hisResult: '',
  //         orderStatus: '45',
  //         source: 19,
  //         upIdCard: '',
  //         schId: '20200605000000000045',
  //         visitingArea: '',
  //         docName: '林优',
  //         categorName: '普通',
  //         appointmentTime: '16:00',
  //         clinicalType: '1',
  //         hosName: '台州第一人民医院',
  //         patientName: '大洒店',
  //         cardType: '19',
  //         appointmentNumber: '18',
  //         hosId: '1279',
  //         herenId: 4276159,
  //         patientPhone: '138****9891',
  //         filing: '',
  //         hosOrderId: '2022102500000006',
  //         createTime: '2022-10-25T07:19:29.000+0000',
  //         categor: '2',
  //         hosDocId: '0000003060',
  //         appointmentDate: '2022-10-25',
  //         cardNumber: '10831186',
  //         schQukCategor: '眼科林优[普]',
  //       },
  //       {
  //         sysCode: '1001033',
  //         deptName: '眼科',
  //         ampm: '2',
  //         orderId: '2210252486200019',
  //         patientId: '222980921',
  //         numId: '20221029820200605000000000045238',
  //         hosDeptId: '10206000',
  //         idCard: '1101**********7438',
  //         fee: 12,
  //         ampmName: '下午',
  //         hisResult: '',
  //         orderStatus: '82',
  //         source: 19,
  //         upIdCard: '',
  //         schId: '20200605000000000045',
  //         visitingArea: '',
  //         docName: '林优',
  //         categorName: '普通',
  //         appointmentTime: '21:00',
  //         clinicalType: '1',
  //         hosName: '台州第一人民医院',
  //         patientName: '大洒店',
  //         cardType: '19',
  //         appointmentNumber: '38',
  //         hosId: '1279',
  //         herenId: 4276159,
  //         patientPhone: '138****9891',
  //         filing: '',
  //         hosOrderId: '2022102500000005',
  //         createTime: '2022-10-25T06:54:23.000+0000',
  //         categor: '2',
  //         hosDocId: '0000003060',
  //         appointmentDate: '2022-10-25',
  //         cardNumber: '10831186',
  //         schQukCategor: '眼科林优[普]',
  //       },
  //       {
  //         sysCode: '1001033',
  //         deptName: '眼科',
  //         ampm: '2',
  //         orderId: '2210170945300013',
  //         patientId: '922989238',
  //         numId: '2022102932020070200000000003427',
  //         hosDeptId: '10206000',
  //         idCard: '3303**********6713',
  //         fee: 15,
  //         ampmName: '下午',
  //         hisResult: '',
  //         orderStatus: '82',
  //         source: 19,
  //         upIdCard: '',
  //         schId: '20200702000000000034',
  //         visitingArea: '',
  //         docName: '林优',
  //         categorName: '假日',
  //         appointmentTime: '14:00',
  //         clinicalType: '1',
  //         hosName: '台州第一人民医院',
  //         patientName: '陈钦川',
  //         cardType: '19',
  //         appointmentNumber: '7',
  //         hosId: '1279',
  //         herenId: 4276159,
  //         patientPhone: '138****9891',
  //         filing: '',
  //         hosOrderId: '2022102000000005',
  //         createTime: '2022-10-17T02:37:33.000+0000',
  //         categor: '3',
  //         hosDocId: '0000003060',
  //         appointmentDate: '2022-10-20',
  //         cardNumber: '10830963',
  //         schQukCategor: '节假日眼科林优',
  //       },
  //       {
  //         sysCode: '1001033',
  //         deptName: '眼科',
  //         ampm: '2',
  //         orderId: '2210143304200018',
  //         patientId: '922989238',
  //         numId: '20221028720200605000000000045226',
  //         hosDeptId: '10206000',
  //         idCard: '3303**********6713',
  //         fee: 12,
  //         ampmName: '下午',
  //         hisResult: '',
  //         orderStatus: '82',
  //         source: 19,
  //         upIdCard: '',
  //         schId: '20200605000000000045',
  //         visitingArea: '',
  //         docName: '林优',
  //         categorName: '普通',
  //         appointmentTime: '18:00',
  //         clinicalType: '1',
  //         hosName: '台州第一人民医院',
  //         patientName: '陈钦川',
  //         cardType: '19',
  //         appointmentNumber: '26',
  //         hosId: '1279',
  //         herenId: 4276159,
  //         patientPhone: '138****9891',
  //         filing: '',
  //         hosOrderId: '2022101400000001',
  //         createTime: '2022-10-14T09:10:44.000+0000',
  //         categor: '2',
  //         hosDocId: '0000003060',
  //         appointmentDate: '2022-10-14',
  //         cardNumber: '10830963',
  //         schQukCategor: '眼科林优[普]',
  //       },
  //     ],
  //     timeTaken: 30,
  //     code: 0,
  //     functionVersion: '[{"functionType":"2","version":"v0.0.2"}]',
  //     innerMessage: '成功',
  //     message: '成功',
  //     respCode: 0,
  //   })) as any;

  const gStores = new GStores();
  const isSelPatient = ref(false);
  const isSelStatus = ref(false);
  const isComplete = ref(false);

  const showYuanNeiDaoHanBtn = ref<string[]>([]);
  const showPaiDuiJiaoHaoBtn = ref<string[]>([]);
  const showFWBtn = ref<string[]>([]);

  const list = ref<IRegistrationCardItem[]>([]);

  const isCancelOrderDialogShow = ref(false);
  const dialogContent = ref('');
  let cancelOrderDialogConfirm: (any) => any = async () => {};

  const getStatusConfig = (status: OrderStatus) => {
    if (orderStatusMap[status]) {
      return orderStatusMap[status];
    } else {
      return {
        title: '未知的状态',
        cardColr: 'var(--hr-neutral-color-7)',
      };
    }
  };

  const getList = async () => {
    isComplete.value = false;
    const { result } = await api
      .getRegOrderList<IRegistrationCardItem[]>({
        source: gStores.globalStore.browser.source,
        herenId: gStores.globalStore.herenId,
      })
      .finally(() => {
        isComplete.value = true;
      });

    if (result && result.length) {
      result.map((o) => {
        o._statusLabel = getStatusConfig(o.orderStatus).title;
      });
    }

    list.value = result || [];
  };

  let _firstIn = true;
  const getConfig = async () => {
    const { isHosNavigation, isQueuing, isFWBtn } =
      await ServerStaticData.getSystemConfig('order');

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
      selPatId.value =
        o.patientName + (o.cardNumber ? `(${o.cardNumber})` : '');
    }
  };

  onPullDownRefresh(async () => {
    await init();
    uni.stopPullDownRefresh();
  });

  onShow(() => {
    init();
  });

  const init = async () => {
    await getConfig();
    await getList();
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
        _showLabel: o.patientName + (o.cardNumber ? `(${o.cardNumber})` : ''),
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
    // return patList.value.find((o) => o.patientId === selPatId.value)
    //   ?.patientName;
  });

  const selStatusName = computed(() => {
    return statusList.value.find((o) => o.value === selStatus.value)?.label;
  });

  const showList = computed(() => {
    const _filterStatus = list.value.filter((o) =>
      selStatus.value ? o.orderStatus === selStatus.value : true
    );

    const _filterPat = _filterStatus.filter((o) =>
      selPatId.value === '所有就诊人'
        ? true
        : selPatId.value
        ? o.patientName === selPatId.value.split('(')[0]
        : true
    );
    return _filterPat;
  });

  const selPatId = ref('');
  const selStatus = ref('');

  init();
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
      }
    }
  }

  .g-container {
    padding: 0 32rpx;
    width: calc(100% - 64rpx);
  }
</style>
