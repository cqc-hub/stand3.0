<template>
  <view style="margin: 16rpx 0">
    <scroll-view class="list hidden-scrollbar" scroll-x>
      <view class="flex-normal flex1">
        <view
          v-for="(item, idx) in guidetList"
          :key="item.visitNo"
          @click="itemClick(item, idx)"
          class="item g-border text-no-wrap color-444 f28"
          :class="{
            active: item.visitNo === tabsData.tabValue,
          }"
        >
          <view class="g-bold f36 LH18">{{ item.deptName }}</view>
          <view class="color-888 f28 LH18">{{ item.disposeTime }}</view>
        </view>

        <view class="safe-width">2</view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
  import { GuideContent,HosGuideSheet } from '../types';


  const props = defineProps<{
    tabsData: GuideContent,
    guidetList:HosGuideSheet[]
  }>();

  const emits = defineEmits(['update:tabsData','item-click']);
  const itemClick = (item, idx) => {
     emits("item-click", { item, idx });
     emits("update:tabsData", {... props.tabsData,tabValue:item.visitNo,disposeTime:item.disposeTime});
  };
</script>

<style lang="scss" scoped>
  .list {
    display: flex;
    // margin: 0 32rpx;
    overflow-y: scroll;
    width: 100vw;

    .item {
      padding: 10rpx 40rpx;
      padding-bottom: 9rpx;
      margin-bottom: 1rpx;

      border-radius: 8px;
      margin-right: 16rpx;
      min-width: 320rpx;
      max-width: 420rpx;
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 

      .LH18 {
        line-height: 1.8;
        max-width: 380rpx;
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis; 
      }
      .label {
        text-align: left;
        color: rgba(0, 0, 0, 0);
        line-height: 1.8;
      }

      &:first-child {
        margin-left: 32rpx;
      }

      &.active {
        border-color: $hr-brand-color-6 !important;
        color: $hr-brand-color-6 !important;
        background-color: $hr-brand-color-3-light !important;
      }
    }
  }

  .safe-width {
    width: 400rpx;
    // height: 1px;
    overflow-y: scroll;
    display: inline-block;
    opacity: 0;
  }
</style>
