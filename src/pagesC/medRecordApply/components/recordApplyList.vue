<template>
  <view class="">
    <view></view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { CaseCopyItem } from '../utils/recordApply';

  const props = defineProps<{
    list: CaseCopyItem[];
  }>();
</script>

<style lang="scss" scoped></style>
