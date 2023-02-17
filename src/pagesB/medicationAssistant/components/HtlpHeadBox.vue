<template>
  <view
    :class="{
      'system-mode-old': systemModeOld,
    }"
    class="item g-border"
  >
    <view class="item-title g-flex-rc-cc">
      <text class="f36 g-bold">{{ getShowDrugName(item) }}</text>
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

    <view class="item-content f28 mt32">
      <block v-for="_item in renderList" :key="_item.key">
        <view v-if="renderRow[_item.key]" class="row flex-normal mb12">
          <view class="label text-no-wrap color-888">{{ _item.label }}</view>

          <view v-if="_item.key === 'masterDocName'" class="value">
            <text class="g-split-line mr12 pr12">
              {{ renderRow[_item.key] }}
            </text>
            <text>{{ item.deptName }}</text>
          </view>

          <view v-else class="value">{{ renderRow[_item.key] }}</view>
        </view>
      </block>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import {
    type IWaitListItem,
    type IItemDetail,
    getShowDrugName,
  } from '../utils/medicalHelp';

  const props = defineProps<{
    item: IWaitListItem;
    detailData: IItemDetail;
    systemModeOld?: boolean;
  }>();

  const renderRow = computed(() => {
    const _hosName =
      props.item.hosName +
      `(${props.item.clinicType == '1' ? '线下就诊' : '网络问诊'})`;
    const data = props.detailData;

    return {
      ...data,
      _hosName,
      patientName: data.patientName + (data.patientId && `${data.patientId}`),
    };
  });

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

  const renderList = [
    {
      label: '患者姓名',
      key: 'patientName',
    },
    {
      label: '就诊医院',
      key: '_hosName',
    },
    {
      label: '开单医生',
      key: 'masterDocName',
    },
    {
      label: '开单时间',
      key: 'prescTime',
    },
    {
      label: '处方号',
      key: 'prescNo',
    },
  ];
</script>

<style lang="scss" scoped>
  .item {
    padding: 40rpx 32rpx;
    background: linear-gradient(180deg, #ffffff 0%, #e9f0ff 100%);
    border-radius: 8px 8px 0px 0px;

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

    .item-content {
      .row {
        .label {
          width: 140rpx;
        }
      }
    }
  }

  .system-mode-old {
    .item-content {
      .row {
        .label {
          width: 170rpx;
        }
      }
    }
  }
</style>
