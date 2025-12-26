<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
  >
    <g-form
      v-model:value="formData"
      @change="formChange"
      @disabled-click="rowClick"
      bodyBold
      ref="gform"
    >
      <template #suffix="{ item }">
        <view v-if="item.key === 'healthCardUserLabel'">
          <text
            v-if="
              gStores.userStore.clickPat.healthCardUser !== '2' &&
              isMedicalFiling
            "
            class="goMedicalFiling text-no-wrap"
            @click="goMedicalFiling(gStores.userStore.clickPat)"
          >
            医保建档
          </text>
        </view>
      </template>

      <template #showbody="{ value }">
        <text>{{ value }}</text>
      </template>
    </g-form>

    <g-message />

    <view
      v-if="
        pageConfig.isSearchPatBound === '1' &&
        gStores.userStore.clickPat.realNameAuth === '1'
      "
      @click="goPatBound(gStores.userStore.clickPat)"
      class="btn del-btn btn-primary color-blue"
    >
      <view class="del-btn-label">绑定查询</view>
    </view>

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
  import { ref, onMounted, Ref } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import {
    patCardDetailTempList,
    PatCardKeys,
    patCardDetailFormKey,
    goEditPhone,
    goPatBound,
  } from './utils';
  import {
    apiAsync,
    GStores,
    PatientUtils,
    ServerStaticData,
    wait,
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
  const gStores = new GStores();
  const pat = gStores.userStore.clickPat;

  const patientUtils = new PatientUtils();
  const formData = ref({} as PagePropType);
  const gform = ref<any>('');
  const pageConfig = ref(<ISystemConfig['person']>{});
  const regDialogMedicalFiling: Ref<any> = ref('');
  const medicalFilingPat: Ref<any> = ref('');
  const isMedicalFiling = ref(false);
  let formList = [...patCardDetailTempList];

  const changeDefault = (value: boolean) => {
    const pat = gStores.userStore.clickPat;

    patientUtils.changeDefault({
      defaultFalg: value,
      patientId: pat.patientId,
    });
  };

  const deletePat = async () => {
    isShow.value = false;
    const { isNotDeleteSelf } = pageConfig.value;
    if (isNotDeleteSelf === '1' && formData.value.relationship === '本人') {
      gStores.messageStore.showMessage('不可删除本人账号', 2000);
      return;
    }
    await patientUtils.deletePat({
      patientId: gStores.userStore.clickPat.patientId,
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

  const rowClick = async (item) => {
    const { key } = item;
    const { isEditPatPhone } = pageConfig.value;

    if (
      key === 'patientPhone' &&
      isEditPatPhone === '1' &&
      pat.idType === '01'
    ) {
      goEditPhone(pat);
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
    formData.value = {
      ...pat,
      defaultFlag: pat.defaultFlag === '0' ? false : true,
    };
    //是否医保建档
    const medicalMHelp = globalGl.sConfig.medicalMHelp!;
    // #ifdef  MP-WEIXIN
    //先实现支付宝
    // #endif

    // #ifdef MP-ALIPAY
    isMedicalFiling.value = medicalMHelp?.alipay?.medicalFiling === '1';
    // #endif
    const { healthCardUser } = pat;

    pageConfig.value = await ServerStaticData.getSystemConfig('person');

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
    
    // #ifdef MP-WEIXIN || MP-ALIPAY
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
    // #endif


    Object.keys(formData.value).map((key) => {
      if (formData.value[key] === '') {
        formData.value[key] = '无';
      }
    });
    await wait(0);

    const fList = [...formList];
    if (globalGl.SYS_CODE !== '1001067' && healthCardUser) {
      formData.value['healthCardUserLabel'] =
        healthCardUser === '2' ? '医保' : '自费';

      fList.push({
        label: '档案类型',
        key: 'healthCardUserLabel',
        field: 'input-text',
        disabled: true,
        isForShow: true,
      });
    }
    // #ifdef MP-HARMONY
    await wait(60);
    // #endif
    gform.value.setList(fList);
    await wait(0);
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
  .goMedicalFiling {
    color: var(--hr-brand-color-6);
    margin-left: 20rpx;
  }
</style>
