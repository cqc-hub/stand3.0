<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <view class="absolute home-nav z-999">
      <!-- #ifndef MP-TOUTIAO -->
      <home-Nav v-model:height="navHeight" :opacity="navOpacity" />
      <!-- #endif -->
    </view>

    <scroll-view
      @scroll="pageScroll"
      @scrolltolower="handePageBottom"
      class="scroll-page g-container"
      scroll-y
    >
      <img
        v-if="$global.sConfig.homeTopBg"
        :src="$global.sConfig.homeTopBg"
        class="w-full absolute home-top-bg"
        mode="widthFix"
      />

      <img
        v-if="gStores.globalStore.isTcmStyle"
        :src="$global.BASE_IMG + `stand3_home_nav_bg-tcm.png`"
        class="w-full absolute home-nav-bg home-top-bg"
        mode="widthFix nav-img-bg"
        lazy-load
      />

      <view
        :style="{
          /* #ifndef MP-TOUTIAO */
          'margin-top': `${navHeight + 24}px`,
          /* #endif */
        }"
        class="relative z-1"
      >
        <ls-skeleton
          :skeleton="skeletonProps.skeleton"
          :loading="viewerStore.loading"
        >
          <!-- 正常版本 -->
          <view
            class="homePage"
            v-if="!gStores.globalStore.modeOld"
            :class="{
              [gStores.globalStore.getPageClass]: true,
            }"
          >
            <view class="safe-height" />
            <home1 @open-mode-old="openModeOld"  @wx-show-translate-tip="wxTranslateShow"  @open-share="openShare"/>

            <view v-if="$global.sConfig?.homeTopBanner?.topShow" class="mb24">
              <homeBanner
                :leftFunctionList="viewerStore.homeBannerLeftFunctionList"
                :functionList="viewerStore.homeBannerFunctionList"
                @open-share="openShare"
              />
            </view>

            <view
              class="card mb24"
              :class="getSysCode() == '1001054' ? 'cardNoMargin' : ''"
            >
              <view
                v-if="isHomeStyle1"
                class="mb24 bg-white rounded-xl pt16 pb16 pr24 pl24"
              >
                <homeLogin @add-pat="addPatient" @toggle-pat="chooseAction" />
              </view>

              <view v-else>
                <g-login @handler-next="routerJump">
                  <!-- 登录之后 -->
                  <block v-if="globalStore.isLogin">
                    <view
                      class="top-card flex-normal-between animate__animated animate__fadeIn"
                    >
                      <!-- 有就诊人时 -->
                      <block v-if="getShowName">
                        <view class="flex-normal">
                          <view
                            v-if="personConfig.isQrCodeDisabled !== '1'"
                            @tap="cardClick"
                            class="iconfont icon-size"
                            :class="getSysCode() == '1001036' ? 'revent' : ''"
                          >
                            &#xe6a7;
                          </view>
                          <view class="patient">
                            <text>
                              {{ getShowName }}
                            </text>
                            <text v-if="getShowPatId">
                              ID
                              {{ getShowPatId }}
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
                            <text v-if="globalGl.SYS_CODE === '1001081'">
                              请认真填写问卷内容，保证如实填写
                            </text>
                            <text v-else>暂无就诊人</text>
                          </view>
                        </view>
                        <view
                          v-if="globalGl.SYS_CODE !== '1001081'"
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
                      class="top-card flex-normal-between animate__animated animate__fadeIn"
                    >
                      <view class="flex-normal no-login">
                        <text>{{ getLangLabel('home:请登录') }}</text>
                        <text>
                          {{ getLangLabel('home:登录后享受更多服务') }}
                        </text>
                      </view>

                      <view
                        v-if="gStores.globalStore.ev === 'alipay'"
                        class="switchPatient no-login-tip"
                      >
                        {{ getLangLabel('home:请登录') }}
                      </view>

                      <button
                        v-if="
                          gStores.globalStore.ev &&
                          ['wx', 'web'].includes(gStores.globalStore.ev)
                        "
                        class="login-btn"
                      >
                        {{ getLangLabel('home:请登录') }}
                      </button>
                    </view>
                  </block>
                </g-login>
              </view>

              <view
                :class="{
                  'top-menu-style1': isHomeStyle1,
                  'top-menu-normal': !isHomeStyle1,
                }"
                class="top-menu"
              >
                <view
                  v-if="viewerStore.homeTopMenuList.length"
                  class="box pt24 mb24"
                >
                  <homeGrid
                    :list="viewerStore.homeTopMenuList"
                    :type="1"
                    @open-share="openShare"
                  />
                </view>
                <view
                  :class="{
                    normal: !isHomeStyle1,
                  }"
                  class="notice pr34 pl42 flex-normal g-fade-in"
                  @click="goToNotice1"
                  v-if="
                    viewerStore.homeNoticeText ||
                    healthCounselConfig?.noticeReplaceParam
                  "
                >
                  <template
                    v-if="healthCounselConfig?.noticeReplaceParam?.buttonName"
                  >
                    <text class="notice-button g-bold">
                      {{ healthCounselConfig?.noticeReplaceParam.buttonName }}
                    </text>
                  </template>
                  <template v-else>
                    <image
                      v-if="gStores.globalStore.isTcmStyle"
                      :src="$global.BASE_IMG + `img_announcement-tcm@3x.png`"
                      mode="widthFix"
                      class="icon-font notice-icon-size"
                    />
                    <text
                      v-else
                      class="icon-font img_announcement notice-icon-size"
                    />
                  </template>
                  <view class="bar-swiper pl24">
                    <uni-notice-bar
                      :text="
                        healthCounselConfig?.noticeReplaceParam?.text ||
                        viewerStore.homeNoticeText
                      "
                      :speed="80"
                      scrollable
                      color="var(--other-1)"
                      style="width: 100%"
                      background-color="transparent"
                    />
                  </view>
                </view>
              </view>
            </view>

            <view v-if="!$global.sConfig?.homeTopBanner?.topShow" class="mb24">
              <homeBanner
                :leftFunctionList="viewerStore.homeBannerLeftFunctionList"
                :functionList="viewerStore.homeBannerFunctionList"
                @open-share="openShare"
              />
            </view>

            <!-- #ifdef MP-WEIXIN -->
            <view>
              <official-account></official-account>
            </view>
            <!-- #endif -->
            <view
              v-if="
                globalGl.sConfig?.isOpenAssistMessage &&
                globalStore.isLogin &&
                getShowName
              "
              class="card"
            >
              <assist-message ref="assistMessageRef" />
            </view>
            <!-- #ifdef MP-ALIPAY -->
            <view v-if="globalGl.sConfig.isOpenAlipayFollow">
              <lifestyle :sceneId="globalGl.sConfig.isOpenAlipayFollow" />
            </view>
            <!-- #endif -->
            <view class="mt32" v-if="viewerStore.homeMenuList.length">
              <!--  :homeTabStyle="
                  gStores.globalStore.sysCode === '1001093' ? '1' : undefined
                " -->
              <homeMenu
                :list="viewerStore.homeMenuList"
                :tabIndex="props.tabIndex"
                :homeTabStyle="(isHomeStyle1 && '1') || undefined"
                @open-share="openShare"
              />
            </view>

            <view v-if="docRecommendList.length" class="mt24 mb24">
              <homeDocCommend :list="docRecommendList" />
            </view>

            <view v-if="isFeatureEnabled(globalGl.sConfig.isOpenPopularSci)">
              <homeArticle ref="HomeArticleRef" />
            </view>
            <homeButtomProductionIcon />

            <view></view>
          </view>

          <!-- 老年版本 -->
          <view v-else class="homePage">
            <view class="card safe-height">
              <!-- 登录之后 -->
              <block v-if="globalStore.isLogin">
                <view
                  class="top-card-old flex-normal-between animate__animated animate__fadeIn"
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
                      <view class="patient">
                        <text>
                          {{ getShowName }}
                        </text>
                        <text v-if="getShowPatId">
                          ID
                          {{ getShowPatId }}
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
                    <text>{{ getLangLabel('home:请登录') }}</text>
                    <text>{{ getLangLabel('home:登录后享受更多服务') }}</text>
                  </view>
                  <view
                    v-if="gStores.globalStore.ev === 'alipay'"
                    class="switchPatient no-login-tip"
                    @tap="goLogin"
                  >
                    {{ getLangLabel('home:请登录') }}
                  </view>
                  <button
                    v-if="gStores.globalStore.ev === 'wx'"
                    open-type="getPhoneNumber"
                    @getphonenumber="goLogin"
                    class="login-btn text-no-wrap"
                  >
                    {{ getLangLabel('home:请登录') }}
                  </button>
                </view>
              </block>

              <view class="top-menu-old">
                <view class="box" v-if="viewerStore.homeTopMenuList.length">
                  <homeGrid :list="viewerStore.homeTopMenuList" :type="3" />
                </view>
              </view>
              <view class="isCloseOld flex-normal" @tap="openModeOld">
                <view
                  :class="{
                    'color-444': gStores.globalStore.getPageClass,
                  }"
                  class="iconfont icon-size"
                >
                  &#xe700;
                </view>
                关闭长辈模式
              </view>
              <homeButtomProductionIcon />
            </view>
          </view>
        </ls-skeleton>
      </view>
    </scroll-view>

    <g-message
      v-if="gStores.globalStore.isShowFlag"
      :isWxAuthInit="gStores.globalStore.isShowFlag"
      :shouldEmitClickBtn="gStores.globalStore.isShowFlag"
      @click-btn="onAgree"
    />
    <g-message v-else />

    <!-- 首页悬浮球 -->
    <drag-button
      v-if="viewerStore.homeBallList && viewerStore.homeBallList.length === 1"
      :right="1"
      :edge="100"
      :offsetHeight="0"
      zid="33"
      @btnClick="useCommonTo(viewerStore.homeBallList[0])"
      isDock
      scrollY
    >
      <view class="auto-person g-fade-in">
        <text v-if="viewerStore.homeBallList[0].detail">
          {{ viewerStore.homeBallList[0].detail }}
        </text>
        <image
          :src="
            assistantImg
              ? `${globalGl.BASE_IMG}menu/${assistantImg}`
              : viewerStore.homeBallList[0].iconfont
          "
          mode="heightFix"
        ></image>
      </view>
    </drag-button>

    <choose-pat-action ref="actionSheet" @choose-pat="choosePatHandler" />

    <homePopup ref="refOldDialog" />
    <homeH5SharePopup
      ref="homeH5SharePopupRef"
      :configData="h5QrCodeData || undefined"
      @close-pop-click="closePopClick"
    />

    <homeTranslateWx ref="refWxTranslate" />

    <homeTabbar :systemModeOld="gStores.globalStore.modeOld" />
  </view>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { onLoad, onShow, onShareTimeline } from '@dcloudio/uni-app';

  import { useGlobalStore, isAreaProgram, type IPat } from '@/stores';
  import { useViewerStore } from '@/stores/modules/viewer';
  import {
    getLocalStorage,
    getSysCode,
    removeLocation,
  } from '@/common/useToken';

  import {
    aliLogin,
    wxLogin,
    GStores,
    routerJump,
    LoginUtils,
    PatientUtils,
    ServerStaticData,
    type ISystemConfig,
    isFeatureEnabled,
    wait,
    createSingleCallInTime,
  } from '@/utils';
  import { goElectronicMedicalCard } from './utils';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';
  import { useCacheStore } from '@/stores';
  import { useCommonTo } from '@/common/checkJump';
  import { getLangLabel } from '@/config/lang';

  import api from '@/service/api';
  import globalGl from '@/config/global';

  import homeBanner from './componetns/homeBanner.vue';
  import homeMenu from './componetns/homeMenu.vue';
  import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';
  import homeTabbar from './componetns/homeTabbar.vue';
  import homeGrid from './componetns/homeGrid.vue';
  import homeNav from './componetns/homeNav.vue';
  import homePopup from './componetns/homePopup.vue';
  import homeH5SharePopup from './componetns/homeH5SharePopup.vue';
  import homeArticle from './componetns/homeArticle/index.vue';
  import homeDocCommend from './componetns/homeDocCommend.vue';
  import homeButtomProductionIcon from './componetns/homeButtomProductionIcon.vue';
  import assistMessage from './componetns/assistMessage.vue';
  import homeLogin from './componetns/home-login.vue';
  import home1 from './componetns/home-1.vue';
  import homeTranslateWx from './componetns/homeTranslateWx.vue';

  const props = ref({
    code: '',
    tabIndex: 0,
    openId: '',
  });
  const gStores = new GStores();
  const cacheStore = useCacheStore();
  const patientUtils = new PatientUtils();
  const loginUtils = new LoginUtils();
  const viewerStore = useViewerStore();
  const globalStore = useGlobalStore();
  const refOldDialog = ref();
  const homeH5SharePopupRef = ref('' as any);
  const h5QrCodeData = ref();
  const personConfig = ref(<ISystemConfig['person']>{});
  const orderConfig = ref(<ISystemConfig['order']>{});
  const healthCounselConfig = ref(<ISystemConfig['HEALTH_COUNSEL']>{});
  const assistantImg = ref('');
  const HomeArticleRef = ref('' as any);
  const clickShareItem = ref<any>({});
  const docRecommendList = ref([] as any[]);
  const assistMessageRef = ref();
  const navOpacity = ref(0);
  const navHeight = ref(0);

  const isHomeStyle1 = computed(() => {
    return globalGl.sConfig.homeStyle === '1';
  });

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

  const actionSheet = ref<InstanceType<typeof ChoosePatAction>>();
  const chooseAction = () => {
    if (actionSheet.value) {
      actionSheet.value.show();
    }
  };
  const choosePatHandler = ({ item }: { item: IPat; number: number }) => {
    gStores.userStore.updatePatChoose(item);
  };

  const getShowName = computed(() => {
    return gStores.userStore.patChoose.patientName;
  });
  const getShowPatId = computed(() => {
    if (isAreaProgram()) {
      return '';
    }
    return gStores.userStore.patChoose._showId;
  });

  onShow(async () => {
    createSingleCallInTime(viewerStore.init, 1000 * 60 * 5, 'initViewStore')();

    // if (global.SYS_CODE === '1001067' && globalStore.openId) {
    //   const { ev } = gStores.globalStore;
    //   const userTag =
    //     ev === 'wx' ? '温附二微信小程序项目' : '温附二支付宝小程序项目';
    //   if (!uni.getStorageSync('wmUserInfo')) {
    //     uni.setStorageSync(
    //       'wmUserInfo',
    //       JSON.stringify({
    //         userId: globalStore.openId,
    //         userTag,
    //         projectVersion: '1.0.0',
    //         env: 'pro',
    //       })
    //     );
    //   }

    //   // @ts-expect-error
    //   require('../../js_sdk/webfunny.min.js', (mod) => {}, (err) => {
    //     console.error(err);
    //   });
    //   (() => import('@/js_sdk/webfunny.min.js'))();
    // }
    const { intelMedicalAssistConfig } = await ServerStaticData.getSystemConfig(
      'Electronic_Consultation_Sheet'
    );
    if (intelMedicalAssistConfig?.distinctiveImage?.imageList?.length) {
      assistantImg.value =
        globalStore?.intAssistantImg ||
        intelMedicalAssistConfig?.distinctiveImage?.imageList[0];
    }
    // #ifndef MP-TOUTIAO
    console.log(7777777777,assistMessageRef.value);
    
    if (
      globalGl.sConfig?.isOpenAssistMessage &&
      globalStore.isLogin &&
      getShowName
    ) {
      assistMessageRef.value?.reLoad();
    }
    // #endif
  });

  onLoad(async (opt) => {
    props.value = deQueryForUrl(deQueryForUrl(opt));
    personConfig.value = await ServerStaticData.getSystemConfig('person');
    orderConfig.value = await ServerStaticData.getSystemConfig('order');
    healthCounselConfig.value =
      await ServerStaticData.getSystemConfig('HEALTH_COUNSEL');

    const { isOpenAIPolicy, policyList } =
      await ServerStaticData.getSystemConfig('RestOfConfig');
    if (
      isOpenAIPolicy === '1' ||
      (policyList && policyList.length && policyList[0].length)
    ) {
      const list =
        policyList && policyList.length && policyList[0].length
          ? policyList[0]
          : undefined;
      cacheStore.changeFlagList(list, isOpenAIPolicy === '1');
    }

    if (gStores.globalStore.ev === 'wx') {
      if (props.value.code && !gStores.globalStore.h5OpenId) {
        const getNoPublicOpenIdOnly =
          getLocalStorage('getNoPublicOpenIdOnly') === '1';

        // 免完善扫码进来
        if (getNoPublicOpenIdOnly) {
          if (gStores.globalStore.herenId) {
            await patientUtils.getPatCardList();
          }

          removeLocation('getNoPublicOpenIdOnly');
        }
        await loginUtils.getNoPublicOpenId(
          props.value.code,
          getNoPublicOpenIdOnly
        );

        if (gStores.globalStore.isLogin) {
          await patientUtils.getPatCardList();
        }

        routerJump();
      }
      if (props.value.openId) {
        globalStore.setH5OpenId(props.value.openId);

        if (globalStore.herenId) {
          loginUtils.sysPatOpenIdAssignment(props.value.openId);
        }

        if (globalStore.token.accessToken) {
          await loginUtils.getUerInfo();
        }
        routerJump();
      }
      wx.showShareMenu({
        // 要求小程序返回分享目标信息
        withShareTicket: true,
      });
    }

    if (gStores.globalStore.ev === 'alipay') {
      //对接支付宝首页消息提醒
      const alipayPid =
        globalGl.systemInfo.alipayPid || globalGl.sConfig.isOpenMessageAuth;
      alipayPid &&
        globalStore.isLogin &&
        !uni.getStorageSync('hospital_order') &&
        authorization();
    }
  });

  const getDocRecommendList = async () => {
    const { result = [] } = await api.getPopularDoctors({});
    docRecommendList.value = result;
  };

  let popularDocRequested = false;
  //当用户将页面滑倒底部
  const handePageBottom = () => {
    const { isOpenHomeDoctorBanner } = orderConfig.value;

    //有开启健康科普
    if (isFeatureEnabled(globalGl.sConfig.isOpenPopularSci)) {
      //查询列表
      HomeArticleRef.value.init();
    }

    if (isOpenHomeDoctorBanner === '1' && !docRecommendList.value.length) {
      if (!popularDocRequested) {
        popularDocRequested = true;
        getDocRecommendList();
      }
    }
  };

  if (gStores.globalStore.ev === 'wx') {
    //分享到朋友圈
    onShareTimeline(() => {
      return {
        title: globalGl.systemInfo.name,
        query: '',
      };
    });
  }
  //用户滑倒底部

  //打开关注框
  const openShare = (item, type?) => {
    console.log('openShare', item, type);
    if (type === 'attention') {
      h5QrCodeData.value = item.query && JSON.parse(item.query);
      clickShareItem.value = item;
    } else {
      h5QrCodeData.value = item;
    }
    homeH5SharePopupRef.value.show();
  };
  const closePopClick = () => {
    const query = clickShareItem.value.query;
    if (query && JSON.parse(query).attention === '1') {
      setTimeout(() => {
        useCommonTo(clickShareItem.value);
      }, 500);
    }
  };

  const goToNotice1 = () => {
    if (healthCounselConfig.value?.noticeReplaceParam) {
      const { noticeReplaceParam: query } = healthCounselConfig.value;
      if (query.path === 'showCareModel') {
        openShare(query.addition);
        return;
      }
      useCommonTo(query);
      return;
    }
    //跳咨询列表页面
    uni.navigateTo({
      url: joinQueryForUrl('/pagesC/cloudHospital/myPath', {
        path: '/pagesA/healthAdvisory/healthAdvisory',
        _type: '1',
      }),
    });
  };

  const goLogin = async (e: any) => {
    const { ev } = gStores.globalStore;

    if (ev === 'alipay') {
      await aliLogin();
    } else if (ev === 'wx') {
      await wxLogin(e);
    }

    routerJump();
  };
  const addPatient = () => {
    if (actionSheet.value) {
      actionSheet.value.goAddPat();
    }
  };
  const getSelfPat = (): IPat => {
    const selfPat = gStores.userStore.patList.find(
      (pat: IPat) => pat.relationship === '本人'
    );
    return selfPat || gStores.userStore.patList[0];
  };
  const cardClick = (pat: IPat) => {
    gStores.userStore.updatePatClick(gStores.userStore.patChoose);
    goElectronicMedicalCard();
  };

  const goClinicPay = () => {
    uni.scanCode({
      success(res) {
        console.warn('扫码内容', res);
        let data = JSON.parse(res.result);
        if (data.no || data.pid || data.sid) {
          uni.navigateTo({
            url: '/pagesA/clinicPay/clinicPayDetail',
          });
        } else {
          gStores.messageStore.showMessage('请扫描正确的二维码', 1500);
        }
      },
    });
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

  const refWxTranslate = ref('' as any);
  const wxTranslateShow = () => {
    refWxTranslate.value.show();
  };

  const onAgree = () => {
    gStores.globalStore.setShowFlag(false);
  };

  const pageScroll = ({ detail }) => {
    const { scrollTop } = detail;
    const top: number = scrollTop > 80 ? 100 : scrollTop;
    navOpacity.value = top / 100;
  };
</script>

<style lang="scss" scoped>
  .g-page {
    background: #ffffff;

    --h-h-main-c: var(--hr-brand-color-6);

    &.system-style-medical {
      --h-h-main-c: #a4695b;
    }
  }

  .home-nav {
    left: 0;
    right: 0;
  }
  .home-top-bg {
    top: 0;
  }

  .home-nav-bg {
    -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 1) calc(100% - 40px),
      rgba(0, 0, 0, 0) 100%
    );
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 1) calc(100% - 40px),
      rgba(0, 0, 0, 0) 100%
    );
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
      height: 148rpx;
    }
  }

  .homePage {
    padding: 0 32rpx 188rpx 32rpx;

    .card {
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
        &.top-menu-style1 {
          background: #fff;
          box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(15px);
        }

        &.top-menu-normal {
          background: var(--hr-brand-color-3-light);
          box-shadow: 0px 8rpx 40rpx 0rpx rgba(0, 0, 0, 0.06);
          border: 2rpx solid var(--hr-brand-color-3);
        }
        border-radius: 24rpx;
        .box {
          // padding: 40rpx 0 35rpx 0;
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
        border-radius: 0 0 24rpx 24rpx;

        &.normal {
          box-shadow: 0 2rpx 0 0 var(--hr-brand-color-3) inset;
          background: #fefefe;
        }

        .notice-button {
          color: var(--hr-brand-color-6);
          display: inline-block;
          line-height: 60rpx;
        }
        .notice-icon-size {
          width: 60rpx;
          height: 60rpx;
          transform: translateY(-1px);
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

    .official-list {
      height: 82rpx;
      width: 100%;
      margin-bottom: -17rpx;
      margin-top: 10rpx;
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

  .nav-img-bg {
    top: 0;
  }

  ::v-deep .uni-page-head {
    display: none !important;
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
  .revent {
    background-color: #fff;
    color: var(--h-qrcode-2) !important;
    border-radius: 50%;
    padding: 6px;
    font-size: 56rpx !important;
  }
  .cardNoMargin {
    .top-card {
      margin: 0 0 !important;
    }
  }
</style>
