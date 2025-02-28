<template>
  <view class="dept-scheduling-container">
    <view class="msg-container">
      <view class="msg mb8 f28 pl32">
        <text>{{ props.msg }}</text>
      </view>
    </view>
    <view class="dept-card-item mt40 flex-normal">
      <view class="dept-header">
        <view
          class="text-ellipsis flex-normal  dept-line"
          @click="gotoDept(item)"
          v-for="(item, index) in props.list"
          :key="index"
        >
          <view class="title text-ellipsis">
            <text class="deptName">{{ item.deptName }}</text>
            <text class="hosName">({{ item.hosName }})</text>
          </view>
          <view class="button">去挂号</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import { ref, computed, getCurrentInstance, onMounted } from 'vue';
  const props = defineProps<{
    list: any[];
    msg: string;
  }>();

  onMounted(() => {
    console.log('DoctorCard mounted', props);
  });

  import { joinQueryForUrl } from '@/common';

  const gotoDept = (item) => {
    const { hosId, hosDeptId, deptName } = item;
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/order', {
        hosId,
        hosDeptId,
        deptName,
      }),
    });
  };
</script>
<style lang="scss" scoped>
  .dept-scheduling-container {
    width: 100vw;
    transition: 0.5s;
    .msg-container {
      display: flex;
      justify-content: space-between;
      width: 100vw;
      .msg {
        // width: 95vw;

        color: $hr-neutral-color-9;
        width: fit-content;
      }
      .more {
        color: $hr-brand-color-6;
        width: fit-content;
      }
    }

    .dept-card-item {
      //   letter-spacing: 1rpx;
      width: 85vw;
      overflow: hidden;
      margin: auto;
      background: #e8f4ff;
      border-radius: 0px 24rpx 24rpx 24rpx;
      padding: 20rpx 24rpx;
      .title {
        flex: 1 1 auto;
        .hosName {
          color: #000;
        }
        .deptName {
          color: #296fff;
        }
      }
      .button {
        flex: 0 0 auto;
        padding: 8rpx 16rpx;
        color: #fff;
        background-color: #296fff;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 28rpx;
      }
    }
  }
  .isCollaps {
    height: 80rpx;
    overflow: hidden;
  }
  .dept-line{
    background-color: #fff;
    padding:16rpx 32rpx;
    border-radius: 36rpx;
    margin:24rpx 0;
  }
</style>
