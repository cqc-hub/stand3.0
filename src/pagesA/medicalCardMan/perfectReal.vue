<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
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
      <g-flag typeFg="51" isShowFgTip />
    </view>

    <g-message />
    <xy-dialog
      :show="dialogShow"
      :content="dialogContent"
      @confirmButton="dialogConfirmRRR"
      @cancelButton="dialogShow = false"
      :confirmText="pageProps.pageType === 'perfectReal' ? '立即补充' : '添加'"
    />
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
        v-model:isCheck="isAgreeSign"
        :systemModeOld="gStores.globalStore.modeOld"
        @show-agree="regDialogConfirmSign.show"
        content="《免密代扣协议》"
        cusShowAgree
      />
      <Fg-Agree
        v-model:isCheck="isCheck"
        :systemModeOld="gStores.globalStore.modeOld"
      />
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
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, withDefaults ,type Ref} from 'vue';
  import {
    PatientUtils,
    GStores,
    routerJump,
    ServerStaticData,
    nameConvert,
    getH5OpenidParam,
    ISystemConfig,
    wait,
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
  } from './utils';
  import { deQueryForUrl, joinQuery } from '@/common';
  import { onLoad, onReady, onShow } from '@dcloudio/uni-app';
  import { useMessageStore, useRouterStore } from '@/stores';
  import type { TInstance } from '@/components/g-form/index';
  import { isMedicalSelf, dealMedicalFiling } from '@/pagesA/clinicPay/utils/clinicPayDetail'

  import api from '@/service/api';

  import FgAgree from './components/fgAgree.vue';
  import globalGl from '@/config/global';
  import SelCardDialog from './components/SelCardDialog.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';

  interface TPageType extends ILoginBack {
    pageType: 'addPatient' | 'perfectReal';

    // 微信小程序必须显示写出来， 否则接收不到
    _p?: string;
    _url?: string;
    _query?: string;
    _type?: '1' | '2';
    _isOutLogin?: '1';
    _pageInfo?: '1' | '2';
    _directUrl?: string;
  }

  const routeStore = useRouterStore();
  const messageStore = useMessageStore();
  const pageProps = ref(<TPageType>{
    pageType: 'addPatient',
  });
  const pageConfig = ref(<ISystemConfig['person']>{});

  const patientUtil = new PatientUtils();
  const gStores = new GStores();
  const patList = gStores.userStore.patList;
  const gform = ref<any>('');
  const formData = ref<BaseObject>({
    [formKey.patientType]: '-1',
    [formKey.defaultFalg]: true,
    // patientName: '李继民',
    // [formKey.patientPhone]: '15939324648',
  });

  let formList: TInstance[] = [];

  const isCheck = ref(false);

  const dialogSelCardShow = ref(false);
  const dialogShow = ref(false);
  const dialogContent = ref('');
  const regDialogMedicalFiling:Ref<any>=ref('')
  const isMedicalFiling = ref(false);
  let dialogConfirm = () => {};
  const cardPatList = ref(<TCardPat[]>[]);
  const dialogConfirmRRR = () => {
    dialogShow.value = false;
    dialogConfirm();
  };
  const newPat=ref()
  const activeCardSelCardNumber = ref('');
  const selCardPat = (pat: TCardPat) => {
    activeCardSelCardNumber.value = pat.cardNumber;
  };

  const chooseCard = (cardNumber: string) => {
    if (!cardNumber) {
      gStores.messageStore.showMessage('请选择就诊卡', 3000);
      return;
    }

    dialogSelCardShow.value = false;
    dialogConfirm();
  };

  const formSubmit = async ({}) => {
    if (!isCheck.value || (isSignExist.value && !isAgreeSign.value)) {
      messageStore.showMessage('请勾选下方同意书', 3000);

      return;
    }

    formData.value = formatterSubPatientData(formData.value);

    // const { isSmsVerify } = await ServerStaticData.getSystemConfig('person');

    // formData 值和页面渲染列表key 对应
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

          if (jump === 0) {
            try {
              await patientUtil.registerUser({
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
                url: joinQuery('/pagesA/medicalCardMan/addMedical', {
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
                url: joinQuery('/pagesA/medicalCardMan/addMedical', {
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
      // 新增就诊人
      const value = formData.value;
      const requestArg = {
        ...data,
        defaultFalg: value[formKey.defaultFalg] ? '1' : '0',
        herenId: patientUtil.globalStore.herenId,
        patientName: value[formKey.patientName],
        patientPhone: value[formKey.patientPhone],
        source: patientUtil.globalStore.browser.source,
        patientType: formData.value[formKey.patientType],
        verifyCode: formData.value[formKey.verifyCode],
      };

      if (globalGl.sConfig.isSearchHosForAddPatHasMoreThanOneCard === '1') {
        getH5OpenidParam(requestArg);
        const {
          result: { cardList, data: resData },
        } = await api.getAllCardByName(requestArg).catch((err) => {
          dealNetError(err, data);
          throw new Error(err);
        });

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
        const patientId = await patientUtil
          .addPatient(requestArg)
          .catch((err) => {
            dealNetError(err, data);
            throw new Error(err);
          });
          const {result:pat} = await api.getPatCardInfo({
            "herenId":  patientUtil.globalStore.herenId,
            "patientId": patientId,
            "source":  patientUtil.globalStore.browser.source,
          })
          newPat.value=pat
          const flag = await isMedicalSelf(newPat.value.cardNumber)
          if(isMedicalFiling.value&&flag){
            regDialogMedicalFiling.value.show()
            return
            }else{
            await goPaySign(patientId);
          }
        
      }

      // 切换默认就诊人
      if (value[formKey.defaultFalg]) {
        gStores.userStore.updatePatChoose({} as any);
      }
      await patientUtil.getPatCardList();

      if (pageProps.value._directUrl) {
        routerJump(pageProps.value._directUrl as `/${string}`);
      } else {
        routerJump('/pagesA/medicalCardMan/medicalCardMan');
      }
    }
  };

  const dealNetError = (err, data) => {
    if (err?.respCode === 999301) {
      messageStore.showMessage(err.message, 3000, {
        closeCallBack() {
          uni.navigateTo({
            url: joinQuery('/pagesA/medicalCardMan/addMedical', {
              ...data,
              pageType: pageProps.value.pageType,
              _directUrl: pageProps.value._directUrl,
            }),
          });
        },
      });
    }
  };

  const formChange = ({ item, value }) => {};

  const btnDisabled = computed(() => {
    let isDisabled = false;
    const formKeys = formList.map((o) => o.key);
    Object.entries(formData.value).map(([key, value]) => {
      if (formKeys.includes(key) && value === '') {
        isDisabled = true;
      }
    });

    return isDisabled;
  });

  const {
    regDialogConfirmSign,
    flagTitle1203,
    disagreeSign,
    initSign,
    goPaySign,
    signAfterOnPageShow,
    isAgreeSign,
    isSignExist,
  } = useProgramPaySign();

  //医保更新用户信息,医保建档
  const medicalFiling = async ( ) => {
    const flag = await dealMedicalFiling(newPat.value.patientId)
    if(flag){
      await goPaySign(newPat.value.patientId);
      routerJump('/pages/home/home');
    }else{
      regDialogMedicalFiling.value.show()
    }
  }

  const init = async () => {
    const { userName, mobile } = gStores.userStore.cacheUser;

    let formListKeys: TFormKeys[] = [
      'patientType',
      'patientName',
      'patientPhone',
      'verifyCode',
      'defaultFalg',
    ];
    pageConfig.value = await ServerStaticData.getSystemConfig('person');
    let { isSmsVerify, isHidePatientTypeInPerfect, isPayWithoutSecretAuth } =
      pageConfig.value;

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
      // #ifdef MP-ALIPAY
      // 支付宝第一个就诊人自动带入信息并加密(新增就诊人)
      if (!patList.length && mobile) {
        formList.map((o) => {
          const { key } = o;

          if (key === formKey.patientName) {
            o.disabled = true;
            o.inputMask = (v, item) => {
              return nameConvert(v);
            };
          }

          if (key === formKey.patientPhone) {
            o.disabled = true;

            o.inputMask = (v, item) => {
              if (v) {
                const idReg = /(\d{3})\d*(\d{4})/;
                return v.replace(idReg, '$1******$2');
              } else {
                return '';
              }
            };
          }
        });
      }
      // #endif
    }

    formList.map((o) => {
      const { key } = o;

      if (key !== formKey.defaultFalg) {
        o.labelWidth = undefined;
      }

      if (formData.value[key] && key !== formKey.defaultFalg) {
        o.disabled = true;
      }
    });


    gform.value.setList(formList);

    //是否医保建档
    const medicalMHelp = globalGl.sConfig.medicalMHelp!;
      // #ifdef  MP-WEIXIN
      //先实现支付宝
      // #endif
      // #ifdef MP-ALIPAY
      isMedicalFiling.value= medicalMHelp.alipay?.medicalFiling === '1';
      // #endif
   
    
  };

  onReady(() => {
    if (pageProps.value.pageType === 'perfectReal') {
      uni.setNavigationBarTitle({
        title: '完善账号实名信息',
      });
    }
  });

  onMounted(async () => {
    routeStore.receiveQuery(pageProps.value);
    init();

    // #ifdef MP-ALIPAY
    if (globalGl.sConfig.login?.isAliAuthBase !== '1') {
      await loginAuthAlipay(init);
    }
    // #endif
    await wait(20);
    await initSign();
  });

  onShow(() => {
    signAfterOnPageShow();
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
    height: 1px;
    flex: 1;
    overflow-y: scroll;
  }

  .footer {
    background-color: var(--h-color-white);
    padding: 24rpx 32rpx 48rpx;
    position: reactive;
    z-index: 1;
  }
</style>
