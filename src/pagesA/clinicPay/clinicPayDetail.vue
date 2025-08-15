<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <g-flag
      v-if="!isModeMedicalHelp && gStores.globalStore.sysCode !== '1001035'"
      isShowFg
      typeFg="15"
    />
    <!-- #ifdef  MP-WEIXIN -->
    <code-btn
      v-if="wxCrossProgramInfo.bizType"
      :appId="wxCrossProgramInfo.appId"
      :bizType="wxCrossProgramInfo.bizType"
      :extInfo="wxCrossProgramInfo.extInfo"
      id="codePlugin"
      style="position: absolute; top: -100vh"
      :zIndex="99"
    ></code-btn>
    <!-- #endif -->
    <g-tbanner :config="pageConfig.bannerPay" />

    <view v-if="isShowPatComponent" class="animate__animated animate__fadeIn">
      <g-choose-pat
        :cusTomList="patList"
        :pat="selPat"
        :disabled="pageProps.params"
        @choose-pat="patChange"
      />

      <g-selhos
        v-if="pageConfig.isListToggleHos === '1' || cacheStore.isShowChooseHos"
        v-model:hosId="hosId"
        :autoGetData="false"
        @change="getListData(true)"
        ref="selHosRef"
      />

      <view class="g-border-bottom">
        <g-tabs
          v-show="tabField.length && tabField.length > 1 && !isModeMedicalHelp"
          v-model:value="tabCurrent"
          :tabs="tabField"
          :scroll="false"
          @change="tabChange"
          field="label"
          style="width: 100%"
        />
      </view>
    </view>

    <swiper
      :current="tabCurrent"
      :duration="300"
      @change="({ detail: { current } }) => tabChange(current)"
      class="g-container"
    >
      <swiper-item v-if="!isModeMedicalHelp">
        <scroll-view scroll-y class="swiper-item uni-bg-red">
          <g-flag
            v-if="gStores.globalStore.sysCode === '1001035'"
            isShowFg
            typeFg="15"
          />
          <block v-if="isPayListRequestComplete && unPayList.length">
            <Clinic-Pay-Detail-List
              :list="unPayList"
              @click-item="itemClick"
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
              :isModeMedicalHelp="isModeMedicalHelp"
              @click-item="itemClick"
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
      <block
        v-if="
          Array.isArray(pageConfig.payedFooterBtn) &&
          pageConfig.payedFooterBtn.length
        "
      >
        <button
          v-for="(btn, index) in pageConfig.payedFooterBtn"
          :key="`payedFooterBtn${index}`"
          @click="clickBtn(btn)"
          class="btn btn-primary btn-border"
          :class="index === 0 ? 'btn-plain' : 'confirm-btn'"
        >
          {{ btn.text }}
        </button>
      </block>
      <button
        v-if="!Array.isArray(pageConfig.payedFooterBtn)"
        @click="useTBanner(pageConfig.payedFooterBtn!, 'navigateTo', pageProps)"
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
      <view v-if="pageConfig.confirmPayFg" class="p32">
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
    _getQxMedicalNation,
    IPayListItem,
    getWxMedicalAuth1001035,
  } from './utils/clinicPayDetail';
  import { apiAsync, useTBanner, wait } from '@/utils';
  import {
    deQueryForUrl,
    setLocalStorage,
    getLocalStorage,
    joinQueryForUrl,
  } from '@/common';
  import { decryptForPage, encryptDes } from '@/common/des';
  import { beforeEach } from '@/router';
  import { IPat } from '@/stores/type/index';

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
    selHosRef,
    hookInit,
    wxPryMoneyMedicalDialog,
    patChange,
    cacheStore,
    hosId,
    wxCrossProgramInfo,
    isModeMedicalHelp,
    getChineseMedicineList,
  } = usePayPage();

  const isShowPatComponent = ref(false);
  const itemClick = (item: IPayListItem) => {
    // 省中限制进入详情
    if (gStores.globalStore.sysCode === '1001035') {
      if (tabCurrent.value === 0) {
        selPayListItem(item);
      }
      return;
    }

    if (isModeMedicalHelp.value) {
      const { cardNumber } = pageProps.value.deParams;
      const { visitNo } = item;
      const params = encryptDes(
        JSON.stringify({
          cardNumber,
          visitNo,
        }),
        'phsDesKey'
      );

      uni.navigateTo({
        url: joinQueryForUrl('/pagesB/medicationAssistant/medicalHelp', {
          params,
        }),
      });
    } else {
      goPayDetail(item);
    }
  };

  const isListShowClinicType = computed(() => {
    return pageConfig.value.isListShowClinicType === '1';
  });

  const patList = computed(() => {
    if (pageProps.value.params) {
      return [selPat.value];
    } else {
      return gStores.userStore.patList;
    }
  });

  const selPat = computed(() => {
    if (pageProps.value.params) {
      if (
        gStores.userStore.patChoose.cardNumber ===
        pageProps.value.deParams?.cardNumber
      ) {
        return gStores.userStore.patChoose;
      } else {
        return <IPat>{
          patientName: pageProps.value.deParams?.patientName || '就诊人',
          _showId: pageProps.value.deParams?.cardNumber || '',
        };
      }
    } else {
      return gStores.userStore.patChoose;
    }
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
    if (
      pageConfig.value.isListToggleHos === '1' ||
      cacheStore.isShowChooseHos
    ) {
      await wait(300);
      await selHosRef.value.init();
    }
    if (!pageProps.value.params) {
      await pageHook();
    }

    await hookInit();
  };

  onShow(async () => {
    const medicalWx = getLocalStorage('get-wx-medical-auth-code');
    const medicalAli = getLocalStorage('get-ali-medical-auth-code');

    // 微信医保小程序跳回来后中断了链路 重新走下
    if (medicalWx === '1' || medicalAli === '1') {
      const oldSelUnPayList: any[] = getLocalStorage('selUnPayList') || [];

      if (!selUnPayList.value.length) {
        setLocalStorage({
          keepSelUnPayList: '1',
        });
        selUnPayList.value = oldSelUnPayList;
      }
      await wait(300);
      setLocalStorage({
        'get-wx-medical-auth-code': '',
        'get-ali-medical-auth-code': '',
      });

      let isAliAuth = false;
      if (medicalAli === '1') {
        const { payAuthNo } = await _getQxMedicalNation({
          params: pageProps.value.params,
        });
        isAliAuth = !!payAuthNo;
      }

      if (
        gStores.globalStore.appShowData.referrerInfo?.extraData?.payAuthNo ||
        gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode ||
        isAliAuth
      ) {
        getPayInfo({
          item: {
            key: 'medicare',
            label: '',
          },
        });
      } else {
        gStores.messageStore.showMessage(
          '未完成电子医保凭证授权,无法继续医保结算'
        );
      }
    }
  });

  const clickBtn = async (btn) => {
    if (btn.isOpenDrug === '1') {
      await getChineseMedicineList();
    } else {
      useTBanner(btn!, 'navigateTo', pageProps.value);
    }
  };

  // 注意如果需要单纯跳门诊缴费（不免密）， 二维码随便带个参数
  onLoad(async (opt) => {
    /**
     * 支付宝端
     * queryParams - https://h5.eheren.com/xxxx?xxx=xxx
     */
    const queryParams = gStores.globalStore.appLaunchData?.query
      ?.qrCode as string;
    uni.showLoading({});

    if ((queryParams && !Object.keys(opt).length) || opt?.q) {
      let url = deQueryForUrl(deQueryForUrl({ q: queryParams || opt?.q })).q;
      if (url.split('?').length > 1) {
        return;
      }
    }

    await wait(650);

    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
      pageProps.value.hosId && cacheStore.changeHosId(pageProps.value.hosId);

      // if (pageProps.value.params) {
      //   pageProps.value.deParams = decryptForPage(pageProps.value.params);

      //   console.warn(
      //     '获取到加密参数',
      //     pageProps.value.params,
      //     pageProps.value.deParams
      //   );

      //   gStores.globalStore.onAppLaunch({});
      // }
    }

    // await wait(600);
    isShowPatComponent.value = true;
    if (isModeMedicalHelp.value) {
      tabCurrent.value = 1;
      uni.setNavigationBarTitle({
        title: '代煎登记',
      });
    } else {
      uni.setNavigationBarTitle({
        title: '门诊缴费',
      });
    }

    await init();

    if (pageProps.value.tabIndex === '1') {
      tabCurrent.value = 1;

      if (!pageProps.value.params && globalGl.sConfig.isDrugDelivery === '1') {
        await getDrugDeliveryList();
      }

      // #ifdef MP-ALIPAY
      // 微信会触发组件 change 事件, 支付宝不会
      await getListData();
      // #endif
    } else {
      await getListData();
    }

    await wait(10);
    if (
      pageProps.value.params &&
      tabCurrent.value === 0 &&
      !unPayList.value.length
    ) {
      pageConfig.value.scanPayEmptyAction &&
        useTBanner(
          pageConfig.value.scanPayEmptyAction,
          'navigateTo',
          pageProps.value
        );
    }

    // const { confirm } = await apiAsync(uni.showModal, {
    //   content: 'hint',
    //   cancelText: '稍后缴费',
    //   confirmText: '立即缴费',
    // });
    // getWxMedicalAuth1001035({
    //   idCard: '320322199204236243',
    //   userName: '路鑫瑶',
    // });
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

  .animate__animated {
    z-index: 10;
  }
</style>
