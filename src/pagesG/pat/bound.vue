<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <g-flag isShowFg typeFg="1280" />
    <view class="g-container">
      <view v-if="isComplete" class="pr32 pl32 safe-height">
        <bound-list
          v-if="list.length"
          :list="list"
          @remove-binding="removeBinding"
        />
        <view v-else class="pt70 mt70">
          <g-empty :current="1" noTransformY />
        </view>
      </view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import {
    GStores,
    ISystemConfig,
    PatientUtils,
    ServerStaticData,
  } from '@/utils';
  import { TBoundItem } from './utils/bound';

  import api from '@/service/api';
  import boundList from './components/boundList.vue';

  const gStores = new GStores();
  const list = ref<TBoundItem[]>([]);
  const isComplete = ref(false);
  const pageConfig = ref(<ISystemConfig['person']>{});
  const patientUtils = new PatientUtils();

  const removeBinding = async (item: TBoundItem) => {
    const { isRemoveBindingByFaceVerify } = pageConfig.value;
    const { patientName } = gStores.userStore.clickPat;
    const { herenId: otherHerenId, patientId } = item;

    if (isRemoveBindingByFaceVerify === '1') {
      const { idCard } = await patientUtils.getPatientPersonalInfo({
        idCard: true,
        pat: gStores.userStore.clickPat,
      });

      await patientUtils.faceVerify({
        idCardNumber: idCard,
        name: patientName,
      });
    }

    await patientUtils.deletePat({
      otherHerenId,
      patientId,
    });

    if (otherHerenId === gStores.globalStore.herenId) {
      await patientUtils.getPatCardList();
    }

    list.value = [];
    getList();
  };

  const getList = async () => {
    const { cardNumber } = gStores.userStore.clickPat;
    isComplete.value = false;
    const { result = [] } = await api
      .getRelPatientBindInfo({
        cardNumber,
      })
      .finally(() => {
        isComplete.value = true;
      });

    result.sort((c, p) => {
      if (c.currentType === '1') {
        return -1;
      }

      // @ts-expect-error
      return new Date(p.createTime) * 1 - new Date(c.createTime);
    });
    list.value = result;
  };

  onLoad(async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('person');

    getList();
  });
</script>

<style lang="scss" scoped></style>
