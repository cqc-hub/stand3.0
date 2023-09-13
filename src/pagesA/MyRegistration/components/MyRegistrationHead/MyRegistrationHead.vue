<template>
  <view class="flex-normal header g-border-bottom f32">
    <view
      :class="{
        'sel-active': isSelStatus,
      }"
      class="flex-normal"
      @click="changeSelStatus"
    >
      <view>{{ selStatusName }}</view>
      <view class="iconfont">&#xe6e8;</view>
    </view>

    <view
      v-if="!isShowFilterOrderStatus"
      :class="{
        'sel-active': isSelPatient,
      }"
      @click="changeSelPatient"
      class="flex-normal"
    >
      <view>{{ selPatName }}</view>
      <view class="iconfont">&#xe6e8;</view>
    </view>

    <view
      v-if="isShowFilterOrderStatus"
      :class="{
        'sel-active': isSelOrderStatus,
      }"
      @click="changeSelOrderStatus"
      class="flex-normal"
    >
      <view>{{ selOrderStatusName }}</view>
      <view class="iconfont">&#xe6e8;</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    isShowFilterOrderStatus: boolean;
    isSelStatus: boolean;
    selStatusName: string;
    isSelPatient: boolean;
    selPatName: string;
    isSelOrderStatus: boolean;
    selOrderStatusName: string;
  }>();

  const emits = defineEmits([
    'update:isSelStatus',
    'update:isSelPatient',
    'update:isSelOrderStatus',
  ]);

  const changeSelStatus = () => {
    emits('update:isSelStatus', !props.isSelStatus);
  };

  const changeSelPatient = () => {
    emits('update:isSelPatient', !props.isSelPatient);
  };

  const changeSelOrderStatus = () => {
    emits('update:isSelOrderStatus', !props.isSelOrderStatus);
  };
</script>

<style lang="scss" scoped>
  .header {
    background-color: #fff;
    > view {
      flex: 1;
      justify-content: center;
      padding: 24rpx 0;
    }

    .sel-active {
      font-weight: 600;
      color: var(--hr-brand-color-6);
      .iconfont {
        transform: rotate(0.5turn);
        // color: var(--hr-neutral-color-9);
      }
    }
  }
</style>
