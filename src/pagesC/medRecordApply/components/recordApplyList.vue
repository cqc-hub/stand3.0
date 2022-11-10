<template>
  <view class="">
    <view
      v-for="item in list"
      :key="item.phsOrderNo"
      @click="itemClick(item)"
      class="item g-border"
    >
      <view class="title flex-between">
        <view class="text-ellipsis color-444 f28">
          <text>申请时间:</text>
          <text>{{ ` ${item._createTime}` }}</text>
        </view>
        <view
          :style="{
            color:
              applyOrderStatusMap[item.orderStatus].color ||
              'var(--hr-neutral-color-10)',
          }"
          class="item-status g-bold"
        >
          {{ applyOrderStatusMap[item.orderStatus].title }}
        </view>
      </view>

      <view v-if="item._outInfo" class="outinfo-box">
        <view
          v-for="(outinfo, i) in item._outInfo"
          class="outinfo-item mb16"
          :key="i"
        >
          <view class="flex-normal outinfo-item-r">
            <text class="iconfont f28 mr12">&#xe6f3;</text>

            <view>
              <text class="g-bold f32">
                {{ `${outinfo.admissionTime} 至 ${outinfo.outTime}` }}
              </text>
              <view class="f28 color-888">{{ outinfo.diagnosisC }}</view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="item.refundReason" class="row flex-normal">
        <view class="row-title">不通过原因</view>
        <view class="row-content text-ellipsis">{{ item.refundReason }}</view>
      </view>

      <view
        v-if="['12', '13'].includes(item.orderStatus) && item._expressDesc"
        class="express flex-between"
      >
        <view class="flex-normal express-row">
          <text class="iconfont arrow-icon press-icon">&#xe6fd;</text>
          <text class="g-bold m10 express-date">
            {{ item._expressTime || '' }}
          </text>
          <text class="express-color text-ellipsis">
            {{ item._expressDesc || '' }}
          </text>
        </view>

        <text class="iconfont arrow-icon">&#xe66b;</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { CaseCopyItem, applyOrderStatusMap } from '../utils/recordApply';
  import dayjs from 'dayjs';

  const props = defineProps<{
    list: CaseCopyItem[];
  }>();

  const emits = defineEmits(['item-click']);

  const itemClick = (item: CaseCopyItem) => {
    emits('item-click', item);
  };
</script>

<style lang="scss" scoped>
  .text-ellipsis {
    -webkit-line-clamp: 2;
  }

  .item {
    background-color: #fff;
    border-radius: 8px;
    padding: 40rpx 32rpx;
    margin-bottom: 16rpx;
    min-height: 100rpx;

    &:first-child {
      margin-top: 24rpx;
    }

    .title {
      margin-bottom: 24rpx;
      align-items: flex-start;

      .item-status {
        white-space: nowrap;
        margin-left: 66rpx;
      }
    }

    .row {
      display: flex;
      margin-top: 16rpx;

      font-size: var(--hr-font-size-xs);
      align-items: flex-start;

      .row-title {
        color: var(--hr-neutral-color-7);
        width: 150rpx;
        white-space: nowrap;
      }

      .row-content {
        word-break: break-all;
        text-align: left;
        flex: 1;
      }
    }

    .express {
      margin-top: 16rpx;
      background-color: var(--hr-neutral-color-1);
      border-radius: 4px;
      padding: 0 16rpx;
      padding-right: 5rpx;
      font-size: var(--hr-font-size-xs);
      vertical-align: middle;

      .express-date {
        white-space: nowrap;
      }

      .express-row {
        height: 100%;
      }

      .iconfont {
        font-size: var(--hr-font-size-xxl);
      }

      .arrow-icon {
        color: var(--hr-neutral-color-7);
      }

      .text-ellipsis {
        -webkit-line-clamp: 1;
      }

      .express-color {
        color: var(--hr-neutral-color-7);
      }
    }
  }

  .outinfo-box {
    background-color: var(--hr-neutral-color-1);
    border-radius: 4px;
    padding: 24rpx 32rpx;
    padding-bottom: 24rpx;

    .outinfo-item {
      .outinfo-item-r {
        align-items: flex-start;

        .iconfont {
          transform: translateY(5rpx);
          color: #43d5c0;
        }
      }
    }
  }

  .m10 {
    margin: 0 10rpx;
  }
</style>
