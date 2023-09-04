<template>
  <view class="g-page">
    <view class="g-container">233</view>

    <view class="g-footer">
      <button
        @click="goComplaint"
        class="btn btn-primary btn-plain btn-border flex1"
      >
        <text class="iconfont icon-kefu">&#xe6e2;</text>
        <text>我要反馈</text>
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { shallowRef } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import api from '@/service/api';

  const isComplete = shallowRef(false);

  const goComplaint = () => {
    uni.navigateTo({
      url: '/pagesC/serviceCenter/serviceComplaint',
    });
  };

  const getList = async () => {
    isComplete.value = false;

    await api.getComplainsList({}).finally(() => {
      isComplete.value;
    });
  };

  const init = async () => {
    getList();
  };

  onLoad(() => {
    init();
  });
</script>

<style lang="scss" scoped>
  .icon-kefu {
    font-size: 56rpx;
    line-height: 32rpx;
    margin-right: 8rpx;
  }
</style>
