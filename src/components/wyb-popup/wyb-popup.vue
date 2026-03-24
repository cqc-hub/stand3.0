<template>
  <view v-if="isShow">
    <view
      @tap.stop.prevent
      @touchmove.stop.prevent
      class="wyb-popup-box"
      :style="{
        transitionDuration: duration + 'ms',
        opacity: contentOpacity || (type === 'center' ? 0 : 1),
        transform: contentTransform || autoTransform,
        zIndex: zIndex,
        borderTopRightRadius:
          type === 'center' || type === 'bottom' || type === 'left'
            ? radius + 'px'
            : 0,
        borderTopLeftRadius:
          type === 'center' || type === 'bottom' || type === 'right'
            ? radius + 'px'
            : 0,
        borderBottomRightRadius:
          type === 'center' || type === 'top' || type === 'left'
            ? radius + 'px'
            : 0,
        borderBottomLeftRadius:
          type === 'center' || type === 'top' || type === 'right'
            ? radius + 'px'
            : 0,
        width: autoWidth,
        height: autoHeight,
        minWidth: width + 'rpx',
        minHeight: height + 'rpx',
        top: sizeChange && type === 'center' ? winReTop : autoTop,
        bottom: autoBottom,
        left: autoLeft,
        right: autoRight,
        backgroundColor: bgColor,
      }"
    >
      <view
        class="wyb-popup-close"
        v-if="showCloseIcon"
        :style="{
          width: closeIcon ? closeIconSize + 'rpx' : 'auto',
          height: closeIcon ? closeIconSize + 'rpx' : 'auto',
          top:
            closeIconPos === 'top-right' || closeIconPos === 'top-left'
              ? vertOffset + 'rpx'
              : 'auto',
          bottom:
            closeIconPos === 'bottom-right' || closeIconPos === 'bottom-left'
              ? vertOffset + 'rpx'
              : 'auto',
          left:
            closeIconPos === 'bottom-left' || closeIconPos === 'top-left'
              ? horiOffset + 'rpx'
              : 'auto',
          right:
            closeIconPos === 'bottom-right' || closeIconPos === 'top-right'
              ? horiOffset + 'rpx'
              : 'auto',
        }"
      >
        <image
          class="wyb-popup-custom-close"
          v-if="showCloseIcon && closeIcon"
          :src="closeIcon"
          @tap="hide"
          :style="{
            width: closeIconSize + 'rpx',
            height: closeIconSize + 'rpx',
          }"
        />
        <view
          v-if="showCloseIcon && !closeIcon"
          class="iconfont icon-close"
          @tap="hide"
        />
      </view>

      <scroll-view
        class="wyb-popup-container"
        :style="{
          width: autoWidth,
          height: autoHeight,
        }"
        :enable-flex="true"
        :scroll-y="scrollY"
        :scroll-x="scrollX"
      >
        <view class="wyb-popup-slot"><slot></slot></view>
      </scroll-view>
    </view>
    <view
      class="wyb-popup-mask"
      @tap.stop="close"
      @touchmove.stop.prevent
      :style="{
        opacity: maskOpacity,
        transitionDuration: duration + 'ms',
        backgroundColor: 'rgba(0, 0, 0, ' + maskAlpha + ')',
        zIndex: zIndex - 1,
      }"
    />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, nextTick } from 'vue';

  interface PopupProps {
    type?: string; // 'center' | 'bottom' | 'top' | 'left' | 'right';
    mode?: 'size-fixed' | 'size-auto';
    height?: string | number;
    width?: string | number;
    radius?: string | number;
    zIndex?: string | number;
    maskClickClose?: boolean;
    maskAlpha?: number;
    duration?: number;
    showCloseIcon?: boolean;
    scrollY?: boolean;
    scrollX?: boolean;
    closeIconPos?: string;
    closeIcon?: string;
    closeIconSize?: string | number;
    vertOffset?: string | number;
    horiOffset?: string | number;
    centerAnim?: 'zoom-lessen' | 'slide-up' | 'slide-down' | 'fade';
    bgColor?: string;
    zoomLessenMulti?: number;
    slideMulti?: number;
    negativeTop?: number;
  }

  const props = withDefaults(defineProps<PopupProps>(), {
    type: 'bottom',
    mode: 'size-auto',
    height: 400,
    width: 500,
    radius: 0,
    zIndex: 10076,
    maskClickClose: true,
    maskAlpha: 0.5,
    duration: 400,
    showCloseIcon: false,
    scrollY: false,
    scrollX: false,
    closeIconPos: 'top-right',
    closeIcon: '',
    closeIconSize: '20',
    vertOffset: '22',
    horiOffset: '22',
    centerAnim: 'zoom-lessen',
    bgColor: '#ffffff',
    zoomLessenMulti: 1.15,
    slideMulti: 1,
    negativeTop: 0,
  });

  const emit = defineEmits<{
    (event: 'show', payload: { pageScroll: boolean; overflow: string }): void;
    (event: 'hide', payload: { pageScroll: boolean; overflow: string }): void;
    (
      event: 'get-ctx',
      payload: {
        show?: () => any;
        hide?: () => any;
        close?: () => any;
      }
    ): void;
  }>();

  const w = ref(uni.getSystemInfoSync().screenWidth);
  const h = ref(uni.getSystemInfoSync().screenHeight);
  const isShow = ref(false);
  const winReBottom = ref('');
  const winReTop = ref('10%');
  const sizeChange = ref(false);
  const contentOpacity = ref<number | null>(null);
  const contentTransform = ref<string | null>(null);
  const maskOpacity = ref<number>(0);
  const myAutoHeight = ref<number>(0);

  const rpxToPx = (rpx: number | string) => {
    const value = Number(rpx);
    return (value / 750) * w.value;
  };

  const autoCenterTop = computed(() => {
    const { windowHeight } = uni.getSystemInfoSync();
    const popupHeight = rpxToPx(props.height ?? 0);
    const heightValue = Number.isNaN(popupHeight)
      ? myAutoHeight.value
      : popupHeight;
    return `${(windowHeight - heightValue) / 2 - (props.negativeTop ?? 0)}px`;
  });

  const autoTransform = computed(() => {
    if (props.type === 'center') {
      switch (props.centerAnim) {
        case 'zoom-lessen':
          return `scale(${props.zoomLessenMulti})`;
        case 'slide-up':
          return `translateY(${100 * (props.slideMulti ?? 1)}%)`;
        case 'slide-down':
          return `translateY(${-100 * (props.slideMulti ?? 1)}%)`;
        case 'fade':
          return 'auto';
      }
      return '';
    }
    if (props.type === 'bottom') return 'translateY(100%)';
    if (props.type === 'top') return 'translateY(-100%)';
    if (props.type === 'left') return 'translateX(-100%)';
    if (props.type === 'right') return 'translateX(100%)';
    return '';
  });

  const autoWidth = computed(() => {
    if (props.type === 'center') {
      return `${props.width}rpx`;
    }
    if (props.mode === 'size-fixed') {
      if (props.type === 'top' || props.type === 'bottom') return '100%';
      return `${props.width}rpx`;
    }
    if (props.type === 'top' || props.type === 'bottom') return '100%';
    return 'auto';
  });

  const autoHeight = computed(() => {
    if (props.type === 'center') {
      return `${props.height}rpx`;
    }
    if (props.mode === 'size-fixed') {
      if (props.type === 'left' || props.type === 'right') return '100%';
      return `${props.height}rpx`;
    }
    if (props.type === 'left' || props.type === 'right') return '100%';
    return 'auto';
  });

  const autoTop = computed(() => {
    if (props.type === 'center') return autoCenterTop.value;
    if (props.type === 'bottom') return 'auto';
    return 0;
  });

  const autoBottom = computed(() => {
    if (props.type === 'center' || props.type === 'top') return 'auto';
    return 0;
  });

  const autoLeft = computed(() => {
    if (props.type === 'center') {
      return `${(w.value - rpxToPx(props.width ?? 0)) / 2}px`;
    }
    if (props.type === 'right') return 'auto';
    return 0;
  });

  const autoRight = computed(() => {
    if (props.type === 'center' || props.type === 'left') return 'auto';
    return 0;
  });

  const zIndex = computed(() => Number(props.zIndex ?? 0));

  const wait = (time: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, time));

  const contentIn = () => {
    switch (props.type) {
      case 'center':
        if (props.centerAnim === 'zoom-lessen') {
          contentOpacity.value = 1;
          contentTransform.value = 'scale(1)';
        } else if (
          props.centerAnim === 'slide-up' ||
          props.centerAnim === 'slide-down'
        ) {
          contentOpacity.value = 1;
          contentTransform.value = 'translateY(0)';
        } else if (props.centerAnim === 'fade') {
          contentOpacity.value = 1;
        }
        break;
      case 'bottom':
      case 'top':
        contentTransform.value = 'translateY(0)';
        break;
      case 'left':
      case 'right':
        contentTransform.value = 'translateX(0)';
        break;
    }
  };

  const contentOut = () => {
    contentOpacity.value = null;
    contentTransform.value = null;
  };

  const maskIn = () => {
    maskOpacity.value = 1;
  };

  const maskOut = () => {
    maskOpacity.value = 0;
  };

  const close = () => {
    if (props.maskClickClose) {
      hide();
    }
  };

  const hide = () => {
    if (!isShow.value) return;
    contentOut();
    maskOut();
    wait(props.duration + 1).then(() => {
      isShow.value = false;
      emit('hide', { pageScroll: true, overflow: 'scroll' });
    });
  };

  const show = () => {
    isShow.value = true;
    // #ifndef H5
    nextTick(() => {
      maskIn();
      contentIn();
      wait(props.duration + 1).then(() => {
        emit('show', { pageScroll: false, overflow: 'hidden' });
        if (props.height === 'auto') {
          let query = uni.createSelectorQuery();
          // #ifndef MP-TOUTIAO
          query = query.in({});
          // #endif
          query
            .select('.wyb-popup-slot')
            .boundingClientRect((res: any) => {
              myAutoHeight.value = res.height;
            })
            .exec();
        }
      });
    });
    // #endif
    // #ifdef H5
    wait(10).then(() => {
      maskIn();
      contentIn();
      wait(props.duration + 1).then(() => {
        emit('show', { pageScroll: false, overflow: 'hidden' });
      });
    });
    // #endif
  };

  onMounted(() => {
    // #ifdef H5
    const winHeight = uni.getSystemInfoSync().windowHeight;
    uni.onWindowResize((res: any) => {
      sizeChange.value = true;
      if (props.type === 'bottom') {
        winReBottom.value = winHeight - res.size.windowHeight + 'px';
      } else if (props.type === 'center') {
        winReTop.value =
          (res.size.windowHeight - rpxToPx(props.height ?? 0)) / 2 -
          (props.negativeTop ?? 0) +
          'px';
      }
    });
    // #endif
  });

  emit('get-ctx', {
    show,
    hide,
    close,
  });
  defineExpose({
    show,
    hide,
    close,
  });
</script>

<style>
  @import './iconfont.css';
  .wyb-popup-box {
    /* position: fixed; */
    transition-timing-function: ease-out;
    transition-property: opacity, transform;
    z-index: 999;

    position: fixed;
    left: 0;
    top: 20%;
    right: 0;
    bottom: 0;
    background-color: transparent;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    overflow: hidden;
    /* #ifdef APP-NVUE */
    width: 750rpx;
    /* #endif */
    justify-content: flex-end;
  }

  .wyb-popup-container {
    /* position: relative; */
    box-sizing: border-box;
  }

  .wyb-popup-slot {
    width: 100%;
    height: 100%;
  }

  .wyb-popup-mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    transition-timing-function: ease;
    transition-property: opacity, transform;
  }

  .wyb-popup-close {
    position: absolute;
    font-size: 40rpx;
    color: #808080;
    z-index: 20000;
  }

  .wyb-popup-custom-close {
    left: 0;
    top: 0;
    position: absolute;
  }
</style>
