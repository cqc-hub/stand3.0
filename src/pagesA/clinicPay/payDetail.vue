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
              <image v-if="!showQrCode" :src="qrOpt._barImg" mode="widthFix" />
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
      </view>
    </view>

    <view class="g-footer">233</view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad, onReady } from '@dcloudio/uni-app';

  import {
    usePayPage,
    usePayDetailPage,
    type TPayDetailProp,
  } from './utils/clinicPayDetail';
  import { deQueryForUrl } from '@/common';
  import { previewImage } from '@/utils';

  import PayDetailCostList from './components/payDetailCostList.vue';
  import PayDetailHeadBoxDetail from './components/payDetailHeadBoxDetail.vue';

  const props = ref({} as TPayDetailProp);
  const refqrcode = ref('' as any);
  const refqrbarcode = ref('' as any);

  const { getDetailData, detailData } = usePayDetailPage();
  const { pageConfig, getSysConfig, gStores } = usePayPage();

  const qrCode = ref('66443456899900');
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

  const capture = async () => {
    const { tempFilePath: qrCodeImg } = await refqrcode.value.GetCodeImg();
    const { tempFilePath: barcodeImg } = await refqrbarcode.value.GetCodeImg();

    qrOpt.value._barImg = barcodeImg;
    qrOpt.value._qrImg = qrCodeImg;

    barOpt.value.width = 0;
    qrOpt.value.size = 0;

    // previewImage([qrCodeImg, barcodeImg]);
  };

  onLoad(async (opt) => {
    props.value = deQueryForUrl(opt);
    await getSysConfig();
    await getDetailData(props.value);

    setTimeout(() => {
      if (props.value.payState === '0') {
        capture();
      }
    }, 120);
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
</style>
