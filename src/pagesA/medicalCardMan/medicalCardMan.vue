<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="f32"
  >
    <g-flag typeFg="108" isShowFg />
    <view class="pat-box">
      <view v-if="isShowHealthCardMode" class="health-card">
        <view
          v-if="!isNewHealthCard"
          @click="associatedHealthCard"
          class="mr14"
        >
          <view class="iconfont icon-resize color-blue">&#xe6ef;</view>
          <text class="text-no-wrap">关联已有健康卡</text>
        </view>

        <!-- 新健康卡 -->
        <view v-if="isNewHealthCard" >
          <view class="iconfont icon-resize color-purple">&#xe6f8;</view>
          <text v-if="!isShowHealthLogin" class="text-no-wrap" @click="addPatPage">申领或关联健康卡</text>
          <health-card-login
                v-else
                :authLogin="false"
                :hidden="!isShowHealthLogin"
                @authSucess="addPatPage"
                @authCancel="isShowHealthLogin = false"
                wechatcode
              >
                <view class="text-no-wrap">再次点击授权</view>
              </health-card-login>
        </view>

        <view v-else @click="addPatPage">
          <view class="iconfont icon-resize color-purple">&#xe6f8;</view>
          <text class="text-no-wrap">申领健康卡</text>
        </view>




        <!-- <view @click="createCard">
          <view class="iconfont icon-resize color-purple">&#xe6f8;</view>
          <text class="text-no-wrap">申领健康卡</text>
        </view> -->
      </view>

      <view v-else class="add-pat-box" @click="addPatPage">
        <view class="add-pat g-flex-rc-cc">
          <view class="iconfont icon-resize">&#xe6ab;</view>
          <text class="text-no-wrap">添加就诊人</text>
        </view>
      </view>
    </view>

    <view v-if="gStores.userStore.patList.length">
      <pat-List
        :list="gStores.userStore.patList"
        @profile-click="profileClick"
        @card-click="cardClick"
      >
        <template #footer="{ pat }: { pat: IPat }">
          <view>
            <view
              v-if="getRealNameAuth.length"
              class="pat-btns flex-normal mt16"
            >
              <view
                v-if="pat.realNameAuth === '0'"
                @click="realNameAuth(pat)"
                class="btn btn-round btn-border btn-plain btn-size-small color-dark"
              >
                去认证
              </view>
            </view>
            <!-- #ifdef MP-ALIPAY -->
            <view
              v-if="
                $global.sConfig.medicalMHelp &&
                $global.sConfig.medicalMHelp.alipay &&
                $global.sConfig.medicalMHelp.alipay.medicalFiling === '1' &&
                pat.healthCardUser !== '2'
              "
              class="pat-btns flex-normal mt16"
            >
              <view
                @click="goMedicalFiling(pat)"
                class="btn btn-round btn-border btn-plain btn-size-small color-dark"
              >
                医保建档
              </view>
            </view>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <block
              v-if="
                $global.systemInfo.isOpenHealthCard && !pat.healthQrCodeText
              "
            >
              <view
                v-if="!isShowHealthLogin&&!isNewHealthCard"
                @click="upToHealthCord(pat)"
                class="jkk"
              >
                升级为电子健康卡
              </view>

              <health-card-login
                v-else-if="!isNewHealthCard"
                :authLogin="false"
                :hidden="!isShowHealthLogin"
                @authSucess="upToHealthCord(pat)"
                @authCancel="isShowHealthLogin = false"
                wechatcode
              >
                <view class="jkk" >再次点击授权</view>
              </health-card-login>
            </block>
            <!-- #endif -->

            <view
              v-if="
                $global.sConfig.medicalMHelp &&
                $global.sConfig.medicalMHelp.isOpenPatToMedicalPat &&
                pat.healthCardUser === '1'
              "
              @click="upToMedicalPat(pat)"
              class="jkk"
            >
              更新为医保用户
            </view>
          </view>
        </template>
      </pat-List>
    </view>

    <view class="empty-list" v-else>
      <g-empty :current="1" />
    </view>

    <canvas
      v-show="false"
      :width="imgCanvas.imgWidth"
      :height="imgCanvas.imgHeight"
      style="opacity: 0; position: absolute; pointer-events: none"
      id="canvasForBase64"
    />
    <g-message />
  </view>
  <Order-Reg-Confirm
    :headerIcon="$global.BASE_IMG + 'v3-order-reg-confirm-add.png'"
    v-if="isMedicalFiling"
    title="是否更新为医保用户？"
    :maskClickClose="false"
    @confirm="medicalFiling"
    height="35vh"
    confirmText="确定"
    cannerText="取消"
    ref="regDialogMedicalFiling"
  >
    仅账号本人可更新为医保用户，是否更新为医保用户？
  </Order-Reg-Confirm>
</template>

<script lang="ts" setup>
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { IPat, useRouterStore } from '@/stores';
  import { ref, provide, readonly, computed, Ref } from 'vue';
  import {
    getHealthCardCode,
    healthCardLink,
    backWithFaceVerify,
    healthCardBind,
  } from './utils/index';
  import { deQueryForUrl } from '@/common';
  import { goElectronicMedicalCard } from '@/pages/home/utils';
  import {
    GStores,
    PatientUtils,
    apiAsync,
    ServerStaticData,
    useOcr,
    LoginUtils,
    routerJump,
    useTBanner,
    type ISystemConfig,
  } from '@/utils';
  import {
    dealMedicalFiling,
    reDealMedicalFiling,
  } from '@/pagesA/clinicPay/utils/clinicPayDetail';

  import globalGl from '@/config/global';
  import api from '@/service/api';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import PatList from './components/PatList.vue';

  const gStores = new GStores();
  const routeStore = useRouterStore();
  const pageProps = ref(
    <
      {
        _url?: string;

        // 健康卡逻辑
        _healthType?:
          | 'FaceVerify'
          | 'associate'
          | 'failRedirect'
          | 'verifyFail';
        healthCode?: string;
        orderId?: string;
        redirectUrl?: string;
        verifyType?: '1';
        regInfoCode?: string;
      }
    >{}
  );

  const isShowHealthCardMode = ref(false);
  const patientUtils = new PatientUtils();
  const pageConfig = ref(<ISystemConfig['person']>{});
  provide('pageConfig', () => readonly(pageConfig.value));
  const regDialogMedicalFiling: Ref<any> = ref('');
  const medicalFilingPat: Ref<any> = ref('');
  const isMedicalFiling = ref(false);
  const isNewHealthCard = ref(false);
  const getRealNameAuth = computed(() => {
    return pageConfig.value.realNameAuth || [];
  });

  // #ifdef MP-WEIXIN
  if (globalGl.systemInfo.isOpenHealthCard) {
    isShowHealthCardMode.value = true;
  }
  // #endif

  const isShowHealthLogin = ref(false);

  const test = (val) => {
    console.log('pageConfig.value', val);
  };
  const upToHealthCord = async (pat: IPat) => {
    // #ifdef MP-WEIXIN
    const { success, res } = await getHealthCardCode();
    if (success) {
      const {
        result: { wechatCode },
      } = res;
      isShowHealthLogin.value = false;
      const requestArg = {
        wechatCode,
        patientId: pat.patientId,
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
      gStores.messageStore.showMessage('未授权， 请再次点击进行授权', 3000);
      isShowHealthLogin.value = true;
      return Promise.reject(void 0);
    }
    // #endif
  };

  const upToMedicalPat = async (pat: IPat) => {
    const { confirm } = await apiAsync(uni.showModal, {
      content: '确定升级为医保用户?',
    });

    if (confirm) {
      await patientUtils.upToMedicalPat({ pat });
    }
  };

  const addPatPage = () => {
    if (isNewHealthCard.value) {
      healthCardBind().catch(()=>{
        gStores.messageStore.showMessage('未授权， 请再次点击进行授权', 3000);
        isShowHealthLogin.value = true;
      });
    } else {
      uni.navigateTo({
        url:
          globalGl.addPersonUrl +
          '?_directUrl=' +
          encodeURIComponent('/pages/home/home'),
      });
    }
  };

  const createCard = () => {
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/easyCardCreate',
    });
  };

  const profileClick = (pat: IPat) => {
    gStores.userStore.updatePatClick(pat);
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/medicalCardDetail',
    });
  };

  const cardClick = (pat: IPat) => {
    gStores.userStore.updatePatClick(pat);
    goElectronicMedicalCard();
  };

  const realNameAuth = async (pat: IPat) => {
    const tip = '选择认证方式';
    let authType = getRealNameAuth.value[0];

    if (getRealNameAuth.value.length > 1) {
      const listMap = [
        {
          label: 'ocr 认证',
          key: 'ocrVerify',
        },
        {
          label: '人脸认证',
          key: 'faceVerify',
        },
      ] as const;

      const list = listMap.filter((o) => getRealNameAuth.value.includes(o.key));
      const { tapIndex } = await apiAsync(
        // @ts-expect-error
        uni.showActionSheet,
        {
          title: tip,
          alertText: tip,
          itemList: list.map((o) => o.label),
        }
      );

      authType = list[tapIndex].key;
    }

    if (authType === 'ocrVerify') {
      const { title, content } = await gStores.getSysAppMore('1220');
      await new Promise<{ confirm: boolean }>((r) => {
        gStores.messageStore.showMessage(content, 0, {
          useDialog: true,
          dialogOpt: {
            title,
            isShowCancel: false,
          },
          closeCallBack: r,
        });
      });
      await realNameAuthOcr(pat);
    } else if (authType === 'faceVerify') {
      await realNameAuthFace(pat);
    }

    await patientUtils.getPatCardList();
    routerJump();
  };

  const imgCanvas = ref({
    imgWidth: 0,
    imgHeight: 0,
  });
  const realNameAuthOcr = async (pat: IPat) => {
    const { patientId } = pat;
    const { source } = gStores.globalStore.browser;
    const { pdata } = await useOcr(false, {
      aliThroughByEnd: true,
      imgCanvas,
    });

    await api.upRealNameAuth({
      patientId,
      source,
      pdata,
    });
  };

  const realNameAuthFace = async (pat: IPat) => {
    let isWx = true;
    // #ifndef MP-WEIXIN
    isWx = false;

    // #endif

    const { patientName, patientId, idCardEncry } = pat;
    const { source } = gStores.globalStore.browser;

    const {
      result: { idCard },
    } = await api.rpGetPlain({
      source,
      idCardEncry,
      patientId,
    });

    const { verifyResult } = await new LoginUtils().faceVerify({
      name: patientName,
      idCardNumber: idCard,
    });

    const {
      result: { pdata },
    } = await api.faceResultAuth({
      verifyResult,
      idCard,
      source,
    });

    await api.upRealNameAuth({
      patientId,
      source,
      pdata,
    });
  };

  const associatedHealthCard = () => {
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/easyAssociate',
    });
  };
  const goMedicalFiling = (pat) => {
    medicalFilingPat.value = pat;
    regDialogMedicalFiling.value.show();
  };
  //医保更新用户信息,医保建档
  const medicalFiling = async () => {
    const flag = await dealMedicalFiling(medicalFilingPat.value.patientId);
    if (flag) {
      patientUtils.getPatCardList();
    }
  };

  const HandhealthCard = async () => {
    const props = pageProps.value;
    if (
      props?._healthType === 'associate' &&
      props?.healthCode &&
      props?.healthCode !== '0'
    ) {
      await healthCardLink(props.healthCode, () => {
        uni.reLaunch({ url: '/pagesA/medicalCardMan/medicalCardMan' });
      });
    } else if (
      props?._healthType === 'associate' &&
      props?.healthCode &&
      props?.healthCode === '0'
    ) {
      //疑似健康卡关联页面新增就诊人异常，先报错
      gStores.messageStore.showMessage(
        '已取消关联健康卡，请重新申领或关联健康卡',
        1500
      );
    } else if (props?._healthType === 'verifyFail') {
      console.log('已取消健康卡申领');
      gStores.messageStore.showMessage('已取消就诊人绑定操作', 1500, {});
    } else if (props?._healthType === 'failRedirect' && props?.regInfoCode) {
      console.log('进入异常卡流程');
      gStores.messageStore.showMessage(
        '健康卡申领失败，请继续绑定就诊人流程',
        1500
      );
    } else if (props?.orderId && props?.redirectUrl && props?.verifyType) {
      await backWithFaceVerify(
        props.orderId,
        props.redirectUrl,
        props.verifyType
      );
    }
  };


  onShow(() => {
    reDealMedicalFiling();
  });
  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    routeStore.receiveQuery(pageProps.value);
    pageConfig.value = await ServerStaticData.getSystemConfig('person');

    //是否医保建档
    const medicalMHelp = globalGl.sConfig.medicalMHelp!;
    // #ifdef  MP-WEIXIN
    //先实现支付宝
    // #endif
    // #ifdef MP-ALIPAY
    isMedicalFiling.value = medicalMHelp?.alipay?.medicalFiling === '1';
    // #endif
     await patientUtils.getPatCardList();
    //健康卡
    // #ifdef MP-WEIXIN
    if (globalGl.systemInfo?.isOpenHealthCard) {
      globalGl.systemInfo.isOpenHealthCard?.isNewMode &&
        (isNewHealthCard.value = true);
     await HandhealthCard();
    }
    // #endif
  });
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
    padding: 24rpx 0;
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
    font-size: var(--hr-font-size-xxl);
    margin-right: 10rpx;
    font-weight: 500;
  }

  .empty-list {
    transform: translateY(100%);
  }

  .jkk {
    color: #00a1d6;
    text-align: center;
    font-size: var(--hr-font-size-xs);
    margin-top: 24rpx;
  }

  .pat-btns {
    flex-direction: row-reverse;
  }
</style>
