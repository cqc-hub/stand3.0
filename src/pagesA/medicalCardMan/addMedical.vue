<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="page"
  >
    <view class="container" scroll-y>
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

      <g-flag typeFg="51" isShowFgTip />
    </view>

    <g-message />

    <view class="footer">
      <Fg-Agree v-if="_isPageFirst" v-model:isCheck="isCheck" />

      <button
        v-if="!isShowHealthLogin"
        :class="{
          'btn-disabled': btnDisabled,
        }"
        @click="gform.submit"
        class="btn btn-primary"
      >
        保存
      </button>

      <!-- #ifdef MP-WEIXIN -->
      <block v-else>
        <health-card-login
          :authLogin="false"
          :hidden="!isShowHealthLogin"
          @authSucess="wechatCodeloginSuccess"
          @authCancel="isShowHealthLogin = false"
          wechatcode
        >
          <button
            :class="{
              'btn-disabled': btnDisabled,
            }"
            class="btn btn-primary"
          >
            授权电子健康卡
          </button>
        </health-card-login>
      </block>
      <!-- #endif -->
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, nextTick, onMounted, computed } from 'vue';
  import { onReady } from '@dcloudio/uni-app';
  import { useRouterStore } from '@/stores';
  import { joinQueryForUrl } from '@/common/utils';

  import {
    pickTempItem,
    formKey,
    TFormKeys,
    getDefaultFormData,
    getHealthCardCode,
    formatterSubPatientData,
    loginAuthAlipay,
  } from './utils';
  import {
    GStores,
    idValidator,
    PatientUtils,
    ServerStaticData,
    routerJump,
    OcrFindRes,
    nameConvert,
    apiAsync,
  } from '@/utils';

  import dayjs from 'dayjs';
  import globalGl from '@/config/global';

  import FgAgree from './components/fgAgree.vue';

  const routeStore = useRouterStore();
  const isCheck = ref(false);

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
  const patList = gStores.userStore.patList;

  const isShowHealthLogin = ref(false);
  const _isPageFirst = !globalGl.systemInfo.isSearchInHos;

  const gform = ref<any>('');
  const formData = ref<Partial<Record<TFormKeys, any>>>({});
  const addressChoose = {
    addressProvince: '',
    addressCity: '',
    addressCounty: '',
    addressCountyCode: '',
  };
  let verifyCode = '';

  let formList = pickTempItem([
    'patientType',
    'patientName',
    'patientPhone',
    'verifyCode',
    'defaultFalg',
  ]);

  const isOpenOcr = async () => {
    let _isOpenOcr = false;
    const { ocr } = await ServerStaticData.getSystemConfig('person');
    // #ifdef MP-WEIXIN
    _isOpenOcr = ocr === '1';
    // #endif

    // #ifdef MP-ALIPAY
    _isOpenOcr = !!globalGl.systemInfo.isOpenOcr;
    // #endif

    return _isOpenOcr;
  };

  const formSubmit = async ({ data }) => {
    data = formatterSubPatientData(data);
    const formKeyNow = formList.map((o) => o.key);
    const filterData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        return [key, formKeyNow.includes(key) ? value : undefined];
      })
    );
    const {
      browser: { source },
    } = gStores.globalStore;

    const requestData = {
      wechatCode: '',
      verifyType: '1&bk',
      patientName: '',
      source,

      verifyCode,
      ...filterData,
      ...addressChoose,
    };

    const { patList } = gStores.userStore;

    if (requestData.patientName) {
      requestData.patientName = requestData.patientName.trim();
      formData.value[formKey.patientName] = requestData.patientName.trim();
    }

    requestData.verifyType = requestData.verifyCode ? '2&kq' : '1&bk';

    // #ifdef MP-WEIXIN
    if (globalGl.systemInfo.isOpenHealthCard) {
      const { success, res } = await getHealthCardCode();

      if (success) {
        isShowHealthLogin.value = false;
        const {
          result: { wechatCode },
        } = res;

        requestData.wechatCode = wechatCode;
      } else {
        gStores.messageStore.showMessage(
          '未授权， 请再次点击按钮进行授权',
          3000
        );
        isShowHealthLogin.value = true;
        return Promise.reject(void 0);
      }
    }
    // #endif

    const { isFace } = await ServerStaticData.getSystemConfig('person');

    if (isFace === '1') {
      if (formData.value[formKey.idType] === '01') {
        await patientUtils.faceVerify({
          idCardNumber: formData.value[formKey.idCard],
          name: formData.value[formKey.patientName],
        });
      }
    }

    if (props.pageType === 'perfectReal') {
      try {
        await patientUtils.registerUser(requestData, {
          addPatInterface: 'relevantPatient',
        });

        // await patientUtils.getPatCardList();
        if (props._directUrl) {
          routerJump(decodeURIComponent(props._directUrl) as `/${string}`);
        } else {
          routerJump('/pages/home/home');
        }
      } catch (error) {
        if ((error as any)?.errorType === 'add') {
          uni.reLaunch({
            url: '/pages/home/home',
          });
        }
      }
    } else {
      await patientUtils.addRelevantPatient(requestData).catch(async (e) => {
        const { respCode, message } = e;
        const { idCard, patientPhone, patientName, idType } = formData.value;

        if (respCode === 884801 && idType === '01' && (await isOpenOcr())) {
          gStores.messageStore.closeMessage();

          const { confirm } = await apiAsync(uni.showModal, {
            content: '患者存在建档记录但手机号不匹配，是否立即修改？',
          });
          if (confirm) {
            uni.navigateTo({
              url: joinQueryForUrl('/pagesA/medicalCardMan/ocrUser', {
                idCard,
                patientPhone,
                patientName,
                idType,
              }),
            });
          } else {
            uni.reLaunch({
              url: '/pagesA/medicalCardMan/medicalCardMan',
            });
          }
        }

        throw new Error(message);
      });
      await patientUtils.getPatCardList();
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

  const addressChange = ({ value }) => {
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

  const ocrIdent = async (res: OcrFindRes) => {
    const { name, nation, address, idCard, findResult } = res;

    if (address) {
      formData.value[formKey.location] = address;
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

    if (findResult && Object.keys(findResult).length) {
      const { detailedAddress, lastAddressItem, city, county, province } =
        findResult;

      addressChoose.addressProvince = province;
      addressChoose.addressCity = city;
      addressChoose.addressCounty = county;

      addressChoose.addressCountyCode = lastAddressItem?.value;
      formData.value[formKey.location] = detailedAddress;
      formData.value[formKey.address] = `${province}${city}${county}`;
    }
  };

  const wechatCodeloginSuccess = (e) => {
    isShowHealthLogin.value = false;
    gform.value.submit();
  };

  /**
   *
   * @param value
   * 	-1  成人、儿童（有证件）
   * 	0  新生儿（无证件)
   *  1  军人
   *  2  军属
   */
  let oldFormList: any[] = [];
  const medicalTypeChange = async (value: '-1' | '0' | '1' | '2') => {
    const listArr: TFormKeys[] = [formKey.patientType];
    const _sexAndBirth = [formKey.sex, formKey.birthday];
    const _parentInfo = [formKey.upName, formKey.upIdCard];
    const _patientInfo: TFormKeys[] = [
      formKey.nation,
      formKey.address,
      formKey.location,
      formKey.patientPhone,
      formKey.defaultFalg,
    ];

    const {
      isGuardianWithIdCard,
      ocr,
      isHidePatientTypeInPerfect,
      isSmsVerify,
    } = await ServerStaticData.getSystemConfig('person');

    if (!globalGl.systemInfo.isSearchInHos) {
      // 插入验证码(框)
      if (isSmsVerify === '1' && props.pageType !== 'perfectReal') {
        let isFilterSmsVerify = false;

        // #ifdef MP-ALIPAY
        // 支付宝第一个就诊人自动带入信息 不需要验证码
        if (!patList.length) {
          isFilterSmsVerify = true;
        }
        // #endif

        const phone_idx = _patientInfo.findIndex(
          (key) => key === formKey.patientPhone
        );

        if (phone_idx !== -1 && !isFilterSmsVerify) {
          _patientInfo.splice(phone_idx + 1, 0, formKey.verifyCode);
        }
      }
    }

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

            if (
              isGuardianWithIdCard &&
              cardInfo.age <= isGuardianWithIdCard * 1
            ) {
              lessThenSix = true;
            }
          }
        } else {
          // 01身份证 02居民户口簿 03护照 031中国籍普通护照 032外国籍护照 04军官证 05驾驶证 06港澳居民来往内地通行证 07台湾居民来往内地通行证 99其他法定有效证件

          // 不是身份证类型的证件号通过选择生日来判断要不要监护人
          // const birthday = formData.value[formKey.birthday] as string;
          // if (birthday) {
          //   lessThenSix = dayjs().diff(dayjs(birthday), 'year') <= 6;
          // }

          // 非身份证不需要民族
          const nationIdx = _patientInfo.findIndex((o) => o === formKey.nation);
          if (nationIdx > -1) {
            _patientInfo.splice(nationIdx, 1);
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
            ..._patientInfo,
          ]
        );

        break;

      case '0':
        listArr.push(
          ...[
            formKey.patientName,
            ..._sexAndBirth,
            ..._parentInfo,
            ..._patientInfo,
          ]
        );
        break;

      default:
        gStores.messageStore.showMessage('未知的就诊人类型');
        break;
    }

    const completeFormList = listArr.join(',');
    if (completeFormList === oldFormList.join(',')) {
      return;
    } else {
      oldFormList = [...listArr];
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
            message: '请确认证件号码是否有误',
          });
        } else {
          return Promise.resolve({
            success: true,
          });
        }
      };

      const patientNameItem = formList.find(
        (o) => o.key === formKey.patientName
      );

      if (patientNameItem) {
        if (await isOpenOcr()) {
          patientNameItem.ocr = true;
        }
      }
    }

    formList.map((o) => {
      const { key } = o;
      const iValue = formData.value[key];

      if ([formKey.patientName, formKey.patientPhone].includes(key as any)) {
        if (iValue && props[key]) {
          o.disabled = true;
        }
      }

      if (props.pageType === 'perfectReal') {
        // #ifdef MP-ALIPAY
        if (key === formKey.idCard) {
          o.disabled = true;
        }

        if (key === formKey.patientName) {
          o.disabled = true;
        }
        // #endif

        // if (key === formKey.patientPhone && globalGl.systemInfo.isSearchInHos) {
        //   if (globalGl.systemInfo.isSearchInHos) {
        //     o.disabled = true;
        //   }

        //   // #ifdef MP-ALIPAY
        //   o.disabled = true;
        //   // #endif
        // }
        if (key === formKey.patientPhone) {
          o.disabled = true;
        }
      } else {
        // #ifdef MP-ALIPAY
        // 支付宝第一个就诊人自动带入信息并加密(新增就诊人)
        if (!patList.length) {
          if (key === formKey.patientName) {
            o.disabled = true;
            o.inputMask = (v, item) => {
              return nameConvert(v);
            };
          }

          if (key === formKey.idCard) {
            o.disabled = true;

            o.inputMask = (v, item) => {
              if (v) {
                const idReg = /(\d{4})\d*(\d{4})/;
                return v.replace(idReg, '$1***********$2');
              } else {
                return '';
              }
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

          if (key === formKey.patientType) {
            o.disabled = true;
            o.showSuffixArrowIcon = false;
          }

          if (key === formKey.idType) {
            o.disabled = true;
            o.showSuffixArrowIcon = false;
          }
        }
        // #endif
      }

      if (value === '0' && key === formKey.birthday) {
        o.validator = async (v) => {
          const { ageChildren } = await ServerStaticData.getSystemConfig(
            'person'
          );

          const monthAgeAgo = dayjs()
            .subtract(ageChildren, 'month')
            .format('YYYY-MM-DD');
          if (
            monthAgeAgo !== v &&
            dayjs(v as string).isBefore(dayjs(monthAgeAgo))
          ) {
            return Promise.resolve({
              success: false,
              message: '新生儿年龄不能大于' + ageChildren + '个月',
            });
          }

          return {
            success: true,
          };
        };
      }

      if (key === formKey.patientType) {
        // 完善信息只支持 有证件的(使用默认值就好)
        if (
          (iValue && isHidePatientTypeInPerfect === '0') ||
          props.pageType === 'perfectReal'
        ) {
          o.disabled = true;
          o.showSuffixArrowIcon = false;
        }
      }

      if (key === formKey.nation) {
        const cardType = formData.value[formKey.idType];

        // 证件类型身份证 , 新生儿 时候必填,  其余可选
        o.required = cardType === '01' || value === '0' || false;
      }
    });

    gform.value.setList([]);
    nextTick(() => {
      gform.value.setList(formList);
    });
  };

  const btnDisabled = computed(() => {
    let isDisabled = false;
    const formKeys = formList.map((o) => o.key);

    if (_isPageFirst) {
      if (!isCheck.value) {
        return true;
      }
    }
    let count = 0;
    Object.entries(formData.value).map(([key, value]) => {
      if (formKeys.includes(key) && value === '') {
        isDisabled = true;
        count++;
      }
    });

    const patientType = formData.value[formKey.patientType];
    const idType = formData.value[formKey.idType];

    if (isDisabled) {
      // isDisabled = idType === '01' || nation === '0' || false;
      if ((idType !== '01' || patientType === '0') && count === 1) {
        isDisabled = false;
      }
    }

    return isDisabled;
  });

  const init = async () => {
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

    // 默认成人,儿童 有证件
    formData.value[formKey.patientType] =
      formData.value[formKey.patientType] || '-1';
    verifyCode = formData.value[formKey.verifyCode];

    const defaultValue = await getDefaultFormData(
      props.pageType || 'addPatient'
    );
    Object.assign(formData.value, defaultValue);

    //暂时注释 这个值是undifined
    // if ((props.patientType as string) === '-1') {
    // #ifdef MP-ALIPAY
    if (props.pageType === 'perfectReal') {
      formData.value[formKey.idCard] = gStores.userStore.cacheUser.certNo;
    }
    // #endif
    // }

    formData.value.nation = '01';
    nextTick(() => {
      medicalTypeChange(formData.value[formKey.patientType]);
    });
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
  .page {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .container {
    width: 100%;
    height: 1px;
    flex: 1;
    overflow-y: scroll;
  }

  .footer {
    background-color: var(--h-color-white);
    padding: 32rpx 32rpx 68rpx;
  }
</style>
