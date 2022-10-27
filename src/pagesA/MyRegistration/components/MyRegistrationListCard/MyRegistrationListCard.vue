<template>
  <view class="card">
    <view
      v-for="(item, idx) in list"
      :key="idx"
      :class="{
        mt24: !idx,
      }"
      class="item mb16 g-border"
    >
      <view class="header pb18 g-border-bottom g-bold f36">
        <view class="text-ellipsis">
          {{ item.deptName }}
        </view>
        <view
          :style="{
            color: getStatusConfig(item.orderStatus).cardColr,
          }"
        >
          {{ getStatusConfig(item.orderStatus).title }}
        </view>
      </view>
      <view class="content">
        <view class="row f28">
          <view class="label color-888">就诊人</view>
          <view class="body">{{ item.patientName }}</view>
        </view>

        <view class="row f28">
          <view class="label color-888">时间</view>
          <view class="body">
            <text class="mr12">{{ item.appointmentDate }}</text>
            <text class="mr12">{{ item.ampmName }}</text>
            <text class="mr12">{{ item.appointmentTime }}</text>
            <text v-if="item.appointmentNumber">
              第
              <text class="color-blue">{{ item.appointmentNumber }}</text>
              号
            </text>
          </view>
        </view>

        <view class="row f28 mb10">
          <view class="label color-888">医生</view>
          <view class="body">
            <text class="pr12 mr12 doc-name">
              {{ item.docName }}
            </text>
            <text>{{ item.schQukCategor || item.categorName }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { IRegistrationCardItem } from '../../utils/MyRegistration';
  import { orderStatusMap, OrderStatus } from '../../utils/regDetail';

  const props = defineProps<{
    list: IRegistrationCardItem[];
  }>();

  const getStatusConfig = (status: OrderStatus) => {
    if (orderStatusMap[status]) {
      return orderStatusMap[status];
    } else {
      return {
        title: '未知的状态',
        cardColr: 'var(--hr-neutral-color-7)',
      };
    }
  };
</script>

<style lang="scss" scoped>
  .card {
    .item {
      background-color: #fff;
      padding: 20rpx 32rpx;
      border-radius: 8px;

      .header {
        display: grid;
        grid-template-columns: 1fr 120rpx;
        gap: 40rpx;
        margin-bottom: 16rpx;
      }

      .content {
        .row {
          display: flex;

          .label {
            width: 100rpx;
          }

          .body {
            flex: 1;
            word-break: break-all;

            .doc-name {
              position: relative;

              &::after {
                content: '';
                display: inline-block;
                width: 1rpx;
                height: 24rpx;
                background-color: var(--hr-neutral-color-2);
                right: 0;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }

          &:last-child {
            padding-bottom: 32rpx;
            border-bottom: 1rpx solid var(--hr-neutral-color-11);
          }
        }
      }
    }
  }
</style>
