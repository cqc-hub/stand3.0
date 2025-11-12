<template>
  <view class="">
    忘记那就试试

    <view v-for="item in list" :key="item.id">
      {{ item.name }}

      <slot :item="item" />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';

  defineProps<{
    list: any[];
  }>();

  onLoad(async () => {});
</script>

<style lang="scss" scoped></style>
