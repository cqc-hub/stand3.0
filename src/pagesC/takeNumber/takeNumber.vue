<template>
  <view class="g-page">
    <g-flag typeFg="5" isShowFg />
    <g-choose-pat @choose-pat="init" />
    <view class="pat-box">
      <view class="health-card">
        <view v-if="!isBloodSign" @click="goRecord" class="mr14 g-flex-rc-cc">
          <view class="iconfont icon-resize">&#xe6fc;</view>
          <text class="color-111">挂号记录</text>
        </view>

        <view v-if="isShowQueueBtn" @click="goQueueNumber" class="g-flex-rc-cc">
          <image
            class="queue-icon mr14"
            :src="$global.BASE_IMG + 'stand3-take-number-queue-number.png'"
          />
          <text class="color-111">排队叫号</text>
        </view>

        <view
          v-if="!isOnlineSign && pageConfig.takeNumberOnlineBtn === '1'"
          @click="goTakeNumberOnline"
          class="g-flex-rc-cc"
        >
          <image
            class="queue-icon mr14"
            :src="$global.BASE_IMG + 'stand3-take-number-queue-number.png'"
          />
          <text class="color-111">在线签到</text>
        </view>

        <view
          v-if="pageConfig.takeNumber1ElectronicGuideBtn === '1'"
          @click="goElectronicGuide"
          class="mr14 g-flex-rc-cc"
        >
          <view class="iconfont icon-resize">&#xe6fc;</view>
          <text class="color-111">电子导诊单</text>
        </view>

        <view
          v-if="pageConfig.takeNumberGoPayBtn === '1'"
          @click="goPay"
          class="mr14 g-flex-rc-cc"
        >
          <view class="iconfont ico_pay queue-icon" />
          <text class="color-111">门诊缴费</text>
        </view>
      </view>
    </view>

    <scroll-view class="g-container" scroll-y>
      <view v-if="isComplete || isRefresh" class="content">
        <view v-if="list.length">
          <Number-List
            :list="list"
            :loading="isRefresh"
            :isTakeNumberAfterBtnForGoQueueNumber="
              isTakeNumberAfterBtnForGoQueueNumber
            "
            :isOnlineSign="isOnlineSign"
            @refresh-data="refreshData"
            @take-number="showTakeNumberDialog"
            @sign-in="signIn"
            @pay-page="goPayPage"
          />
        </view>

        <view v-else class="empty-list">
          <g-empty :current="1" noTransformY />
        </view>
      </view>
    </scroll-view>

    <xy-dialog
      title="授权提示"
      content="未获取到您的位置,请允许位置授权,以便判断您是否处于医院规定取号区域内"
      :show="isWxRequestQxDialogShow"
      :isShowCancel="false"
    >
      <template #confirmBtn>
        <view @click="requestWxQx">去授权</view>
      </template>
    </xy-dialog>

    <xy-dialog
      :title="fgTitle451"
      :show="isFgShow451"
      @confirmButton="takeNumber"
      @cancelButton="isFgShow451 = false"
      isMaskClick
      confirmText="立即取号"
      cancelText="暂不取号"
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag
          v-model:title="fgTitle451"
          isHideTitle
          isShowFgTip
          typeFg="451"
          aaa
        />
      </scroll-view>
    </xy-dialog>

    <xy-dialog
      :title="fgTitle453"
      :show="isFgShow453"
      :isShowCancel="false"
      @confirmButton="goPayPage"
      isMaskClick
      confirmText="立即缴费"
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag
          v-model:title="fgTitle453"
          isHideTitle
          isShowFgTip
          typeFg="453"
          aaa
        />
      </scroll-view>
    </xy-dialog>
    <!--
    <xy-dialog
      :title="fgTitle451"
      :show="isFgShow451"
      @confirmButton="takeNumber"
      @cancelButton="isFgShow451 = false"
      isMaskClick
      confirmText="立即取号"
      cancelText="暂不取号"
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag
          v-model:title="fgTitle451"
          isHideTitle
          isShowFgTip
          typeFg="451"
          aaa
        />
      </scroll-view>
    </xy-dialog> -->

    <Qr-Popup :qrValue="qrValue" v-model:show="isShowQr" />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { deQueryForUrl } from '@/common';
  import {
    GStores,
    ServerStaticData,
    type TButtonConfig,
    useTBanner,
    getLocation,
    ISystemConfig,
    apiAsync,
  } from '@/utils';
  import { type TTakeNumberListItem } from './utils/takeNumber';

  import api from '@/service/api';

  import NumberList from './components/NumberList.vue';
  import QrPopup from './components/QrPopup.vue';

  const gStores = new GStores();
  const pageConfig = ref(<ISystemConfig['order']>{});
  const isComplete = ref(false);
  const isRefresh = ref(false);
  const list = ref([] as TTakeNumberListItem[]);
  const isWxRequestQxDialogShow = ref(false);
  const qrValue = ref('');
  const isShowQr = ref(false);
  const isShowQueueBtn = ref(false);
  const isTakeNumberAfterBtnForGoQueueNumber = ref(false);
  const pageProps = ref(
    <
      {
        hosId?: string; // 采血取号 需要
        _type?: 'blood'; //区分普通取号和 濮阳采血取号
        type?: '0' | '1'; // 普通取号 区分为 0为门诊取号 1 为门诊签到
      }
    >{}
  );

  // 采血取号
  const isBloodSign = computed(() => pageProps.value._type === 'blood');
  // 在线签到
  const isOnlineSign = computed(
    () => !isBloodSign.value && pageProps.value.type === '1'
  );

  const locationInfo = ref({
    latitude: '',
    longitude: '',
  });

  const fgTitle451 = ref('');
  const isFgShow451 = ref(false);

  const fgTitle453 = ref('');
  const isFgShow453 = ref(false);

  let cacheItem: TTakeNumberListItem;
  const showTakeNumberDialog = (item: TTakeNumberListItem) => {
    cacheItem = item;
    isFgShow451.value = true;
  };

  const goPayPage = () => {
    isFgShow453.value = false;
    uni.navigateTo({
      url: '/pagesA/clinicPay/clinicPayDetail',
    });
  };

  const takeNumber = async () => {
    const { ampm, visitDate, visitId, hosId } = cacheItem;
    const { source } = gStores.globalStore.browser;
    const { patientId } = gStores.userStore.patChoose;
    const { type } = pageProps.value

    const args = {
      ampm,
      visitDate,
      visitId,
      source,
      patientId,
      hosId,
      type
    };
    isFgShow451.value = false;

    if (isBloodSign.value) {
      locationInfo.value = await getLocation(true);
      const {
        result: { status, promptMessage },
      } = await api.bloodTestSignIn({
        signType: '1', // 没用 但是 phs 做了非空校验
        ...pageProps.value,
        ...locationInfo.value,
        patientId,
      });

      if (status) {
        await apiAsync(uni.showModal, {
          content: promptMessage || '取号成功',
          showCancel: false,
        });
      }
    } else {
      await api.getCheckIn(args);
    }

    await getList();

    if (pageConfig.value.takeNumberConfirmAfter === '1') {
      isFgShow453.value = true;
    }
  };

  const signIn = async (item: TTakeNumberListItem) => {
    isFgShow451.value = false;
    if (isTakeNumberAfterBtnForGoQueueNumber.value) {
      // 排队叫号
      const queryNumber: TButtonConfig = {
        type: 'h5',
        isSelfH5: '1',
        path: 'pagesC/queueNumber/queueNumber',
        text: '排队叫号',
        addition: {
          herenId: 'herenId',
          patientId: 'aaa',
          token: 'token',
        },
      };

      useTBanner(queryNumber);
    } else {
      const { qrValue: q } = item;

      if (q) {
        qrValue.value = q;
        isShowQr.value = true;
      }
    }
  };

  const goRecord = () => {
    uni.navigateTo({
      url: '/pagesA/MyRegistration/MyRegistration',
    });
  };

  const goPay = () => {
    uni.navigateTo({
      url: '/pagesA/clinicPay/clinicPayDetail',
    });
  };

  const goElectronicGuide = () => {
    useTBanner({
      type: 'h5',
      path: 'pagesC/medicalAssistant/medicalAssistant',
      isSelfH5: '1',
      extraData: {
        sysCode: gStores.globalStore.sysCode,
      },

      addition: {
        token: 'token',
        herenId: 'herenId',
        patientId: 'patientId',
      },
    });
  };

  const goQueueNumber = () => {
    useTBanner({
      type: 'h5',
      path: 'pagesC/queueNumber/queueNumber',
      isSelfH5: '1',
      extraData: {
        sysCode: gStores.globalStore.sysCode,
      },

      addition: {
        token: 'token',
        herenId: 'herenId',
        patientId: 'patientId',
      },
    });
  };

  const goTakeNumberOnline = () => {
    uni.navigateTo({
      url: '/pagesC/takeNumber/takeNumber?type=1',
    });
  };

  const refreshData = () => {
    isRefresh.value = true;

    // init();
    uni.redirectTo({
      url: '/pagesC/takeNumber/takeNumber',
    });
  };

  const getList = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const { latitude, longitude } = locationInfo.value;
    const { type } = pageProps.value;

    isComplete.value = false;
    if (!isRefresh.value) {
      list.value = [];
    }

    const { result } = await api
      .getCheckInList({
        latitude,
        longitude,
        patientId,
        type,
      })
      .finally(() => {
        isComplete.value = true;
        isRefresh.value = false;
      });

    list.value = result || [];

    list.value.map((o) => {
      // o.signIn = false;
    });
  };

  const requestWxQx = async () => {
    isWxRequestQxDialogShow.value = false;

    await new Promise((resolve) => {
      uni.openSetting({
        complete: resolve,
      });
    });

    init();
  };

  const getConfig = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('order');
    const { takeNumberQueueBtn, takeNumberAfterBtnForGoQueueNumber } =
      pageConfig.value;

    isShowQueueBtn.value = takeNumberQueueBtn === '1' && !isOnlineSign.value;
    isTakeNumberAfterBtnForGoQueueNumber.value =
      takeNumberAfterBtnForGoQueueNumber === '1';
  };

  const init = async () => {
    locationInfo.value = await getLocation(true);

    getList();
  };

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));

    uni.setNavigationBarTitle({
      title: isOnlineSign.value ? '在线签到' : '门诊取号',
    });

    await getConfig();
    init();
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background: var(--hr-neutral-color-1);
  }

  .content {
    padding: 0 32rpx;
  }

  .pat-box {
    &::after,
    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 16rpx;
    }
  }

  .add-pat-box {
    margin: 0 32rpx;
    padding: 38rpx 0;
    background-color: var(--h-color-white);
    border-radius: 16rpx;
    color: var(--hr-brand-color-6);
    font-weight: var(--h-weight-2);
  }

  .health-card {
    margin: 0 32rpx;

    display: flex;

    > view {
      flex: 1;
      padding: 38rpx 0;
      background-color: var(--h-color-white);
      border-radius: 16rpx;
      color: var(--hr-brand-color-6);
      display: flex;
      justify-content: center;
      line-height: 40rpx;
    }
  }

  .mr14 {
    margin-right: 14rpx;
  }

  .icon-resize {
    font-size: var(--hr-font-size-xxl);
    margin-right: 10rpx;
    font-weight: 500;
    color: var(--hr-success-color-6);
  }

  .queue-icon {
    width: 50rpx;
    height: 50rpx;
  }
</style>
