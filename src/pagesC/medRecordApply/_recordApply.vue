<template>
  <view class="g-page">
    <view class="g-container">
      <Record-Apply-List :list="list" />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { GStores, ServerStaticData, IHosInfo } from '@/utils';
  import { defineComponent, ref } from 'vue';
  import { CaseCopyItem } from './utils/recordApply';

  import RecordApplyList from './components/recordApplyList.vue';

  import api from '@/service/api';

  const gStores = new GStores();
  const list = ref<CaseCopyItem[]>([]);

  const isComplete = ref(false);

  const getListData = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const arg = {
      patientId,
    };

    isComplete.value = false;
    const { result } = await api.getCaseCopyList(arg).finally(() => {
      isComplete.value = true;
    });

    list.value = result;
  };

  const init = () => {
    getListData();
  };

  init();
</script>

<style lang="scss" scoped></style>
