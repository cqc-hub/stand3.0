<template>
  <view class="menu-list menu-style" :class="style1001054()">
    <view
      :class="{
        'pr0 pl0 pt0': isTabStyle1,
      }"
      class="menu-pannel-style"
    >
      <view class="relative menu-tabs-container">
        <homeMenuTabs
          v-model:value="tabIndex1"
          :tabs="props.list"
          @change="activeMenu"
          :itemWidth="100 / props.list.length + '%'"
          :itemMinWidth="getItemMinWidth()"
          :homeTabStyle="isTabStyle1"
          :fontStyle="homeTabStyle"
          field="typeName"
          pillsColor="#fff"
          bgColor="#fff0"
          color="#24314D"
          :activeColor="
            getSysCode() === '1001054'
              ? `var(--hr-brand-color-8)`
              : `var(--hr-brand-color-6)`
          "
          pillsBorderRadius="42rpx 42rpx 0 0"
          paddingItem="0"
          height="88"
          scroll
          :pills="isTabStyle1 ? '3' : '2'"
          :allBlod="false"
        />
      </view>
      <swiper
        :style="{
          height: height + 'px',
        }"
        class="swiper menu-swiper-style"
        :indicator-dots="false"
        :current="tabIndex1"
        @change="changeIndex"
        :duration="300"
      >
        <swiper-item v-for="(item, index) in props.list" :key="index">
          <view :id="`home-menu-${index}`">
            <homeGrid :list="item.functionList" @open-share="openShare" />
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script setup lang="ts">
  import {
    ref,
    onMounted,
    watch,
    getCurrentInstance,
    nextTick,
    computed,
  } from 'vue';
  import homeGrid from './homeGrid.vue';
  import homeMenuTabs from './homeMenuTabs.vue';
  import { GStores, wait } from '@/utils';
  import { getSysCode } from '@/common';

  const emits = defineEmits(['open-share']);

  let tabIndex1 = ref(0);
  const height = ref(0);
  const inst = getCurrentInstance();
  interface IhomeMenu {
    typeName: string;
    functionList: IRoute[];
  }
  const gStores = new GStores();

  const props = withDefaults(
    defineProps<{
      list: IhomeMenu[];
      tabIndex?: number;
      homeTabStyle?: '1';
    }>(),
    {
      list: () => [
        {
          typeName: '门诊就医',
          functionList: [
            {
              title: '门诊就医',
              url: '/xxx',
              iconfont: 'ico_sy_calendar1',
            },
          ],
        },
        {
          typeName: '住院助手',
          functionList: [
            {
              title: '住院助手',
              url: '/xxx',
              iconfont: 'ico_sy_calendar1',
            },
          ],
        },
        {
          typeName: '智慧医院',
          functionList: [
            {
              title: '智慧医院',
              url: '/xxx',
              iconfont: 'ico_sy_calendar1',
            },
          ],
        },
      ],
    }
  );

  const isTabStyle1 = computed(() => props.homeTabStyle === '1');

  onMounted(() => {
    props.tabIndex && (tabIndex1.value = props.tabIndex);
  });

  const style1001054 = () => {
    let className = '';
    if (getSysCode() === '1001054') {
      className = 'menu-list-1001054';
    }
    return className;
  };

  const activeMenu = (index) => {
    tabIndex1.value = index;
  };

  const changeIndex = (e) => {
    tabIndex1.value = e.detail.current;
    queryHeight();
  };

  const openShare = (item, type?) => {
    emits('open-share', item, type);
  };

  const queryHeight = () => {
    let query = uni.createSelectorQuery();
    // #ifndef MP-TOUTIAO
    query = query.in(inst);
    // #endif
    const view = query.select(`#home-menu-${tabIndex1.value}`);
    view
      .boundingClientRect((data) => {
        if (data) {
          // @ts-expect-error
          const { height: _height } = data;

          height.value = _height < 260 ? 260 : _height;
        }
      })
      .exec();
  };

  const getItemMinWidth = () => {
    const { sysCode } = gStores.globalStore;

    if (isTabStyle1.value) {
      return '180rpx';
    }

    switch (sysCode) {
      case '1001036':
        return '20rpx';

      default:
        return '180rpx';
    }
  };

  watch(
    () => props.list,
    async (v) => {
      await wait(666);
      nextTick(queryHeight);
    },
    {
      immediate: true,
    }
  );
</script>

<style scoped lang="scss">
  .menu-list {
    // background: var(--h-color-white);
    // border: 2rpx solid #f3f3f3;
    // box-shadow: 0px 8rpx 24rpx 0px rgba(0, 0, 0, 0.05);
    // border-radius: 16rpx;
    .swiper {
      height: 260px;
      swiper-item {
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
  .menu-style {
    width: 100vw;
    right: 32rpx;
    position: relative;
    background: linear-gradient(
      360deg,
      rgba(238, 243, 255, 0) 50%,
      var(--hr-brand-color-3-light) 100%
    );
    border-radius: 24rpx 0rpx 0rpx 24rpx;
    .menu-pannel-style {
      padding: 32rpx 32rpx 0 32rpx;

      .menu-tabs-container {
        &::after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 100%;
          height: 1px;
          background: #fff;
          pointer-events: none;
        }
      }
    }
    .menu-swiper-style {
      background: #fff;
      padding-top: 24rpx;
      //  border-radius: 16rpx;
    }
  }
  .menu-list-1001054 {
    background: linear-gradient(
      360deg,
      rgba(238, 243, 255, 0) 50%,
      var(--hr-success-color-1) 100%
    ) !important;
  }
</style>
