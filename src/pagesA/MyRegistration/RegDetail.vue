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
                  orderConfig.isOrderPay
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
            <view
              v-if="isShowQr"
              class="qr-code g-flex-rc-cc g-border-bottom m32 flex1"
            >
              <view class="my-display-none">
                <w-qrcode :options="_qrCodeOpt" ref="refqrcode" />
                <w-barcode :options="_barCodeOpt" ref="refqrbarcode" />
              </view>

              <view class="qr g-flex-rc-cc flex1">
                <image
                  v-if="showQrCode"
                  :src="qrCodeOpt._qrImg"
                  class="qrcode-img"
                />

                <image
                  v-if="!showQrCode"
                  :src="qrCodeOpt._barImg"
                  mode="widthFix"
                  class="barcode-img flex1"
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
              class="hos-navigation g-flex-rc-cc m32 f32"
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

            <view class="order-info">
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
                  <view
                    v-else
                    :class="{
                      'color-blue': [
                        'hisResult',
                        '_fee',
                        '_hosAccountOffsetFee',
                        '_totalCost',
                      ].includes(item.key),
                    }"
                  >
                    {{ value }}
                  </view>
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
            orderRegInfo.rateFlag !== 1 &&
            orderConfig.isOpenComment === '1' &&
            orderRegInfo.orderId
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
        v-if="['20', '23', '42', '43', '45'].includes(orderRegInfo.orderStatus)"
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
      @confirmButton="_cancelOrderDialogConfirm"
    />

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
    useTBanner,
    TButtonConfig,
    debounce,
    PatientUtils,
    handlerWeChatThRegLogin,
  } from '@/utils';

  import {
    encryptDes,
    joinQuery,
    joinQueryForUrl,
    deQueryForUrl,
    cloneUtil,
    setLocalStorage,
    getLocalStorage,
  } from '@/common';
  import { beforeEach } from '@/router';

  import {
    IPageProps,
    IRegInfo,
    regInfoTempList,
    patientTempList,
    formatterTemp,
    getStatusConfig,
    getOrderStatusTitle,
    RegDetailUtil,
  } from './utils/regDetail';
  import { payMoneyOnline, toPayPull, IGPay } from '@/components/g-pay/index';

  import {
    usePayPage,
    getIsMedicalMode,
    TWxAuthorize,
    getQxMedicalNation,
    isMedicalSelf,
  } from '@/pagesA/clinicPay/utils/clinicPayDetail';

  import globalGl from '@/config/global';

  import api from '@/service/api';

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
    ['23', '45', '10', '70', '0', '20', '43', '42'].includes(
      orderRegInfo.value.orderStatus
    )
  );

  const { refPayList, changeRefPayList, wxPayMoneyMedicalPlugin } =
    usePayPage();

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

  /** 医保挂号? */
  const _getIsMedicalMode = () => {
    if (getIsMedicalMode()) {
      const medicalMHelp = globalGl.sConfig.medicalMHelp!;

      // #ifdef  MP-WEIXIN
      return medicalMHelp.wx?.isMedicalOrder === '1';
      // #endif

      // #ifdef MP-ALIPAY
      return medicalMHelp.alipay?.isMedicalOrder === '1';
      // #endif
    } else {
      return false;
    }
  };

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
    return getStatusConfig(orderRegInfo.value.orderStatus);
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
  const showConsultationDialog = async () => {
    if (!isFirstIn.value) return;

    if (
      orderRegInfo.value.orderStatus === '0' &&
      pageProps.value.preWz === '1' &&
      orderConfig.value.isOpenPreConsultation === '1'
    ) {
      dialogContent.value = '是否立即去给医生留言，方便医生提前了解您的病情?';
      isCancelOrderDialogShow.value = true;

      await new Promise((confirm) => {
        cancelOrderDialogConfirm = confirm;
      });

      isShowConsultationDialog.value = false;
      goPreConsultation();
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

    setLocalStorage({
      'reg-detail-init': '1',
    });
    useTBanner(preConsultation);
  };

  const getConfig = async () => {
    orderConfig.value = await ServerStaticData.getSystemConfig('order');
  };

  let init = async () => {
    uni.showLoading({});
    await getConfig();
    await wait(800);
    qrCodeOpt.value.width = 600;
    qrCodeOpt.value.size = 350;
    qrCodeOpt.value.code = '';
    orderRegInfo.value = {} as any;
    clearInterval(_timeTravel);

    const regDetailUtil = RegDetailUtil.getInstance(
      {
        prop: pageProps,
        orderConfig,
      },
      true
    );
    let _regInfoTempList = cloneUtil<typeof regInfoTempList>(regInfoTempList);

    if (orderConfig.value.isOrderPreSettle === '1') {
      console.log(_regInfoTempList, 'cqc');
      const freeIdx = _regInfoTempList.findIndex((o) => o.key === '_fee');
      _regInfoTempList.splice(
        freeIdx,
        1,
        ...(<typeof _regInfoTempList>[
          {
            label: '挂号金额',
            field: 'input-text',
            key: '_totalCost',
          },
          {
            label: '账户抵扣金额',
            field: 'input-text',
            key: '_hosAccountOffsetFee',
          },
          {
            label: '自费金额',
            field: 'input-text',
            key: '_fee',
          },
        ])
      );
    }

    const result = await regDetailUtil.getDataDetail();
    const hosList = await ServerStaticData.getHosList();
    uni.hideLoading();
    const hos = hosList.find((o) => o.hosId === result.hosId);
    if (hos) {
      hosInfo.value = hos;
    }

    const { downTime, qrCode, totalCost, hosAccountOffsetFee } = result;
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

    result._appointmentDate = `${result.appointmentDate} ${
      result.ampmName + result.appointmentTime
    }`;
    result._fee = result.fee + '元';
    result._category = result.schQukCategor || result.categorName;
    orderRegInfo.value = result;
    qrCodeOpt.value.code = result[qrCode];

    showConsultationDialog();
    isFirstIn.value = false;

    _regInfoTempList = _regInfoTempList.filter((o) => result[o.key]);
    uni.showLoading({});
    nextTick(() => {
      setTimeout(() => {
        capture();
        uni.hideLoading();
      }, 600);
    });
    patientTempList.map((o) => {
      if (o.key === 'patientId') {
        o.key = qrCode;
      }
    });

    formatterTemp(_regInfoTempList, gStores.globalStore.modeOld);
    formatterTemp(patientTempList, gStores.globalStore.modeOld);

    setTimeout(() => {
      refForm.value.setList(_regInfoTempList);
      refFormPatient.value.setList(patientTempList);
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

  const payOrder = async () => {
    // 先只做微信国标模式
    const isMedicalMode = _getIsMedicalMode();
    const { cardNumber } = gStores.userStore.patChoose;
    const isSelf = isMedicalMode && (await isMedicalSelf(cardNumber));

    if (isMedicalMode && isSelf) {
      changeRefPayList(1);
    } else {
      changeRefPayList(0);
    }

    setTimeout(() => {
      refPay.value.show();
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
          const authorize = await getQxMedicalNation();
          medicalNationWx(authorize);
          // #endif
        }

        break;

      default:
        break;
    }
  };

  const medicalNationWx = async (payload: TWxAuthorize) => {
    const { hosId, orderId } = orderRegInfo.value;
    const { userLongitudeLatitude, payAuthNo } = payload;
    const { source } = gStores.globalStore.browser;

    const requestArg = {
      ...userLongitudeLatitude,
      accountUseFlag: true,
      businessType: 3,
      hosId,
      orderId,
      payAuthNo,
      source,
    };

    const { result } = await api.medicalUp(requestArg);

    const info = {
      ...hosInfo.value,
      ...orderRegInfo.value,
      totalCost: result.totalFee,
      extend: payload,
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
    isFirstIn.value = true;

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
    cancelOrderDialogConfirm();
  };

  let cancelOrderDialogConfirm: (...args: any[]) => any = async () => {};
  const cancelOrder = async () => {
    isCancelOrderDialogShow.value = true;
    dialogContent.value = '确认取消该订单?';

    await new Promise((confirm) => {
      cancelOrderDialogConfirm = confirm;
    });

    isCancelOrderDialogShow.value = false;
    await RegDetailUtil.getInstance().cancelReg();

    init();
  };

  const refoundOrder = async () => {
    if (orderConfig.value.isOrderPay !== '1') {
      cancelOrder();
    } else {
      const { refundNeedAuth } = orderRegInfo.value;
      const args = {
        orderId: pageProps.value.orderId,
        source: gStores.globalStore.browser.source,
        payAuthNo: '',
      };
      if (refundNeedAuth === '0') {
        let isAlipay = false;
        // #ifdef MP-ALIPAY
        isAlipay = true;
        // #endif

        if (isAlipay) {
          gStores.messageStore.showMessage(
            '本次挂号属于微信医保挂号, 暂不支持支付宝端退费',
            3000
          );
          return;
        }

        setLocalStorage({
          'get-wx-medical-auth-code-order': '1',
        });

        const authorize = await getQxMedicalNation();

        args.payAuthNo = authorize.payAuthNo;
      }

      isCancelOrderDialogShow.value = true;
      dialogContent.value = '确认退号?';

      await new Promise((confirm) => {
        cancelOrderDialogConfirm = confirm;
      });
      isCancelOrderDialogShow.value = false;

      await api.refundOrder(args);
      init();
    }
  };

  const goRatePageRes = async () => {
    const { orderId } = pageProps.value;

    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/RegCommentRes', {
        orderId,
      }),
    });
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

    // 查看评价
    if (rateFlag == 0) {
      goRatePageRes();
    } else {
      setLocalStorage({
        'reg-detail-init': '1',
      });

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
    }
  };

  const againOrder = async () => {
    // 跳到医生名片
    goDoctorCard();
  };

  onShow(async () => {
    if (getLocalStorage('reg-detail-init') === '1') {
      setLocalStorage({
        'reg-detail-init': '',
      });

      init();
    }

    // 微信医保小程序跳回来后中断了链路 重新走下
    if (getLocalStorage('get-wx-medical-auth-code') === '1') {
      await wait(300);
      setLocalStorage({
        'get-wx-medical-auth-code': '',
      });

      if (gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode) {
        if (getLocalStorage('get-wx-medical-auth-code-order') === '1') {
          setLocalStorage({
            'get-wx-medical-auth-code-order': '',
          });

          refoundOrder();
        } else {
          getPayInfo({
            item: {
              key: 'medicare',
              label: '',
            },
          });
        }
      } else {
        gStores.messageStore.showMessage(
          '未完成电子医保凭证授权,无法继续医保结算'
        );
      }
    }
  });

  onLoad(async (p) => {
    uni.showLoading({});
    pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
    await handlerWeChatThRegLogin(pageProps.value);
    await beforeEach({
      url: joinQueryForUrl('/pagesA/MyRegistration/RegDetail', pageProps.value),
      _isPatient: true,
    });
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
