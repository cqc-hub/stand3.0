<template>
  <view class="">
    <view v-for="item in list" :key="item.visitId" class="item mb16">
      <view class="flex-between f32 g-bold mb16">
        <view class="flex-normal">
          <view class="mr12">{{ item.deptName }}</view>
          <view>{{ item.docName }}</view>
        </view>

        <view>
          <text
            :class="{
              'color-888': item.reportFlag === '1',
            }"
            class="color-blue"
          >
            {{ item.reportFlag === '0' ? '待取号' : '已取号' }}
          </text>
        </view>
      </view>

      <view class="color-444 f28 mb32">
        <text class="mr8">{{ item.visitDate }}</text>
        <text>{{ item.ampmName }}</text>
        <text class="mr8">{{ item.timeDesc }}</text>
        <text>第{{ item.queueNum }}号</text>
      </view>

      <view v-if="item.reportFlag === '0'">
        <view class="g-flex-rc-cc">
          <view
            :class="{
              'take-number-disabled': !item.signIn,
            }"
            class="take-number g-flex-rc-cc f36 g-bold"
          >
            {{ item.signIn ? '取号' : '不在取号范围' }}
          </view>
        </view>

        <view
          v-if="!item.signIn"
          @click="refrashData"
          class="g-flex-rc-cc color-blue f28 mt24"
        >
          <image
            :src="$global.BASE_IMG + 'stand3-refresh.png'"
            :class="{
              'rotate-icon': loading,
            }"
            class="refresh-icon"
          />
          <view>点击刷新定位</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { type TTakeNumberListItem } from '../utils/takeNumber';

  defineProps<{
    list: TTakeNumberListItem[];
    loading: boolean;
  }>();
  const emits = defineEmits(['refresh-data']);

  const refrashData = () => {
    emits('refresh-data');
  };
</script>

<style lang="scss" scoped>
  .item {
    background-color: #fff;
    padding: 32rpx;
    border: 1rpx solid var(--hr-neutral-color-2);
    border-radius: 8px;

    .take-number {
      width: 280rpx;
      height: 280rpx;
      background: var(--hr-brand-color-6);
      border-radius: 50%;
      color: #fff;

      &.take-number-disabled {
        color: var(--hr-neutral-color-5);
        background: #eeeeee;
      }
    }
  }

  .refresh-icon {
    width: 40rpx;
    height: 40rpx;

    &.rotate-icon {
      animation: rotateIcon 2s linear infinite forwards;
    }
  }

  @keyframes rotateIcon {
    from {
      -webkit-transform: rotate(0deg);
    }

    to {
      -webkit-transform: rotate(360deg);
    }
  }
</style>
