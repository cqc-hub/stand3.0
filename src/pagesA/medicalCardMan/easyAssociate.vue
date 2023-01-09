<template>
  <view class="">
    <!-- #ifdef MP-WEIXIN -->
    <health-card-users
      :hospitalId="$global.systemInfo.isOpenHealthCard!.hospitalId"
      @select="selectCard"
      @addCard="addCard"
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

  const selectCard = async ({ detail }) => {
    const { healthCode } = detail;

    const requestArg = {
      healthCode,
      hospitalId,
      herenId: globalStore.herenId,
      source: globalStore.browser.source,
    };

    getH5OpenidParam(requestArg);

    await api.quickLinkHealthCard(requestArg);

    gStores.messageStore.showMessage('关联成功', 1500, {
      closeCallBack() {
        //刷新就诊人列表
        new PatientUtils().getPatCardList();
        uni.reLaunch({
          url: '/pages/home/home',
        });
      },
    });
  };

  const addCard = () => {
    uni.reLaunch({
      url: joinQueryForUrl(globalGl.addPersonUrl, {
        pageType: gStores.globalStore.herenId ? 'addPatient' : 'perfectReal',
      }),
    });
  };
</script>

<style lang="scss" scoped></style>
