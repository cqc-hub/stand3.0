<template>
  <view class="g-page">
    <home-Nav />
    <scroll-view class="scroll-page g-container" scroll-y>
      <ls-skeleton
        :skeleton="skeletonProps.skeleton"
        :loading="viewerStore.loading"
      >
        <!-- 正常版本 -->
        <view
          class="homePage"
          v-if="!gStores.globalStore.modeOld"
          :class="{
            'system-mode-old': gStores.globalStore.modeOld,
          }"
        >
          <view
            class="search flex-between"
            v-if="global.sConfig.isHideHomeSearch != '1'"
          >
            <!-- 在有搜索框的前提下 是否开启助老版本 -->
            <template v-if="global.sConfig.isOpenHelpOld == '1'">
              <view class="w70" @click.prevent="goSearch">
                <view class="my-disabled">
                  <uni-search-input
                    :type="'2'"
                    inputBorder
                    :placeholder="viewerStore.homeSearchPlaceholder"
                  />
                </view>
              </view>
              <view class="openOld" @tap="openModeOld">
                <view class="iconfont icon-size">&#xe700;</view>
                长辈模式
              </view>
            </template>
            <template v-else>
              <view class="w100" @click.prevent="goSearch">
                <view class="my-disabled">
                  <uni-search-input
                    :type="'2'"
                    inputBorder
                    :placeholder="viewerStore.homeSearchPlaceholder"
                  />
                </view>
              </view>
            </template>
          </view>

          <view class="card">
            <g-login @handler-next="routerJump">
              <!-- 登录之后 -->
              <block v-if="globalStore.isLogin">
                <view
                  class="top-card flex-normal-between animate__animated animate__fadeIn"
                >
                  <!-- 有就诊人时 -->
                  <block v-if="gStores.userStore.patChoose.patientName">
                    <view class="flex-normal">
                      <view @tap="cardClick" class="iconfont icon-size">
                        &#xe6a7;
                      </view>
                      <view class="patient">
                        <text>
                          {{ gStores.userStore.patChoose.patientNameEncry }}
                        </text>
                        <text
                          v-if="
                            !isAreaProgram() &&
                            gStores.userStore.patChoose._showId
                          "
                        >
                          ID
                          {{ gStores.userStore.patChoose._showId }}
                        </text>
                      </view>
                    </view>
                    <view class="switchPatient" @tap="chooseAction">
                      更换就诊人
                    </view>
                  </block>
                  <!-- 没有就诊人时 -->
                  <block v-else>
                    <view class="flex-normal">
                      <view class="patient">
                        <text>暂无就诊人</text>
                      </view>
                    </view>
                    <view class="switchPatient" @tap="addPatient">
                      添加就诊人
                    </view>
                  </block>
                </view>
              </block>
              <block v-else>
                <!-- 未登录 -->
                <view
                  class="top-card flex-normal-between animate__animated animate__fadeIn"
                >
                  <view class="flex-normal no-login">
                    <!-- <g-login @handler-next="routerJump"> -->
                    <text>请登录</text>
                    <text>登录后享受更多服务</text>
                    <!-- </g-login> -->
                  </view>

                  <!-- <g-login @handler-next="routerJump"> -->
                  <!-- #ifdef MP-ALIPAY -->
                  <view class="switchPatient no-login-tip">请登录</view>
                  <!-- #endif -->

                  <!-- #ifdef MP-WEIXIN | H5 -->
                  <button class="login-btn">请登录</button>
                  <!-- #endif -->
                  <!-- </g-login> -->
                </view>
              </block>
            </g-login>

            <view class="top-menu">
              <view class="box" v-if="viewerStore.homeTopMenuList.length">
                <homeGrid
                  :list="viewerStore.homeTopMenuList"
                  :type="1"
                ></homeGrid>
              </view>
              <view
                class="notice flex-normal g-fade-in"
                v-if="viewerStore.homeNoticeText"
              >
                <text class="icon-font img_announcement icon-size"></text>
                <view class="bar-swiper">
                  <uni-notice-bar
                    :text="viewerStore.homeNoticeText"
                    :speed="80"
                    scrollable
                    color="--hr-neutral-color-10"
                    style="width: 100%"
                    background-color="transparent"
                    @click="goToNotice1"
                  />
                </view>
              </view>
            </view>
          </view>

          <view class="banner-menu">
            <homeBanner
              :leftFunctionList="viewerStore.homeBannerLeftFunctionList"
              :functionList="viewerStore.homeBannerFunctionList"
              @open-share="openShare"
            />
          </view>

          <!-- #ifdef MP-WEIXIN -->
          <drag-button
            v-if="global.sConfig.isOpenIntelQA"
            :right="1"
            :edge="100"
            :zid="33"
            @btnClick="gotoIntelQA"
            isDock
            scrollY
          >
            <view class="auto-person g-fade-in">
              <text>智能客服</text>
              <image :src="$global.BASE_IMG + 'auto.png'"></image>
            </view>
          </drag-button>
          <!-- #endif -->

          <!-- #ifdef MP-WEIXIN -->
          <view>
            <official-account></official-account>
          </view>
          <!-- #endif -->
          <view class="fun-list" v-if="viewerStore.homeMenuList.length">
            <homeMenu
              :list="viewerStore.homeMenuList"
              :tabIndex="props.tabIndex"
              @open-share="openShare"
            />
          </view>
          <view class="bg-back" v-if="!global.systemInfo.isHideHomeLogo">
            <image
              :src="$global.BASE_IMG + 'img_logo@3x.png'"
              mode="widthFix"
            />
          </view>

          <view></view>
        </view>
        <!-- 老年版本 -->
        <view
          v-else
          class="homePage"
          :class="{
            'system-mode-old': gStores.globalStore.modeOld,
          }"
        >
          <view class="card">
            <!-- 登录之后 -->
            <block v-if="globalStore.isLogin">
              <view
                class="top-card-old flex-normal-between animate__animated animate__fadeIn"
              >
                <!-- 有就诊人时 -->
                <block v-if="gStores.userStore.patChoose.patientName">
                  <view class="flex-normal">
                    <view @tap="cardClick" class="iconfont icon-size">
                      &#xe6a7;
                    </view>
                    <view class="patient">
                      <text>
                        {{ gStores.userStore.patChoose.patientNameEncry }}
                      </text>
                      <text
                        v-if="
                          !isAreaProgram() &&
                          gStores.userStore.patChoose._showId
                        "
                      >
                        ID
                        {{ gStores.userStore.patChoose._showId }}
                      </text>
                    </view>
                  </view>
                  <view class="switchPatient" @tap="chooseAction">
                    更换就诊人
                  </view>
                </block>
                <!-- 没有就诊人时 -->
                <block v-else>
                  <view class="flex-normal">
                    <view class="patient-old">
                      <text>暂无就诊人</text>
                    </view>
                  </view>
                  <view class="switchPatient" @tap="addPatient">
                    添加就诊人
                  </view>
                </block>
              </view>
            </block>
            <block v-else>
              <!-- 未登录 -->
              <view
                class="top-card-old flex-normal-between animate__animated animate__fadeIn"
              >
                <view class="no-login">
                  <text>请登录</text>
                  <text>登录后享受更多服务</text>
                </view>
                <!-- #ifdef MP-ALIPAY -->
                <view class="switchPatient no-login-tip" @tap="goLogin">
                  请登录
                </view>
                <!-- #endif -->
                <!-- #ifdef MP-WEIXIN -->
                <button
                  open-type="getPhoneNumber"
                  @getphonenumber="goLogin"
                  class="login-btn"
                >
                  请登录
                </button>
                <!-- #endif -->
              </view>
            </block>

            <view class="top-menu-old">
              <view class="box" v-if="viewerStore.homeTopMenuList.length">
                <homeGrid
                  :list="viewerStore.homeTopMenuList"
                  :type="3"
                ></homeGrid>
              </view>
            </view>
            <view class="isCloseOld flex-normal" @tap="openModeOld">
              <view class="iconfont icon-size">&#xe700;</view>
              关闭长辈模式
            </view>
            <view class="bg-back" v-if="!global.systemInfo.isHideHomeLogo">
              <image
                :src="$global.BASE_IMG + 'img_logo@3x.png'"
                mode="widthFix"
              />
            </view>
          </view>
        </view>
      </ls-skeleton>
    </scroll-view>
    <g-message />
    <choose-pat-action ref="actionSheet" @choose-pat="choosePatHandler" />

    <homePopup ref="refOldDialog" />
    <homeH5SharePopup
      ref="homeH5SharePopupRef"
      :imageUrl="$global.BASE_IMG + h5QrCodeImg"
    />

    <homeTabbar :systemModeOld="gStores.globalStore.modeOld" />
  </view>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';

  import { useGlobalStore, isAreaProgram, type IPat } from '@/stores';
  import { useViewerStore } from '@/stores/modules/viewer';
  import {
    aliLogin,
    wxLogin,
    GStores,
    routerJump,
    LoginUtils,
    Login,
    LoginType,
  } from '@/utils';

  import global from '@/config/global';
  import api from '@/service/api';

  import homeBanner from './componetns/homeBanner.vue';
  import homeMenu from './componetns/homeMenu.vue';
  import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';
  import homeTabbar from './componetns/homeTabbar.vue';
  import homeGrid from './componetns/homeGrid.vue';
  import homeNav from './componetns/homeNav.vue';
  import homePopup from './componetns/homePopup.vue';
  import homeH5SharePopup from './componetns/homeH5SharePopup.vue';

  const props = defineProps<{
    code?: string;
    tabIndex?: number;
  }>();
  const gStores = new GStores();
  const viewerStore = useViewerStore();
  const globalStore = useGlobalStore();
  const refOldDialog = ref();
  const homeH5SharePopupRef = ref('' as any);
  const h5QrCodeImg = ref('lqCode.jpg');
  const tabIndex = ref(0);

  //骨架屏配置
  const skeletonProps = ref({
    skeleton: [
      'line-lg',
      24,
      'line-lg',
      'card+card+card+card',
      24,
      'card-lg+card-lg',
      32,
      'line-lg',
      'card-sm+card-sm+card-sm+card-sm',
      0,
      'card-sm+card-sm+card-sm+card-sm',
    ],
  });
  // 就诊人

  const actionSheet = ref<InstanceType<typeof ChoosePatAction>>();
  const chooseAction = () => {
    if (actionSheet.value) {
      actionSheet.value.show();
    }
  };
  const choosePatHandler = ({ item }: { item: IPat; number: number }) => {
    gStores.userStore.updatePatChoose(item);
  };

  onShow(() => {
    viewerStore.init();
  });

  onLoad(() => {
    //设置顶部标题
    uni.setNavigationBarTitle({
      title: global.systemInfo.name,
    });
    // #ifdef MP-WEIXIN
    if (props.code) {
      new LoginUtils().getNoPublicOpenId(props.code).then(() => {
        routerJump();
      });
    }
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true,
    });
    // #endif

    // #ifdef MP-ALIPAY
    //对接支付宝首页消息提醒
    const alipayPid = global.systemInfo.alipayPid;
    alipayPid &&
      globalStore.isLogin &&
      !uni.getStorageSync('hospital_order') &&
      authorization();
    // #endif

    if (globalStore.envH5 === 'web' && !gStores.globalStore.isLogin) {
      Login.handler(LoginType.PassWord, {
        cellPhoneNum: '15797812958',
        password: '123456',
      });
    }
  });

  //跳转智能问答
  const gotoIntelQA = () => {
    if (global.sConfig.isOpenIntelQA) {
      uni.navigateToMiniProgram({
        appId: global.sConfig.isOpenIntelQA.appId,
        path: global.sConfig.isOpenIntelQA.path,
      });
    }
  };
  //打开关注框
  const openShare = (item) => {
    if (!item) {
      return;
    }

    h5QrCodeImg.value = item;
    homeH5SharePopupRef.value.show();
  };

  const goToNotice1 = () => {
    //跳咨询列表页面
    uni.navigateTo({
      url: '/pagesC/cloudHospital/myPath?path=/pagesA/healthAdvisory/healthAdvisory&_type=1',
    });
  };

  const goLogin = async (e: any) => {
    // #ifdef MP-ALIPAY
    await aliLogin();
    // #endif

    // #ifdef MP-WEIXIN
    await wxLogin(e);
    // #endif

    routerJump();
  };
  const addPatient = () => {
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/medicalCardMan',
    });
  };

  const cardClick = (pat: IPat) => {
    gStores.userStore.updatePatClick(gStores.userStore.patChoose);
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/electronicMedicalCard',
    });
  };

  const goSearch = () => {
    let searchConfig = viewerStore.viewConfig[8]?.showFlag;
    if (searchConfig == 1) {
      uni.navigateTo({
        url: '/pagesA/MyRegistration/RegSearch',
      });
    } else {
      let url =
        (global.env as string) === 'prod'
          ? 'https://h5.eheren.com/V3_h5/#/pagesA/diseaseCyclopedia/smartChatRoom'
          : 'https://health.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/smartChatRoom';
      uni.navigateTo({
        url: '/pagesC/cloudHospital/myPath?type=1&path=' + url,
      });
    }
  };
  // #ifdef MP-ALIPAY
  //支付宝——首页消息推送
  const authorization = () => {
    my.getAuthCode({
      scopes: ['hospital_order'], // 主动授权：auth_user，静默授权：auth_base。或者其它scope
      success: async (res) => {
        let resp = await api.authorization({
          accountType: globalStore.browser.accountType,
          code: res.authCode,
          userId: globalStore.openId,
        });
        uni.setStorageSync('hospital_order', resp.result);
      },
    });
  };
  // #endif
  const openModeOld = () => {
    if (refOldDialog.value) {
      refOldDialog.value.show();
    }
  };
</script>

<style lang="scss" scoped>
  .g-page {
    background: #ffffff;
  }
  .auto-person {
    position: relative;
    z-index: 999;
    text {
      position: absolute;
      bottom: 9px;
      color: #fff;
      font-size: 24rpx;
      left: 23rpx;
      z-index: 999;
    }
    image {
      width: 140rpx;
      height: 148rpx;
    }
  }

  .homePage {
    padding: 0 32rpx 188rpx 32rpx;
    .search {
      padding-top: 32rpx;
    }
    .w70 {
      width: 70%;
    }
    .w100 {
      width: 100%;
    }
    .openOld {
      width: 200rpx;
      height: 64rpx;
      background: var(--hr-brand-color-6);
      border-radius: 32rpx 0 0 32rpx;
      color: #fff;
      font-size: var(--hr-font-size-xs);
      padding: 12rpx 24rpx;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      margin-right: -32rpx;
      white-space: nowrap;
      .icon-size {
        font-size: var(--h-size-40);
        color: #fff;
        font-weight: 400;
      }
    }

    .card {
      margin-top: var(--h-margin-24);
      .top-card {
        padding-top: var(--h-margin-24);
        margin: 0 26rpx;
        position: relative;
        box-sizing: border-box;

        border: 2rpx solid #dfe9ff;
        backdrop-filter: blur(30rpx);
        border-radius: 24rpx;

        height: 100rpx;

        .patient {
          text {
            display: block;
            font-size: var(--hr-font-size-base);
            line-height: 44rpx;

            &:last-child {
              font-size: var(--hr-font-size-xs);
              line-height: 40rpx;
            }
          }
        }
        &::after {
          width: 100%;
          height: 112rpx;
          position: absolute;
          left: 0;
          top: 0;
          z-index: -1;
          content: '';

          border-radius: 24rpx 24rpx 15% 15%;

          background: var(--hr-brand-color-6);
        }
        .no-login {
          text {
            font-size: var(--hr-font-size-base);
            &:last-child {
              font-size: var(--hr-font-size-xxxs);
            }
          }
        }

        .icon-size {
          font-size: var(--h-iconfont-60);
          margin-left: 56rpx;
          display: inline-block;
          color: var(--h-color-white);
        }

        text {
          font-size: var(--h-size-40);
          font-weight: var(--h-weight-2);
          text-align: left;
          color: var(--h-color-white);
          margin-left: 24rpx;
          line-height: 60rpx;
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

      .top-menu {
        background: #f2f6ff;
        border: 2rpx solid #dfe9ff;
        border-radius: 24rpx;
        box-shadow: 0px 8rpx 40rpx 0rpx rgba(0, 0, 0, 0.06);
        .box {
          padding: 40rpx 0 35rpx 0;
          min-height: 145rpx;
        }

        .bar-swiper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          flex: 1;
          position: relative;
          // #ifdef MP-WEIXIN
          top: 10rpx;
          // #endif

          .swiper-item {
            display: flex;
            align-items: center;
            color: var(--hr-neutral-color-9);
            font-size: var(--hr-font-size-xs);
            .item-box {
              word-break: break-all;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              width: 100%;
            }
          }
        }
      }

      .notice {
        height: 78rpx;
        background: #fefefe;
        border-radius: 0 0 24rpx 24rpx;
        box-shadow: 0 2rpx 0 0 #dfe9ff inset;
        padding: 0 31rpx;

        .icon-size {
          width: 64rpx;
          height: 64rpx;
          // margin-right: 16rpx;
        }

        text {
          color: var(--hr-neutral-color-9);
          font-size: var(--hr-font-size-xs);
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    .banner-menu {
      margin: var(--h-margin-24) 0;
    }

    .official-list {
      height: 82rpx;
      width: 100%;
      margin-bottom: -17rpx;
      margin-top: 10rpx;
    }

    .fun-list {
      margin-top: var(--h-margin-24);
    }
    .bg-back {
      margin: 30rpx auto 20rpx;
      text-align: center;

      image {
        width: 180rpx;
        height: 80rpx;
      }
    }
  }

  .uni-noticebar {
    margin: 0;
    width: 100%;
  }
  .top-menu-old {
    margin-top: 32rpx;
  }
  .isCloseOld {
    width: 384rpx;
    color: #444;
    padding: 24rpx 0 22rpx;
    background: #ffffff;
    border: 2rpx solid #cccccc;
    border-radius: 50px;
    margin: 80rpx auto;
    justify-content: center;
    .icon-size {
      font-size: 42rpx;
    }
  }
  .top-card-old {
    margin: 0 26rpx;
    box-sizing: border-box;

    border: 2rpx solid #dfe9ff;
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
    .no-login {
      text {
        font-size: 48rpx;
        display: block;
        &:last-child {
          font-size: 32rpx;
        }
      }
    }

    .icon-size {
      font-size: 72rpx;
      margin-left: 32rpx;
      display: inline-block;
      color: var(--h-color-white);
    }

    text {
      font-size: var(--h-size-40);
      font-weight: var(--h-weight-2);
      text-align: left;
      color: var(--h-color-white);
      margin-left: 24rpx;
      line-height: 60rpx;
    }

    .patient-old {
      text {
        font-size: 48rpx !important;
      }
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
</style>
