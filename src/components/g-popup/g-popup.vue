<template>
  <view class="">
    <wyb-popup
      ref="popup"
      height="10"
      :mask-click-close="maskClickClose"
      @show="onActionSheetShow"
      @hide="onActionSheetHide"
      @get-ctx="getCtx"
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
            <view @click="popup.hide" class="iconfont ico-close f48">
              &#xe6cd;
            </view>
          </view>

          <view v-if="subTitle" class="g-flex-rc-cc color-888 f32">
            {{ subTitle }}
          </view>
        </view>

        <slot name="header" />
        <scroll-view
          :class="{
            'auto-height': type === 'top',
          }"
          :style="{
            'max-height': maxHeight,
          }"
          class="popup-box"
          scroll-y
        >
          <slot />
          <view class="safe-height"></view>
          <view class="safe-height"></view>
        </scroll-view>
      </view>
    </wyb-popup>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import wybPopup from '@/components/wyb-popup/wyb-popup.vue';

  const props = withDefaults(
    defineProps<{
      maxHeight?: string;
      disabled?: boolean;
      isHideNav?: boolean;
      type?: string;
      maskClickClose?: boolean;
      title?: string;
      subTitle?: string;
      duration?: number;
      maskAlpha?: number;
      zIndex?: string | number;
    }>(),
    {
      maxHeight: 'var(--h-popup-max-height);',
      disabled: false,
      isHideNav: false,
      type: 'bottom',
      maskClickClose: true,
      title: '',
      subTitle: '',
      duration: 100,
      maskAlpha: 0.5,
      zIndex: 10076,
    }
  );

  const emit = defineEmits(['show', 'hide', 'get-ctx']);

  const popup = ref<any>('');

  const onActionSheetShow = () => {
    emit('show');
  };

  const onActionSheetHide = () => {
    emit('hide');
  };

  const selectCtx = ref(
    {} as {
      show?: () => any;
      hide?: () => any;
      close?: () => any;
    }
  );

  const getCtx = (ctx) => {
    selectCtx.value = ctx;
  };

  const show = () => {
    if (!props.disabled) {
      if (selectCtx.value.show) {
        selectCtx.value.show();
      } else {
        popup.value.show();
      }
    }
  };

  const hide = () => {
    if (selectCtx.value.close) {
      selectCtx.value.close();
    } else {
      popup.value.close();
    }
  };

  // mask false 时候调这个
  const close = () => {
    if (selectCtx.value.hide) {
      selectCtx.value.hide();
    } else {
      popup.value.hide();
    }
  };

  defineExpose({
    show,
    hide,
    close,
  });

  emit('get-ctx', {
    show,
    hide,
    close,
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
        font-weight: 400;
      }
    }

    .popup-box {
      min-height: min(233rpx, 30vh);
      overflow-y: scroll;
      // margin-bottom: 48rpx;

      &.auto-height {
        min-height: auto;
      }
    }
  }
</style>
