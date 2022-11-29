<template>
  <view class="">
    <view
      v-for="(item, idx) in list"
      :key="idx"
      @click="itemClick(item)"
      :class="{
        active: isActive(item),
      }"
      class="g-border item"
    >
      <view
        :class="{
          'color-blue': isActive(item),
        }"
        class="iconfont item-choose-icon"
      >
        {{ isActive(item) ? '&#xe6d0;' : '&#xe6ce;' }}
      </view>

      <view class="item-container">
        <view class="title g-border-bottom">
          <text>{{ item.admissionTime }}</text>
          <text class="time-split">至</text>
          <text>{{ item.outTime }}</text>
        </view>

        <view class="row flex-normal">
          <view class="row-title">住院号</view>
          <view class="row-content">{{ item.visitNo }}</view>
        </view>

        <view class="row flex-normal">
          <view class="row-title">诊断</view>
          <view class="row-content">{{ item.diagnosis }}</view>
        </view>

        <view class="row flex-normal">
          <view class="row-title">医生</view>
          <view class="row-content">{{ item.hosName + item.docName }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { TOutHosInfo } from '../utils/recordApply';

  const props = defineProps<{
    list: TOutHosInfo[];
    value: TOutHosInfo[];
  }>();

  const emits = defineEmits(['item-click']);

  const isActive = (item: TOutHosInfo) => {
    return props.value.findIndex((o) => o.visitNo === item.visitNo) !== -1;
  };

  const itemClick = (item) => {
    emits('item-click', item);
  };
</script>

<style lang="scss" scoped>
  .item {
    margin-bottom: 16rpx;
    display: flex;
    padding: 32rpx;
    background-color: #fff;
    border-radius: 8px;

    &.active {
      border-color: var(--hr-brand-color-6);
    }

    .item-choose-icon {
      font-size: var(--hr-font-size-xxl);
      margin-right: 22rpx;
    }

    &:first-child {
      margin-top: 16rpx;
    }

    .item-container {
      flex: 1;

      .title {
        font-weight: 600;
        font-size: var(--hr-font-size-xl);
        padding-bottom: 14rpx;

        // #ifdef MP-ALIPAY
        line-height: 60rpx;
        // #endif

        word-break: break-all;

        .time-split {
          margin: 0 10rpx;
        }
      }

      .row {
        display: flex;
        margin-top: 16rpx;

        font-size: var(--hr-font-size-xs);

        .row-title {
          color: var(--hr-neutral-color-7);
          width: 96rpx;
        }

        .row-content {
          word-break: break-all;
        }
      }
    }
  }
</style>
