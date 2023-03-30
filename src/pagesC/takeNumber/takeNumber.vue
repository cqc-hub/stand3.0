<template>
  <view class="g-page">
    <g-flag typeFg="5" isShowFg />
    <g-choose-pat @choose-pat="init" />
    <view class="pat-box">
      <view class="health-card">
        <view @click="goRecord" class="mr14 g-flex-rc-cc">
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
            @refresh-data="refreshData"
            @take-number="showTakeNumberDialog"
            @sign-in="signIn"
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

    <Qr-Popup :qrValue="qrValue" v-model:show="isShowQr" />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import {
    GStores,
    ServerStaticData,
    type TButtonConfig,
    useTBanner,
  } from '@/utils';
  import { type TTakeNumberListItem } from './utils/takeNumber';

  import api from '@/service/api';

  import NumberList from './components/NumberList.vue';
  import QrPopup from './components/QrPopup.vue';

  const gStores = new GStores();
  const isComplete = ref(false);
  const isRefresh = ref(false);
  const list = ref([] as TTakeNumberListItem[]);
  const isWxRequestQxDialogShow = ref(false);
  const qrValue = ref('');
  const isShowQr = ref(false);
  const isShowQueueBtn = ref(false);
  const isTakeNumberAfterBtnForGoQueueNumber = ref(false);

  const locationInfo = ref({
    latitude: '',
    longitude: '',
  });

  const fgTitle451 = ref('');
  const isFgShow451 = ref(false);

  let cacheItem: TTakeNumberListItem;
  const showTakeNumberDialog = (item: TTakeNumberListItem) => {
    cacheItem = item;
    isFgShow451.value = true;
  };

  const takeNumber = async () => {
    const { ampm, visitDate, visitId, hosId } = cacheItem;
    const { source } = gStores.globalStore.browser;
    const { patientId } = gStores.userStore.patChoose;

    const args = {
      ampm,
      visitDate,
      visitId,
      source,
      patientId,
      hosId,
    };

    await api.getCheckIn(args).finally(() => {
      isFgShow451.value = false;
    });
    await getList();
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

    isComplete.value = false;
    if (!isRefresh.value) {
      list.value = [];
    }

    const { result } = await api
      .getCheckInList({
        latitude,
        longitude,
        patientId,
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

  const getLocation = async (compel = false) => {
    let isAuth = false;
    await new Promise((resolve) =>
      uni.getLocation({
        complete: resolve,
        success(e) {
          locationInfo.value = e as any;
          isAuth = true;
        },
      })
    );

    if (!isAuth) {
      await new Promise((resolve, reject) => {
        uni.getSetting({
          async success({ authSetting }) {
            const qx = authSetting['scope.userLocation'];
            if (!qx) {
              setTimeout(() => {
                isWxRequestQxDialogShow.value = true;
              }, 500);
              reject('未授权 Location');
            } else {
              resolve(void 0);
            }
          },
        });
      });
    }
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

  const getConfig = async () => {};

  const init = async () => {
    await getLocation();

    getList();
  };

  onLoad(async () => {
    const { takeNumberQueueBtn, takeNumberAfterBtnForGoQueueNumber } =
      await ServerStaticData.getSystemConfig('order');

    isShowQueueBtn.value = takeNumberQueueBtn === '1';
    isTakeNumberAfterBtnForGoQueueNumber.value =
      takeNumberAfterBtnForGoQueueNumber === '1';
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

  .reg-tip {
    max-height: 550rpx;
    width: calc(100% - 64rpx);
    margin-left: 32rpx;
  }
</style>
