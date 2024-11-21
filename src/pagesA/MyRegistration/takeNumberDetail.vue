<template>
  <view
    :class="{
      [titleStatus.headerClass]: true,
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="reg-detail"
  >
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

            <view class="reg-header-label">
              {{
                getOrderStatusTitle(
                  orderRegInfo.orderStatus,
                  orderConfig.isOrderPay,
                  false
                )
              }}
            </view>
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
          <view class="container-box g-border container-box1">
            <view class="order-info">
              <g-form
                :value="orderRegInfo"
                forShowBodyAlign="left"
                bodyBold
                hideRowBorder
                ref="refForm"
              ></g-form>
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
            <g-flag :typeFg="'4'" isShowFgTip aaa />
          </view>
        </view>
      </view>
    </scroll-view>

    <view
      v-if="orderRegInfo.patientId && isShowFooter"
      class="footer g-border-top"
    >
      <view @click="goHome" class="home g-flex-rc-cc">
        <view class="iconfont home-icon">&#xe6df;</view>
        <view>首页</view>
      </view>

      <template>
        <block>

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
      </template>
    </view>

    <xy-dialog
      title=""
      :content="dialogContent"
      :show="isCancelOrderDialogShow"
      @cancelButton="isCancelOrderDialogShow = false"
      @confirmButton="_cancelOrderDialogConfirm"
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag isHideTitle isShowFgTip typeFg="1100" aaa />
      </scroll-view>
    </xy-dialog>

    <g-pay
      :list="refPayList"
      :autoPayArg="payArg"
      @pay-click="getPayInfo"
      autoInOne
      ref="refPay"
    >
      <view class="p32">
        <g-flag typeFg="49" isShowFgTip isHideTitle aaa />
      </view>
    </g-pay>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, nextTick } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import {
    GStores,
    ServerStaticData,
    IHosInfo,
    openLocation,
    ISystemConfig,
    wait,
    debounce,
    PatientUtils,
    apiAsync,
    callBackAsync,
  } from '@/utils';

  import {
    joinQuery,
    joinQueryForUrl,
    deQueryForUrl,
    setLocalStorage,
    cloneUtil,
  } from '@/common';

  import {
    IPageProps,
    IRegInfo,
    getStatusConfig,
    getOrderStatusTitle,
    formatterTemp,
    regInfoTempList,
    patientTempList,
  } from './utils/takeNumberDetail';
  import { payMoneyOnline, toPayPull, IGPay } from '@/components/g-pay/index';

  import {
    PayType,
    usePayPage,
    getIsMedicalMode,
    TWxAuthorize,
    getQxMedicalNation,
    getIsAliMedicalNation,
    _getQxMedicalNation,
  } from '@/pagesA/clinicPay/utils/clinicPayDetail';

  import globalGl from '@/config/global';

  import api from '@/service/api';

  const orderConfig = ref({} as ISystemConfig['order']);
  const refForm = ref<any>('');
  const refFormPatient = ref<any>('');
  const pageProps = ref({} as IPageProps);
  const gStores = new GStores();
  const isRender = ref(false);
  const orderRegInfo = ref({} as IRegInfo);
  const hosInfo = ref({} as IHosInfo);

  const payArg = ref<BaseObject>({});
  const refPay = ref<any>('');
  const isFirstIn = ref(true);

  const isShowFooter = computed(() => {
    return ['23', '45', '10', '70', '0', '20', '43', '42'].includes(
      orderRegInfo.value.orderStatus
    );
  });

  const { refPayList } = usePayPage();

  /** 医保挂号? */
  const _getIsMedicalMode = () => {
    if (getIsMedicalMode()) {
      const medicalMHelp = globalGl.sConfig.medicalMHelp!;

      // #ifdef  MP-WEIXIN
      return medicalMHelp?.wx?.isMedicalOrder === '1';
      // #endif

      // #ifdef MP-ALIPAY
      return medicalMHelp?.alipay?.isMedicalOrder === '1';
      // #endif
    } else {
      return false;
    }
  };

  const titleStatus = computed(() => {
    return getStatusConfig(orderRegInfo.value.orderStatus, false);
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
    uni.showLoading({});
    await getConfig();
    await wait(800);
    orderRegInfo.value = {} as any;
    clearInterval(_timeTravel);
    let _regInfoTempList = cloneUtil<typeof regInfoTempList>(regInfoTempList);
    const result = {
      downTime: 898,
      sysCode: '1001057',
      deptName: '关节膝关节科',
      hosGisLng: 108.948643,
      ampm: '2',
      orderId: '24112125422106551',
      patientId: '124990940644',
      numId: '',
      hosDeptId: 'B020504',
      idCard: '6****************2',
      fee: 7,
      ampmName: '下午',
      hisResult: '',
      orderStatus: '10',
      source: 19,
      upIdCard: '',
      schId: '20230824000000000913',
      visitingArea: '门诊二楼（门诊二楼202）',
      docName: '刘清华',
      categorName: '普通号',
      appointmentTime: '16:30-17:00',
      qrCode: 'cardNumber',
      clinicalType: '1',
      hosName: '西安市红会医院南院区（南稍门）',
      tradeType: '2',
      patientName: '王桂霞',
      cardType: '19',
      appointmentNumber: '',
      hosId: '13006',
      herenId: 63931115,
      patientPhone: '139****5995',
      patientNameEncry: '**霞',
      filing: '',
      hosOrderId: '2024112100002879',
      createTime: '2024-11-21T07:03:42.000+00:00',
      categor: '18',
      hosDocId: '20221359',
      hosGisLat: 34.242404,
      appointmentDate: '2024-11-21',
      cardNumber: '1001098651',
      totalCost: 7,
      schQukCategor: '关节膝关节科',

      _totalCost: '',

      hosAccountOffsetFee: 0.0,
      _hosAccountOffsetFee: '',
      _category: '',
      _fee: '',
      _appointmentDate: '',
    };

    const hosList = await ServerStaticData.getHosList();
    uni.hideLoading();
    const hos = hosList.find((o) => o.hosId === result.hosId);
    if (hos) {
      hosInfo.value = hos;
    }

    const {
      downTime,
      totalCost,
      hosAccountOffsetFee,
      appointmentDate,
      ampmName,
      appointmentTime,
    } = result;
    if (downTime) {
      timeTravel.value.downTime = downTime;
      startTimeTravel();
    }

    if (totalCost) {
      result._totalCost = totalCost + '元';
    }

    if (hosAccountOffsetFee) {
      result._hosAccountOffsetFee = hosAccountOffsetFee + '元';
    }

    result._appointmentDate = [appointmentDate, ampmName, appointmentTime]
      .filter((o) => o)
      .join(' ');
    result._fee = result.fee + '元';
    result._category = result.schQukCategor || result.categorName;
    // orderRegInfo.value = result  ;
    orderRegInfo.value = result as any;

    formatterTemp(_regInfoTempList, gStores.globalStore.modeOld);
    formatterTemp(patientTempList, gStores.globalStore.modeOld);
    const _patientTempList = patientTempList.filter(
      (o) => orderRegInfo.value[o.key]
    );

    setTimeout(() => {
      refForm.value.setList(_regInfoTempList);
      refFormPatient.value.setList(_patientTempList);
    }, 600);
  };

  init = debounce(init, 200, false);

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

  const getPayInfo = async ({ item }: { item: IGPay }) => {
    const { key } = item;

    // 清空退费存留状态
    setLocalStorage({
      'get-wx-medical-auth-code-order': '',
    });

    switch (key) {
      case 'online':
        // 预结算
        if (orderConfig.value.isOrderPreSettle === '1') {
          payPreSettlement();
        } else {
          toPay();
        }
        break;

      case 'medicare':
        const isMedicalMode = _getIsMedicalMode();

        if (isMedicalMode) {
          await new PatientUtils().upToMedicalPat({
            pat: gStores.userStore.patChoose,
          });
          // #ifdef  MP-WEIXIN
          medicalNationWx(await getQxMedicalNation());
          // #endif

          // #ifdef MP-ALIPAY
          // 国标医保
          if (getIsAliMedicalNation()) {
            payAliMedicalNation();
          }
          // #endif
        }

        break;
      default:
        break;
    }
  };

  const medicalNationWx = async (
    auth: TWxAuthorize,
    payload: any = {
      businessType: 3,
    }
  ) => {
    const { hosId, orderId } = orderRegInfo.value;
    const { userLongitudeLatitude, payAuthNo } = auth;
    const { source } = gStores.globalStore.browser;

    const requestArg = {
      ...userLongitudeLatitude,
      accountUseFlag: true,
      businessType: payload.businessType,
      hosId,
      orderId,
      payAuthNo,
      source,
    };

    uni.showLoading({
      title: '预上传...',
      mask: true,
    });
    const { result } = await api.medicalUp(requestArg);

    const info = {
      ...hosInfo.value,
      ...orderRegInfo.value,
      totalCost: result.totalFee,
      extend: auth,
      phsOrderSource: '1',
    };

    gStores.globalStore.assignCacheData({
      uploadRes: result,
      info,
    });

    uni.navigateTo({
      url: '/pagesA/clinicPay/clinicPayMedical',
    });
  };

  const payAliMedicalNation = async () => {
    medicalNationWx(
      await getQxMedicalNation(
        joinQueryForUrl('/pagesA/MyRegistration/RegDetail', pageProps.value)
      ),
      {}
    );
  };

  /**
   * 预结算挂号
   */
  const payPreSettlement = async () => {
    const { orderId } = pageProps.value;
    const { patientId } = gStores.userStore.patChoose;
    const { source } = gStores.globalStore.browser;

    const {
      result: { fee, needPay },
    } = await api.regPreSettlement({
      orderId,
      patientId,
      source,
    });

    if (needPay) {
      toPay(fee);
    } else {
      init();
    }
  };

  /** 自费挂号 */
  const toPay = async (totalFee = orderRegInfo.value.fee) => {
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
      const { hosId } = orderRegInfo.value;
      payArg.value = {
        phsOrderNo: orderId,
        sign: result.paySign,
        totalFee,
        hosId,
        phsOrderSource: '1',
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
    await wait(4000);
    uni.hideLoading();

    init();
  };

  const goDoctorCard = () => {
    const { deptName, docName, hosDocId, hosId, clinicalType, hosDeptId } =
      orderRegInfo.value;
    const { thRegisterId } = pageProps.value;

    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/DoctorDetails', {
        deptName,
        docName,
        hosDocId,
        hosId,
        clinicalType,
        hosDeptId,
        thRegisterId,
      }),
    });
  };

  const isCancelOrderDialogShow = ref(false);
  const dialogContent = ref('');
  const _cancelOrderDialogConfirm = () => {
    isCancelOrderDialogShow.value = false;
  };

  const cancelOrder = async () => {
    isCancelOrderDialogShow.value = true;
    dialogContent.value = '确认取消该订单?';

    isCancelOrderDialogShow.value = false;

    init();
  };

  const refoundOrder = async () => {
    const { wxOrderSubscribeMessage } = orderConfig.value;

    // #ifdef MP-WEIXIN
    if (wxOrderSubscribeMessage?.length) {
      // @ts-expect-error
      await apiAsync(uni.requestSubscribeMessage, {
        tmplIds: wxOrderSubscribeMessage,
      }).catch((e) => {
        console.error(e);
      });
    }
    // #endif

    if (orderConfig.value.isOrderPay !== '1') {
      cancelOrder();
    } else {
      const { refundNeedAuth, source } = orderRegInfo.value;
      const args = {
        orderId: pageProps.value.orderId,
        source: gStores.globalStore.browser.source,
        payAuthNo: '',
      };
      if (refundNeedAuth === '0') {
        let isAlipay = false;
        let isWx = false;

        // #ifdef MP-ALIPAY
        isAlipay = true;
        // #endif

        // #ifdef MP-WEIXIN
        isWx = true;
        // #endif

        if (isAlipay && source === 19) {
          gStores.messageStore.showMessage(
            '本次挂号属于微信医保挂号, 暂不支持支付宝端退费',
            3000
          );
          return;
        }

        if (isWx && source === 21) {
          gStores.messageStore.showMessage(
            '本次挂号属于支付宝医保挂号, 暂不支持微信端退费',
            3000
          );
          return;
        }

        setLocalStorage({
          'get-wx-medical-auth-code-order': '1',
        });

        const authorize = await getQxMedicalNation(
          joinQueryForUrl('/pagesA/MyRegistration/RegDetail', pageProps.value)
        );

        args.payAuthNo = authorize.payAuthNo;
      }

      isCancelOrderDialogShow.value = true;
      // dialogContent.value = '确认退号?';
      dialogContent.value = '';

      isCancelOrderDialogShow.value = false;

      await api.refundOrder(args);
      init();
    }
  };

  const againOrder = async () => {
    // 跳到医生名片
    goDoctorCard();
  };

  onShow(async () => {
    init();
  });

  onLoad(async (p) => {
    uni.showLoading({});
    pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
    isRender.value = true;
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
