<template>
  <view class="">
    <view v-for="item in list" :key="item.uuid" class="item mb16">
      <view @click="takeNumber(item)" class="g-flex-rc-cc pt32">
        <view
          :class="{
            'take-number-disabled': item.disabled || !item.signIn,
          }"
          class="take-number g-flex-rc-cc f36 g-bold"
        >
          {{ item.label }}
        </view>
      </view>

      <view
        v-if="!item.status"
        @click="refrashData"
        class="g-flex-rc-cc color-blue f28 mt24"
      >
        <image
          :src="$global.BASE_IMG + 'stand3-refresh.png'"
          :class="{
            'rotate-icon': loading,
          }"
          class="refresh-icon"
        />
        <view>点击刷新定位</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { type _TTakeNumberListItem } from '../utils/takeNumber';

  defineProps<{
    list: _TTakeNumberListItem[];
    loading: boolean;
  }>();
  const emits = defineEmits(['refresh-data', 'take-number', 'sign-in']);

  const refrashData = () => {
    emits('refresh-data');
  };

  const takeNumber = (item: _TTakeNumberListItem) => {
    if (item.signIn) {
      emits('take-number', item);
    }
  };

  const signIn = (item: _TTakeNumberListItem) => {
    emits('sign-in', item);
  };
</script>

<style lang="scss" scoped>
  .item {
    background-color: #fff;
    padding: 32rpx;
    border: 1rpx solid var(--hr-neutral-color-2);
    border-radius: 8px;

    .take-number {
      width: 280rpx;
      height: 280rpx;
      background: var(--hr-brand-color-6);
      border-radius: 50%;
      color: #fff;

      &.take-number-disabled {
        color: var(--hr-neutral-color-5);
        background: #eeeeee;
        pointer-events: none;
      }
    }
  }

  .refresh-icon {
    width: 40rpx;
    height: 40rpx;

    &.rotate-icon {
      animation: rotateIcon 2s linear infinite forwards;
    }
  }

  @keyframes rotateIcon {
    from {
      -webkit-transform: rotate(0deg);
    }

    to {
      -webkit-transform: rotate(360deg);
    }
  }
</style>
