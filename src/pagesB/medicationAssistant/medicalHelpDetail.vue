<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="f32 g-page"
  >
    <view class="g-container">
      <block v-if="pageProps.takenDrug === '1'">
        <view
          :class="{
            'head-dark': ['4', '50'].includes(pageProps.takenDrugType),
          }"
          class="head-bg head-blue"
        />

        <view class="flex-between head-body">
          <view>
            <view class="safe-height"></view>
            <view class="safe-height"></view>

            <view v-if="isMedicalFriedAndDelivery && getExpressAppId">
              <text @click="goExpressApp" class="a-link f48">查看快递</text>
            </view>
            <view
              v-else-if="takenDrugTypeMap[pageProps.takenDrugType]"
              class="g-bold f48"
            >
              {{ takenDrugTypeMap[pageProps.takenDrugType] }}
            </view>
            <view
              v-if="detailData.takeLocation && pageProps.takenDrugType !== '2'"
              class="f28"
            >
              <text class="mr12">取药地址:</text>
              <text>{{ detailData.takeLocation }}</text>
            </view>
            <view style="height: 12rpx"></view>
          </view>

          <view class="reg-header-icon-container">
            <view
              v-if="['0', '1', '2', '20'].includes(pageProps.takenDrugType)"
              class="iconfont reg-header-icon-bg"
            >
              &#xe6c6;
            </view>
            <view v-else class="iconfont reg-header-icon-bg">&#xe6d0;</view>
          </view>
        </view>
      </block>
      <view v-else style="width: 1px; height: 24rpx"></view>

      <view class="content">
        <view
          v-if="
            ['20', '50'].includes(pageProps.takenDrugType) &&
            // 中药 待煎外配直接小程序查看 不显示
            !isMedicalFriedAndDelivery
          "
          class="box g-border p32 mb32"
        >
          <Express-Step
            :pointEnd="_expressInfo.pointEnd"
            :pointNow="_expressInfo.pointNow"
            :expressNo="detailData.expressNo"
            :expressCompany="detailData.expressCompany"
            @go-detail="goDetailExpress"
          />
        </view>

        <view
          v-if="detailData.qrCode && pageProps.takenDrugType === '1'"
          class="g-border box page-first-item mb16 p32"
        >
          <view class="my-display-none">
            <w-qrcode :options="_qrOpt" ref="refqrcode" />
            <w-barcode :options="_barOpt" ref="refqrbarcode" />
          </view>

          <view class="g-flex-rc-cc g-bold f32 mb32">
            请凭二维码前往药房取药
          </view>

          <view class="qr g-flex-rc-cc">
            <image v-if="showQrCode" :src="qrOpt._qrImg" class="qrcode-img" />
            <image
              v-if="!showQrCode"
              :src="qrOpt._barImg"
              class="barcode-img"
            />
          </view>

          <view class="g-flex-rc-cc mt16 color-888 f28">{{ qrCode }}</view>

          <view
            @click="showQrCode = !showQrCode"
            class="qr-code-toggle g-flex-rc-cc color-blue f28"
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
        <Htlp-Head-Box
          :item="pageProps"
          :detailData="detailData"
          :systemModeOld="gStores.globalStore.modeOld"
        />
        <Htlp-Body-Box :item="pageProps" :detailData="detailData" />
      </view>

      <view class="safe-height" />
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad, onReady } from '@dcloudio/uni-app';

  import {
    isToBeFriedAndDelivery,
    type IWaitListItem,
    type IItemDetail,
  } from './utils/medicalHelp';
  import { deQueryForUrl } from '@/common';
  import {
    GStores,
    type TButtonConfig,
    useTBanner,
    wait,
    ISystemConfig,
    ServerStaticData,
  } from '@/utils';

  import api from '@/service/api';
  import dayjs from 'dayjs';

  import HtlpHeadBox from './components/HtlpHeadBox.vue';
  import HtlpBodyBox from './components/HtlpBodyBox.vue';
  import ExpressStep from './components/ExpressStep.vue';

  const pageProps = ref(<IWaitListItem>{});
  const pageConfig = ref<ISystemConfig['drugDelivery']>({});
  const gStores = new GStores();
  const detailData = ref({} as IItemDetail);
  const takenDrugTypeMap = {
    // 0: '窗口待取药',
    1: '窗口待取药',
    2: '快递待发货',
    4: '窗口已取药',
    20: '快递已发货',
    50: '快递已签收',
  };

  const refqrcode = ref('' as any);
  const refqrbarcode = ref('' as any);
  const showQrCode = ref(true);

  const getExpressAppId = computed(() => {
    // #ifdef MP-ALIPAY
    return pageConfig.value.deliveryFired?.alipay;
    // #endif

    // #ifdef  MP-WEIXIN
    return pageConfig.value.deliveryFired?.wx;
    // #endif

    return '';
  });

  // 选了取药方式的中药代煎外配?
  const isMedicalFriedAndDelivery = computed(() => {
    return (
      isToBeFriedAndDelivery(pageProps.value) &&
      pageProps.value.takenDrugType !== '0'
    );
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

  const qrCode = computed(() => {
    return detailData.value.qrCode || '';
  });

  const _qrOpt = computed(() => ({
    ...qrOpt.value,
    code: qrCode.value,
  }));

  const _barOpt = computed(() => ({
    ...barOpt.value,
    code: qrCode.value,
  }));

  const closeQrOpt = () => {
    barOpt.value.width = 0;
    qrOpt.value.size = 0;
  };

  const capture = async () => {
    await wait(300);
    const { tempFilePath: qrCodeImg } = await refqrcode.value.GetCodeImg();
    const { tempFilePath: barcodeImg } = await refqrbarcode.value.GetCodeImg();

    qrOpt.value._barImg = barcodeImg;
    qrOpt.value._qrImg = qrCodeImg;

    closeQrOpt();
  };

  const getData = async () => {
    const { cardNumber, patientId } = gStores.userStore.patChoose;
    const { hosId, prescId } = pageProps.value;

    const { result } = await api.getDrugDeliveryDetail({
      cardNumber,
      patientId,
      hosId,
      prescId,
    });

    const { expressParam, expressStatus, acceptTime } = result;

    if (expressParam) {
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

    detailData.value = result;

    if (detailData.value.qrCode) {
      capture();
    }
  };

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

  const _expressInfo = computed(() => {
    return {
      pointNow: expressInfo.value?.pointNow,
      pointEnd: {
        title: detailData.value.addresseeAddress,
        desc: `${detailData.value.addresseeName} ${detailData.value.addresseePhone}`,
      },
    };
  });

  const goDetailExpress = () => {
    const { expressNo, expressCompany } = detailData.value;
    const args: TButtonConfig = {
      type: 'h5',
      path: 'pagesC/myExpress/expressDetail',
      text: '',
      isSelfH5: '1',
      extraData: {
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

  const goExpressApp = () => {
    uni.navigateToMiniProgram({
      appId: getExpressAppId.value!,
    });
  };

  const init = () => {
    getData();
  };

  onReady(() => {
    if (pageProps.value.visitType === '2') {
      uni.setNavigationBarTitle({
        title: '处方明细',
      });
    }
  });

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    pageConfig.value = await ServerStaticData.getSystemConfig('drugDelivery');

    init();
  });
</script>

<style lang="scss" scoped>
  .g-page {
    .g-container {
      padding: 0 32rpx;

      .head-body {
        position: relative;
        z-index: 2;
        color: #fff;
        align-items: flex-start;

        .reg-header-icon-container {
          height: 140rpx;
        }

        .reg-header-icon-bg {
          // opacity: 0;
          font-size: 200rpx;
          right: 0;
          top: 24rpx;

          mask: linear-gradient(180deg, #ffffff35, rgba(255, 255, 255, 0));
        }
      }

      .head-bg {
        position: absolute;
        left: 0;
        right: 0;
        z-index: 1;
        pointer-events: none;

        &::after {
          content: '';
          display: block;
          height: 400rpx;

          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }

        &.head-blue {
          &::after {
            background: linear-gradient(
              0deg,
              rgba(41, 111, 255, 0) 1%,
              #296fff 38%,
              #296fff 96%
            );
          }
        }

        &.head-dark {
          &::after {
            background: linear-gradient(
              0deg,
              rgba(106, 125, 165, 0) 1%,
              #6a7da5 38%,
              #6a7da5 96%
            );
          }
        }
      }

      .content {
        position: relative;
        z-index: 2;
      }
    }
  }

  .box {
    background: #fff;
    border-radius: 8px;
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

  .page-first-item {
    margin-top: 48rpx;
  }

  .a-link {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      height: 4rpx;
      background-color: #fff;
    }
  }
</style>
