<template>
  <view class="container">
    <scroll-view
      class="dept-list"
      :class="{
        'dept-list-lv2': isLv2,
        'dept-list-lv1-scrollContainer': !isLv2,
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
          transform: `translateY(${pillOffsetTop}px)`,
        }"
        class="item-lv1-pills"
      />
      <view style="background: #fff">
        <view
          v-for="(item, indexLv1) in list"
          :key="item.uuid"
          :class="{
            'dept-list-lv2': isLv2,
            'dept-list-lv2-alone': level === '2',
            'item-lv1-active': activeLV1 === indexLv1,
            'item-lv1-active-corner-bottom': getItemCornerTopIdx === indexLv1,
            'item-lv1-active-corner-top': getItemCornerBottomIdx === indexLv1,
            'item-lv1-border': !isLv2,
            'g-border-bottom': !isLv2,
          }"
          @click="itemClickLv1(item)"
          class="item-lv1 g-flex-rc-cc f32"
        >
          <text>{{ item.deptName }}</text>
        </view>
      </view>
    </scroll-view>

    <scroll-view v-if="isLv2" class="dept-list-lv2-scrollContainer" scroll-y>
      <view
        v-for="(itemLv2, i) in deptListLv2"
        :key="itemLv2.uuid"
        :class="{}"
        class="dept-list-lv2-collapse-container animate__animated animate__fadeIn"
      >
        <Dept-Collapse
          :item="itemLv2"
          :myId="i"
          :active-lv2="activeLv2"
          :active-lv3="activeLv3"
          :open="itemLv2.open"
          @show="collapseShow"
          @open-now="(e) => (openNow = e)"
          @item-click-lv2="itemClickLv2"
          @item-click-lv3="itemClickLv3"
          ref="collapseRef"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, computed, getCurrentInstance } from 'vue';
  import { isLev1, IDeptLv1, IDeptLv2, IDeptLv3 } from '@/stores';
  import { wait } from '@/utils';

  import DeptCollapse from '../dept-collapse/dept-collapse.vue';

  const props = withDefaults(
    defineProps<{
      list: IDeptLv1[];
      level: '1' | '2' | '3'; //  科室列表层级 1、一级科室 2、二级科室 3、三级科室
      lineColor?: string;
      activeLv1: IDeptLv1;
      activeLv2: IDeptLv2;
      activeLv3: IDeptLv3;
    }>(),
    {
      lineColor: 'linear-gradient(270deg,#53a8ff, #296fff)',
    }
  );

  const emits = defineEmits([
    'item-click-lv1',
    'item-click-lv2',
    'item-click-lv3',
  ]);

  const collapseRef = ref<any>('');

  const pillHeight = ref(0);
  const pillOffsetTop = ref(0);

  const activeLV1 = ref(-1);
  const openNow = ref(-1);

  const getItemCornerTopIdx = computed(() => {
    return activeLV1.value - 1;
  });

  const getItemCornerBottomIdx = computed(() => {
    return activeLV1.value + 1;
  });

  const isLv2 = computed(() => ['2', '3'].includes(props.level));
  const deptListLv2 = ref<IDeptLv2[]>([]);

  const inst = getCurrentInstance();

  const getPillPosition = async () => {
    if (!isLv2.value || activeLV1.value < 0) {
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

  const collapseShow = (id: number, flag = false) => {
    if (collapseRef.value) {
      collapseRef.value.map((collapseInst, i) => {
        if (i !== id) {
          collapseInst.show(flag);
        }
      });
    }
  };

  const itemClickLv1 = async (item: IDeptLv1) => {
    emits('item-click-lv1', item);
    await wait(80);
    // #ifdef MP-TOUTIAO
    await wait(120);
    // #endif

    const idx = props.list.findIndex(
      (o) => o.hosDeptId === props.activeLv1.hosDeptId
    );
    if (idx !== -1) {
      activeLV1.value = idx;
    }
    if (isLev1(item) && isLv2.value) {
      deptListLv2.value = item.children || [];
      getPillPosition();
    }
  };

  const itemClickLv2 = (item: IDeptLv2) => {
    emits('item-click-lv2', item);
    openNow.value = -1;
  };

  const itemClickLv3 = (item: IDeptLv3) => {
    emits('item-click-lv3', item);
  };

  watch(
    () => props.list,
    async () => {
      if (props.list.length && props.level !== '1') {
        const defaultChoose =
          props.list.find((o) => o.firstDefaultShowDept === '1') ||
          props.list[0];

        if (defaultChoose.children && defaultChoose.children.length) {
          await wait(20);
          itemClickLv1(defaultChoose);
        }
      }
    },

    {
      immediate: true,
    }
  );
</script>

<style lang="scss" scoped>
  .container {
    height: 100%;

    display: flex;
  }

  .dept-list {
    height: 100%;

    &.dept-list-lv2 {
      background-color: var(--hr-neutral-color-1);
      width: 33%;
    }
  }

  .item-lv1 {
    padding: 28rpx 32rpx;
    padding-right: 40rpx;

    justify-content: flex-start;
    color: var(--hr-neutral-color-9);
    position: relative;
    background-color: var(--hr-neutral-color-1);

    &.item-lv1-active-corner-bottom {
      animation: animate-corner-bottom 0.1s ease-in-out both 0s;
    }

    &.item-lv1-active-corner-top {
      animation: animate-corner-top 0.1s ease-in-out both 0s;
    }

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

  .fix-top {
    position: sticky;
    top: 0;
    z-index: 2;
  }

  @keyframes animate-corner-bottom {
    0% {
      border-radius: 0;
    }

    100% {
      border-radius: 0 0 20rpx/30rpx;
    }
  }

  @keyframes animate-corner-top {
    0% {
      border-radius: 0;
    }

    100% {
      border-top-right-radius: 20rpx 30rpx;
    }
  }
</style>
