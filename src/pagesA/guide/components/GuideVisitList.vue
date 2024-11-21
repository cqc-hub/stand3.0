<template>
  <view class="flex">
    <text class="my-hide">占位</text>

    <view
      v-for="(item, i) in list"
      :key="i"
      :class="{
        mr16: i !== list.length - 1,
        [isActive(item)
          ? 'bg-blue-light btn-primary'
          : 'color-444 font-normal']: 1,
      }"
      @click="itemClick(item)"
      class="text-no-wrap btn btn-plain btn-border btn-round item f28"
    >
      <text class="mr12">{{ item.date }}</text>
      <text>{{ item.deptName }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { TVisitRecord } from '../guide';

  const props = defineProps<{
    list: TVisitRecord[];
    selItem: TVisitRecord;
  }>();
  const emits = defineEmits(['item-click']);

  const isActive = (item: TVisitRecord) => {
    return props.selItem.visitNo === item.visitNo;
  };

  const itemClick = (item: TVisitRecord) => {
    emits('item-click', item);
  };
</script>

<style lang="scss" scoped>
  .item {
    border-radius: 19px;
    height: 36rpx;
  }
</style>
