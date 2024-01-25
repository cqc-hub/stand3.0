<template>
  <view class="">233</view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { isLev1, IDeptLv1, IDeptLv2, IDeptLv3 } from '@/stores';

  const props = withDefaults(
    defineProps<{
      list: IDeptLv1[];
    }>(),
    {}
  );
</script>

<style lang="scss" scoped></style>
