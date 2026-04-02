<template>
  <view v-if="list.length" class="flex gap-4 mb24">
    <g-login
      v-for="(item, i) in list"
      :key="item.id"
      @handler-next="useCommonTo(item)"
      :disabled="item.loginInterception === '0'"
    >
      <view
        :style="{
          background: colors[i % 3].bgColor,
        }"
        @tap="useCommonTo(item)"
        class="flex-1 relative"
      >
        <view class="item p24 relative z-1">
          <view class="flex">
            <view class="font-semibold mr12 text-no-wrap">
              {{ item.title }}
            </view>
            <view
              :class="{
                [`iconfont icon-size${i + 1}`]: true,
              }"
              :style="{
                color: colors[i % 3].iconColor,
              }"
              class="icon-arrow-c"
            >
              &#xe6ca;
            </view>
          </view>
          <view class="color-888 f24 text-no-wrap">
            {{ item.detail }}安全用药指南
          </view>
        </view>

        <view
          :class="{
            [`iconfont icon-size-back${i + 1}`]: true,
          }"
          :style="{
            color: colors[i % 3].borderColor,
          }"
          class="icon-bg"
        >
          &#xe6a5;
        </view>
      </view>
    </g-login>
  </view>
</template>

<script lang="ts" setup>
  import { useCommonTo } from '@/common/checkJump';
  import { ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      list: IRoute[];
    }>(),
    {
      list: () => [],
    }
  );

  const colors = ref([
    {
      borderColor: '#ffe2d3',
      iconColor: '#EBAB76',
      bgColor: '#fff8f3',
    },
    {
      borderColor: '#ffe8cc',
      iconColor: '#FFBE5D',
      bgColor: '#fff8ef',
    },
    {
      borderColor: '#FFE3E1',
      iconColor: '#C89C8C',
      bgColor: '#fff4f3',
    },
  ]);
</script>

<style lang="scss" scoped>
  .item {
    border: 2rpx solid var(--hr-brand-color-3);
    border-radius: 16rpx;

    .icon-arrow-c {
      font-size: var(--h-size-46);
      color: var(--hr-success-color-6);
      font-weight: 400;
    }
  }
  .icon-bg {
    font-size: 90rpx;
    font-weight: 400;
    position: absolute;
    right: 0;
    bottom: -6rpx;
  }
</style>
