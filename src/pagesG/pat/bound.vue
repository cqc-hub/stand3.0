<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    hahha
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { GStores, PatientUtils } from '@/utils';
  import api from '@/service/api';

  const gStores = new GStores();
  const patientUtils = new PatientUtils();

  const getList = async () => {
    const { cardNumber } = gStores.userStore.clickPat;
    const { idCard } = await patientUtils.getPatientPersonalInfo({
      idCard: true,
      pat: gStores.userStore.clickPat,
    });

    api.getRelPatientBindInfo({
      cardNumber,
      // idCard,
    });
  };
  onLoad(async () => {
    getList();
  });
</script>

<style lang="scss" scoped></style>
