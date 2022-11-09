<template>
  <view class="clinic-pay-list">
    <view
      v-for="(item, idx) in list"
      :key="idx"
      class="item flex-normal mb16 g-border"
    >
      <view @click="isActive = !isActive" class="iconfont check-box-icon">
        {{ getIsActive(item) ? '&#xe6d0;' : '&#xe6ce;' }}
      </view>

      <view>
        <view>
          <view class="g-bold f36">新冠病毒核酸检测门诊</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { type IPayListItem } from '../utils/clinicPayDetail';

  const props = defineProps<{
    list: IPayListItem[];
  }>();

  const isActive = ref(false);
  const getIsActive = (item: IPayListItem) => {
    return isActive.value;
  };
</script>

<style lang="scss" scoped>
  .clinic-pay-list {
    .item {
      background: #ffffff;
      border-radius: 8px;
      padding: 32rpx;
      align-items: flex-start;

      &:first-child {
        margin-top: 24rpx;
      }

      .check-box-icon {
        font-size: var(--hr-font-size-xxl);
        line-height: var(--hr-font-size-base);
      }
    }
  }
</style>
