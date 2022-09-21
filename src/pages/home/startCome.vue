<template>
  <view class="">
    <web-view v-if="src" :src="src"></web-view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

	const src = ref('');
</script>

<style lang="scss" scoped></style>
