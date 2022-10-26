<template>
  <view class="card">
    <view v-for="(item, idx) in list" :key="idx" class="item mb16">cqc</view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { IRegistrationCardItem } from '../../utils/MyRegistration';

  const props = defineProps<{
    list: IRegistrationCardItem[];
  }>();
</script>

<style lang="scss" scoped>
  .card {
    .item {
      background-color: #fff;
    }
  }
</style>
