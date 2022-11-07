<template>
  <view
    :style="{
      'grid-template-columns': `repeat(${column}, 1fr)`,
    }"
    class="selpopup-container"
  >
    <view
      v-for="item in orderSourceList"
      @click="itemClick(item)"
      :key="item.numId"
      :class="{
        'item-active-border': isAllActive || isActive(item.numId),
      }"
      class="g-flex-rc-cc"
    >
      <view
        :class="{
          'item-active': isAllActive || isActive(item.numId),
        }"
        class="item g-flex-rc-cc text-ellipsis"
      >
        <text class="title">{{ item.timeDesc }}</text>
        <text v-if="isBlur === '0'" class="item-desc">
          第 {{ item.disNo }} 号
        </text>
        <text v-else class="item-desc">剩余 {{ item.disNo }} 个</text>
      </view>
    </view>

    <view
      v-if="$slots.default && !disabled"
      class="item g-flex-rc-cc item-content-outline"
    >
      <slot />
    </view>
  </view>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType, reactive } from 'vue';
  import { TSchInfo, IOrderSource } from '../../utils/index';

  export default defineComponent({
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },

      orderSourceList: {
        type: Array as PropType<IOrderSource[]>,
        default: (): IHOption => [],
      },

      column: {
        type: Number,
        default: 3,
      },

      option: {
        type: Array as PropType<IHOption>,
        default: (): IHOption => [],
      },

      isBlur: {
        type: String as PropType<'0' | '1'>,
        default: '1',
      },

      value: {
        type: String as PropType<any>,
        default: '',
      },

      multiple: {
        type: Boolean,
        default: false,
      },

      showDelIcon: {
        type: Boolean,
        default: false,
      },

      isAllActive: {
        type: Boolean,
        default: false,
      },
    },

    emits: ['item-click', 'item-delete'],

    setup(props, ctx) {
      const { emit } = ctx;
      const isActive = (v: any) => {
        if (props.multiple) {
          if (Array.isArray(props.value)) {
            return props.value.findIndex((o) => o === v) !== -1;
          } else {
            return false;
          }
        }

        return props.value === v;
      };

      const itemClick = (item: IOrderSource) => {
        emit('item-click', item);
      };

      const itemDelete = (item: IOrderSource) => {
        emit('item-delete', item);
      };

      return {
        isActive,
        itemClick,
        itemDelete,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .selpopup-container {
    // padding: 32rpx;

    display: grid;
    gap: 16rpx;

    .item {
      background-color: var(--hr-neutral-color-1);
      min-height: 130rpx;
      border-radius: 16rpx;
      font-size: var(--hr-font-size-xs);
      position: relative;
      margin: 2rpx;
      width: calc(100% - 4rpx);
      height: calc(100% - 4rpx);
      z-index: 4;

      flex-direction: column;

      .icon-del {
        position: absolute;
        right: -1rpx;
        top: -3rpx;
        color: var(--hr-neutral-color-9);
        font-size: 48rpx;
        z-index: 2;
      }

      .title {
        font-weight: 600;
        font-size: var(--hr-font-size-base);
        color: var(--hr-neutral-color-10);
      }

      .item-desc {
        color: var(--hr-neutral-color-9);
        font-size: var(--hr-font-size-xxxs);
      }

      &.item-active {
        color: var(--hr-brand-color-6);
        background-color: var(--hr-brand-color-1);
      }
    }

    .item-active-border {
      background-color: var(--hr-brand-color-6);
      border-radius: 16rpx;
    }
  }
</style>
