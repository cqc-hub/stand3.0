<template>
  <view
    :style="{
      'grid-template-columns': `repeat(${column}, 1fr)`,
    }"
    class="selpopup-container"
  >
    <view
      v-for="item in list"
      @click="itemClick(item)"
      :key="item[field.value]"
      :class="{
        'item-active-border': isAllActive || isActive(item[field.value]),
      }"
      class="g-flex-rc-cc"
    >
      <view
        :class="{
          'item-active': isAllActive || isActive(item[field.value]),
        }"
        class="item g-flex-rc-cc text-ellipsis"
      >
        <view class="label f28">{{ item[field.label] }}</view>
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
  import { GStores } from '@/utils';

  export default defineComponent({
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },

      list: {
        type: Array as PropType<any[]>,
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

      value: {
        type: (String || Array) as PropType<any>,
        default: '',
      },

      field: {
        type: Object as PropType<{
          label: string;
          value: string;
        }>,
        default: () => ({
          label: 'label',
          value: 'value',
        }),
      },

      multiple: {
        type: Boolean,
        default: false,
      },

      selectLength: {
        type: Number,
        default: 0,
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

    emits: ['item-click', 'item-delete', 'update:value'],

    setup(props, ctx) {
      const { emit } = ctx;
      const gStores = new GStores();
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

      const itemClick = (item) => {
        emit('item-click', item);
        const value = item[props.field.value];

        if (props.multiple) {
          if (props.value) {
            const idx = props.value.findIndex((o) => o === value);

            if (idx === -1) {
              const maxLen = props.selectLength;
              if (maxLen && props.value.length >= maxLen) {
                gStores.messageStore.showMessage(
                  '最多可以选择' + maxLen + '项'
                );
                return;
              }

              emit(
                'update:value',
                props.value ? [...props.value, value] : [value]
              );
            } else {
              const _values = [...props.value];
              _values.splice(idx, 1);

              emit('update:value', _values);
            }
          } else {
            emit('update:value', [value]);
          }
        } else {
          emit('update:value', value);
        }
      };

      const itemDelete = (item) => {
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
      min-height: 0rpx;
      border-radius: 16rpx;
      font-size: var(--hr-font-size-xs);
      position: relative;
      margin: 2rpx;
      width: calc(100% - 4rpx);
      height: calc(100% - 4rpx);
      z-index: 4;
      gap: 16rpx;

      flex-direction: column;

      .label {
        padding: 18rpx 0;
      }

      .icon-del {
        position: absolute;
        right: -1rpx;
        top: -3rpx;
        color: var(--hr-neutral-color-9);
        font-size: 48rpx;
        z-index: 2;
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
