<template>
  <view class="">
    <view v-if="list.length" class="hhh" />
    <view
      v-for="item in list"
      :key="item.id"
      @click="itemClick(item)"
      class="item animate__animated animate__fadeIn"
    >
      <view class="g-bold f32 text-ellipsis">{{ item.deptName }}</view>

      <image
        :src="$global.BASE_IMG + 'department-card-list-bg1.png'"
        mode="widthFix"
        class="bg-logo my-disabled"
      />
    </view>

    <view v-if="list.length" class="hhh" />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  defineProps<{
    list: any[];
  }>();
  const emits = defineEmits(['item-click']);

  const itemClick = (item) => {
    emits('item-click', item);
  };
</script>

<style lang="scss" scoped>
  .hhh {
    height: 24rpx;
    width: 2rpx;
  }
  .item {
    padding: 20rpx 32rpx;
    margin-bottom: 16rpx;

    background: #eff4ff;
    border: 1rpx solid #296fff;
    border-radius: 16rpx;

    min-height: 144rpx;
    position: relative;

    .bg-logo {
      position: absolute;
      width: 128rpx;
      right: 0;
      bottom: 0;
    }
  }
</style>
