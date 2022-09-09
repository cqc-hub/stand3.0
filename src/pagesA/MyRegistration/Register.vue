<template>
  <view class="">233</view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, onMounted } from 'vue';
  import { ServerStaticData, IHosInfo } from '@/utils';

  import api from '@/service/api';

  const props = defineProps<{
    _url: string;
  }>();

  const hosList = ref<IHosInfo[]>([]);

  const init = async () => {
    hosList.value = await ServerStaticData.getHosList();
  };

  init();
</script>

<style lang="scss" scoped></style>
