<template>
  <g-login
    :disabled="disabled"
    :patient="patient"
    @handler-next="regClick(item)"
  >
    <view @click="regClick(item)" class="scheme-item">
      <view class="flex-between">
        <view class="flex">
          <view
            v-if="pageConfig.isShowClinicalType === '1'"
            class="flex flex-wrap f24 mb4"
          >
            <view
              v-if="['3', '4', '6'].includes(item.clinicalType!)"
              class="tag tag-dark mr12"
            >
              网络就诊
            </view>
            <view v-else class="tag tag-light mr12">到院就诊</view>

            <view
              v-if="['2', '6'].includes(item.clinicalType!)"
              class="tag tag-brown mr12"
            >
              <text v-if="item.clinicalType === '2'">膏方</text>
              <text v-if="item.clinicalType === '6'">专病</text>
            </view>
          </view>
          <view class="scheme-item-ampm-name">
            <view class="mr16 g-bold text-no-wrap">{{ item.ampmName }}</view>
            <view v-if="item.fee" class="ampm-fee f28 mr16 g-bold">
              {{ item.fee }}元
            </view>
          </view>
        </view>

        <view
          :class="{
            'btn-btns': isExistOrderWait,
          }"
          class="scheme-item-detail"
        >
          <!-- <button
            v-if="item.schState in warnSchStateMap"
            class="btn btn-primary btn-reg disabled-btn"
          >
            {{ warnSchStateMap[item.schState] }}
          </button> -->

          <button
            v-if="!outHosSch || (outHosSch && pageConfig.handlerOutHosSchClick)"
            :class="{
              'btn-old': systemModeOld,
              'disabled-btn': item.schState in warnSchStateMap,
            }"
            class="btn btn-primary btn-reg"
          >
            {{
              warnSchStateMap[item.schState] ||
              pageConfig.orderRegBtnLabel ||
              '挂号'
            }}
          </button>

          <button
            v-if="isExistOrderWait"
            :class="{
              'btn-old': systemModeOld,
            }"
            class="btn btn-primary btn-reg"
          >
            候补
          </button>
        </view>
      </view>

      <view class="f24 color-666 flex-between">
        <view class="flex">
          <view v-if="pageConfig.orderMode === '1'" class="text-ellipsis mr12">
            {{ item.categorName }}
          </view>

          <view v-else class="text-ellipsis mr12">
            <text v-if="item.schQukCategor">{{ item.schQukCategor }}</text>
            <text v-else>
              <text>{{ item.deptName }}</text>
              <text v-if="item.categorName">/{{ item.categorName }}</text>
            </text>
          </view>
        </view>

        <block
          v-if="
            pageConfig.isHideNumberSourceTotalRemain !== '1' &&
            item.schState !== '1' &&
            item.schState !== '2'
          "
        >
          <view class="color-888 text-no-wrap text-center">
            <text
              v-if="item.numCount && pageConfig.isHideNumCount !== '1'"
              class="mr4 text-no-wrap"
            >
              总{{ item.numCount }}个
            </text>
            <text v-if="item.numRemain" class="text-no-wrap">
              余{{ item.numRemain }}个
            </text>
          </view>
        </block>
      </view>
    </view>
  </g-login>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { TSchInfo } from '../../utils/index';

  import { type ISystemConfig } from '@/utils';
  import dayjs from 'dayjs';

  const props = defineProps<{
    item: TSchInfo;
    systemModeOld?: boolean;
    pageConfig: ISystemConfig['order'];
    outHosSch?: boolean;
    disabled?: boolean;
    patient?: boolean;
  }>();

  const emits = defineEmits(['reg-click', 'wait-reg-click', 'avatar-click']);
  const isExistOrderWait = computed(() => {
    const { pageConfig, item } = props;

    if (
      dayjs(props.item.schDate).format('YYYY-MM-DD') ===
      dayjs().format('YYYY-MM-DD')
    ) {
      return false;
    }

    return (
      (!item.clinicalType || item.clinicalType === '1') &&
      item.schState === '2' &&
      pageConfig.isOpenOrderWaiting === '1'
    );
  });

  const regClick = (scheme: TSchInfo) => {
    if (isExistOrderWait.value) {
      // 候补预约
      emits('wait-reg-click', {
        scheme,
      });
      return;
    } else if (scheme.schState in warnSchStateMap) {
      return;
    }

    emits('reg-click', {
      scheme,
    });
  };
  const warnSchStateMap = {
    1: '停诊',
    2: '约满',
    3: '未放号',
  };
</script>

<style lang="scss" scoped>
  .scheme-item {
    background-color: var(--hr-brand-color-1);
    border-radius: 8rpx;
    padding: 18rpx 24rpx;

    .scheme-item-ampm-name {
      font-size: var(--hr-font-size-xs);
      display: flex;
      align-items: center;
    }

    .scheme-item-detail {
      display: flex;
      align-items: center;

      .btn-reg {
        font-size: var(--hr-font-size-xxs);
        height: 48rpx;
        border-radius: 28rpx;
        display: flex;
        align-items: center;
        padding: 0 24rpx;

        &.btn-old {
          padding: 30rpx;
        }
      }

      &.btn-btns .btn-reg {
        $r: 8rpx;
        padding: 0 16rpx;

        &:first-child {
          border-radius: $r 0 0 $r;
        }

        &:last-child {
          border-radius: 0 $r $r 0;
        }
      }
    }

    &:not(:last-child) {
      margin-bottom: 8rpx;
    }
  }

  .ampm-fee {
    color: var(--hr-error-color-6);
  }

  .sch-label {
    width: 230rpx;
    display: -webkit-box;
  }

  .disabled-btn {
    background-color: var(--hr-neutral-color-4);
  }

  .tag {
    border-radius: 2px;
    text-align: center;
    padding: 0 8rpx;

    &.tag-dark {
      background-color: #5f494a;
      color: #ffe2c1;
    }

    &.tag-brown {
      background: linear-gradient(270deg, #d26900, #ac4b1c);
      color: #fff;
    }

    &.tag-light {
      background-color: #ffe2c1;
      color: #5f494a;
    }
  }
</style>
