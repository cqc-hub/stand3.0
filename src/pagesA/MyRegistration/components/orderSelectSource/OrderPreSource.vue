<template>
  <view class="">
    <g-popup @hide="hide" title="请选择预约登记号别" ref="popup">
      <view class="container">
        <view
          :style="{
            'grid-template-columns': `repeat(${2}, 1fr)`,
          }"
          class="selpopup-container"
        >
          <view
            v-for="item in list"
            @click="itemClick(item)"
            :key="item.categorNamePY"
            class="g-flex-rc-cc"
          >
            <view
              :style="{
                'background-color': 'var(--hr-neutral-color-1)',
              }"
              class="item g-flex-rc-cc text-ellipsis"
            >
              <text class="title">{{ item.categorName }}</text>
              <text class="item-desc">
                总{{ item.regNumber }} 余{{ item.residueNumber }}
              </text>
              <text class="item-desc">{{ item.fee }}元</text>
            </view>
          </view>
        </view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import { IQueryRegNum } from '../../utils/index';

  const emits = defineEmits(['update:show', 'item-click']);
  const popup = ref<any>('');
  const props = defineProps<{
    show: boolean;
    list: IQueryRegNum[];
  }>();

  const hide = () => {
    emits('update:show', false);
  };

  const show = () => {
    popup.value.show();
  };

  const itemClick = (item) => {
    popup.value.hide();
    emits('item-click', item);
  };

  watch(
    () => props.show,
    (v) => {
      v && show();
    }
  );
</script>

<style lang="scss" scoped>
  @import './style/pop-list.scss';

  .container {
    min-height: 444rpx;
    padding: 32rpx;
  }
</style>
