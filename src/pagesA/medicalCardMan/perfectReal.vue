<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <view class="g-container" scroll-y>
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
      :confirmText="pageType === 'perfectReal' ? '立即补充' : '添加'"
    />

    <view class="footer">
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
  import { ref, onMounted, computed, withDefaults, reactive } from 'vue';
  import {
    PatientUtils,
    GStores,
    routerJump,
    ServerStaticData,
    nameConvert,
    wait,
  } from '@/utils';
  import {
    pickTempItem,
    formKey,
    TFormKeys,
    getDefaultFormData,
    formatterSubPatientData,
    loginAuthAlipay,
  } from './utils';
  import { joinQuery } from '@/common';
  import { onReady } from '@dcloudio/uni-app';
  import { useUserStore, useMessageStore, useRouterStore } from '@/stores';
  import type { TInstance } from '@/components/g-form/index';

  import api from '@/service/api';

  import FgAgree from './components/fgAgree.vue';

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
  const props = withDefaults(defineProps<TPageType>(), {
    pageType: 'addPatient',
  });
  const patientUtil = new PatientUtils();
  const gStores = new GStores();
  const patList = gStores.userStore.patList;
  const gform = ref<any>('');
  const formData = ref<BaseObject>({
    [formKey.patientType]: '-1',
    [formKey.defaultFalg]: true,
  });

  let formList: TInstance[] = [];

  const isCheck = ref(false);

  const dialogShow = ref(false);
  const dialogContent = ref('');
  let dialogConfirm = () => {};
  const dialogConfirmRRR = () => {
    dialogShow.value = false;
    dialogConfirm();
  };

  const formSubmit = async ({}) => {
    if (!isCheck.value) {
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
      verifyType: formData.value[formKey.verifyCode] && '2', // '2' 开启 短信验证
      source,
    };

    if (data.patientName) {
      formData.value[formKey.patientName] = data.patientName.trim();
    }

    // 完善逻辑
    if (props.pageType === 'perfectReal') {
      const { authPhoneVerify } = gStores.userStore;
      if (!formData.value[formKey.verifyCode]) {
        data.authPhoneVerify = authPhoneVerify;
      }

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
                verifyType: '',
                cellPhoneNumber,
                idCardEncry,
                sex: (patientSex && (patientSex === '男' ? '1' : '2')) || '',
                birthday,
              });

              routerJump('/pages/home/home');
            } catch (error) {
              if ((error as any)?.errorType === 'add') {
                uni.reLaunch({
                  url: '/pages/home/home',
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
                  pageType: props.pageType,
                  _directUrl: props._directUrl,
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
                  pageType: props.pageType,
                  _directUrl: props._directUrl,
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
      if (!formData.value[formKey.verifyCode]) {
        // #ifdef MP-ALIPAY
        const { patList, authPhoneVerify } = gStores.userStore;

        if (!patList.length) {
          requestArg.authPhoneVerify = authPhoneVerify;
        }
        // #endif
      }

      await patientUtil
        .addPatient(requestArg)
        .then(async () => {
          // 切换默认就诊人
          if (value[formKey.defaultFalg]) {
            gStores.userStore.updatePatChoose({} as any);
          }
          await patientUtil.getPatCardList();

          if (props._directUrl) {
            routerJump(decodeURIComponent(props._directUrl) as `/${string}`);
          } else {
            routerJump('/pages/home/home');
          }
        })
        .catch((err) => {
          if (err?.respCode === 999301) {
            messageStore.showMessage(err.message, 3000, {
              closeCallBack() {
                uni.navigateTo({
                  url: joinQuery('/pagesA/medicalCardMan/addMedical', {
                    ...data,
                    pageType: props.pageType,
                    _directUrl: props._directUrl,
                  }),
                });
              },
            });
          }
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

  const init = async () => {
    let formListKeys: TFormKeys[] = [
      'patientType',
      'patientName',
      'patientPhone',
      'verifyCode',
      'defaultFalg',
    ];
    let { isSmsVerify, isHidePatientTypeInPerfect } =
      await ServerStaticData.getSystemConfig('person');

    if (isHidePatientTypeInPerfect === '1') {
      formListKeys = formListKeys.filter((key) => key !== 'patientType');
    }
    // isSmsVerify = '0';

    let isFilterSmsVerify = false;
    if (props.pageType !== 'perfectReal') {
      // #ifdef MP-ALIPAY
      // 支付宝第一个就诊人自动带入信息 不需要验证码
      if (!patList.length) {
        isFilterSmsVerify = true;
      }
      // #endif
    }

    // 关闭手机验证码
    if (
      isSmsVerify === '0' ||
      props.pageType === 'perfectReal' ||
      isFilterSmsVerify
    ) {
      formListKeys = formListKeys.filter((key) => key !== 'verifyCode');
    }

    formList = pickTempItem(formListKeys);
    const defaultValue = await getDefaultFormData(
      props.pageType || 'addPatient'
    );
    Object.assign(formData.value, defaultValue);

    if (props.pageType === 'perfectReal') {
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
      if (!patList.length) {
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
  };

  onReady(() => {
    if (props.pageType === 'perfectReal') {
      uni.setNavigationBarTitle({
        title: '完善账号实名信息',
      });
    }
  });

  onMounted(async () => {
    routeStore.receiveQuery(props);
    init();

    // #ifdef MP-ALIPAY
    await loginAuthAlipay(init);
    // #endif
  });
</script>

<style lang="scss" scoped>


  .footer {
    background-color: var(--h-color-white);
    padding: 24rpx 32rpx 48rpx;
    position: reactive;
    z-index: 1;
  }
</style>
