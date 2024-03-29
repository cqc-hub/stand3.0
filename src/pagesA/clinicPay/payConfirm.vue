<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
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
            <view v-if="item.value" class="value g-bold color-error">
              {{ item.value || 0 }}元
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="isComplete" class="g-footer">
      <view class="flex1 flex-normal count-money">
        <text class="color-444 f28 mr8">还需支付</text>
        <text class="f36 g-bold color-error">{{ info.payAmount || '' }}元</text>
      </view>

      <button @click="payClick" class="btn g-border btn-warning pay-btn">
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

  import {
    type TPayConfirmPageProp,
    executeConfigPayAfter,
  } from './utils/clinicPayDetail';
  import { encryptForPage, decryptForPage } from '@/common/des';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';
  import { GStores, type IHosInfo, wait } from '@/utils';
  import {
    type IGPay,
    payMoneyOnline,
    toPayPull,
  } from '@/components/g-pay/index';

  import api from '@/service/api';

  interface IDetailInfo {
    label: string;
    value?: string;
    key?: string;
  }

  const pageProps = ref(<TPayConfirmPageProp>{});
  const gStores = new GStores();
  const isComplete = ref(false);
  const hosList = ref<IHosInfo[]>([]);
  const refPay = ref<any>('');
  const details = ref<IDetailInfo[]>([
    {
      label: '订单总额',
      key: 'totalCharges',
    },
    // {
    //   label: '医保支付',
    //   key: 'medicalMoney',
    // },
    // {
    //   label: '院内账户支付',
    //   key: 'accountMoney',
    // },
    // {
    //   label: '自费支付',
    //   key: 'totalNeedSelfpay',
    // },
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
        costInfo: string;
        payAmount: string;
        recipeNo: string;
        otherPayWay: string;
        costTypeName: string;
        clinicType?: string;
      }
    >{}
  );

  const getData = async () => {
    await wait(800);
    if (!pageProps.value.visitNo) {
      getScanData();
    } else {
      getNormalData();
    }
  };

  const payClick = async () => {
    if (<any>info.value.payAmount * 1 === 0) {
      await payFeeZero();
    } else {
      refPay.value.show();
    }
  };

  // 0 元缴费
  const payFeeZero = async () => {
    const {
      serialNo,
      cardNumber,
      patientName,
      hosId,
      visitNo,
      recipeNo,
      otherPayWay,
    } = info.value;
    const { patientId } = gStores.userStore.patChoose;
    const {
      browser: { source },
      herenId,
    } = gStores.globalStore;

    const args = {
      extend: JSON.stringify(info.value),
      serialNo,
      cardNumber,
      patientName,
      patientId: cardNumber ? undefined : patientId,
      source,
      herenId,
      // businessType: '1',
      hosId,
      visitNo,
      recipeNo,
      payType: 'WX_MINI',
      otherPayWay,
    };

    // #ifdef MP-ALIPAY
    args.payType = 'ALI_MINI';
    // #endif

    await api.clinicSpecialPayInform(args);
    payAfter();
  };

  const getNormalData = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const { hosId, serialNo, visitNo, params, mzParams } = pageProps.value;
    isComplete.value = false;
    const { result } = await api.getClinicReservePay<any>({
      patientId: params || mzParams ? undefined : patientId,
      hosId,
      serialNo,
      visitNo,
      cardNumber: pageProps.value.cardNumber,
    });

    isComplete.value = true;
    info.value = result;
    //处理页面展示的参数
    if (result.costInfo) {
      const costInfo = JSON.parse(result.costInfo);
      info.value = {
        ...result,
        ...costInfo,
      };
      for (var key in costInfo) {
        details.value.push({
          label: key,
          value: JSON.parse(result.costInfo)[key],
        });
      }
    }
  };

  const getScanData = async () => {
    const { serialNo, visitNo, cardNumber, branchHosp } =
      pageProps.value.deParams!;

    isComplete.value = false;
    const arg = {
      serialNo,
      visitNo,
      cardNumber,
      branchHosp,
      scanCode: '0',
    };

    try {
      const { result } = await api.getScanClinicReservePay<any>({
        ...arg,
        desSecret: pageProps.value.params,
      });

      isComplete.value = true;
      info.value = result;

      if (info.value.costInfo) {
        const costInfo = JSON.parse(info.value.costInfo);
        info.value = {
          ...result,
          ...costInfo,
        };
        for (var key in costInfo) {
          details.value.push({
            label: key,
            value: JSON.parse(result.costInfo)[key],
          });
        }
      }
    } catch (error: any) {
      if (error) {
        const { message } = error;

        if (message) {
          gStores.messageStore.showMessage(message, 3000, {
            closeCallBack() {
              payAfter();
            },
          });
        }
      }
    }
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
    uni.showLoading({
      mask: true,
      title: '预结算中，请勿退出否则可能出现结算异常',
    });
    try {
      const { patientId } = gStores.userStore.patChoose;
      const patientName = info.value.patientName;
      const source = gStores.globalStore.browser.source;

      const { visitDate, mergeOrder, serialNo, params, mzParams } =
        pageProps.value;

      const {
        hosId,
        visitNo,
        childOrder,
        cardNumber,
        payAmount,
        costTypeName,
        totalCharges,
      } = info.value;

      const args = {
        extend: JSON.stringify(info.value),
        patientName,
        businessType: '1',
        patientId: params || mzParams ? undefined : patientId,
        source,
        totalCost: payAmount,
        hosId,
        hosName: getHosName.value,
        visitDate,
        serialNo: serialNo || pageProps.value.deParams?.serialNo,
        visitNo,
        cardNumber,
        mergeOrder: mergeOrder || childOrder,
        personalPayFee:
          ((!costTypeName || costTypeName === '自费') && totalCharges) ||
          undefined,
      };

      const {
        result: { phsOrderNo },
      } = await api.createClinicOrder(args, {
        hideLoading: true,
      });

      const onlineArg = {
        phsOrderNo,
        totalFee: payAmount,
        phsOrderSource: '2',
        hosId,
        hosName: getHosName.value,
        patientName,
      };

      if (cardNumber) {
        // @ts-expect-error
        onlineArg.cardNumber = cardNumber;
      }

      const res = await payMoneyOnline(onlineArg, {
        hideLoading: true,
      });

      await toPayPull(res, '门诊缴费').finally(() => {
        uni.hideLoading();
      });
      payAfter();
    } catch (error) {
      console.error(error);
    } finally {
      uni.hideLoading();
    }
  };

  const payAfter = async () => {
    uni.showLoading({});
    await wait(1000);
    uni.hideLoading();
    const { mzParams, deParams } = pageProps.value;

    const { cardNumber, clinicType } = info.value;

    if (clinicType) {
      await executeConfigPayAfter(clinicType, cardNumber);
    }

    if (mzParams) {
      //扫码进来的
      uni.reLaunch({
        url: joinQueryForUrl('/pagesA/clinicPay/clinicPayDetail', {
          tabIndex: '1',
          params: mzParams,
        }),
      });
    } else if (deParams) {
      const { cardNumber } = deParams;
      const { patientName } = info.value;

      uni.reLaunch({
        url:
          '/pagesA/clinicPay/clinicPayDetail?tabIndex=1&' +
          `params=${encryptForPage({
            cardNumber,
            patientName,
          })}`,
      });
    } else {
      uni.reLaunch({
        url: '/pagesA/clinicPay/clinicPayDetail?tabIndex=1',
      });
    }
  };

  const init = () => {
    getData();
  };

  onLoad(async (opt) => {
    if (!(opt && Object.keys(opt).length)) {
      return;
    }
    await wait(650);

    if (opt.q) {
      return;
    }

    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
      console.warn('列表进', pageProps.value);

      if (pageProps.value.params) {
        pageProps.value.deParams = decryptForPage(pageProps.value.params);
      }
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
