<template>
  <view class="">
    <wyb-popup
      ref="popup"
      height="10"
      :mask-click-close="maskClickClose"
      @show="onActionSheetShow"
      @hide="onActionSheetHide"
      :type="type"
      :duration="duration"
      :maskAlpha="maskAlpha"
      :zIndex="zIndex"
      bg-color="rgba(0,0,0,0)"
    >
      <view
        :class="{
          'border-radius-none': type === 'top',
        }"
        class="popup-container"
      >
        <view v-if="type !== 'top' && !isHideNav" class="header flex-between">
          <view class="popup-title text-ellipsis">
            {{ title }}
          </view>
          <view @click="popup.hide" class="iconfont ico-close">&#xe6cd;</view>
        </view>

        <slot name="header" />

        <scroll-view
          scroll-y
          :class="{
            'auto-height': type === 'top',
          }"
          class="popup-box"
        >
          <slot />
        </scroll-view>
      </view>
    </wyb-popup>
  </view>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import wybPopup from '@/components/wyb-popup/wyb-popup.vue';

  export default defineComponent({
    components: {
      wybPopup,
    },

    props: {
      disabled: {
        type: Boolean,
        default: false,
      },

      isHideNav: {
        type: Boolean,
        default: false,
      },

      type: {
        type: String,
        default: 'bottom',
      },

      maskClickClose: {
        type: Boolean,
        default: true,
      },

      title: {
        type: String,
        default: '',
      },

      duration: {
        type: Number,
        default: 100,
      },

      maskAlpha: {
        type: Number,
        default: 0.5,
      },

      zIndex: {
        type: [String, Number],
        default: 10076,
      },
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

      // mask false 时候调这个
      const close = () => {
        popup.value.hide();
      };

      return {
        onActionSheetShow,
        onActionSheetHide,
        show,
        popup,
        hide,
        close,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .popup-container {
    background-color: #fff;
    border-radius: 24rpx 24rpx 0px 0px;
    display: flex;
    flex-direction: column;

    position: relative;
    z-index: 999;

    &.border-radius-none {
      border-radius: 0;
    }

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
      max-height: var(--h-popup-max-height);
      min-height: min(233rpx, 30vh);
      overflow-y: scroll;
      // margin-bottom: 48rpx;

      &.auto-height {
        min-height: auto;
      }
    }
  }
</style>
