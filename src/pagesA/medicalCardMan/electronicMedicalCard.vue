<template>
  <view
    :class="{
      'system-mode-old': gStore.globalStore.modeOld,
    }"
    class="page"
  >
    <view class="card-content">
      <view class="card-header flex-between">
        <view>{{ title }}</view>

        <view
          v-if="isHasHealthCode"
          @click="toggleQrCode"
          class="flex-normal g-border toggle-card color-blue f26"
        >
          <text
            :class="{
              'icon-reverse': showHealthCode,
            }"
            class="iconfont qr-toggle-icon color-blue"
          >
            &#xe6f9;
          </text>

          <view class="f26">
            切换{{ showHealthCode ? '电子就诊卡' : '电子健康卡' }}
          </view>
        </view>
      </view>

      <view
        :class="{
          'card-health': showHealthCode,
        }"
        class="card-body"
      >
        <view class="card-qrcode">
          <block v-if="!showHealthCode">
            <view class="bar-code"><w-barcode :options="barCodeOpt" /></view>
          </block>

          <w-qrcode :options="qrOptions" />
        </view>

        <view class="info-content">
          <view class="g-flex-rc-cc info-name mb12">
            <view class="f32">
              {{
                isNameEncry ? clickPat.patientNameEncry : clickPat.patientName
              }}
            </view>

            <text @click="eyesClick" class="iconfont eyes-icon color-888">
              {{ isNameEncry ? '&#xe6d4;' : ' &#xe6db;' }}
            </text>
          </view>

          <view class="g-flex-rc-cc color-888 f28 mb12">
            {{ clickPat._showId }}
          </view>

          <view class="g-flex-rc-cc mt32">
            <text @click="goDetail" class="color-blue f28">更多信息</text>
          </view>
        </view>
        <!-- #ifdef  MP-WEIXIN -->
        <view
          v-if="showHealthCode"
          @click="goHealCardPackage"
          class="color-blue g-bold g-flex-rc-cc p24 g-border-top"
        >
          添加到卡包
        </view>
        <!-- #endif -->
      </view>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { onReady } from '@dcloudio/uni-app';

  import { isAreaProgram } from '@/stores';
  import { GStores, wait } from '@/utils';

  import { setLocalStorage, getLocalStorage } from '@/common';

  import api from '@/service/api';

  const gStore = new GStores();
  const { clickPat } = storeToRefs(gStore.userStore);
  const title = ref('电子就诊卡');
  const showHealthCode = ref(false);

  // https://meet-ui.com/#/
  const options = ref<any>({
    // 二维码
    size: 350,

    // 条形码
    width: 600, // 宽度 单位rpx
    height: 184, // 高度 单位rpx
    code: isAreaProgram()
      ? clickPat.value.idCardEncry
      : clickPat.value.healthQrCodeText || clickPat.value._showId,
    img: '',
  });

  const qrOptions = computed(() => {
    return {
      ...options.value,
      width: undefined,
      height: undefined,
    };
  });

  const barCodeOpt = ref({ ...options.value });

  const formData = ref({
    ...clickPat.value,
    _name: '',
  });
  const isNameEncry = ref(true);
  const eyesClick = () => {
    isNameEncry.value = !isNameEncry.value;
    changeShowName();
  };
  const isHasHealthCode = computed(() => {
    return !!clickPat.value.healthQrCodeText;
  });

  const changeShowName = () => {
    if (isNameEncry.value) {
      formData.value._name = formData.value.patientNameEncry;
    } else {
      formData.value._name = formData.value.patientName;
    }
  };

  const showCodeLabel = ref('');
  if (isAreaProgram()) {
    showCodeLabel.value = clickPat.value.idCard;
  }

  const goDetail = () => {
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/medicalCardDetail',
    });
  };

  const toggleQrCode = async () => {
    showHealthCode.value = !showHealthCode.value;
    setLocalStorage({
      showHealthCodeHis: showHealthCode.value,
    });
    setStatus();
    uni.showLoading({
      mask: true,
      title: '切换中',
    });

    await wait(700);

    uni.hideLoading();
  };

  const setStatus = async () => {
    if (showHealthCode.value) {
      title.value = '电子健康卡';
      options.value.img = {
        src: '/static/image/person/health-card-logo.png',
        size: 80,
        type: 'round',
      };

      options.value.code = clickPat.value.healthQrCodeText!;
    } else {
      title.value = '电子就诊卡';
      options.value.img = undefined;
      options.value.code = clickPat.value._showId!;
      barCodeOpt.value.code = clickPat.value._showId!;
    }

    uni.setNavigationBarTitle({
      title: title.value,
    });
  };

  // https://open.tengmed.com/openAccess/ability/detail?sceneId=0&catalogId=20&serviceId=93&docContentKey=detail
  const goHealCardPackage = async () => {
    const { patientId } = clickPat.value;
    const {
      browser: { source },
    } = gStore.globalStore;

    const arg = {
      patientId,
      source,
    };

    const { result } = await api.getCardPackOrderId(arg);

    const orderId = result?.orderId;

    if (orderId) {
      const url = `https://03-h5-health.tengmed.com/api/open/takeMsCard?order_id=${orderId}&redirect_uri=back`;

      uni.navigateTo({
        url: '/pagesA/webView/webView?https=' + encodeURIComponent(url),
      });
    } else {
      gStore.messageStore.showMessage('获取订单失败', 3000);
    }
  };

  onReady(() => {
    const showHealthCodeHis = getLocalStorage('showHealthCodeHis');
    if (clickPat.value.healthQrCodeText) {
      if (showHealthCodeHis === '') {
        showHealthCode.value = !!clickPat.value.healthQrCodeText;
      } else {
        showHealthCode.value = showHealthCodeHis;
      }
    } else {
      showHealthCode.value = false;
    }

    setStatus();
  });

  onMounted(() => {
    changeShowName();
  });
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100vh;
    background-color: var(--hr-brand-color-6);
  }

  .card-content {
    padding: 32rpx;
    position: relative;
    z-index: 1;
    .card-header {
      background: linear-gradient(180deg, #53a8ff, var(--hr-brand-color-6));
      border: 1px solid #548cff;
      border-radius: 16rpx 16rpx 0 0;
      font-weight: 600;
      color: var(--h-color-white);
      padding: 32rpx;
      font-size: var(--hr-font-size-xl);
    }

    .card-body {
      background-color: var(--hr-neutral-color-1);
      border-radius: 0 0 16rpx 16rpx;
      background-color: #fff;

      .card-qrcode {
        padding-top: 40rpx;
        padding-bottom: 40rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .card-code {
          color: var(--hr-neutral-color-7);
          font-size: var(--hr-font-size-xs);
          padding-top: 16rpx;
          padding-bottom: 40rpx;
        }
      }
    }

    .card-health {
      padding-top: 80rpx;
    }

    .bar-code {
      margin-bottom: 40rpx;
    }
  }

  .btns {
    padding: 32rpx;
  }

  .toggle-card {
    font-weight: normal;
    background-color: #fff;
    border-radius: 666rpx;
    padding: 8rpx 24rpx;

    .qr-toggle-icon {
      transition: all 0.4s;
      color: var(--hr-neutral-color-9);
      font-size: var(--hr-font-size-xl);
      margin-right: 8rpx;
      display: inline-block;
      &.icon-reverse {
        transform-origin: center center;
        transform: rotate(0.5turn);
      }
    }
  }

  .info-content {
    padding-bottom: 72rpx;
    .info-name {
      position: relative;

      .eyes-icon {
        font-size: var(--hr-font-size-xxl);
        margin-left: 30rpx;
        position: absolute;
        transform: translateX(88rpx);
      }
    }
  }

  .system-mode-old {
    .f26 {
      font-size: var(--hr-font-size-xl) !important;
    }
  }
</style>
