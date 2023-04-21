<template>
  <view
    :style="{
      'grid-template-columns': `repeat(${column}, 1fr)`,
    }"
    class="selpopup-container"
  >
    <view
      v-for="item in orderSourceList"
      @click.stop="itemClick(item)"
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
        :style="{
          'background-color': itemBgc,
        }"
        class="item g-flex-rc-cc text-ellipsis"
      >
        <text class="title">{{ item.timeDesc }}</text>
        <text v-if="isBlur === '1'" class="item-desc">
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

      disabledActiveStyle: {
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

      itemBgc: {
        type: String,
        default: 'var(--hr-neutral-color-1)',
      },
    },

    emits: ['item-click', 'item-delete'],

    setup(props, ctx) {
      const { emit } = ctx;
      const isActive = (v: any) => {
        if (props.disabledActiveStyle) {
          return false;
        }

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
  @import './style/pop-list.scss';
</style>
