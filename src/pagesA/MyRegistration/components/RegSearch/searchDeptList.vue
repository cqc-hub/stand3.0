<template>
  <view class="">
    <block v-if="list.length">
      <view
        v-for="item in list"
        :key="item.hosDeptId"
        class="item color-444 f36 g-bold g-border p32"
        @click="itemClick(item)"
      >
        {{ item.deptName }}
      </view>
    </block>

    <view class="empty-list" v-else>
      <g-empty :current="1" />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { IDeptItem } from '../../utils/RegSearch';

  defineProps<{
    list: IDeptItem[];
  }>();

  const emits = defineEmits(['item-click']);

  const itemClick = (item: IDeptItem) => {
    emits('item-click', item);
  };
</script>

<style lang="scss" scoped>
  .item {
    border-radius: 8px;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.05);
    background-color: #fff;
    margin-bottom: 16rpx;

    &:first-child {
      margin-top: 24rpx;
    }
  }
</style>
