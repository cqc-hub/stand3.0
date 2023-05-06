<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <view class="g-container">
      <view class="head-bg" />
      <view class="container">
        <block v-if="props.payState === '0'">
          <view class="g-border box page-first-item mb16">
            <view class="my-display-none">
              <w-qrcode :options="_qrOpt" ref="refqrcode" />
              <w-barcode :options="_barOpt" ref="refqrbarcode" />
            </view>

            <view class="g-flex-rc-cc g-bold f32 mb32">
              <!-- 请凭二维码到药房窗口取药 -->
            </view>

            <view class="qr g-flex-rc-cc">
              <image v-if="showQrCode" :src="qrOpt._qrImg" class="qrcode-img" />
              <image
                v-if="!showQrCode"
                :src="qrOpt._barImg"
                class="barcode-img"
              />
            </view>

            <view class="g-flex-rc-cc mt16 color-888 f24">{{ qrCode }}</view>

            <view
              @click="showQrCode = !showQrCode"
              class="qr-code-toggle g-flex-rc-cc color-blue f24"
            >
              <text
                :class="{
                  'icon-reverse': showQrCode,
                }"
                class="iconfont qr-toggle-icon color-blue"
              >
                &#xe6f9;
              </text>
              <text>点击切换{{ (showQrCode && '条形码') || '二维码' }}</text>
            </view>
          </view>

          <view class="g-border box">
            <view class="g-bold f36 g-break-word">
              {{ props.deptName }}
            </view>

            <Pay-Detail-Head-Box-Detail
              :myprops="props"
              :detailData="detailData"
              :pageConfig="pageConfig"
              :systemModeOld="gStores.globalStore.modeOld"
            />
          </view>
        </block>

        <view
          v-if="props.payState === '1'"
          class="head-box g-border box page-first-item"
        >
          <view class="g-bold f40 g-break-word">
            {{ props.deptName }}
          </view>

          <Pay-Detail-Head-Box-Detail
            :myprops="props"
            :detailData="detailData"
            :pageConfig="pageConfig"
            :systemModeOld="gStores.globalStore.modeOld"
          />
        </view>

        <view class="box info-box mt16 g-border">
          <view class="flex-between g-bold f36">
            <view>费用总额</view>
            <view v-if="props.payState === '1'" class="color-error">
              {{ detailData.totalCost }}元
            </view>
          </view>

          <block v-if="detailData.costList && detailData.costList.length">
            <view class="mt8">
              <Pay-Detail-Cost-List
                :list="detailData.costList"
                :selList="selList"
                :mulit="isCanSelServerFee"
                @sel-item="selItem"
              />
            </view>
          </block>
        </view>

        <view class="mt24">
          <g-flag
            :typeFg="props.payState === '0' ? '38' : '0'"
            isShowFgTip
            aaa
          />
        </view>
      </view>
    </view>

    <g-pay
      :list="refPayList"
      :autoPayArg="payArg"
      @pay-success="payAfter"
      @pay-click="getPayInfo"
      autoInOne
      ref="refPay"
    >
      <view
        v-if="getIsMedicalModePlugin() && pageConfig.confirmPayFg"
        class="p32"
      >
        <g-flag
          v-model:title="confirmFgTitle"
          :typeFg="pageConfig.confirmPayFg!"
          isShowFgTip
          isHideTitle
          aaa
        />
      </view>
    </g-pay>

    <xy-dialog
      title=""
      content="是否确认取消缴费单?"
      :show="isCannelShow"
      @cancelButton="isCannelShow = false"
      @confirmButton="cannelOrder"
    />

    <Order-Reg-Confirm
      v-if="pageConfig.confirmPayFg"
      :title="confirmFgTitle"
      @confirm="getPay"
      height="50vh"
      confirmText="确定"
      cannerText="取消"
      headerIcon=""
      ref="regDialogConfirm"
      isShowCloseIcon
      footerBtnIsometric
    >
      <g-flag
        v-if="pageConfig && pageConfig.confirmPayFg"
        v-model:title="confirmFgTitle"
        :typeFg="pageConfig.confirmPayFg!"
        isShowFgTip
        isHideTitle
        aaa
      />
    </Order-Reg-Confirm>

    <Wx-Pay-Money-Medical-Popup ref="wxPryMoneyMedicalDialog" />

    <block v-if="isComplete">
      <view v-if="props.payState === '1'" class="g-footer">
        <block>
          <button
            v-if="pageConfig.isOpenChargeback === '1'"
            @click="isCannelShow = true"
            class="btn btn-normal btn-border cancel-btn"
          >
            申请退单
          </button>
          <!-- handlerPay -->
          <button
            @click="handlerPay"
            :class="{
              'btn-disabled': !isCanPay,
            }"
            class="btn btn-warning confirm-btn"
          >
            立即支付
          </button>
        </block>
      </view>

      <view
        v-if="props.payState === '0' && pageConfig.isOpenChargeback === '1'"
        class="g-footer"
      >
        <button
          @click="isCannelShow = true"
          class="btn btn-plain btn-border btn-error cancel-btn"
        >
          申请退单
        </button>
      </view>
    </block>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue';
  import { onLoad, onReady, onShow } from '@dcloudio/uni-app';

  import {
    goConfirmPage,
    usePayPage,
    usePayDetailPage,
    getIsMedicalModePlugin,
    executeConfigPayAfter,
    isCanUseMedical,
    medicalNationUpload,
    isMedicalSelf,
    isDefaultMedical,
    getIsMedicalMode,
    type TPayDetailProp,
    type TCostList,
    type TWxAuthorize,
  } from './utils/clinicPayDetail';
  import {
    type IGPay,
    payMoneyOnline,
    toPayPull,
  } from '@/components/g-pay/index';
  import {
    deQueryForUrl,
    joinQueryForUrl,
    setLocalStorage,
    getLocalStorage,
  } from '@/common';
  import { wait } from '@/utils';

  import api from '@/service/api';
  import globalGl from '@/config/global';

  import PayDetailCostList from './components/PayDetailCostList.vue';
  import PayDetailHeadBoxDetail from './components/PayDetailHeadBoxDetail.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import WxPayMoneyMedicalPopup from './components/WxPayMoneyMedicalPopup.vue';

  const props = ref({} as TPayDetailProp);
  const refqrcode = ref('' as any);
  const refqrbarcode = ref('' as any);
  const isComplete = ref(false);
  const selList = ref<TCostList>([]);

  const { getDetailData, detailData } = usePayDetailPage();
  const {
    pageConfig,
    getSysConfig,
    gStores,
    refPayList,
    payArg,
    refPay,
    confirmFgTitle,
    regDialogConfirm,
    getPay,
    hookInit,
    changeRefPayList,
    wxPryMoneyMedicalDialog,
    wxPayMoneyMedicalPlugin,

  } = usePayPage();

  const qrCode = computed(() => {
    return detailData.value.qrCode || '';
  });
  const qrOpt = ref({
    // 二维码
    size: 320,

    _barImg: '',
    _qrImg: '',
  });

  const barOpt = ref({
    // 条形码
    width: 600, // 宽度 单位rpx
    height: 184, // 高度 单位rpx
  });

  const _qrOpt = computed(() => ({
    ...qrOpt.value,
    code: qrCode.value,
  }));

  const _barOpt = computed(() => ({
    ...barOpt.value,
    code: qrCode.value,
  }));

  const showQrCode = ref(true);
  const isCannelShow = ref(false);

  const capture = async () => {
    const { tempFilePath: qrCodeImg } = await refqrcode.value.GetCodeImg();
    const { tempFilePath: barcodeImg } = await refqrbarcode.value.GetCodeImg();

    qrOpt.value._barImg = barcodeImg;
    qrOpt.value._qrImg = qrCodeImg;

    closeQrOpt();
  };

  const isCanPay = computed(() => {
    if (props.value.payState !== '1') {
      return false;
    } else if (pageConfig.value.isSubitemPay === '1') {
      return selList.value.length;
    } else {
      return true;
    }
  });

  const getPayTotal = computed(() => {
    if (props.value.payState !== '1') {
      return 0;
    } else if (isCanSelServerFee.value) {
      const totalFee = selList.value.reduce(
        (prev, curr) => (prev += (curr.subCost as any) * 1),
        0
      );

      return Number((totalFee * 100).toFixed(2)) / 100;
    } else {
      return detailData.value.totalCost;
    }
  });

  // 可以选择性支付
  const isCanSelServerFee = computed(() => {
    let isMedicalPay = false;
    const isMedicalModePlugin = getIsMedicalModePlugin();
    const {
      sConfig: { medicalMHelp },
    } = globalGl;

    if (isMedicalModePlugin) {
      isMedicalPay = true;

      if (medicalMHelp) {
        const { wx: _wx } = medicalMHelp;
        // #ifdef  MP-WEIXIN
        if (_wx) {
          const { medicalNation } = _wx;

          if (medicalNation) {
            // 微信国标可以选择缴费
            isMedicalPay = false;
          }
        }
        // #endif
      }
    }

    isMedicalPay = isMedicalPay && props.value.costTypeCode === '2';

    return (
      props.value.payState === '1' &&
      pageConfig.value.isSubitemPay === '1' &&
      !isMedicalPay // 医保不支持选择
    );
  });
  const selItem = ({
    item,
    index,
  }: {
    item: TCostList[number];
    index: number;
  }) => {
    const { serialNo } = item;
    const idx = selList.value.findIndex((o) => o.serialNo === serialNo);

    if (idx === -1) {
      const allItem = detailData.value.costList!.filter(
        (o) => o.serialNo === serialNo
      );
      selList.value.push(...allItem);
    } else {
      selList.value = selList.value.filter((o) => o.serialNo !== serialNo);
    }
  };

  const getPayInfo = async ({ item }: { item: IGPay }) => {
    if (item.key === 'online') {
      // 预结算
      if (pageConfig.value.isPreSettle === '1') {
        const list = selList.value;
        const { hosId, childOrder, visitDate, visitNo, params } = props.value;

        goConfirmPage({
          hosId,
          serialNo: list.map((o) => o.serialNo).join(','),
          mergeOrder: childOrder,
          visitNo: visitNo!,
          visitDate: visitDate!,
          cardNumber: props.value?.cardNumber,
          mzParams: params,
        });
      } else {
        toPay();
      }
    } else if (item.key === 'medicare') {
      const isMedicalMode = getIsMedicalMode();

      if (isMedicalMode) {
        // #ifdef MP-ALIPAY
        payMoneyMedicalPlugin();
        // #endif

        // #ifdef  MP-WEIXIN
        wxPayMoneyMedicalPlugin(medicalNationWx);
        // #endif
      }
    }
  };

  /** 微信医保国标模式  获取到授权 */
  const medicalNationWx = async (payload: TWxAuthorize) => {
    const item = props.value;
    const pat = gStores.userStore.patChoose;

    const cardNumber = item.cardNumber || pat.cardNumber;
    const serialNo = selList.value.map((o) => o.serialNo).join(',');

    const uploadRes = await medicalNationUpload(
      {
        ...item,
        ...detailData.value,
      },
      payload,
      {
        businessType: '1',
        cardNumber: item.cardNumber || pat.cardNumber,
        serialNo,
      }
    );

    const info = {
      ...item,
      // businessType: '1',
      phsOrderSource: '2',
      cardNumber,
      patientId: item.cardNumber ? '' : pat.patientId,
      patientName: item.patientName || pat.patientName,
      payAuthNo: payload.payAuthNo,
      totalCost: detailData.value.totalCost,
      params: item.params,
      extend: payload,
    };

    gStores.globalStore.assignCacheData({
      uploadRes,
      info,
    });

    uni.navigateTo({
      url: '/pagesA/clinicPay/clinicPayMedical',
    });
  };

  const payMoneyMedicalPlugin = () => {
    const {
      sConfig: { medicalMHelp },
    } = globalGl;
    const { hosId, cardNumber } = props.value;

    if (medicalMHelp) {
      const { alipay } = medicalMHelp;

      if (alipay?.medicalPlugin) {
        const { medicalPlugin } = alipay;
        // #ifdef MP-ALIPAY
        // 支付宝 插件医保
        const authPayPlugin = requirePlugin('auth-pay-plugin');
        // 合并缴费后端控制 医保不能跨院区, 不能和自费混缴
        const orgId = medicalPlugin.orgId[hosId];
        const cardType = medicalPlugin.cardType;
        const medOrgOrd = props.value.traceNo;
        const cardNo = cardNumber || gStores.userStore.patChoose.cardNumber;

        const params = {
          orgId,
          cardType,
          cardNo,
          medOrgOrd,
        };

        my.getAuthCode({
          scopes: ['auth_user', 'nhsamp'],
          success: (res) => {
            const { authCode } = res;
            authPayPlugin.toAuthAndPay({
              // 授权获取的authCode
              authCode,
              // 请求接口所需参数
              params,
            });
          },
        });

        // #endif
      }
    }
  };

  const handlerPay = async () => {
    const { costTypeCode } = props.value;
    const isMedicalMode = getIsMedicalMode();
    const { cardNumber } = gStores.userStore.patChoose;

    let flag = false;

    if (isMedicalMode) {
      flag = await isMedicalSelf(props.value.cardNumber || cardNumber);
    }

    changeRefPayList(0);

    if ((costTypeCode === '2' || isDefaultMedical()) && flag) {
      if (flag) {
        changeRefPayList(1);
      }
    }

    if (pageConfig.value.confirmPayFg) {
      if (flag) {
        getPay();
      } else {
        regDialogConfirm.value.show();
      }
    } else {
      getPay();
    }
  };

  const toPay = async () => {
    const { patientId, patientName } = gStores.userStore.patChoose;
    // const totalCost = detailData.value.totalCost + '';
    const totalCost = getPayTotal.value;
    const source = gStores.globalStore.browser.source;
    const {
      childOrder,
      deptId,
      docId,
      hosName,
      deptName,
      docName,
      hosId,
      visitDate,
      costTypeCode,
      cardNumber,
      recipeNo,
    } = props.value;

    const args = {
      personalPayFee:
        ((!costTypeCode || costTypeCode === '1') && totalCost) || undefined,
      patientName: props.value.patientName,
      businessType: '1',
      patientId,
      source,
      totalCost,
      mergeOrder: childOrder,
      deptCode: deptId,
      hosName,
      deptName,
      docCode: docId,
      docName,
      hosId,
      visitDate,
      cardNumber,
      recipeNo,
      serialNo: selList.value
        .map((o) => o.serialNo)
        .filter((o) => o)
        .join(','),
    };

    const {
      result: { phsOrderNo },
    } = await api.createClinicOrder(args);

    const res = await payMoneyOnline({
      phsOrderNo,
      totalFee: totalCost,
      phsOrderSource: '2',
      hosId,
      hosName,
      patientName: props.value.patientName || patientName,
      cardNumber,
    });

    await toPayPull(res, '门诊缴费');
    payAfter();
  };

  const closeQrOpt = () => {
    barOpt.value.width = 0;
    qrOpt.value.size = 0;
  };

  const payAfter = async () => {
    const { clinicType, cardNumber } = props.value;
    uni.showLoading({});
    await wait(1000);
    uni.hideLoading();

    if (clinicType) {
      await executeConfigPayAfter(clinicType, cardNumber);
    }

    uni.reLaunch({
      url: joinQueryForUrl('/pagesA/clinicPay/clinicPayDetail', {
        tabIndex: '1',
        params: props.value.params,
      }),
    });
  };

  const cannelOrder = () => {
    isCannelShow.value = false;
  };

  const getData = async () => {
    await getDetailData(props.value);

    if (props.value.payState === '1' && detailData.value.costList) {
      selList.value = [...detailData.value.costList];
    }
  };

  const init = async () => {
    await getSysConfig();
    await getData();
    isComplete.value = true;
    await hookInit({
      payCancelAuth: () => {
        uni.reLaunch({
          url: joinQueryForUrl(`/pagesA/clinicPay/payDetail`, props.value),
        });
      },
    });
  };

  onShow(async () => {
    if (getLocalStorage('get-wx-medical-auth-code') === '1') {
      await wait(300);
      setLocalStorage({
        'get-wx-medical-auth-code': '',
      });

      // 微信医保小程序跳回来后中断了链路 重新走下
      if (gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode) {
        getPayInfo({
          item: {
            key: 'medicare',
            label: '',
          },
        });
      } else {
        gStores.messageStore.showMessage(
          '未完成电子医保凭证授权,无法继续医保结算'
        );
      }
    }
  });

  onLoad(async (opt) => {
    props.value = deQueryForUrl(deQueryForUrl(opt));
  });

  onMounted(async () => {
    await init();
    setTimeout(() => {
      if (props.value.payState === '0') {
        capture();
      }
    }, 200);
  });

  onReady(() => {
    if (props.value.payState === '0') {
      uni.setNavigationBarTitle({
        title: '已缴费明细',
      });
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

  .qr {
    .qrcode-img {
      width: 320rpx;
      height: 320rpx;
    }

    .barcode-img {
      height: 184rpx;
      width: 600rpx;
    }
  }

  .page-first-item {
    margin-top: 48rpx;
  }

  .qr-code-toggle {
    display: flex;
    align-items: center;

    .qr-toggle-icon {
      transition: all 0.4s;
      font-size: var(--hr-font-size-xl);
      display: inline-block;
      &.icon-reverse {
        transform-origin: center center;
        transform: rotate(0.5turn);
      }
    }
  }

  .g-footer {
    // background-color: red;
    .cancel-btn {
      flex: 1;
    }

    .confirm-btn {
      flex: 2;
    }
  }
</style>
