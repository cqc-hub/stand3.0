<template>
  <view class="">233</view>
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
