<template>
  <view class="flex">
    <text class="my-hide">占位</text>

    <view
      v-for="(item, i) in list"
      :key="i"
      :class="{
        mr16: i !== list.length - 1,
        [isActive(item) ? 'bg-blue-light btn-primary' : 'color-444 font-normal']: 1,
      }"
      class="text-no-wrap btn btn-plain btn-border btn-round item f28"
    >
      <text class="mr12">{{ item.time }}23</text>
      <text>{{ item.label }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  defineProps<{
    list: any[];
  }>();

  const isActive = (item) => {
    return item.time === '09-25';
  };
</script>

<style lang="scss" scoped>
  .item {
    border-radius: 19px;
    height: 36rpx;
  }
</style>
