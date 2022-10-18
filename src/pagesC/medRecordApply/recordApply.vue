<template>
  <view class="page">
    <g-choose-pat />
    <view class="container"></view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .container {
      flex: 1;
      height: 1px;
      overflow-y: scroll;
    }
  }
</style>
