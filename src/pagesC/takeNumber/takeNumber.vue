<template>
  <view class="g-page">
    <g-flag v-if="isRender" :typeFg="isOnlineSign ? '1116' : '5'" isShowFg />
    <g-choose-pat @choose-pat="init" />
    <view v-if="headBtns.length" class="pat-box">
      <view class="health-card">
        <view
          v-for="btn in headBtns"
          :key="btn.text"
          @click="useTBanner(btn)"
          class="g-flex-rc-cc"
        >
          <view v-if="btn.icon">
            <image
              v-if="btn.icon.startsWith('http')"
              class="queue-icon mr14"
              :src="$global.BASE_IMG + 'stand3-take-number-queue-number.png'"
            />

            <view
              v-else
              :class="{
                [btn.icon]: 1,
              }"
              class="icon-font icon-resize"
            />
          </view>
          <text class="color-111">{{ btn.text }}</text>
        </view>
      </view>
    </view>

    <scroll-view class="g-container" scroll-y>
      <view class="safe-height" />
      <view v-if="isComplete || isRefresh" class="content">
        <view v-if="list.length">
          <Number-List
            :list="list"
            :loading="isRefresh"
            :isTakeNumberAfterBtnForGoQueueNumber="
              isTakeNumberAfterBtnForGoQueueNumber
            "
            :takeNumberWithPay="pageConfig?.isTakeNumerWithPay === '1'"
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
      content="未获取到您的位置,请允许位置授权,以便判断您是否处于医院规定区域内"
      :show="isWxRequestQxDialogShow"
      :isShowCancel="false"
    >
      <template #confirmBtn>
        <view @click="requestWxQx">去授权</view>
      </template>
    </xy-dialog>

    <xy-dialog
      v-if="isRender"
      :title="fgTitle451"
      :show="isFgShow451"
      :confirmText="isOnlineSign ? '立即签到' : '立即取号'"
      @confirmButton="takeNumber"
      @cancelButton="isFgShow451 = false"
      cancelText="取消"
      isMaskClick
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag
          v-model:title="fgTitle451"
          :typeFg="isOnlineSign ? '1117' : '451'"
          isHideTitle
          isShowFgTip
          aaa
        />
      </scroll-view>
    </xy-dialog>

    <xy-dialog
      v-if="isRender && confirmAfterBtn"
      :title="fgTitle453"
      :show="isFgShow453"
      :isShowCancel="false"
      @confirmButton="confirmAfter"
      :confirmText="confirmAfterBtn.text"
      isMaskClick
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag
          v-model:title="fgTitle453"
          isHideTitle
          isShowFgTip
          :typeFg="isOnlineSign ? '1118' : '453'"
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

    <Qr-Popup
      v-model:show="isShowQr"
      :qrValue="qrValue"
      :isShowRefreshQrCode="isShowRefreshQrCode"
      :patientId="gStores.userStore.patChoose.patientId"
    />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { deQueryForUrl, joinQuery } from '@/common';
  import {
    GStores,
    ServerStaticData,
    type TButtonConfig,
    useTBanner,
    getLocation,
    ISystemConfig,
    apiAsync,
    cacheUtil,
  } from '@/utils';
  import { type TTakeNumberListItem } from './utils/takeNumber';

  import api from '@/service/api';

  import NumberList from './components/NumberList.vue';
  import QrPopup from './components/QrPopup.vue';
  import globalGl from '@/config/global';

  const gStores = new GStores();
  const pageConfig = ref(<ISystemConfig['order']>{});
  const isComplete = ref(false);
  const isRefresh = ref(false);
  const isShowRefreshQrCode = ref(false);
  const list = ref([] as TTakeNumberListItem[]);
  const isWxRequestQxDialogShow = ref(false);
  const qrValue = ref('');
  const isShowQr = ref(false);
  const isShowQueueBtn = ref(false);
  const isTakeNumberAfterBtnForGoQueueNumber = ref(false);
  const confirmAfterBtn = ref<TButtonConfig>();
  const pageProps = ref(
    <
      {
        hosId?: string; // 采血取号 需要
        _type?: 'blood'; //区分普通取号和 濮阳采血取号
        type?: '0' | '1'; // 普通取号 区分为 0为门诊取号 1 为门诊签到
      }
    >{}
  );
  const headBtns = ref(<TButtonConfig[]>[]);

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
  const isRender = ref(false);

  let cacheItem: TTakeNumberListItem;
  const showTakeNumberDialog = (item: TTakeNumberListItem) => {
    if (pageConfig.value?.isTakeNumerWithPay === '1') {
      //缴费取号模式
      console.log('去支付');
      uni.navigateTo({
        url: '/pagesA/MyRegistration/takeNumberDetail',
      });
    } else {
      //普通模式
      cacheItem = item;
      isFgShow451.value = true;
    }
  };

  const goPayPage = () => {
    isFgShow453.value = false;
    uni.navigateTo({
      url: '/pagesA/clinicPay/clinicPayDetail',
    });
  };

  const confirmAfter = () => {
    isFgShow453.value = false;
    if (confirmAfterBtn.value) {
      useTBanner(confirmAfterBtn.value);
    }
  };

  const takeNumber = async () => {
    const { ampm, visitDate, visitId, hosId, extend } = cacheItem;
    const { source } = gStores.globalStore.browser;
    const { patientId } = gStores.userStore.patChoose;
    const { type } = pageProps.value;

    const args = {
      ampm,
      visitDate,
      visitId,
      source,
      patientId,
      hosId,
      extend,
      type,
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
          content: promptMessage || '成功',
          showCancel: false,
        });
      }
    } else {
      await api.getCheckIn(args).catch(async (err) => {
        if (err?.respCode === 999229) {
          const { title, content } = await gStores.getSysAppMore('1207');
          if (title) {
            const { confirm } = await new Promise<any>((closeCallBack) => {
              gStores.messageStore.showMessage(content, 0, {
                useDialog: true,
                dialogOpt: {
                  isShowCancel: true,
                  title,
                  cancelColor: '#333',
                  cancelText: '窗口/自助机取号',
                  confirmColor: '#333',
                  confirmText: '去充值',
                },
                closeCallBack,
              });
            });

            if (confirm) {
              const { cardNumber, patientName } = gStores.userStore.patChoose;

              uni.navigateTo({
                url: joinQuery('/pagesA/hospitalCare/paymentPage', {
                  hosId,
                  cardNumber,
                  patientName,
                  hospitalAccount: '12',
                  _url: '/pagesC/takeNumber/takeNumber',
                }),
              });
            }
          }
        } else if (err?.respCode === 884801) {
          if (pageConfig.value?.expireButRetrieve === '1') {
            const { confirm } = await new Promise<{ confirm: boolean }>((r) => {
              gStores.messageStore.showMessage(
                '您已过号，是否重新预约获取新序号?               ',
                0,
                {
                  useDialog: true,
                  dialogOpt: {
                    title: '温馨提示',
                    isShowCancel: true,
                    cancelText: '暂不预约',
                    confirmText: '重新预约',
                  },
                  closeCallBack: r,
                }
              );
            });

            if (confirm) {
              const { result } = await api.reappoint({ appointNo: visitId });
              console.log('result', result);
              if (result) {
                setTimeout(() => {
                  refreshData();
                }, 2000);
              }
            }
          }
        } else {
          gStores.messageStore.showMessage(
            err?.message || '系统繁忙,请稍后再试',
            3000
          );
        }

        throw new Error(err);
      });
    }

    await getList();

    // 普通取号
    if (
      pageConfig.value.takeNumberConfirmAfter === '1' &&
      !pageProps.value._type
    ) {
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
      // o.reportFlag = '4';
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
    const {
      takeNumberQueueBtn,
      takeNumber1ElectronicGuideBtn,
      takeNumberGoPayBtn,
      takeNumberAfterBtnForGoQueueNumber,
      takeNumberHeadBtns,
      onlineSignHeadBtns,
      takeNumberOnlineBtn,
      takeNumberConfirmAfter,
      onlineSignConfirmAfterBtn,
      takeNumberConfirmAfterBtn,
    } = pageConfig.value;
    headBtns.value = [];

    isShowQueueBtn.value = takeNumberQueueBtn === '1' && !isOnlineSign.value;
    isTakeNumberAfterBtnForGoQueueNumber.value =
      takeNumberAfterBtnForGoQueueNumber === '1';

    // headBtns.value =
    if (isOnlineSign.value) {
      headBtns.value = [...(onlineSignHeadBtns || [])];
      confirmAfterBtn.value = onlineSignConfirmAfterBtn;
    } else {
      headBtns.value = [
        {
          type: 'self',
          isSelfH5: '1',
          path: 'pagesA/MyRegistration/MyRegistration',
          icon: 'ico_sy_paper5',
          text: '挂号记录',
        },
      ];
      headBtns.value.push(...(takeNumberHeadBtns || []));
      if (takeNumberQueueBtn === '1') {
        headBtns.value.push({
          type: 'h5',
          isSelfH5: '1',
          path: 'pagesC/queueNumber/queueNumber',
          text: '排队叫号',
          icon: globalGl.BASE_IMG + 'stand3-take-number-queue-number.png',
          addition: {
            herenId: 'herenId',
            patientId: 'aaa',
            token: 'token',
          },
        });
      }

      if (takeNumber1ElectronicGuideBtn === '1') {
        headBtns.value.push({
          type: 'h5',
          isSelfH5: '1',
          path: 'pagesC/medicalAssistant/medicalAssistant',
          icon: globalGl.BASE_IMG + 'stand3-take-number-queue-number.png',
          text: '电子导诊单',
          addition: {
            patientId: '_patientId',
          },
        });
      }

      if (takeNumberOnlineBtn === '1') {
        headBtns.value.push({
          type: 'self',
          isSelfH5: '1',
          path: 'pagesC/takeNumber/takeNumber?type=1',
          icon: globalGl.BASE_IMG + 'stand3-take-number-queue-number.png',
          text: '在线签到',
        });
      }

      if (takeNumberGoPayBtn === '1') {
        headBtns.value.push({
          type: 'self',
          isSelfH5: '1',
          path: 'pagesA/clinicPay/clinicPayDetail',
          icon: globalGl.BASE_IMG + 'stand3-take-number-queue-number.png',
          text: '门诊缴费',
        });
      }

      confirmAfterBtn.value = takeNumberConfirmAfterBtn;

      if (!takeNumberConfirmAfterBtn && takeNumberConfirmAfter === '1') {
        confirmAfterBtn.value = {
          type: 'self',
          isSelfH5: '1',
          path: 'pagesA/clinicPay/clinicPayDetail',
          text: '立即缴费',
        };
      }
    }
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
    const { GlobalConfig } = await cacheUtil.getSystemConfig('GlobalConfig')();

    isShowRefreshQrCode.value = (GlobalConfig.refreshQrCode || []).includes(
      'pagesC/takeNumber/takeNumber'
    );

    await getConfig();
    isRender.value = true;
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
    flex-wrap: wrap;

    > view {
      flex: 1;
      min-width: 150rpx;
      padding: 28rpx 0;
      background-color: var(--h-color-white);
      border-radius: 16rpx;
      color: var(--hr-brand-color-6);
      display: flex;
      justify-content: center;
      line-height: 40rpx;

      &:not(:last-child) {
        margin-right: 14px;
      }
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
    width: 40rpx;
    height: 40rpx;
  }

  .queue-icon {
    width: 50rpx;
    height: 50rpx;
  }
</style>
