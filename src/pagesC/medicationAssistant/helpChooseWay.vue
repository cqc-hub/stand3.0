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
          <view class="g-bold f36">选择快递方式</view>
        </view>
      </view>
    </scroll-view>
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

  const scrollTo = ref('');
  const addressList = ref<any[]>([]);
  const gStores = new GStores();
  const listData = ref<any[]>([{}, {}, {}]);

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
