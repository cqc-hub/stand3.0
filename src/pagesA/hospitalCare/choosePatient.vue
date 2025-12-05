<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <!-- 选择就诊人 不绑定就诊人模式 -->
    <g-flag v-if="!pageProps.type" typeFg="29" isShowFg />
    <g-flag v-if="pageProps.type === '1'" typeFg="53" isShowFg />
    <view class="page">
      <view v-if="pageProps.type === '2'" class="title">请查询就诊人</view>
      <view class="inputs">
        <view class="input-item border flex items-center">
          <text class="text-no-wrap">就诊人姓名</text>
          <input
            class="uni-input flex-1"
            placeholder-style="font-size:32rpx;color:#bbb"
            v-model="hosInfoParam.patientName"
            @input="inputChange"
            placeholder="请输入"
          />
          <view>
            <g-login
              @handler-next="chooseAction"
              v-if="!pageProps.isClosePatChoose"
            >
              <view class="pat-choose" @tap="chooseAction">选择就诊人</view>
            </g-login>
          </view>
        </view>
        <view class="input-item">
          <text>手机号码</text>
          <input
            class="uni-input flex-1"
            placeholder-style="font-size:32rpx;color:#bbb"
            type="number"
            v-model="hosInfoParam.patientPhone"
            @input="
              () => {
                inputChange();
                checkPatientPhone(hosInfoParam.patientPhone);
              }
            "
            placeholder="请输入"
          />
        </view>
        <view class="input-item" v-if="pageProps.showIdType === '1'">
          <text>证件类型</text>
          <input
            class="uni-input flex-1"
            placeholder-style="font-size:32rpx;color:#bbb"
            type="number"
            :value="
              idTypeTerms.find((item) => hosInfoParam.idType === item.value)
                ?.label
            "
            readonly
            placeholder="请输入"
            @click="_actionSheet.show()"
          />
          <view class="iconfont icon-resize icon_arrow color-888">
            &#xe66b;
          </view>
        </view>
        <view class="input-item" v-if="pageProps.showIdType === '1'">
          <text>证件号</text>
          <input
            class="uni-input flex-1"
            placeholder-style="font-size:32rpx;color:#bbb"
            type="number"
            v-model="hosInfoParam.idCard"
            placeholder="请输入"
          />
        </view>
      </view>

      <button
        :disabled="!searchStatus"
        :class="searchStatus ? 'activeSubmitBtn' : 'submitBtn'"
        @click="toSearch"
      >
        查询
      </button>
      <choose-pat-action ref="actionSheet" @choose-pat="choosePatHandler" />
      <view class="form-picker">
        <uni-data-picker
          :map="{ text: 'label', value: 'value' }"
          :localdata="idTypeTerms"
          :clear-icon="false"
          @change="pickerChange"
          isHideSlot
          ref="_actionSheet"
        >
          <view />
        </uni-data-picker>
      </view>
      <g-message />
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useUserStore, IPat } from '@/stores';
  import { GStores, ServerStaticData, useTBanner } from '@/utils';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';
  import api from '@/service/api';
  import {
    getInHospitalInfoResult,
    getInHospitalInfoParam,
  } from './utils/inpatientInfo';
  import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';
  import { onLoad, onReady } from '@dcloudio/uni-app';
  import { decryptDes } from '@/common/des';
  import { idValidator } from '@/utils/modules/idCard';

  const pageProps = ref(
    <
      {
        /**
         * - 1 手术查询
         * - 2 多住院记录
         */
        type?: '1' | '2';
        showIdType?: '1' | '0';
        isClosePatChoose?: '1' | '0';
        // 页面透传
        [key: string]: any;
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
  const idTypeTerms = ref<any[]>([{ label: '身份证', value: '01' }]);
  const _actionSheet = ref();
  const userSore = useUserStore();
  const gStores = new GStores();

  const inputChange = () => {
    hosInfoParam.value.patientId = '';
    hosInfoParam.value.cardNumber = '';
  };
  const checkPatientPhone = (val) => {
    phoneStatus.value = /^1[3-9]\d{9}$/.test(val);

    return phoneStatus.value;
  };
  // 就诊人
  const actionSheet = ref<InstanceType<typeof ChoosePatAction>>();

  const searchStatus = computed(() => {
    const comomStatus =
      hosInfoParam.value.patientName != '' &&
      hosInfoParam.value.patientPhone != '' &&
      phoneStatus.value == true;
    if (pageProps.value.showIdType === '1') {
      return (
        comomStatus &&
        hosInfoParam.value.idCard !== '' &&
        (hosInfoParam?.value.idType !== '01' ||
          (hosInfoParam?.value.idType === '01' &&
            idValidator.check18IdCardNo(hosInfoParam.value.idCard || '')))
      );
    }
    return comomStatus;
  });

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
    hosInfoParam.value.patientId = item.patientId;
    hosInfoParam.value.cardNumber = item.cardNumber;
  };
  const init = async () => {
    const { sysCode } = gStores.globalStore;
    const args = {
      ...hosInfoParam.value,
      patientName: hosInfoParam.value.patientName,
      patientPhone: hosInfoParam.value.patientPhone,
    };

    Object.keys(args).forEach((key) => {
      if (!args[key]) {
        delete args[key];
      }
    });

    if (sysCode === '1001067') {
      uni.navigateTo({
        url: joinQueryForUrl('hospitalRecordList', {
          ...hosInfoParam.value,
        }),
      });
      return;
    }

    const { result } =
      await api.getInHospitalInfo<getInHospitalInfoResult>(args);

    if (!result) {
      gStores.messageStore.showMessage('未查询到相关住院信息', 1500);
      return;
    }

    hosInfoResObj.value = result;
    const {
      patientName,
      patientPhone,
      idCard,
      idType = '',
    } = hosInfoParam.value;

    uni.navigateTo({
      url: joinQueryForUrl('choosePatientInfo', {
        patientName,
        patientPhone,
        idCard,
        idType,
      }),
    });
  };

  const toSearch = async () => {
    const type = pageProps.value.type;
    if (type) {
      if (type === '1') {
        const { patientName, patientPhone, cardNumber } = hosInfoParam.value;
        const extraData = {
          patientName,
          patientPhone,
          cardNumber,
        };

        /** 手术查询 */
        useTBanner({
          type: 'h5',
          isSelfH5: '1',
          path: 'pagesC/operationRes/operationRes',
          extraData: {
            ...extraData,
            openId: gStores.globalStore.h5OpenId,
          },
          addition: {
            patientId: '_patientId',
          },
          // isLocal: '1',
        });
      } else if (type === '2') {
        goSearchHospitalRecord();
      }
    } else {
      await init();
    }
  };

  // 多住院记录
  const goSearchHospitalRecord = () => {
    const q = {
      ...pageProps.value,
    };

    delete q.type;
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/hospitalCare/hospitalRecordList', {
        ...hosInfoParam.value,
        ...q,
      }),
    });
  };

  onReady(() => {
    let navTitle = '预交金代缴';
    switch (pageProps.value.type) {
      case '1':
        navTitle = '手术查询';
        break;

      case '2':
        navTitle = '住院信息';
        break;

      default:
        break;
    }

    uni.setNavigationBarTitle({
      title: navTitle,
    });
  });

  const pickerChange = (e) => {
    console.log(' pickerChange', e);

    hosInfoParam.value.idType = e.detail.value[0].value;
    hosInfoParam.value.idCard = '';
    console.log('hosInfoParam.value', hosInfoParam.value);
  };

  onLoad(async (opt) => {
    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
      if (pageProps.value?.showIdType) {
        hosInfoParam.value.idType = '01';
        idTypeTerms.value = await ServerStaticData.getIdTypeTerms();
        console.log('idTypeTerms.value', idTypeTerms.value);
      }
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
      // height: 208rpx;
      background-color: #fff;
      border-radius: 16rpx;
      .input-item {
        display: flex;
        align-items: center;
        height: 100rpx;
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
      background-color: var(--hr-brand-color-3-light);
      color: #fff;
      text-align: center;
      line-height: 96rpx;
      margin-top: 120rpx;
      font-size: var(--hr-font-size-xl);
    }
    .activeSubmitBtn {
      height: 96rpx;
      border-radius: 16rpx;
      background-color: var(--hr-brand-color-6);
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
      background-color: var(--hr-brand-color-3-light);
      color: var(--hr-brand-color-6);
      font-weight: 600;
      font-size: var(--hr-font-size-xxs);
      line-height: 56rpx;
      text-align: center;
    }
  }
</style>
