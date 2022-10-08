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
            @change="tabChange"
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

          <view class="container-source">
            <orderSelectSourceList
              :column="column"
              :orderSourceList="orderSourceList"
              :value="value"
              @item-click="itemClick"
            />
          </view>
        </scroll-view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, computed } from 'vue';
  import { TSchInfo, IOrderSource } from '../../utils/index';
  import api from '@/service/api';

  import orderSelectSourceList from './orderSourceList.vue';

  const popup = ref<any>('');
  const props = defineProps<{
    show: boolean;
    column: number;
    value: string;
    isOrderBlur: '0' | '1';
    selectSchInfos: TSchInfo[];
    orderSourceList: IOrderSource[];
  }>();
  const emits = defineEmits(['update:show', 'item-click', 'am-change']);
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

  const itemClick = (item: IOrderSource) => {
    emits('item-click', {
      item,
      selectSchInfo: selectSchInfo.value,
    });
  };

  const tabChange = (e) => {
    emits('am-change', props.selectSchInfos[e]);
  };

  watch(
    () => props.show,
    (v) => {
      if (v) {
        show();
      }
    }
  );

  watch(
    () => props.selectSchInfos,
    () => {
      tabCurrent.value = 0;
    }
  );
</script>

<style lang="scss" scoped>
  .container {
    max-height: calc(var(--h-popup-max-height) - 90rpx);
    min-height: 300rpx;
    padding: 0 32rpx;

    .order-info {
      font-weight: 600;
      padding: 32rpx 0;
      display: flex;

      > view {
        margin-right: 24rpx;
      }
    }

    .container-source {
      // #ifdef MP-WEIXIN
      width: calc(100% - 64rpx);
      // #endif
    }
  }
</style>
