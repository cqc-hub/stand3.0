<template>
  <view class="">
    <g-popup @hide="hide" title="请选择就诊时间" ref="popup">
      <view class="content">
        <view
          v-if="selectSchInfos && selectSchInfos.length > 1"
          class="g-border-bottom"
        >
          <g-tabs
            v-model:value="tabCurrent"
            :tabs="selectSchInfos"
            :scroll="false"
            field="ampmName"
            style="width: 100%"
          />
        </view>
        <scroll-view class="container" scroll-y>
          <view class="order-info">
            <view>{{ selectSchInfo.docName }}</view>
            <view>{{ selectSchInfo.schDate }}</view>
            <view>{{ selectSchInfo.fee }}元</view>
          </view>

          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
          <view>233</view>
        </scroll-view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, computed } from 'vue';
  import { TSchInfo } from '../../utils/index';
  import api from '@/service/api';

  const popup = ref<any>('');
  const props = defineProps<{
    show: boolean;
    selectSchInfos: TSchInfo[];
  }>();
  const emits = defineEmits(['update:show']);
  const selectSchInfo = computed(() => {
    if (props.selectSchInfos.length) {
      return props.selectSchInfos[tabCurrent.value];
    } else {
      return {} as TSchInfo;
    }
  });

  const tabCurrent = ref(0);
  const show = () => {
    popup.value.show();
  };

  const hide = () => {
    emits('update:show', false);
  };

  watch(
    () => props.show,
    (v) => {
      if (v) {
        show();
      }
    }
  );
</script>

<style lang="scss" scoped>
  .container {
    max-height: calc(min(70vh, 999rpx) - 90rpx);
    padding: 0 32rpx;
    .order-info {
      font-weight: 600;
      padding: 32rpx 0;
      display: flex;

      > view {

      }
    }
  }
</style>
