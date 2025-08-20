<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <view v-if="isComplete && list.length" class="pr24 pl24">
      <view class="safe-height"></view>
      <docList :list="list" @item-click="docCLick" />
    </view>

    <view v-else-if="isComplete" class="empty-list">
      <g-empty :current="1" />
    </view>
    <g-massage />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { GStores } from '@/utils';
  import { joinQueryForUrl } from '@/common';

  import api from '@/service/api';

  import docList from './components/docList.vue';

  const gStores = new GStores();
  const list = ref([] as any[]);
  const isComplete = ref(true);

  const getList = async () => {
    isComplete.value = false;
    list.value = [];
    const { result = [] } = await api.getPopularDoctors({}).finally(() => {
      isComplete.value = true;
    });
    list.value = result;
  };

  const docCLick = (item) => {
    const { hosDocId, hosId, hosDeptId } = item;
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/DoctorDetails', {
        hosDocId,
        // hosId,
        hosDeptId,
      }),
    });
  };

  onLoad(async () => {
    getList();
  });
</script>

<style lang="scss" scoped></style>
