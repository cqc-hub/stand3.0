<template>
  <view class="container">
    <view class="pat-profile" @click="profileClick">
      <view class="pat-label">
        <text class="pat-name bold">{{ pat.patientName }}</text>
        <text class="pat-sex bold">{{ pat.patientSex }}</text>
        <g-tag v-if="pat.defaultFlag === '1'" type="yellow" text="默认" />
      </view>

      <view class="iconfont icon-resize">&#xe66b;</view>
    </view>

    <view
      v-if="pat.healthQrCodeText && $global.systemInfo.isOpenHealthCard"
      @click="cardClick"
      class="health-card"
    >
      <view class="health-card-container">
        <view class="health-card-title">
          <view class="card-top-org">
            {{ $global.systemInfo.isOpenHealthCard?.healthCardText }}
          </view>

          <view class="card-top-icon">
            <image :src="$global.BASE_IMG + 'health-card-icon.png'" mode="" />
            <text>电子健康卡</text>
          </view>
        </view>

        <view class="health-card-footer">
          <view class="health-card-info flex-normal-between">
            <view class="health-card-info-content">
              <view>{{ pat.patientName }}</view>
              <view>{{ pat.idCard }}</view>
            </view>

            <image
              :src="$global.BASE_IMG + 'health-card-qrcode.png'"
              class="health-card-qrcode"
              mode=""
            />
          </view>

          <view class="qx">中华人民共和国国家卫生健康委员会监制</view>
        </view>
      </view>
    </view>

    <view v-else class="pat-card" @click="cardClick">
      <view class="card">
        <view class="card-content">
          <view class="card-label">电子就诊卡</view>
          <view class="card-value">{{ pat._showId }}</view>
        </view>
      </view>

      <view class="card-container">
        <image class="qr-code" src="/static/image/v-qrcode.png"></image>
      </view>
    </view>

    <!-- #ifdef MP-WEIXIN -->
    <block v-if="$global.systemInfo.isOpenHealthCard && !pat.healthQrCodeText">
      <view v-if="!isShowHealthLogin" @click="upToHealthCord" class="jkk">
        升级为电子健康卡
      </view>

      <health-card-login
        v-else
        :authLogin="false"
        :hidden="!isShowHealthLogin"
        @authSucess="upToHealthCord"
        @authCancel="isShowHealthLogin = false"
        wechatcode
      >
        <view class="jkk">再次点击授权</view>
      </health-card-login>
    </block>
    <!-- #endif -->
  </view>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref, reactive } from 'vue';
  import { IPat } from '@/stores/type';
  import { getHealthCardCode } from '../utils/index';
  import { PatientUtils, GStores } from '@/utils';

  export default defineComponent({
    props: {
      pat: {
        type: Object as PropType<IPat>,
        default: () => ({}),
      },
    },

    emits: ['profile-click', 'card-click'],

    setup(props, ctx) {
      const { emit } = ctx;
      const isShowHealthLogin = ref(false);
      const patientUtils = new PatientUtils();
      const gStores = new GStores();
      const showId = ref('');

      const profileClick = () => {
        emit('profile-click', props.pat);
      };

      const cardClick = () => {
        emit('card-click', props.pat);
      };

      const upToHealthCord = async () => {
        // #ifdef MP-WEIXIN
        const { success, res } = await getHealthCardCode();
        if (success) {
          const {
            result: { wechatCode },
          } = res;
          isShowHealthLogin.value = false;
          const requestArg = {
            wechatCode,
            patientId: props.pat.patientId,
          };

          uni.showLoading({
            mask: true,
            title: '升级中..',
          });
          await patientUtils.registerHealthCard(requestArg);
          uni.showLoading({
            mask: true,
            title: '升级成功， 正在刷新列表...',
          });
          await patientUtils.getPatCardList();
          uni.hideLoading();
        } else {
          gStores.messageStore.showMessage('未授权， 请再次点击进行授权', 1500);
          isShowHealthLogin.value = true;
          return Promise.reject(void 0);
        }
        // #endif
      };

      return {
        profileClick,
        cardClick,
        isShowHealthLogin,
        upToHealthCord,
        showId
      };
    },
  });
</script>

<style lang="scss" scoped>
  .container {
    background-color: var(--h-color-white);
    border-radius: 16rpx;
    padding: 32rpx;

    -webkit-animation-name: fadeInRight;
    animation-name: fadeInRight;
    animation-duration: 0.5s;

    .pat-profile {
      color: var(--hr-neutral-color-10);
      font-size: var(--hr-font-size-xl);
      justify-content: space-between;
      display: flex;
      align-items: center;

      .pat-label {
        display: flex;
        align-items: center;

        text {
          margin-right: 20rpx;
        }
      }

      .icon-resize {
        font-size: 48rpx;
        color: var(--hr-neutral-color-7);
      }
    }

    .pat-card {
      border-radius: 16rpx;
      background-color: #f6f8ff;
      margin-top: 24rpx;
      height: 136rpx;

      display: flex;

      .card {
        width: 65%;
        display: flex;
        align-items: center;
      }

      .card-content {
        color: var(--hr-neutral-color-9);
        font-size: var(--hr-font-size-xs);
        margin-left: 32rpx;

        .card-label {
          margin-bottom: 8rpx;
        }
      }

      .card-container {
        height: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        background-image: radial-gradient(
            circle at 20rpx 0,
            #fff,
            #fff 10rpx,
            transparent 11rpx
          ),
          radial-gradient(
            circle at 20rpx bottom,
            #fff,
            #fff 10rpx,
            transparent 11rpx
          );

        .qr-code {
          width: 72rpx;
          height: 72rpx;
          position: relative;
          left: 10rpx;
        }

        &::before {
          content: '';
          width: 2rpx;
          height: 100%;
          position: absolute;
          left: 18rpx;
          border-left: 4rpx dashed #fff;
        }
      }
    }

    .health-card {
      height: 350rpx;
      margin-top: 16rpx;
      background: url(https://phsdevoss.eheren.com/pcloud/phs3.0/health-card-bg.png)
        100%/100% no-repeat;
      // border-radius: 16rpx;

      .health-card-container {
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 24rpx;

        .health-card-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24rpx;

          .card-top-org {
            font-size: var(--h-size-18);
          }

          .card-top-icon {
            display: flex;
            align-items: center;
            font-size: var(--hr-font-size-s);
            color: #2b2b2b;
            margin-right: 12rpx;

            image {
              height: 55rpx;
              width: 55rpx;
              margin-right: 8rpx;
            }
          }
        }

        .health-card-footer {
          display: flex;
          flex-direction: column;
          font-size: var(--hr-font-size-xl);
          color: #2b2b2b;

          .health-card-info {
            align-items: flex-end;

            .health-card-qrcode {
              height: 154rpx;
              width: 154rpx;
            }
          }

          .qx {
            font-size: var(--h-size-18);
            text-align: center;
            padding: 24rpx 0;
          }
        }
      }
    }
  }

  .bold {
    font-weight: 600;
  }

  .jkk {
    color: #00a1d6;
    text-align: center;
    font-size: var(--hr-font-size-xs);
    margin-top: 24rpx;
  }
</style>
