<template>
  <view class="">233</view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      show: boolean;
      title?: string;
      option: any[];
      value: any;
      field?: {
        label: string;
        value: string;
      };
    }>(),
    {
      title: '',
      field: () => ({
        label: 'label',
        value: 'value'
      })
    }
  );
</script>

<style lang="scss" scoped></style>
