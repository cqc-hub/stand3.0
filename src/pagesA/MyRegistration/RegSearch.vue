<template>
  <view class="g-page">
    <view class="search-header">
      <view class="search-input">
        <uni-search-input
          v-model:value="searchText"
          placeholder="请输入医生/科室/症状"
        />
      </view>
    </view>

    <view class="g-container">233</view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  const searchText = ref('');
</script>

<style lang="scss" scoped>
  .search-input {
    margin: 16rpx 32rpx;
  }

  .search-header {
    background-color: #fff;
  }
</style>
