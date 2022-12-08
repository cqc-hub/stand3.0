<template>
  <view class="g-page">
    <g-flag isShowFg typeFg="15" />
    <g-choose-pat @choose-pat="getListData(true)" />
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
        :class="{
          'f-right': !isShowSelectAll,
        }"
        class="flex1 flex-normal count-money"
      >
        <text class="color-444 f28 mr8">合计</text>
        <text class="f36 g-bold color-error">{{ totalCost }}元</text>
      </view>

      <button
        :class="{
          'btn-disabled': !selUnPayList.length,
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

    <g-pay
      :list="refPayList"
      :autoPayArg="payArg"
      @pay-success="payAfter"
      @pay-click="getPayInfo"
      autoInOne
      ref="refPay"
    >
      <!-- <g-flag typeFg="32" isShowFgTip /> -->
    </g-pay>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad, onReady } from '@dcloudio/uni-app';

  import { usePayPage } from './utils/clinicPayDetail';
  import { useTBanner, wait } from '@/utils';
  import { deQueryForUrl } from '@/common';

  import ClinicPayDetailList from './components/clinicPayDetailList.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';

  import api from '@/service/api';

  // api.getUnpaidClinicList = async () => {
  //   await wait(500);
  //   return Promise.resolve(<any>{
  //     result: {
  //       patientName: '陈钦川',
  //       clinicalSettlementResultList: [
  //         {
  //           deptName: '神经内科',
  //           clinicId: 'dbbc0285-0b15-43d8-8df0-40253050ffe6',
  //           subIds: 'f7b85065-0154-498d-81cf-8d4c48700b1a',
  //           docId: '00812',
  //           deptId: 'A010228',
  //           hosId: '13001',
  //           costTypeCode: '1',
  //           payState: '1',
  //           serialNo:
  //             '57ab80a78101435b81b88440a2ebb37e,7541ffefc1904ca69c15577cebf0cbf5,2ba76d5181944b56902b02718f18ee8f',
  //           childOrder: '1165',
  //           docName: '孙**',
  //           costTypeName: '自费',
  //           visitDate: '2022-12-08',
  //           hosName: '乐清市人民医院',
  //           totalCost: '213.6',
  //           visitNo: '20221208000010',
  //         },
  //         {
  //           deptName: '耳鼻喉外科',
  //           clinicId: '170db102-7474-4c32-9ac6-dd3ebe36e068',
  //           subIds: 'da9f5ddd-82a9-4a3d-ac53-b52f4faef861',
  //           docId: 'ADMIN',
  //           deptId: 'A010217',
  //           hosId: '13001',
  //           costTypeCode: '1',
  //           payState: '1',
  //           serialNo:
  //             '9d426ff4b1164ccab6f7c5afb728ce9c,d3dffe2f42834e00a8f8bba78700a98e',
  //           childOrder: '1166',
  //           docName: '超****',
  //           costTypeName: '自费',
  //           visitDate: '2022-12-06',
  //           hosName: '乐清市人民医院',
  //           totalCost: '20.98',
  //           visitNo: '20221206000010',
  //         },
  //         {
  //           deptName: '呼吸内科',
  //           clinicId: 'de004ae3-bb45-4332-9c54-a5e0fb23f7f4',
  //           subIds: '4cc65cd7-beeb-4543-a412-2636731778f4',
  //           deptId: 'A010221',
  //           hosId: '13001',
  //           costTypeCode: '1',
  //           payState: '1',
  //           serialNo: '41dc9b6ceda441dd9da742e0ee6e9f81',
  //           childOrder: '1167',
  //           costTypeName: '自费',
  //           visitDate: '2022-11-16',
  //           hosName: '乐清市人民医院',
  //           totalCost: '14.0',
  //           visitNo: '20221116000020',
  //         },
  //       ],
  //       cardNumber: '300087902',
  //     },
  //     timeTaken: 534,
  //     code: 0,
  //     functionVersion:
  //       '[{"functionType":"1","version":"V0.0.6"},{"functionType":"2","version":"V0.0.26"}]',
  //     message: '成功',
  //     respCode: 999002,
  //   });
  // };

  const pageProps = ref(
    {} as {
      tabIndex?: '1';
    }
  );

  const {
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
  } = usePayPage();

  const isListShowClinicType = computed(() => {
    return pageConfig.value.isListShowClinicType === '1';
  });

  const init = async () => {
    await getSysConfig();
    getListData();
  };

  setTimeout(() => {
    // regDialogConfirm.value.show();
  }, 1000);

  onLoad(async (opt) => {
    if (opt) {
      pageProps.value = deQueryForUrl(opt);
    }

    await init();

    if (pageProps.value.tabIndex === '1') {
      tabCurrent.value = 1;
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
