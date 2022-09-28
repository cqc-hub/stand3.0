<template>
  <view class="">
    <web-view :src="src" v-if="src"></web-view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  const props = defineProps<{
    https: string;
  }>();
  const src = ref('');

  if (props.https) {
    src.value = decodeURIComponent(props.https);
  }
</script>

<style lang="scss" scoped></style>
