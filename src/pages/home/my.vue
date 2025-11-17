<template>
  <view
    class="g-page"
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
  >
    <scroll-view class="g-container" scroll-y>
      <ls-skeleton
        :skeleton="skeletonProps.skeleton"
        :loading="viewerStore.loading"
      >
        <view class="top-bg" />
        <personRecord />

        <view class="my-menu" v-if="!gStores.globalStore.modeOld">
          <view v-if="viewerStore.myMenu1List?.length" class="list g-fade-in">
            <view class="title">我的订单</view>
            <homeGrid
              :list="viewerStore.myMenu1List"
              @open-share="openShare"
            ></homeGrid>
          </view> 
          <view v-if="viewerStore.myMenu2List?.length" class="list g-fade-in">
            <view class="title">我的服务</view>
            <homeGrid
              :list="viewerStore.myMenu2List"
              @open-share="openShare"
            ></homeGrid>
          </view>
          <view v-if="viewerStore.myMenu3List?.length" class="list g-fade-in">
            <view class="title">我的工具</view>
            <homeGrid
              :list="viewerStore.myMenu3List"
              @open-share="openShare"
            ></homeGrid>
          </view>
        </view>
        <view class="my-menu old" v-if="gStores.globalStore.modeOld">
          <homeGrid :list="viewerStore.myMenu1List" :type="3"></homeGrid>
          <view class="isCloseOld flex-normal" @tap="openModeOld">
            <view class="iconfont icon-size">&#xe700;</view>
            关闭长辈模式
          </view>
        </view>

        <!-- 个人中心悬浮球 -->
        <drag-button
          v-if="viewerStore.myBallList && viewerStore.myBallList.length === 1"
          :right="1"
          :edge="100"
          zid="33"
          @btnClick="useCommonTo(viewerStore.myBallList[0])"
          isDock
          scrollY
        >
          <view class="auto-person g-fade-in">
            <text v-if="viewerStore.myBallList[0].detail">
              {{ viewerStore.myBallList[0].detail }}
            </text>
            <image :src="viewerStore.myBallList[0].iconfont"></image>
          </view>
        </drag-button>
      </ls-skeleton>

      <view class="safe-height" />
    </scroll-view>

    <homePopup ref="refOldDialog" />
    <homeH5SharePopup
      ref="homeH5SharePopupRef"
      :configData="h5QrCodeData || undefined"
      @close-pop-click="closePopClick"
    />
    <home-Tabbar :systemModeOld="gStores.globalStore.modeOld" />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useMessageStore, useRouterStore } from '@/stores';
  import { useViewerStore } from '@/stores/modules/viewer';

  import { onLoad, onShareTimeline } from '@dcloudio/uni-app';
  import { GStores, LoginUtils, wait } from '@/utils';
  import { joinQueryForUrl } from '@/common';
  import { beforeEach } from '@/router/index';
  import global from '@/config/global';

  import personRecord from './componetns/personRecord.vue';
  import homeTabbar from './componetns/homeTabbar.vue';
  import homeGrid from './componetns/homeGrid.vue';
  import homePopup from './componetns/homePopup.vue';
  import homeH5SharePopup from './componetns/homeH5SharePopup.vue';
  import { useCommonTo } from '@/common/checkJump';
  import api from '@/service/api';
  import { getLangLabel } from '@/config/lang';

  const homeH5SharePopupRef = ref('' as any);
  const h5QrCodeData = ref({});
  const viewerStore = useViewerStore();
  const clickShareItem = ref<any>({});

  //骨架屏配置
  const skeletonProps = ref({
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
      'card+card+card+card',
    ],
  });

  interface TPageType extends /* @vue-ignore */ ILoginBack {
    isWarningLogin?: '1';

    // 微信小程序必须显示写出来， 否则接收不到
    _p?: string;
    _url?: string;
    _query?: string;
    _type?: '1' | '2';
    _isOutLogin?: '1';
    _pageInfo?: '1' | '2';
    setOutLogin?: '1';
  }

  const props = defineProps<TPageType>();
  const messageStore = useMessageStore();
  const routeStore = useRouterStore();
  const gStores = new GStores();
  const refOldDialog = ref();

  // 互联网医院和第三方微信小程序（携带登录信息）h5直接跳转scan页面
  const dealHosNet = async (opt: {
    myhosType: '0' | '1';
    query: any;
    returnUrl: string;
    myEnvir: string;
  }) => {
    /**
     * myhosType  '0' 需要登录  '1' 需要就诊人
     * query: '{}'
     * returnUrl  'pages/v3/collect/collectList'
     * myEnvir  'hosnet'  互联网医院  'thirdmini'  第三方微信小程序
     */

    let { myhosType, returnUrl, query, myEnvir } = opt;

    if (myhosType === '0') {
      new LoginUtils().outLogin({
        isHideMessage: true,
      });
    }

    query = (query && JSON.parse(query)) || {};
    let fullUrl = '';

    if (myEnvir === 'thirdmini') {
      fullUrl = joinQueryForUrl('/pagesC/openMiniProgram/openMiniProgram', {
        ...query,
        _type: '2',
      });
    } else if (myEnvir === 'hosnet') {
      fullUrl = joinQueryForUrl('/pagesC/cloudHospital/cloudHospital', {
        _url: encodeURIComponent(joinQueryForUrl(returnUrl, query)),
      });
    }
    await wait(120);
    await beforeEach({
      url: fullUrl,
      _isLogin: myhosType === '0',
      _isPatient: myhosType === '1',
    });
  };

  onLoad((opt) => {
    console.log('获取到参数--my', opt);
    if (!viewerStore.version) {
      viewerStore.init();
    }
    uni.hideLoading();
    if (gStores.globalStore.ev === 'wx') {
      wx.showShareMenu({
        // 要求小程序返回分享目标信息
        withShareTicket: true,
      });
    }

    uni.setNavigationBarTitle({
      title: getLangLabel('home-tabbar:我的'),
    });

    if (opt) {
      const { myEnvir } = opt;

      if (
        (myEnvir && myEnvir === 'hosnet') ||
        myEnvir === 'thirdmini'
        // myEnvir === 'commonH5'
      ) {
        dealHosNet(<any>opt);
      }
    }
  });

  if (gStores.globalStore.ev === 'wx') {
    //分享到朋友圈
    onShareTimeline(() => {
      return {
        title: global.systemInfo.name,
        query: '',
      };
    });
  }
  onMounted(() => {
    routeStore.receiveQuery(props);
    if (props.setOutLogin === '1') {
      new LoginUtils().outLogin({
        isHideMessage: true,
      });
    }

    if (props.isWarningLogin) {
      messageStore.showMessage('未登录,请先登录', 1000);
    } else if (props._isOutLogin) {
      messageStore.showMessage('登录过期,请重新登录', 1000);
    }
  });

  const openModeOld = () => {
    if (refOldDialog.value) {
      refOldDialog.value.show();
    }
  };

  //打开关注框
  const openShare = (item, type?) => {
    if (type === 'attention') {
      h5QrCodeData.value = item.query && JSON.parse(item.query);
      clickShareItem.value = item;
    } else {
      h5QrCodeData.value = item;
    }
    homeH5SharePopupRef.value.show();
  };

  const closePopClick = () => {
    const query = clickShareItem.value.query;
    if (query && JSON.parse(query).attention === '1') {
      setTimeout(() => {
        useCommonTo(clickShareItem.value);
      }, 500);
    }
  };
</script>

<style lang="scss" scoped>
  .g-page {
    --h-m-main-c: var(--hr-brand-color-2);

    &.system-style-medical {
      --h-m-main-c: #edd3c7;
    }
  }
  .top-bg {
    height: 500upx;
    width: 100%;
    position: absolute;
    pointer-events: none;
    z-index: 1;

    background:
      linear-gradient(
        160deg,
        var(--hr-brand-color-6-light),
        var(--hr-brand-color-6-light),
        rgba(255, 0, 0, 0) 50%
      ),
      linear-gradient(
        -180deg,
        var(--hr-brand-color-3-light),
        var(--hr-brand-color-3-light),
        rgba(255, 255, 255, 0) 50%
      );

    // background: linear-gradient(160deg, #13b8ff2a, #13b8ff2a, rgba(255, 0, 0, 0) 50%),
    //   linear-gradient(-160deg, #c1d4ff97, #c1d4ff59, rgba(0, 255, 0, 0) 50%);
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
  .old {
    background-color: #fff;
    padding: 32rpx;
  }

  .isCloseOld {
    width: 384rpx;
    color: #444;
    padding: 24rpx 0 22rpx;
    background: #ffffff;
    border: 2rpx solid #cccccc;
    border-radius: 50px;
    margin: 40rpx auto;
    justify-content: center;
    font-size: 32rpx;
    .icon-size {
      font-size: 42rpx;
    }
  }

  .auto-person {
    position: relative;
    z-index: 999;
    text {
      position: absolute;
      bottom: 9px;
      color: #fff;
      font-size: 24rpx;
      left: 23rpx;
      z-index: 999;
    }
    image {
      width: 140rpx;
      height: 148rpx;
    }
  }
</style>
