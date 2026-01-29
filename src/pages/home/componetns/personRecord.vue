<template>
  <view class="">
    <view class="container">
      <g-login @handler-next="routerJump">
        <image
          :src="getAvatarSrc"
          @click="avatarClick"
          mode="widthFix"
          class="user-avatar g-fade-in"
        />
      </g-login>

      <g-login @handler-next="routerJump">
        <view class="info h-full animate__animated animate__fadeIn">
          <block v-if="gStores.globalStore.isLogin">
            <view @click="patInfoClick" class="h-full">
              <view
                v-if="
                  isShowTogglePatComponent && gStores.userStore.patList.length
                "
                class="h-full flex flex-col justify-center"
              >
                <view>
                  <text class="color-111 f48 font-semibold mr8">
                    {{ gStores.userStore.patChoose.patientNameEncry }}
                  </text>

                  <text class="iconfont qr-toggle-icon color-blue f60 absolute">
                    &#xe6f9;
                  </text>
                </view>

                <view class="color-666 f28">
                  <text class="mr8">就诊号</text>
                  <text>{{ gStores.userStore.patChoose._showId }}</text>
                </view>
              </view>
              <text v-else class="color-111 f48 font-semibold">
                {{
                  gStores.userStore.name ||
                  gStores.userStore.cellPhoneNum ||
                  '已登录'
                }}
              </text>
            </view>
          </block>

          <block v-else>
            <button class="f48 login-btn font-semibold color-111">
              {{ getLangLabel('home:请登录') }}
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
      <g-login
        v-for="(record, i) in viewerStore.myPersonRecordList"
        :key="i"
        :disabled="record.loginInterception === '0'"
        @handler-next="jumpFor(record)"
        class="flex1"
      >
        <view
          :style="{
            background: recordColors[i],
          }"
          :class="{
            'cr-center':
              viewerStore.myPersonRecordList &&
              viewerStore.myPersonRecordList.length === 1,
            'record-item-first':
              viewerStore.myPersonRecordList.length === 2 && i === 0,
          }"
          class="record-item g-fade-in"
          @tap="jumpFor(record)"
        >
          <view
            :style="{
              'background-image': `url(${backImg[i]})`,
            }"
            class="record-item"
          >
            <view
              :class="{
                pt48: viewerStore.myPersonRecordList.length > 1,
              }"
              class="record-label"
            >
              <text>{{ record.title }}</text>
              <view
                v-if="
                  viewerStore.myPersonRecordList &&
                  viewerStore.myPersonRecordList.length === 1
                "
                class="iconfont icon-size"
              >
                &#xe6c8;
              </view>
            </view>
          </view>
        </view>
      </g-login>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { outLogin, routerJump, GStores } from '@/utils';
  import { useCommonTo } from '@/common/checkJump';
  import { useViewerStore } from '@/stores/modules/viewer';

  import global from '@/config/global';
  import { computed } from 'vue';
  import { getLangLabel } from '@/config/lang';
  import globalGl from '@/config/global';
  import { getAvatar } from '@/stores';

  const gStores = new GStores();
  const viewerStore = useViewerStore();

  const emits = defineEmits(['show-choose-pat']);

  const showChoosePat = () => {
    emits('show-choose-pat');
  };

  const patInfoClick = () => {
    if (isShowTogglePatComponent.value) {
      showChoosePat();
    }
  };

  const avatarClick = () => {
    if (isShowTogglePatComponent.value) {
      showChoosePat();
      return;
    }
    uni.navigateTo({
      url: '/pages/home/accountInfo?type=outLogin',
    });
  };

  const jumpFor = (record: IRoute) => {
    useCommonTo(record);
  };

  const getAvatarSrc = computed(() => {
    if (isShowTogglePatComponent.value) {
      return getAvatar(gStores.userStore.patChoose.patientSex);
    }

    return gStores.userStore.getAvatar;
  });

  const isShowTogglePatComponent = computed(
    () => globalGl.sConfig.homeMyShowTogglePatComponent === '1'
  );

  const backImg = computed(() => {
    let icons = ['v3-my-jzk', 'v3-my-pz'];
    if (gStores.globalStore.isTcmStyle) {
      icons = icons.map((o) => `${o}-tcm`);
    }

    return icons.map((icon) => global.BASE_IMG + icon + '.png');
  });
  const recordColors = computed(() => {
    return gStores.globalStore.isTcmStyle
      ? [
          'linear-gradient(0deg,#8e493b, #b68272 100%)',
          'linear-gradient(0deg,#d26900, #ffa52e)',
        ]
      : ['var(--hr-brand-color-6)', '#00b39e'];
  });
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
        background-color: var(--h-m-main-c);
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
    gap: 16upx;
    height: 160upx;

    .record-item {
      flex: 1 0 400rpx;
      height: 100%;
      color: var(--h-color-white);
      border-radius: 16upx;

      font-size: var(--hr-font-size-base);
      background-size: 200upx;
      background-repeat: no-repeat;
      background-position: right 0 bottom 0;

      .record-label {
        // padding-top: 48upx;
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
      flex: 1 0 400rpx;

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
      // margin-right: 16rpx;
    }
  }
</style>
