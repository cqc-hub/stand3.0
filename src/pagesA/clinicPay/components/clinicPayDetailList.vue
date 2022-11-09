<template>
  <view class="clinic-pay-list">
    <view v-for="(item, idx) in list" :key="idx" class="item mb16 g-border">
      23
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { type IPayListItem } from '../utils/clinicPayDetail';

  const props = defineProps<{
    list: IPayListItem[];
  }>();
</script>

<style lang="scss" scoped>
  .clinic-pay-list {
    .item {
      background: #ffffff;
      border-radius: 8px;
      padding: 32rpx;

      &:first-child {
        margin-top: 24rpx;
      }
    }
  }
</style>
