<template>
  <view class="login-center">
    <view @click="ttt" class="iconfont icon-camera">&#xe6be;</view>
    <scroll-view class="scroll-container" scroll-y>
      <ls-skeleton :skeleton="skeletonProps.skeleton" :loading="skeletonProps.loading">
        <view class="top-bg" />
        <personRecord />

        <view class="my-menu">
          <view v-if="menu1List.length" class="list">
            <view class="title">我的订单</view>
            <g-grid :list="menu1List" />
          </view>
          <view v-if="menu1List.length" class="list">
            <view class="title">我的服务</view>
            <homeGrid :list="menu2List"></homeGrid>
          </view>
          <view v-if="menu3List.length" class="list">
            <view class="title">我的工具</view>
            <homeGrid :list="menu3List"></homeGrid>
          </view>
        </view>
      </ls-skeleton>

      <view class="save-hight" />
    </scroll-view>

    <home-Tabbar />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, nextTick, onMounted } from 'vue';
  import { useUserStore, useMessageStore, useRouterStore } from '@/stores';
  import { onLoad } from '@dcloudio/uni-app';
  import { ServerStaticData, wait } from '@/utils';
  import { encryptDes, getSysCode, joinQuery } from '@/common';

  import personRecord from './componetns/personRecord.vue';
  import homeTabbar from './componetns/homeTabbar.vue';
  import homeGrid from './componetns/homeGrid.vue';

  //骨架屏配置
  const skeletonProps = {
    loading: true,
    skeleton: [
      'circle+line-sm*2',
      56,
      'card+card',
      24,
      'line-sm',
      'card+card+card+card',
      16,
      'line-sm',
      'card+card+card+card',
      16,
      'line-sm',
      'card+card+card+card'
    ]
  };

  interface TPageType extends ILoginBack {
    isWarningLogin?: '1';

    // 微信小程序必须显示写出来， 否则接收不到
    _p?: string;
    _url?: string;
    _query?: string;
    _type?: '1' | '2';
    _isOutLogin?: '1';
    _pageInfo?: '1' | '2';
  }

  const props = defineProps<TPageType>();
  const messageStore = useMessageStore();
  const routeStore = useRouterStore();

  const menu1List = ref([]); //我的订单
  const menu2List = ref([]); //我的服务
  const menu3List = ref([]); //我的工具

  onMounted(async () => {
    routeStore.receiveQuery(props);

    getHomeConfig();
    if (props.isWarningLogin) {
      messageStore.showMessage('未登录,请先登录', 1000);
    } else if (props._isOutLogin) {
      messageStore.showMessage('登录过期,请重新登录', 1000);
    }
  });
  //获取配置数据
  const getHomeConfig = async () => {
    skeletonProps.loading = true;
    const homeConfig = await ServerStaticData.getHomeConfig();
    if (homeConfig) {
      menu1List.value = homeConfig[5].functionList;
      menu2List.value = homeConfig[6].functionList;
      menu3List.value = homeConfig[7].functionList;
      skeletonProps.loading = false;
    }
  };

  const ttt = () => {
    uni.navigateTo({
      url: '/pagesA/MyRegistration/Register?_url=%2FpagesA%2FMyRegistration%2FselDepartment'
    });

    // uni.navigateTo({
    //   url: '/pages/piniaTest/piniaTest'
    //   // url: '/pagesC/cloudHospital/cloudHospital?path=https://testwechatnethos.eheren.com/static/nhs/'
    // });
    // uni.navigateTo({
    // 	url: '/pagesC/mixCheckResult/hsResult'
    // 	// url: '/pagesC/cloudHospital/cloudHospital?path=https://testwechatnethos.eheren.com/static/nhs/'
    // });
    // uni.navigateTo({
    // 	url: joinQuery('/pagesC/cloudHospital/cloudHospital', {
    // 		path: 'https://testwechatnethos.eheren.com/static/nhs/',
    // 		loginInterception: 1
    // 	})
    // });
  };
</script>

<style lang="scss" scoped>
  .login-center {
    background-color: var(--h-color-white);
    height: 100vh;
    position: relative;
    flex-direction: column;

    display: flex;

    .scroll-container {
      height: 1px;
      flex: 1;

      .save-hight {
        height: 20rpx;
        width: 1px;
      }
    }

    .top-bg {
      height: 500upx;
      width: 100%;
      box-shadow: 0 200upx 500upx 30upx #13b8ff32;
      position: absolute;
      top: -500upx;
      pointer-events: none;
    }
  }

  .my-menu {
    padding: 0 32rpx;
    margin-bottom: 188rpx;
    .list {
      background: var(--h-color-white);
      border: 1rpx solid var(--hr-neutral-color-2);
      border-radius: 16rpx;
      box-shadow: 0px 8rpx 24rpx 0px rgba(0, 0, 0, 0.05);
      padding-bottom: 12rpx;
      margin-bottom: 16rpx;

      .title {
        padding: 32rpx 32rpx 16rpx 32rpx;
        color: var(--hr-neutral-color-10);
        font-weight: var(--h-weight-2);
      }
    }
  }

  .icon-camera {
    position: relative;
    font-size: 40px;
    color: red;
    mask: linear-gradient(to bottom, #283237, transparent);
  }
</style>
