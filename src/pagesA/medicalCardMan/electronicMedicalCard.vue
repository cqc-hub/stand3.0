<template>
  <view class="page">
    <view class="card-content">
      <view class="card-header">{{ title }}</view>

      <view
        :class="{
          'card-health': clickPat.healthQrCodeText,
        }"
        class="card-body"
      >
        <view class="card-qrcode">
          <block v-if="!clickPat.healthQrCodeText">
            <w-barcode :options="barCodeOpt" />

            <view class="card-code">
              {{ showCodeLabel || barCodeOpt.code }}
            </view>
          </block>

          <w-qrcode :options="options" />
        </view>

        <g-form v-model:value="formData" ref="gform" />
      </view>
    </view>

    <view class="p32">
      <button @click="goDetail" class="btn btn-normal color-green">
        <text class="color-green">更多信息</text>
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { GStores } from '@/utils';
  import { patCardDetailList } from './utils';
  import { onReady } from '@dcloudio/uni-app';
  import { isAreaProgram } from '@/stores';
  // 卡包  https://open.tengmed.com/openAccess/ability/detail?sceneId=0&catalogId=20&serviceId=93&docContentKey=detail

  const gform = ref<any>('');
  const gStore = new GStores();
  const { clickPat } = storeToRefs(gStore.userStore);
  const title = ref('电子就诊卡');

  // https://meet-ui.com/#/
  const options = ref({
    // 二维码
    size: 350,

    // 条形码
    width: 600, // 宽度 单位rpx
    height: 184, // 高度 单位rpx
    code: isAreaProgram()
      ? clickPat.value.idCardEncry
      : clickPat.value.healthQrCodeText || clickPat.value._showId,
    img: clickPat.value.healthQrCodeText
      ? {
          src: '/static/image/person/health-card-logo.png',
          size: 80,
          type: 'round',
        }
      : undefined,
  });

  const barCodeOpt = ref({ ...options.value });

  const formData = ref({
    ...clickPat.value,
  });
  const showCodeLabel = ref('');
  if (isAreaProgram()) {
    showCodeLabel.value = clickPat.value.idCard;
  }

  const goDetail = () => {
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/medicalCardDetail',
    });
  };

  onReady(() => {
    if (clickPat.value.healthQrCodeText) {
      title.value = '电子健康卡';
      barCodeOpt.value.code = clickPat.value._showId;
      options.value.code = clickPat.value.healthQrCodeText;
      uni.setNavigationBarTitle({
        title: title.value,
      });
    }
  });

  onMounted(() => {
    console.log(options.value);

    gform.value.setList(patCardDetailList);
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
        padding-bottom: 120rpx;
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
  }

  .btns {
    padding: 32rpx;
  }
</style>
