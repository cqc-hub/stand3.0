<template>
  <view class="">
    <g-form @row-click="itemClick" :value="{}" ref="gform" />
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, nextTick } from 'vue';
  import type { TInstance } from '@/components/g-form/index';
  import { ISecondItemService } from '../utils';

  const props = defineProps<{
    list: (string | ISecondItemService)[];
    rowStyle: string;
  }>();

  const emits = defineEmits(['item-click']);

  let formList: TInstance[] = [];
  const gform = ref<any>();

  watch(
    () => props.list,
    (v) => {
      init();
    }
  );

  const init = () => {
    formList = props.list.map((o, i) => {
      const label = typeof o === 'string' ? o : o.title;
      return {
        target: o,
        label,
        key: 'k' + i,
        field: 'input-text',
        showSuffixArrowIcon: true,
        isForShow: true,
        labelWidth: '90%',

        rowStyle: props.rowStyle,
      };
    });

    nextTick(() => {
      if (gform.value) {
        gform.value.setList(formList);
      } else {
        setTimeout(gform.value.setList(formList), 500);
      }
    });
  };

  const itemClick = ({ item }) => {
    emits('item-click', { item });
  };
</script>

<style lang="scss" scoped></style>
