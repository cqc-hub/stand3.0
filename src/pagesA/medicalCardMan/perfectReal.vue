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

    <!-- <view class="aa">
			{{ JSON.stringify(formData) }}
		</view> -->

    <g-message />
    <xy-dialog
      :show="dialogShow"
      :content="dialogContent"
      @confirmButton="dialogConfirmRRR"
      @cancelButton="dialogShow = false"
      confirmText="立即补充"
    />

    <view class="footer">
      <view @click="isCheck = !isCheck" class="fg-agree">
        <view
          :class="{
            'is-check': isCheck,
          }"
          class="iconfont check-box"
        >
          &#xe6d0;
        </view>
        <view>
          <text>我已阅读并同意</text>
          <text @click.stop="goAgrement" class="fg-agree-name">
            《用户条款和隐私政策》
          </text>
          <text>这个是协议配置编号待定（不支持富文本）</text>
        </view>
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
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, withDefaults, reactive } from 'vue';
  import { PatientUtils, GStores, routerJump, ServerStaticData } from '@/utils';
  import { FormKey, pickTempItem, formKey, TFormKeys } from './utils';
  import { joinQuery } from '@/common';
  import { onReady } from '@dcloudio/uni-app';
  import { useUserStore, useMessageStore, useRouterStore } from '@/stores';
  import type { TInstance } from '@/components/g-form/index';

  import api from '@/service/api';

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
  const goAgrement = () => {
    uni.navigateTo({
      url: '/pagesA/mySet/userPolicy',
    });
  };

  const dialogShow = ref(false);
  const dialogContent = ref('');
  let dialogConfirm = () => {};
  const dialogConfirmRRR = () => {
    dialogShow.value = false;
    dialogConfirm();
  };

  const formSubmit = async ({}) => {
    if (!isCheck.value) {
      messageStore.showMessage('请勾选下方同意书', 1500);

      return;
    }

    const data = formData.value;
    try {
      const { result } = await api.getPatCardInfoByHospital(data);
      if (result) {
        const { jump, cardNumber, idCard, idType, patientSex, jumpMsg } =
          result;
        const { patientPhone, patientName } = data;

        if (jump === 0) {
          if (props.pageType === 'perfectReal') {
            try {
              await patientUtil.registerUser({
                ...data,
                idCard,
                idType,
                patientPhone,
                patientName,
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
            const value = formData.value;
            await patientUtil.addPatient({
              ...data,
              defaultFalg: value[formKey.defaultFalg] ? '1' : '0',
              herenId: patientUtil.globalStore.herenId,
              patientName: value[formKey.patientName],
              patientPhone: value[formKey.patientPhone],
              source: patientUtil.globalStore.browser.source,
              patientType: formData.value[formKey.patientType],
              verifyCode: formData.value[formKey.verify] || '1',
            });

            await patientUtil.getPatCardList();
            if (props._directUrl) {
              routerJump(decodeURIComponent(props._directUrl) as `/${string}`);
            } else {
              routerJump('/pages/home/home');
            }
          }
        } else {
          dialogContent.value = jumpMsg;
          dialogShow.value = true;

          dialogConfirm = () => {
            uni.navigateTo({
              url: joinQuery('/pagesA/medicalCardMan/addMedical', {
                ...data,
                pageType: props.pageType,
              }),
            });
          };
        }
      }
    } catch (error) {
      const err = error as { respCode: number; message: string };

      if (err) {
        const { respCode, message } = err;

        if (respCode === 999301) {
          dialogContent.value = message;
          dialogShow.value = true;
          dialogConfirm = () => {
            uni.navigateTo({
              url: joinQuery('/pagesA/medicalCardMan/addMedical', {
                ...data,
                pageType: props.pageType,
              }),
            });
          };
        } else {
          gStores.messageStore.showMessage(message, 1500);
        }
      }
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
    let formListKeys: TFormKeys[] = [
      'patientType',
      'patientName',
      'patientPhone',
      'verify',
      'defaultFalg',
    ];
    const { isSmsVerify } = await ServerStaticData.getSystemConfig('person');
    if (isSmsVerify === '0') {
      formListKeys = formListKeys.filter((key) => key !== 'verify');
    }

    formList = pickTempItem(formListKeys);

    routeStore.receiveQuery(props);
    const { userName, mobile } = gStores.userStore.cacheUser;
    if (props.pageType === 'perfectReal') {
      // 只有支付宝有
      if (userName && mobile) {
        formData.value[formKey.patientName] = userName;
        formData.value[formKey.patientPhone] = mobile;

        formList.map((o) => {
          const { key } = o;
          o.labelWidth = undefined;
          if (
            [formKey.patientName, formKey.patientPhone].includes(key as any)
          ) {
            o.disabled = true;
          }
        });
      }

      const medicalTypeItem = formList.find(
        (o) => o.key === formKey.patientType
      );

      // 完善时候只能有证件号的类型
      if (medicalTypeItem) {
        medicalTypeItem.disabled = true;
        medicalTypeItem.showSuffixArrowIcon = false;
      }
    }

    console.log(formList);

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

  .fg-agree {
    display: flex;
    font-size: var(--hr-font-size-xs);
    align-items: flex-start;
    margin-bottom: 24rpx;

    .fg-agree-name {
      color: var(--hr-brand-color-6);
    }

    .check-box {
      color: var(--hr-neutral-color-7);
      font-size: 40rpx;
      margin-right: 4rpx;
      transform: translateY(-5rpx);

      &.is-check {
        color: var(--hr-brand-color-6);
      }
    }
  }
</style>
