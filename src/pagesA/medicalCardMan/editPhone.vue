<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <g-flag isShowFg typeFg="1205" />

    <view class="container" scroll-y>
      <view class="form-container">
        <view
          v-if="isUseOcrVerify"
          class="sfz-container m32 p24 justify-center flex flex-col g-border"
        >
          <image
            :src="idCardUrl || $global.BASE_IMG + 'img_sfz_zhengmian@3x.png'"
            @click="chooseIdCard"
            class="sfz-img"
          />

          <view
            v-if="!idCardUrl"
            class="justify-center flex pt24 color-blue font-semibold"
          >
            身份证正面图片
          </view>
        </view>

        <g-form
          v-model:value="formData"
          @submit="formSubmit"
          bodyBold
          ref="gform"
        />
      </view>
    </view>

    <!-- #ifdef MP-ALIPAY -->
    <canvas
      v-show="false"
      :width="imgCanvas.imgWidth"
      :height="imgCanvas.imgHeight"
      id="canvasForBase64"
      class="my-display-none"
    />
    <!-- #endif -->

    <view class="footer">
      <button @click="gform.submit" class="btn btn-primary">保存</button>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref, nextTick, computed } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import {
    GStores,
    PatientUtils,
    ServerStaticData,
    apiAsync,
    base64Src,
    useOcr,
    type ISystemConfig,
  } from '@/utils';
  import { TInstance } from '@/components/g-form';
  import api from '@/service/api';

  const gStores = new GStores();
  const pageConfig = ref(<ISystemConfig['person']>{});
  const patientUtils = new PatientUtils();
  const formData = ref<BaseObject>({});
  const gform = ref<any>('');
  const idCardUrl = ref('');
  const isComplete = ref(false);
  const pData = ref('');
  const imgCanvas = ref({
    imgWidth: 0,
    imgHeight: 0,
  });
  const isUseFaceVerify = computed(() => {
    return pageConfig.value.useFaceVerifyInChangePhone === '1';
  });

  // 校验必有 ocr | face 之一
  const isUseOcrVerify = computed(() => {
    return !isUseFaceVerify.value;
  });

  const formList = ref<TInstance[]>([
    {
      label: '原手机号',
      key: 'patientPhone',
      field: 'input-text',
      disabled: true,
    },
    {
      label: '新手机号',
      required: true,
      key: 'phone',
      field: 'input-text',
      maxlength: 11,
      rule: [
        {
          message: '请确认手机号是否有误',
          rule: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
        },
      ],
      placeholder: '请输入新的手机号',
    },
    {
      required: true,
      maxlength: 6,
      label: '验证码',
      field: 'input-verify',
      key: 'verifyCode',
      verifyBtnText: '获取验证码',
      inputType: 'number',
      verifySecond: 60,
      rule: {
        message: '验证码必须是数字',
        rule: /\d+/,
      },
      phoneKey: 'phone',
      placeholder: '请输入验证码',
    },
  ]);

  const chooseIdCard = async () => {
    const res = await useOcr(true, {
      aliThroughByEnd: gStores.globalStore.sysCode !== '1001054',
      imgCanvas,
    }).catch(({ errMsg }) => {
      if (errMsg && !errMsg.includes('用户取消操作')) {
        gStores.messageStore.showMessage(errMsg, 3000);
      }
      throw new Error(errMsg);
    });
    const { image, pdata, idCard, name } = res;
    formData.value._idCard = idCard;
    formData.value._patientName = name;

    let iswx = false;
    // #ifdef MP-WEIXIN
    iswx = true;
    // #endif
    if (image) {
      if (iswx) {
        idCardUrl.value = await base64Src(image);
      } else {
        idCardUrl.value = `data:image/jpeg;base64,${image}`;
      }
      isComplete.value = true;
      pData.value = pdata;
    }
  };

  const formSubmit = async ({ data }) => {
    const { phone, verifyCode, patientId } = data;
    const { source } = gStores.globalStore.browser;
    let _pData = '';

    if (isUseFaceVerify.value) {
      const { pData, idCard } = await patientUtils.faceVerifyAndPDataForPat(
        gStores.userStore.clickPat
      );

      _pData = pData;
      formData.value._idCard = idCard;
    } else {
      _pData = pData.value;

      if (!_pData) {
        const { confirm } = await apiAsync(uni.showModal, {
          content: '请上传身份证正面照片获取姓名',
          confirmText: '去上传',
        });

        if (confirm) {
          await chooseIdCard();
        } else {
          throw new Error('未验证ocr');
        }
      }
    }

    await api.mdifPhone({
      patientPhone: phone,
      verifyCode,
      patientId,
      source,
      pdata: _pData,
    });

    await patientUtils.getPatCardList();
    const editPat = gStores.userStore.patList.find(
      (p) => p.patientId === patientId
    )!;
    gStores.userStore.updatePatClick(editPat);

    await apiAsync(uni.showModal, {
      content: '修改成功',
      showCancel: false,
    });

    uni.reLaunch({
      url: '/pagesA/medicalCardMan/medicalCardDetail',
    });
  };

  onMounted(async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('person');
    const pat = gStores.userStore.clickPat;

    formData.value = {
      ...pat,
      _cardTypeName: '居民身份证',
    };

    if (isUseOcrVerify.value) {
      formList.value.unshift(
        // @ts-expect-error
        ...[
          {
            label: '真实姓名',
            key: '_patientName',
            field: 'input-text',
            disabled: true,
            placeholder: '请上传身份证正面图片',
          },
          {
            label: '证件类型',
            key: '_cardTypeName',
            placeholder: '请选择',
            field: 'input-text',
            disabled: true,
          },
          {
            label: '证件号码',
            key: '_idCard',
            field: 'input-text',
            disabled: true,
            placeholder: '请上传身份证正面图片',
          },
        ]
      );
    }

    nextTick(() => {
      gform.value.setList(formList.value);
    });
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: #fff;
  }

  .container {
    width: 100%;
    flex: 1;
    overflow-y: scroll;
  }

  .footer {
    background-color: var(--h-color-white);
    padding: 32rpx 32rpx 68rpx;
  }

  .sfz-img {
    width: 100%;
    // height: 100%;
    height: 210px;
  }

  .sfz-container {
    border-radius: 8px;
  }
</style>
