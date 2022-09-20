<template>
  <view class="">
    <wyb-popup
      ref="popup"
      height="10"
      :mask-click-close="maskClickClose"
      :mask-alpha="0.6"
      @show="onActionSheetShow"
      @hide="onActionSheetHide"
      bg-color="rgba(0,0,0,0)"
    >
      <view class="container">
        <image :src="headerIcon" mode="heightFix" class="popup-header-icon" />
        <view class="popup-container">
          <view class="popup-header popup-padding">
            <view class="popup-header-title">
              {{ title }}
            </view>
          </view>

          <scroll-view class="popup-scroll" scroll-y>
            <view class="popup-padding">
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
              <view>23322</view>
            </view>
          </scroll-view>

          <view class="popup-footer g-border-top">
            <view class="popup-footer-container popup-padding">
              <button class="btn btn-normal">取消</button>
              <button class="btn btn-primary">同意须知</button>
            </view>
          </view>
        </view>
      </view>
    </wyb-popup>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, reactive } from 'vue';
  import wybPopup from '@/components/wyb-popup/wyb-popup.vue';
  import global from '@/config/global';

  const props = withDefaults(
    defineProps<{
      maskClickClose?: boolean;
      title?: string;
      headerIcon?: string;
    }>(),
    {
      title: '预约挂号须知',
      maskClickClose: true,
      headerIcon: global.BASE_IMG + 'v3-order-reg-confirm.png'
    }
  );

  const emits = defineEmits(['show', 'hide']);

  const popup = ref<any>('');

  const onActionSheetShow = () => {
    emits('show');
  };

  const onActionSheetHide = () => {
    emits('hide');
  };

  const show = () => {
    popup.value.show();
  };

  const hide = () => {
    popup.value.close();
  };

  defineExpose({
    show
  });
</script>

<style lang="scss" scoped>
  .container {
    height: 85vh;
    position: relative;
  }
  .popup-container {
    background-color: #fff;
    border-radius: 8px 8px 0px 0px;
    position: relative;
    height: calc(100% - 38rpx);
    top: 38rpx;

    display: flex;
    flex-direction: column;
    &::before {
      content: '';
      background: linear-gradient(
        0deg,
        rgba(41, 111, 255, 0) 1%,
        rgba(41, 111, 255, 0.2) 96%
      );
      display: block;
      height: 200rpx;
      position: absolute;
      right: 0;
      left: 0;
    }

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 140rpx;

      font-size: 44rpx;
      font-weight: 600;
    }

    .popup-padding {
      padding: 0 32rpx;
    }

    .popup-scroll {
      flex: 1;
      height: 1px;
    }

    .popup-footer {
      box-shadow: 8px 0rpx 24rpx 0px rgba(0, 0, 0, 0.05);
      height: 188rpx;

      .popup-footer-container {
        display: grid;
        grid-template-columns: 1fr 2.3fr;
        gap: 0 16rpx;
        padding-top: 24rpx;

        > button {
          width: 100%;
        }
      }
    }
  }

  .popup-header-icon {
    height: 168rpx;
    position: absolute;
    right: 80rpx;
    top: 0rpx;
    z-index: 9;
  }
</style>
