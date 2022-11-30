<template>
  <view class="page">
    <view class="address-top flex-between">
      <view class="item g-flex-rc-cc" @tap="gotoPatient">
        <text class="icon-font ico_people" />
        <text>获取就诊人地址</text>
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <view class="item g-flex-rc-cc" @tap="getWX">
        <text class="icon-font ico_wechat" />
        <text>获取微信地址</text>
      </view>
      <!-- #endif -->
      <!-- #ifdef MP-ALIPAY -->
      <view class="item g-flex-rc-cc" @tap="getWX">
        <text class="icon-font ico_alipay" />
        <text>获取支付宝地址</text>
      </view>
      <!-- #endif -->
    </view>
    <block v-if="addressList.length > 0">
      <scroll-view class="address-box-container" scroll-y>
        <view class="address-box">
          <view
            @click="itemClick(item)"
            class="box-item"
            v-for="(item, i) in addressList"
            :key="i"
          >
            <view class="item-title flex-between">
              <view class="item-title-left flex-normal">
                <text>{{ item.senderName }}</text>
                <text>{{ item.senderPhone }}</text>
                <g-tag
                  v-if="item.defaultFlag === 1"
                  type="yellow"
                  text="默认"
                />
              </view>
              <view
                @tap.stop="gotoAdd('edit', item)"
                class="item-title-right flex-normal"
              >
                <view class="iconfont">&#xe6b9;</view>
                编辑
              </view>
            </view>
            <text class="box-content">
              {{
                item.province + item.city + item.county + item.detailedAddress
              }}
            </text>
          </view>
        </view>
      </scroll-view>
    </block>
    <block v-else>
      <view v-if="pageLoading" class="scroll-container">
        <g-empty :current="1" text="未查询到相关信息!" />
      </view>
    </block>
    <view class="footer">
      <button @click="gotoAdd('add')" class="btn btn-primary">
        新增收货地址
      </button>
    </view>
    <g-message />
  </view>
</template>

<script setup lang="ts">
  import { onShow } from '@dcloudio/uni-app';
  import api from '@/service/api';
  import { GStores } from '@/utils';
  import { ref } from 'vue';
  import { useMessageStore } from '@/stores';
  import { joinQuery } from '@/common';
  import { getScopeAddress } from '@/common/utils';

  const props = defineProps<{
    redir?: string;
  }>();
  const pageLoading = ref(false);
  const gStores = new GStores();
  const messageStore = useMessageStore();
  const addressList = ref<IAddress[]>([]);

  onShow(() => {
    getQueryExpressAddress();
  });
  const getQueryExpressAddress = async () => {
    pageLoading.value = false;
    const { result } = await api.queryExpressAddress({
      herenId: gStores.globalStore.herenId,
    });
    addressList.value = result;
    pageLoading.value = true;
  };

  const gotoPatient = () => {
    uni.navigateTo({
      url: '/pagesC/shippingAddress/patientAddress',
    });
  };

  const itemClick = async (item) => {
    if (props.redir) {
      const params = {
        herenId: gStores.globalStore.herenId,
        ...item,
        defaultFlag: 1,
      };

      await api.updateExpressAddress(params);

      uni.navigateBack();
    } else {
      gotoAdd('edit', item);
    }
  };

  const gotoAdd = (type, item?) => {
    let obj = {};
    if (item) {
      obj = {
        senderName: item.senderName,
        senderPhone: item.senderPhone,
        address: item.province + item.county + item.city,
        detailedAddress: item.detailedAddress,
        postcode: item.postcode,
        id: item.id,
        city: item.city,
        county: item.county,
        province: item.province,
        defaultFlag: item.defaultFlag,
      };
    }
    uni.navigateTo({
      url: joinQuery('/pagesC/shippingAddress/addAddress', {
        item: JSON.stringify(obj),
        pageType: type,
      }),
    });
  };
  const getAddress = async (data) => {
    await api.addExpressAddress({
      herenId: gStores.globalStore.herenId,
      senderName: data.userName,
      senderPhone: data.telNumber,
      detailedAddress: data.detailInfo,
      postcode: data.postcode,
      province: data.provinceName,
      city: data.cityName,
      county: data.countyName,
      defaultFlag: 0,
    });
    messageStore.showMessage('地址保存成功', 1000, {
      closeCallBack: () => {
        getQueryExpressAddress();
      },
    });
  };

  const getWX = async () => {
    const data = await getScopeAddress();
    console.log(888, data);
    getAddress(data);
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
        border: 1rpx solid var(--hr-neutral-color-2);
        border-radius: 16rpx;
        &:first-child {
          margin-right: 14rpx;
        }
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
    .address-box-container {
      height: calc(100vh - 367rpx);
    }
    .address-box {
      .box-item {
        background: var(--h-color-white);
        margin-bottom: 16rpx;
        border: 1rpx solid var(--hr-neutral-color-2);
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
              &:first-child {
                word-break: break-all;
              }
            }
          }
          .item-title-right {
            color: var(--hr-brand-color-6);
            white-space: nowrap;
            .iconfont {
              font-size: var(-h-size-40);
              color: var(--hr-brand-color-6);
            }
          }
        }
        .box-content {
          font-size: var(--hr-font-size-xl);
          font-weight: var(--h-weight-2);
          text-align: left;
          color: var(--hr-neutral-color-10);
          word-break: break-all;
        }
      }
    }
    .scroll-container {
      margin-top: 40%;
    }
    .footer {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: var(--h-color-white);
      padding: 24rpx 32rpx 68rpx;
    }
  }
</style>
