<template>
  <view class="list-content">
    <view
      v-for="item in list"
      :key="item.label"
      @click="itemClick(item)"
      class="item"
    >
      <image
        v-if="item.hot === '1'"
        class="hot-logo"
        :src="$global.BASE_IMG + 'order-reg-search-hot.png'"
        mode="widthFix"
      />

      <view class="f28 text-ellipsis label">{{ item.label }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { type IRegSearchHistoryItem } from '../../utils/RegSearch';

  defineProps<{
    list: IRegSearchHistoryItem[];
  }>();

  const emits = defineEmits(['item-click']);

  const itemClick = (item: IRegSearchHistoryItem) => {
    emits('item-click', item);
  };
</script>

<style lang="scss" scoped>
  .list-content {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  .item {
    background: var(--hr-neutral-color-1);
    display: flex;
    border-radius: 8px;
    padding: 12rpx 32rpx;

    align-items: center;
    .label {
      max-width: 300rpx;
    }

    .hot-logo {
      width: 32rpx;
      height: 32rpx;
    }
  }
</style>
