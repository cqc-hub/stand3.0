<template>
  <view class="item-more">
    <view class="header" @click="itemClick">
      <view
        :class="{
          'color-888': disabled,
        }"
        class="hos-name text-ellipsis"
      >
        {{ item.aliasName }}
      </view>

      <view>
        <view class="hos-level">{{ item.hosLevelName }}</view>
      </view>
    </view>

    <view v-if="disabled" class="hos-location f26 color-888">暂未开通</view>
    <view v-else class="hos-location" @click.stop="locationClick">
      <view class="g-flex-rc-cc hos-location-prefix">
        <view class="iconfont icon-location">&#xe6d7;</view>
        <view v-if="item.distanceFormat">距离{{ item.distanceFormat }}km</view>
        <view v-else>导航</view>
      </view>

      <view class="hos-away text-ellipsis">{{ item.address }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, reactive } from 'vue';
  import { IHosInfo } from '@/utils';

  const props = defineProps<{
    item: IHosInfo;
    disabled?: boolean;
  }>();

  const emits = defineEmits(['img-click', 'location-click', 'item-click']);

  const itemClick = () => {
    if (props.disabled) {
      return;
    }
    emits('item-click', props.item);
  };

  const locationClick = () => {
    if (props.disabled) {
      return;
    }
    emits('location-click', props.item);
  };

  const imgClick = () => {
    emits('img-click', props.item);
  };
</script>

<style lang="scss" scoped>
  .item-more {
    border: 2rpx solid #f3f3f3;
    border-radius: 16rpx;
    background-color: #fff;
    padding: 32rpx;
    position: relative;

    .header {
      display: flex;

      justify-content: space-between;
      .hos-name {
        font-size: var(--hr-font-size-xl);
        font-weight: 600;
        color: var(--hr-neutral-color-10);
        -webkit-line-clamp: 2;
        flex: 1;
      }

      .hos-level {
        font-size: var(--hr-font-size-xxxs);
        color: #ffe2c1;
        background: #51555e;
        border-radius: 4rpx;
        padding: 5rpx 12rpx;
        margin-left: 100rpx;
      }
    }

    .hos-location {
      margin-top: 12rpx;
      display: flex;
      align-items: center;
      color: var(--hr-neutral-color-8);
      font-size: var(--hr-font-size-xxxs);

      .icon-location {
        color: var(--hr-brand-color-6);
        margin-right: 6rpx;
        top: -2rpx;
      }

      .hos-away {
        flex: 1;
      }
    }
  }

  .hos-location-prefix {
    &::after {
      content: '|';
      display: block;
      padding: 0 12rpx;
      color: var(--hr-neutral-color-2);
    }
  }
</style>
