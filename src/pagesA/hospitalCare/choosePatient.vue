<template>
  <!-- 选择就诊人 不绑定就诊人模式 -->
  <g-flag v-if="!pageProps.type" typeFg="29" isShowFg />
  <g-flag v-if="pageProps.type === '1'" typeFg="53" isShowFg />
  <view class="page">
    <view class="title">请查询就诊人</view>
    <view class="inputs">
      <view class="input-item border">
        <text>就诊人姓名</text>
        <input
          class="uni-input"
          placeholder-style="font-size:32rpx;color:#bbb"
          v-model="hosInfoParam.patientName"
          placeholder="请输入"
        />
        <view class="pat-choose" @tap="chooseAction">选择就诊人</view>
      </view>
      <view class="input-item">
        <text>手机号码</text>
        <input
          class="uni-input"
          placeholder-style="font-size:32rpx;color:#bbb"
          type="number"
          v-model="hosInfoParam.patientPhone"
          @input="checkPatientPhone(hosInfoParam.patientPhone)"
          placeholder="请输入"
        />
      </view>
    </view>
    <button
      :disabled="
        hosInfoParam.patientName != '' &&
        hosInfoParam.patientPhone != '' &&
        phoneStatus == true
          ? false
          : true
      "
      :class="
        hosInfoParam.patientName != '' &&
        hosInfoParam.patientPhone != '' &&
        phoneStatus == true
          ? 'activeSubmitBtn'
          : 'submitBtn'
      "
      @click="toSearch"
    >
      查询
    </button>
    <choose-pat-action ref="actionSheet" @choose-pat="choosePatHandler" />
    <g-message />
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { getAvatar, isAreaProgram, useUserStore, IPat } from '@/stores';
  import { GStores, type TButtonConfig, useTBanner } from '@/utils';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';
  import api from '@/service/api';
  import {
    getInHospitalInfoResult,
    getInHospitalInfoParam,
  } from './utils/inpatientInfo';
  import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';
  import { onLoad, onReady } from '@dcloudio/uni-app';
  import { decryptDes } from '@/common/des';
  import { assertTypeofTypeAnnotation } from '@babel/types';

  const pageProps = ref(
    <
      {
        /**
         *   - 1 手术查询
         */
        type?: '1';
      }
    >{}
  );
  const phoneStatus = ref();
  const hosInfoParam = ref<getInHospitalInfoParam>({
    patientName: '',
    patientPhone: '',
  });
  const hosInfoResObj = ref<getInHospitalInfoResult>(
    {} as getInHospitalInfoResult
  );
  const userSore = useUserStore();
  const gStores = new GStores();
  const checkPatientPhone = (val) => {
    phoneStatus.value = /^1[3-9]\d{9}$/.test(val);

    return /^1[3-9]\d{9}$/.test(val);
  };
  // 就诊人
  const actionSheet = ref<InstanceType<typeof ChoosePatAction>>();
  const chooseAction = () => {
    if (actionSheet.value) {
      actionSheet.value.show();
    }
  };
  const choosePatHandler = ({ item }: { item: IPat; number: number }) => {
    const key = 'hrtest22';
    const phone = item.cellPhoneNumber;
    const message = decryptDes(phone, key);
    gStores.userStore.updatePatChoose(item);
    hosInfoParam.value.patientName = item.patientName;
    phoneStatus.value = /^1[3-9]\d{9}$/.test(message);
    hosInfoParam.value.patientPhone = message;
  };
  const init = async () => {
    const { result } = await api.getInHospitalInfo<getInHospitalInfoResult>({
      patientName: hosInfoParam.value.patientName,
      patientPhone: hosInfoParam.value.patientPhone,
    });
    hosInfoResObj.value = result;
    uni.navigateTo({
      url: `choosePatientInfo?patientName=${hosInfoParam.value.patientName}&patientPhone=${hosInfoParam.value.patientPhone}`,
    });
  };
  const toSearch = async () => {
    const type = pageProps.value.type;
    if (type) {
      if (type === '1') {
        const extraData = {
          patientName: hosInfoParam.value.patientName,
          patientPhone: hosInfoParam.value.patientPhone,
        };

        /** 手术查询 */
        useTBanner({
          type: 'h5',
          isSelfH5: '1',
          path: 'pagesC/operationRes/operationRes',
          extraData: {
            patientName: hosInfoParam.value.patientName,
            patientPhone: hosInfoParam.value.patientPhone,
          },
          addition: {
            patientId: '_patientId',
          },
          isLocal: '1',
        });
      }
    } else {
      await init();
    }
  };

  onReady(() => {
    switch (pageProps.value.type) {
      case '1':
        uni.setNavigationBarTitle({
          title: '手术查询',
        });
        break;

      default:
        break;
    }
  });

  onLoad((opt) => {
    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }
  });
</script>

<style scoped lang="scss">
  .page {
    padding: 80rpx 32rpx 0;
    .title {
      font-size: var(--hr-font-size-xxl);
      color: #111;
      font-weight: 600;
      margin-bottom: 80rpx;
    }
    .inputs {
      height: 208rpx;
      background-color: #fff;
      border-radius: 16rpx;
      .input-item {
        display: flex;
        align-items: center;
        height: 50%;
        margin: 0 32rpx;
        &.border {
          border-bottom: 2rpx solid #f3f3f3;
        }
        text {
          width: 160rpx;
          padding-right: 32rpx;
          color: #666666;
          font-size: var(--hr-font-size-base);
        }
      }
      .uni-input {
        width: 250rpx;
      }
    }
    .submitBtn {
      height: 96rpx;
      border-radius: 16rpx;
      background-color: #9ebeff;
      color: #fff;
      text-align: center;
      line-height: 96rpx;
      margin-top: 120rpx;
      font-size: var(--hr-font-size-xl);
    }
    .activeSubmitBtn {
      height: 96rpx;
      border-radius: 16rpx;
      background-color: #296fff;
      color: #fff;
      text-align: center;
      line-height: 96rpx;
      margin-top: 120rpx;
      font-size: var(--hr-font-size-xl);
    }
    .pat-choose {
      width: 180rpx;
      height: 56rpx;
      border-radius: 28rpx;
      background-color: #e9f0ff;
      color: #296fff;
      font-weight: 600;
      font-size: var(--hr-font-size-xxs);
      line-height: 56rpx;
      text-align: center;
    }
  }
</style>
