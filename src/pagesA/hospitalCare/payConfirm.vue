<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <view class="my-display-none">
      <g-selhos @get-list="getHosList" />
    </view>

    <view class="g-container">
      <view class="head-bg" />

      <view v-if="isComplete" class="container">
        <view class="g-border box page-first-item">
          <view class="g-bold f36 g-break-word">自费出院结算订单</view>

          <view class="flex-normal f28 mt24">
            <text class="mr16 color-888">支付给</text>
            <text class="color-444">{{ pageProps.hosName }}</text>
          </view>
        </view>

        <view class="g-border box mt16 f32">
          <view
            v-for="(item, idx) in details"
            :key="item.key"
            :class="{
              mb32: idx !== details.length - 1,
            }"
            class="row flex-between"
          >
            <view class="label">{{ item.label }}</view>
            <view
              v-if="item.key"
              :class="{
                'color-error': item.key === 'totalNeedSelfpay',
              }"
              class="value g-bold"
            >
              {{ info[item.key] || 0 }}元
            </view>
            <view
              v-if="item.value !== undefined"
              class="value g-bold color-error"
            >
              {{ item.value || 0 }}元
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="isComplete" class="g-footer">
      <view class="flex1 flex-normal count-money">
        <template v-if="Number(info.totalNeedPay) > 0">
          <text class="color-444 f28 mr8">支付金额</text>
        </template>
        <template v-else>
          <text class="color-444 f28 mr8">退还金额</text>
        </template>
        <text class="f36 g-bold color-error">
          {{ Math.abs(info.totalNeedPay - 0) }}元
        </text>
      </view>

      <button @click="payClick" class="btn g-border btn-warning pay-btn">
        结算
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

  import {
    type TPayConfirmHosPageProp,
    payOrderResult,
    useHosPayPage,
  } from './utils/inpatientInfo';
  import { encryptForPage, decryptForPage } from '@/common/des';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';
  import { GStores, type IHosInfo, wait } from '@/utils';
  import {
    type IGPay,
    payMoneyOnline,
    toPayPull,
  } from '@/components/g-pay/index';

  import api from '@/service/api';
  import { useCacheStore } from '@/stores';

  interface IDetailInfo {
    label: string;
    value?: string;
    key?: string;
  }
  const {
    refPay,
    refPayList,
    getCreateInHospitalPayOrderData,
    getSysConfig,
    pageConfig,
    toDigitalPay,
    getRefPay,
  } = useHosPayPage();

  const pageProps = ref(<TPayConfirmHosPageProp>{});
  const gStores = new GStores();
  const cacheStore = useCacheStore();
  const isComplete = ref(false);
  const hosList = ref<IHosInfo[]>([]);
  const details = ref<IDetailInfo[]>([
    {
      label: '费用总额',
      key: 'totalCharges',
    },
    {
      label: '预交金额',
      key: 'inpPrepayments',
    },
  ]);

  const payArg = ref<BaseObject>({});

  const info = ref<any>({});

  const getData = async () => {
    await getSysConfig();
    getNormalData();
  };

  const payClick = async () => {
    if (Number(info.value.totalNeedPay) > 0) {
      getRefPay(info.value.totalNeedPay);
    } else {
      getOutHospitalAffirmPay();
    }
  };

  const getNormalData = async () => {
    const { cardNumber, patientId, hosId, visitNo } = pageProps.value;
    const source = gStores.globalStore.browser.source;
    isComplete.value = false;
    const { result } = await api.getOutHospitalPreparePay<any>({
      patientId,
      hosId,
      source,
      cardNumber,
      visitNo,
    });

    isComplete.value = true;
    pageProps.value.patientName = result.patientName;
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
    } else if (item.key === 'digital') {
      toDigitalPay(pageProps.value, info.value.totalNeedPay);
    }
  };

  const getOutHospitalAffirmPay = async () => {
    const { cardNumber, patientId, hosId } = pageProps.value;
    const source = gStores.globalStore.browser.source;
    const { totalNeedPay, visitNo, recipeNo } = info.value;
    await api.outHospitalAffirmPay<any>({
      amount: totalNeedPay,
      patientId,
      hosId,
      source,
      cardNumber,
      visitNo,
      recipeNo,
    });
    payAfter();
  };

  const toPay = async () => {
    uni.showLoading({
      mask: true,
      title: '出院结算中，请勿退出否则可能出现结算异常',
    });
    try {
      const payArg = await getCreateInHospitalPayOrderData(
        pageProps.value,
        info.value.totalNeedPay,
        'outHos'
      );

      const res = await payMoneyOnline(payArg);

      await toPayPull(res, '住院缴费');
      payAfter();
    } catch (error) {
      console.error(error);
    } finally {
      uni.hideLoading();
    }
  };

  const payAfter = async () => {
    gStores.messageStore.showMessage('结算成功', 15000);
    await wait(1500);
    uni.reLaunch({
      url: '/pagesA/hospitalCare/hospitalCare',
    });
  };

  const init = () => {
    getData();
  };

  onLoad(async (opt) => {
    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
      // pageProps.value.hosId && cacheStore.changeHosId(pageProps.value.hosId);
    }
  });
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
        var(--hr-brand-color-6) 38%,
        var(--hr-brand-color-6) 96%
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
