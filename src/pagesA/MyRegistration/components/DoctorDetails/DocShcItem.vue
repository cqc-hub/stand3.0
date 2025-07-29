<template>
  <g-login
    :disabled="disabled"
    :patient="patient"
    @handler-next="regClick(item)"
  >
    <view @click="regClick(item)" class="scheme-item items-start f28">
      <view class="flex-between items-start">
        <view class="">
          <text v-if="pageConfig.isShowClinicalType === '1'" class="f24 mb4">
            <text
              v-if="['3', '4', '6'].includes(item.clinicalType!)"
              class="g-tag tag-dark mr12"
            >
              网络就诊
            </text>
            <text v-else class="g-tag tag-light mr12">到院就诊</text>

            <text
              v-if="['2', '6'].includes(item.clinicalType!)"
              class="g-tag tag-brown mr12"
            >
              <text v-if="item.clinicalType === '2'">膏方</text>
              <text v-if="item.clinicalType === '6'">专病</text>
            </text>
          </text>

          <text v-if="item.specialClinicIndex" class="g-tag tag-danger mr12">
            {{ item.specialClinicIndex }}
          </text>
          <text v-if="item.SymptomIndicator" class="g-tag tag-light mr12">
            {{ item.SymptomIndicator }}
          </text>

          <text class="">
            <text class="mr16 g-bold text-no-wrap">{{ item.ampmName }}</text>
            <text v-if="item.fee" class="ampm-fee mr16 g-bold">
              {{ item.fee }}元
            </text>
            <text
              v-if="
                item.categorName && gStores.globalStore.sysCode === '1001067'
              "
              class="mr16"
            >
              {{ item.categorName }}
            </text>
          </text>
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

      <view class="f24 color-666 flex-between items-start">
        <view class="flex">
          <!-- text-ellipsis -->
          <view class="mr12">
            <text v-if="pageConfig.orderMode === '1'" class="mr12">
              {{ item.categorName }}
            </text>
            <text v-else-if="item.schQukCategor" class="mr12">
              {{ item.schQukCategor }}
            </text>
            <text v-else class="mr12">
              <text>{{ item.deptName }}</text>
              <text v-if="item.categorName">/{{ item.categorName }}</text>
            </text>

            <text v-if="item.visitingArea">{{ item.visitingArea }}</text>
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
            <text
              v-if="item.numRemain"
              :class="{
                mr12: !(item.numCount && pageConfig.isHideNumCount !== '1'),
              }"
              class="text-no-wrap"
            >
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

  import { type ISystemConfig, GStores } from '@/utils';
  import dayjs from 'dayjs';

  const props = defineProps<{
    item: TSchInfo;
    systemModeOld?: boolean;
    pageConfig: ISystemConfig['order'];
    gStores: GStores;
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
</style>
