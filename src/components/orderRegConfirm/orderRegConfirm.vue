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
      <view
        :style="{
          height: height,
        }"
        class="container"
      >
        <image :src="headerIcon" mode="heightFix" class="popup-header-icon" />
        <view class="popup-container">
          <view class="popup-header popup-padding flex-between">
            <view class="popup-header-title">
              {{ title }}
            </view>

            <view
              v-if="isShowCloseIcon"
              @click="closePopup"
              class="iconfont close-icon color-888 f48"
            >
              &#xe6cd;
            </view>
          </view>

          <scroll-view class="popup-scroll" scroll-y>
            <view class="popup-padding">
              <slot />
            </view>
          </scroll-view>

          <view v-if="!isHideFooter" class="popup-footer g-border-top">
            <slot name="footer">
              <view
                :class="{
                  'btn-isometric': footerBtnIsometric,
                }"
                class="popup-footer-container popup-padding"
              >
                <button class="btn btn-normal" @click="hide">
                  {{ cannerText }}
                </button>

                <button class="btn btn-primary" @click="confirm">
                  {{ confirmText }}
                </button>
              </view>
            </slot>
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

  withDefaults(
    defineProps<{
      maskClickClose?: boolean;
      isShowCloseIcon?: boolean;
      title?: string;
      headerIcon?: string;
      height?: string;
      isHideFooter?: boolean;
      cannerText?: string;
      confirmText?: string;
      // 按钮等长?
      footerBtnIsometric?: boolean;
    }>(),
    {
      title: '须知',
      maskClickClose: true,
      headerIcon: global.BASE_IMG + 'v3-order-reg-confirm.png',
      height: '90vh',
      cannerText: '取消',
      confirmText: '同意须知',
    }
  );

  const emits = defineEmits(['show', 'hide', 'confirm']);

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

  const closePopup = () => {
    console.log('close');
    hide();
  };

  const confirm = () => {
    emits('confirm');
    hide();
  };

  defineExpose({
    show,
    hide,
  });
</script>

<style lang="scss" scoped>
  .container {
    // height: 90vh;
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
      pointer-events: none;
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

        &.btn-isometric {
          grid-template-columns: 0.9fr 1fr;
        }

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

  .close-icon {
    font-weight: normal;
  }
</style>
