<template>
  <view class="page">
    <scroll-view class="container" scroll-y>
      <service-List :list="list" />
    </scroll-view>

    <view class="footer">
      <view class="g-border-right">
        <view class="iconfont icon-kefu">&#xe6e2;</view>
        <view>
          <view class="title">咨询客服</view>
          <view class="desc">请在工作时间咨询</view>
        </view>
      </view>

      <view>
        <view class="iconfont icon-kefu">&#xe6b9;</view>
        <view>
          <view class="title">意见反馈</view>
          <view class="desc">我们会尽快给予回复</view>
        </view>
      </view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import api from '@/service/api';

  import serviceList from './components/serviceList.vue';

  const props = ref<{
    subType?: string;
  }>({});

  const list = ref<string[]>([]);

  const getLv = computed(() => !!props.value.subType);

  onLoad((q) => {
    if (q) {
      props.value = q;
    }

    init();
  });

  const getFirstList = async () => {
    const { result } = await api.getSubTypeList({});

    list.value = result;
  };

  const init = () => {
    if (getLv.value) {
    } else {
      getFirstList();
    }
  };
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--hr-neutral-color-1);

    .container {
      flex: 1;
      height: 1px;
    }

    .footer {
      display: flex;
      background-color: #fff;
      box-shadow: 16rpx 0 30rpx rgba($color: #000, $alpha: 0.06);
      font-size: var(--hr-font-size-xl);
      > view {
        flex: 1;
        padding: 24rpx 0;
        display: flex;
        justify-content: center;
        border-radius: 0;

        box-sizing: content-box;
        padding-bottom: 68rpx;

        &:after {
          border: none;
        }
      }

      .icon-kefu {
        font-size: 56rpx;
        color: var(--hr-neutral-color-10);
        margin-right: 8rpx;
      }

      .title {
        font-weight: 600;
      }
      .desc {
        font-size: 20rpx;
        color: var(--hr-neutral-color-7);
      }
    }
  }
</style>
