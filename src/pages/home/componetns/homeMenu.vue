<template>
  <view class="menu-list">
    <view class="menu-tap">
      <text
        v-for="(item, index) in props.list"
        :class="{ active: index == tabIndex }"
        @tap="activeMenu(index)"
        :key="index"
      >
        {{ item.typeName }}
      </text>
    </view>
    <swiper
      class="swiper"
      :indicator-dots="false"
      :current="tabIndex"
      @change="changeIndex"
      :duration="300"
    >
      <swiper-item v-for="(item, index) in props.list" :key="index">
        <homeGrid :list="item.functionList" @open-share="openShare" ></homeGrid>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import { withDefaults, ref } from "vue";
import homeGrid from "./homeGrid.vue";

const emits = defineEmits(['open-share']);

let tabIndex = ref(0);
interface IhomeMenu {
  typeName: string;
  functionList: IRoute[];
}
const props = withDefaults(
  defineProps<{
    list: IhomeMenu[];
  }>(),
  {
    list: () => [
      {
        typeName: "门诊就医",
        functionList: [
          {
            title: "门诊就医",
            url: "/xxx",
            iconfont: "ico_sy_calendar1",
          },
        ],
      },
      {
        typeName: "住院助手",
        functionList: [
          {
            title: "住院助手",
            url: "/xxx",
            iconfont: "ico_sy_calendar1",
          },
        ],
      },
      {
        typeName: "智慧医院",
        functionList: [
          {
            title: "智慧医院",
            url: "/xxx",
            iconfont: "ico_sy_calendar1",
          },
        ],
      },
    ],
  }
);
const activeMenu = (index) => {
  tabIndex.value = index;
};
const changeIndex = (e) => {
  tabIndex.value = e.detail.current;
};
const openShare =(item)=>{
  console.log(1111,'我看看',item)
  emits('open-share',item)
}
</script>

<style scoped lang="scss">
.menu-list {
  background: var(--h-color-white);
  border: 2rpx solid #f3f3f3;
  box-shadow: 0px 8rpx 24rpx 0px rgba(0, 0, 0, 0.05);
  border-radius: 16rpx;
  .menu-tap {
    height: 88rpx;
    background: var(--hr-neutral-color-1);
    border-radius: 16rpx 16rpx 0px 0px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    overflow-x: scroll;
    margin-bottom: 24rpx;
    &::-webkit-scrollbar {
      display: none;
    }
    text {
      display: inline-block;
      font-size: var(--hr-font-size-base);
      width: 192rpx;
      line-height: 88rpx;
      color: var(--hr-neutral-color-7);
      font-weight: var(--h-weight-2);
      text-align: center;
    }
    .active {
      color: var(--hr-neutral-color-10);
      background: var(--h-color-white);
      border: 2rpx solid #f3f3f3;
      // padding-top: 8rpx;
      position: relative;
      // top: -8rpx;
      animation: pulse;
      animation-duration: 1s;
    }
  }
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
