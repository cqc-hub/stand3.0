<template>
  <view class="">
    <view
      v-for="(item, i) in list"
      :key="i"
      :class="{
        mb32: i !== list.length - 1,
      }"
      class="bg-white p32 relative f28 color-444 item"
    >
      <view
        v-if="item.currentType === '1'"
        class="item-current color-fff f24 pr8 pl8"
      >
        当前账号
      </view>

      <view class="flex items-center mb32">
        <text class="f36 g-bold mr8 color-111">{{ item.userName }}</text>
        <text v-if="item.accountName" class="color-888">
          {{ `(${phoneConvert(item.accountName)})` }}
        </text>
      </view>

      <view v-if="item.accountTypeName" class="flex mb12">
        <view class="label text-no-wrap color-888 mr24">绑定渠道</view>
        <view class="g-break-word">{{ item.accountTypeName }}</view>
      </view>

      <view class="flex justify-between items-center">
        <view class="flex">
          <view class="label text-no-wrap color-888 mr24">绑定日期</view>
          <view class="g-break-word">
            {{ dayjs(item.createTime).format('YYYY-MM-DD') }}
          </view>
        </view>

        <button
          @click="removeBinding(item)"
          class="btn btn-round btn-size-small btn-border color-111"
        >
          解绑
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { TBoundItem } from '../utils/bound';
  import { phoneConvert } from '@/utils';
  import dayjs from 'dayjs';

  defineProps<{
    list: TBoundItem[];
  }>();

  const emit = defineEmits<{
    'remove-binding': [item: TBoundItem];
  }>();

  const removeBinding = (item: TBoundItem) => {
    emit('remove-binding', item);
  };
</script>

<style lang="scss" scoped>
  .item {
    border-radius: 8px;
  }

  .label {
    width: 5em;
  }

  .item-current {
    background-color: var(--hr-success-color-6);
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0 8px 0 0;
  }
</style>
