<template>
  <view class="page">
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
      :confirmText="pageType === 'perfectReal' ? '立即补充' : '添加'"
    />

    <view class="footer">
      <Fg-Agree v-model:isCheck="isCheck" />
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
  import { PatientUtils, GStores, routerJump, ServerStaticData } from '@/utils';
  import {
    FormKey,
    pickTempItem,
    formKey,
    TFormKeys,
    getDefaultFormData,
  } from './utils';
  import { joinQuery } from '@/common';
  import { onReady } from '@dcloudio/uni-app';
  import { useUserStore, useMessageStore, useRouterStore } from '@/stores';
  import type { TInstance } from '@/components/g-form/index';
  import { decryptDes } from '@/common/des';

  import api from '@/service/api';
  import globalGl from '@/config/global';

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
  const gform = ref<any>('');
  const formData = ref<BaseObject>({
    // patientName: '大钢炮22',
    // patientPhone: '13868529891',
    // [formKey.verify]: '2313',
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

    // const { isSmsVerify } = await ServerStaticData.getSystemConfig('person');

    // formData 值和页面渲染列表key 对应
    const data: any = {
      ...formData.value,
      verifyType: formData.value[formKey.verifyCode] && '2', // '2' 开启 短信验证
    };

    if (data.patientName) {
      data.patientName = data.patientName.trim();
    }

    /**

    const value = formData.value;
      await patientUtil.addPatient({
        ...data,
        defaultFalg: value[formKey.defaultFalg] ? '1' : '0',
        herenId: patientUtil.globalStore.herenId,
        patientName: value[formKey.patientName],
        patientPhone: value[formKey.patientPhone],
        source: patientUtil.globalStore.browser.source,
        patientType: formData.value[formKey.patientType],
        verifyCode: formData.value[formKey.verify],
      });

      await patientUtil.getPatCardList();
      if (props._directUrl) {
        routerJump(decodeURIComponent(props._directUrl) as `/${string}`);
      } else {
        routerJump('/pages/home/home');
      }
     */

    // 完善逻辑
    if (props.pageType === 'perfectReal') {
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
      await patientUtil
        .addPatient({
          ...data,
          defaultFalg: value[formKey.defaultFalg] ? '1' : '0',
          herenId: patientUtil.globalStore.herenId,
          patientName: value[formKey.patientName],
          patientPhone: value[formKey.patientPhone],
          source: patientUtil.globalStore.browser.source,
          patientType: formData.value[formKey.patientType],
          verifyCode: formData.value[formKey.verifyCode],
        })
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

  onReady(() => {
    if (props.pageType === 'perfectReal') {
      uni.setNavigationBarTitle({
        title: '完善账号实名信息',
      });
    }
  });

  onMounted(async () => {
    routeStore.receiveQuery(props);

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
    // 关闭手机验证码
    if (isSmsVerify === '0' || props.pageType === 'perfectReal') {
      formListKeys = formListKeys.filter((key) => key !== 'verifyCode');
    }

    formList = pickTempItem(formListKeys);
    const defaultValue = await getDefaultFormData(
      props.pageType || 'addPatient'
    );
    Object.assign(formData.value, defaultValue);

    formList.map((o) => {
      const { key } = o;
      if (formData.value[key] !== undefined && key !== formKey.defaultFalg) {
        o.disabled = true;
      }
    });

    if (props.pageType === 'perfectReal') {
      const medicalTypeItem = formList.find(
        (o) => o.key === formKey.patientType
      );

      // 完善时候只能有证件号的类型
      if (medicalTypeItem) {
        medicalTypeItem.disabled = true;
        medicalTypeItem.showSuffixArrowIcon = false;
      }
    }

    formList.map((o) => {
      const { key } = o;

      if (key !== formKey.defaultFalg) {
        o.labelWidth = undefined;
      }
    });

    gform.value.setList(formList);
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
