<template>
  <view class="scheme-item">
    <view class="scheme-item-ampm-name">
      <view class="mr16 g-bold text-no-wrap">{{ item.ampmName }}</view>
      <view class="f24 color-666 sch-label">
        <text class="text-ellipsis">
          {{ item.schQukCategor || `${item.deptName}/${item.categorName}` }}
        </text>
      </view>
    </view>
    <view class="scheme-item-detail">
      <view class="ampm-fee f28 mr16 g-bold">{{ item.fee }}元</view>

      <view
        v-if="item.schState in warnSchStateMap"
        class="f26 g-bold color-888 klklk g-flex-rc-cc"
      >
        {{ warnSchStateMap[item.schState] }}
      </view>

      <g-login v-else @handler-next="regClick(item)" patient>
        <button class="btn klklk btn-primary btn-reg" @click="regClick(item)">
          余{{ item.numRemain }}个
        </button>
      </g-login>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { TSchInfo } from '../../utils/index';

  const props = defineProps<{
    item: TSchInfo;
  }>();
  const emits = defineEmits(['reg-click', 'avatar-click']);

  const regClick = (scheme: TSchInfo) => {
    emits('reg-click', {
      scheme,
    });
  };
  const warnSchStateMap = {
    1: '停诊',
    2: '约满',
    3: '未放号',
  };
</script>

<style lang="scss" scoped>
  .scheme-item {
    background-color: var(--hr-brand-color-1);
    border-radius: 8rpx;
    padding: 18rpx 24rpx;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .scheme-item-ampm-name {
      font-size: var(--hr-font-size-xs);
      display: flex;
      align-items: center;
    }

    .scheme-item-detail {
      display: flex;
      align-items: center;

      .btn-reg {
        font-size: var(--hr-font-size-xxs);
        height: 48rpx;
        border-radius: 28rpx;
        display: flex;
        align-items: center;
        padding: 0 24rpx;
      }
    }

    &:not(:last-child) {
      margin-bottom: 8rpx;
    }
  }

  .ampm-fee {
    color: var(--hr-error-color-6);
  }

  .sch-label {
    width: 230rpx;
    display: -webkit-box;
  }

  .klklk {
    width: 120rpx;
  }
</style>
