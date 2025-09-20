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
  import { computed, onMounted, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import {
    GStores,
    idValidator,
    ISystemConfig,
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
    idCard: '',
    upPhone: '',
    relationShip: '',
  });
  const patientUtils = new PatientUtils();
  const pageConfig = ref(<ISystemConfig['person']>{});
  const isChildren = computed(() => {
    let _c = false;

    const { patientName, patientAge } = gStores.userStore.patChoose;
    const { isGuardianWithIdCard } = pageConfig.value;

    if (isGuardianWithIdCard) {
      _c = (patientAge as unknown as number) * 1 <= isGuardianWithIdCard * 1;
    }

    return _c;
  });

  const formSubmit = async ({}) => {
    const {
      cardNumber,
      patientId,
      upIdCard: oldUpIdCard,
      patientName,
      idCard: oldIdCard,
    } = gStores.userStore.patChoose;
    const { upIdCard, relationShip, idCard, upName } = formData.value;

    let [name, idCardNumber] = ['', ''];
    const pInfo = await patientUtils.getPatientPersonalInfo({
      idCard: true,
    });
    // 儿童人脸取监护人
    if (isChildren.value) {
      name = upName;
      if (oldUpIdCard) {
        idCardNumber = pInfo.upIdCard;
      } else {
        idCardNumber = upIdCard;
      }
    } else {
      name = patientName;
      if (oldIdCard) {
        idCardNumber = pInfo.idCard;
      } else {
        idCardNumber = idCard;
      }
    }

    const { pData } = await patientUtils.faceVerifyAndPData({
      idCardNumber,
      name,
    });

    const args: any = {
      cardNumber,
      patientId,
      pdata: pData,
      relationShip,
      checkIdCard: idCardNumber,
    };

    if (isChildren.value && !oldUpIdCard) {
      args.upIdType = '01';
      args.upName = upName;
      args.upIdCard = upIdCard;
    }

    if (!oldIdCard) {
      args.idCard = idCard;
      args.patientName = patientName;
    }

    // if (condition) {

    // }

    await api.updateUserInfo(args);

    gStores.messageStore.showMessage('更新成功', 1500, {
      async closeCallBack() {
        await patientUtils.getPatCardList();
        routerJump('/pagesA/medicalCardMan/medicalCardMan');
      },
    });
  };

  onLoad(async () => {});

  onMounted(async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('person');
    const {
      patientName,
      idCard = '',
      upName = '',
      upIdCard = '',
    } = gStores.userStore.patChoose;

    Object.assign(formData.value, {
      patientName,
      idCard,
      upName,
      upIdCard,
      idType: '01',
    });

    let rList = [
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
        label: '证件号码',
        field: 'input-text',
        placeholder: '请输入',
        key: 'idCard',
        validator: async (v: unknown, item: any) => {
          if (item.disabled) {
            return {
              success: true,
            };
          }

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
          if (item.disabled) {
            return {
              success: true,
            };
          }

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

      // {
      //   required: true,
      //   label: '监护人手机号',
      //   field: 'input-text',
      //   placeholder: '请输入',
      //   maxlength: 11,
      //   key: 'upPhone',
      //   rule: [
      //     {
      //       message: '请确认手机号是否有误',
      //       rule: rulePhone,
      //     },
      //   ],
      //   labelWidth: '220rpx',
      // },
    ];

    const changeDisableStatus = (k: string, status = true) => {
      const item = rList.find((o) => o.key === k);

      if (item) {
        item.disabled = status;
      }
    };

    if (isChildren.value) {
      // changeDisableStatus('idCard', false);
    } else {
      rList = rList.filter((o) => !['upIdCard', 'upName'].includes(o.key));
    }

    idCard && changeDisableStatus('idCard');
    upName && changeDisableStatus('upName');
    upIdCard && changeDisableStatus('upIdCard');

    gform.value.setList(rList);
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
