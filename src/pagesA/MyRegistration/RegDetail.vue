<template>
  <view :class="titleStatus.headerClass" class="reg-detail">
    <scroll-view scroll-y class="scroll-container">
      <view v-if="orderRegInfo.patientId" class="box">
        <view class="reg-header flex-between">
          <view
            :style="{
              color: titleStatus.color,
            }"
            class="flex-normal"
          >
            <view
              v-if="titleStatus.headerIcon.includes('#xe6ea')"
              class="iconfont reg-header-icon"
            >
              &#xe6ea;
            </view>

            <view
              v-else-if="titleStatus.headerIcon.includes('#xe6c7')"
              class="iconfont reg-header-icon"
            >
              &#xe6c7;
            </view>

            <view
              v-else-if="titleStatus.headerIcon.includes('#xe6d5')"
              class="iconfont reg-header-icon"
            >
              &#xe6d5;
            </view>

            <view class="reg-header-label">{{ titleStatus.title }}</view>
          </view>

          <view>
            <view
              :class="{
                'hide-icon': !titleStatus.headerBgIcon,
              }"
            >
              <view
                v-if="titleStatus.headerBgIcon.includes('#xe6d0')"
                class="iconfont reg-header-icon-bg"
              >
                &#xe6d0;
              </view>

              <view
                v-else-if="titleStatus.headerBgIcon.includes('#xe6de')"
                class="iconfont reg-header-icon-bg"
              >
                &#xe6de;
              </view>

              <view
                v-else-if="titleStatus.headerBgIcon.includes('#xe6d5')"
                class="iconfont reg-header-icon-bg"
              >
                &#xe6d5;
              </view>

              <view v-else class="iconfont reg-header-icon-bg">&#xe6c7;</view>
            </view>

            <view
              v-if="orderRegInfo.orderStatus === '10'"
              class="out-time-info f28 color-error"
            >
              <block v-if="timeTravel.minute == 0 && timeTravel.second == 0">
                <text>订单已失效</text>
              </block>

              <block v-else>
                <text
                  :style="{
                    color: titleStatus.color,
                  }"
                >
                  {{ `${timeTravel.minute}分${timeTravel.second}秒` }}
                </text>
                <text class="color-444">后订单将失效</text>
              </block>
            </view>
          </view>
        </view>

        <view class="container">
          <view class="container-box g-border">
            <view
              v-if="isShowQr"
              class="qr-code g-flex-rc-cc g-border-bottom m32"
            >
              <view class="my-display-none">
                <w-qrcode :options="_qrCodeOpt" ref="refqrcode" />
                <w-barcode :options="_barCodeOpt" ref="refqrbarcode" />
              </view>

              <view class="qr g-flex-rc-cc">
                <image
                  v-if="showQrCode"
                  :src="qrCodeOpt._qrImg"
                  class="qrcode-img"
                />

                <image
                  v-if="!showQrCode"
                  :src="qrCodeOpt._barImg"
                  mode="widthFix"
                />
              </view>

              <view class="qr-code-value">{{ _qrCodeOpt.code }}</view>

              <view @click="showQrCode = !showQrCode" class="qr-code-toggle">
                <text
                  :class="{
                    'icon-reverse': showQrCode,
                  }"
                  class="iconfont qr-toggle-icon"
                >
                  &#xe6f9;
                </text>
                <text>点击切换{{ (showQrCode && '条形码') || '二维码' }}</text>
              </view>
            </view>

            <view
              v-if="hosInfo.gisLat"
              @click="openHosLocation"
              class="hos-navigation g-flex-rc-cc m32"
            >
              <view class="hos-info">
                <view class="text-ellipsis hos-name">
                  {{ hosInfo.hosName }}
                </view>
                <view class="text-ellipsis hos-address">
                  {{ hosInfo.address }}
                </view>
              </view>
            </view>
            <view class="order-info p32v">
              <g-form
                :value="orderRegInfo"
                forShowBodyAlign="left"
                bodyBold
                hideRowBorder
                ref="refForm"
              >
                <template #showBody="{ item, value }">
                  <view
                    @click="goDoctorCard"
                    v-if="
                      item.key === 'docName' &&
                      orderRegInfo.orderStatus !== '10'
                    "
                    class="color-blue flex-normal doc-name"
                  >
                    <view class="doc-name-value">
                      {{ value }}
                    </view>
                    <view style="font-weight: 400" class="iconfont">
                      &#xe6c8;
                    </view>
                  </view>

                  <view
                    v-else-if="item.key === '_category'"
                    class="flex-normal doc-name"
                  >
                    <view>
                      {{ orderRegInfo._category }}
                    </view>

                    <!-- <view class="iconfont color-blue">&#xe6c8;</view> -->
                  </view>
                  <view v-else>{{ value }}</view>
                </template>
              </g-form>
            </view>
          </view>

          <view class="container-box order-patient g-border p32v">
            <g-form
              :value="orderRegInfo"
              forShowBodyAlign="left"
              hideRowBorder
              ref="refFormPatient"
            />
          </view>

          <view class="container-box order-patient g-border p32">
            <g-flag typeFg="4" isShowFgTip aaa />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 取消、退号 是两个概念 退号要退钱， 取消是取消锁号-->
    <view
      v-if="orderRegInfo.patientId && isShowFooter"
      class="footer g-border-top"
    >
      <view @click="goHome" class="home g-flex-rc-cc">
        <view class="iconfont home-icon">&#xe6df;</view>
        <view>首页</view>
      </view>

      <button
        v-if="orderRegInfo.orderStatus === '0'"
        @click="refoundOrder"
        class="btn btn-plain btn-error g-border"
      >
        {{ orderConfig.isOrderPay === '1' ? '退号' : '取消预约' }}
      </button>

      <block v-if="orderRegInfo.orderStatus === '70'">
        <button @click="againOrder" class="btn g-border btn-normal">
          再次预约
        </button>

        <button
          v-if="
            orderRegInfo.rateFlag !== 1 && orderConfig.isOpenComment === '1'
          "
          @click="goRatePage"
          class="btn g-border btn-primary"
        >
          {{ orderRegInfo.rateFlag === 0 ? '查看评价' : '服务评价' }}
        </button>
      </block>

      <block v-if="orderRegInfo.orderStatus === '10'">
        <button @click="cancelOrder" class="btn g-border btn-normal">
          取消订单
        </button>

        <button
          @click="payOrder"
          :class="{
            'btn-disabled': timeTravel.downTime <= 0,
          }"
          class="btn btn-warning pay-btn"
        >
          {{ orderRegInfo.fee }}元 立即支付
        </button>
      </block>

      <button
        v-if="orderRegInfo.orderStatus === '45'"
        class="btn g-border btn-primary"
        @click="againOrder"
      >
        再次预约
      </button>

      <button
        v-if="['23', '43'].includes(orderRegInfo.orderStatus)"
        class="btn g-border btn-primary"
        @click="againOrder"
      >
        再次预约
      </button>

      <button
        v-if="orderRegInfo.orderStatus === '20'"
        class="btn g-border btn-primary"
        @click="againOrder"
      >
        再次预约
      </button>
    </view>

    <xy-dialog
      title=""
      :content="dialogContent"
      :show="isCancelOrderDialogShow"
      @cancelButton="isCancelOrderDialogShow = false"
      @confirmButton="cancelOrderDialogConfirm"
    />

    <xy-dialog
      title=""
      content="是否立即去给医生留言，方便医生提前了解您的病情？"
      :show="isShowConsultationDialog"
      @cancelButton="isShowConsultationDialog = false"
      @confirmButton="goPreConsultation"
    />

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
  import { computed, ref, nextTick, onMounted, reactive } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import {
    GStores,
    ServerStaticData,
    IHosInfo,
    openLocation,
    ISystemConfig,
    wait,
    useTBanner,
    TButtonConfig,
  } from '@/utils';
  import {
    encryptDes,
    joinQuery,
    joinQueryForUrl,
    deQueryForUrl,
    cloneUtil,
  } from '@/common';

  import {
    IPageProps,
    IRegInfo,
    regInfoTempList,
    patientTempList,
    orderStatusMap,
  } from './utils/regDetail';
  import {
    type IGPay,
    payMoneyOnline,
    toPayPull,
  } from '@/components/g-pay/index';

  import api from '@/service/api';
  import globalGl from '@/config/global';

  const orderConfig = ref<ISystemConfig['order']>({} as ISystemConfig['order']);
  const refForm = ref<any>('');
  const refFormPatient = ref<any>('');
  const pageProps = ref<IPageProps>({} as IPageProps);
  const gStores = new GStores();
  const showQrCode = ref(false);
  const orderRegInfo = ref<IRegInfo>({} as IRegInfo);
  const hosInfo = ref<IHosInfo>({} as IHosInfo);
  const isShowQr = computed(() => {
    return ['0', '100', '70', '75'].includes(orderRegInfo.value.orderStatus);
  });
  const payArg = ref<BaseObject>({});
  const refPay = ref<any>('');
  const isFirstIn = ref(true);

  const isShowFooter = computed(() =>
    ['23', '45', '10', '70', '0', '20', '43'].includes(
      orderRegInfo.value.orderStatus
    )
  );
  const refPayList = ref([
    {
      label: '在线支付',
      key: 'online',
    },
  ]);

  const qrCodeOpt = ref({
    // 二维码
    size: 350,

    // 条形码
    width: 600, // 宽度 单位rpx
    height: 184, // 高度 单位rpx
    code: '',

    _barImg: '',
    _qrImg: '',
  });

  const _qrCodeOpt = computed(() => {
    const _v = qrCodeOpt.value;

    return {
      size: _v.size,
      code: _v.code,
    };
  });
  const _barCodeOpt = computed(() => {
    const _v = qrCodeOpt.value;

    return {
      code: _v.code,
      width: _v.width,
      height: _v.height,
    };
  });

  const titleStatus = computed(() => {
    let statusInfo = orderStatusMap[orderRegInfo.value.orderStatus];

    if (orderRegInfo.value.orderStatus === '0') {
      if (orderConfig.value.isOrderPay === '1') {
        statusInfo.title = '已挂号';
      }
    }

    return (
      statusInfo || {
        title: '未知的状态',
        headerClass: '',
        color: 'var(--hr-error-color-6)',
        headerBgIcon: '',
        headerIcon: '&#xe6d5;',
      }
    );
  });

  let _timeTravel: any;
  const timeTravel = ref({
    downTime: 0,
    minute: 0,
    second: 0,
  });

  const startTimeTravel = () => {
    const timeAction = () => {
      const { downTime } = timeTravel.value;

      if (downTime >= 0) {
        timeTravel.value.minute = Math.floor(timeTravel.value.downTime / 60);
        timeTravel.value.second = Math.floor(timeTravel.value.downTime % 60);
        timeTravel.value.downTime = timeTravel.value.downTime - 1;
      }
    };

    timeAction();

    _timeTravel = setInterval(() => {
      const { downTime } = timeTravel.value;

      if (downTime >= 0) {
        timeAction();
      } else {
        clearInterval(_timeTravel);
      }
    }, 1000);
  };

  const refqrcode = ref('' as any);
  const refqrbarcode = ref('' as any);
  const capture = async () => {
    if (!refqrcode.value) {
      return;
    }

    const { tempFilePath: qrCodeImg } = await refqrcode.value.GetCodeImg();
    const { tempFilePath: barcodeImg } = await refqrbarcode.value.GetCodeImg();

    qrCodeOpt.value._barImg = barcodeImg;
    qrCodeOpt.value._qrImg = qrCodeImg;

    qrCodeOpt.value.width = 0;
    qrCodeOpt.value.size = 0;
  };

  const isShowConsultationDialog = ref(false);
  // 预问诊
  const showConsultationDialog = () => {
    if (!isFirstIn.value) return;

    if (
      orderRegInfo.value.orderStatus === '0' &&
      pageProps.value.preWz === '1' &&
      orderConfig.value.isOpenPreConsultation === '1'
    ) {
      isShowConsultationDialog.value = true;
    }
  };

  const goPreConsultation = () => {
    isShowConsultationDialog.value = false;
    const { patientSex, patientAge, patientName } = gStores.userStore.patChoose;
    const { orderId } = pageProps.value;

    const pageArg = {
      patientSex,
      patientAge,
      patientName,
      orderId,
    };

    const preConsultation: TButtonConfig = {
      type: 'h5',
      isSelfH5: '1',
      path: 'pages/inquiries/inquiries3',
      text: '预问诊',
      extraData: {
        sysCode: globalGl.SYS_CODE,
        params: encodeURIComponent(
          encryptDes(JSON.stringify(pageArg), 'phsDesKe')
        ),
      },
      addition: {
        token: 'token',
        herenId: 'herenId',
      },
      // isLocal: '1',
    };

    console.log(preConsultation.extraData);

    useTBanner(preConsultation);
  };

  const init = async () => {
    qrCodeOpt.value.width = 600;
    qrCodeOpt.value.size = 350;
    qrCodeOpt.value.code = '';
    orderRegInfo.value = {} as any;
    clearInterval(_timeTravel);

    const orderId = pageProps.value.orderId;
    let _regInfoTempList = cloneUtil<typeof regInfoTempList>(regInfoTempList);

    orderConfig.value = await ServerStaticData.getSystemConfig('order');
    const { result } = await api.getRegOrderInfo<IRegInfo>({
      orderId,
      source: gStores.globalStore.browser.source,
    });

    const hosList = await ServerStaticData.getHosList();
    const hos = hosList.find((o) => o.hosId === result.hosId);
    if (hos) {
      hosInfo.value = hos;
    }

    const { downTime, qrCode } = result;
    if (downTime) {
      timeTravel.value.downTime = downTime;
      startTimeTravel();
    }

    result._appointmentDate = `${result.appointmentDate} ${
      result.ampmName + result.appointmentTime
    }`;
    result._fee = result.fee + '元';
    result._category = result.schQukCategor || result.categorName;
    orderRegInfo.value = result;
    // orderRegInfo.value.orderStatus = '75';
    qrCodeOpt.value.code = result[qrCode];

    showConsultationDialog();
    isFirstIn.value = false;

    _regInfoTempList = _regInfoTempList.filter((o) => result[o.key]);
    nextTick(() => {
      setTimeout(() => {
        capture();
      }, 300);
    });
    patientTempList.map((o) => {
      if (o.key === 'patientId') {
        o.key = qrCode;
      }
    });
    setTimeout(() => {
      refForm.value.setList(_regInfoTempList);
      refFormPatient.value.setList(patientTempList);
    }, 300);
  };

  const openHosLocation = () => {
    const { gisLat, gisLng, hosName, address } = hosInfo.value;

    openLocation([gisLat!, gisLng!], {
      name: hosName,
      address,
    });
  };

  const goHome = () => {
    uni.reLaunch({
      url: '/pages/home/home',
    });
  };

  const payOrder = async () => {
    const {
      herenId,
      browser: { source },
    } = gStores.globalStore;
    const { orderId } = pageProps.value;

    const arg = {
      herenId,
      source,
      orderId,
    };

    const { result } = await api.orderPayValid(arg);

    if (result && result.paySign) {
      // getPayInfo
      const { hosId, fee } = orderRegInfo.value;
      payArg.value = {
        phsOrderNo: orderId,
        sign: result.paySign,
        totalFee: fee,
        hosId,
        phsOrderSource: '1',
      };

      refPay.value.show();
    }
  };

  const getPayInfo = () => {
    toPay();
  };

  const toPay = async () => {
    const res = await payMoneyOnline({ ...payArg.value });
    await toPayPull(res, '挂号缴费');
    payAfter();
  };

  const payAfter = async () => {
    uni.showLoading({
      mask: true,
    });
    isFirstIn.value = true;

    await wait(2000);
    uni.hideLoading();

    init();
  };

  const goDoctorCard = () => {
    const { deptName, docName, hosDocId, hosId, clinicalType, hosDeptId } =
      orderRegInfo.value;

    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/DoctorDetails', {
        deptName,
        docName,
        hosDocId,
        hosId,
        clinicalType,
        hosDeptId,
      }),
    });
  };

  const isCancelOrderDialogShow = ref(false);
  const dialogContent = ref('');
  let cancelOrderDialogConfirm: (any) => any = async () => {};
  const cancelOrder = async () => {
    const orderId = pageProps.value.orderId;
    isCancelOrderDialogShow.value = true;
    dialogContent.value = '确认取消该订单?';

    await new Promise((confirm) => {
      cancelOrderDialogConfirm = confirm;
    });

    isCancelOrderDialogShow.value = false;

    await api.cancelReg({
      orderId,
      source: gStores.globalStore.browser.source,
    });

    init();
  };

  const refoundOrder = async () => {
    if (orderConfig.value.isOrderPay !== '1') {
      cancelOrder();
      return;
    }

    const args = {
      orderId: pageProps.value.orderId,
      source: gStores.globalStore.browser.source,
    };

    await api.refundOrder(args);
    init();
  };

  const goRatePage = () => {
    const orderId = pageProps.value.orderId;
    const {
      deptName,
      docName,
      hosDocId,
      hosId,
      hosDeptId,
      rateFlag,
      appointmentDate,
    } = orderRegInfo.value;

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/RegComment', {
        orderId,
        deptName,
        docName,
        hosDocId,
        hosId,
        hosDeptId,
        rateFlag,
        appointmentDate,
      }),
    });
  };

  const againOrder = async () => {
    // 跳到医生名片
    goDoctorCard();
  };

  onLoad((p) => {
    pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
  });

  onShow(() => {
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
        box-shadow: inset 0 18rpx 5px rgba(0, 0, 0, 0.07);
        margin: 0 32rpx;
        transform: translateY(-20rpx);
        border-radius: 0px 0px 8px 8px;

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
          margin-top: 16rpx;

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
  }
</style>
