<template>
  <view class="">
    <view class="row">
      <view class="row-point">
        <view class="iconfont color-blue size-icon">&#xe6fd;</view>
      </view>

      <view class="row-content">
        <view class="row-content flex-between">
          <view class="text-ellipsis color-blue">
            <text class="mr16 title">{{ pointNow.title }}</text>
            <text class="f-xs">{{ pointNow.date }}</text>
          </view>

          <view
            @click="goDetail"
            class="flex-normal text-no-wrap f-xs color-blue"
          >
            <text>查看详情</text>
            <text class="iconfont size-icon">&#xe66b;</text>
          </view>
        </view>
        <view class="color-light-dark text-ellipsis">{{ pointNow.desc }}</view>
      </view>
    </view>

    <!-- ------ -->
    <view class="row">
      <view class="row-point">
        <view class="g-flex-rc-cc end-point-icon">
          <view class="out-document">收</view>
        </view>
      </view>

      <view class="row-content">
        <view class="row-content flex-between">
          <view class="text-ellipsis color-blue">
            <text class="mr16 title color-dark">{{ pointEnd.title }}</text>
          </view>
        </view>
        <view class="color-light-dark text-ellipsis">{{ pointEnd.desc }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      pointNow: {
        title: string;
        date: string;
        desc: string;
      };
      pointEnd: {
        title: string;
        desc: string;
      };
    }>(),
    {
      pointEnd: () => ({
        title: '浙江省杭州市滨江区西兴路128号',
        desc: '33',
      }),

      pointNow: () => ({
        title: '运输中',
        date: '09-21',
        desc: '浙江省杭州市滨江区已发出已发出已发浙江省杭州市滨江区已发出已发出已发出',
      }),
    }
  );

  const emits = defineEmits(['go-detail']);

  const goDetail = () => {
    emits('go-detail');
  };
</script>

<style lang="scss" scoped>
  .row {
    display: flex;
    align-items: center;
    align-items: flex-start;
    position: relative;

    .row-point {
      // width: 36rpx;
      // height: 36rpx;
      margin-right: 22rpx;
    }

    .row-content {
      flex: 1;
    }

    .end-point-icon {
      border-radius: 900rpx;
      background-color: var(--hr-brand-color-6);
      color: #fff;
      font-size: var(--hr-font-size-xxxs);
      padding: 10rpx;
      width: 18rpx;
      height: 18rpx;
      transform: translateX(8rpx);
      margin-right: 15rpx;
    }

    &:not(:last-child) {
      margin-bottom: 32rpx;

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1rpx;
        background-color: var(--hr-brand-color-6);
        transform: translate(25rpx, 35rpx);
      }
    }
  }

  .title {
    font-weight: 600;
  }

  .mr16 {
    margin-right: 16rpx;
  }

  .size-icon {
    font-size: 50rpx;
    display: inline-block;
  }

  .f-xs {
    font-size: var(--hr-font-size-xs);
  }
</style>
