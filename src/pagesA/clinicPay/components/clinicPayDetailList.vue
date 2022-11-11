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
      <view
        v-if="isCheck"
        @click.stop="selItem(item)"
        class="iconfont check-box-icon"
      >
        {{ getIsActive(item) ? '&#xe6d0;' : '&#xe6ce;' }}
      </view>

      <view class="content">
        <view class="flex-between flex-start-r">
          <view @click.stop="selItem(item)" class="g-bold f36 flex1 mr40">
            {{ item.deptName }}
          </view>

          <view class="g-flex-rc-cc">
            <view v-if="isCheck" class="color-error g-bold f36">
              {{ item.totalCost }}元
            </view>
            <view class="iconfont color-888 f48">&#xe66b;</view>
          </view>
        </view>

        <view class="item-box f28">
          <view class="row flex-normal">
            <view class="row-label color-888">就诊时间</view>
            <view class="row-value g-break-word color-444">
              {{ item.visitDate }}
            </view>
          </view>

          <view class="row flex-normal">
            <view class="row-label color-888">就诊医院</view>
            <view class="row-value g-break-word color-444">
              {{ item.hosName }}
            </view>
          </view>

          <view v-if="isListShowClinicType" class="row flex-normal">
            <view class="row-label color-888">门诊类型</view>
            <view class="row-value g-break-word color-444">
              {{ item._clinicType }}
            </view>
          </view>

          <view class="row flex-normal">
            <view class="row-label color-888">就诊医生</view>
            <view class="row-value g-break-word color-444">
              {{ item.docName }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { type IPayListItem } from '../utils/clinicPayDetail';

  const props = defineProps<{
    list: IPayListItem[];
    isListShowClinicType?: boolean;
    isCheck?: boolean;
  }>();

  const emits = defineEmits(['sel-item', 'click-item']);

  const isActive = ref(false);
  const getIsActive = (item: IPayListItem) => {
    return isActive.value;
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

      &:first-child {
        margin-top: 24rpx;
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

        .item-box {
          margin-top: 24rpx;
        }

        .row {
          margin-bottom: 8rpx;
          .row-label {
            width: 130rpx;
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
