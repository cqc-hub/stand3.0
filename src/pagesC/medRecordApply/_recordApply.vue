<template>
  <view class="g-page">
    <view class="g-container">
      <block v-if="isComplete && list.length">
        <Record-Apply-List :list="list" />
      </block>

      <view class="empty-list" v-else-if="isComplete">
        <g-empty :current="1" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { GStores, ServerStaticData, IHosInfo } from '@/utils';
  import { defineComponent, ref } from 'vue';
  import { CaseCopyItem } from './utils/recordApply';

  import RecordApplyList from './components/recordApplyList.vue';

  import api from '@/service/api';
  import dayjs from 'dayjs';

  const gStores = new GStores();
  const list = ref<CaseCopyItem[]>([]);

  const isComplete = ref(false);

  const getListData = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const arg = {
      patientId,
    };

    isComplete.value = false;
    const { result } = await api
      .getCaseCopyList<CaseCopyItem[]>(arg)
      .finally(() => {
        isComplete.value = true;
      });

    if (result && result.length) {
      result.map((o) => {
        o._createTime = dayjs(o.createTime).format('YYYY-MM-DD');
      });
    }

    list.value = result || [];
  };

  const init = () => {
    getListData();
  };

  init();
</script>

<style lang="scss" scoped>
  .g-container {
    padding: 0 32rpx;
  }
</style>
