<template>
  <view class="">
    <view class="my-display-none">
      <uv-qrcode
        v-if="code"
        :value="code"
        @complete="qrComplete"
        ref="refQrCode1"
        size="380rpx"
      />
    </view>
    <view class="mb24 flex flex-col items-center justify-center">
      <!-- <w-barcode ref="refBar" :options="barOpt" /> -->
      <img :src="qrImg" mode="widthFix" class="qrcode-img pb32" />

      <!-- <uv-qrcode :value="code" :loading="loading" size="380rpx" auto start /> -->
    </view>
    <view class="flex justify-center f28">
      <view class="pr12 mr12 g-split-line">
        {{ label }}
      </view>

      <view @click="init" class="color-blue z-1 relative">刷新二维码</view>
    </view>

    <view v-if="isShowCode" class="flex justify-center f28 color-888">
      {{ showCode || patientId }}
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { getLocalStorage } from '@/common';
  import api from '@/service/api';
  import { GStores } from '@/utils';
  import { watch, ref, computed } from 'vue';

  const props = withDefaults(
    defineProps<{
      patientId?: string;
      // 加密数据, 门诊缴费的
      cardData?: string;
      label?: string;
      showCode?: string;
      isShowCode?: boolean;
    }>(),
    {
      label: '就诊码',
    }
  );
  const gStores = new GStores();
  const code = ref('');
  const loading = ref(false);
  const refBar = ref('' as any);

  const barOpt = computed(() => {
    return {
      code: code.value,
      width: 1320,
      height: 200,
      orient: 'vertical',
    };
  });

  const refQrCode1 = ref('' as any);
  const qrImg = ref('');
  const qrComplete = (e) => {
    const { success } = e;
    if (success) {
      refQrCode1.value.toTempFilePath({
        success({ tempFilePath }) {
          qrImg.value = tempFilePath;
        },
      });
    }
  };

  const init = async () => {
    if (loading.value) {
      return;
    }
    loading.value = true;
    const { result } = await api
      .patDynamicCode({
        patientId: !props.cardData && props.patientId || undefined,
        cardData: props.cardData,
        source: gStores.globalStore.browser.source,
      })
      .finally(() => {
        loading.value = false;
      });

    code.value = result.code;

    // refBar.value.SpecialTreatment(barOpt.value);
    // await wait(10);
    // refBar.value.generateCode(barOpt.value);
  };

  watch(
    () => props.patientId,
    () => {
      init();
    },
    {
      immediate: true,
    }
  );

  defineExpose({
    init,
  });
</script>

<style lang="scss" scoped>
  .qrcode-img {
    width: 320rpx;
  }
</style>
