<template>
  <view class="g-page">
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
              请凭二维码到药房窗口取药
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
          />
        </view>

        <view class="box info-box mt16">
          <view class="flex-between g-bold f36">
            <view>费用总额</view>
            <view v-if="props.payState === '1'" class="color-error">
              {{ detailData.totalCost }}元
            </view>
          </view>

          <block v-if="detailData.costList && detailData.costList.length">
            <view class="mt8">
              <Pay-Detail-Cost-List :list="detailData.costList" />
            </view>
          </block>
        </view>

        <view class="mt24">
          <g-flag :typeFg="props.payState === '0' ? '38' : '0'" isShowFgTip aaa />
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
      <!-- <g-flag typeFg="32" isShowFgTip /> -->
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
        v-model:title="confirmFgTitle"
        :typeFg="pageConfig.confirmPayFg!"
        isShowFgTip
        isHideTitle
      />
    </Order-Reg-Confirm>

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

          <button @click="handlerPay" class="btn btn-warning confirm-btn">
            {{ detailData.totalCost + `元 立即支付` }}
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
  import { onLoad, onReady } from '@dcloudio/uni-app';

  import {
    usePayPage,
    usePayDetailPage,
    type TPayDetailProp,
  } from './utils/clinicPayDetail';
  import {
    type IGPay,
    payMoneyOnline,
    toPayPull,
  } from '@/components/g-pay/index';
  import { deQueryForUrl } from '@/common';
  import { wait } from '@/utils';

  import api from '@/service/api';

  import PayDetailCostList from './components/payDetailCostList.vue';
  import PayDetailHeadBoxDetail from './components/payDetailHeadBoxDetail.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';

  const props = ref({} as TPayDetailProp);
  const refqrcode = ref('' as any);
  const refqrbarcode = ref('' as any);
  const isComplete = ref(false);

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

  const showQrCode = ref(false);
  const isCannelShow = ref(false);

  const capture = async () => {
    const { tempFilePath: qrCodeImg } = await refqrcode.value.GetCodeImg();
    const { tempFilePath: barcodeImg } = await refqrbarcode.value.GetCodeImg();

    qrOpt.value._barImg = barcodeImg;
    qrOpt.value._qrImg = qrCodeImg;

    closeQrOpt();
  };

  const getPayInfo = async ({ item }: { item: IGPay }) => {
    if (item.key === 'online') {
      // 预结算
      if (pageConfig.value.isPreSettle === '1') {
        console.log('预结算');
      } else {
        toPay();
      }
    }
  };

  const handlerPay = () => {
    if (pageConfig.value.confirmPayFg) {
      regDialogConfirm.value.show();
    } else {
      getPay();
    }
  };

  const toPay = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const totalCost = detailData.value.totalCost + '';
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
    } = props.value;

    const args = {
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
    });

    await toPayPull(res);
    payAfter();
  };

  const closeQrOpt = () => {
    barOpt.value.width = 0;
    qrOpt.value.size = 0;
  };

  const payAfter = async () => {
    uni.showLoading({});
    await wait(1000);
    uni.hideLoading();

    uni.reLaunch({
      url: '/pagesA/clinicPay/clinicPayDetail?tabIndex=1',
    });
  };

  const cannelOrder = () => {
    isCannelShow.value = false;
  };

  onLoad(async (opt) => {
    props.value = deQueryForUrl(opt);
  });

  onMounted(async () => {
    await getSysConfig();
    await getDetailData(props.value);
    isComplete.value = true;

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
