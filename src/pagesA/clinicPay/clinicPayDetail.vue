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

    <view class="g-footer" v-if="tabCurrent === 0">
      <view class="footer-check flex-normal">
        <view class="iconfont">&#xe6ce;</view>
        <view>全选</view>
      </view>

      <view class="flex1 flex-normal count-money">
        <text class="color-444 f28 mr8">合计</text>
        <text class="f36 g-bold color-error">16元</text>
      </view>

      <button class="btn g-border btn-warning pay-btn">缴费</button>
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
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { usePayPage } from './utils/clinicPayDetail';
  import { useTBanner } from '@/utils';

  import ClinicPayDetailList from './components/clinicPayDetailList.vue';

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
  } = usePayPage();

  const isListShowClinicType = computed(() => {
    return pageConfig.value.isListShowClinicType === '1';
  });

  const init = async () => {
    await getSysConfig();
    getListData();
  };

  init();
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
      justify-content: flex-end;
      margin-right: 24rpx;
    }

    .btn {
      flex: 1;
    }

    .pay-btn {
      flex: 0.8;
    }
  }
</style>
