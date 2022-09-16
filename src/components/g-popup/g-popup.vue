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
      <view class="popup-container">
        <view class="header flex-between">
          <view class="popup-title text-ellipsis">
            {{ title }}
          </view>
          <view @click="popup.hide" class="iconfont ico-close">&#xe6cd;</view>
        </view>

        <view class="popup-box">
          <slot />
        </view>
      </view>
    </wyb-popup>
  </view>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import wybPopup from '@/components/wyb-popup/wyb-popup.vue';

  export default defineComponent({
    components: {
      wybPopup
    },

    props: {
      disabled: {
        type: Boolean,
        default: false
      },

      maskClickClose: {
        type: Boolean,
        default: true
      },

      title: {
        type: String,
        default: ''
      }
    },

    setup(props, { emit }) {
      const popup = ref<any>('');

      const onActionSheetShow = () => {
        emit('show');
      };

      const onActionSheetHide = () => {
        emit('hide');
      };

      const show = () => {
        if (!props.disabled) {
          popup.value.show();
        }
      };

      const hide = () => {
        popup.value.close();
      };

      return {
        onActionSheetShow,
        onActionSheetHide,
        show,
        popup,
        hide
      };
    }
  });
</script>

<style lang="scss" scoped>
  .popup-container {
    background-color: #fff;
    border-radius: 24rpx 24rpx 0px 0px;
    display: flex;
    flex-direction: column;

    .header {
      display: flex;
      align-items: center;
      border-bottom: 1rpx solid var(--hr-neutral-color-2);
      padding: 28rpx 32rpx;

      font-size: var(--hr-font-size-xl);
      font-weight: 600;

      .popup-title {
        width: calc(100% - 48rpx);
        text-align: center;
        transform: translateX(24rpx);
      }

      .ico-close {
        color: var(--hr-neutral-color-7);
        position: absolute;
        right: 24rpx;
        font-size: 48rpx;
        font-weight: 400;
      }
    }

    .popup-box {
      max-height: min(70vh, 999rpx);
      min-height: min(233rpx, 30vh);
      overflow-y: scroll;
      margin-bottom: 48rpx;
    }
  }
</style>
