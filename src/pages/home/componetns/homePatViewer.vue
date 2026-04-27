<template>
  <g-login @handler-next="routerJump">
    <view v-if="gStores.globalStore.modeOld" class="color-fff">
      <block v-if="globalStore.isLogin">
        <view
          class="top-card-old flex-normal-between animate__animated animate__fadeIn pl32"
        >
          <!-- 有就诊人时 -->
          <block v-if="getShowName">
            <view class="flex-normal">
              <view
                v-if="personConfig.isQrCodeDisabled !== '1'"
                @tap="cardClick"
                class="iconfont icon-size"
              >
                &#xe6a7;
              </view>
              <view class="ml32">
                <text @click.stop="isClose = !isClose" class="mr12">
                  <text class="font-semibold">
                    {{
                      isClose
                        ? nameConvert(gStores.userStore.patChoose.patientName)
                        : gStores.userStore.patChoose.patientName
                    }}
                  </text>

                  <text
                    :style="{
                      top: '2px',
                    }"
                    class="iconfont icon-resize relative f48"
                  >
                    {{ isClose ? '&#xe6d4;' : '&#xe6db;' }}
                  </text>
                </text>
                <view v-if="getShowPatId" class="f28">
                  ID
                  {{ getShowPatId }}
                </view>
              </view>
            </view>
            <view class="switchPatient" @tap="chooseAction">更换就诊人</view>
          </block>
          <!-- 没有就诊人时 -->
          <block v-else>
            <view class="flex-normal">
              <view class="f48">
                <text>暂无就诊人</text>
              </view>
            </view>

            <view class="switchPatient" @tap="addPatient">添加就诊人</view>
          </block>
        </view>
      </block>
      <block v-else>
        <!-- 未登录 -->
        <view
          class="top-card-old flex-normal-between animate__animated animate__fadeIn pl32"
          :class="{ 'card-1001054': globalStore.sysCode === '1001054' }"
        >
          <view class="">
            <view class="f48">{{ getLangLabel('home:请登录') }}</view>
            <view class="f32">
              {{ getLangLabel('home:登录后享受更多服务') }}
            </view>
          </view>
          <button class="login-btn text-no-wrap">
            {{ getLangLabel('home:请登录') }}
          </button>
        </view>
      </block>
    </view>

    <view v-else class="color-fff">
      <view
        v-if="isHomeStyle1"
        class="mb24 bg-white rounded-xl pt16 pb16 pr24 pl24"
      >
        <homeLogin @add-pat="addPatient" @toggle-pat="chooseAction" />
      </view>

      <view v-else>
        <!-- 登录之后 -->
        <block v-if="globalStore.isLogin">
          <view
            :class="{ 'card-1001054': globalStore.sysCode === '1001054' }"
            class="top-card flex-normal-between animate__animated animate__fadeIn pl32"
          >
            <!-- 有就诊人时 -->
            <block v-if="getShowName">
              <view class="flex items-center">
                <view
                  v-if="personConfig.isQrCodeDisabled !== '1'"
                  @tap="cardClick"
                  class="iconfont icon-size f60"
                  :class="
                    gStores.globalStore.sysCode == '1001036' ? 'revent' : ''
                  "
                >
                  &#xe6a7;
                </view>
                <view class="f32 ml24">
                  <text @click.stop="isClose = !isClose" class="mr24 flex">
                    <text class="mr12 font-semibold f36">
                      {{
                        isClose
                          ? nameConvert(gStores.userStore.patChoose.patientName)
                          : gStores.userStore.patChoose.patientName
                      }}
                    </text>

                    <text
                      :style="{
                        top: '2px',
                      }"
                      class="iconfont icon-resize f48 relative"
                    >
                      {{ isClose ? '&#xe6d4;' : '&#xe6db;' }}
                    </text>
                  </text>
                  <text v-if="getShowPatId" class="f28">
                    ID
                    {{ getShowPatId }}
                  </text>
                </view>
              </view>
              <view class="switchPatient" @tap="chooseAction">更换就诊人</view>
            </block>
            <!-- 没有就诊人时 -->
            <block v-else>
              <view class="flex-normal">
                <view class="patient">
                  <text v-if="gStores.globalStore.sysCode === '1001081'">
                    请认真填写问卷内容，保证如实填写
                  </text>
                  <text v-else>暂无就诊人</text>
                </view>
              </view>
              <view
                v-if="gStores.globalStore.sysCode !== '1001081'"
                class="switchPatient"
                @tap="addPatient"
              >
                添加就诊人
              </view>
            </block>
          </view>
        </block>
        <block v-else>
          <!-- 未登录 -->
          <view
            class="top-card flex-normal-between animate__animated animate__fadeIn pl32"
          >
            <view class="flex-normal no-login">
              <text class="mr24">{{ getLangLabel('home:请登录') }}</text>
              <text>
                {{ getLangLabel('home:登录后享受更多服务') }}
              </text>
            </view>

            <button class="login-btn">
              {{ getLangLabel('home:请登录') }}
            </button>
          </view>
        </block>
      </view>
    </view>
  </g-login>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { GStores, routerJump, ISystemConfig, nameConvert } from '@/utils';
  import { IPat, isAreaProgram, useGlobalStore } from '@/stores';
  import { getLangLabel } from '@/config/lang';
  import { goElectronicMedicalCard } from '../utils';
  import globalGl from '@/config/global';

  import homeLogin from './home-login.vue';

  const globalStore = useGlobalStore();
  const gStores = new GStores();
  const emits = defineEmits(['choose-action', 'add-pat']);
  defineProps<{
    personConfig: ISystemConfig['person'];
  }>();

  const isClose = ref(true);

  const getShowName = computed(() => {
    return gStores.userStore.patChoose.patientName;
  });

  const getShowPatId = computed(() => {
    if (isAreaProgram()) {
      return '';
    }
    return gStores.userStore.patChoose._showId;
  });

  const isHomeStyle1 = computed(() => {
    return globalGl.sConfig.homeStyle === '1';
  });

  const chooseAction = () => {
    emits('choose-action');
  };

  const addPatient = () => {
    emits('add-pat');
  };

  const cardClick = (pat: IPat) => {
    gStores.userStore.updatePatClick(gStores.userStore.patChoose);
    goElectronicMedicalCard();
  };
</script>

<style lang="scss" scoped>
  .top-card {
    padding-top: var(--h-margin-24);
    margin: 0 26rpx;
    position: relative;
    box-sizing: border-box;
    background-color: var(--hr-brand-color-3);
    border: 2rpx solid var(--hr-brand-color-3);
    backdrop-filter: blur(30rpx);
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
    height: 100rpx;

    &::after {
      width: 100%;
      height: 112rpx;
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      content: '';

      border-radius: 24rpx 24rpx 15% 15%;

      background: var(--h-h-main-c);
    }
    .no-login {
      text {
        font-size: var(--hr-font-size-base);
        &:last-child {
          font-size: var(--hr-font-size-xxxs);
        }
      }
    }

    view.switchPatient {
      width: 180rpx;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0.5)
      );
      border-radius: 200rpx 0 0 200rpx;
      font-size: var(--hr-font-size-xs);
      font-weight: 400;
      color: var(--hr-brand-color-6);
      line-height: 64rpx;
      text-align: center;
    }
    view.no-login-tip {
      width: 124rpx;
    }
  }

  .login-btn {
    border: none !important;
    background-color: transparent;
    box-shadow: none !important;
    margin: 0;
    height: 64rpx;
    width: 144rpx;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0.5)
    );
    border-radius: 200rpx 0 0 200rpx;
    font-size: var(--hr-font-size-xs);
    font-weight: 400;
    color: var(--hr-brand-color-6);
    line-height: 64rpx;
    text-align: center;
    & button,
    & uni-button:after,
    & button:after {
      border: none !important;
      background-color: transparent;
      box-shadow: none !important;
      padding: 0;
    }
    &:after {
      background: none;
      border: none;
      padding: 0;
    }
  }

  .top-card-old {
    margin: 0 26rpx;
    box-sizing: border-box;

    border: 2rpx solid var(--hr-brand-color-3);
    backdrop-filter: blur(30rpx);
    border-radius: 24rpx;
    background: var(--hr-brand-color-6);
    height: 184rpx;

    .patient {
      text {
        display: block;
        font-size: 48rpx;
        line-height: 66rpx;

        &:last-child {
          font-size: var(--hr-font-size-xs);
          line-height: 50rpx;
        }
      }
    }

    .icon-size {
      font-size: 72rpx;
      margin-left: 32rpx;
      display: inline-block;
      color: var(--h-color-white);
    }

    view.switchPatient {
      width: 228rpx;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0.5)
      );
      border-radius: 200rpx 0 0 200rpx;
      font-size: 32rpx;
      font-weight: 400;
      color: var(--hr-brand-color-6);
      line-height: 72rpx;
      text-align: center;
    }
    view.no-login-tip {
      width: 124rpx;
    }
  }

  .system-style-medical {
    .homePage {
      .card {
        .top-menu {
          border-radius: 0 0 24rpx 24rpx;
        }
        .top-card,
        .top-card-old {
          margin: 0;
          &::after {
            background: #c79178 !important;
          }
        }
      }
    }
  }

  .card-1001054 {
    .top-card {
      // background-color: #00b39e !important;
      margin: 0 0 !important;
      .switchPatient,
      .login-btn {
        color: var(--hr-brand-color-8) !important;
      }
      &::after {
        background-color: var(--hr-brand-color-8) !important;
      }
    }
    .top-menu-normal {
      border: 2rpx solid var(--hr-brand-color-8) !important;
    }
  }
</style>
