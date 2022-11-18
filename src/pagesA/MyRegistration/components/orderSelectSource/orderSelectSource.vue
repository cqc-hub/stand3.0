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
        <scroll-view
          class="container"
          :scroll-y="!(!orderSourceList.length && isComplete)"
        >
          <block v-if="selectSchInfo.amPmResults">

          </block>

          <block v-else>
            <view class="order-info">
              <view>{{ selectSchInfo.docName }}</view>
              <view>{{ selectSchInfo.schDate }}</view>
              <view>{{ selectSchInfo.fee }}元</view>
            </view>

            <view class="container-source">
              <view
                v-if="!orderSourceList.length && isComplete"
                class="empty-list"
              >
                <g-empty :current="1" text="暂无号源" />
              </view>

              <orderSelectSourceList
                :column="column"
                :orderSourceList="orderSourceList"
                :value="value"
                :isBlur="isBlur"
                @item-click="itemClick"
              />
            </view>
          </block>
        </scroll-view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, computed } from 'vue';
  import { TSchInfo, IOrderSource, TSchInfoWhole } from '../../utils/index';
  import orderSelectSourceList from './orderSourceList.vue';

  const popup = ref<any>('');
  const props = defineProps<{
    show: boolean;
    isComplete: boolean;
    column: number;
    value: string;
    isBlur: '0' | '1';
    selectSchInfos: TSchInfoWhole[];
    orderSourceList: IOrderSource[];
  }>();
  const emits = defineEmits(['update:show', 'item-click', 'am-change']);
  const selectSchInfo = computed(() => {
    if (props.selectSchInfos.length) {
      return props.selectSchInfos[tabCurrent.value];
    } else {
      return {} as TSchInfoWhole;
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

  const setTabIndex = (idx: number) => {
    tabCurrent.value = idx;
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

  defineExpose({
    setTabIndex,
  });
</script>

<style lang="scss" scoped>
  .container {
    max-height: calc(var(--h-popup-max-height) - 90rpx);
    min-height: 400rpx;
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

    .empty-list {
      transform: translateY(25%);
    }
  }
</style>
