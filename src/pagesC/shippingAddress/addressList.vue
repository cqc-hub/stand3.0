<template>
  <view class="page">
    <view class="address-top flex-between">
      <view class="item g-flex-rc-cc" @tap="gotoPatient">
        <text class="icon-font ico_people" />
        <text>获取就诊人地址</text>
      </view>
      <view class="item g-flex-rc-cc">
        <text class="icon-font ico_wechat" />
        <text>获取就诊人地址</text>
      </view>
    </view>
    <block v-if="addressList.length < 0">
      <view class="address-box">
        <view class="box-item" v-for="(item, i) in addressList" :key="i">
          <view class="item-title flex-between">
            <view class="item-title-left flex-normal">
              <text>{{ item.senderName }}</text>
              <text>{{ item.senderPhone }}</text>
              <g-tag v-if="item.defaultFlag === '1'" type="yellow" text="默认" />
            </view>
            <view class="item-title-right flex-normal">
              <view class="iconfont">&#xe6b9;</view>
              编辑
            </view>
          </view>
          <text class="box-content">{{ item.province + item.city + item.county + item.detailedAddress }}</text>
        </view>
      </view>
      <view class="footer">
        <button @click="gotoAdd" class="btn btn-primary">新增收货地址</button>
      </view>
    </block>
    <block v-else>
      <g-empty :current="1" />
    </block>
  </view>
</template>

<script setup lang="ts">
  import { onLoad } from '@dcloudio/uni-app';
  import api from '@/service/api';
  import { GStores } from '@/utils';
  import { ref } from 'vue';

  interface IAddress {
    city: string;
    county: string;
    createTime: string;
    defaultFlag: '1' | '0';
    detailedAddress: string;
    herenId: string;
    id: number;
    postcode: string;
    province: string;
    senderName: string;
    senderPhone: string;
    sysCode: string;
    updateTime: string;
  }

  const gStores = new GStores();
  const addressList = ref<IAddress[]>([]);
  onLoad(() => {
    getQueryExpressAddress();
  });
  const getQueryExpressAddress = async () => {
    const { result } = await api.queryExpressAddress({ herenId: gStores.globalStore.herenId });
    addressList.value = result;
  };

  const gotoPatient = () => {
    uni.navigateTo({
      url: '/pagesC/shippingAddress/patientAddress'
    });
  };
  const gotoAdd = () => {
    uni.navigateTo({
      url: '/pagesC/shippingAddress/addAddress?pageType=add'
    });
  };
</script>

<style scoped lang="scss">
  .page {
    background-color: #f6f6f6;
    padding: 24rpx 32rpx;
    .address-top {
      margin-bottom: 24rpx;
      width: 100%;
      view.item {
        width: 50%;
        height: 128rpx;
        background: var(--h-color-white);
        border: 2rpx solid #cccccc;
        border-radius: 16rpx;
        margin-right: 14rpx;
        .icon-font {
          margin-right: 14rpx;
          width: 48rpx;
          height: 48rpx;
        }
        text {
          color: var(--hr-neutral-color-10);
          font-size: var(--hr-font-size-base);
        }
      }
    }
    .address-box {
      .box-item {
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
          .item-title-right {
            color: var(--hr-brand-color-6);
            .iconfont {
              width: 40rpx;
              height: 40rpx;
              color: var(--hr-brand-color-6);
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
    }
    .footer {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: var(--h-color-white);
      padding: 32rpx 32rpx 68rpx;
    }
  }
</style>
