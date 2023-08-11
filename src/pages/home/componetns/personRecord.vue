<template>
  <view class="">
    <view class="container">
      <g-login @handler-next="avatarClick">
        <image
          :src="gStores.userStore.getAvatar"
          @click="avatarClick"
          mode="widthFix"
          class="user-avatar g-fade-in"
        />
      </g-login>

      <g-login @handler-next="routerJump">
        <view class="info">
          <block v-if="gStores.globalStore.isLogin">
            <text class="user-name animate__animated animate__fadeIn">
              {{ gStores.userStore.name || gStores.userStore.cellPhoneNum }}
            </text>
          </block>

          <block v-else>
            <button
              class="user-name login-btn animate__animated animate__fadeIn"
            >
              请登录
            </button>
          </block>
        </view>
      </g-login>

      <view
        v-if="gStores.globalStore.isLogin"
        class="user-out animate__animated animate__slideInRight"
      >
        <view @click="outLogin({})" class="out-btn">退出登录</view>
      </view>
    </view>

    <view
      :class="`record-container ${
        viewerStore.myPersonRecordList.length === 1
          ? 'record-container-row1'
          : 'record-container-row2'
      }`"
    >
      <view
        v-for="(record, i) in viewerStore.myPersonRecordList"
        :key="i"
        :style="{
          'background-image': `url(${backImg[i]})`,
          'background-color': recordColors[i],
        }"
        :class="{
          'cr-center': viewerStore.myPersonRecordList && viewerStore.myPersonRecordList.length === 1,
          'record-item-first': viewerStore.myPersonRecordList.length === 2 && i === 0,
        }"
        class="record-item g-fade-in"
        @tap="jumpFor(record)"
      >
        <!-- <g-login @handler-next="jumpFor(record)" :disabled="record.loginInterception === '0'"> -->
        <view class="record-label">
          <text>{{ record.title }}</text>
          <view
            v-if="viewerStore.myPersonRecordList && viewerStore.myPersonRecordList.length === 1"
            class="iconfont icon-size"
          >
            &#xe6c8;
          </view>
        </view>
        <!-- </g-login> -->
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { outLogin, routerJump, GStores } from '@/utils';
  import { useCommonTo } from '@/common/checkJump';
  import { useViewerStore } from '@/stores/modules/viewer';

  import global from '@/config/global';

  const gStores = new GStores();
  const jzIcon = global.BASE_IMG + 'v3-my-jzk.png';
  const ybIcon = global.BASE_IMG + 'v3-my-pz.png';
  const viewerStore = useViewerStore();

  const avatarClick = () => {
    uni.navigateTo({
      url: '/pages/home/accountInfo',
    });
  };

  const jumpFor = (record: IRoute) => {
    useCommonTo(record);
  };

  const backImg = [jzIcon, ybIcon];
  const recordColors = ['#296FFF', '#00b39e'];
</script>

<style lang="scss" scoped>
  .container {
    padding-top: 48upx;
    display: grid;
    grid-template-columns: 160upx 1fr 180upx;
    gap: 10upx;
    align-items: center;
    width: 100%;
    position: relative;
    z-index: 2;

    .user-avatar {
      width: 118upx;
      height: 118upx;
      margin: 0 35upx;
      // padding-left: 35rpx;
      border-radius: 600upx;
      border: 4rpx solid #fff;
    }

    .info {
      max-width: 370upx;
      display: flex;
      flex-direction: column;
      margin-left: 20upx;
      .user-name {
        color: var(--hr-neutral-color-10);
        font-weight: var(--h-weight-1);
        font-size: var(--hr-font-size-xxl);
      }

      .user-id {
        color: var(--hr-neutral-color-8);
        font-size: var(--hr-font-size-xs);
        margin-top: 10upx;
      }

      .login-btn {
        border: none !important;
        background-color: transparent;
        box-shadow: none !important;
        & button,
        & uni-button:after,
        & button:after {
          border: none !important;
          background-color: transparent;
          box-shadow: none !important;
        }
      }

      button {
        margin-left: 0;
        text-align: left;
      }

      button:after {
        border: none !important;
        background-color: transparent;
        box-shadow: none !important;
      }
    }

    .user-out {
      height: 100%;
      // display: flex;
      justify-content: flex-end;

      .out-btn {
        background-color: var(--hr-brand-color-2);
        border-radius: 32upx 0px 0px 32upx;
        text-align: center;
        padding: 12rpx 24rpx;
        // margin-right: 30upx;
        white-space: nowrap;
        color: var(--hr-neutral-color-10);
        font-size: var(--hr-font-size-xs);
      }
    }
  }

  .record-container {
    margin: 48upx 32rpx 24rpx 32rpx;

    margin-bottom: 24rpx;

    display: flex;
    // gap: 16upx;
    height: 160upx;

    .record-item {
      flex: 1;
      height: 100%;
      color: var(--h-color-white);
      border-radius: 16upx;
      background-size: 200upx;
      background-repeat: no-repeat;
      background-position: right 0 bottom 0;
      font-size: var(--hr-font-size-base);

      .record-label {
        margin-top: 48upx;
        padding-left: 24upx;
        display: flex;
        align-items: center;
        color: #fff;

        .icon-size {
          margin-left: 20upx;
          font-size: var(--hr-font-size-xl);
          opacity: 0.6;
        }
      }
    }
  }

  .record-container-row1 {
    height: 120upx;

    .record-item {
      display: flex;
      align-items: center;
      .record-label {
        margin-top: 0;
        padding-left: 44upx;
      }
    }
  }

  .record-container-row2 {
    .record-item-first {
      margin-right: 16rpx;
    }
  }
</style>
