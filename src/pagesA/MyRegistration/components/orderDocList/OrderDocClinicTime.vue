<template>
  <view v-if="item.clinicTime" class="mb12 flex items-center">
    <view class="sel-label g-flex-rc-cc text-no-wrap mr32">就诊提醒</view>
    <view class="color-444 text-ellipsis ellipsis-line-clamp2">
      {{ item.clinicTime }}
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { IDocListAll } from '../../utils';

  const props = defineProps<{
    item: any;
    // item: IDocListAll;
    isAllDate?: boolean;
  }>();
</script>

<style lang="scss" scoped>
  .sel-label {
    justify-content: flex-start;
    align-items: flex-start;
    color: var(--hr-neutral-color-8);
    font-size: var(--hr-font-size-xxxs);
  }
</style>
