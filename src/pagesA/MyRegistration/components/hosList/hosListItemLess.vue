<template>
  <view class="item g-flex-rc-cc">
    <view class="hos-avatar">
      <image @click="imgClick" :src="item.hosPhoto" />
    </view>

    <view class="content" @click="itemClick">
      <view class="row flex-normal">
        <view
          :class="{
            'color-888': disabled,
          }"
          class="hos-name mb12"
        >
          {{ item.aliasName }}
        </view>

        <view
          :class="{
            'color-888': disabled,
          }"
          class="hos-address"
        >
          {{ item.address && item.address.replace(/\s+/g, '') }}
        </view>
      </view>

      <view v-if="disabled" class="hos-location f26 color-888">暂未开通</view>
      <view v-else>
        <view class="hos-location">
          <view @click.stop="locationClick" class="g-flex-rc-cc">
            <view class="icon-font icon-location ico_location2" />
            <view>地图导航</view>
          </view>

          <view v-if="item.distanceFormat" class="hos-away g-flex-rc-cc">
            距离{{ item.distanceFormat }}km
          </view>
          <view v-else class="hos-away g-flex-rc-cc">导航</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { IHosInfo } from '@/utils';

  const props = defineProps<{
    item: IHosInfo;
    disabled?: boolean;
  }>();

  const emits = defineEmits(['img-click', 'location-click', 'item-click']);

  const itemClick = () => {
    emits('item-click', props.item);
  };

  const locationClick = () => {
    emits('location-click', props.item);
  };

  const imgClick = () => {
    emits('img-click', props.item);
  };
</script>

<style lang="scss" scoped>
  .item {
    background: #ffffff;
    border: 2rpx solid #f3f3f3;
    border-radius: 16rpx;
    padding: 32rpx;

    .hos-avatar {
      width: 200rpx;
      height: 200rpx;
      margin-right: 32rpx;
      position: relative;

      image {
        width: 100%;
        height: 100%;
        border-radius: 12rpx;
      }
    }

    .content {
      flex: 1;
      min-height: 200rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .row {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        text-align: left;
      }
      .hos-name {
        font-size: var(--hr-font-size-xl);
        font-weight: 600;
        color: var(--hr-neutral-color-10);
        position: relative;
        top: 8rpx;
        text-align: left;
      }

      .hos-address {
        font-size: var(--hr-font-size-xs);
        color: var(--hr-neutral-color-9);
        margin: 16rpx 0 30rpx 0;
      }

      .hos-location {
        display: flex;
        color: var(--hr-neutral-color-10);

        justify-content: space-between;
        font-size: var(--hr-font-size-xxxs);
        position: relative;
        top: -8rpx;

        .icon-location {
          color: var(--hr-brand-color-6);
          margin-right: 6rpx;
          position: relative;
          top: -2rpx;
        }

        .hos-away {
          background-color: var(--hr-neutral-color-1);
          border-radius: 8rpx;
          padding: 4rpx 16rpx;
          color: var(--hr-neutral-color-8);
        }
      }
    }
  }
</style>
