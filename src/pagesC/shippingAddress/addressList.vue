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
            class="box-item"
            v-for="(item, i) in addressList"
            :key="i"
            @tap="gotoAdd('edit', item)"
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
              <view class="item-title-right flex-normal">
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
        <g-empty :current="1" />
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
      herenId: gStores.globalStore.herenId
    });
    addressList.value = result;
    pageLoading.value = true;
  };

  const gotoPatient = () => {
    uni.navigateTo({
      url: '/pagesC/shippingAddress/patientAddress'
    });
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
        defaultFlag: item.defaultFlag
      };
    }
    uni.navigateTo({
      url: joinQuery('/pagesC/shippingAddress/addAddress', {
        item: JSON.stringify(obj),
        pageType: type
      })
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
      defaultFlag: 1
    });
    messageStore.showMessage('添加成功', 1000, {
      closeCallBack: () => {
        getQueryExpressAddress();
      }
    });
  };

  const getWX = () => {
    //获取用户的当前设置
    uni.getSetting({
      success(res) {
        if (res.authSetting['scope.address']) {
          uni.chooseAddress({
            success(res) {
              // #ifdef MP-ALIPAY
              if ((res as any).resultStatus == '9000') {
                getAddress(res);
              }
              // #endif
              // #ifdef MP-WEIXIN
              getAddress(res);
              // #endif
            },
            fail(err) {
              console.log(err);
            }
          });
        } else {
          //未授权 取消地址授权 需要打开设置
          if (res.authSetting['scope.address'] == false) {
            wx.openSetting({
              success(res) {}
            });
          } else {
            //第一次打开
            uni.chooseAddress({
              success(res) {
                // #ifdef MP-ALIPAY
                if ((res as any).resultStatus == '9000') {
                  getAddress(res);
                }
                // #endif
                // #ifdef MP-WEIXIN
                getAddress(res);
                // #endif
              }
            });
          }
        }
      }
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
      padding: 32rpx 32rpx 68rpx;
    }
  }
</style>
