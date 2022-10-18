<template>
  <view class="">233</view>
</template>

<script lang="ts" setup>
  import { GStores, ServerStaticData, IHosInfo } from '@/utils';
  import { defineComponent, ref } from 'vue';
  import api from '@/service/api';

  const gStores = new GStores();

  const getListData = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const arg = {
      patientId,
    };

    api.getCaseCopyList(arg);
  };

  const init = () => {
    getListData();
  };

  init();
</script>

<style lang="scss" scoped></style>
