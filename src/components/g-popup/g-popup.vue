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
        <view v-if="type !== 'top' && !isHideNav" class="header">
          <view class="flex-between f36">
            <view class="popup-title text-ellipsis g-bold">
              {{ title }}
            </view>
            <view @click="popup.hide" class="iconfont ico-close">&#xe6cd;</view>
          </view>

          <view v-if="subTitle" class="g-flex-rc-cc color-888 f32">
            {{ subTitle }}
          </view>
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

      subTitle: {
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
      border-bottom: 1rpx solid var(--hr-neutral-color-2);
      padding: 28rpx 32rpx;
      padding-bottom: 14rpx;

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
