<template>
  <view
    :class="{
      [titleStatus.headerClass]: true,
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="reg-detail"
  >
    <scroll-view scroll-y class="scroll-container">
      <view class="box">
        <view class="reg-header flex-between">
          <view
            :style="{
              color: titleStatus.color,
            }"
            class="flex-normal"
          >
            <view class="iconfont reg-header-icon">&#xe6ea;</view>

            <view class="reg-header-label">待支付</view>
          </view>

          <view>
            <view>
              <view class="iconfont reg-header-icon-bg">&#xe6d0;</view>
            </view>
          </view>
        </view>

        <view class="container">
          <view class="container-box g-border container-box1">
            <view class="order-info">
              <g-form
                :value="orderTakeNunberInfo"
                forShowBodyAlign="left"
                bodyBold
                hideRowBorder
                ref="refForm"
              ></g-form>
            </view>
          </view>

          <view class="container-box order-patient g-border p32v">
            <g-form
              :value="orderTakeNunberInfo"
              forShowBodyAlign="left"
              hideRowBorder
              ref="refFormPatient"
            />
          </view>

          <view class="container-box order-patient g-border p32">
            <g-flag :typeFg="'1214'" isShowFgTip aaa />
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="footer g-border-top">
      <view @click="goHome" class="home g-flex-rc-cc">
        <view class="iconfont home-icon">&#xe6df;</view>
        <view>首页</view>
      </view>

      <template>
        <block>
          <button @click="payOrder" class="btn btn-warning pay-btn">
            {{ orderTakeNunberInfo.fee }}元 立即支付
          </button>
        </block>
      </template>
    </view>

    <g-pay
      :list="refPayList"
      :autoPayArg="payArg"
      @pay-click="getPayInfo"
      autoInOne
      ref="refPay"
    >
      <view class="p32">
        <g-flag typeFg="1214" isShowFgTip isHideTitle aaa />
      </view>
    </g-pay>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import {
    GStores,
    ServerStaticData,
    IHosInfo,
    ISystemConfig,
    wait,
    debounce,
  } from '@/utils';

  import { joinQueryForUrl, deQueryForUrl, cloneUtil } from '@/common';

  import {
    IPageProps,
    ItakeNumberInfo,
    formatterTemp,
    takeNumberTempList,
    patientTempList,
  } from './utils/takeNumberDetail';
  import { payMoneyOnline, toPayPull, IGPay } from '@/components/g-pay/index';

  import {
    PayType,
    usePayPage,
    _getQxMedicalNation,
  } from '@/pagesA/clinicPay/utils/clinicPayDetail';

  import globalGl from '@/config/global';

  import api from '@/service/api';

  const orderConfig = ref({} as ISystemConfig['order']);
  const refForm = ref<any>('');
  const refFormPatient = ref<any>('');
  const pageProps = ref({} as IPageProps);
  const gStores = new GStores();
  const orderTakeNunberInfo = ref({} as ItakeNumberInfo);
  const hosInfo = ref({} as IHosInfo);
  const payArg = ref<BaseObject>({});
  const refPay = ref<any>('');
  const titleStatus = ref({
    headerClass: 'header-yellow',
    headerBgIcon: '',
    headerIcon: '&#xe6ea;',
    color: 'var( --hr-error-color-6)',
    title: '待支付',
    cardColor: 'var(--hr-warning-color-6)',
  });

  const { refPayList } = usePayPage();

  const getConfig = async () => {
    orderConfig.value = await ServerStaticData.getSystemConfig('order');
  };
  const payOrder = async () => {
    const payList = [] as any;
    payList.push(PayType.Online);
    changeRefPayList(payList);
    setTimeout(() => {
      refPay.value.show();
    });
  };

  const { changeRefPayList } = usePayPage();

  let init = async () => {
    await getConfig();
    const { result } = await api.getCheckInFeeHK({
      hosId: pageProps.value.hosId,
      extend: pageProps.value.extend,
    });
    orderTakeNunberInfo.value = {} as any;
    let _takeNumberTempList =
      cloneUtil<typeof takeNumberTempList>(takeNumberTempList);
    const detailInfo: any = {
      _totalCost: '',
      _hosAccountOffsetFee: '',
      _category: '',
      _fee: '',
      _appointmentDate: '',
      ...pageProps.value,
      ...result,
    };

    const { visitDate, ampmName, timeDesc } = detailInfo as any;

    detailInfo._appointmentDate = [visitDate, ampmName, timeDesc]
      .filter((o) => o)
      .join(' ');
    detailInfo._fee = detailInfo.fee + '元';
    detailInfo._category = detailInfo.schQukCategor || detailInfo.categorName;
    // orderTakeNunberInfo.value = detailInfo  ;
    orderTakeNunberInfo.value = detailInfo as any;

    formatterTemp(_takeNumberTempList, gStores.globalStore.modeOld);
    formatterTemp(patientTempList, gStores.globalStore.modeOld);
    const _patientTempList = patientTempList.filter(
      (o) => orderTakeNunberInfo.value[o.key]
    );

    setTimeout(() => {
      refForm.value.setList(_takeNumberTempList);
      refFormPatient.value.setList(_patientTempList);
    }, 600);
  };

  init = debounce(init, 200, false);

  const goHome = () => {
    uni.reLaunch({
      url: '/pages/home/home',
    });
  };

  const getPayInfo = async ({ item }: { item: IGPay }) => {
    const { key } = item;

    switch (key) {
      case 'online':
        // 预结算
        toPay();
        break;
      default:
        break;
    }
  };

  /** 自费 */
  const toPay = async (totalFee = orderTakeNunberInfo.value.fee) => {
    const {
      herenId,
      browser: { source },
    } = gStores.globalStore;
    const args = {
      hosName:orderTakeNunberInfo.value.hosName,
      hosId:orderTakeNunberInfo.value.hosId,
      fee: totalFee,
      extend: orderTakeNunberInfo.value.extend,
      patientName:orderTakeNunberInfo.value.patientName,
      herenId,
      source,
      orderType: 14,
      patientId:pageProps.value.patientId
    };
    const { result } = await api.createInHospitalPayOrder(args);

    if (result && result.paySign) {
      const { hosId } = orderTakeNunberInfo.value;
      payArg.value = {
        sign: result.paySign,
        phsOrderNo: result.phsOrderNo,
        totalFee,
        hosId,
        source,
        phsOrderSource: '14',
      };

      const res = await payMoneyOnline({ ...payArg.value });
      await toPayPull(res, '挂号缴费');
      payAfter();
    }
  };

  const payAfter = async () => {
    uni.showLoading({
      mask: true,
    });
    await wait(2000);
    uni.hideLoading();
    uni.navigateBack();
  };

  onShow(async () => {
    init();
  });

  onLoad(async (p) => {
    pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
    console.log('asdasd', pageProps.value);
    init();
  });
</script>

<style lang="scss" scoped>
  .reg-detail {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .scroll-container {
      flex: 1;
      height: 1px;
      overflow-y: scroll;
      position: reactive;
      z-index: 2;
    }

    &::after {
      content: '';
      display: block;
      height: 400rpx;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    &.header-blue {
      &::after {
        background: linear-gradient(
          0deg,
          rgba(41, 111, 255, 0) 1%,
          #296fff 38%,
          #296fff 96%
        );
      }
    }

    &.header-green {
      &::after {
        background: linear-gradient(
          0deg,
          rgba(0, 179, 158, 0) 1%,
          #00b39e 38%,
          #00b39e 96%
        );
      }
    }

    &.header-yellow {
      &::after {
        background: linear-gradient(
          0deg,
          rgba(253, 231, 191, 0) 1%,
          #fde7bf 38%,
          #fde7bf 96%
        );
      }
    }

    &.header-dark {
      &::after {
        background: linear-gradient(
          0deg,
          rgba(106, 125, 165, 0) 1%,
          #6a7da5 38%,
          #6a7da5 96%
        );
      }
    }

    .box {
      position: relative;
      z-index: 2;

      .reg-header {
        padding: 0 32rpx;

        font-size: var(--hr-font-size-xxl);
        display: flex;
        align-items: center;
        color: #fff;
        position: relative;

        .reg-header-label {
          font-weight: 600;
          position: relative;
          top: -8rpx;
        }

        .reg-header-icon {
          font-size: var(--h-iconfont-60);
          margin-right: 16rpx;
          position: relative;
          top: -8rpx;
        }

        .reg-header-icon-bg {
          // opacity: 0;
          font-size: 200rpx;
          right: 0;

          mask: linear-gradient(180deg, #ffffff35, rgba(255, 255, 255, 0));
        }

        .out-time-info {
          position: absolute;
          top: 50%;
          right: 32rpx;
          transform: translateY(-50%);
        }
      }

      .container {
        transform: translateY(-80rpx);
        // #ifdef  MP-WEIXIN
        transform: translateY(-70rpx);
        // #endif

        &::before {
          content: '';
          display: block;
          height: 40rpx;
          margin: 0 12rpx;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 60rpx;
        }
      }

      .container-box {
        background-color: #fff;
        margin: 0 32rpx;
        margin-bottom: 16rpx;
        transform: translateY(-20rpx);
        border-radius: 8px;

        .qr-code {
          flex-direction: column;
          font-size: var(--hr-font-size-xs);
          margin-top: 40rpx;

          .qr-code-value {
            font-size: var(--hr-font-size-xs);
            color: var(--hr-neutral-color-7);
            margin-top: 16rpx;
          }

          .qr-code-toggle {
            margin-top: 24rpx;
            margin-bottom: 40rpx;
            display: flex;
            align-items: center;

            .qr-toggle-icon {
              transition: all 0.4s;
              color: var(--hr-neutral-color-9);
              font-size: var(--hr-font-size-xxl);
              display: inline-block;

              &.icon-reverse {
                transform-origin: center center;
                transform: rotate(0.5turn);
              }
            }
          }
        }

        .hos-navigation {
          background: url($base-url + 'reg-detail-position-bg.png') 100%/100%
            no-repeat;
          height: 144rpx;
          justify-content: flex-start;
          padding-left: 32rpx;
          margin-top: 40rpx;

          .hos-info {
            max-width: 70%;
            display: flex;
            flex-direction: column;

            .hos-name {
              font-weight: 600;
            }

            .hos-address {
              color: var(--hr-neutral-color-8);
              font-size: var(--hr-font-size-xxxs);
              margin-top: 10rpx;
            }
          }
        }

        .order-info {
          .iconfont {
            font-size: var(--hr-font-size-xl);
            font-size: 400;
            margin-left: 12rpx;
          }
        }

        .color-blue {
          color: var(--hr-brand-color-6);
        }

        .size-icon {
          width: 50rpx;
          height: 40rpx;
          display: inline-block;
          margin-left: 12rpx;
        }
      }

      .container-box1 {
        border-radius: 0px 0px 8px 8px;
        box-shadow: inset 0 18rpx 5px rgba(0, 0, 0, 0.07);
      }
    }

    .order-patient {
      box-shadow: none;
      margin-top: 16rpx;
      border-radius: 8px;
    }
  }

  .p32 {
    padding: 32rpx;
  }

  .p32v {
    padding-top: 32rpx;
    padding-bottom: 32rpx;
  }

  .m32 {
    margin: 32rpx;
  }

  .hide-icon {
    opacity: 0;
  }

  .footer {
    background-color: var(--h-color-white);
    padding: 24rpx 32rpx 48rpx;
    position: reactive;
    z-index: 1;
    gap: 18rpx;

    display: flex;

    .home {
      font-size: var(--hr-font-size-xxxs);
      flex-direction: column;
      padding: 0 10rpx;
      margin-right: 10rpx;

      .home-icon {
        font-size: var(--hr-font-size-xxl);
      }
    }

    .btn {
      flex: 1;
    }

    .pay-btn {
      flex: 2;
    }
  }

  .qr {
    .qrcode-img {
      width: 320rpx;
      height: 320rpx;
    }

    .barcode-img {
      width: 600rpx;
    }
  }

  .system-mode-old {
    .box {
      .reg-header-icon {
        font-size: 74rpx;
      }

      .container-box {
        .qr-code {
          .qr-code-toggle {
            .qr-toggle-icon {
              font-size: 48rpx;
            }
          }
        }

        .order-info {
          .iconfont {
            font-size: 48rpx;
          }
        }
      }
    }
  }
</style>
