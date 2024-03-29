<template>
  <view
    :class="{
      'system-mode-old': systemModeOld,
    }"
    class="clinic-pay-list"
  >
    <view
      v-for="(item, idx) in list"
      :key="idx"
      :class="{
        active: getIsActive(item),
      }"
      @click="itemClick(item)"
      class="item flex-normal mb16"
    >
      <view v-if="isCheck" class="icon-content">
        <view @click.stop="selItem(item)" class="iconfont check-box-icon">
          {{ getIsActive(item) ? '&#xe6d0;' : '&#xe6ce;' }}
        </view>

        <view class="icon-mask" @click.stop="selItem(item)" />
      </view>

      <view class="content">
        <view class="flex-between flex-start-r">
          <view @click.stop="selItem(item)" class="g-bold f36 flex1 mr40">
            <text
              v-if="item.costTypeCode && !getIsMedicalTradeTypeDefault()"
              :class="{
                'pay-self': isPaySelfItem(item),
                'pay-medical': !isPaySelfItem(item),
              }"
              class="type-block f24 mr8 text-no-wrap"
            >
              {{ tradeType[item.costTypeCode] || '未知' }}
            </text>
            <text>
              {{ item.deptName }}
            </text>
          </view>

          <view class="g-flex-rc-cc">
            <view
              v-if="isCheck && item.totalCost && !isHidePrice"
              class="color-error g-bold f36"
            >
              {{ item.totalCost }}元
            </view>
            <view class="iconfont color-888 f48">&#xe66b;</view>
          </view>
        </view>

        <view class="item-box f28">
          <view class="row flex-normal">
            <view class="row-label color-888">
              {{
                $global.SYS_CODE === '1001056' && !isCheck
                  ? '支付时间'
                  : '就诊时间'
              }}
            </view>
            <view class="row-value g-break-word color-444">
              {{ item.visitDate }}
            </view>
          </view>

          <view class="row flex-normal">
            <view class="row-label color-888 text-no-wrap">就诊医生</view>
            <view class="row-value g-break-word color-444 text-ellipsis">
              <text
                v-if="item.clinicTypeName || item.docName"
                class="g-split-line mr12 pr12"
              >
                {{ (item.clinicTypeName && `(${item.clinicTypeName})`) || '' }}
                {{ item.docName }}
              </text>
              <text>
                {{ item.hosName }}
              </text>
            </view>
          </view>

          <view v-if="item.diseaseTypeName" class="row flex-normal">
            <view class="row-label color-888">病种</view>
            <view class="row-value g-break-word color-444">
              {{ item.diseaseTypeName }}
            </view>
          </view>

          <view v-if="!isCheck && item.totalCost" class="row flex-normal">
            <view class="row-label color-888">费用金额</view>
            <view class="row-value g-break-word color-444">
              {{ item.totalCost }}元
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import {
    type IPayListItem,
    tradeType,
    getIsMedicalTradeTypeDefault,
  } from '../utils/clinicPayDetail';

  const props = withDefaults(
    defineProps<{
      list: IPayListItem[];
      selUnPayList: IPayListItem[];
      isListShowClinicType?: boolean;
      isCheck?: boolean;
      isHidePrice?: boolean;
      systemModeOld?: boolean;
    }>(),
    {
      selUnPayList: () => [],
    }
  );
  const emits = defineEmits(['sel-item', 'click-item']);

  const selIds = computed(() => props.selUnPayList.map((o) => o.childOrder));

  const getIsActive = (item: IPayListItem) => {
    return selIds.value.includes(item.childOrder);
  };

  const isPaySelfItem = (item: IPayListItem) => {
    return item.costTypeCode === '1';
  };

  const selItem = (item) => {
    if (props.isCheck) {
      emits('sel-item', item);
    } else {
      itemClick(item);
    }
  };

  const itemClick = (item) => {
    emits('click-item', item);
  };
</script>

<style lang="scss" scoped>
  .clinic-pay-list {
    .item {
      background: #ffffff;
      border-radius: 8px;
      padding: 32rpx;
      align-items: flex-start;
      position: relative;
      border: 2rpx solid var(--hr-neutral-color-2);

      &:first-child {
        margin-top: 24rpx;
      }

      .icon-content {
        height: 100%;
        padding-top: 4rpx;

        .icon-mask {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120rpx;
          left: -32rpx;
        }
      }

      .check-box-icon {
        font-size: var(--hr-font-size-xxl);
        line-height: var(--hr-font-size-base);
        position: relative;
        top: 7rpx;
        margin-right: 22rpx;
        color: var(--hr-neutral-color-7);
      }

      .content {
        flex: 1;

        .type-block {
          font-weight: normal;
          border-radius: 4rpx;
          padding: 4rpx 12rpx;
          position: relative;
          top: -5rpx;
          &.pay-medical {
            background: #747c94;
            color: #ffe2c1;
          }

          &.pay-self {
            background: #ffe2c1;
            color: #51555e;
          }
        }

        .item-box {
          margin-top: 24rpx;
        }

        .row {
          margin-bottom: 8rpx;
          .row-label {
            width: 130rpx;
          }

          .row-value {
            flex: 1;
          }
        }
      }

      &.active {
        border-color: var(--hr-brand-color-6);
        .check-box-icon {
          color: var(--hr-brand-color-6);
        }
      }
    }
  }

  .system-mode-old {
    .item {
      .content {
        .row {
          .row-label {
            width: 160rpx;
          }
        }
      }
    }
  }
</style>
