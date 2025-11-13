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
  import { GStores } from '@/utils';
  import api from '@/service/api';

  const gStores = new GStores();

  const getList = async () => {
    const { cardNumber } = gStores.userStore.clickPat;

    const { result } = await api.getRelPatientBindInfo({
      cardNumber,
    });
  };
  onLoad(async () => {
    getList();
  });
</script>

<style lang="scss" scoped></style>
