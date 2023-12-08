<template>
  <view class="pat-list">
    <view
      v-for="(item, i) in list"
      :key="item[field.value]"
      @click="patClick(item, i)"
      class="pat-item mb16"
    >
      <view class="user-label text-ellipsis">
        <text class="user-name">{{ item[field.label] }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      list: Record<string, any>[];
      field?: { label: string; value: string };
    }>(),
    {
      field: () => ({ label: 'label', value: 'value' }),
    }
  );
  const curr = ref(-1);

  const emits = defineEmits(['item-click']);
  const patClick = (item, index: number) => {
    emits('item-click', {
      item,
      index,
    });

    curr.value = index;
  };
</script>

<style lang="scss" scoped>
  .pat-list {
    width: calc(100% - 64rpx);
    display: flex;
    flex-direction: column;
    // gap: 16rpx;
    padding: 0 32rpx;

    .pat-item {
      flex: 1;
      border: 2rpx solid var(--hr-neutral-color-4);
      border-radius: 16rpx;
      padding: 32rpx;
      background-color: #fff;

      display: grid;
      grid-template-columns: 1fr 40rpx;
      align-items: center;

      .user-avatar {
        border-radius: 300rpx;
        width: 64rpx;
      }

      .user-label {
        color: var(--hr-neutral-color-8);
        font-size: var(--hr-font-size-xs);
        flex: 1;
        width: 100%;

        .user-name {
          color: var(--hr-neutral-color-10);
          font-size: var(--hr-font-size-xl);
          font-weight: 600;
        }
      }

      .ico-checkbox {
        color: var(--hr-brand-color-6);
        font-size: 46rpx;
      }
    }
  }
</style>
