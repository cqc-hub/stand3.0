<template>
  <view class="container">
    <scroll-view
      class="dept-list"
      :class="{
        'dept-list-lv2': isLv2
      }"
      id="dept-list-lv1-scrollContainer"
      scroll-y
    >
      <view
        :style="{
          background: lineColor,
          width: '10rpx',
          height: pillHeight + 'px',
          left: '0',
          transform: `translateY(${pillOffsetTop}px)`
        }"
        class="item-lv1-pills"
      />

      <view
        v-for="(item, indexLv1) in list"
        :key="item.firstHosDeptId"
        :class="{
          'dept-list-lv2': isLv2,
          'item-lv1-active': activeLV1 === indexLv1
        }"
        @click="itemClickLv1(item, indexLv1)"
        class="item-lv1 g-flex-rc-cc"
      >
        <text class="text-ellipsis">{{ item.deptName }}</text>
      </view>
    </scroll-view>

    <scroll-view v-if="isLv2" class="dept-list-lv2-scrollContainer" scroll-y>
      <view v-for="(itemLv2, i) in deptListLv2" :key="itemLv2.hosDeptId" class="dept-list-lv2-collapse-container">
        <Dept-Collapse :item="itemLv2" :myId="i" />
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, computed, getCurrentInstance } from 'vue';
  import { isLev1, IDeptLv1, IDeptLv2 } from '../../utils';

  import DeptCollapse from '../dept-collapse/dept-collapse.vue';

  const props = withDefaults(
    defineProps<{
      list: IDeptLv1[];
      level: '1' | '2' | '3'; //  科室列表层级 1、一级科室 2、二级科室 3、三级科室
      lineColor?: string;
    }>(),
    {
      lineColor: 'linear-gradient(270deg,#53a8ff, #296fff)'
    }
  );

  const pillHeight = ref(0);
  const pillOffsetTop = ref(0);

  const activeLV1 = ref(0);

  const isLv2 = computed(() => ['2', '3'].includes(props.level));
  const deptListLv2 = ref<IDeptLv2[]>([]);

  watch(
    () => props.list,
    () => {
      if (props.list.length) {
        itemClickLv1(props.list[0], 0);
      }
    }
  );

  const itemClickLv1 = (item: IDeptLv1, index: number) => {
    activeLV1.value = index;

    if (isLev1(item) && isLv2.value) {
      deptListLv2.value = item.children || [];
    }

    getPillPosition();
  };

  const inst = getCurrentInstance();

  const getPillPosition = async () => {
    if (!isLv2.value) {
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
            if (i < activeLV1.value) {
              lineTop += data[i].height;
            } else if (i == activeLV1.value) {
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
</script>

<style lang="scss" scoped>
  .container {
    height: 100%;

    display: flex;

    &.dept-list-lv2 {
      display: flex;
    }
  }

  .dept-list {
    height: 100%;

    &.dept-list-lv2 {
      background-color: var(--hr-neutral-color-1);
      width: 33%;
    }
  }

  .item-lv1 {
    padding: 26rpx 32rpx;
    padding-right: 40rpx;

    justify-content: flex-start;
    color: var(--hr-neutral-color-9);

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

    &.dept-list-lv2 {
    }
  }

  #dept-list-lv1-scrollContainer {
    position: relative;
  }

  .dept-list-lv2-scrollContainer {
    flex: 1;

    .dept-list-lv2-collapse-container {
      box-shadow: 0px -1px 0px 0px #f3f3f3 inset;
    }
  }
</style>
