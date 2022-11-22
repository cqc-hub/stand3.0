<template>
  <!-- 日费用清单 -->
  <view>
    <view class="progress" v-for="(item,index) in tabs " :key="index">
      <view class="right">
        <view class="date">{{item.date}}</view>
        <view class="detail-item">
          <view class="detail-item-dep">
            <text class="date">{{item.name}}</text>
            <text class="money">{{item.money}}元
              <text class="iconfont right">&#xe66b;</text>
            </text>
          </view>
          <view class="dep-name">产科病区</view>
        </view>
      </view>
      <text class='icon-font ico_time-circle-filled'></text>
      <view class="line"></view>
    </view>
  </view>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const tabs = ref([
  { name: '住院信息', typeId: 0, date: '2022-12-12', money: '20' },
  { name: '日费用清单', typeId: 1, date: '2022-12-12', money: '20' },
  { name: '总计清单', typeId: 2, date: '2022-12-12', money: '20' },
]);
</script>


<style scoped lang="scss">
// 步骤样式
.progress {
  position: relative;
  padding: 0 24rpx 0px 90rpx;
  .right {
    height: 100%;
    padding-top: 30rpx;
    .detail-item {
      margin-top: 16rpx;
      background: #ffffff;
      border: 1px solid #e6e6e6;
      border-radius: 16rpx;
      padding: 32rpx;
      display: flex;
      flex-direction: column;

      .detail-item-dep {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .dep-name {
        color: #888888;
        font-size: 28rpx;
        margin-top: 8rpx;
      }
      .date {
        font-size: 36rpx;
        font-weight: 600;
      }
      .money {
        font-size: 36rpx;
      }
      .iconfont {
        font-size: 48rpx;
        margin: auto 0;
      }
    }
  }
  .ico_time-circle-filled {
    color: #ddd;
    position: absolute;
    font-size: 24rpx;
    z-index: 999;
    top: 40rpx;
    left: 48rpx;
  }
  .line {
    position: absolute;
    border-right: 2px dotted #ddd;
    height: 100%;
    width: 1px;
    left: 59rpx;
    top: 50rpx;
    bottom: auto;
    // padding: 40rpx 0 0 0;
  }
}
.stepsCon:last-child {
  .line {
    height: 0%;
  }
}
</style>
