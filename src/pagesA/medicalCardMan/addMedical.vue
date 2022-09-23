<template>
  <view>
    <scroll-view class="scroll-container" scroll-y>
      <view class="form-container">
        <g-form
          v-model:value="formData"
          @submit="formSubmit"
          @change="formChange"
          @input-blur="formInputBlur"
          @select-change="selectChange"
          @address-change="addressChange"
          @ocr-ident="ocrIdent"
          :show-require-icon="false"
          bodyBold
          ref="gform"
        />
      </view>

      <g-message />
      <view class="footer">
        <button
          @click="gform.submit"
          :class="{
            'btn-disabled': btnDisabled
          }"
          class="btn btn-primary"
        >
          保存
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, nextTick, onMounted, computed } from 'vue';
  import { FormKey, pickTempItem, formKey, TFormKeys } from './utils';
  import {
    GStores,
    idValidator,
    PatientUtils,
    ServerStaticData,
    routerJump,
    OcrRes
  } from '@/utils';
  import { onReady } from '@dcloudio/uni-app';
  import { useRouterStore } from '@/stores';

  import dayjs from 'dayjs';

  const routeStore = useRouterStore();

  interface TPageType extends ILoginBack {
    patientName: 'string';
    // patientType: 'string';
    patientType: 'string';
    verifyCode: 'string';
    defaultFalg: 'string';
    patientPhone: 'string';
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
  const props = defineProps<TPageType>();
  const patientUtils = new PatientUtils();
  const gStores = new GStores();
  const gform = ref<any>('');
  const formData = ref<Partial<Record<TFormKeys, any>>>({});
  const addressChoose = {
    addressProvince: '',
    addressCity: '',
    addressCounty: '',
    addressCountyCode: ''
  };
  let verifyCode = '';

  let formList = pickTempItem([
    'patientType',
    'patientName',
    'patientPhone',
    'verify',
    'defaultFalg'
  ]);

  const formSubmit = async ({ data }) => {
    const formKeyNow = formList.map((o) => o.key);
    const filterData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        return [key, formKeyNow.includes(key) ? value : undefined];
      })
    );

    const requestData = {
      ...filterData,
      ...addressChoose,
      verifyCode
    };

    if (props.pageType === 'perfectReal') {
      await patientUtils.registerUser(requestData, {
        addPatInterface: 'relevantPatient'
      });

      if (props._directUrl) {
        routerJump(decodeURIComponent(props._directUrl) as `/${string}`);
      } else {
        routerJump('/pages/home/home');
      }
    } else {
      await patientUtils.addRelevantPatient(requestData);
      if (props._directUrl) {
        routerJump(decodeURIComponent(props._directUrl) as `/${string}`);
      } else {
        routerJump('/pages/home/home');
      }
    }
  };

  const formChange = ({ item, value, oldValue }) => {
    if (item.key === formKey.patientType && oldValue !== value) {
      medicalTypeChange(value);
    }
  };

  const selectChange = (e) => {
    const { item, value } = e;

    switch (item.key) {
      case formKey.idType:
        idCardChange();
        break;

      default:
        break;
    }
  };

  const addressChange = (e) => {
    const { value } = e;
    const [addressProvince, addressCity, addressCounty] = value;

    addressChoose.addressProvince = addressProvince.text;
    addressChoose.addressCity = addressCity.text;
    addressChoose.addressCounty = addressCounty.text;
    addressChoose.addressCountyCode = addressCounty.value;
  };

  // 证件类型变化
  const idCardChange = () => {
    formData.value[formKey.idCard] = '';

    nextTick(() => {
      medicalTypeChange(formData.value[formKey.patientType]);
    });
  };

  const formInputBlur = (e) => {
    const { item, value } = e;

    if (
      item.key == formKey.idCard &&
      formData.value[formKey.patientType] === '-1'
    ) {
      medicalTypeChange('-1');
    }
  };

  const ocrIdent = async (res: OcrRes) => {
    const { name, nation, address, idCard } = res;

    if (address) {
      formData.value.location = address;
    }

    if (name) {
      formData.value.patientName = name;
    }

    if (idCard) {
      formData.value.idCard = idCard;
    }

    if (nation) {
      const list = await ServerStaticData.getNationTerms();
      const item = list.find((o) => o.label === nation);
      formData.value.nation = item?.value || nation;
    }
  };

  /**
   *
   * @param value
   * 	-1  成人、儿童（有证件）
   * 	0  新生儿（无证件)
   *  1  军人
   *  2  军属
   */
  const medicalTypeChange = async (value: '-1' | '0' | '1' | '2') => {
    const listArr: TFormKeys[] = [formKey.patientType];
    const _sexAndBirth = [formKey.sex, formKey.birthday];
    const _parentInfo = [formKey.upName, formKey.upIdCard];

    switch (value) {
      case '-1':
        let lessThenSix: boolean = false;

        // 证件类型： 身份证
        if (formData.value[formKey.idType] === '01') {
          const idCard = formData.value[formKey.idCard];

          // 有身份证不需要填写 生日、性别
          _sexAndBirth.length = 0;

          if (idCard && idValidator.checkIdCardNo(idCard)) {
            const cardInfo = idValidator.getIdCardInfo(idCard);
            if (cardInfo.age <= 6) {
              lessThenSix = true;
            }
          }
        } else {
          const birthday = formData.value[formKey.birthday] as string;

          if (birthday) {
            lessThenSix = dayjs().diff(dayjs(birthday), 'year') <= 6;
          }
        }

        // 显示监护人
        if (!lessThenSix) {
          _parentInfo.length = 0;
        }

        listArr.push(
          ...[
            formKey.patientName,
            ..._sexAndBirth,
            formKey.idType,
            formKey.idCard,
            ..._parentInfo,
            formKey.nation,
            formKey.patientPhone,
            formKey.address,
            formKey.location,
            formKey.defaultFalg
          ]
        );

        break;

      case '0':
        listArr.push(
          ...[
            formKey.patientName,
            ..._sexAndBirth,
            ..._parentInfo,
            formKey.nation,
            formKey.patientPhone,
            formKey.address,
            formKey.location,
            formKey.defaultFalg
          ]
        );
        break;

      default:
        gStores.messageStore.showMessage('未知的就诊人类型');
        break;
    }

    formList = pickTempItem(listArr);

    const idCardItem = formList.find((o) => o.key === formKey.idCard);
    if (idCardItem) {
      idCardItem.validator = (v) => {
        const value = v as string;
        let isErr = false;
        if (formData.value[formKey.idType] === '01') {
          if (!idValidator.checkIdCardNo(value)) {
            isErr = true;
          }
        }

        if (isErr) {
          return Promise.resolve({
            success: false,
            message: '请确认证件号码是否有误'
          });
        } else {
          return Promise.resolve({
            success: true
          });
        }
      };

      const patientNameItem = formList.find(
        (o) => o.key === formKey.patientName
      );

      if (patientNameItem) {
        patientNameItem.ocr = true;
        // patientNameItem.showSuffixArrowIcon = true;
      }
    }

    const patientNameItem = formList.find((o) => o.key === formKey.patientName);
    if (patientNameItem) {
      patientNameItem.disabled = true;
    }

    formList.map((o) => {
      const { key } = o;
      if (
        [
          formKey.patientType,
          formKey.patientName,
          formKey.patientPhone
        ].includes(key as any)
      ) {
        if (formData.value[key]) {
          o.disabled = true;
        }

        if (key === formKey.patientType) {
          o.showSuffixArrowIcon = false;
        }
      }

      if (value === '0' && key === formKey.birthday) {
        o.validator = async (v) => {
          const { ageChildren } = await ServerStaticData.getSystemConfig(
            'person'
          );

          if (dayjs().diff(dayjs(v as string), 'month') >= ageChildren) {
            return Promise.resolve({
              success: false,
              message: '新生儿年龄不能大于' + ageChildren + '个月'
            });
          }

          return {
            success: true
          };
        };
      }
    });

    console.log(formList);

    nextTick(() => {
      gform.value.setList(formList);
    });
  };

  const btnDisabled = computed(() => {
    let isDisabled = false;
    const formKeys = formList.map((o) => o.key);
    Object.entries(formData.value).map(([key, value]) => {
      if (formKeys.includes(key) && value === '') {
        isDisabled = true;
      }
    });

    // return isDisabled;
    return false;
  });

  onReady(() => {
    if (props.pageType === 'perfectReal') {
      uni.setNavigationBarTitle({
        title: '完善账号实名信息'
      });
    }
  });

  onMounted(() => {
    routeStore.receiveQuery(props);
    formData.value = Object.fromEntries(
      Object.entries(props).map(([key, value]) => {
        if (key === formKey.defaultFalg) {
          (value as any) = (value as unknown) === 'false' ? false : true;
        }
        return [key, value];
      })
    );

    // 默认身份证
    formData.value[formKey.idType] = '01';
    // formData.value[formKey.idType] = '02';
    verifyCode = formData.value[formKey.verify];

    if ((props.patientType as string) === '-1') {
      // #ifdef MP-ALIPAY
      if (props.pageType === 'perfectReal') {
        formData.value[formKey.idCard] = gStores.userStore.cacheUser.certNo;
      }
      // #endif
    }

    nextTick(() => {
      // medicalTypeChange('-1');
      medicalTypeChange(formData.value[formKey.patientType]);
    });
  });
</script>

<style lang="scss" scoped>
  .scroll-container {
    height: 100vh;

    .form-container {
      // margin: 16rpx 32rpx;
      margin-bottom: 100rpx;
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: var(--h-color-white);
    padding: 32rpx 32rpx 68rpx;
  }
</style>
