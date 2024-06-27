<template>
  <view
    :class="{
      'system-mode-old': gStore.globalStore.modeOld,
    }"
    class="g-page"
  >
    <view class="container" scroll-y>
      <view class="form-container">
        <g-form
          v-model:value="formData"
          @submit="formSubmit"
          bodyBold
          ref="gform"
        />
      </view>
    </view>
    <g-message />

    <view class="footer">
      <button @click="gform.submit" class="btn btn-primary">保存</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref, nextTick } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import {
    GStores,
    PatientUtils,
    ServerStaticData,
    apiAsync,
    type ISystemConfig,
  } from '@/utils';
  import { TInstance } from '@/components/g-form';
  import api from '@/service/api';

  const gStore = new GStores();
  const patientUtils = new PatientUtils();
  const formData = ref<BaseObject>({});
  const gform = ref<any>('');

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

  const formSubmit = async ({ data }) => {
    const { phone, verifyCode, patientId } = data;
    const { source } = gStore.globalStore.browser;

    const { pData } = await patientUtils.faceVerifyAndPDataForPat(
      gStore.userStore.clickPat
    );

    await api.mdifPhone({
      patientPhone: phone,
      verifyCode,
      patientId,
      source,
      pdata: pData
    });

    await patientUtils.getPatCardList();
    const editPat = gStore.userStore.patList.find(
      (p) => p.patientId === patientId
    )!;
    gStore.userStore.updatePatClick(editPat);

    await apiAsync(uni.showModal, {
      content: '修改成功',
      showCancel: false,
    });

    uni.reLaunch({
      url: '/pagesA/medicalCardMan/medicalCardDetail',
    });
  };

  onMounted(async () => {
    const pat = gStore.userStore.clickPat;

    formData.value = {
      ...pat,
    };

    nextTick(() => {
      gform.value.setList(formList.value);
    });
  });
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    flex: 1;
    overflow-y: scroll;
  }

  .footer {
    background-color: var(--h-color-white);
    padding: 32rpx 32rpx 68rpx;
  }
</style>
