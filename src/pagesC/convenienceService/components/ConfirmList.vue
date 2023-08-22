<template>
  <view class="g-con">
    <view v-for="(item, index) in list" :key="index" class="item">
      <view class="top mt24">
        <view class="top-box">
          <text class="title g-bolder f36 color-dark">{{ item.itemName }}</text>
          <text class="date g-bolder f36 color-dark">x{{ item.num }}</text>
        </view>
        <view v-if="item.itemName" class="c-box pb32">
          <view class="content">
            <view
              v-if="item.tips"
              class="main-text"
              :class="isMore[index] && !isShow[index] ? 'isMaxHeight' : ''"
            >
              <view class="remark color-888 f28 g-break-word">
                {{ item.tips }}
              </view>
              <view
                v-if="isMore[index]"
                class="more flex-end"
                @click="isShowBtn(index)"
              >
                <text v-if="!isShow[index]" class="iconfont color-888">
                  &#xe6c4;
                </text>
                <text v-else class="iconfont color-888">&#xe6c5;</text>
              </view>
            </view>
            <view class="fee mt8 f32 g-bold" v-if="item.fee">
              {{ (item.fee as any) * item.num }}元
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue';
  import { type IConfirmList } from '../utils/index';

  const props = defineProps<{
    list: IConfirmList[];
  }>();
  //获取节点的root
  const root = getCurrentInstance();
  const isShow = ref<boolean[]>([]);
  //是否展示更多的按钮
  const isMore = ref<boolean[]>([]);

  const isShowBtn = (index) => {
    isShow.value[index] = !isShow.value[index];
  };
  const getDetailHeight = () => {
    //获取元素节点的位置信息
    const query = uni.createSelectorQuery().in(root);
    query
      .selectAll('.remark')
      .boundingClientRect((res: any) => {
        res.map((e, i) => {
          if (e?.height > 48) {
            isMore.value[i] = true;
          } else {
            isMore.value[i] = false;
          }
        });
      })
      .exec();
  };
  getDetailHeight();
</script>

<style lang="scss" scoped>
  .top {
    background: var(--h-color-white);
    border: 1rpx solid var(--hr-neutral-color-2);
    border-radius: 16rpx;
    box-shadow: 0rpx -1rpx 0rpx 0rpx var(--hr-neutral-color-2) inset;
    .top-box {
      display: flex;
      justify-content: space-between;
      padding: 32rpx 32rpx 24rpx 32rpx;
      .date {
        text-align: right;
        min-width: 112rpx;
      }
    }
    .c-box {
      margin: 0 32rpx;
      border-bottom: 1rpx solid var(--hr-neutral-color-2);
      .content {
        border-left: 4rpx solid var(--theme-color);
        .fee {
          color: var(--hr-error-color-6);
        }
      }
    }
  }
  .isMaxHeight {
    max-height: 80rpx;
    overflow: hidden;
  }
  .main-text {
    position: relative;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 2;
    // overflow: hidden;
    .more {
      display: flex;
      padding-left: 16rpx;
      position: absolute;
      right: 0;
      bottom: 0;
      // width: 160rpx;
      // height: 48rpx;
      background: linear-gradient(
        270deg,
        #ffffff 90%,
        rgba(255, 255, 255, 0) 100%
      );

      text {
        color: $uni-color-primary;
        font-size: 26rpx;
        font-weight: 600;
        line-height: 36rpx;
      }

      .iconfont {
        color: $uni-color-primary;
        font-size: var(--hr-font-size-xl);
      }
    }
  }
</style>
