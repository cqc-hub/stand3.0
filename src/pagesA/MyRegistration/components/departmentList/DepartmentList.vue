<template>
  <view class="container">
    <scroll-view
      class="dept-list"
      :class="{
        'dept-list-lv2': isLv2,
        'dept-list-lv1-scrollContainer': !isLv2,
      }"
      :scroll-into-view="scrollView"
      @scroll="asideListScroll"
      id="dept-list-lv1-scrollContainer"
      scroll-y
    >
      <view>
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
              'item-lv1-active-corner-bottom':
                level !== '1' && getItemCornerTopIdx === indexLv1,
              'item-lv1-active-corner-top':
                level !== '1' && getItemCornerBottomIdx === indexLv1,
              'item-lv1-border': !isLv2,
              'g-border-bottom': !isLv2,
              mb6: level === '1',
              'lv1-alone-animate': lv1AnimateIdxs.includes(indexLv1),
            }"
            :id="'lv1' + item.uuid"
            @click="itemClickLv1(item)"
            class="item-lv1 g-flex-rc-cc f32"
          >
            <view
              class="lv1-text"
              :class="{ 'lv1-min-width': item.isPartySpecialization }"
            >
              <text>
                <text
                  :class="{
                    pl24: level === '1',
                  }"
                >
                  <text>
                    <text>
                      {{ item.deptName }}
                    </text>

                    <text
                      v-if="item.freeClinicId === '1'"
                      class="g-tag tag-danger text-no-wrap f28 ml12"
                    >
                      义诊
                    </text>
                  </text>
                </text>
              </text>
              <image
                v-if="item.isPartySpecialization"
                class="party_specialization2 text-no-wrap f28 ml12"
                :src="`${globalGl.BASE_IMG}party_specialization2.png`"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- <DepartmentListLv1 v-else :list="list" /> -->
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
  import { watch, ref, computed, getCurrentInstance, nextTick } from 'vue';
  import { isLev1, IDeptLv1, IDeptLv2, IDeptLv3 } from '@/stores';
  import { wait, throttle } from '@/utils';
  import globalGl from '@/config/global';
  import DeptCollapse from '../dept-collapse/dept-collapse.vue';
  import DepartmentListLv1 from './DepartmentListLv1.vue';

  const props = withDefaults(
    defineProps<{
      list: IDeptLv1[];
      level: string; //  科室列表层级 1、一级科室 2、二级科室 3、三级科室
      lineColor?: string;
      activeLv1: IDeptLv1;
      activeLv2: IDeptLv2;
      activeLv3: IDeptLv3;
    }>(),
    {
      lineColor:
        'linear-gradient(270deg,var(--hr-brand-color-3),var(--hr-brand-color-6))',
    }
  );

  const scrollView = ref('');
  const screenHeight = uni.getSystemInfoSync().screenHeight;
  const lv1AnimateIdxs = ref(<number[]>[]);

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
    let query = uni.createSelectorQuery();
    // #ifndef MP-TOUTIAO
    query = query.in(inst);
    // #endif
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

    const idx = props.list.findIndex((o) => o.uuid === props.activeLv1.uuid);
    if (idx !== -1) {
      activeLV1.value = idx;
    }
    if (isLev1(item) && isLv2.value) {
      deptListLv2.value = [];

      nextTick(() => {
        deptListLv2.value = item.children || [];
        getPillPosition();
      });
    }
  };

  const itemClickLv2 = (item: IDeptLv2) => {
    emits('item-click-lv2', item);
    openNow.value = -1;
  };

  const itemClickLv3 = (item: IDeptLv3) => {
    emits('item-click-lv3', item);
  };

  let asideListScroll = () => {
    if (props.level !== '1') {
      return;
    }

    const query = uni.createSelectorQuery();
    query
      .selectAll(`.item-lv1`)
      .boundingClientRect((data: any) => {
        if (data) {
          data.map((o, i) => {
            let n = 88;

            if (i === data.length) {
              n = 0;
            }

            if (o.top + n < screenHeight) {
              if (!lv1AnimateIdxs.value.includes(i)) {
                lv1AnimateIdxs.value.push(i);
              }
            }
          });
        }
      })
      .exec();
  };

  asideListScroll = throttle(asideListScroll, 50);

  watch(
    () => props.list,
    async () => {
      if (props.list.length) {
        if (props.level === '1') {
          scrollView.value = 'lv1' + props.list[0].uuid;
          lv1AnimateIdxs.value = [];
          await wait(60);
          asideListScroll();
        } else {
          const defaultChoose =
            props.list.find((o) => o.firstDefaultShowDept === '1') ||
            props.list[0];

          if (defaultChoose.children && defaultChoose.children.length) {
            await wait(20);
            itemClickLv1(defaultChoose);
            scrollView.value = 'lv1' + defaultChoose.uuid;
          }
        }
      }
    },

    {
      immediate: true,
    }
  );

  watch(
    () => scrollView.value,
    () => {
      setTimeout(() => {
        scrollView.value = '';
      }, 500);
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
    .lv1-text {
      width: fit-content;
    }

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

  .lv1-alone-animate {
    &:nth-child(2n) {
      animation: fadeInLeft 0.7s;
    }

    &:nth-child(2n + 1) {
      animation: fadeInRight 0.7s;
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
  .party_specialization2 {
    width: 120rpx;
    height: 36rpx;
    // position: relative;
    // top: 10rpx;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 9999;
  }
  .lv1-min-width {
    padding-right: 90rpx;
  }
</style>
