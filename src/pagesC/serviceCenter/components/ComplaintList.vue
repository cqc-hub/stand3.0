<template>
  <view class="mt16 p32c">
    <view
      v-for="item in list"
      :key="item.id"
      @click="itemClick(item)"
      class="flex-normal item g-border pt32 pb32 pl24 mb16"
    >
      <view class="avatar flex-normal">
        <image :src="$global.BASE_IMG + 'service_complaint_message.png'" />
      </view>

      <view class="flex1 ml24 flex-normal">
        <view>
          <view class="text-ellipsis color-111 f36 g-bold mb8">
            {{ item.feedbackContent }}
          </view>

          <view class="color-888 f28">
            <text class="mr12">反馈时间:</text>
            <text>{{ item.createTime }}</text>
          </view>
        </view>

        <view
          v-if="item.replayState === '1'"
          class="text-no-wrap f24 tag pr16 pl16 pt8 pb8"
        >
          已回复
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { TListComPlain } from '../utils';

  defineProps<{
    list: TListComPlain;
  }>();

  const emits = defineEmits<{
    (e: 'item-click', item: TListComPlain[number]): void;
  }>();

  const itemClick = (item: TListComPlain[number]) => {
    emits('item-click', item);
  };
</script>

<style lang="scss" scoped>
  .item {
    border-radius: 16rpx;
    background-color: #fff;

    .tag {
      color: #fff;
      background-color: var(--hr-success-color-6);
      border-radius: 4px 0px 0px 4px;
      transform: translateY(-90%);
    }
  }

  .avatar {
    width: 96rpx;
    height: 96rpx;
    background-color: var(--hr-brand-color-1);
    justify-content: center;
    border-radius: 50%;

    image {
      width: 48rpx;
      height: 40rpx;
    }
  }
</style>
