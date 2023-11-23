<template>
  <view class="g-page">
    <g-flag typeFg="452" isShowFg />
    <g-choose-pat @choose-pat="init" />
    <view class="pat-box">
      <view class="health-card">
        <view
          v-if="pageConfig.takeNumber1ElectronicGuideBtn === '1'"
          @click="goRecord"
          class="mr14 g-flex-rc-cc"
        >
          <view class="iconfont icon-resize">&#xe6fc;</view>
          <text class="color-111">电子导诊单</text>
        </view>

        <view
          v-if="pageConfig.takeNumber1QueueBtn === '1'"
          @click="goQueueNumber"
          class="g-flex-rc-cc"
        >
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
          <Number-List-Copy
            :list="list"
            :loading="isRefresh"
            @refresh-data="refreshData"
            @take-number="showTakeNumberDialog"
          />
        </view>

        <view v-else class="empty-list">
          <g-empty :current="1" noTransformY />
        </view>
      </view>
    </scroll-view>

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
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { apiAsync, generateUuid } from '@/utils';

  import {
    GStores,
    ServerStaticData,
    type TButtonConfig,
    type ISystemConfig,
    useTBanner,
    getLocation,
  } from '@/utils';
  import { type _TTakeNumberListItem } from './utils/takeNumber';

  import api from '@/service/api';

  import NumberListCopy from './components/NumberListCopy.vue';
  import QrPopup from './components/QrPopup.vue';
  import { deQueryForUrl } from '@/common';

  // api.bloodTestSignIn
  // api.signInPositionAnalysis

  const pageProps = ref(
    <
      {
        hosId?: string;
        signType: '1' | '2' | '3'; // 签到类型 1儿童采血叫号 2医技检查 3成人采血叫号
      }
    >{}
  );
  const pageConfig = ref(<ISystemConfig['order']>{});
  const gStores = new GStores();
  const isComplete = ref(false);
  const isRefresh = ref(false);
  const list = ref([] as _TTakeNumberListItem[]);
  const qrValue = ref('');
  const isShowQr = ref(false);

  const locationInfo = ref({
    latitude: '',
    longitude: '',
  });

  const fgTitle451 = ref('');
  const isFgShow451 = ref(false);

  let cacheItem: _TTakeNumberListItem;
  const showTakeNumberDialog = async (item: _TTakeNumberListItem) => {
    if (item.disabled) {
      return;
    }

    cacheItem = item;
    // isFgShow451.value = true;
    locationInfo.value = await getLocation(true);

    const { patientId } = gStores.userStore.patChoose;
    const {
      result: { status, promptMessage },
    } = await api.bloodTestSignIn({
      ...pageProps.value,
      ...locationInfo.value,
      signType: '1',
      patientId,
    });

    if (status) {
      item.disabled = true;
      item.status = true;
      await apiAsync(uni.showModal, {
        content: promptMessage || '取号成功',
        showCancel: false,
      });
    }
  };

  const takeNumber = async () => {
    isFgShow451.value = false;
  };

  const goRecord = () => {
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

  const refreshData = () => {
    if (isRefresh.value) {
      return;
    }

    isRefresh.value = true;
    init();
  };

  const getList = async () => {
    const { patientId } = gStores.userStore.patChoose;

    isComplete.value = false;
    if (!isRefresh.value) {
      list.value = [];
    }

    const { result } = await api
      .signInPositionAnalysis({
        ...pageProps.value,
        ...locationInfo.value,
        patientId,
      })
      .finally(() => {
        isComplete.value = true;

        setTimeout(() => {
          isRefresh.value = false;
        }, 1000);
      });

    const { signIn } = result;

    list.value = [
      {
        signIn,
        disabled: !signIn,
        uuid: generateUuid(),
        label: signIn ? '取号' : '不在取号范围',
        status: false,
      },
    ];
  };

  const getConfig = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('order');
  };

  const init = async () => {
    locationInfo.value = await getLocation(true);

    getList();
  };

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
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

  .reg-tip {
    max-height: 550rpx;
    width: calc(100% - 64rpx);
    margin-left: 32rpx;
  }
</style>
