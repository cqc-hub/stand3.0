<template>
  <view class="g-page">
    <!-- <g-flag isShowFg typeFg="15" /> -->
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

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { usePayPage } from './utils/clinicPayDetail';

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
</style>
