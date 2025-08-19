<template>
  <view
    v-if="isPageRender"
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <view class="relative z-1">
      <g-flag isShowFg typeFg="113" :isShowFgBg="false" />
    </view>
    <g-choose-pat @hide="patActionHide" @choose-pat="choosePatHandler1" />

    <scroll-view scroll-y class="g-container">
      <view class="top-bg z-0 my-disabled" />

      <view class="card-content p32 z-1">
        <view
          :class="{
            'card-header-bg-tcm': gStores.globalStore.isTcmStyle,
          }"
          class="card-header flex-between pr32 pl32 pt24 pb24"
        >
          <view>{{ title }}</view>

          <!-- <view
          v-if="toggleList.length > 1"
          @click="toggleQrCode"
          class="flex-normal g-border toggle-card color-blue f26"
        >
          <text
            :class="{
              'icon-reverse': showHealthCode,
            }"
            class="iconfont qr-toggle-icon color-blue"
          >
            &#xe6f9;
          </text>

          <view class="f26">
            {{ toggleQrLabel }}
          </view>
        </view> -->
          <!-- <view
            @click="chooseAction"
            class="flex-normal g-border toggle-card color-blue f26"
          >
            <text
              :class="{
                'icon-reverse': showHealthCode,
              }"
              class="iconfont qr-toggle-icon color-blue"
            >
              &#xe6f9;
            </text>

            <view class="f26">
              {{ '切换就诊人' }}
            </view>
          </view> -->
        </view>

        <view
          :class="{
            'card-health': showHealthCode,
            'is-tcm': gStores.globalStore.isTcmStyle,
          }"
          class="card-body relative"
        >
          <view
            v-if="globalGl.systemInfo.homeNavTitleLogo"
            class="flex justify-center relative z-1"
          >
            <image
              :src="globalGl.systemInfo.homeNavTitleLogo"
              mode="widthFix"
              class="logo"
            />
          </view>
          <view class="pt32 mb12" v-if="isShowRefreshQrCode">
            <refreshQrcode :patientId="clickPat.patientId" />
          </view>

          <view v-else class="card-qrcode mt20 pb20">
            <block>
              <block v-if="!showHealthCode">
                <view class="mb40 my-display-none">
                  <w-barcode
                    :options="barCodeOpt"
                    @generate="barCodeGenerate"
                    ref="refBarCode"
                  />
                </view>

                <view class="w-full mb40">
                  <view class="pr32 pl32">
                    <img :src="barCodeImg" class="bar-code-img w-full" />
                  </view>
                </view>
              </block>

              <!-- <w-qrcode :options="qrOptions" /> -->
              <uv-qrcode
                v-if="qrOptions.code"
                :options="qrOptions2"
                :value="qrOptions.code"
                @change="qrComplete"
                size="380rpx"
              />
            </block>
          </view>

          <!-- <view class="info-content">
            <view class="g-flex-rc-cc info-name mb12">
              <view class="f32">
                {{
                  isNameEncry ? clickPat.patientNameEncry : clickPat.patientName
                }}
              </view>

              <text @click="eyesClick" class="iconfont eyes-icon color-888">
                {{ isNameEncry ? '&#xe6d4;' : ' &#xe6db;' }}
              </text>
            </view>

            <view class="g-flex-rc-cc color-888 f28 mb12">
              {{ clickPat._showId }}
            </view>

            <view class="g-flex-rc-cc mt24">
              <text @click="goDetail" class="color-blue f28">更多信息</text>
            </view>
          </view> -->
          <!-- #ifdef  MP-WEIXIN -->
          <view
            v-if="showHealthCode"
            @click="goHealCardPackage"
            class="color-blue g-bold g-flex-rc-cc p24 g-border-top"
          >
            添加到卡包
          </view>
          <!-- #endif -->
        </view>
      </view>

      <view class="pl32 pr32">
        <view
          :style="{
            'background-image': `url(${
              globalGl.BASE_IMG
            }electronicMedicalCard-bg-medical${
              gStores.globalStore.isTcmStyle ? '-tcm' : ''
            }.png)`,
          }"
          :class="{
            'is-tcm': gStores.globalStore.isTcmStyle,
          }"
          class="medical-entry flex flex-col pl32 pr32 pt24 pb24"
          @click="_goElectronicMedicalCard('byMedical')"
        >
          <view class="flex items-center justify-between">
            <view class="flex items-center">
              <img
                class="program-medical-logo mr12"
                :src="`${globalGl.BASE_IMG}program-medical-logo.jpg`"
              />
              <text class="color-fff f36 font-semibold">医保电子凭证</text>
            </view>
            <view>
              <text class="iconfont f40 arrow-icon">&#xe66b;</text>
            </view>
          </view>
          <view class="flex-1" />
          <view
            class="color-blue flex items-center justify-center f28 pt14 pb14 medical-btn"
          >
            出示医保码
          </view>
        </view>
      </view>

      <!-- <view v-if="pageProps.showNavBar === '1'">
        <view class="safe-height" />
        <view class="safe-height" />
        <view class="safe-height" />
        <view class="safe-height" />
        <view class="safe-height" />
        <view class="safe-height" />
      </view> -->
    </scroll-view>

    <g-message />

    <homeTabbar
      v-if="pageProps.showNavBar === '1'"
      :systemModeOld="gStores.globalStore.modeOld"
    />
  </view>
  <view class="relative z-999">
    <ChoosePatAction
      ref="actionSheet"
      @choose-pat="choosePatHandler"
      @hide="patActionHide"
    />
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { onLoad, onReady } from '@dcloudio/uni-app';

  import { IPat, isAreaProgram } from '@/stores';
  import {
    GStores,
    wait,
    ServerStaticData,
    type ISystemConfig,
    apiAsync,
    PatientUtils,
    cacheUtil,
  } from '@/utils';

  import { setLocalStorage, getLocalStorage, deQueryForUrl } from '@/common';
  import { _goElectronicMedicalCard } from '@/pages/home/utils';

  import api from '@/service/api';
  import globalGl from '@/config/global';

  import refreshQrcode from '@/components/refresh-qrcode/refresh-qrcode.vue';
  import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';
  import homeTabbar from '@/pages/home/componetns/homeTabbar.vue';

  const pageProps = ref(
    {} as {
      showNavBar?: '1';
    }
  );
  const isPageRender = ref(true);
  const gStores = new GStores();
  const { clickPat } = storeToRefs(gStores.userStore);
  const title = ref('电子就诊卡');
  const showHealthCode = ref(false);
  const pageConfig = ref(<ISystemConfig['person']>{});
  const patientUtils = new PatientUtils();
  const isShowRefreshQrCode = ref(false);
  const refBarCode = ref('' as any);

  const SYS_TAB_KEY = 'SYS_TAB_KEY';

  // isIos?
  const systemInfo: boolean = getLocalStorage(SYS_TAB_KEY) || false;
  const toggleQrLabel = computed(() => {
    if (toggleList.value.length > 2) {
      return '切换卡类型';
    }
    let i = toggleListCurrent.value + 1;
    if (i > toggleList.value.length - 1) {
      i = 0;
    }

    return `切换${toggleList.value[i].label}`;
  });

  // https://meet-ui.com/#/
  const options = ref<any>({
    // 二维码
    // size: systemInfo ? 380 : 500,
    size: 380,
    // 条形码
    width: 600, // 宽度 单位rpx
    height: 184, // 高度 单位rpx
    code: isAreaProgram()
      ? clickPat.value.idCardEncry
      : clickPat.value.healthQrCodeText || clickPat.value._showId,
    img: '',
  });

  const actionSheet = ref<InstanceType<typeof ChoosePatAction>>();
  const chooseAction = () => {
    if (actionSheet.value) {
      actionSheet.value.show();
    }
  };
  const choosePatHandler = ({ item }: { item: IPat; number: number }) => {
    gStores.userStore.updatePatChoose(item);
    gStores.userStore.updatePatClick(item);
    init();
  };

  const choosePatHandler1 = () => {
    const pat = gStores.userStore.patChoose;
    gStores.userStore.updatePatClick(pat);
    gStores.userStore.updatePatClick(pat);

    init();
  };

  const patActionHide = async () => {
    // await wait(20);
    // refBarCode.value?.SpecialTreatment(barCodeOpt.value);
    // await wait(20);
    // refBarCode.value?.generateCode();
  };

  // @ts-expect-error
  uni.getSystemInfo({}).then(({ screenWidth }) => {
    if (screenWidth > 390) {
      options.value.size = 500;
    }
  });

  const qrOptions = computed(() => {
    return {
      ...options.value,
      width: undefined,
      height: undefined,
    };
  });

  const barCodeOpt = ref({
    ...options.value,

    height: 120, // 高度 单位rpx
  });

  const formData = ref({
    ...clickPat.value,
    _name: '',
  });
  const isNameEncry = ref(true);
  const eyesClick = () => {
    isNameEncry.value = !isNameEncry.value;
    changeShowName();
  };
  const isHasHealthCode = computed(() => {
    return !!clickPat.value.healthQrCodeText;
  });
  const toggleList = ref([
    {
      label: '电子就诊卡',
      key: '0',
    },
  ]);
  const toggleListCurrent = ref(0);

  const changeShowName = () => {
    if (isNameEncry.value) {
      formData.value._name = formData.value.patientNameEncry;
    } else {
      formData.value._name = formData.value.patientName;
    }
  };

  const showCodeLabel = ref('');
  if (isAreaProgram()) {
    showCodeLabel.value = clickPat.value.idCard;
  }

  const goDetail = () => {
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/medicalCardDetail',
    });
  };

  const toggleQrCode = async () => {
    let oldSel = toggleListCurrent.value;
    let { key } = toggleList.value[toggleListCurrent.value];
    if (toggleList.value.length > 2) {
      const tip = '切换卡类型';
      const { tapIndex } = await apiAsync(
        // @ts-expect-error
        uni.showActionSheet,
        {
          title: tip,
          alertText: tip,
          itemList: toggleList.value.map((o) => o.label),
        }
      );

      toggleListCurrent.value = tapIndex;
    } else {
      toggleListCurrent.value++;
      if (toggleListCurrent.value > toggleList.value.length - 1) {
        toggleListCurrent.value = 0;
      }
    }

    key = toggleList.value[toggleListCurrent.value].key;

    if (key === '2') {
      _goElectronicMedicalCard('byMedical');
      toggleListCurrent.value = oldSel;
      return;
    }

    showHealthCode.value = key === '1';
    setLocalStorage({
      showHealthCodeHis: showHealthCode.value,
    });
    setStatus();
    uni.showLoading({
      mask: true,
      title: '切换中',
    });

    await wait(700);

    uni.hideLoading();
  };

  const qrOptions2 = computed(() => {
    return {
      foregroundImageSrc: showHealthCode.value
        ? globalGl.BASE_IMG + 'health-card-logo.png'
        : '',
    };
  });

  const qrComplete = (e) => {
    console.log(e);
  };

  const setStatus = async () => {
    if (showHealthCode.value) {
      title.value = '电子健康卡';
      options.value.img = {
        src: '/static/image/person/health-card-logo.png',
        size: 70,
      };

      options.value.code = clickPat.value.healthQrCodeText!;
    } else {
      title.value = '电子就诊卡';
      options.value.img = undefined;
      options.value.code = clickPat.value._showId!;
      barCodeOpt.value.code = clickPat.value._showId!;
    }

    uni.setNavigationBarTitle({
      title: title.value,
    });
  };

  // https://open.tengmed.com/openAccess/ability/detail?sceneId=0&catalogId=20&serviceId=93&docContentKey=detail
  const goHealCardPackage = async () => {
    const { patientId } = clickPat.value;
    const {
      browser: { source },
    } = gStores.globalStore;

    const arg = {
      patientId,
      source,
    };

    const { result } = await api.getCardPackOrderId(arg);

    const orderId = result?.orderId;

    if (orderId) {
      const baseUrl =
        globalGl.sConfig.medicalCardDetailPackageDomain ||
        'https://03-h5-health.tengmed.com';

      const url =
        baseUrl + `/api/open/takeMsCard?order_id=${orderId}&redirect_uri=back`;

      uni.navigateTo({
        url: '/pagesA/webView/webView?https=' + encodeURIComponent(url),
      });
    } else {
      gStores.messageStore.showMessage('获取订单失败', 3000);
    }
  };

  const barCodeImg = ref('');
  const barCodeGenerate = (res) => {
    console.log(res, 'www');
    const { img = {} } = res;

    barCodeImg.value = img.tempFilePath || '';
  };

  onReady(() => {
    const showHealthCodeHis = getLocalStorage('showHealthCodeHis');
    if (clickPat.value.healthQrCodeText) {
      if (showHealthCodeHis === '') {
        showHealthCode.value = !!clickPat.value.healthQrCodeText;
      } else {
        showHealthCode.value = showHealthCodeHis;
      }
    } else {
      showHealthCode.value = false;
    }

    setStatus();
  });

  const init = async () => {
    const { GlobalConfig } = await cacheUtil.getSystemConfig('GlobalConfig')();

    changeShowName();
    isShowRefreshQrCode.value = (GlobalConfig.refreshQrCode || []).includes(
      'pagesA/medicalCardMan/electronicMedicalCard'
    );
    isPageRender.value = true;
    options.value.code = isAreaProgram()
      ? clickPat.value.idCardEncry
      : clickPat.value.healthQrCodeText || clickPat.value._showId;
    barCodeOpt.value.code = options.value.code;
  };

  onMounted(async () => {
    if (!clickPat.value.patientName) {
      gStores.userStore.updatePatClick(gStores.userStore.patChoose);
    }
    pageConfig.value = await ServerStaticData.getSystemConfig('person');
    init();

    // if (isHasHealthCode.value) {
    //   toggleList.value.push({
    //     label: '电子健康卡',
    //     key: '1',
    //   });
    // }

    // if (pageConfig.value.isMedicalQrChoose === '1') {
    //   toggleList.value.push({
    //     label: '医保码',
    //     key: '2',
    //   });
    // }
  });

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
  });
</script>

<style lang="scss" scoped>
  .logo {
    height: 66rpx;
    max-width: 500rpx;
  }

  .top-bg {
    height: 500upx;
    width: 100%;
    position: absolute;

    background: linear-gradient(
        160deg,
        var(--hr-brand-color-6-light),
        var(--hr-brand-color-6-light),
        rgba(255, 0, 0, 0) 50%
      ),
      linear-gradient(
        -180deg,
        var(--hr-brand-color-3-light),
        var(--hr-brand-color-3-light),
        rgba(255, 255, 255, 0) 50%
      );

    // background: linear-gradient(160deg, #13b8ff2a, #13b8ff2a, rgba(255, 0, 0, 0) 50%),
    //   linear-gradient(-160deg, #c1d4ff97, #c1d4ff59, rgba(0, 255, 0, 0) 50%);
  }

  .card-content {
    position: relative;
    z-index: 1;
    .card-header {
      // background: linear-gradient(180deg, #53a8ff, var(--hr-brand-color-6));
      background: linear-gradient(
        180deg,
        var(--hr-brand-color-6-light-3),
        var(--hr-brand-color-6)
      );
      border: 1px solid var(--hr-brand-color-6);
      border-radius: 16rpx 16rpx 0 0;
      font-weight: 600;
      color: var(--h-color-white);
      font-size: var(--hr-font-size-xl);

      &.card-header-bg-tcm {
        background: linear-gradient(0deg, #b68272, #c89c8c 100%);
        border-color: transparent;
      }
    }

    .card-body {
      background-color: var(--hr-neutral-color-1);
      border-radius: 0 0 16rpx 16rpx;
      background: #fff;
      overflow: hidden;

      .card-qrcode {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .card-code {
          color: var(--hr-neutral-color-7);
          font-size: var(--hr-font-size-xs);
          padding-top: 16rpx;
          padding-bottom: 20rpx;
        }
      }

      &.is-tcm {
        background: radial-gradient(#ffffff, #fff8ef);
        box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.05);

        &::after {
          content: '';
          top: -50rpx;
          left: 0;
          right: 0;
          height: 200rpx;
          position: absolute;
          z-index: 0;
          background: radial-gradient(
            circle at 35% 0,
            #ff9400,
            rgba(164, 105, 91, 0)
          );
          opacity: 0.2;
          -webkit-mask-image: radial-gradient(
            ellipse closest-side,
            rgba(0, 0, 0, 1) 30%,
            rgba(0, 0, 0, 0) 100%
          );
          // mask-image: radial-gradient(
          //   circle closest-side,
          //   rgba(0, 0, 0, 1) 30%,
          //   rgba(0, 0, 0, 0) 100%
          // );
        }
      }
    }

    .card-health {
      padding-top: 80rpx;
    }
  }

  .btns {
    padding: 32rpx;
  }

  .toggle-card {
    font-weight: normal;
    background-color: #fff;
    border-radius: 666rpx;
    padding: 8rpx 24rpx;

    .qr-toggle-icon {
      transition: all 0.4s;
      color: var(--hr-neutral-color-9);
      font-size: var(--hr-font-size-xl);
      margin-right: 8rpx;
      display: inline-block;
      &.icon-reverse {
        transform-origin: center center;
        transform: rotate(0.5turn);
      }
    }
  }

  .info-content {
    padding-bottom: 32rpx;
    .info-name {
      position: relative;

      .eyes-icon {
        font-size: var(--hr-font-size-xxl);
        margin-left: 30rpx;
        position: absolute;
        transform: translateX(88rpx);
      }
    }
  }

  .system-mode-old {
    .f26 {
      font-size: var(--hr-font-size-xl) !important;
    }
  }

  .medical-entry {
    --bg-mix: var(--hr-brand-color-3-light);

    .program-medical-logo {
      width: 28px;
      height: 28px;
      border-radius: 100%;
    }

    &.is-tcm {
      --bg-mix: #edd3c7;
    }
    // height: 192rpx;
    height: 162rpx;

    background-repeat: no-repeat;
    background-position: right 0 bottom 0;
    background-size: 100% 100%;

    .medical-btn {
      background: linear-gradient(180deg, #ffffff, var(--bg-mix));
      border-radius: 18px;
    }
  }

  .bar-code-img {
    height: 120rpx;
  }
</style>
