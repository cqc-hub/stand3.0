<template>
  <view class="dept-scheduling-container">
    <view class="msg-container">
      <view class="msg mb8 f28 pl32">
        <text>{{ props.msg }}</text>
      </view>
    </view>
    <view
      class="dept-card-item mt40"
      v-for="(item, index) in hosDeptList"
      :key="`dept-hos${item.hosId + index}`"
    >
      <view class="title-line g-flex-rc-cc">
        <view class="title ml16 text-ellipsis">
          <text>院区：</text>
          <text>{{ item.hosName }}</text>
        </view>
        <view v-if="item.distanceFormat" class="hos-away text-ellipsis">
          距离{{ item.distanceFormat }}km
        </view>
      </view>

      <view class="flex-normal">
        <view class="dept-header">
          <view
            class="text-ellipsis flex-normal dept-line"
            @click="gotoDept(deptItem)"
            v-for="(deptItem, deptIndex) in item.list"
            :key="deptIndex"
          >
            <view class="title text-ellipsis">
              <text class="deptName">{{ deptItem.deptName }}</text>
              <text class="hosName">({{ deptItem.hosName }})</text>
            </view>
            <view class="button">去挂号</view>
          </view>
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
    hosData: any[];
  }>();
  const hosDeptList = ref<any>([]);
  onMounted(() => {
    console.log('DoctorCard mounted', props);
    const showList = {};
    const hosList: any[] = [];
    props.list.forEach((item) => {
      if (showList[`${item.hosId}`]) {
        showList[`${item.hosId}`].push(item);
      } else {
        showList[`${item.hosId}`] = [item];
      }
    });
    Object.entries(showList).forEach(([k, v]: Array<any>, i: number) => {
      // let distanceFormat: any = Math.floor(Math.random() * 10);
      let distanceFormat: any = null;
      props.hosData.forEach((item, index) => {
        if (item.hosId == k) {
          distanceFormat = item.distanceFormat;
        }
      });
      hosList.push({
        hosId: k,
        list: v,
        hosName: v[0].hosName,
        distanceFormat,
      });
    });
    hosDeptList.value = hosList.sort(
      (a, b) =>
        (a?.distanceFormat || 99999999) - (b?.distanceFormat || 99999999)
    );
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
  .dept-line {
    background-color: #fff;
    padding: 16rpx 32rpx;
    border-radius: 36rpx;
    margin: 24rpx 0;
  }
  .dept-header {
    width: 100%;
  }

  .title-line {
    display: flex;
    justify-content: space-between;
    .title {
      flex: 1 1 auto;
      width: fit-content;
    }
    .hos-away {
      // background-color: var(--hr-neutral-color-1);
      border-radius: 8rpx;
      padding: 4rpx 16rpx;
      color: var(--hr-neutral-color-8);
      width: fit-content;
      min-width: 160rpx;
    }
  }
</style>
