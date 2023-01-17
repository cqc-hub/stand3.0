<template>
  <view class="g-page">233</view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { GStores } from '@/utils';

  import api from '@/service/api';

  const gStores = new GStores();

  const getList = async () => {
    const { patientId } = gStores.userStore.patChoose;

    api.getCheckInList({
      latitude: '123.456',
      longitude: '123.456',
      patientId,
    });
  };



  const init = async () => {
    getList();
  };

  onLoad(() => {
    init();
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: #fff;
  }
</style>
