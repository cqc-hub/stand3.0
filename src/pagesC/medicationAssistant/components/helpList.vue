<template>
  <view class="">
    <view v-for="(item, i) in list" :key="i" class="item mt16">
      <view class="f32 g-bold">
        <text>{{ item.drugTypeName }}</text>
      </view>

      <view class="row f28 flex-normal mt24">
        <view class="label color-888">开单科室</view>
        <view class="row-content flex1 color-444 text-ellipsis">
          <view class="text-ellipsis">{{ item.deptName }}</view>
          <view v-if="item.clinicType">
            ({{ item.clinicType == '1' ? '线下就诊' : '网络问诊' }})
          </view>
        </view>
      </view>

      <view class="row f28 flex-normal">
        <view class="label color-888">开单时间</view>
        <view class="row-content flex1 color-444 text-ellipsis">
          {{ item.prescTime }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  defineProps<{
    list: any[];
  }>();
</script>

<style lang="scss" scoped>
  .item {
    padding: 24rpx 32rpx;
    border-radius: 8rpx;
    background: var(--hr-neutral-color-1);

    .label {
      margin-right: 18rpx;
    }
  }
</style>
