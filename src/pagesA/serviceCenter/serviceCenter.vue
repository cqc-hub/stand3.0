<template>
  <view class="page">
    <scroll-view class="container" scroll-y>
      <view v-if="isComplete && list.length">
        <view class="title g-border-bottom text-ellipsis">
          {{ subType || '常见问题' }}
        </view>
        <service-List
          :list="list"
          :rowStyle="getRowStyle"
          @item-click="itemClick"
        />
      </view>

      <view v-else-if="isComplete && !list.length" class="empty-list">
        <g-empty :current="1" />
      </view>
    </scroll-view>

    <view class="footer" v-if="isShowFooter">
      <button
        open-type="contact"
        bindcontact="handleContact"
        class="s-btn g-border-right"
      >
        <view class="s-btn-container">
          <text class="iconfont icon-kefu">&#xe6e2;</text>
          <text class="title">咨询客服</text>
          <text class="desc">请在工作时间咨询</text>
        </view>
      </button>

      <button open-type="feedback" class="s-btn">
        <view class="s-btn-container">
          <text class="iconfont icon-kefu">&#xe6b9;</text>
          <text class="title">意见反馈</text>
          <text class="desc">我们会尽快给予回复</text>
        </view>
      </button>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import api from '@/service/api';

  import serviceList from './components/serviceList.vue';
  import { ISecondItemService } from './utils/index';

  const props = defineProps<{
    subType?: string;
  }>();
  const subType = props.subType && decodeURIComponent(props.subType!);
  const isComplete = ref(false);
  const list = ref<(string | ISecondItemService)[]>([]);
  const isWx = ref(false);

  // #ifdef MP-WEIXIN
  isWx.value = true;
  // #endif

  // true 二级
  const getLv = computed(() => !!props.subType);
  const getRowStyle = computed(() => {
    if (getLv.value) {
      return 'padding: 28rpx 32rpx 20rpx; color: var(--hr-neutral-color-9); font-size: var(--hr-font-size-base);';
    } else {
      return 'padding: 28rpx 32rpx 20rpx; color: var(--hr-neutral-color-10); font-size: var(--hr-font-size-xl);';
    }
  });
  const isShowFooter = computed(() => {
    if (!isWx.value) {
      return false;
    } else {
      return !getLv.value;
    }
  });

  onLoad((q) => {
    init();
  });

  const getFirstList = async () => {
    const { result } = await api.getSubTypeList({});

    list.value = result;
  };

  const getSecondList = async () => {
    const { result } = await api.getCmsListBySubType({
      subType,
    });

    list.value = result;
  };

  const init = async () => {
    if (getLv.value) {
      await getSecondList();
    } else {
      await getFirstList();
    }

    isComplete.value = true;
  };

  const itemClick = ({
    item,
  }: {
    item: { target: string | ISecondItemService };
  }) => {
    const { target } = item;

    if (typeof target === 'string') {
      uni.navigateTo({
        url: `/pagesA/serviceCenter/serviceCenter?subType=${encodeURIComponent(
          target
        )}`,
      });
    } else {
      const { id, informationLink } = target;

      if (informationLink) {
        uni.navigateTo({
          url: `/pagesA/webView/webView?https=${encodeURIComponent(
            informationLink
          )}`,
        });
      } else {
        uni.navigateTo({
          url: '/pagesA/serviceCenter/serviceCenterDetail?id=' + id,
        });
      }
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
      .title {
        background-color: #fff;

        padding: 24rpx 32rpx;
        padding-top: 40rpx;
        font-weight: 600;
        font-size: var(--hr-font-size-xxl);
      }
    }

    .footer {
      display: flex;
      background-color: #fff;
      box-shadow: 16rpx 0 30rpx rgba($color: #000, $alpha: 0.06);
      font-size: var(--hr-font-size-xl);

      .s-btn {
        flex: 1;
        display: flex !important;
        justify-content: center;
        align-items: center;
        border-radius: 0;
        // padding-top: 0;
        margin-top: 0;

        box-sizing: content-box;
        padding-bottom: 108rpx;
        position: relative;

        &:after {
          border: none;
        }

        .icon-kefu {
          font-size: 56rpx;
          color: var(--hr-neutral-color-10);
          margin-right: 8rpx;
          height: auto;
          position: absolute;

          // #ifdef MP-WEIXIN
          transform: translate(calc(-100% - 10rpx), -30rpx);
          // #endif

          // #ifndef MP-WEIXIN
          transform: translate(calc(-100% - 10rpx));
          // #endif
        }

        .s-btn-container {
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          transform: translateY(50%);
          margin-left: 50rpx;
        }
      }

      .title {
        font-weight: 600;
        line-height: 50rpx;
      }
      .desc {
        font-size: 20rpx;
        color: var(--hr-neutral-color-7);
        line-height: 30rpx;
      }
    }
  }

  .empty-list {
    transform: translateY(100%);
  }
</style>
