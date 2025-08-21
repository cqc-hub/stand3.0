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
      <!-- 需求：底部按钮支持5个可配置功能 自研版（咨询客服  电话咨询  意见反馈 ） （腾讯微信）在线客服 意见反馈 -->
      <button
        v-if="pageConfig.isOpenMyService && isWx"
        class="s-btn g-border-right"
        @click="openServicesChat"
      >
        <view class="s-btn-container">
          <text class="iconfont icon-kefu">&#xe6a3;</text>
          <text class="title">咨询客服</text>
          <text class="desc">联系客服企微</text>
        </view>
      </button>

      <button
        v-if="pageConfig.isCustomFeedback === '1'"
        @click="feedbackClick"
        class="s-btn"
      >
        <view class="s-btn-container">
          <text class="iconfont icon-kefu">&#xe6b9;</text>
          <text class="title">意见反馈</text>
          <text class="desc">在线投诉建议</text>
        </view>
      </button>

      <!-- <contact-button
        tnt-inst-id="V1a_a38d"
        scene="SCE01319285"
        size="50px"
      /> -->
      <!-- 微信没配置默认展示 -->
      <button
        v-if="isWx && pageConfig.isTxService"
        open-type="contact"
        bindcontact="handleContact"
        class="s-btn g-border-right"
      >
        <view class="s-btn-container">
          <text class="iconfont icon-kefu">&#xe6e2;</text>
          <text class="title">在线客服</text>
          <text class="desc">仅供软件咨询</text>
        </view>
      </button>
      <button
        v-if="isWx && pageConfig.isTxFeedback"
        open-type="feedback"
        class="s-btn"
      >
        <view class="s-btn-container">
          <text class="iconfont icon-kefu">&#xe6b9;</text>
          <text class="title">意见反馈</text>
          <text class="desc">在线投诉建议</text>
        </view>
      </button>
      <button
        v-if="pageConfig.isOpenPhone"
        class="s-btn g-border-right"
        @click="makePhone"
      >
        <view class="s-btn-container">
          <text class="iconfont icon-kefu">&#xe66a;</text>
          <text class="title">拨打电话</text>
          <text class="desc">热线电话咨询</text>
        </view>
      </button>
      <template v-if="pageConfig?.customBtn">
        <button
          v-for="(item, index) in pageConfig?.customBtn"
          :key="`customBut${index}`"
          class="s-btn g-border-right"
          @click="useTBanner(item.config)"
        >
          <view class="s-btn-container">
            <text
              class="iconfont icon-font icon-kefu custom-icon"
              :class="item.icon ?? ''"
            />
            <text class="title">{{ item.label }}</text>
            <text class="desc">{{ item.subLabel }}</text>
          </view>
        </button>
      </template>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { ISecondItemService } from './utils/index';
  import {
    GStores,
    type ISystemConfig,
    ServerStaticData,
    wait,
    useTBanner,
    apiAsync,
  } from '@/utils';
  import api from '@/service/api';

  import serviceList from './components/serviceList.vue';

  const props = defineProps<{
    subType?: string;
  }>();
  const gStores = new GStores();
  const pageConfig = ref(<ISystemConfig['RestOfConfig']>{});
  console.log('pageConfig', pageConfig);
  const subType = props.subType && decodeURIComponent(props.subType!);
  const isComplete = ref(false);
  const list = ref<(string | ISecondItemService)[]>([]);
  const isWx = ref(false);
  const homeH5SharePopupRef = ref('' as any);
  // #ifdef MP-WEIXIN
  isWx.value = true;
  // #endif

  // true 二级页面
  const getLv = computed(() => !!props.subType);
  const getRowStyle = computed(() => {
    if (getLv.value) {
      return 'padding: 28rpx 32rpx 20rpx; color: var(--hr-neutral-color-9); font-size: var(--hr-font-size-base);';
    } else {
      return 'padding: 28rpx 32rpx 20rpx; color: var(--hr-neutral-color-10); font-size: var(--hr-font-size-xl);';
    }
  });

  // 此页面存在多层, 只在第一层时候展示底部按钮
  const isShowFooter = computed(() => {
    return !getLv.value;
  });

  onLoad((q) => {
    init();
  });

  const getFirstList = async () => {
    const { result } = await api.getSubTypeList({});

    list.value = result;
  };

  const getSecondList = async () => {
    const actionApi =
      gStores.globalStore.sysCode === '1001035'
        ? api.getCmsListByWordSearch
        : api.getCmsListBySubType;
    const { result } = await actionApi({
      subType,
      searchContent: subType,
    });

    list.value = result;
  };

  const getConfig = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('RestOfConfig');
    if (Object.keys(pageConfig.value).length === 0) {
      pageConfig.value = {
        isTxService: '1',
        isTxFeedback: '1',
      };
    }
  };

  const init = async () => {
    await getConfig();
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

  const feedbackClick = () => {
    uni.navigateTo({
      url: '/pagesC/serviceCenter/serviceCenter',
    });
  };

  const openServicesChat = () => {
    wx.openCustomerServiceChat({
      extInfo: { url: pageConfig.value.isOpenMyService?.extInfo },
      corpId: pageConfig.value.isOpenMyService?.corpId,
      complete(res) {
        console.log('打开企业微信', res);
      },
    });
  };
  const makePhone = () => {
    uni.makePhoneCall({
      phoneNumber: pageConfig.value.isOpenPhone!,
      fail(res) {
        console.warn('拨打电话失败原因', res);
      },
    });
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
        .custom-icon {
          height: 56rpx !important;
          width: 56rpx;
          top: 34rpx;
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
        font-size: 24rpx;
        color: var(--hr-neutral-color-7);
        line-height: 30rpx;
      }
    }
  }

  .empty-list {
    transform: translateY(100%);
  }
</style>
