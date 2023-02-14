<template>
  <view class="item f32">
    <view class="g-bold f36 mb24">Rp</view>

    <view v-if="isChineseMedical(item)">
      <view class="g-bold g-break-word f28 mb16">
        <text v-if="detailData.num" class="mr12">{{ detailData.num }}剂,</text>
        <text v-if="detailData.amount" class="mr12">
          {{ detailData.amount }}贴,
        </text>
        <text v-if="detailData.frequency" class="mr12">
          {{ detailData.frequency }},
        </text>
        <text v-if="detailData.use">{{ detailData.use }}</text>
      </view>

      <view v-if="detailData.drugDetailList" class="medical-content">
        <view
          v-for="(citem, ci) in detailData.drugDetailList"
          :key="ci"
          class="medical-item f28 color-444"
        >
          <text class="mr8">{{ citem.drugName }}</text>
          <text class="color-888">{{ citem.amount }}{{ citem.units }}</text>
        </view>
      </view>
    </view>

    <view v-else>
      <view v-if="detailData.drugDetailList" class="medical-content1">
        <view
          v-for="(citem, ci) in detailData.drugDetailList"
          :key="ci"
          :class="{
            'g-border-bottom': ci !== detailData.drugDetailList.length - 1,
          }"
          class="medical-item1 f28 color-444 p24v"
        >
          <view class="flex-between mb8">
            <view class="g-bold">{{ citem.drugName }}</view>
            <view class="f28 color-888">
              x{{ citem.amount }}{{ citem.units }}
            </view>
          </view>

          <view class="color-888 f28">
            <text class="g-split-line mr12 pr12">
              {{ citem.itemSpec }}/{{ citem.units }}
            </text>
            <text>{{ citem.use }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import {
    type IItemDetail,
    type IWaitListItem,
    isChineseMedical,
  } from '../utils/medicalHelp';

  const props = defineProps<{
    detailData: IItemDetail;
    item: IWaitListItem;
  }>();
</script>

<style lang="scss" scoped>
  .item {
    padding: 40rpx 32rpx 24rpx;
    background-color: #fff;
    border-radius: 0px 0px 8px 8px;

    .medical-content {
      background: var(--hr-neutral-color-1);
      border-radius: 4px;
      padding: 16rpx 24rpx;

      display: grid;
      grid-template: auto / repeat(2, 1fr);

      .medical-item {
        padding: 12rpx;
      }
    }

    .medical-content1 {
    }
  }
</style>
