<template>
  <view class="flex flex-between items-center p32 address-container">
    <view class="address-box flex-1" @click="goAddressList">
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

        <view v-if="!isCustom" class="iconfont size-icon">&#xe66b;</view>
      </view>
    </view>

    <slot name="suffix" />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  const props = defineProps<{
    addressList: any[];
    isCustom?: boolean;
  }>();

  const emits = defineEmits(['item-click']);

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
    emits('item-click');
    if (props.isCustom) {
      return;
    }

    uni.setStorage({
      data: '1',
      key: 'back-address',
    });

    uni.navigateTo({
      url: '/pagesC/shippingAddress/addressList?redir=1',
    });
  };
</script>

<style lang="scss" scoped>
  .address-container {
    background: linear-gradient(#fff, #fff) padding-box,
      repeating-linear-gradient(
          -45deg,
          #7ca8ff 0 18rpx,
          transparent 0 35rpx,
          #fe7967 0 50rpx,
          transparent 0 70rpx
        )
        border-box;
    border-bottom: 8rpx solid transparent;
    border-radius: 8px;
  }

  .address-box {
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
      word-wrap: break-all;
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
