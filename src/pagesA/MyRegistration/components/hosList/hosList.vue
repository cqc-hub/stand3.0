<template>
  <view class="hos-list-container">
    <view v-for="(item, i) in list" :key="i">
      <block v-if="hosLen < 4">
        <Item-Less
          :item="item"
          @img-click="imgClick"
          @location-click="locationClick"
          @item-click="itemClick"
        />
      </block>

      <block v-else>
        <Item-More
          :item="item"
          @img-click="imgClick"
          @location-click="locationClick"
          @item-click="itemClick"
        />
      </block>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { ServerStaticData, IHosInfo } from '@/utils';
  import ItemLess from './hosListItemLess.vue';
  import ItemMore from './hosListItemMore.vue';

  const props = defineProps<{
    list: IHosInfo[];
  }>();

  const hosLen = computed(() => props.list.length);

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
