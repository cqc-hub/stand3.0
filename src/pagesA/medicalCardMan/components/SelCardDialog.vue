<template>
  <view class="">
    <wyb-popup
      ref="popup"
      :mask-click-close="onActionSheetHide"
      @show="onActionSheetShow"
      @hide="onActionSheetHide"
      :type="type"
      :width="width"
      :height="'auto'"
      bg-color="rgba(0,0,0,0)"
    >
      <view class="container">
        <scroll-view
          :class="{
            'scroll-container': list.length > 3,
          }"
          scroll-y
        >
          <view class="p32">
            <view
              v-for="item in list"
              :key="item.cardNumber"
              :class="{
                'item-active': item.cardNumber === activeCardNumber,
              }"
              @click="itemClick(item)"
              class="item flex-normal g-border mb16 p40 pr24"
            >
              <view class="mr30">
                <view
                  :class="{
                    'is-check': item.cardNumber === activeCardNumber,
                  }"
                  class="iconfont check-box f48"
                >
                  {{
                    (item.cardNumber === activeCardNumber && '&#xe6e6;') ||
                    '&#xe6ce;'
                  }}
                </view>
              </view>
              <view class="flex1">
                <view class="g-break-word g-bold">
                  <text class="f36 mr32">{{ item.patientName }}</text>
                  <text class="color-666">{{ item.cardNumber }}</text>
                </view>

                <view class="color-666">
                  <text class="label mr12">卡余额:</text>
                  <text class="value">{{ item.cardBalance }}</text>
                </view>

                <view class="color-666">
                  <text class="label mr12">建卡日期:</text>
                  <text class="value">{{ item.createTime }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        <view @click="confirm" class="footer-container p32 g-border-top">
          <view class="btn btn-plain color-blue">绑定就诊卡</view>
        </view>
      </view>
    </wyb-popup>
  </view>
</template>

<script lang="ts" setup>
  import { apiAsync } from '@/utils';
  import { ref, watch } from 'vue';
  import { TCardPat } from '../utils';

  const props = defineProps<{
    show: boolean;
    list: TCardPat[];
    activeCardNumber: string;
  }>();
  const width = ref(500);
  const popup = ref<any>('');
  const type = 'center';
  const emits = defineEmits(['update:show', 'item-click', 'confirm']);
  const onActionSheetHide = () => {
    emits('update:show', false);
  };

  const onActionSheetShow = () => {
    emits('update:show', true);
  };

  const itemClick = (item) => {
    emits('item-click', item);
  };

  const confirm = () => {
    emits('confirm', props.activeCardNumber);
  };

  watch(
    () => props.show,
    (v) => {
      if (!popup.value) {
        return;
      }

      if (v) {
        popup.value.show();
        onActionSheetShow();
      } else {
        popup.value.hide();
        onActionSheetHide();
      }
    }
  );

  const init = async () => {
    const { screenWidth } = await apiAsync(uni.getSystemInfo, {});
    width.value = screenWidth * 2 - 160;
  };

  init();
</script>

<style lang="scss" scoped>
  .container {
    background: #ffffff;
    border-radius: 16rpx;

    .scroll-container {
      height: 800rpx;
    }

    .item {
      border-radius: 16rpx;
      border-color: var(--hr-neutral-color-4);
      align-items: flex-start;

      > view {
        height: 100%;
      }

      &.item-active {
        background: var(--hr-brand-color-1);
      }
    }

    .footer-container,
    .btn {
      border-radius: 0px 0px 8px 8px;
    }
  }
</style>
