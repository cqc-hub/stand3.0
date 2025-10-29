<template>
  <view class="menu-list menu-style">
    <view class="menu-pannel-style">
      <homeMenuTabs
        v-model:value="tabIndex1"
        :tabs="props.list"
        @change="activeMenu"
        :itemWidth="100 / props.list.length + '%'"
        :itemMinWidth="'180rpx'"
        field="typeName"
        pillsColor="#fff"
        bgColor="#fff0"
        color="#24314D"
        activeColor="var(--hr-brand-color-6)"
        pillsBorderRadius="42rpx 42rpx 0 0"
        paddingItem="0"
        height="80"
        scroll
        pills
        :allBlod="false"
      />
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
    withDefaults,
    ref,
    onMounted,
    watch,
    getCurrentInstance,
    nextTick,
  } from 'vue';
  import homeGrid from './homeGrid.vue';
  import homeMenuTabs from './homeMenuTabs.vue';
  import { wait } from '@/utils';

  const emits = defineEmits(['open-share']);

  let tabIndex1 = ref(0);
  const height = ref(0);
  const inst = getCurrentInstance();
  interface IhomeMenu {
    typeName: string;
    functionList: IRoute[];
  }

  const props = withDefaults(
    defineProps<{
      list: IhomeMenu[];
      tabIndex?: number;
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

  onMounted(() => {
    props.tabIndex && (tabIndex1.value = props.tabIndex);
  });

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
    const view = uni
      .createSelectorQuery()
      .in(inst)
      .select(`#home-menu-${tabIndex1.value}`);
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
      var(--hr-brand-color-3-light) 99%
    );
    border-radius: 24rpx 0rpx 0rpx 24rpx;
    .menu-pannel-style {
      padding: 32rpx 32rpx 0 32rpx;
    }
    .menu-swiper-style {
      background: #fff;
      padding-top: 24rpx;
      //  border-radius: 16rpx;
    }
  }
</style>
