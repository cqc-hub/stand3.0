<template>
  <view class="address-box" @click="goAddressList">
    <block v-if="addressList.length">
      <view class="header flex-normal-between">
        <view class="user-info text-ellipsis">
          <text class="mr16">{{ address.senderName }}</text>
          <text>{{ address.senderPhone }}</text>
        </view>

        <view class="iconfont size-icon">&#xe66b;</view>
      </view>

      <view class="g-bold text-ellipsis address-content">
        {{
          (address.province || '') +
          (address.city || '') +
          (address.county || '') +
          (address.detailedAddress || '')
        }}
      </view>
    </block>

    <view
      v-else
      class="g-bold text-ellipsis address-content address-empty flex-normal"
    >
      <view class="flex-normal">
        <text class="icon-font ico_location2 icon-size" />
        <view>请选择收货地址</view>
      </view>

      <view class="iconfont size-icon">&#xe66b;</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  const props = defineProps<{
    addressList: any[];
  }>();

  const address = computed(() => {
    if (props.addressList.length) {
      return (
        props.addressList.find((o) => o.defaultFlag == 1) ||
        props.addressList[0]
      );
    } else {
      return {};
    }
  });

  const goAddressList = () => {
    uni.navigateTo({
      url: '/pagesC/shippingAddress/addressList?redir=1',
    });
  };
</script>

<style lang="scss" scoped>
  .address-box {
    padding: 32rpx;
    border-bottom: 8rpx solid transparent;
    border-radius: 8px;

    background: linear-gradient(#fff, #fff) padding-box,
      repeating-linear-gradient(
          -45deg,
          #7ca8ff 0 18rpx,
          transparent 0 35rpx,
          #fe7967 0 50rpx,
          transparent 0 70rpx
        )
        border-box;

    .header {
      color: var(--hr-neutral-color-9);
      .user-info {
        font-size: var(--hr-font-size-xs);
        display: flex;
        max-width: calc(100% - 150rpx);
        text {
          word-break: break-all;
          white-space: nowrap;
        }
      }
    }

    .address-content {
      -webkit-line-clamp: 2;
      font-size: var(--hr-font-size-xl);
    }

    .icon-size {
      width: 46rpx;
      height: 46rpx;

      margin-right: 10rpx;
    }
  }

  .address-empty {
    justify-content: space-between;
  }

  .size-icon {
    color: var(--hr-neutral-color-7);
    font-size: var(--hr-font-size-xxl);
  }
</style>
