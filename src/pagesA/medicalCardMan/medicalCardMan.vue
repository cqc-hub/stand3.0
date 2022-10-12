<template>
  <view class="">
    <g-flag typeFg="108" isShowFg />
    <view class="pat-box">
      <view
        v-if="!isShowHealthCardMode"
        class="add-pat-box"
        @click="addPatPage"
      >
        <view class="add-pat g-flex-rc-cc">
          <view class="iconfont icon-resize">&#xe6ab;</view>
          <text>添加就诊人</text>
        </view>
      </view>

      <view v-else class="health-card">
        <view @click="associatedHealthCard" class="mr14">
          <view class="iconfont icon-resize color-blue">&#xe6ef;</view>
          <text>关联已有健康卡</text>
        </view>

        <view @click="addPatPage">
          <view class="iconfont icon-resize color-purple">&#xe6f8;</view>
          <text>添加健康卡</text>
        </view>
      </view>
    </view>

    <view v-if="gStore.userStore.patList.length">
      <pat-List
        :list="gStore.userStore.patList"
        @profile-click="profileClick"
        @card-click="cardClick"
      />
    </view>

    <view class="empty-list" v-else>
      <g-empty :current="1" />
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import patList from './components/patList.vue';

  import { GStores, PatientUtils } from '@/utils';
  import { IPat } from '@/stores';
  import { ref } from 'vue';

  import globalGl from '@/config/global';

  const gStore = new GStores();
  const isShowHealthCardMode = ref(false);

  // #ifdef MP-WEIXIN
  if (globalGl.systemInfo.isOpenHealthCard) {
    isShowHealthCardMode.value = true;
  }
  // #endif

  const addPatPage = () => {
    uni.navigateTo({
      url:
        globalGl.addPersonUrl +
        '?_directUrl=' +
        encodeURIComponent('/pagesA/medicalCardMan/medicalCardMan'),
    });
  };

  const profileClick = (pat: IPat) => {
    gStore.userStore.updatePatClick(pat);
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/medicalCardDetail',
    });
  };

  const cardClick = (pat: IPat) => {
    gStore.userStore.updatePatClick(pat);
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/electronicMedicalCard',
    });
  };

  const associatedHealthCard = () => {
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/easyAssociate',
    });
  };

  new PatientUtils().getPatCardList();
</script>

<style lang="scss" scoped>
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

  .icon-resize {
    font-size: 48rpx;
    margin-right: 10rpx;
    font-weight: 500;
  }

  .empty-list {
    transform: translateY(100%);
  }

  .mr14 {
    margin-right: 14rpx;
  }
</style>
