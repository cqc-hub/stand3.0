<template>
  <view class="hos-list-container">
    <view v-for="(item, i) in list" :key="i">
      <Item-Less
        v-if="i % 2 === 0"
        :item="item"
        @img-click="imgClick"
        @location-click="locationClick"
        @item-click="itemClick"
      />

      <Item-More v-else :item="item" @img-click="imgClick" @location-click="locationClick" @item-click="itemClick" />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { ServerStaticData, IHosInfo } from '@/utils';
  import ItemLess from './hosListItemLess.vue';
  import ItemMore from './hosListItemMore.vue';

  const props = defineProps<{
    list: IHosInfo[];
  }>();

  const emits = defineEmits(['img-click', 'location-click', 'item-click']);

  const itemClick = (item: IHosInfo) => {
    emits('item-click', item);
  };

  const locationClick = (item: IHosInfo) => {
    emits('location-click', item);
  };

  const imgClick = (item: IHosInfo) => {
    emits('img-click', item);
  };
</script>

<style lang="scss" scoped>
  .hos-list-container {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }
</style>
