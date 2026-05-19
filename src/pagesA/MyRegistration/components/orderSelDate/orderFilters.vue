<template>
  <view class="flex justify-end bg-white g-border-top">
    <view
      v-if="pageConfig.isShowFilterOrderInHoliday === '1'"
      @click="emits('update:isFilterHoliday', !isFilterHoliday)"
      class="flex-normal pt6 pb6 mr32"
    >
      <text class="iconfont f48">
        {{ isFilterHoliday ? '&#xe6d0;' : '&#xe6ce;' }}
      </text>
      <text>只看节假日</text>
    </view>

    <view
      v-if="pageConfig.isShowFilterOrderSourceBtn === '1'"
      @click="emits('update:isFilterDoctor', !isFilterDoctor)"
      class="flex-normal pt6 pb6 mr32"
    >
      <text class="iconfont f48">
        {{ isFilterDoctor ? '&#xe6d0;' : '&#xe6ce;' }}
      </text>
      <text>只看有号</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { ISystemConfig } from '@/utils';

  defineProps<{
    pageConfig: ISystemConfig['order'];
    isFilterDoctor: boolean;
    isFilterHoliday: boolean;
  }>();

  const emits = defineEmits([
    'update:isFilterDoctor',
    'update:isFilterHoliday',
  ]);
</script>

<style lang="scss" scoped></style>
