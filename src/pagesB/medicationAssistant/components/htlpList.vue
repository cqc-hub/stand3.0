<template>
  <view
    :class="{
      'system-mode-old': systemModeOld,
    }"
    class="clinic-pay-list"
  >
    <!-- @click="itemClick(item)" -->
    <view
      v-for="(item, idx) in list"
      :key="idx"
      :class="{
        active: getIsActive(item),
      }"
      @click="itemClick(item)"
      class="item flex-normal mb16 g-border"
    >
      <view v-if="isCheck" class="icon-content">
        <view @click.stop="selItem(item)" class="iconfont check-box-icon">
          {{ getIsActive(item) ? '&#xe6d0;' : '&#xe6ce;' }}
        </view>

        <view class="icon-mask" @click.stop="selItem(item)" />
      </view>

      <view class="content">
        <view class="flex-between flex-start-r">
          <view
            @click.stop="selItem(item)"
            class="g-bold f36 flex1 mr40 flex-normal item-title text-no-wrap"
          >
            <text>{{ getShowDrugName(item) }}</text>
            <text
              v-if="item.visitType && visitTypeLabel[item.visitType]"
              :class="{
                [visitTypeLabel[item.visitType].class]: true,
              }"
              class="f24 item-title-type"
            >
              {{ visitTypeLabel[item.visitType].label }}
            </text>
          </view>

          <view @click.stop="arrowClick(item)" class="g-flex-rc-cc arrow flex1">
            <!-- <view
              v-if="
                showStatus &&
                item.takenDrugType &&
                item.takenDrugType in statusLabel
              "
              :style="{
                color: statusLabel[item.takenDrugType].color,
              }"
              class="f32 g-bold"
            >
              {{ statusLabel[item.takenDrugType].label }}
            </view> -->
            <view v-if="!showStatus" class="iconfont color-888 f48">
              &#xe66b;
            </view>
          </view>
        </view>

        <view class="item-box f28">
          <view class="row flex-normal">
            <view class="row-label color-888">就诊时间</view>
            <view class="flex1 g-break-word color-444">
              {{ item.prescTime }}
            </view>
          </view>
        </view>

        <view v-if="item.deptName" class="item-box f28">
          <view class="row flex-normal">
            <view class="row-label color-888">开单科室</view>
            <view class="flex1 g-break-word color-444 flex-normal">
              <view class="text-ellipsis">{{ item.deptName }}</view>
              <view v-if="item.clinicType">
                ({{ item.clinicType == '1' ? '线下就诊' : '网络问诊' }})
              </view>
            </view>
          </view>
        </view>

        <view v-if="item.takenDrugType && !showStatus" class="item-box f28">
          <view class="row flex-normal">
            <view class="row-label color-888">取药状态</view>
            <view class="flex1 g-break-word color-444">
              {{
                statusLabel[item.takenDrugType] &&
                statusLabel[item.takenDrugType].label
              }}
            </view>
          </view>
        </view>

        <view
          v-if="item.expressNo && item.expressCompany"
          class="express flex-between"
          @click.stop="goExpress(item)"
        >
          <view class="flex-normal express-row">
            <text class="iconfont arrow-icon press-icon">&#xe6fd;</text>
            <text class="g-bold m10 express-date mr8">
              {{ getExpressTime(item.acceptTime) }}
            </text>
            <text class="express-color text-ellipsis">
              {{ item.expressParam || '' }}
            </text>
          </view>

          <text class="iconfont arrow-icon">&#xe66b;</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { type IWaitListItem, getShowDrugName } from '../utils/medicalHelp';

  const props = withDefaults(
    defineProps<{
      list: IWaitListItem[];
      selUnPayList?: IWaitListItem[];
      isListShowClinicType?: boolean;
      isCheck?: boolean;
      showStatus?: boolean;
      systemModeOld?: boolean;
    }>(),
    {
      selUnPayList: () => [],
    }
  );
  const emits = defineEmits([
    'sel-item',
    'click-item',
    'arrow-item',
    'express-click',
  ]);
  const visitTypeLabel = {
    1: {
      label: '门诊处方',
      class: 'blue',
    },
    2: {
      label: '出院带药',
      class: 'purple',
    },
  };

  const selIds = computed(() => props.selUnPayList.map((o) => o._id));

  const statusLabel = {
    '0': {
      label: '待选择配送方式',
      color: 'var(--hr-brand-color-6)',
    },
    '1': {
      label: '窗口取药',
      color: 'var(--hr-brand-color-6)',
    },
    '2': {
      label: '已填写配送信息待快递员取药',
      color: 'var(--hr-brand-color-6)',
    },
    '4': {
      label: '窗口已取药',
      color: 'var(--hr-neutral-color-7)',
    },
    '20': {
      label: '快递已发货',
      color: 'var(--hr-neutral-color-7)',
    },
  };

  const getExpressTime = (time: string) => {
    if (time) {
      return time.slice(5, 10);
    }

    return '';
  };

  const getIsActive = (item: IWaitListItem) => {
    return selIds.value.includes(item._id);
  };

  const goExpress = (item: IWaitListItem) => {
    emits('express-click', item);
  };

  const isPaySelfItem = (item: IWaitListItem) => {
    // return item.costTypeCode === '1';
    return false;
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

  const arrowClick = (item) => {
    emits('arrow-item', item);
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

        .item-title {
          align-items: flex-end;

          .item-title-type {
            font-weight: 400;
            border-radius: 4px;
            padding: 0 8rpx;
            margin-left: 8rpx;

            &.blue {
              background-color: var(--hr-brand-color-1);
              color: var(--hr-brand-color-6);
            }

            &.purple {
              background-color: #f1ecff;
              color: #7747ff;
            }
          }
        }

        .type-block {
          font-weight: normal;
          border-radius: 4rpx;
          padding: 4rpx 12rpx;

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

          .flex1 {
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

  .arrow {
    justify-content: flex-end;
  }

  .system-mode-old {
    .item {
      .content {
        .row {
          .row-label {
            width: 150rpx;
          }
        }
      }
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
</style>
