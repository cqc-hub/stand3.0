<template>
  <view class="g-page">
    <view class="search-header">
      <view class="search-input">
        <uni-search-input
          v-model:value="r.searchText.value"
          placeholder="请输入医生/科室/症状"
          @confirm="r.confirmSearch"
          @change="(e) => r.searchTextChange.call(r, e)"
        >
          <template #suffixRight>
            <view
              v-if="r.searchText.value"
              class="suffix-right f28"
              @click="
                () => {
                  r.searchText.value = '';
                  r.searchTextChange('');
                }
              "
            >
              取消
            </view>
          </template>
        </uni-search-input>
      </view>
    </view>

    <view class="g-container">
      {{ r.symptomResultList.value }}{{ r.searchText.value.length }}
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { deQueryForUrl } from '@/common';
  import { UseRegSearch } from './utils/RegSearch';

  import { onLoad } from '@dcloudio/uni-app';

  onLoad((opt) => {
    r.init(deQueryForUrl(opt));
  });

  const r = new UseRegSearch();
</script>

<style lang="scss" scoped>
  .search-input {
    margin: 16rpx 32rpx;
  }

  .search-header {
    background-color: #fff;
  }

  .suffix-right {
    padding-right: 20rpx;
  }
</style>
