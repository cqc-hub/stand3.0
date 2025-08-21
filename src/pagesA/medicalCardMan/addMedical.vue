<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
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
      <!-- <view class="p24 pt32">
        <fgUserInfoAgree
          v-if="pageConfig.isUserInfoShareAgree === '1' && _isPageFirst"
          v-model:value="isUserInfoAgree"
        />
      </view> -->
      <g-flag typeFg="51" isShowFgTip />
    </view>

    <g-message />
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

    <g-pay
      :list="refPayList"
      @pay-click="selVerifyWay"
      ref="refPay"
      title="选择认证方式"
    >
      <view class="p32">
        <g-flag :typeFg="'xxxxx'" isShowFgTip isHideTitle aaa />
      </view>
    </g-pay>

    <view class="footer">
      <Fg-Agree
        v-if="isSignExist && !pageProps.patientName"
        :isCheck="isAgreeSign"
        :systemModeOld="gStores.globalStore.modeOld"
        @show-agree="regDialogConfirmSign.show"
        @update:isCheck="isAgreeSignChange"
        content="《免密代扣协议》"
        cusShowAgree
      />

      <view v-if="_isPageFirst" class="mb24">
        <Fg-Agree v-model:isCheck="isCheck" />
      </view>

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

      <!-- #ifdef MP-ALIPAY -->
      <canvas
        v-show="false"
        :width="imgCanvas.imgWidth"
        :height="imgCanvas.imgHeight"
        id="canvasForBase64"
        class="my-display-none"
      />
      <!-- #endif -->
    </view>
  </view>
  <Order-Reg-Confirm
    :headerIcon="`${$global.BASE_IMG}v3-order-reg-confirm${
      gStores.globalStore.isTcmStyle ? '-tcm' : ''
    }.png`"
    @confirm="resolve()"
    @cancel="reject()"
    :title="'人脸识别认证须知'"
    ref="faceDialog"
  >
    <g-flag title="人脸识别认证须知" :typeFg="'1250'" isShowFgTip isHideTitle aaa />
  </Order-Reg-Confirm>
</template>

<script lang="ts" setup>
  import { ref, nextTick, onMounted, computed, type Ref } from 'vue';
  import { onLoad, onReady, onShow } from '@dcloudio/uni-app';
  import { useCacheStore, useRouterStore } from '@/stores';
  import { deQueryForUrl, joinQueryForUrl } from '@/common/utils';

  import {
    pickTempItem,
    formKey,
    TFormKeys,
    getDefaultFormData,
    getHealthCardCode,
    formatterSubPatientData,
    loginAuthAlipay,
    useProgramPaySign,
    gotoChosseVerifyPage,
    getInfoFromIdCard,
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
    wait,
    ISystemConfig,
  } from '@/utils';

  import {
    reDealMedicalFiling,
    dealMedicalFiling,
  } from '@/pagesA/clinicPay/utils/clinicPayDetail';

  import api from '@/service/api';

  import dayjs from 'dayjs';
  import globalGl from '@/config/global';

  import FgAgree from './components/fgAgree.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import fgUserInfoAgree from './components/fgUserInfoAgree.vue';

  const routeStore = useRouterStore();
  const cacheStore = useCacheStore();
  const pageConfig = ref(<ISystemConfig['person']>{});
  const refPay = ref<any>('');
  const refPayList = ref<any[]>([]);
  const faceDialog: Ref<any> = ref('');
  const selVerifyWay = ({ item }) => {
    _resolve(item.key);
  };

  let _resolve: any = () => {
    // r
  };
  let _reject: any = () => {
    // j
  };

  const isCheck = ref(false);
  // const isUserInfoAgree = ref(false);

  const fg514 = ref({
    title: '',
    content: '',
  });

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

    //健康卡
    _healthType?: 'addPat';
    authCode?: string;
  }
  const pageProps = ref(<TPageType>{});
  const patientUtils = new PatientUtils();
  const gStores = new GStores();
  const patList = gStores.userStore.patList;
  const newPat = ref();
  const imgCanvas = ref({
    imgWidth: 0,
    imgHeight: 0,
  });

  const isShowHealthLogin = ref(false);
  const _isPageFirst = ref(!globalGl.systemInfo.isSearchInHos);

  const gform = ref<any>('');
  const formList = ref(
    pickTempItem([
      'patientType',
      'patientName',
      'patientPhone',
      'verifyCode',
      'defaultFalg',
    ])
  );
  const formData = ref<Partial<Record<TFormKeys, any>>>({});
  const addressChoose = {
    addressProvince: '',
    addressCity: '',
    addressCounty: '',
    addressCountyCode: '',
  };
  let verifyCode = '';

  const regDialogMedicalFiling: Ref<any> = ref('');
  const isMedicalFiling = ref(false);

  const {
    regDialogConfirmSign,
    isAgreeSignChange,
    flagTitle1203,
    disagreeSign,
    initSign,
    goPaySign,
    signAfterOnPageShow,
    isAgreeSign,
    isSignExist,
  } = useProgramPaySign();

  const isOpenOcr = async () => {
    let _isOpenOcr = false;
    const { ocr } = pageConfig.value;
    // #ifdef MP-WEIXIN
    _isOpenOcr = ocr === '1';
    // #endif

    // #ifdef MP-ALIPAY
    _isOpenOcr = !!globalGl.systemInfo.isOpenOcr;
    // #endif

    return _isOpenOcr;
  };

  const injectHealthCode = async (requestData) => {
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

    return requestData;
  };

  const editPhone = async (requestData) => {
    const {
      isCanChangeHosPhone,
      useFaceVerifyInChangePhone,
      isChangeHosPhoneWay,
    } = pageConfig.value;
    const { idCard, patientPhone, patientName, idType } = formData.value;
    if (idType === '01' && isCanChangeHosPhone === '1') {
      if (!requestData.pData) {
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
            const { tapIndex } = await apiAsync(
              // @ts-expect-error
              uni.showActionSheet,
              {
                title: '选择验证方式',
                alertText: '选择验证方式',
                itemList: chooseList.map((o) => o.label),
              }
            );

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
          // const { pdata: pData } = await useOcr(true, {
          //   aliThroughByEnd: true,
          //   imgCanvas,
          // });
          // pdata = pData;
          cacheStore.changeCacheData({
            ...requestData,
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

        requestData.pData = pdata;
      }
      await api.mofHosPhone({
        ...requestData,
        pdata: requestData.pData,
        source: gStores.globalStore.browser.source,
      });

      return await patientUtils.addRelevantPatient(requestData);
    }
  };

  let resolve: (...any) => any = () => {};
  let reject: (...any) => any = () => {};

  const formSubmit = async ({ data }) => {
    data = formatterSubPatientData(data);
    const formKeyNow = formList.value.map((o) => o.key);
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
      pData: '',
      pdata: '',
      verifyType: '1&bk',
      patientName: '',
      source,
      idType: '',
      realNameAuth: '',

      verifyCode,
      ...filterData,
      ...addressChoose,
    };

    // const { patList } = gStores.userStore;

    if (requestData.patientName) {
      requestData.patientName = requestData.patientName.trim();
      formData.value[formKey.patientName] = requestData.patientName.trim();
    }

    requestData.verifyType = requestData.verifyCode ? '2&kq' : '1&bk';

    await injectHealthCode(requestData);

    let {
      isFace,
      isCanChangeHosPhone,
      isFaceRemote,
      faceAgeRange = [17, 60],
      // isPayWithoutSecretAuth,
      // useFaceVerifyInChangePhone,
    } = pageConfig.value;
    const isIDCard = formData.value[formKey.idType] === '01';
    isFace === '1' &&
      (await new Promise((rl, rj) => {
        resolve = rl;
        reject = () => {
          console.log(888);
          gStores.messageStore.showMessage('取消人脸识别', 3000);
          rj();
        };
        faceDialog.value.show();
      }));
    if (
      isIDCard &&
      isFaceRemote === '1' &&
      isFace === '1' &&
      pageProps.value.pageType !== 'perfectReal'
    ) {
      const list = [
        {
          label: '人脸认证',
          key: 'isFace',
        },
        {
          label: '远程人脸认证',
          key: 'isFaceRemote',
        },
      ];

      // const { tapIndex } = await apiAsync(
      //   // @ts-expect-error
      //   uni.showActionSheet,
      //   {
      //     title: '选择认证方式',
      //     alertText: '选择认证方式',
      //     itemList: list.map((o) => o.label),
      //   }
      // );

      // const v = list[tapIndex].key;
      refPayList.value = list;
      const v = await new Promise((r) => {
        _resolve = r;
        refPay.value.show();
      });

      if (v === 'isFaceRemote') {
        isFace = undefined;
      } else {
        isFaceRemote = undefined;
      }
    }

    if (isFace === '1') {
      const [minAge, maxAge] = faceAgeRange || [];
      if (isIDCard) {
        const { sysCode } = gStores.globalStore;

        const { age } = idValidator.getIdCardInfo(
          formData.value[formKey.idCard]
        );

        let shouldProceed = false;

        if (!shouldProceed && minAge && age >= minAge) {
          shouldProceed = true;
        }

        if (!shouldProceed && maxAge && age < maxAge) {
          shouldProceed = true;
        }

        if (minAge && maxAge) {
          shouldProceed = age >= minAge && age <= maxAge;
        }

        // 新增判断 健康温州去除年龄判断
        if (sysCode === '1001082') {
          shouldProceed = true;
        }

        if (shouldProceed) {
          const { pData } = await patientUtils.faceVerifyAndPData({
            idCardNumber: formData.value[formKey.idCard],
            name: formData.value[formKey.patientName],
          });
          requestData.pData = pData;
          requestData.realNameAuth = '1';
        }
      }
    }

    if (pageProps.value.pageType === 'perfectReal') {
      try {
        await patientUtils
          .registerUser(requestData, {
            addPatInterface: 'relevantPatient',
          })
          .catch(async (err) => {
            if (err?.errorType === 'add') {
              const respCode = err?.err?.respCode;
              let isErrToast = true;
              if (respCode === 884801) {
                if (isCanChangeHosPhone === '1') {
                  const { confirm } = await apiAsync(uni.showModal, {
                    content: '患者存在建档记录但手机号不匹配，是否立即修改？',
                  });

                  if (confirm) {
                    isErrToast = false;
                    await editPhone(requestData);
                  }
                }
              }

              if (isErrToast) {
                const errMsg = err?.err?.message || '新增就诊人失败';
                await apiAsync(uni.showModal, {
                  content: errMsg + ' 系统将为您注册账号，但不进行绑定就诊人！',
                  showCancel: false,
                });
              }
            } else {
              throw new Error(err);
            }
          });

        // if (
        //   isPayWithoutSecretAuth === '1' &&
        //   gStores.userStore.patList.length
        // ) {
        //   uni.redirectTo({
        //     url: '/pagesA/medicalCardMan/sign',
        //   });
        //   return;
        // }

        // await patientUtils.getPatCardList();
        if (pageProps.value._directUrl) {
          routerJump(pageProps.value._directUrl as `/${string}`);
        } else {
          routerJump('/pagesA/medicalCardMan/medicalCardMan');
        }
      } catch (error) {
        if ((error as any)?.errorType === 'add') {
          uni.reLaunch({
            url: '/pagesA/medicalCardMan/medicalCardMan',
          });
        } else {
          throw new Error(error as any);
        }
      }
    } else {
      if (
        requestData.wechatCode &&
        pageProps.value?._healthType == 'addPat' &&
        pageProps.value?.authCode &&
        requestData?.idType == '01'
      ) {
        gotoChosseVerifyPage(requestData, pageProps.value.authCode);
        return;
      }

      if (isFaceRemote === '1' && isIDCard) {
        const sign = await patientUtils.addCachePatient(requestData);
        const { patientName, idCard } = formData.value;

        uni.navigateTo({
          url: joinQueryForUrl('/pagesD/service/addPatByScan', {
            sign,
            name: patientName,
            idCard,
            isSelf: '1',
          }),
        });
        return;
      }

      const patientId = await patientUtils
        .addRelevantPatient(requestData)
        .catch(async (e) => {
          const { respCode, message } = e;
          const { idCard, patientPhone, patientName, idType } = formData.value;

          if (
            respCode === 884801 &&
            idType === '01' &&
            isCanChangeHosPhone === '1'
          ) {
            gStores.messageStore.closeMessage();

            const { confirm } = await apiAsync(uni.showModal, {
              content: '患者存在建档记录但手机号不匹配，是否立即修改？',
            });
            // 修改手机号必开启人脸|ocr之一 ocr走后端收费改为前端ocr
            if (confirm) {
              await injectHealthCode(requestData);
              return await editPhone(requestData);
            }
          }

          throw new Error(message);
        });
      newPat.value = { patientId: patientId };

      await goPaySign(patientId);
      await patientUtils.getPatCardList();
      // if (isPayWithoutSecretAuth === '1' && gStores.userStore.patList.length) {
      //   uni.redirectTo({
      //     url: '/pagesA/medicalCardMan/sign',
      //   });
      //   return;
      // }
      newPat.value = gStores.userStore.patList.find(
        (pat) => pat.patientId === newPat.value.patientId
      );
      if (isMedicalFiling.value && newPat.value.healthCardUser !== '2') {
        regDialogMedicalFiling.value.show();
        return;
      }
      if (pageProps.value._directUrl) {
        routerJump(pageProps.value._directUrl as `/${string}`);
      } else {
        routerJump('/pagesA/medicalCardMan/medicalCardMan');
      }
    }
  };

  const formChange = async ({ item, value, oldValue }) => {
    if (item.key === formKey.patientType && oldValue !== value) {
      await wait(0);

      medicalTypeChange(value);
    }
  };

  const selectChange = async (e) => {
    const { item, value } = e;

    switch (item.key) {
      case formKey.patientType:
        if (value === '0') {
          formData.value[formKey.idType] = '';
        } else if (value === '-1') {
          formData.value[formKey.idType] = '01';
        }
        break;
      case formKey.idType:
        formData.value[formKey.idCard] = '';

        if (['06', '07'].includes(value)) {
          if (!fg514.value.title) {
            const { title, content } = await gStores.getSysAppMore('514');
            fg514.value = {
              title,
              content,
            };
          }

          if (fg514.value.title) {
            gStores.messageStore.showMessage(fg514.value.content, 0, {
              useDialog: true,
              dialogOpt: {
                title: fg514.value.title,
                isShowCancel: false,
              },
            });
          }
        }

        await wait(0);
        medicalTypeChange(formData.value[formKey.patientType]);

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

  const formInputBlur = (e) => {
    const { item } = e;

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
    const {
      isGuardianWithIdCard,
      isHidePatientTypeInPerfect,
      isSmsVerify,
      isDropAddress,
      isDropNation,
      isUserInfoShareAgree,
      formExtraKeys = [],
    } = pageConfig.value;

    const addressArr: any[] = [];
    const endArr: any[] = [];

    if (formExtraKeys.length) {
      if (formExtraKeys.includes('countries')) {
        addressArr.push('countries');
      }

      if (formExtraKeys.includes('referenceId')) {
        endArr.push('referenceId');
      }
    }

    if (isDropAddress !== '1') {
      addressArr.push(formKey.address, formKey.location);
    }

    const listArr: TFormKeys[] = [formKey.patientType];
    const _sexAndBirth = [formKey.sex, formKey.birthday];
    const _parentInfo = [formKey.upName, formKey.upIdCard];
    const _patientInfo: TFormKeys[] = [
      ...addressArr,
      formKey.patientPhone,
      // ...formExtraKeys,
      ...endArr,

      formKey.defaultFalg,
      // formKey.referenceId,
    ];

    // 判断是否需要民族
    if (isDropNation !== '1') {
      _patientInfo.unshift(formKey.nation);
    }

    if (!globalGl.systemInfo.isSearchInHos) {
      // 插入验证码(框)
      if (isSmsVerify === '1' && pageProps.value.pageType !== 'perfectReal') {
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

    if (_isPageFirst.value && isUserInfoShareAgree === '1') {
      listArr.splice(listArr.length - 1, 0, 'isUserInfoShareAgree');
    }

    const completeFormList = listArr.join(',');
    if (completeFormList === oldFormList.join(',')) {
      return;
    } else {
      oldFormList = [...listArr];
    }

    formList.value = pickTempItem(listArr);

    const idCardItem = formList.value.find((o) => o.key === formKey.idCard);
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

      const patientNameItem = formList.value.find(
        (o) => o.key === formKey.patientName
      );

      if (patientNameItem) {
        if (await isOpenOcr()) {
          patientNameItem.ocr = true;
        }
      }
    }

    formList.value.map((o) => {
      const { key } = o;
      const iValue = formData.value[key];

      if ([formKey.patientName, formKey.patientPhone].includes(key as any)) {
        if (iValue && pageProps.value[key]) {
          o.disabled = true;
        }
      }

      if (pageProps.value.pageType === 'perfectReal') {
        // #ifdef MP-ALIPAY
        if (key === formKey.idCard) {
          o.disabled = true;
        }

        if (key === formKey.patientName) {
          o.disabled = true;
        }
        // #endif

        // #ifndef H5
        if (key === formKey.patientPhone) {
          o.disabled = true;
        }
        // #endif
      } else {
        // #ifdef MP-ALIPAY
        // 支付宝第一个就诊人自动带入信息并加密(新增就诊人)
        if (!patList.length && iValue) {
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
          const { ageChildren } = pageConfig.value;

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
          pageProps.value.pageType === 'perfectReal'
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
    await wait(0);
    gform.value.setList(formList.value);
  };

  const btnDisabled = computed(() => {
    let isDisabled = false;
    const formKeys = formList.value.filter((o) => o.required).map((o) => o.key);

    if (_isPageFirst.value) {
      if (!isCheck.value) {
        return true;
      }

      if (
        pageConfig.value.isUserInfoShareAgree === '1' &&
        !formData.value.isUserInfoShareAgree
      ) {
        return true;
      }
    }

    if (
      isSignExist.value &&
      !pageProps.value.patientName &&
      !isAgreeSign.value
    ) {
      return true;
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

  const medicalFillCancel = async () => {
    await goPaySign(newPat.value.patientId);
    await patientUtils.getPatCardList();
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
      await goPaySign(newPat.value.patientId);
      await patientUtils.getPatCardList();
      if (pageProps.value._directUrl) {
        routerJump(pageProps.value._directUrl as `/${string}`);
      } else {
        routerJump('/pagesA/medicalCardMan/medicalCardMan');
      }
    }
  };

  const init = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('person');
    formData.value = Object.fromEntries(
      Object.entries(pageProps.value).map(([key, value]) => {
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
      pageProps.value.pageType || 'addPatient'
    );
    Object.assign(formData.value, defaultValue);

    //暂时注释 这个值是undifined
    // if ((props.patientType as string) === '-1') {
    // #ifdef MP-ALIPAY
    if (pageProps.value.pageType === 'perfectReal') {
      formData.value[formKey.idCard] = gStores.userStore.cacheUser.certNo;
    }
    // #endif
    // }

    formData.value.nation = '01';
    await wait(0);
    medicalTypeChange(formData.value[formKey.patientType]);

    //是否医保建档
    const medicalMHelp = globalGl.sConfig.medicalMHelp!;
    // #ifdef  MP-WEIXIN
    //先实现支付宝
    // #endif
    // #ifdef MP-ALIPAY
    isMedicalFiling.value = medicalMHelp?.alipay?.medicalFiling === '1';
    // #endif
  };

  onReady(() => {
    if (pageProps.value.pageType === 'perfectReal') {
      uni.setNavigationBarTitle({
        title: '完善账号实名信息',
      });
    }
  });

  onShow(() => {
    signAfterOnPageShow();
    reDealMedicalFiling();
  });

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
  });

  onMounted(async () => {
    routeStore.receiveQuery(pageProps.value);
    await init();
    // #ifdef MP-ALIPAY
    if (
      globalGl.sConfig.login?.isAliAuthBase === '1' &&
      pageProps.value.pageType === 'perfectReal'
    ) {
      await loginAuthAlipay(init);
    }
    // #endif

    await wait(20);
    // 无带入信息, 说明不是从 pagesA/medicalCardMan/perfectReal 这里过来的
    if (!pageProps.value.patientName) {
      initSign();
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
