<template>
  <view
    class="xy-dialog"
    :class="{ 'xy-dialog__show': isShow }"
    :style="{
      zIndex,
    }"
    @touchmove.stop.prevent="bindTouchmove"
  >
    <view class="xy-dialog__mask" @click="maskClick"></view>
    <view class="xy-dialog__container">
      <view class="xy-dialog__header" v-if="title.length > 0">
        {{ title }}
      </view>
      <scroll-view
        class="xy-dialog__content"
        :style="{ 'text-align': textalign ,'max-height':`${maxHeight}rpx`}"
        scroll-y
      >
        <template v-if="content">
          <view class="modal-content">{{ content }}</view>
        </template>
        <template v-else>
          <slot />
        </template>
      </scroll-view>
      <view
        :class="{
          footer__reverse: isReverseBtn,
          'footer__row f32': isVerticalBtn,
        }"
        class="xy-dialog__footer"
      >
        <view
          v-if="isShowCancel"
          class="xy-dialog__btn xy-dialog__footer-cancel g-bold w100p"
          :style="{ color: cancelColor ,fontWeight: cancelFontWeight }"
          @click="clickCancel"
        >
          <slot name="cancelBtn">{{ cancelText }}</slot>
        </view>
        <view
          class="xy-dialog__btn xy-dialog__footer-confirm w100p"
          :style="{ color: confirmColor , fontWeight: confirmFontWeight }"
          :class="[isShowCancel ? '' : 'xy-dialog__btn-row']"
          @click="clickConfirm"
        >
          <slot name="confirmBtn">{{ confirmText }}</slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { wait } from '@/utils';

  export default {
    props: {
      // 标题
      title: {
        type: String,
        default: '',
      },

      zIndex: {
        type: Number,
        default: 3000,
      },

      // 内容
      content: String,

      // 对齐方式
      textalign: {
        type: String,
        default: 'left',
      },

      // 取消文字
      cancelText: {
        type: String,
        default: '取消',
      },

      cancelFontWeight: {
        type: String,
        default: 'normal',
      },

      // 取消颜色
      cancelColor: {
        type: String,
        default: '#888',
      },

      // 确定文字
      confirmText: {
        type: String,
        default: '确定',
      },

      confirmFontWeight: {
        type: String,
        default: 'bold',
      },

      // 确定文字颜色
      confirmColor: {
        type: String,
        default: 'var(--hr-brand-color-6)',
      },

      // 是否显示取消按钮
      isShowCancel: {
        type: Boolean,
        default: true,
      },

      // 是否显示弹出框
      show: {
        type: Boolean,
        default: false,
      },

      isMaskClick: {
        type: Boolean,
        default: false,
      },

      // 确认按钮在前
      isReverseBtn: {
        type: Boolean,
        default: false,
      },

      // 按钮垂直布局
      isVerticalBtn: {
        type: Boolean,
        default: false,
      },

      //最大高度
      maxHeight:{
        type: Number,
        default: 600,
      }
    },
    data() {
      return {
        isShow: false,
      };
    },
    watch: {
      show(val) {
        this.isShow = val;
      },
    },
    methods: {
      // 禁止穿透
      bindTouchmove() {},

      maskClick() {
        if (this.isMaskClick) {
          this.$emit('maskClose');
          this.clickCancel();
        }
      },

      // 取消方法
      async clickCancel() {
        this.$emit('cancelButton');
        await wait(200);
        this.closeDialog();
      },

      // 确定方法
      async clickConfirm() {
        this.$emit('confirmButton');
        await wait(200);
        this.closeDialog();
      },

      // 关闭弹窗
      closeDialog() {
        this.isShow = false;
        this.$emit('close');
      },
    },
  };
</script>

<style lang="scss">
  .xy-dialog {
    position: fixed;
    visibility: hidden;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: visibility 200ms ease-in;
    &.xy-dialog__show {
      visibility: visible;
    }

    &__container {
      position: absolute;
      z-index: 1010;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: transform 0.3s;
      width: calc(100vw - 150rpx);
      // width: 582upx;
      border-radius: 16upx;
      background-color: #fff;
      overflow: hidden;
      opacity: 0;
      transition: opacity 200ms ease-in;
      padding-top: 32rpx;
    }

    &__header {
      position: relative;
      overflow: auto;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 12upx 12upx;
      line-height: 1.5;
      color: #111111;
      font-weight: bold;
      font-size: var(--hr-font-size-xl);
      text-align: center;
    }

    &__content {
      position: relative;
      font-size: var(--hr-font-size-xl);
      box-sizing: border-box;
      line-height: 1.5;
      max-height: 600rpx;
      .modal-content {
        padding: 0 32rpx 64rpx 32rpx;
        color: #444;
      }
      &::after {
        content: ' ';
        position: absolute;
        left: 0;
        bottom: -1px;
        right: 0;
        height: 1px;
        border-bottom: 2rpx solid #e6e6e6;
        transform-origin: 0 0;
        transform: scaleY(0.5);
      }
    }

    &__footer {
      position: relative;
      overflow: auto;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #303133;
      font-size: var(--hr-font-size-xl);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      &.footer__reverse {
        flex-direction: row-reverse;
      }

      &.footer__row {
        flex-direction: column;

        .xy-dialog__btn {
          &.xy-dialog__footer-cancel {
            border-right: none;
            border-bottom: 2rpx solid #e6e6e6;
          }
        }
      }

      .xy-dialog__btn {
        flex: 1;
        text-align: center;
        padding: 20upx 0;
        &.xy-dialog__btn-confirm-left {
          border-right: 2rpx solid #e6e6e6;
        }
        &.xy-dialog__footer-cancel {
          color: #111111;
          border-right: 2rpx solid #e6e6e6;
        }
        &.xy-dialog__footer-confirm {
          color: var(--hr-brand-color-6);
          
        }
        &.xy-dialog__btn-row {
          width: 100%;
          text-align: center;
          padding: 20upx 0;
          &.xy-dialog__footer-confirm {
            color: var(--hr-brand-color-6);
          }
        }
      }
    }

    &__mask {
      display: block;
      position: absolute;
      z-index: 1000;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);
      opacity: 0;
      transition: opacity 200ms ease-in;
    }
    &__show {
      .xy-dialog__container,
      .xy-dialog__mask {
        opacity: 1;
      }
    }
  }
</style>
