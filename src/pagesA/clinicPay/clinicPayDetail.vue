<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <g-flag isShowFg typeFg="15" />
    <g-tbanner :config="pageConfig.bannerPay" />
    <g-choose-pat
      v-if="!pageProps.params && isShowPatComponent"
      @choose-pat="patChange"
    />
    <g-selhos
      v-if="pageConfig.isListToggleHos === '1'"
      v-model:hosId="hosId"
      :autoGetData="false"
      @change="getListData(true)"
      ref="selHosRef"
    />
    <view class="g-border-bottom">
      <g-tabs
        v-model:value="tabCurrent"
        :tabs="tabField"
        :scroll="false"
        @change="tabChange"
        field="label"
        style="width: 100%"
      />
    </view>

    <swiper
      :current="tabCurrent"
      :duration="300"
      @change="({ detail: { current } }) => tabChange(current)"
      class="g-container"
    >
      <swiper-item>
        <scroll-view scroll-y class="swiper-item uni-bg-red">
          <block v-if="isPayListRequestComplete && unPayList.length">
            <Clinic-Pay-Detail-List
              :list="unPayList"
              @click-item="goPayDetail"
              @sel-item="selPayListItem"
              :selUnPayList="selUnPayList"
              :isListShowClinicType="isListShowClinicType"
              :isHidePrice="isWaitPayListHidePrice"
              :systemModeOld="gStores.globalStore.modeOld"
              isCheck
            />
          </block>

          <view class="empty-list" v-else-if="isPayListRequestComplete">
            <g-empty :current="1" />
          </view>
        </scroll-view>
      </swiper-item>

      <swiper-item>
        <scroll-view scroll-y class="swiper-item uni-bg-red">
          <block v-if="isPayListRequestComplete && payedList.length">
            <Clinic-Pay-Detail-List
              :list="payedList"
              :systemModeOld="gStores.globalStore.modeOld"
              @click-item="goPayDetail"
            />
          </block>

          <view class="empty-list" v-else-if="isPayListRequestComplete">
            <g-empty :current="1" />
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>

    <view class="g-footer" v-if="tabCurrent === 0 && unPayList.length">
      <view
        v-if="isShowSelectAll"
        @click="chooseAll"
        class="footer-check flex-normal"
      >
        <view
          :class="{
            'color-blue': isSelectAll,
          }"
          class="iconfont"
        >
          {{ isSelectAll ? '&#xe6d0;' : '&#xe6ce;' }}
        </view>
        <view>全选</view>
      </view>

      <view
        v-if="!isWaitPayListHidePrice"
        :class="{
          'f-right': !isShowSelectAll,
        }"
        class="flex1 flex-normal count-money"
      >
        <text class="color-444 f28 mr8">合计</text>
        <text class="f36 g-bold color-error">{{ totalCost }}元</text>
      </view>
      <!-- @click="handlerPay" -->
      <button
        :class="{
          'btn-disabled': !selUnPayList.length,
          flex1: isWaitPayListHidePrice,
        }"
        class="btn g-border btn-warning pay-btn"
        @click="handlerPay"
      >
        缴费
      </button>
    </view>

    <view
      class="g-footer"
      v-else-if="pageConfig.payedFooterBtn && tabCurrent === 1"
    >
      <button
        @click="useTBanner(pageConfig.payedFooterBtn!)"
        class="btn btn-primary"
      >
        {{ pageConfig.payedFooterBtn.text }}
      </button>
    </view>

    <g-message />

    <Order-Reg-Confirm
      v-if="pageConfig.confirmPayFg"
      :title="confirmFgTitle"
      @confirm="getPay"
      height="50vh"
      confirmText="确定"
      cannerText="取消"
      headerIcon=""
      ref="regDialogConfirm"
      isShowCloseIcon
      footerBtnIsometric
    >
      <view>
        <g-flag
          v-model:title="confirmFgTitle"
          :typeFg="pageConfig.confirmPayFg!"
          isShowFgTip
          isHideTitle
          aaa
        />
      </view>
    </Order-Reg-Confirm>

    <Order-Reg-Confirm
      :title="'温馨提示'"
      @confirm="goDrugDelivery"
      height="40vh"
      confirmText="确定"
      cannerText="取消"
      headerIcon=""
      ref="regDialogConfirmExpress"
      isShowCloseIcon
      footerBtnIsometric
    >
      <view class="color-444 f32">
        已缴费项目中含有支持快递配送的药品，立即前往药品配送设置取药方式。
      </view>
    </Order-Reg-Confirm>

    <Wx-Pay-Money-Medical-Popup ref="wxPryMoneyMedicalDialog" />

    <g-pay
      :list="refPayList"
      :autoPayArg="payArg"
      @pay-success="payAfter"
      @pay-click="getPayInfo"
      autoInOne
      ref="refPay"
    >
      <view
        v-if="getIsMedicalModePlugin() && pageConfig.confirmPayFg"
        class="p32"
      >
        <g-flag
          v-model:title="confirmFgTitle"
          :typeFg="pageConfig.confirmPayFg!"
          isShowFgTip
          isHideTitle
          aaa
        />
      </view>
    </g-pay>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';

  import {
    usePayPage,
    getIsMedicalModePlugin,
    getQxMedicalNation,
  } from './utils/clinicPayDetail';
  import { useTBanner, wait, debounce } from '@/utils';
  import { deQueryForUrl, setLocalStorage, getLocalStorage } from '@/common';
  import { encryptForPage, decryptForPage } from '@/common/des';
  import { beforeEach } from '@/router';

  import globalGl from '@/config/global';

  import ClinicPayDetailList from './components/ClinicPayDetailList.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import WxPayMoneyMedicalPopup from './components/WxPayMoneyMedicalPopup.vue';

  const {
    pageProps,
    tabCurrent,
    tabField,
    tabChange,
    unPayList,
    payedList,
    goPayDetail,
    selPayListItem,
    getListData,
    isPayListRequestComplete,
    pageConfig,
    getSysConfig,
    regDialogConfirm,
    handlerPay,
    confirmFgTitle,
    getPay,
    refPay,
    refPayList,
    payArg,
    payAfter,
    getPayInfo,
    toPay,
    selUnPayList,
    totalCost,
    isShowSelectAll,
    isSelectAll,
    chooseAll,
    gStores,
    getDrugDeliveryList,
    goDrugDelivery,
    regDialogConfirmExpress,
    isWaitPayListHidePrice,
    hosId,
    selHosRef,
    hookInit,
    wxPryMoneyMedicalDialog,
    patChange
  } = usePayPage();

  const isShowPatComponent = ref(false);

  const isListShowClinicType = computed(() => {
    return pageConfig.value.isListShowClinicType === '1';
  });

  const pageHook = async () => {
    await wait(200);
    const patList = gStores.userStore.patList;
    if (!patList.length) {
      const pages = getCurrentPages();

      if (pages.length) {
        const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;

        await beforeEach({
          url: fullUrl,
          _isPatient: true,
        });
      }
    }
  };

  const init = async () => {
    await getSysConfig();
    if (pageConfig.value.isListToggleHos === '1') {
      await wait(300);
      await selHosRef.value.init();
    }
    if (!pageProps.value.params) {
      await pageHook();
    }

    await hookInit();
  };

  onShow(async () => {
    // 微信医保小程序跳回来后中断了链路 重新走下
    if (getLocalStorage('get-wx-medical-auth-code') === '1') {
      await wait(300);
      setLocalStorage({
        'get-wx-medical-auth-code': '',
      });

      if (gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode) {
        console.log(
          'gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode',
          gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode
        );
        // return;

        getPayInfo({
          item: {
            key: 'medicare',
            label: '',
          },
        });
      }
    }
  });

  onLoad(async (opt) => {
    const enter = uni.getEnterOptionsSync();
    const queryParams = enter?.query?.qrCode;

    if (queryParams && !opt.params) {
      return;
    }

    await wait(650);

    if (opt.q) {
      return;
    }

    if (opt) {
      if (opt.q) {
        return;
      }

      pageProps.value = deQueryForUrl(deQueryForUrl(opt));

      if (pageProps.value.params) {
        pageProps.value.deParams = decryptForPage(pageProps.value.params);

        console.log(
          '获取到加密参数',
          pageProps.value.params,
          pageProps.value.deParams
        );
      }
    }

    await init();
    await wait(600);
    isShowPatComponent.value = true;

    if (pageProps.value.tabIndex === '1') {
      tabCurrent.value = 1;

      if (!pageProps.value.params && globalGl.sConfig.isDrugDelivery === '1') {
        getDrugDeliveryList();
      }

      // #ifdef MP-ALIPAY
      // 微信会触发组件 change 事件, 支付宝不会
      getListData();
      // #endif
    } else {
      getListData();
    }
  });
</script>

<style lang="scss" scoped>
  .swiper-item {
    height: 100%;
    padding: 0 32rpx;
    width: calc(100% - 64rpx);
  }

  .g-footer {
    align-items: center;

    .footer-check {
      font-size: var(--hr-font-size-xs);
      flex: 0.5;

      .iconfont {
        font-size: var(--hr-font-size-xxl);
        color: var(--hr-neutral-color-7);
        margin-right: 10rpx;
      }
    }

    .count-money {
      margin-right: 24rpx;
    }

    .f-right {
      justify-content: flex-start;
    }

    .btn {
      flex: 1;
    }

    .pay-btn {
      flex: 0.8;
    }
  }
</style>
