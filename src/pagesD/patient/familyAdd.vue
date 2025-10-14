<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="page"
  >
    <!-- <g-flag isShowFg typeFg="1266" /> -->

    <view class="container" scroll-y>
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        bodyBold
        ref="gform"
      />

      <!-- <view class="p24 pt32">
        <fgUserInfoAgree
          v-if="pageConfig.isUserInfoShareAgree === '1'"
          v-model:value="formData.isUserInfoShareAgree"
        />
      </view> -->
    </view>
    <g-message />

    <view class="footer">
      <button @click="gform.submit" class="btn btn-primary">保存</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import {
    GStores,
    idValidator,
    ISystemConfig,
    PatientUtils,
    routerJump,
  } from '@/utils';
  import api from '@/service/api';
  import { deQueryForUrl } from '@/common';

  const gStores = new GStores();
  const gform = ref<any>('');
  const pageProps = ref({
    name: '',
    idCard: '',
  });
  const formData = ref({
    name: '',
    idCard: '',
  });
  const patientUtils = new PatientUtils();

  const formSubmit = async ({}) => {
    const { cardNumber, patientId } = gStores.userStore.patChoose;
    const { idCard, name } = formData.value;

    const { pData } = await patientUtils.faceVerifyAndPData({
      idCardNumber: idCard,
      name,
    });

    const args: any = {
      cardNumber,
      patientId,
      pdata: pData,
      contactIdCard: idCard,
      contactName: name,
      contactIdType: '01',
    };

    await api.updateFamilyInfo(args);

    gStores.messageStore.showMessage('更新成功', 1500, {
      async closeCallBack() {
        uni.navigateBack({
          delta: 1,
        });
      },
    });
  };

  const initForm = async () => {
    let rList = [
      {
        required: true,
        label: '姓名',
        field: 'input-text',
        placeholder: '请输入',
        key: 'name',
        labelWidth: '220rpx',
        maxlength: 50,
      },

      {
        required: true,
        label: '证件号码',
        field: 'input-text',
        placeholder: '请输入身份证号码',
        key: 'idCard',
        validator: async (v: unknown) => {
          if (typeof v === 'string' && v && idValidator.checkIdCardNo(v)) {
            return Promise.resolve({
              success: true,
            });
          }

          return Promise.resolve({
            success: false,
            message: '请确认证件号码是否有误',
          });
        },
        labelWidth: '220rpx',
      },
      // {
      //   required: true,
      //   showSuffixArrowIcon: true,
      //   label: '关系',
      //   placeholder: '请选择',
      //   key: 'relationship',
      //   field: 'select',
      //   options: [],
      //   autoOptions: 'RelationShipList',
      //   labelWidth: '220rpx',
      // },
    ];

    gform.value.setList(rList);
  };

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));

    const { name, idCard } = pageProps.value;

    Object.assign(formData.value, {
      name,
      idCard,
    });
  });

  onMounted(async () => {
    initForm();
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
