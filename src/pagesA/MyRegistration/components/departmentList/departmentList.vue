<template>
  <view class="">
    <view v-for="item in list" :key="item.firstHosDeptId">
      {{ item.firstDeptName }}
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import { IDeptLv1 } from '../../utils';

  const props = defineProps<{
    list: IDeptLv1[];
    level: '1' | '2' | '3'; //  科室列表层级 1、一级科室 2、二级科室 3、三级科室
  }>();

  watch(
    () => props.list,
    () => {
      console.log(props.list);
    }
  );
</script>

<style lang="scss" scoped></style>
