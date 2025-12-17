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
    apiAsync,
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

    const { confirm } = await apiAsync(uni.showModal, {
      content: '解绑后该账号将无法为您进行预约挂号等操作，是否立即解绑?',
    });

    if (!confirm) {
      return Promise.reject('取消解绑');
    }

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

    await api.deletePatByHerenId({
      otherHerenId,
      patientId,
      source: gStores.globalStore.browser.source,
      type: '1',
    });

    if (otherHerenId === gStores.globalStore.herenId) {
      if (patientId === gStores.userStore.patChoose.patientId) {
        gStores.userStore.deletePat(patientId);
      }
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
