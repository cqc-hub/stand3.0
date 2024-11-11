<template>
  <view class="content-area">
    <p v-for="item in 200" :key="item">{{ item }}</p>
  </view>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
  .content-area {
    padding-top: 180rpx;
  }
</style>
