<template>
  <view class="clinic-pay-list">
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
            class="g-bold f36 flex1 mr40 flex-normal"
          >
            <text>{{ item.drugTypeName }}</text>
          </view>

          <view class="g-flex-rc-cc">
            <view
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
            </view>
            <view v-else class="iconfont color-888 f48">&#xe66b;</view>
          </view>
        </view>

        <view class="item-box f28">
          <view class="row flex-normal">
            <view class="row-label color-888">就诊时间</view>
            <view class="row-value g-break-word color-444">
              {{ item.prescTime }}
            </view>
          </view>
        </view>

        <view v-if="item.deptName" class="item-box f28">
          <view class="row flex-normal">
            <view class="row-label color-888">开单科室</view>
            <view class="row-value g-break-word color-444 flex-normal">
              <view class="text-ellipsis">{{ item.deptName }}</view>
              <view v-if="item.clinicType">
                ({{ item.clinicType == '1' ? '线下就诊' : '网络问诊' }})
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { type IWaitListItem } from '../utils/medicalHelp';

  const props = withDefaults(
    defineProps<{
      list: IWaitListItem[];
      selUnPayList?: IWaitListItem[];
      isListShowClinicType?: boolean;
      isCheck?: boolean;
      showStatus?: boolean;
    }>(),
    {
      selUnPayList: () => [],
    }
  );
  const emits = defineEmits(['sel-item', 'click-item']);

  const selIds = computed(() => props.selUnPayList.map((o) => o._id));

  const statusLabel = {
    '0': {
      label: '窗口待取药',
      color: 'var(--hr-brand-color-6)',
    },
    '1': {
      label: '窗口待取药',
      color: 'var(--hr-brand-color-6)',
    },
    '2': {
      label: '待发货',
      color: 'var(--hr-brand-color-6)',
    },
    '4': {
      label: '窗口已取药',
      color: 'var(--hr-neutral-color-7)',
    },
  };

  const getIsActive = (item: IWaitListItem) => {
    return selIds.value.includes(item._id);
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
</style>
