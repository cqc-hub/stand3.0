<template>
  <view class="">
    <view class="mb24">
      <uv-qrcode :value="code" :loading="loading" size="500rpx" />
    </view>
    <view @click="init" class="flex justify-center f28">
      <view class="pr12 mr12 g-split-line">
        {{ label }}
      </view>

      <view class="color-blue">刷新二维码</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import api from '@/service/api';
  import { GStores } from '@/utils';
  import { watch, ref } from 'vue';

  const gStores = new GStores();
  const code = ref('');
  const loading = ref(false);

  const init = async () => {
    loading.value = true;
    const { result } = await api
      .patDynamicCode({
        patientId: props.patientId,
        source: gStores.globalStore.browser.source,
      })
      .finally(() => {
        loading.value = false;
      });

    code.value = result.code;
  };

  const props = withDefaults(
    defineProps<{
      patientId: string;
      label?: string;
    }>(),
    {
      label: '就诊卡',
    }
  );

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

<style lang="scss" scoped></style>
