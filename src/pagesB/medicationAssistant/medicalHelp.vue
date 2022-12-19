<template>
  <view class="g-page">
    <g-flag isShowFg typeFg="48" />
    <g-choose-pat />

    <view class="g-container"></view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  import { GStores } from '@/utils';

  import api from '@/service/api';

  const gStores = new GStores();

  // 0-未取药 1-已取药
  const getListData = async (takenDrug: '0' | '1') => {
    const { patientId } = gStores.userStore.patChoose;
    const args = {
      takenDrug,
      patientId,
    };

    await api.getDrugDelivery(args);
  };

  const init = () => {
    getListData('0');
  };

  onMounted(() => {
    init();
  });
</script>

<style lang="scss" scoped></style>
