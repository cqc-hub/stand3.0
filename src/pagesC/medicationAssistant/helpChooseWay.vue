<template>
  <view class="g-page">
    <scroll-view :scroll-into-view="scrollTo" scroll-y class="g-container">
      <view class="content-box">
        <view id="_address" class="container-box g-border mb16">
          <Address-Box
            :addressList="addressList"
            @item-click="addressInputClick"
            is-custom
          >
            <template v-if="pageProps.params" #suffix>
              <div class="flex relative">
                <g-login @handler-next="goAddressList" class="">
                  <view
                    @click="goAddressList"
                    class="book-address pl24 flex items-center"
                  >
                    <view class="color-888">地址薄</view>
                  </view>
                </g-login>
              </div>
            </template>
          </Address-Box>
        </view>

        <view class="container-box g-border mb16 box-padding">
          <view class="g-bold f36">药品清单</view>

          <view>
            <Help-List :list="cacheStore.medicalHelpSelList" />
          </view>
        </view>

        <view
          v-if="!isIncludeChineseMedicalFriedAndDelivery && aimList.length"
          class="container-box g-border mb16 box-padding"
        >
          <block>
            <block v-if="aimList.length > 1">
              <view id="_express" class="g-bold f36">选择快递方式</view>

              <view class="mt24 pb32 g-border-bottom">
                <Sel-Express
                  :selectLength="3"
                  :list="aimList"
                  :column="2"
                  v-model:value="aimValue"
                />
              </view>
            </block>

            <block v-if="aimList.length === 1">
              <view id="_express" class="g-bold f36">快递方式</view>

              <view class="mt24 f28">
                <view class="flex-between">
                  <view class="color-888">快递方式</view>
                  <!-- <view class="g-bold">{{ aimList[0].label }}</view> -->
                  <view class="g-bold">
                    <image
                      :src="getSrc(aimList[0].value)"
                      class="express-icon"
                    />
                  </view>
                </view>
              </view>
            </block>

            <view
              :class="{
                mt24: !isIncludeChineseMedicalFriedAndDelivery,
              }"
              class="f28"
            >
              <view class="flex-between">
                <view class="color-888">快递费支付方式</view>
                <view class="g-bold color-error">到付</view>
              </view>
            </view>
          </block>
        </view>

        <view
          v-if="globalGl.SYS_CODE !== '1001067'"
          class="container-box g-border mb16 box-padding"
        >
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

        <view class="container-box g-border mb16">
          <g-flag typeFg="38" isShowFgTip />
        </view>

        <view class="safe-height" />
      </view>
    </scroll-view>
    <view class="g-footer">
      <button @click="submit" class="btn btn-primary flex1">
        {{ globalGl.SYS_CODE === '1001067' ? '提交' : '立即下单' }}
      </button>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import { onShow, onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl, getLocalStorage } from '@/common';
  import { GStores, ISystemConfig, ServerStaticData } from '@/utils';
  import { getSrc } from './utils';
  import { useCacheStore } from '@/stores';
  import { getShowDrugName } from '@/pagesB/medicationAssistant/utils/medicalHelp';
  import api from '@/service/api';

  import AddressBox from '../medRecordApply/components/MedRecordDetailsAddressBox.vue';
  import HelpList from './components/HelpList.vue';
  import SelExpress from './components/SelExpress.vue';
  import globalGl from '@/config/global';

  const cacheStore = useCacheStore();
  const pageProps = ref(
    {} as {
      cardNumber?: string;
      params?: string;
    }
  );

  const isChineseMedical = (item: any) => {
    return !!(item && item.drugTypeName && item.drugTypeName.includes('中药'));
  };

  const isToBeFriedAndDelivery = (item) => {
    if (isChineseMedical(item)) {
      return item.drugIsDelivery === '1' && item.tcmDecoctionIndicator === '1';
    }

    return false;
  };

  const scrollTo = ref('');
  const remark = ref('');
  const addressList = ref<any[]>([]);
  const gStores = new GStores();
  const pageConfig = ref<ISystemConfig['drugDelivery']>({});
  const isIncludeChineseMedicalFriedAndDelivery = ref(false);

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

  const addressInputClick = () => {
    if (pageProps.value.params) {
      uni.navigateTo({
        url: '/pagesC/shippingAddress/inputAddress?redir=1',
      });
    } else {
      goAddressList();
    }
  };

  const goAddressList = () => {
    uni.setStorage({
      data: '1',
      key: 'back-address',
    });

    uni.navigateTo({
      url: '/pagesC/shippingAddress/addressList?redir=1',
    });
  };

  const submit = async () => {
    const { cardNumber, patientId, patientName } = gStores.userStore.patChoose;
    const { herenId } = gStores.globalStore;
    const { params } = pageProps.value;

    const deptName = cacheStore.medicalHelpSelList
      .map((o) => o.deptName)
      .join(',');
    const hosId = cacheStore.medicalHelpSelList[0].hosId;
    const expressCompany = aimValue.value[0];
    const detailsAddressData = addressList.value[0];
    let detailsAddress = '';
    let provinces = '';

    if (detailsAddressData) {
      const { province, city, county } = detailsAddressData;
      detailsAddress = detailsAddressData.detailedAddress;
      provinces = `${province} ${city} ${county}`;
    } else {
      gStores.messageStore.showMessage('请选择快递地址', 3000);
      scrollTo.value = '_address';
    }
    if (!expressCompany) {
      gStores.messageStore.showMessage('请选择快递方式', 3000);
      scrollTo.value = '_express';
    }

    const findItem = cacheStore.medicalHelpSelList.find((o) =>
      getShowDrugName(o).includes('代煎外配')
    );

    const { senderName, senderPhone } = detailsAddressData;

    if (findItem && pageConfig.value.deliveryFiredVerifySelf === '1') {
      if (senderName !== gStores.userStore.patChoose.patientName) {
        gStores.messageStore.showMessage(
          '收件人姓名必须与处方人姓名一致，请修改！',
          3000
        );

        return;
      }
    }

    const deliveryType =
      !aimValue.value.length || isIncludeChineseMedicalFriedAndDelivery.value
        ? '3'
        : '2';

    const args = {
      deliveryType,
      detailsAddress,
      deptName,
      expressCompany: deliveryType === '3' ? undefined : expressCompany,
      expressName: senderName,
      expressPhone: senderPhone,
      cardNumber: pageProps.value.cardNumber || cardNumber,
      patientId: params ? undefined : patientId,
      patientName: params ? undefined : patientName,
      herenId,
      hosId,
      prescIdList: cacheStore.medicalHelpSelList.map((o) => o.prescId),
      prescNoList: cacheStore.medicalHelpSelList.map((o) => o.prescNo),
      provinces,
      remark: remark.value,
    };

    await api.addDrugDelivery(args);

    if (pageProps.value.params) {
      gStores.messageStore.showMessage('提交成功', 1500, {
        closeCallBack() {
          uni.navigateBack({
            delta: 1,
          });
        },
      });
      return;
    }

    gStores.globalStore.sysCode === '1001067'
      ? uni.reLaunch({
          url: '/pages/home/home',
        })
      : uni.reLaunch({
          url: '/pagesB/medicationAssistant/medicalHelp?tabIndex=1',
        });
  };

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
      if (globalGl.SYS_CODE !== '1001067') {
        gStores.messageStore.showMessage('未配置快递信息');
      }
    }
  };

  const init = async () => {
    await getConfig();
  };

  let _firstLoaded = true;
  onShow(async () => {
    const _backFromAddress = getLocalStorage('back-address');
    if (_firstLoaded || _backFromAddress) {
      _firstLoaded = false;
      uni.removeStorage({
        key: 'back-address',
      });

      if (_backFromAddress === '2') {
        if (cacheStore.cacheData.address) {
          addressList.value = [
            {
              ...cacheStore.cacheData,
            },
          ];
        }
      } else if (gStores.globalStore.isLogin) {
        const { result } = await api.queryExpressAddress({
          herenId: gStores.globalStore.herenId,
        });

        if (result && result.length) {
          addressList.value = result;
        }
      }
    }
  });

  onLoad(async (opt) => {
    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }
    await init();
    isIncludeChineseMedicalFriedAndDelivery.value =
      !!cacheStore.medicalHelpSelList.find((o) => isToBeFriedAndDelivery(o));
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

  .book-address {
    font-weight: 500;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      background-color: var(--hr-neutral-color-2);
      width: 1px;
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

  .express-icon {
    width: 190rpx;
    height: 52rpx;

    transform: translateX(20rpx);
  }
</style>
