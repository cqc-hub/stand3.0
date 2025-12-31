<template>
  <view
    :class="{
      [titleStatus.headerClass]: true,
      [gStores.globalStore.getPageClass]: true,
    }"
    class="reg-detail"
  >
    <!-- #ifdef  MP-WEIXIN -->
    <!-- {{ wxCrossProgramInfo||'' }} -->
    <code-btn
      v-if="wxCrossProgramInfo.bizTypeReg && wxCrossProgramInfo.appId"
      :appId="wxCrossProgramInfo.appId"
      :bizType="wxCrossProgramInfo.bizTypeReg"
      :extInfo="wxCrossProgramInfo.extInfo"
      id="codePlugin"
      style="position: absolute; top: -100vh"
      :zIndex="99"
    ></code-btn>
    <!-- #endif -->
    <scroll-view scroll-y class="scroll-container">
      <view
        v-if="orderRegInfo.patientId || orderRegInfo.cardNumber"
        class="box"
      >
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
                  isWaitReg
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
              v-if="
                orderConfig.isOrderWithoutTime !== '1' &&
                isWaitForPay &&
                !isWaitReg &&
                pageProps.typeId !== '3'
              "
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
              <block v-if="isShowRefreshQrCode">
                <view class="mb24">
                  <refreshQrcode
                    :patientId="
                      pageProps.patientId ||
                      gStores.userStore.patChoose.patientId
                    "
                    :show-code="_qrCodeOpt.code"
                    label="就诊码"
                    isShowCode
                  />
                </view>
              </block>

              <block v-else>
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
                  <text>
                    点击切换{{ (showQrCode && '条形码') || '二维码' }}
                  </text>
                </view>
              </block>
            </view>

            <view
              v-if="hosInfo.gisLat"
              @click="openHosLocation"
              :style="{
                background: `url(${globalGl.BASE_IMG}reg-detail-position-bg${
                  gStores.globalStore.isTcmStyle ? '-tcm' : ''
                }.png) 100%/100% no-repeat`,
              }"
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
                <template #showbody="{ item, value }">
                  <view
                    @click="goDoctorCard"
                    v-if="
                      item.key === 'docName' &&
                      !isWaitForPay &&
                      orderRegInfo.hosDocId
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
                  </view>

                  <view
                    v-else-if="item.key === 'deptName'"
                    class="flex-normal doc-name"
                  >
                    <view class="flex">
                      <view class="mr12">{{ orderRegInfo.deptName }}</view>
                      <view
                        v-if="
                          orderConfig.regDeptButton &&
                          orderConfig.regDeptButton[orderRegInfo.hosId]
                        "
                        @click="useDeptTBanner"
                        class="btn btn-primary btn-border btn-plain btn-round btn-small"
                      >
                        {{ orderConfig.regDeptButton[orderRegInfo.hosId].text }}
                      </view>
                    </view>
                  </view>

                  <view
                    v-else-if="item.key === 'hisResult'"
                    :class="{
                      [titleStatus.cardColor]: 1,
                      'color-blue':
                        titleStatus.cardColor === 'var(--hr-neutral-color-7)',
                    }"
                    class="flex-normal doc-name"
                  >
                    <view>
                      {{ value }}
                    </view>
                  </view>
                  <view
                    v-else-if="item.key === 'visitingArea'"
                    class="color-blue flex-normal doc-name"
                    @click="handleNav"
                  >
                    <view class="doc-name-value">
                      {{ value }}
                    </view>
                    <view
                      style="font-weight: 400"
                      class="iconfont"
                      v-if="judgeAllowNav()"
                    >
                      &#xe6c8;
                    </view>
                  </view>
                  <view
                    v-else
                    :class="{
                      'color-blue': [
                        '_fee',
                        '_hosAccountOffsetFee',
                        '_totalCost',
                        'visitingArea',
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
            <g-flag
              v-if="isRender"
              :typeFg="isWaitReg ? '1114' : '4'"
              isShowFgTip
              aaa
            />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 取消、退号 是两个概念 退号要退钱， 取消是取消锁号-->
    <view
      v-if="(orderRegInfo.patientId || orderRegInfo.cardNumber) && isShowFooter"
      class="footer g-border-top"
    >
      <view @click="goHome" class="home g-flex-rc-cc">
        <view class="iconfont home-icon">&#xe6df;</view>
        <view>首页</view>
      </view>

      <button
        v-if="isShowCancelRegWait(_d)"
        @click="refoundOrder"
        class="btn btn-plain btn-error g-border"
      >
        {{ '取消候补' }}
      </button>

      <button
        v-if="isShowRegCancel(_d)"
        @click="cancelOrder"
        class="btn g-border"
        :class="{
          [isShowRegPay(_d) ? 'btn-normal' : 'btn-plain btn-error']: 1,
        }"
      >
        {{ '取消预约' }}
      </button>

      <button
        v-if="isShowRegRefound(_d)"
        @click="refoundOrder"
        class="btn btn-plain btn-error g-border"
      >
        {{ '退号' }}
      </button>

      <button
        v-if="isShowRegReorder(_d)"
        @click="againOrder"
        class="btn g-border"
        :class="{
          [orderRegInfo.orderStatus === '70' ? 'btn-normal' : 'btn-primary']: 1,
        }"
      >
        再次预约
      </button>

      <button
        v-if="isShowRegCommentViews(_d)"
        @click="goRatePage"
        class="btn g-border btn-primary"
      >
        查看评价
      </button>

      <button
        v-if="isShowRegComment(_d)"
        @click="goRatePage"
        class="btn g-border btn-primary"
      >
        服务评价
      </button>

      <button
        v-if="isShowRegPay(_d)"
        @click="payOrder"
        :class="{
          'btn-disabled': timeTravel.downTime <= 0,
        }"
        class="btn btn-warning pay-btn"
      >
        {{ orderRegInfo.fee }}元 立即支付
      </button>

      <button
        v-if="isShowMedicalRefund(_d)"
        @click="handleMedicalRefund"
        class="btn btn-warning pay-btn"
      >
        去报销
      </button>

      <button
        v-if="isShowRegDateDelay(_d)"
        @click="goUpdateRegDate"
        class="btn g-border btn-primary"
      >
        推迟预约日期
      </button>
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
    useTBanner,
    TButtonConfig,
    debounce,
    PatientUtils,
    handlerWeChatThRegLogin,
    cacheUtil,
    callBackAsync,
    setDefaultPatient,
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
    goAskForDoc1001048,
    goAskForDoc1001045,
    useRegBtnShows,
  } from './utils/regDetail';
  import { payMoneyOnline, toPayPull, IGPay } from '@/components/g-pay/index';

  import {
    PayType,
    usePayPage,
    getIsMedicalMode,
    TWxAuthorize,
    getQxMedicalNation,
    getIsAliMedicalNation,
    _getQxMedicalNation,
    getMedicalArgWithFamily,
    getMedical1001035Info,
    handlerMedicalPay1001035,
    getMedicalNationInfo,
    handlerMedicalPayDongRuan,
    getOnlineMedicalConfig,
  } from '@/pagesA/clinicPay/utils/clinicPayDetail';

  import { HosNavData } from './utils/MyRegistration';

  import globalGl from '@/config/global';

  import api from '@/service/api';

  import refreshQrcode from '@/components/refresh-qrcode/refresh-qrcode.vue';

  const orderConfig = ref({} as ISystemConfig['order']);
  const refForm = ref<any>('');
  const refFormPatient = ref<any>('');
  const pageProps = ref({} as IPageProps);
  const gStores = new GStores();
  const isRender = ref(false);
  const showQrCode = ref(false);
  const isShowRefreshQrCode = ref(false);
  const orderRegInfo = ref({} as IRegInfo);
  const hosInfo = ref({} as IHosInfo);
  const isShowQr = computed(() => {
    return (
      ['0', '100', '70', '75'].includes(orderRegInfo.value.orderStatus) &&
      qrCodeOpt.value.code
    );
  });

  const payArg = ref<BaseObject>({});
  const refPay = ref<any>('');
  const isFirstIn = ref(true);

  const {
    isShowMedicalRefund,
    isShowRegPay,
    isShowRegComment,
    isShowRegCommentViews,
    isShowRegReorder,
    isShowRegRefound,
    isShowRegCancel,
    isShowCancelRegWait,
    isShowRegDateDelay,
  } = useRegBtnShows();

  const _d = computed(() => {
    return {
      ...pageProps.value,
      ...orderRegInfo.value,
    };
  });

  const isShowFooter = computed(() => {
    return (
      isShowMedicalRefund(_d.value) ||
      isShowRegDateDelay(_d.value) ||
      isShowCancelRegWait(_d.value) ||
      isShowRegPay(_d.value) ||
      isShowRegComment(_d.value) ||
      isShowRegCommentViews(_d.value) ||
      isShowRegCancel(_d.value) ||
      isShowRegRefound(_d.value) ||
      isShowRegReorder(_d.value)
    );
  });

  const isWaitReg = computed(() => {
    return pageProps.value._type === 'waitReg';
  });

  const isForwardReg = computed(() => {
    return pageProps.value._type === 'forwardReg';
  });

  const isWaitForPay = computed(() => {
    return ['10', '101'].includes(orderRegInfo.value.orderStatus);
  });

  const { refPayList, changeRefPayList, wxCrossProgramInfo } = usePayPage();

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

      if (gStores.globalStore.ev === 'wx') {
        return medicalMHelp?.wx?.isMedicalOrder === '1';
      }
      if (gStores.globalStore.ev === 'alipay') {
        return medicalMHelp?.alipay?.isMedicalOrder === '1';
      }
    }

    return false;
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
    return getStatusConfig(orderRegInfo.value.orderStatus, isWaitReg.value);
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

  const getDataDelay = 600;
  const captureStatus = async (count = 0) => {
    if (count > 3) {
      gStores.messageStore.showMessage('查询医保状态失败', 1500);
      return;
    }
    uni.showLoading({
      title: '查询中',
    });
    await wait(3000);
    await init();
    await wait(getDataDelay + 20);
    uni.showLoading({
      title: '查询中',
    });
    if (pageProps.value.needOrderStatus !== orderRegInfo.value.orderStatus) {
      captureStatus(++count);
    }
  };

  const showConsultationDialog1001048 = async () => {
    if (gStores.globalStore.sysCode !== '1001048') {
      return;
    }
    dialogContent.value = '是否立即去给医生留言，方便医生提前了解您的病情?';
    isCancelOrderDialogShow.value = true;
    await new Promise((confirm) => {
      cancelOrderDialogConfirm = confirm;
    });

    goPreConsultation();
  };

  // 预问诊
  const showConsultationDialog = async () => {
    if (!isFirstIn.value) return;

    if (
      // isWaitForPay.value &&
      pageProps.value.preWz === '1' &&
      ['0', '101', '100'].includes(orderRegInfo.value.orderStatus) &&
      orderConfig.value.isOpenPreConsultation === '1' &&
      gStores.globalStore.sysCode !== '1001048'
    ) {
      dialogContent.value = '是否立即去给医生留言，方便医生提前了解您的病情?';
      isCancelOrderDialogShow.value = true;

      await new Promise((confirm) => {
        cancelOrderDialogConfirm = confirm;
      });

      goPreConsultation();
    }
  };

  const goPreConsultation = () => {
    if (orderConfig.value.preConsultationBtn) {
      //指定的预问诊跳转
      useTBanner(
        orderConfig.value.preConsultationBtn,
        'navigateTo',
        pageProps.value
      );
      return;
    }

    if (gStores.globalStore.sysCode === '1001048') {
      goAskForDoc1001048(orderRegInfo.value);
      return;
    }

    if (gStores.globalStore.sysCode === '1001045') {
      goAskForDoc1001045(orderRegInfo.value);
      return;
    }

    const { patientSex, patientAge, patientName, patientId } =
      gStores.userStore.patChoose;
    const { orderId } = pageProps.value;
    const pageArg = {
      patientSex,
      patientAge,
      patientName,
      patientId,
      deptName: orderRegInfo.value.deptName,
      orderId,
      hosOrderId:orderRegInfo.value.hosOrderId,
      hosDeptId: orderRegInfo.value.hosDeptId,
      hosId: orderRegInfo.value.hosId,
    };

    const preConsultation: TButtonConfig = {
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/inquiries/inquiriesRes1',
      text: '预问诊',
      extraData: pageArg,
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
    const { isOrderWithoutTime } = orderConfig.value;
    const { sysCode } = gStores.globalStore;
    uni.showLoading({ title: '加载中' });
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

    // 预结算展示字段和原来有偏差
    if (orderConfig.value.isOrderPreSettle === '1') {
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
            label: '优惠及账户抵扣金额',
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

    let result;
    if (isWaitReg.value) {
      result = pageProps.value;
      // @ts-expect-error
      result.patientNameEncry = pageProps.value.patientName;
    } else {
      result = await regDetailUtil.getDataDetail();
    }

    const hosList = await ServerStaticData.getHosList();
    uni.hideLoading();
    const hos = hosList.find((o) => o.hosId === result.hosId);

    const {
      downTime,
      qrCode,
      totalCost,
      hosAccountOffsetFee,
      appointmentDate,
      ampmName,
      appointmentTime,
      deptName = '',
    } = result;

    if (hos) {
      hosInfo.value = hos;
      if (sysCode === '1001094' && deptName.includes('大十字')) {
        Object.assign(hosInfo.value, {
          hosName: '新疆中医医院（大十字部)',
          address: '新疆维吾尔自治区乌鲁木齐市天山区解放北路303号',
          gisLat: 43.79351,
          gisLng: 87.620501,
        });
      }
    }

    if (downTime) {
      timeTravel.value.downTime = downTime;
      startTimeTravel();
    }

    if (isOrderWithoutTime === '1') {
      timeTravel.value.downTime = 100;
      clearInterval(_timeTravel);
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
    if (result.fee || result.totalCost) {
      result._fee = (result.fee || result.totalCost) + '元';
    }
    result._category = result.schQukCategor || result.categorName;
    orderRegInfo.value = result;
    qrCodeOpt.value.code = result[qrCode];

    showConsultationDialog();
    await wait(0);
    isFirstIn.value = false;

    _regInfoTempList = _regInfoTempList.filter((o) => result[o.key]);
    uni.showLoading({ title: '加载中' });
    await callBackAsync(nextTick);
    await wait(600);
    !isShowRefreshQrCode.value && qrCodeOpt.value.code && capture();
    patientTempList.map((o) => {
      if (o.key === 'patientId') {
        o.key = qrCode;
      }
    });

    formatterTemp(_regInfoTempList, gStores.globalStore.modeOld);
    formatterTemp(patientTempList, gStores.globalStore.modeOld);
    const _patientTempList = patientTempList.filter(
      (o) => orderRegInfo.value[o.key]
    );

    setTimeout(() => {
      refForm.value.setList(_regInfoTempList);
      refFormPatient.value.setList(_patientTempList);
      uni.hideLoading();
    }, getDataDelay);

    dealContinueMedicalNationAuth();
  };

  // 支付宝国标医保授权回来将刷新整个页面, 数据丢失
  const dealContinueMedicalNationAuth = async () => {
    let isAli = true;
    // #ifndef MP-ALIPAY
    isAli = false;
    // #endif

    if (!Object.keys(orderRegInfo.value).length) {
      return;
    }

    if (
      getLocalStorage('get-ali-medical-auth-code') === '1' ||
      getLocalStorage('get-wx-medical-auth-code') === '1'
    ) {
      setLocalStorage({
        'get-ali-medical-auth-code': '',
        'get-wx-medical-auth-code': '',
      });

      let isAlilAuth = '';
      // #ifdef MP-ALIPAY
      isAlilAuth = (await _getQxMedicalNation()).payAuthNo;
      // #endif
      // gStores.globalStore.onAppShow({
      //   referrerInfo: {
      //     extraData: {
      //       authCode: '233'
      //     }
      //   }
      // })
      if (
        gStores.globalStore.appShowData.referrerInfo?.extraData?.payAuthNo ||
        gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode ||
        isAlilAuth
      ) {
        // 退号
        if (getLocalStorage('get-wx-medical-auth-code-order') === '1') {
          setLocalStorage({
            'get-wx-medical-auth-code-order': '',
          });

          refoundOrder();
        } else if (getLocalStorage('get-medical-refund') === '1') {
          setLocalStorage({
            'get-medical-refund': '',
          });
          handleMedicalRefund();
        } else {
          // 挂号
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
    const { fee } = orderRegInfo.value;
    if (fee === 0) {
      toPay();
      return;
    }

    const isMedicalMode = _getIsMedicalMode();
    const onlineMedicalConfig = await getOnlineMedicalConfig();

    const isSelf = true;
    const payList = [] as any;

    if (
      orderRegInfo.value.tradeType !== '1' &&
      isMedicalMode &&
      onlineMedicalConfig.isMedicalOrder === '1' &&
      isSelf
    ) {
      payList.push(PayType.Medicare);
    } else {
      payList.push(PayType.Online);
    }

    if (wxCrossProgramInfo.value?.bizTypeReg) {
      payList.push(PayType.BizType);
    }
    changeRefPayList(payList);

    setTimeout(() => {
      refPay.value.show();
    });
  };

  /** 自费后医保报销 */
  const handleMedicalRefund = async () => {
    setLocalStorage({
      'get-medical-refund': '1',
    });
    const auth = await getQxMedicalNation({
      returnUrl: joinQueryForUrl(
        '/pagesA/MyRegistration/RegDetail',
        pageProps.value
      ),
    });

    await medicalNationWx(
      auth,
      {
        businessType: 3,
      },
      async ({ payOrderId }) => {
        const { hosId, cardNumber } = orderRegInfo.value;

        await api.confirmRegisterSettle({
          payOrderId,
          hosId,
          cardNumber,
        });

        uni.reLaunch({
          url: '/pagesA/MyRegistration/MyRegistration?typeId=1',
        });

        return Promise.reject('医保报销');
      }
    );
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
        const medicalNationInfo = getMedicalNationInfo();

        if (isMedicalMode) {
          await new PatientUtils().upToMedicalPat({
            pat: gStores.userStore.patChoose,
          });

          await getMedicalArgWithFamily();
          // #ifdef  MP-WEIXIN
          if (medicalNationInfo && medicalNationInfo.dongRuanMedicalInfo) {
            const { hosOrderId: medOrgOrd, orderId } = orderRegInfo.value;

            handlerMedicalPayDongRuan({
              resultConfig: {
                cancelUrl: `/pagesA/MyRegistration/RegDetail?orderId=${orderId}&patientId=${gStores.userStore.patChoose.patientId}0&preWz=1`,
                successUrl: `/pagesA/MyRegistration/RegDetail?orderId=${orderId}&needOrderStatus=0&preWz=1`,
              },
              medOrgOrd,
            });
          } else {
            medicalNationWx(await getQxMedicalNation());
          }
          // #endif

          // #ifdef MP-ALIPAY
          // 国标医保
          if (getIsAliMedicalNation()) {
            payAliMedicalNation();
          }
          // #endif
        }

        break;
      case 'bizType':
        const curPagesList = getCurrentPages();
        const curPages: any = curPagesList[curPagesList.length - 1];
        const { openFunc } = curPages.selectComponent('#codePlugin');
        openFunc();
        break;
      default:
        break;
    }
  };

  const medicalNationWx = async (
    auth: TWxAuthorize,
    payload: any = {
      businessType: 3,
    },
    cbAfterUp: (...args: any[]) => any = () => {}
  ) => {
    const { hosId, orderId, ampm } = orderRegInfo.value;
    const { userLongitudeLatitude = {}, payAuthNo } = auth;
    const { source } = gStores.globalStore.browser;

    const requestArg = {
      ...auth,
      ...userLongitudeLatitude,
      timeDesc: ampm === '1' ? 'A' : 'P',
      accountUseFlag: true,
      businessType: payload.businessType,
      hosId,
      orderId,
      payAuthNo,
      source,
    };

    console.log(JSON.stringify(requestArg));
    // return

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

    const medical1001035 = await getMedical1001035Info();

    if (medical1001035) {
      setLocalStorage({
        'reg-detail-init': '1',
      });

      handlerMedicalPay1001035({
        phsOrderSource: '1',
      });
      return;
    }

    await cbAfterUp(result);

    uni.navigateTo({
      url: '/pagesA/clinicPay/clinicPayMedical',
    });
  };

  const payAliMedicalNation = async () => {
    medicalNationWx(
      await getQxMedicalNation({
        returnUrl: joinQueryForUrl(
          '/pagesA/MyRegistration/RegDetail',
          pageProps.value
        ),
      }),
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
      browser: { source },
    } = gStores.globalStore;
    const { orderId } = pageProps.value;
    const arg = {
      source,
      orderId,
    };
    // return

    // 0元号
    if (totalFee === 0) {
      await api.freeRegPay(arg);
    } else {
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
      }
    }

    payAfter();
  };

  const payAfter = async () => {
    uni.showLoading({
      mask: true,
    });
    isFirstIn.value = true;

    await wait(4000);
    uni.hideLoading();

    init();
    showConsultationDialog1001048();
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
    const { initialText } = await gStores.getSysAppMore(1282);
    initialText && (dialogContent.value = initialText);
    await new Promise((confirm) => {
      cancelOrderDialogConfirm = confirm;
    });

    isCancelOrderDialogShow.value = false;

    await RegDetailUtil.getInstance().cancelReg();

    init();
  };

  const goUpdateRegDate = () => {
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesA/dongzong/updateRegDate',
      isLocal: '1',
      addition: {
        patientId: '_patientId',
        herenId: 'herenId',
        token: 'token',
      },
      extraData: {
        orderRegInfo: JSON.stringify({
          ...orderRegInfo.value,
        }),
      },
    });
  };

  const refoundWaitOrder = async () => {
    dialogContent.value = '确定取消候补预约吗?';
    isCancelOrderDialogShow.value = true;

    await new Promise((confirm) => {
      cancelOrderDialogConfirm = confirm;
    });
    isCancelOrderDialogShow.value = false;

    await api.cancelAlternate({
      alternateId: pageProps.value.alternateId,
      source: gStores.globalStore.browser.source,
    });

    gStores.messageStore.showMessage('取消候补预约成功', 3000, {
      closeCallBack() {
        if (orderConfig.value?.isTabWaitReg === '1') {
          uni.reLaunch({
            url: '/pagesA/MyRegistration/MyRegistration?typeId=2',
          });
        } else {
          uni.reLaunch({
            url: '/pagesA/MyRegistration/MyRegistration?type=waitReg',
          });
        }
      },
    });
  };

  const refoundForwardReg = async () => {
    dialogContent.value = '确定取消远期预约吗?';
    isCancelOrderDialogShow.value = true;

    await new Promise((confirm) => {
      cancelOrderDialogConfirm = confirm;
    });
    isCancelOrderDialogShow.value = false;

    await api.cancelForwardReg({
      hosId: orderRegInfo.value.hosId,
      hosOrderId: orderRegInfo.value.hosOrderId,
      cardNumber: orderRegInfo.value.cardNumber,
      resDate: orderRegInfo.value.appointmentDate,
      schId: orderRegInfo.value.schId,
      source: gStores.globalStore.browser.source,
    });

    gStores.messageStore.showMessage('取消远期预约成功', 3000, {
      closeCallBack() {
        uni.reLaunch({
          url: '/pagesA/MyRegistration/MyRegistration?typeId=4',
        });
      },
    });
  };

  const refoundOrder = async () => {
    const { typeId } = pageProps.value;

    if (isWaitReg.value) {
      return refoundWaitOrder();
    }
    if (isForwardReg.value) {
      return refoundForwardReg();
    }

    if (pageProps.value._type === 'znpz') {
      await RegDetailUtil.getInstance().refoundOrder({
        returnUrl: joinQueryForUrl('/pagesA/guide/guide', {
          tabKey: 1,
        }),
      });
      return;
    }

    await RegDetailUtil.getInstance().refoundOrder({
      returnUrl: joinQueryForUrl(
        '/pagesA/MyRegistration/RegDetail',
        pageProps.value
      ),
    });

    if (typeId === '1') {
      uni.reLaunch({
        url: joinQueryForUrl('/pagesA/MyRegistration/MyRegistration', {
          typeId,
        }),
      });
      return;
    }

    init();
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

  //院内导航
  const handleNav = async () => {
    if (judgeAllowNav()) {
      let item = orderRegInfo.value;
      useTBanner(HosNavData[item.hosId](item), 'navigateTo', item);
    }
  };

  const judgeAllowNav = () => {
    if (gStores.globalStore.sysCode === '1001052') {
      const { hosId, extend } = orderRegInfo.value;
      if (['13001'].includes(hosId)) {
        try {
          if (JSON.parse(extend || '').areaId) {
            return true;
          }
        } catch (e) {
          return false;
        }
      }
    }
    return false;
  };

  const useDeptTBanner = () => {
    let { hosDeptId, hosId } = orderRegInfo.value;
    const regDeptButton = orderConfig.value.regDeptButton![hosId];

    if (gStores.globalStore.sysCode === '1001048') {
      hosDeptId.indexOf('|') != -1 &&
        (hosDeptId = hosDeptId.substr(0, hosDeptId.indexOf('|')));
    }

    useTBanner(regDeptButton, 'navigateTo', {
      ...pageProps.value,
      ...gStores.userStore.patChoose,
      ...orderRegInfo.value,
      _hosDeptId: hosDeptId,
    });

    // wx.navigateToMiniProgram({
    //   appId: 'wx8735a8a39cf58b5e',
    //   // pages/index?id=医院id&appKey=向我方获取&poi=科室id A73x1x702
    //   path: `pages/index?id=5B2OQCgmhE&appKey=PRUtJJeHE3&poi=${hosDeptId}`,
    // });
  };

  onShow(async () => {
    if (getLocalStorage('reg-detail-init') === '1') {
      setLocalStorage({
        'reg-detail-init': '',
      });

      await init();
    }
    dealContinueMedicalNationAuth();
  });

  onLoad(async (p) => {
    uni.showLoading({ title: '加载中' });
    const { GlobalConfig } = await cacheUtil.getSystemConfig('GlobalConfig')();
    isShowRefreshQrCode.value = (GlobalConfig.refreshQrCode || []).includes(
      'pagesA/medicalCardMan/electronicMedicalCard'
    );
    pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
    const { patientId } = pageProps.value;
    isRender.value = true;
    uni.setNavigationBarTitle({
      title: isWaitReg.value ? '候补详情' : '挂号详情',
    });
    if (patientId) {
      setDefaultPatient(patientId);
    }
    await getConfig();
    const { needOrderStatus } = pageProps.value;
    await handlerWeChatThRegLogin(pageProps.value);
    const routeArg = {
      url: joinQueryForUrl('/pagesA/MyRegistration/RegDetail', pageProps.value),
      _isLogin: true,
      _isPatient: true,
    };
    if (orderConfig.value.isOrderWithoutPat === '1') {
      routeArg._isPatient = false;
    }
    await beforeEach(routeArg);
    await init();

    if (pageProps.value.preWz === '1') {
      if (
        orderRegInfo.value.orderStatus === '0' &&
        gStores.globalStore.sysCode === '1001048'
      ) {
        showConsultationDialog1001048();
      }
    }

    if (pageProps.value._autoPay === '1') {
      if (
        orderConfig.value.isConfirmOrderWithPay === '1' &&
        isShowRegPay(_d.value)
      ) {
        payOrder();
      }
    }

    if (needOrderStatus && orderRegInfo.value.orderStatus !== needOrderStatus) {
      captureStatus();
    }
  });
</script>

<style lang="scss" scoped>
  .reg-detail {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .scroll-container {
      flex: 1;
      // height: 1px;
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
          var(--hr-brand-color-6) 38%,
          var(--hr-brand-color-6) 96%
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
          // background: url($base-url + 'reg-detail-position-bg.png') 100%/100%
          //   no-repeat;
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
            margin-top: 6rpx;
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

  .btn-small {
    font-size: var(--hr-font-size-xxxs);
    padding: 8rpx 12rpx;
    // line-height: 1em;
    // height: 100%;
    // width: 100%;
    border-radius: 99px;

    &::after {
      display: none;
    }
  }
</style>
