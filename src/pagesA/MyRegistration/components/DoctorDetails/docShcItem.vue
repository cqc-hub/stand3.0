<template>
  <g-login @handler-next="regClick(item)" patient>
    <view @click="regClick(item)" class="scheme-item">
      <view class="flex-between">
        <view class="scheme-item-ampm-name">
          <view class="mr16 g-bold text-no-wrap">{{ item.ampmName }}</view>
          <view class="ampm-fee f28 mr16 g-bold">{{ item.fee }}元</view>
        </view>

        <view class="scheme-item-detail">
          <button
            v-if="item.schState in warnSchStateMap"
            class="btn klklk btn-primary btn-reg disabled-btn"
          >
            {{ warnSchStateMap[item.schState] }}
          </button>

          <button v-else class="btn klklk btn-primary btn-reg">挂号</button>
        </view>
      </view>

      <view class="f24 color-666 flex-between">
        <view class="text-ellipsis mr12">
          {{ item.schQukCategor || `${item.deptName}/${item.categorName}` }}
        </view>

        <view class="color-888 text-no-wrap">
          总{{ item.numCount }} 个 余{{ item.numRemain }}个
        </view>
      </view>
    </view>
  </g-login>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { TSchInfo } from '../../utils/index';

  defineProps<{
    item: TSchInfo;
  }>();

  const emits = defineEmits(['reg-click', 'avatar-click']);

  const regClick = (scheme: TSchInfo) => {
    if (scheme.schState in warnSchStateMap) {
      return;
    }

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
    // width: 120rpx;
  }

  .disabled-btn {
    background-color: var(--hr-neutral-color-4);
  }
</style>
