<template>
  <div v-if="isShowHealthCardMode">
    <health-card-query-comp
      :scene="props.scene"
      :openId="openId"
      :hospitalId="hospitalId"
      :healthCardId="healthCardId"
      pos="top"
      channel="0402"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { getOpenId } from '@/components/g-pay/index';
  import { GStores } from '@/utils';
  import globalGl from '@/config/global';
  const gStores = new GStores();
  const isShowHealthCardMode = ref(false);
  const hospitalId = ref('');
  const openId = ref('');
  const healthCardId = ref();

  const props = defineProps<{
    scene: '0101081' | '0101082';
  }>();

  onMounted(async () => {
    if (globalGl.systemInfo.isOpenHealthCard?.isCardQueryComp) {
      isShowHealthCardMode.value = true;
      openId.value = await getOpenId();
      hospitalId.value = globalGl.systemInfo.isOpenHealthCard!.hospitalId;
      healthCardId.value = gStores.userStore.patChoose.healthQrCodeText;
    }
  });
</script>
