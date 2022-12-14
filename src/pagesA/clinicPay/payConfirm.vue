<template>
  <view class="g-page">
    <view class="my-display-none">
      <g-selhos :hosId="pageProps.hosId" @get-list="getHosList" />
    </view>

    <view class="g-container">
      <view class="head-bg" />

      <view v-if="isComplete" class="container">
        <view class="g-border box page-first-item">
          <view class="g-bold f36 g-break-word">门诊医生支付订单</view>

          <view class="flex-normal f28 mt24">
            <text class="mr16 color-888">支付给</text>
            <text class="color-444">{{ getHosName }}</text>
          </view>
        </view>

        <view class="g-border box mt16 f32">
          <view
            v-for="(item, idx) in details"
            :key="item.key"
            :class="{
              mb32: idx !== details.length - 1,
            }"
            class="row flex-between mb32"
          >
            <view class="label">{{ item.label }}</view>
            <view
              :class="{
                'color-error': item.key === 'totalNeedSelfpay',
              }"
              class="value g-bold"
            >
              {{ info[item.key] || 0 }}元
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="isComplete" class="g-footer">
      <view class="flex1 flex-normal count-money">
        <text class="color-444 f28 mr8">自费支付</text>
        <text class="f36 g-bold color-error">
          {{ info.totalNeedSelfpay || '' }}元
        </text>
      </view>

      <button @click="refPay.show" class="btn g-border btn-warning pay-btn">
        缴费
      </button>
    </view>

    <g-pay
      :list="refPayList"
      :autoPayArg="payArg"
      @pay-success="payAfter"
      @pay-click="getPayInfo"
      autoInOne
      ref="refPay"
    >
      <!-- <g-flag typeFg="32" isShowFgTip /> -->
    </g-pay>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { type TPayConfirmPageProp } from './utils/clinicPayDetail';
  import { encryptForPage, decryptForPage } from '@/common/des';
  import { deQueryForUrl } from '@/common';
  import { GStores, type IHosInfo, wait } from '@/utils';
  import {
    type IGPay,
    payMoneyOnline,
    toPayPull,
  } from '@/components/g-pay/index';

  import api from '@/service/api';

  const pageProps = ref(<TPayConfirmPageProp>{});
  const gStores = new GStores();
  const isComplete = ref(false);
  const hosList = ref<IHosInfo[]>([]);
  const refPay = ref<any>('');
  const details = ref([
    {
      label: '订单总额',
      key: 'totalCharges',
    },
    {
      label: '医保支付',
      key: 'medicalMoney',
    },
    {
      label: '院内账户支付',
      key: 'accountMoney',
    },
    {
      label: '自费支付',
      key: 'totalNeedSelfpay',
    },
  ]);
  const refPayList = ref([
    {
      label: '在线支付',
      key: 'online',
    },
  ]);
  const payArg = ref<BaseObject>({});

  const info = ref(
    <
      {
        totalNeedSelfpay: string;
        totalCharges: string;
        visitNo: string;
        serialNo: string;
        cardNumber: string;
        patientName: string;
        hosId: string;
        childOrder: string;
      }
    >{}
  );

  const getData = async () => {
    if (pageProps.value.deParams) {
      getScanData();
    } else {
      getNormalData();
    }
  };

  const getNormalData = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const { hosId, serialNo, visitNo } = pageProps.value;
    isComplete.value = false;
    const { result } = await api.getClinicReservePay<any>({
      patientId,
      hosId,
      serialNo,
      visitNo,
      cardNumber: pageProps.value.cardNumber,
    });

    isComplete.value = true;
    info.value = result;
  };

  const getScanData = async () => {
    const { serialNo, visitNo, cardNumber, hosId } = pageProps.value.deParams!;

    isComplete.value = false;
    const arg = {
      serialNo,
      visitNo,
      cardNumber,
      hosId,
    };
    const { result } = await api.getScanClinicReservePay<any>({
      ...arg,
      desSecret: pageProps.value.params,
    });

    isComplete.value = true;
    info.value = result;
  };

  const getHosName = computed(() => {
    if (info.value.hosId) {
      return (
        hosList.value.find((o) => o.hosId == info.value.hosId)?.hosName || ''
      );
    } else {
      return '';
    }
  });

  const getHosList = ({ list }) => {
    hosList.value = list;

    init();
  };

  const getPayInfo = async ({ item }: { item: IGPay }) => {
    if (item.key === 'online') {
      toPay();
    }
  };

  const toPay = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const _totalCost = info.value.totalNeedSelfpay + '';
    const patientName = info.value.patientName;
    const source = gStores.globalStore.browser.source;

    const { visitDate, mergeOrder } = pageProps.value;
    const { hosId, visitNo, serialNo, childOrder } = info.value;
    const args = {
      businessType: '1',
      patientId,
      source,
      totalCost: _totalCost,
      hosId,
      hosName: getHosName.value,
      visitDate,
      serialNo,
      visitNo,
      mergeOrder: childOrder,
    };

    const {
      result: { phsOrderNo },
    } = await api.createClinicOrder(args);

    const res = await payMoneyOnline({
      phsOrderNo,
      totalFee: _totalCost,
      phsOrderSource: '2',
      hosId,
      hosName: getHosName.value,
      patientName,
      // hosId: '1279',
    });

    await toPayPull(res, '门诊缴费');
    payAfter();
  };

  const payAfter = async () => {
    uni.showLoading({});
    await wait(1000);
    uni.hideLoading();

    uni.reLaunch({
      url: '/pagesA/clinicPay/clinicPayDetail?tabIndex=1',
    });
  };

  const init = () => {
    getData();
  };

  onLoad(async (opt) => {
    if (opt.q) {
      return;
    }

    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));

      if (pageProps.value.params) {
        pageProps.value.deParams = decryptForPage(pageProps.value.params);
      }
    }

    // console.log(pageProps.value);
  });

  setTimeout(() => {
    // regDialogConfirm.value.show();
    const a = {
      serialNo: 'eb2ad98ea4e847b092b875a560648d58',
      visitNo: '20221213005816',
      hosId: '13001',
      cardNumber: '000001949',
    };

    const en = encryptForPage(a);
    console.log(en);
    console.log(decryptForPage(en));
  }, 1000);
</script>

<style lang="scss" scoped>
  .head-bg {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;

    &::after {
      content: '';
      display: block;
      height: 400rpx;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      background: linear-gradient(
        0deg,
        rgba(41, 111, 255, 0) 1%,
        #296fff 38%,
        #296fff 96%
      );
    }
  }

  .container {
    position: relative;
    z-index: 2;
    padding: 0 32rpx;

    .box {
      background: #ffffff;
      border-radius: 8px;
      padding: 32rpx;
    }
  }

  .page-first-item {
    margin-top: 48rpx;
  }

  .count-money {
    margin-right: 24rpx;
  }

  .pay-btn {
    flex: 0.8;
  }
</style>
