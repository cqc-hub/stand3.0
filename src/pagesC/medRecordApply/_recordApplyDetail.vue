<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
  >
    <view
      v-if="Object.keys(info).length"
      :class="titleStatus.headerClass"
      class="reg-detail"
    >
      <scroll-view scroll-y class="scroll-container">
        <view class="safe-height" />
        <view class="box">
          <view class="reg-header">
            <view
              :style="{
                color: titleStatus.detailColor,
              }"
              class="flex-normal"
            >
              <view class="reg-header-label">
                <view class="title">
                  {{ isWaitForPay(info) ? '待补缴' : titleStatus.title }}
                </view>
                <view
                  :style="{
                    color: ['20', '21'].includes(info.orderStatus)
                      ? 'var(--hr-neutral-color-9)'
                      : '#fff',
                  }"
                  class="header-desc f26 flex-normal"
                >
                  <view v-if="info.fee" class="mr24 text-no-wrap">
                    <text class="mr12">
                      {{ isWaitForPay(info) ? '已支付金额' : '支付金额' }}:
                    </text>
                    <text>
                      {{ info.fee }}元
                      <text v-if="info.expressFee">
                        (含快递费{{ info.expressFee }}元)
                      </text>
                    </text>
                  </view>

                  <view v-if="isWaitForPay(info)" class="text-no-wrap">
                    <text class="mr12 text-no-wrap">待补交金额:</text>
                    <text class="mr12 g-break-word">
                      {{ info.supplementFee }}元
                    </text>
                  </view>

                  <view v-else-if="info.refundFee" class="text-no-wrap">
                    <text class="mr12 text-no-wrap">退还金额:</text>
                    <text class="mr12 g-break-word">
                      {{ info.refundFee }}元
                    </text>
                    <text
                      @click.stop="refRefConfirm.show"
                      class="iconfont refund-fee-icon"
                    >
                      &#xe6d6;
                    </text>
                  </view>
                </view>
              </view>
            </view>

            <view
              :class="{
                'hide-icon': ['20', '21'].includes(info.orderStatus),
              }"
              class="my-disabled"
            >
              <view
                v-if="['12', '15', '14', '11'].includes(info.orderStatus)"
                class="iconfont reg-header-icon-bg"
              >
                &#xe6c6;
              </view>

              <view v-else class="iconfont reg-header-icon-bg">&#xe6d0;</view>
            </view>
          </view>

          <view class="container mt24">
            <view v-if="expressInfo" class="container-box p32 mb32 g-border">
              <Express-Step
                :pointEnd="_expressInfo.pointEnd"
                :pointNow="_expressInfo.pointNow"
                :expressNo="info.expressNo"
                :expressCompany="info.expressCompany"
                @go-detail="goDetailExpress"
              />
            </view>

            <view
              v-if="info.addresseeAddress && !expressInfo"
              class="container-box order-patient g-border p32 mb16"
            >
              <view class="_row">
                <view class="_content">
                  {{ patientAddress }}
                </view>
              </view>
              <view class="_row mt16">
                <view class="_title w100 _name">
                  <text class="mr12">{{ info.addresseeName }}</text>
                  <text>{{ info.addresseePhone }}</text>
                </view>
              </view>
            </view>

            <view
              v-if="info.refundReason"
              class="container-box g-border mb16 p32"
            >
              <view class="_row">
                <view class="_content f32">不通过原因</view>
              </view>
              <view class="_row mt16 color-444 f28">
                {{ info.refundReason }}
              </view>
            </view>

            <view class="container-box p32 g-border mb16">
              <block v-if="info._outInfo && info._outInfo.length">
                <Record-Card :list="info._outInfo" />
              </block>

              <view v-if="info.copyAim" class="mt32 _row">
                <view class="_title">复印目的</view>
                <view class="_content">
                  {{ info.copyAim }}
                </view>
              </view>

              <view v-else class="mt32 _row">
                <view class="_title">复印目的</view>
                <view class="_content">
                  {{ getPrintCount }}
                </view>
              </view>

              <view v-if="info.remark" class="mt16 _row">
                <view class="_title">备注内容</view>
                <view class="_content">{{ info.remark }}</view>
              </view>
            </view>

            <view
              v-if="info.addresseeAddress && !!expressInfo"
              class="container-box order-patient g-border p32 mb16"
            >
              <view class="_row">
                <view class="_content">
                  {{ patientAddress }}
                </view>
              </view>
              <view class="_row mt16">
                <view class="_title w100 _name">
                  <text class="mr12">{{ info.addresseeName }}</text>
                  <text>{{ info.addresseePhone }}</text>
                </view>
              </view>
            </view>

            <view class="container-box order-patient g-border">
              <g-flag typeFg="506" isShowFgTip />
            </view>
          </view>
        </view>
      </scroll-view>

      <view v-if="isShowFooter" class="footer g-border-top">
        <view @click="goHome" class="home g-flex-rc-cc">
          <view class="iconfont home-icon">&#xe6df;</view>
          <view>首页</view>
        </view>

        <button
          v-if="isWaitForPay(info)"
          @click="supplementPay"
          class="btn g-border btn-error btn-plain"
        >
          立即支付
        </button>

        <button
          v-if="['20', '21', '16', '17'].includes(info.orderStatus)"
          @click="applyAgain"
          class="btn g-border btn-primary btn-plain"
        >
          再次申请
        </button>

        <button
          v-if="['11', '15'].includes(info.orderStatus)"
          class="btn g-border btn-plain btn-error"
          @click="applyCancel"
        >
          取消申请
        </button>
      </view>

      <order-Reg-Confirm
        headerIcon=""
        title="退还金额说明"
        height="35vh"
        ref="refRefConfirm"
        isShowCloseIcon
      >
        <view>
          <view class="dialog-content mb76">退还金额已原路返回，请查收。</view>
        </view>

        <template #footer>
          <button
            @click="refRefConfirm.hide"
            class="btn g-border btn-primary dialog-btn"
          >
            我知道了
          </button>
        </template>
      </order-Reg-Confirm>
    </view>

    <xy-dialog
      title="确定取消申请?"
      content="若取消申请,已缴纳的金额将会在7天内原路退回"
      :show="isShowApplyCancelDialog"
      @cancelButton="isShowApplyCancelDialog = false"
      @confirmButton="applyCancelDialog"
      confirmText="确定取消"
    />
    <g-pay
      :list="refPayList"
      :autoPayArg="payArg"
      @pay-success="payAfter"
      auto
      autoInOne
      ref="refPay"
    >
      <g-flag typeFg="32" isShowFgTip />
    </g-pay>
    <g-message />
    <g-back-home v-if="!isShowFooter" />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, nextTick } from 'vue';
  import dayjs from 'dayjs';

  import { GStores, type TButtonConfig, useTBanner } from '@/utils';

  import {
    applyOrderStatusMap,
    type CaseCopeItemDetail,
    isWaitForPay
  } from './utils/recordApply';
  import { joinQuery } from '@/common';

  import api from '@/service/api';
  import globalGl from '@/config/global';

  import orderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import ExpressStep from './components/ExpressStep.vue';
  import RecordCard from './components/RecordCard.vue';

  const props = defineProps<{
    phsOrderNo: string;
    hosId: string;
  }>();
  const gStores = new GStores();

  const isShowFooter = computed(() => {
    return (
      isWaitForPay(info.value) ||
      ['20', '21', '16', '17', '11', '15'].includes(info.value.orderStatus)
    );
  });
  const getPrintCount = computed(() => {
    if (info.value.printCount) {
      return info.value.printCount
        .map((o) => o.purpose + `(${o.count})`)
        .join('、');
    } else {
      return '';
    }
  });

  const info = ref<CaseCopeItemDetail>({} as CaseCopeItemDetail);
  const expressInfo = ref<{
    // pointEnd: {
    //   title: string;
    //   desc: string;
    // };

    pointNow: {
      title: string;
      desc: string;
      date: string;
    };
  }>();
  const refRefConfirm = ref<any>('');
  const titleStatus = computed(() => {
    const statusInfo = applyOrderStatusMap[info.value.orderStatus];

    return (
      statusInfo || {
        title: '未知的状态',
        headerClass: 'header-yellow',
        color: 'var(--hr-error-color-6)',
        detailColor: '#fff',
        descColor: '',
      }
    );
  });

  const patientAddress = computed(() => {
    if (Object.keys(info.value).length) {
      return `${info.value.addresseeAddress}${info.value.detailedAddress}`;
    } else {
      return '';
    }
  });

  const _expressInfo = computed(() => {
    return {
      pointNow: expressInfo.value?.pointNow,
      pointEnd: {
        title: patientAddress.value,
        desc: `${info.value.addresseeName} ${info.value.addresseePhone}`,
      },
    };
  });

  const getData = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const arg = {
      phsOrderNo: props.phsOrderNo,
      patientId,
    };

    const { result } = await api.getCaseCopyDetail<CaseCopeItemDetail>(arg);

    let { outInfo, expressParam, expressStatus, acceptTime, printCount } =
      result;
    // result.orderStatus = '21';
    // result.refundFee = '21';
    if (outInfo) {
      try {
        result._outInfo = JSON.parse(outInfo);
      } catch (error) {
        gStores.messageStore.showMessage('outInfo 字段格式错误', 3000);
      }
    }

    // result.expressFee = '10';

    if (printCount) {
      result.printCount = JSON.parse(printCount as any);
    }

    // expressParam = '233'

    if (expressParam) {
      // 派送中 40
      // 已发货 20
      // 已签收  50
      // 待取件 10
      // 运输中 30

      const _keyMap = {
        40: '派送中',
        20: '已发货',
        50: '已签收',
        10: '待取件',
        30: '运输中',
      };

      const date = dayjs(acceptTime).format('MM-DD');

      expressInfo.value = {
        pointNow: {
          title: _keyMap[expressStatus] || '未知',
          date,
          desc: expressParam,
        },
      };
    }

    // result.supplement = 1
    info.value = result;
  };

  const formatterTime = (time: string) => dayjs(time).format('YYYY-MM-DD');

  const applyAgain = () => {
    uni.navigateTo({
      url: joinQuery('/pagesC/medRecordApply/medRecordDetails', {
        hosId: props.hosId,
        phsOrderNo: props.phsOrderNo,
      }),
    });
  };

  const isShowApplyCancelDialog = ref(false);
  let applyCancelResolve: (args: any) => any = () => {};

  const applyCancelDialog = () => {
    applyCancelResolve(void 0);
    isShowApplyCancelDialog.value = false;
  };

  const applyCancel = async () => {
    isShowApplyCancelDialog.value = true;
    await new Promise((resolve) => {
      applyCancelResolve = resolve;
    });
    const { id, phsOrderNo } = info.value;

    const args = {
      id,
      phsOrderNo,
      type: 3,
    };

    await api.copyRefund(args);
    init();
  };

  const refPayList = ref([
    {
      label: '在线支付',
      key: 'online',
    },
  ]);
  const payArg = ref<BaseObject>({});
  const refPay = ref<any>('');

  const supplementPay = async () => {
    let payType = 'ALI_MINI';
    let [userId, openId] = ['', ''];
    // #ifdef  MP-WEIXIN
    payType = 'WX_MINI';
    openId = gStores.globalStore.openId;
    // #endif

    // #ifdef MP-ALIPAY
    userId = gStores.globalStore.openId;
    // #endif

    const { patientId } = gStores.userStore.patChoose;

    const { hosId, supplementFee, supplementId, _outInfo } = info.value;

    const args = {
      hosId,
      payType,
      channel: gStores.globalStore.browser.source,
      supplementFee,
      patientId,
      supplementId,
      userId,
      openId,
    };

    const { result } = await api.copyOfCasePaySupplement(args);

    payArg.value = {
      phsOrderNo: result.phsOrderNo,
      phsOrderSource: '4',
      totalFee: supplementFee,
      hosId,
      hosName: _outInfo[0]?.hosName,
    };

    nextTick(refPay.value.show);
  };

  const payAfter = () => {
    init();
  }

  const goDetailExpress = () => {
    const { expressNo, expressCompany } = info.value;
    const args: TButtonConfig = {
      type: 'h5',
      path: 'pagesC/myExpress/expressDetail',
      text: '',
      isSelfH5: '1',
      extraData: {
        sysCode: globalGl.SYS_CODE,
        expressNo,
        expressCompany,
      },
      addition: {
        token: 'token',
        herenId: 'herenId',
      },
    };

    useTBanner(args);
  };

  const goHome = () => {
    uni.reLaunch({
      url: '/pages/home/home',
    });
  };

  const init = () => {
    getData();
  };

  init();
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
        .reg-header-label {
          // height: 150rpx;
          .title {
            font-weight: 600;
          }

          .header-desc {
            // #ifdef  MP-ALIPAY
            transform: translateY(5rpx);
            // #endif
            align-items: flex-start;
            flex-wrap: wrap;

            .refund-fee-icon {
              font-size: var(--hr-font-size-xl);
              position: absolute;
              // #ifdef  MP-ALIPAY
              transform: translateY(-5rpx);
              // #endif
            }
          }
        }

        .reg-header-icon {
          font-size: 60rpx;
          margin-right: 16rpx;
        }

        .reg-header-icon-bg {
          // opacity: 0;
          font-size: 200rpx;
          right: 0;

          mask: linear-gradient(180deg, #ffffff35, rgba(255, 255, 255, 0));
          // transform: translateY(20rpx);
          position: absolute;
          top: -50rpx;
          right: 0;
        }
      }

      .container-box {
        background-color: #fff;
        // box-shadow: inset 0 18rpx 5px rgba(0, 0, 0, 0.07);
        margin: 0 32rpx;
        // transform: translateY(-20rpx);
        border-radius: 8px;
      }

      .order-patient {
        box-shadow: none;
        border-radius: 8px;
      }
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

      .btn {
        flex: 1;
      }
    }
  }

  .mr24 {
    margin-right: 24rpx;
  }

  .mr12 {
    margin-right: 12rpx;
  }

  .mt16 {
    margin-top: 16rpx;
  }

  .mb76 {
    margin-bottom: 76rpx;
  }

  .mt32 {
    margin-top: 32rpx;
  }

  .up-lv {
    position: relative;
    z-index: 3;
  }

  ._row {
    display: flex;
    font-size: var(--hr-font-size-base);

    ._title {
      color: var(--hr-neutral-color-7);
      width: 140rpx;
    }

    ._content {
      flex: 1;
      word-break: break-all;
      font-weight: 600;
    }
  }

  .w100 {
    width: 100% !important;
  }

  ._name {
    font-size: var(--hr-font-size-xs);
  }

  .dialog-btn {
    margin: 0 32rpx;
    width: calc(100% - 64rpx);
  }

  .dialog-content {
    color: var(--hr-neutral-color-9);
  }

  .home {
    font-size: var(--hr-font-size-xxxs);
    flex-direction: column;
    padding: 0 10rpx;
    margin-right: 10rpx;

    .home-icon {
      font-size: var(--hr-font-size-xxl);
    }
  }

  .system-mode-old {
    ._row {
      ._title {
        width: 180rpx;
      }
    }
  }
</style>
