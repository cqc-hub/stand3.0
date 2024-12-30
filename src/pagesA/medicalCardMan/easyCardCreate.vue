<template>
  <view class="">
    <!-- #ifdef MP-WEIXIN -->
    <health-card-create-card
      :hospitalId="globalGl.systemInfo.isOpenHealthCard?.hospitalId"
      @finish="handleCardFinish"
    />

    <!-- #endif -->
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { GStores, getH5OpenidParam, PatientUtils } from '@/utils';
  import { joinQueryForUrl } from '@/common';
  import globalGl from '@/config/global';
  import api from '@/service/api';

  const hospitalId = globalGl.systemInfo.isOpenHealthCard!.hospitalId;
  const gStores = new GStores();
  const globalStore = gStores.globalStore;



  const handleCardFinish = async ({ detail }) => {
    const { healthCode } = detail;

    const requestArg = {
      healthCode,
      hospitalId,
      herenId: globalStore.herenId,
      source: globalStore.browser.source,
    };

    getH5OpenidParam(requestArg);

    await api.quickLinkHealthCard(requestArg);

    gStores.messageStore.showMessage('创建成功', 1500, {
      closeCallBack() {
        //刷新就诊人列表
        new PatientUtils().getPatCardList();
        uni.reLaunch({
          url: '/pages/home/home',
        });
      },
    });
  };


</script>

<style lang="scss" scoped></style>
