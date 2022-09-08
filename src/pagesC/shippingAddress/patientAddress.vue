<template>
  <view class="page">
    <block v-if="addressList.length > 0">
      <scroll-view class="address-box-container" scroll-y>
        <view class="address-box">
          {{ currentIndex }}
          <view
            class="box-item"
            :class="i == currentIndex ? 'active' : ''"
            @tap="clickSelect(i, item)"
            v-for="(item, i) in addressList"
            :key="i"
          >
            <view class="svg" v-if="i == currentIndex">
              <text class="icon-font ico_selected" />
            </view>
            <view class="item-title flex-between">
              <view class="item-title-left">
                <text>{{ item.senderName }}</text>
                <text>{{ item.senderPhone }}</text>
              </view>
            </view>
            <text v-if="item.province || item.detailedAddress" class="box-content">
              {{ item.province + item.city + item.county + item.detailedAddress }}
            </text>
          </view>
        </view>
      </scroll-view>
    </block>
    <block v-else>
      <view v-if="pageLoading" class="scroll-container">
        <g-empty :current="1" />
      </view>
    </block>
    <xy-dialog
      :show="isAddShow"
      content="请补充地址信息"
      confirmText="立即补充"
      @confirmButton="clickConfirm"
    ></xy-dialog>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { GStores } from '@/utils';
  import api from '@/service/api';

  const isAddShow = ref(false);
  const addressList = ref<IAddress[]>([]);
  const gStores = new GStores();
  const pageLoading = ref(false);
  const currentIndex = ref();

  onLoad(() => {
    getQueryExpressAddress();
  });

  const getQueryExpressAddress = async () => {
    pageLoading.value = false;
    const { result } = await api.queryExpressAddressByPatient({ herenId: gStores.globalStore.herenId });
    addressList.value = result;
    pageLoading.value = true;
  };

  const clickSelect = (e, item) => {
    currentIndex.value = e;
    if (!item.province || !item.detailedAddress) {
      isAddShow.value = true;
    }
  };
  const clickConfirm = () => {
    uni.navigateTo({
      url: '/pagesC/shippingAddress/addAddress?pageType=edit'
    });
  };
</script>

<style scoped lang="scss">
  .page {
    background-color: #f6f6f6;
    padding: 24rpx 32rpx;
    .address-box {
      .box-item {
        position: relative;
        background: var(--h-color-white);
        margin-bottom: 16rpx;

        border: 2rpx solid var(--hr-neutral-color-4);
        border-radius: 16rpx;
        padding: 32rpx;
        .item-title {
          margin-bottom: 32rpx;
          .item-title-left {
            text {
              font-size: var(--hr-font-size-xs);
              color: var(--hr-neutral-color-9);
              margin-right: 16rpx;
              line-height: 44rpx;
            }
          }
        }
        .box-content {
          font-size: var(--hr-font-size-xl);
          font-weight: var(--h-weight-2);
          text-align: left;
          color: var(--hr-neutral-color-10);
        }
      }
      .active {
        border-color: var(--hr-brand-color-6);
      }
      .svg {
        font-size: var(--h-size-40);
        position: absolute;
        right: 0;
        bottom: -12rpx;
      }
    }
  }
</style>
