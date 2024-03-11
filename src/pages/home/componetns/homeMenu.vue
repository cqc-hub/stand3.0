<template>
  <view class="menu-list">
    <g-tabs
      v-model:value="tabIndex"
      :tabs="props.list"
      @change="activeMenu"
      field="typeName"
      pillsColor="#fff"
      bgColor="var(--hr-neutral-color-1)"
      pillsBorderRadius="8rpx 8rpx 0 0"
      paddingItem="0 33rpx"
      pills
      scroll
    />
    <swiper
      class="swiper"
      :indicator-dots="false"
      :current="tabIndex"
      @change="changeIndex"
      :duration="300"
    >
      <swiper-item v-for="(item, index) in props.list" :key="index">
        <homeGrid :list="item.functionList" @open-share="openShare"></homeGrid>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
  import { withDefaults, ref, onMounted } from 'vue';
  import homeGrid from './homeGrid.vue';

  const emits = defineEmits(['open-share']);

  let tabIndex = ref(0);
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
    props.tabIndex && (tabIndex.value = props.tabIndex);
  });

  const activeMenu = (index) => {
    tabIndex.value = index;
  };
  const changeIndex = (e) => {
    tabIndex.value = e.detail.current;
  };
  const openShare = (item) => {
    emits('open-share', item);
  };
</script>

<style scoped lang="scss">
  .menu-list {
    background: var(--h-color-white);
    border: 2rpx solid #f3f3f3;
    box-shadow: 0px 8rpx 24rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
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
</style>
