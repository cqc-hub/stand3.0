<template>
  <view class="g-page">
    <scroll-view :scroll-into-view="scrollTo" scroll-y class="g-container">
      <view class="content-box">
        <view id="_address" class="container-box g-border mb16">
          <Address-Box :addressList="addressList" />
        </view>

        <view class="container-box g-border mb16 box-padding">
          <view class="g-bold f36">药品清单</view>

          <view>
            <Help-List :list="listData" />
          </view>
        </view>

        <view class="container-box g-border mb16 box-padding">
          <block v-if="aimList.length > 1">
            <view id="_express" class="g-bold f36">选择快递方式</view>

            <view class="mt24 pb32 g-border-bottom">
              <Sel-Express
                :selectLength="3"
                :list="aimList"
                v-model:value="aimValue"
                column="2"
              />
            </view>
          </block>

          <block v-if="aimList.length === 1">
            <view id="_express" class="g-bold f36">快递方式</view>

            <view class="mt24 f28">
              <view class="flex-between">
                <view class="color-888">快递方式</view>
                <view class="g-bold">{{ aimList[0].label }}</view>
              </view>
            </view>
          </block>

          <view class="mt24 f28">
            <view class="flex-between">
              <view class="color-888">支付方式</view>
              <view class="g-bold">到付</view>
            </view>
          </view>
        </view>

        <view class="container-box g-border mb16 box-padding">
          <view class="g-bold f36">备注</view>

          <view class="remark-content">
            <uni-easyinput
              type="textarea"
              v-model="remark"
              autoHeight
              :inputBorder="false"
              :placeholderStyle="'color: var(--hr-neutral-color-5);font-size: var(--hr-font-size-base);'"
              placeholder="请输入备注内容"
            />

            <!-- auto-height -->
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="g-footer">
      <button @click="submit" class="btn btn-primary flex1">立即下单</button>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onShow, onLoad } from '@dcloudio/uni-app';
  import { setLocalStorage, getLocalStorage } from '@/common';
  import {
    GStores,
    IHosInfo,
    ISystemConfig,
    ServerStaticData,
    upImgOss,
    wait,
  } from '@/utils';
  import api from '@/service/api';

  import AddressBox from '../medRecordApply/components/medRecordDetailsAddressBox.vue';
  import HelpList from './components/helpList.vue';
  import SelExpress from './components/selExpress.vue';

  const scrollTo = ref('');
  const remark = ref('');
  const addressList = ref<any[]>([]);
  const gStores = new GStores();
  const listData = ref<any[]>([]);
  const pageConfig = ref<ISystemConfig['drugDelivery']>({});

  const aimList = ref<IOptions[]>([
    // {
    //   label: '顺丰快递',
    //   value: '1',
    // },
    // {
    //   label: '邮政快递',
    //   value: '2',
    // },
  ]);

  const aimValue = ref<any[]>([]);

  const submit = async () => {
    const { cardNumber, patientId, patientName } = gStores.userStore.patChoose;
    const { herenId } = gStores.globalStore;

    const deptName = listData.value.map((o) => o.deptName).join(',');
    const hosId = listData.value[0].hosId;
    const expressCompany = aimValue.value[0];
    const detailsAddressData = addressList.value[0];
    let detailsAddress = '';
    let provinces = '';

    if (detailsAddressData) {
      const { province, city, county } = detailsAddressData;
      detailsAddress = detailsAddressData.detailedAddress;
      provinces = `${province} ${city} ${county} `;
    } else {
      gStores.messageStore.showMessage('请选择快递地址', 3000);
      scrollTo.value = '_address';
    }
    if (!expressCompany) {
      gStores.messageStore.showMessage('请选择快递方式', 3000);
      scrollTo.value = '_express';
    }

    const { senderName, senderPhone } = detailsAddressData;

    const args = {
      deliveryType: '2',
      detailsAddress,
      deptName,
      expressCompany,
      expressName: senderName,
      expressPhone: senderPhone,
      cardNumber,
      patientId,
      patientName,
      herenId,
      hosId,
      prescIdList: listData.value.map((o) => o.prescId),
      prescNoList: listData.value.map((o) => o.prescNo),
      provinces,
      remark: remark.value,
    };
    await api.addDrugDelivery(args);

    uni.reLaunch({
      url: '/pagesB/medicationAssistant/medicalHelp?tabIndex=1',
    });
  };

  let _firstLoaded = true;
  onShow(async () => {
    const _backFromAddress = getLocalStorage('back-address');
    if (_firstLoaded || _backFromAddress) {
      _firstLoaded = false;
      uni.removeStorage({
        key: 'back-address',
      });

      const { result } = await api.queryExpressAddress({
        herenId: gStores.globalStore.herenId,
      });

      addressList.value = result || [];
    }
  });

  const getConfig = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('drugDelivery');

    const companyList = pageConfig.value.company;
    const len = companyList && companyList.length;

    if (len) {
      aimList.value = companyList;

      if (len === 1) {
        aimValue.value = [companyList[0].value];
      }
    } else {
      gStores.messageStore.showMessage('未配置快递信息');
    }
  };

  const init = async () => {
    await getConfig();
  };

  onLoad(async () => {
    await init();
    listData.value = getLocalStorage('medicalHelp') || [];
  });
</script>

<style lang="scss" scoped>
  .g-container {
    .content-box {
      padding: 0 32rpx;
      width: calc(100% - 64rpx);
    }

    .container-box {
      border-radius: 8px;
      background-color: #fff;

      &:first-child {
        margin-top: 24rpx;
      }

      .id-card-container {
        flex-wrap: wrap;
      }

      .up-idcard {
        // flex: 1;
        height: 180rpx;
        border-radius: 8px;
        width: calc(50% - 12rpx);

        border-style: dashed;
        position: relative;
        margin-bottom: 16rpx;

        .delete-icon {
          font-size: var(--hr-font-size-xxl);
          position: absolute !important;
          top: 0;
          right: 0;
        }

        .camera-icon {
          font-size: 60rpx;
          line-height: 55rpx;
        }

        image {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }

        .idcard-bg {
          position: absolute;
          z-index: 1;
        }

        > view {
          position: relative;
          z-index: 1;
        }
      }

      .patient-info {
        .patient-name {
          padding-right: 12rpx;
          margin-right: 12rpx;
        }
      }

      .add-btn {
        padding: 14rpx 0;
        margin-top: 16rpx;
        .add-icon {
          font-size: var(--hr-font-size-xl);
          margin-right: 5rpx;
        }
      }
    }
  }

  .box-padding {
    padding: 32rpx;
  }

  .g-footer {
    display: flex;

    .fee-count {
      flex: 0.8;
    }

    .btn {
      flex: 1;
    }
  }

  .remark-content {
    :deep(input),
    :deep(textarea),
    input,
    textarea {
      color: var(--hr-neutral-color-10) !important;
      font-size: var(--hr-font-size-base) !important;
      background-color: var(--h-color-white) !important;
      opacity: 1;
    }
  }
</style>
