<template>
  <view class="">
    <g-flag typeFg="108" isShowFg />
    <view class="pat-box">
      <view class="add-pat-box" @click="addPatPage">
        <view class="add-pat g-flex-rc-cc">
          <view class="iconfont icon-resize">&#xe6ab;</view>
          <text>添加就诊人</text>
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

  const gStore = new GStores();

  const addPatPage = () => {
    uni.navigateTo({
      url:
        '/pagesA/medicalCardMan/perfectReal?_directUrl=' +
        encodeURIComponent('/pagesA/medicalCardMan/medicalCardMan')
    });
  };

  const profileClick = (pat: IPat) => {
    gStore.userStore.updatePatClick(pat);
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/medicalCardDetail'
    });
  };

  const cardClick = (pat: IPat) => {
    gStore.userStore.updatePatClick(pat);
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/electronicMedicalCard'
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
    padding: 40rpx 0;
    background-color: var(--h-color-white);
    border-radius: 16rpx;
    color: var(--hr-brand-color-6);
    font-weight: var(--h-weight-2);

    .icon-resize {
      font-size: 48rpx;
      margin-right: 10rpx;
      font-weight: 500;
    }
  }

  .empty-list {
    transform: translateY(100%);
  }
</style>
