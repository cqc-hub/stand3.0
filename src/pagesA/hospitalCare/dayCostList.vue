<template>
  <view class="g-page">
    <dailyExpenseList :isHosDaylist="pageConfig.isHosDaylist" ref="detailRef" />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref, provide } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';
  import { GStores, ServerStaticData, ISystemConfig } from '@/utils';

  import dailyExpenseList from './components/dailyExpenseList.vue';

  const pageProp = ref(
    <
      {
        start?: string; // yyyy-mm-dd
        end?: string;
      }
    >{}
  );
  const pageConfig = ref(<ISystemConfig['hospitalCare']>{});
  const detailRef = ref(<any>'');

  provide('pageProp', () => pageProp.value);

  onLoad((opt) => {
    pageProp.value = deQueryForUrl(deQueryForUrl(opt));
  });

  onMounted(async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('hospitalCare');

    detailRef.value.init();
  });
</script>

<style lang="scss" scoped></style>
