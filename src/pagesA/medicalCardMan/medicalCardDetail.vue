<template>
  <view
    :class="{
      'system-mode-old': gStore.globalStore.modeOld,
    }"
  >
    <g-form
      v-model:value="formData"
      @change="formChange"
      bodyBold
      ref="gform"
    />

    <g-message />

    <view @click="isShow = true" class="btn del-btn btn-primary">
      <view class="del-btn-label">删除就诊人</view>
    </view>

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
  import { nextTick, ref, onMounted } from 'vue';
  import {
    patCardDetailTempList,
    PatCardKeys,
    patCardDetailFormKey,
  } from './utils';
  import { GStores, PatientUtils, wait } from '@/utils';
  import xyDialog from '@/components/xy-dialog/xy-dialog.vue';

  type PagePropType = Record<PatCardKeys, any>;
  const isShow = ref(false);

  const gStore = new GStores();
  const patientUtils = new PatientUtils();
  const formData = ref<PagePropType>({} as PagePropType);
  const gform = ref<any>('');
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

  onMounted(async () => {
    const pat = gStore.userStore.clickPat;

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

    Object.keys(formData.value).map((key) => {
      if (formData.value[key] === '') {
        formData.value[key] = '无';
      }
    });

    nextTick(() => {
      gform.value.setList(formList);
    });
  });
</script>

<style lang="scss" scoped>
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
</style>
