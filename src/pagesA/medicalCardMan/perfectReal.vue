<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="page"
  >
    <view class="container" scroll-y>
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        @change="formChange"
        bodyBold
        ref="gform"
      />

      <!-- <view class="p24 pt32">
        <fgUserInfoAgree
          v-if="pageConfig.isUserInfoShareAgree === '1'"
          v-model:value="formData.isUserInfoShareAgree"
        />
      </view> -->

      <g-flag typeFg="51" isShowFgTip />
    </view>
    <canvas
      v-show="false"
      :width="imgCanvas.imgWidth"
      :height="imgCanvas.imgHeight"
      style="opacity: 0; position: absolute; pointer-events: none"
      id="canvasForBase64"
    />
    <g-message />
    <xy-dialog
      :show="dialogShow"
      :content="dialogContent"
      @confirmButton="dialogConfirmRRR"
      @cancelButton="dialogShow = false"
      :confirmText="pageProps.pageType === 'perfectReal' ? '立即补充' : '添加'"
    />

    <g-popup title="身份验证" ref="refVerifyIdCardPopup">
      <view class="flex justify-center bg-white verify-idcard-container">
        <view class="flex flex-col items-center">
          <view class="mt16 mb16 color-666 f32">请输入身份证后四位</view>

          <view class="pb32" @click="openKeyBoard">
            <uv-code-input
              v-model="verifyIdCardVal"
              :maxlength="4"
              size="55"
              space="20"
              disabledKeyboard
            />
          </view>

          <view class="safe-height" />
          <view class="bg-white"></view>
          <uv-keyboard-number
            :random="false"
            :mode="'card'"
            :dotDisabled="false"
            @change="keyboardChange"
            @backspace="keyboardBackspace"
          />

          <view class="w100p verify-idcard-btn">
            <view class="pr12 pl12">
              <view
                :class="{
                  'btn-disabled': verifyIdCardVal.length < 4,
                }"
                class="btn btn-primary"
                @click="continueVerifyIdCard"
              >
                确认
              </view>
            </view>
            <view class="safe-height" />
          </view>

          <!-- <view class="safe-height" />
          <view class="safe-height" /> -->
        </view>
      </view>
    </g-popup>

    <Sel-Card-Dialog
      v-model:show="dialogSelCardShow"
      :activeCardNumber="activeCardSelCardNumber"
      :list="cardPatList"
      @itemClick="selCardPat"
      @confirm="chooseCard"
    />

    <Order-Reg-Confirm
      :headerIcon="$global.BASE_IMG + 'v3-order-reg-confirm-add.png'"
      :title="flagTitle1203"
      :maskClickClose="false"
      @cancel="disagreeSign"
      @confirm="isAgreeSign = true"
      height="90vh"
      confirmText="同意授权,方便就诊"
      cannerText="不授权"
      ref="regDialogConfirmSign"
    >
      <g-flag
        v-model:title="flagTitle1203"
        typeFg="1203"
        isShowFgTip
        isHideTitle
        aaa
      />
    </Order-Reg-Confirm>
    <Order-Reg-Confirm
      :headerIcon="$global.BASE_IMG + 'v3-order-reg-confirm-add.png'"
      v-if="isMedicalFiling"
      title="是否更新为医保用户？"
      :maskClickClose="false"
      @confirm="medicalFiling"
      @cancel="medicalFillCancel"
      height="35vh"
      confirmText="确定"
      cannerText="取消"
      ref="regDialogMedicalFiling"
    >
      仅账号本人可更新为医保用户，是否更新为医保用户？
    </Order-Reg-Confirm>

    <view class="footer">
      <Fg-Agree
        v-if="isSignExist"
        :isCheck="isAgreeSign"
        :systemModeOld="gStores.globalStore.modeOld"
        @update:isCheck="isAgreeSignChange"
        @show-agree="regDialogConfirmSign.show"
        content="《免密代扣协议》"
        cusShowAgree
      />
      <view class="mb24">
        <Fg-Agree
          v-model:isCheck="isCheck"
          :systemModeOld="gStores.globalStore.modeOld"
        />
      </view>
      <button
        @click="gform.submit"
        :class="{
          'btn-disabled': btnDisabled,
        }"
        class="btn btn-primary"
      >
        保存
      </button>
    </view>
  </view>
  <Order-Reg-Confirm
    :headerIcon="`${$global.BASE_IMG}v3-order-reg-confirm${
      gStores.globalStore.isTcmStyle ? '-tcm' : ''
    }.png`"
    @confirm="resolve()"
    @cancel="reject()"
    ref="faceDialog"
    :title="'人脸识别认证须知'"
  >
    <g-flag
      title="人脸识别认证须知"
      :typeFg="'1250'"
      isShowFgTip
      isHideTitle
      aaa
    />
  </Order-Reg-Confirm>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, type Ref } from 'vue';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';
  import { onLoad, onReady, onShow } from '@dcloudio/uni-app';
  import {
    IPat,
    useCacheStore,
    useMessageStore,
    useRouterStore,
  } from '@/stores';
  import type { TInstance } from '@/components/g-form/index';

  import {
    PatientUtils,
    GStores,
    routerJump,
    ServerStaticData,
    nameConvert,
    getH5OpenidParam,
    ISystemConfig,
    wait,
    phoneConvert,
    idValidator,
    idCardConvert,
    apiAsync,
  } from '@/utils';

  import {
    pickTempItem,
    formKey,
    TFormKeys,
    getDefaultFormData,
    formatterSubPatientData,
    loginAuthAlipay,
    TCardPat,
    useProgramPaySign,
    gotoChosseVerifyPage,
    useAuthPerson,
    insertSortFormExtraKey,
  } from './utils';

  import {
    reDealMedicalFiling,
    dealMedicalFiling,
  } from '@/pagesA/clinicPay/utils/clinicPayDetail';

  import api from '@/service/api';
  import globalGl from '@/config/global';

  import FgAgree from './components/fgAgree.vue';
  import SelCardDialog from './components/SelCardDialog.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import fgUserInfoAgree from './components/fgUserInfoAgree.vue';

  interface TPageType extends ILoginBack {
    pageType: 'addPatient' | 'perfectReal';

    /**
     * 用户信息, 自动带入, patientPhone 字短将会脱敏展示
     */
    patientPhone?: string;
    patientName?: string;

    // 微信小程序必须显示写出来， 否则接收不到
    _p?: string;
    _url?: string;
    _query?: string;
    _type?: '1' | '2';
    _isOutLogin?: '1';
    _pageInfo?: '1' | '2';
    _directUrl?: string;

    // 健康卡逻辑
    _healthType?: 'addPat';
    authCode?: string;
  }

  const routeStore = useRouterStore();
  const messageStore = useMessageStore();
  const cacheStore = useCacheStore();

  const pageProps = ref(<TPageType>{
    pageType: 'addPatient',
  });
  const pageConfig = ref(<ISystemConfig['person']>{});
  const patientUtils = new PatientUtils();
  const gStores = new GStores();
  const patList = gStores.userStore.patList;
  const gform = ref<any>('');
  const _formList = ref<TInstance[]>([]);
  const formData = ref<BaseObject>({
    [formKey.patientType]: '-1',
    [formKey.defaultFalg]: true,
  });
  let envContainer = '';
  // #ifdef MP-ALIPAY
  envContainer = 'ali';
  // #endif
  const refKeyboard = ref('' as any);
  const openKeyBoard = () => {
    refKeyboard.value?.open();
  };

  let formList: TInstance[] = [];

  const isCheck = ref(false);

  const dialogSelCardShow = ref(false);
  const dialogShow = ref(false);
  const dialogContent = ref('');
  const regDialogMedicalFiling: Ref<any> = ref('');
  const isMedicalFiling = ref(false);
  const faceDialog: Ref<any> = ref('');
  let dialogConfirm = () => {};
  const cardPatList = ref(<TCardPat[]>[]);
  const dialogConfirmRRR = () => {
    dialogShow.value = false;
    dialogConfirm();
  };
  const newPat = ref();
  const activeCardSelCardNumber = ref('');
  const selCardPat = (pat: TCardPat) => {
    activeCardSelCardNumber.value = pat.cardNumber;
  };

  const {
    getRealNameAuth,
    realNameAuth: _realNameAuth,
    init: useAuthPersonInit,
    imgCanvas,
  } = useAuthPerson();

  let resolve: (...any) => any = () => {};
  let reject: (...any) => any = () => {};

  const realNameAuth = async (pat: IPat) => {
    const { title, content } = await gStores.getSysAppMore('95');

    const isConfirm = await new Promise((r) => {
      gStores.messageStore.showMessage(content, 0, {
        useDialog: true,
        dialogOpt: {
          title,
          isShowCancel: true,
          cancelText: '取消',
          confirmText: '去认证',
          cancelColor: 'var(--hr-brand-color-6)',
          maxHeight: 900,
          isMaskClick: false,
        },
        closeCallBack({ confirm, maskClose }) {
          r(confirm);
        },
      });
    });

    if (isConfirm) {
      await new Promise((rl, rj) => {
        resolve = rl;
        reject = () => {
          console.log(888);
          gStores.messageStore.showMessage('取消人脸识别', 3000);
          rj();
        };
        faceDialog.value.show();
      });
      await _realNameAuth(pat);
      await patientUtils.getPatCardList();
    }
  };

  const chooseCard = (cardNumber: string) => {
    if (!cardNumber) {
      gStores.messageStore.showMessage('请选择就诊卡', 3000);
      return;
    }

    dialogSelCardShow.value = false;
    dialogConfirm();
  };

  const refVerifyIdCardPopup = ref('' as any);
  const refVerifyIdCard = ref('' as any);
  const verifyIdCardVal = ref('');
  const verifyIdCardChange = (e) => {
    verifyIdCardVal.value = e;
  };
  const keyboardChange = (v) => {
    if (verifyIdCardVal.value.length < 4) {
      verifyIdCardVal.value += v;
    }
  };
  const keyboardBackspace = () => {
    verifyIdCardVal.value = verifyIdCardVal.value.slice(
      0,
      verifyIdCardVal.value.length - 1
    );
  };
  let verifyIdCArdResolve: any = () => {};
  const continueVerifyIdCard = () => {
    if (verifyIdCardVal.value.length < 4) {
      return;
    }

    refVerifyIdCardPopup.value.hide();
    verifyIdCArdResolve();
  };

  const formSubmit = async ({}) => {
    if (!isCheck.value || (isSignExist.value && !isAgreeSign.value)) {
      messageStore.showMessage('请勾选下方同意书', 3000);

      return;
    }

    formData.value = formatterSubPatientData(formData.value);
    const { isVerifyIdCardLastFourNumber } = pageConfig.value;

    // const { isSmsVerify } = await ServerStaticData.getSystemConfig('person');

    const {
      browser: { source },
    } = gStores.globalStore;

    const data: any = {
      ...formData.value,
      verifyType: (formData.value[formKey.verifyCode] && '2&kq') || '1&bk',
      source,
    };

    if (data.patientName) {
      formData.value[formKey.patientName] = data.patientName.trim();
    }

    // 完善逻辑
    if (pageProps.value.pageType === 'perfectReal') {
      try {
        const { result } = await api.getPatCardInfoByHospital(data);
        if (result) {
          const {
            jump,
            cardNumber,
            idCard,
            idType,
            patientSex,
            jumpMsg,
            cellPhoneNumber,
            idCardEncry,
            birthday,
          } = result;
          const { patientPhone, patientName } = data;
          if (
            idType === '01' &&
            idCard &&
            isVerifyIdCardLastFourNumber === '1'
          ) {
            verifyIdCardVal.value = '';
            refVerifyIdCardPopup.value.show();
            await new Promise((r) => {
              verifyIdCArdResolve = r;
            });

            data.content = verifyIdCardVal.value;
          }

          if (jump === 0) {
            try {
              await patientUtils.registerUser({
                ...data,
                idCard,
                idType,
                patientPhone,
                patientName,
                verifyCode: formData.value[formKey.verifyCode],
                verifyType: '1&bk',
                cellPhoneNumber,
                idCardEncry,
                sex: (patientSex && (patientSex === '男' ? '1' : '2')) || '',
                birthday,
              });

              routerJump('/pagesA/medicalCardMan/medicalCardMan');
            } catch (error) {
              if ((error as any)?.errorType === 'add') {
                uni.reLaunch({
                  url: '/pagesA/medicalCardMan/medicalCardMan',
                });
              }
            }
          } else {
            dialogContent.value = jumpMsg;
            // dialogShow.value = true;
            dialogConfirm = () => {
              uni.navigateTo({
                url: joinQueryForUrl('/pagesA/medicalCardMan/addMedical', {
                  ...data,
                  pageType: pageProps.value.pageType,
                  _directUrl: pageProps.value._directUrl,
                }),
              });
            };

            dialogConfirm();
          }
        }
      } catch (error) {
        const err = error as { respCode: number; message: string };

        if (err) {
          const { respCode, message } = err;

          if (respCode === 999301) {
            dialogContent.value = message;
            // dialogShow.value = true;
            dialogConfirm = () => {
              uni.navigateTo({
                url: joinQueryForUrl('/pagesA/medicalCardMan/addMedical', {
                  ...data,
                  pageType: pageProps.value.pageType,
                  _directUrl: pageProps.value._directUrl,
                }),
              });
            };

            dialogConfirm();
          } else {
            gStores.messageStore.showMessage(message, 3000);
          }
        }
      }
    } else {
      if (
        pageProps.value?._healthType == 'addPat' &&
        pageProps.value?.authCode
      ) {
        gotoChosseVerifyPage(
          {
            name: formData.value.patientName,
            phone1: formData.value.patientPhone,
            verifyCode: formData.value.verifyCode,
            verifyType:
              (formData.value[formKey.verifyCode] && '2&kq') || '1&bk',
          },
          pageProps.value.authCode,
          'quickRegisterHealthCard',
          async (err = {} as any) => {
            const { respCode } = err;

            if (respCode === 999301) {
              messageStore.showMessage(err.message, 3000, {
                closeCallBack() {
                  uni.navigateTo({
                    url: joinQueryForUrl('/pagesA/medicalCardMan/addMedical', {
                      ...data,
                      _healthType: pageProps.value._healthType,
                      authCode: pageProps.value.authCode,
                      pageType: pageProps.value.pageType,
                      _directUrl: pageProps.value._directUrl,
                    }),
                  });
                },
              });
            } else if (respCode === 999001) {
              // await patientUtils.getPatCardList();
            }
          }
        );
        return;
      }
      if (isVerifyIdCardLastFourNumber === '1') {
        const authIdCard = gStores.userStore.cacheUser?.certNo;
        if (
          envContainer === 'ali' &&
          !gStores.userStore.patList.length &&
          authIdCard
        ) {
          data.content = authIdCard.slice(-4);
        } else {
          const { result } = await api.checkPat({
            ...data,
          });

          // 需要校验证件后四位
          if (result) {
            verifyIdCardVal.value = '';
            refVerifyIdCardPopup.value.show();
            await new Promise((r) => {
              verifyIdCArdResolve = r;
            });

            data.content = verifyIdCardVal.value;
          }
        }
      }
      // 新增就诊人
      const value = formData.value;
      const requestArg = {
        ...data,
        defaultFalg: value[formKey.defaultFalg] ? '1' : '0',
        herenId: patientUtils.globalStore.herenId,
        patientName: value[formKey.patientName],
        patientPhone: value[formKey.patientPhone],
        source: patientUtils.globalStore.browser.source,
        patientType: formData.value[formKey.patientType],
        verifyCode: formData.value[formKey.verifyCode],
      };

      if (globalGl.sConfig.isSearchHosForAddPatHasMoreThanOneCard === '1') {
        getH5OpenidParam(requestArg);
        const {
          result: { cardList, data: resData, patientId },
        } = await api.getAllCardByName(requestArg).catch((err) => {
          dealNetError(err, data);
          throw new Error(err);
        });
        newPat.value = { patientId };

        if (cardList && cardList.length) {
          await new Promise((r) => {
            dialogSelCardShow.value = true;
            cardPatList.value = cardList;
            dialogConfirm = () => {
              r(void 0);
            };
          });

          await api.addPatByAllCard({
            ...requestArg,
            data: resData,
            cardNumber: activeCardSelCardNumber.value,
          });
        }
      } else {
        const patientId = await patientUtils
          .addPatient(requestArg)
          .catch((err) => {
            dealNetError(err, data);
            throw new Error(err);
          });

        newPat.value = { patientId };

        await goPaySign(patientId);
      }

      // 切换默认就诊人
      if (value[formKey.defaultFalg]) {
        gStores.userStore.updatePatChoose({} as any);
      }
      await patientUtils.getPatCardList();
      newPat.value = gStores.userStore.patList.find(
        (pat) => pat.patientId === newPat.value.patientId
      );
      if (isMedicalFiling.value && newPat.value.healthCardUser !== '2') {
        regDialogMedicalFiling.value.show();
        return;
      }

      if (
        newPat.value.realNameAuth === '0' &&
        getRealNameAuth.value.length &&
        pageConfig.value.isRealNameAuthAfterAdd === '1'
      ) {
        await realNameAuth(newPat.value);
      }

      if (pageProps.value._directUrl) {
        routerJump(pageProps.value._directUrl as `/${string}`);
      } else {
        routerJump('/pagesA/medicalCardMan/medicalCardMan');
      }
    }
  };

  const editPhone = async (data = {} as any) => {
    // 需要保障此页面存在这几个字段
    const { idType, idCard, patientPhone, patientName } = data;
    const {
      isCanChangeHosPhone,
      useFaceVerifyInChangePhone,
      isChangeHosPhoneWay,
    } = pageConfig.value;

    if (idType === '01' && isCanChangeHosPhone === '1') {
      if (!data.pData) {
        let selWay = '';
        if (isChangeHosPhoneWay) {
          const chooseList = [
            {
              label: '使用人脸验证',
              value: 'face',
            },
            {
              label: '上传证件验证',
              value: 'ocr',
            },
            // @ts-expect-error
          ].filter((o) => isChangeHosPhoneWay.includes(o.value));

          if (chooseList.length === 1) {
            selWay = chooseList[0].value;
          } else {
            const { tapIndex } = await apiAsync(uni.showActionSheet, {
              title: '选择验证方式',
              alertText: '选择验证方式',
              itemList: chooseList.map((o) => o.label),
            });

            selWay = chooseList[tapIndex].value;
          }
        }

        let pdata = '';

        if (
          (!selWay && useFaceVerifyInChangePhone === '1') ||
          selWay === 'face'
        ) {
          const { pData } = await patientUtils.faceVerifyAndPData({
            idCardNumber: formData.value[formKey.idCard],
            name: formData.value[formKey.patientName],
          });

          pdata = pData;
        } else {
          cacheStore.changeCacheData({
            ...data,
            source: gStores.globalStore.browser.source,
          });

          uni.navigateTo({
            url: joinQueryForUrl('/pagesA/medicalCardMan/ocrUser', {
              idCard,
              patientPhone,
              patientName,
              idType,
              from: 'addMedical',
              isUseFace: '0',
            }),
          });

          throw new Error('去到ocr页面');
        }
        data.pData = pdata;
      }

      await api.mofHosPhone({
        ...data,
        pdata: data.pData,
        source: gStores.globalStore.browser.source,
      });

      formSubmit({});
    }
  };

  const dealNetError = async (err = {} as any, data) => {
    const { isCanChangeHosPhone } = pageConfig.value;
    const { idType } = formData.value;

    const { respCode } = err;
    if (respCode === 999301) {
      messageStore.showMessage(err.message, 3000, {
        closeCallBack() {
          uni.navigateTo({
            url: joinQueryForUrl('/pagesA/medicalCardMan/addMedical', {
              ...data,
              pageType: pageProps.value.pageType,
              _directUrl: pageProps.value._directUrl,
            }),
          });
        },
      });
    } else if (
      respCode === 884801 &&
      idType === '01' &&
      isCanChangeHosPhone === '1'
    ) {
      const { confirm } = await apiAsync(uni.showModal, {
        content: '患者存在建档记录但手机号不匹配，是否立即修改？',
      });

      if (confirm) {
        await editPhone(data);
      }
    } else if (err?.respCode === 999001) {
      // await patientUtils.getPatCardList();
    }
  };

  const formChange = ({ item, value }) => {};

  const btnDisabled = computed(() => {
    let isDisabled = false;
    const formKeys = _formList.value
      .filter((o) => o.required)
      .map((o) => o.key);

    Object.entries(formData.value).map(([key, value]) => {
      if (formKeys.includes(key) && value === '') {
        isDisabled = true;
      }
    });

    if (
      pageConfig.value.isUserInfoShareAgree === '1' &&
      !formData.value.isUserInfoShareAgree
    ) {
      isDisabled = true;
    }

    return isDisabled;
  });

  const {
    isAgreeSignChange,
    regDialogConfirmSign,
    flagTitle1203,
    disagreeSign,
    initSign,
    goPaySign,
    signAfterOnPageShow,
    isAgreeSign,
    isSignExist,
  } = useProgramPaySign();

  const medicalFillCancel = async () => {
    if (pageProps.value._directUrl) {
      routerJump(pageProps.value._directUrl as `/${string}`);
    } else {
      routerJump('/pagesA/medicalCardMan/medicalCardMan');
    }
  };

  //医保更新用户信息,医保建档
  const medicalFiling = async () => {
    const flag = await dealMedicalFiling(newPat.value.patientId);
    if (flag) {
      if (pageProps.value._directUrl) {
        routerJump(pageProps.value._directUrl as `/${string}`);
      } else {
        routerJump('/pagesA/medicalCardMan/medicalCardMan');
      }
    }
  };

  // 脱敏信息
  const maskInfo = (
    formList: TInstance[],
    opt: {
      keys: ('patientPhone' | 'patientName' | 'idCard')[];
      disabled?: boolean;
    } = {} as any
  ) => {
    const { keys = [], disabled } = opt;
    formList.map((o) => {
      const { key } = o;

      if (keys.includes('patientName') && key === formKey.patientName) {
        o.disabled = disabled;
        o.inputMask = (v, item) => {
          return nameConvert(v);
        };
      }

      if (keys.includes('patientPhone') && key === formKey.patientPhone) {
        o.disabled = disabled;

        o.inputMask = phoneConvert;
      }
      if (keys.includes('idCard') && key === formKey.idCard) {
        o.disabled = disabled;

        o.inputMask = (v, item) => {
          return idCardConvert(v);
        };
      }
    });
  };

  const init = async () => {
    const { mobile } = gStores.userStore.cacheUser;
    let { formExtraKeys = [], formExtraKeysInQuickAddPatPage = [] } =
      pageConfig.value;
    formExtraKeys = formExtraKeys.filter(
      (key) => !['countries'].includes(typeof key === 'string' ? key : key.key)
    );

    const defaultFormExtraKeys = formExtraKeys.filter(
      (o) => typeof o === 'string'
    );
    const sortFormExtraKeys = formExtraKeys.filter(
      (o) => typeof o !== 'string'
    );

    let formListKeys: TFormKeys[] = [
      'patientType',
      'patientName',
      'patientPhone',
      'verifyCode',
      'isUserInfoShareAgree',
      ...defaultFormExtraKeys,
      'defaultFalg',
    ] as any;

    let { isSmsVerify, isHidePatientTypeInPerfect, isUserInfoShareAgree } =
      pageConfig.value;

    if (isUserInfoShareAgree !== '1') {
      // 允许该平台访问院内此用户的就诊数据
      formListKeys = formListKeys.filter(
        (key) => key !== 'isUserInfoShareAgree'
      );
    }

    if (isHidePatientTypeInPerfect === '1') {
      formListKeys = formListKeys.filter((key) => key !== 'patientType');
    }

    // isSmsVerify = '0';

    let isFilterSmsVerify = false;
    if (pageProps.value.pageType !== 'perfectReal') {
      // #ifdef MP-ALIPAY
      // 支付宝第一个就诊人自动带入信息 不需要验证码
      if (!patList.length && mobile) {
        isFilterSmsVerify = true;
      }
      // #endif
    }

    // 关闭手机验证码
    if (
      isSmsVerify !== '1' ||
      pageProps.value.pageType === 'perfectReal' ||
      isFilterSmsVerify
    ) {
      formListKeys = formListKeys.filter((key) => key !== 'verifyCode');
    }

    insertSortFormExtraKey(sortFormExtraKeys, formListKeys);
    insertSortFormExtraKey(formExtraKeysInQuickAddPatPage, formListKeys);
    console.log(formListKeys, formExtraKeysInQuickAddPatPage);

    formList = pickTempItem(formListKeys);
    const defaultValue = await getDefaultFormData(
      pageProps.value.pageType || 'addPatient'
    );
    Object.assign(formData.value, defaultValue);

    if (pageProps.value.pageType === 'perfectReal') {
      const medicalTypeItem = formList.find(
        (o) => o.key === formKey.patientType
      );

      // 完善时候只能有证件号的类型
      if (medicalTypeItem) {
        medicalTypeItem.disabled = true;
        medicalTypeItem.showSuffixArrowIcon = false;
      }
    } else {
      const { patientPhone, patientName } = pageProps.value;

      if (patientPhone || patientName) {
        if (patientPhone) {
          formData.value.patientPhone = patientPhone;
          maskInfo(formList, {
            keys: ['patientPhone'],
            disabled: true,
          });
        }

        if (patientName) {
          formData.value.patientName = patientName;
          maskInfo(formList, {
            keys: ['patientName'],
            disabled: true,
          });
        }
      } else {
        if (gStores.globalStore.ev === 'alipay') {
          // 支付宝第一个就诊人自动带入信息并加密(新增就诊人)
          if (!patList.length && mobile) {
            const maskKeys: any[] = [];
            const { userName, mobile, certNo } = gStores.userStore.cacheUser;

            if (userName) {
              maskKeys.push('patientName');
            }

            if (mobile) {
              maskKeys.push('patientPhone');
            }

            if (
              certNo &&
              formExtraKeysInQuickAddPatPage.find((f) => f.key === 'idCard') &&
              formData.value['idCard'] &&
              idValidator.checkIdCardNo(formData.value['idCard'])
            ) {
              maskKeys.push('idCard');
            }

            maskInfo(formList, {
              keys: maskKeys,
              // disabled: true,
            });
          }
        }
      }
    }

    formList.map((o) => {
      const { key } = o;

      if (key !== formKey.defaultFalg) {
        o.labelWidth = undefined;
      }

      if (formData.value[key] && key !== formKey.defaultFalg) {
        o.disabled = true;
      }

      // 额外信息存在证件类型与证件号时，默认值未存在身份证或者未通过身份证校验时，可编辑
      if (
        formExtraKeysInQuickAddPatPage.find((f) => f.key === 'idType') &&
        (!formData.value['idCard'] ||
          !idValidator.checkIdCardNo(formData.value['idCard']))
      ) {
        o.disabled = false;
      }
    });
    _formList.value = formList;
    gform.value.setList(formList);

    //是否医保建档
    const medicalMHelp = globalGl.sConfig.medicalMHelp!;
    // #ifdef  MP-WEIXIN
    //先实现支付宝
    // #endif
    // #ifdef MP-ALIPAY
    isMedicalFiling.value = medicalMHelp?.alipay?.medicalFiling === '1';
    // #endif
    console.log('formData.value', formData.value);
  };

  onReady(() => {
    if (pageProps.value.pageType === 'perfectReal') {
      uni.setNavigationBarTitle({
        title: '完善本人实名信息',
      });
    }
  });

  onMounted(async () => {
    routeStore.receiveQuery(pageProps.value);
    pageConfig.value = await ServerStaticData.getSystemConfig('person');
    await useAuthPersonInit();
    init();

    // #ifdef MP-ALIPAY
    if (globalGl.sConfig.login?.isAliAuthBase !== '1') {
      await loginAuthAlipay(init);
    }
    // #endif
    await wait(20);
    await initSign();
    // await wait(2000);
    // realNameAuth(gStores.userStore.patChoose)
  });

  onShow(() => {
    signAfterOnPageShow();
    reDealMedicalFiling();
  });

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    if (!pageProps.value.pageType) {
      pageProps.value.pageType = 'addPatient';
    }
  });
</script>

<style lang="scss" scoped>
  .page {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .container {
    // height: 1px;
    flex: 1;
    overflow-y: scroll;
  }

  .footer {
    background-color: var(--h-color-white);
    padding: 24rpx 32rpx 48rpx;
    position: reactive;
    z-index: 1;
  }

  .verify-idcard-btn {
    background-color: #e0e4e6;
  }
</style>
