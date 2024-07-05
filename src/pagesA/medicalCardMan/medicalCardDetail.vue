<template>
  <view
    :class="{
      'system-mode-old': gStore.globalStore.modeOld,
    }"
  >
    <g-form
      v-model:value="formData"
      @change="formChange"
      @disabled-click="rowClick"
      bodyBold
      ref="gform"
    />

    <view class="container" v-if="formData && formData.patientName">
      <view
        class="grid1fr g-border-bottom item-for-show form-item-bold form-item-disabled form-item-filled form-item-input-text form-item"
      >
        <view class="label text-no-wrap">
          <view>档案类型</view>
        </view>
        <view class="container-body">
          <view class="content-show">
            <view>
              <text>
                {{
                  gStore.userStore.clickPat.healthCardUser === '2'
                    ? '医保'
                    : '自费'
                }}
              </text>
              <text
                v-if="
                  gStore.userStore.clickPat.healthCardUser !== '2' &&
                  isMedicalFiling
                "
                class="goMedicalFiling"
                @click="goMedicalFiling(gStore.userStore.clickPat)"
              >
                医保建档
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <g-message />

    <view @click="isShow = true" class="btn del-btn btn-primary">
      <view class="del-btn-label">删除就诊人</view>
    </view>
    <Order-Reg-Confirm
      :headerIcon="$global.BASE_IMG + 'v3-order-reg-confirm-add.png'"
      v-if="isMedicalFiling"
      title="是否更新为医保用户？"
      :maskClickClose="false"
      @confirm="medicalFiling"
      height="35vh"
      confirmText="确定"
      cannerText="取消"
      ref="regDialogMedicalFiling"
    >
      仅账号本人可更新为医保用户，是否更新为医保用户？
    </Order-Reg-Confirm>
    <xy-dialog
      title=""
      content="是否删除该就诊人"
      :show="isShow"
      @cancelButton="isShow = false"
      @confirmButton="deletePat"
    />
  </view>
</template>

<script lang="ts" setup>
  import { nextTick, ref, onMounted, Ref } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import {
    patCardDetailTempList,
    PatCardKeys,
    patCardDetailFormKey,
  } from './utils';
  import {
    GStores,
    PatientUtils,
    ServerStaticData,
    type ISystemConfig,
  } from '@/utils';
  import globalGl from '@/config/global';
  import {
    dealMedicalFiling,
    reDealMedicalFiling,
  } from '@/pagesA/clinicPay/utils/clinicPayDetail';
  import xyDialog from '@/components/xy-dialog/xy-dialog.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';

  type PagePropType = Record<PatCardKeys, any>;
  const isShow = ref(false);
  const gStore = new GStores();
  const pat = gStore.userStore.clickPat;

  const patientUtils = new PatientUtils();
  const formData = ref<PagePropType>({} as PagePropType);
  const gform = ref<any>('');
  const pageConfig = ref(<ISystemConfig['person']>{});
  const regDialogMedicalFiling: Ref<any> = ref('');
  const medicalFilingPat: Ref<any> = ref('');
  const isMedicalFiling = ref(false);
  let formList = [...patCardDetailTempList];

  const changeDefault = (value: boolean) => {
    const pat = gStore.userStore.clickPat;

    patientUtils.changeDefault({
      defaultFalg: value,
      patientId: pat.patientId,
    });
  };

  const deletePat = async () => {
    isShow.value = false;
    await patientUtils.deletePat({
      patientId: gStore.userStore.clickPat.patientId,
    });

    uni.reLaunch({
      url: '/pagesA/medicalCardMan/medicalCardMan',
    });
  };

  const formChange = (e) => {
    const { item, value } = e;
    if (item.key === patCardDetailFormKey.defaultFlag) {
      changeDefault(value);
    }
  };

  const rowClick = (item) => {
    const { key } = item;
    const { isEditPatPhone } = pageConfig.value;

    if (
      key === 'patientPhone' &&
      isEditPatPhone === '1' &&
      pat.idType === '01'
    ) {
      uni.navigateTo({
        url: '/pagesA/medicalCardMan/editPhone',
      });
    }
  };
  const goMedicalFiling = (pat) => {
    medicalFilingPat.value = pat;
    regDialogMedicalFiling.value.show();
  };
  //医保更新用户信息,医保建档
  const medicalFiling = async () => {
    const flag = await dealMedicalFiling(medicalFilingPat.value.patientId);
    if (flag) {
      patientUtils.getPatCardList();
    }
  };
  onShow(() => {
    reDealMedicalFiling();
  });
  onMounted(async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('person');
    console.log(pat, 'sss');

    formData.value = {
      ...pat,
      defaultFlag: pat.defaultFlag === '0' ? false : true,
    };

    // 非新生儿无证件的 不显示监护人信息 顾说去掉
    // if (pat.patientType !== '0') {
    //判断无监护人信息
    if (pat.upIdCard === '') {
      formList = formList.filter(
        (o) =>
          !(
            [
              patCardDetailFormKey.upIdCard,
              patCardDetailFormKey.upName,
            ] as string[]
          ).includes(o.key)
      );
    }

    const { isEditPatPhone } = pageConfig.value;
    if (isEditPatPhone === '1') {
      formList.map((o) => {
        const { key } = o;
        // 仅支持身份证类型修改
        if (key === 'patientPhone' && pat.idType === '01') {
          o.showSuffixArrowIcon = true;
        }
      });
    }

    Object.keys(formData.value).map((key) => {
      if (formData.value[key] === '') {
        formData.value[key] = '无';
      }
    });

    nextTick(() => {
      gform.value.setList(formList);
    });
    //是否医保建档
    const medicalMHelp = globalGl.sConfig.medicalMHelp!;
    // #ifdef  MP-WEIXIN
    //先实现支付宝
    // #endif
    // #ifdef MP-ALIPAY
    isMedicalFiling.value = medicalMHelp.alipay?.medicalFiling === '1';
    // #endif
  });
</script>

<style lang="scss" scoped>
  @import '../../components/g-form/css/index.scss';
  .del-btn {
    color: var(--hr-error-color-6);
    font-weight: 600;

    background-color: var(--h-color-white);
    display: flex;
    justify-content: center;
    margin-top: 16rpx;
    padding: 23rpx 0;
    border-bottom: 1rpx solid var(--hr-neutral-color-2);
    border-radius: 0;
  }
  .grid1fr {
    grid-template-columns: 190rpx 1fr;
  }
  .goMedicalFiling {
    color: #296fff;
    margin-left: 20rpx;
  }
</style>
