<template>
  <scroll-view
    class="dept-list dept-list-lv2"
    id="dept-list-lv1-scrollContainer"
    scroll-y
  >
    <view
      :style="{
        background: lineColor,
        width: '10rpx',
        height: pillHeight + 'px',
        left: '0',
        transform: `translateY(${pillOffsetTop}px)`,
      }"
      class="item-lv1-pills"
    />

    <view
      v-for="(item, indexLv1) in list"
      :key="item.firstHosDeptId"
      :class="{
        'item-lv1-active': value === item[field.value],
      }"
      @click="itemClickLv1(item, indexLv1)"
      class="item-lv1 g-flex-rc-cc dept-list-lv2 dept-list-lv2-alone"
    >
      <text>{{ item[field.label] }}</text>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref, watch } from 'vue';
  import { wait } from '@/utils';

  const props = withDefaults(
    defineProps<{
      list: any[];
      lineColor?: string;
      defaultChoose?: boolean; // 默认选中第一个
      value: any;
      field?: {
        label: string;
        value: string;
      };
    }>(),
    {
      lineColor: 'linear-gradient(270deg,#53a8ff, #296fff)',
      field: () => ({
        label: 'label',
        value: 'value',
      }),
    }
  );
  const emits = defineEmits(['item-click']);

  const pillHeight = ref(0);
  const pillOffsetTop = ref(0);
  const inst = getCurrentInstance();

  const getPillPosition = async () => {
    const v = props.value;
    const idx = props.list.findIndex((o) => o[props.field.value] === v);
    if (idx < 0) {
      return;
    }
    const query = uni.createSelectorQuery().in(inst);
    query
      .selectAll(`.item-lv1`)
      .boundingClientRect((data: any) => {
        if (data) {
          let lineTop = 0;
          let currentHeight = 0;

          for (let i = 0; i < data.length; i++) {
            if (i < idx) {
              lineTop += data[i].height;
            } else if (i == idx) {
              currentHeight = data[i].height;
            } else {
              break;
            }
          }

          const _baseUnit = 30;
          pillOffsetTop.value = lineTop + _baseUnit / 2;
          pillHeight.value = currentHeight - _baseUnit;
        }
      })
      .exec();
  };

  const itemClickLv1 = async (item: any, idx: number) => {
    emits('item-click', {
      item,
      idx,
    });
    await wait(0);

    getPillPosition();
  };

  watch(
    () => props.list,
    () => {
      const defaultChoose = props.list[0];
      if (defaultChoose && props.defaultChoose) {
        itemClickLv1(defaultChoose, 0);
      }
    },

    {
      immediate: true,
    }
  );
</script>

<style lang="scss" scoped>
  .dept-list {
    height: 100%;

    &.dept-list-lv2 {
      background-color: var(--hr-neutral-color-1);
    }
  }

  .item-lv1 {
    padding: 28rpx 32rpx;
    padding-right: 40rpx;

    justify-content: flex-start;
    color: var(--hr-neutral-color-9);
    transition: all 0.3s;

    &.dept-list-lv2-alone {
      padding: 24rpx 32rpx;
    }

    &.item-lv1-border {
      margin: 0 32rpx;
      padding-right: 0;
      padding-left: 0;
    }

    &-active {
      background-color: #fff;
      color: var(--hr-brand-color-6);
      font-weight: 600;
    }

    &-pills {
      position: absolute;
      transition: all 0.3s linear;
      z-index: 9;
    }
  }

  #dept-list-lv1-scrollContainer {
    position: relative;

    &.dept-list-lv1-scrollContainer {
      width: 100%;
    }
  }

  .dept-list-lv2-scrollContainer {
    flex: 1;
  }
</style>
