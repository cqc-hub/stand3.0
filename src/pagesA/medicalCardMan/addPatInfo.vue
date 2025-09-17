<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="page"
  >
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
  import { onMounted, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import {
    GStores,
    idValidator,
    PatientUtils,
    routerJump,
    ServerStaticData,
  } from '@/utils';
  import api from '@/service/api';

  const gStores = new GStores();
  const gform = ref<any>('');
  const formData = ref({
    patientName: '',
    upName: '',
    upIdCard: '',
    upPhone: '',
    relationShip: '',
  });
  const patientUtils = new PatientUtils();

  const formSubmit = async ({}) => {
    const { cardNumber, patientId } = gStores.userStore.patChoose;
    const { upName, upIdCard, upPhone, relationShip } = formData.value;

    const { pData } = await patientUtils.faceVerifyAndPData({
      idCardNumber: upIdCard,
      name: upName,
    });

    const args = {
      ...formData.value,
      cardNumber,
      patientId,
      // "01身份证 03护照等",
      upIdType: '01',
      upName,
      upIdCard,
      upPhone,
      relationShip,
      pData,
    };

    await api.updateGuardianInfo(args);

    gStores.messageStore.showMessage('更新成功', 1500, {
      closeCallBack() {
        routerJump('/pagesA/medicalCardMan/medicalCardMan');
      },
    });
  };

  onLoad(async () => {
    const { patientName } = gStores.userStore.patChoose;

    Object.assign(formData.value, {
      patientName,
    })
  });

  onMounted(() => {
    gform.value.setList([
      {
        required: true,
        label: '患者姓名',
        field: 'input-text',
        placeholder: '请输入',
        key: 'patientName',
        labelWidth: '220rpx',
        maxlength: 50,
        disabled: true,
      },

      {
        disabled: true,
        label: '证件类型',
        placeholder: '请选择',
        key: 'idType',
        field: 'select',
        options: [],
        autoOptions: 'idTypeTerms',
        labelWidth: '220rpx',
      },

      {
        required: true,
        showSuffixArrowIcon: true,
        label: '关系',
        placeholder: '请选择',
        key: 'relationShip',
        field: 'select',
        options: [],
        autoOptions: 'RelationShipList',
        labelWidth: '220rpx',
      },

      {
        required: true,
        label: '监护人姓名',
        field: 'input-text',
        placeholder: '请输入',
        key: 'upName',
        labelWidth: '220rpx',
        maxlength: 50,
      },

      {
        required: true,
        label: '监护人证件号',
        field: 'input-text',
        placeholder: '请输入',
        key: 'upIdCard',
        validator: async (v: unknown, item: any) => {
          if (typeof v === 'string' && v && idValidator.checkIdCardNo(v)) {
            const { ageGuardian } = await ServerStaticData.getSystemConfig(
              'person'
            );

            const info = idValidator.getIdCardInfo(v);

            if (info.age < ageGuardian) {
              return Promise.resolve({
                success: false,
                message: `监护人年龄必须大于: ${ageGuardian}岁`,
              });
            }

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

      {
        required: true,
        label: '监护人手机号',
        field: 'input-text',
        placeholder: '请输入',
        maxlength: 11,
        key: 'upPhone',
        rule: [
          {
            message: '请确认手机号是否有误',
            rule: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
          },
        ],
        labelWidth: '220rpx',
      },
    ]);
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
