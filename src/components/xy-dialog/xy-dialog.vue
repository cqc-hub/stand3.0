<template>
  <view
    class="xy-dialog"
    :class="{ 'xy-dialog__show': isShow }"
    @touchmove.stop.prevent="bindTouchmove"
  >
    <view class="xy-dialog__mask" @click="maskClick"></view>
    <view class="xy-dialog__container">
      <view class="xy-dialog__header" v-if="title.length > 0">
        {{ title }}
      </view>
      <scroll-view class="xy-dialog__content" :style="{ 'text-align': textalign }" scroll-y>
        <template v-if="content">
          <view class="modal-content">{{ content }}</view>
        </template>
        <template v-else>
          <slot />
        </template>
      </scroll-view>
      <view class="xy-dialog__footer">
        <view
          v-if="isReverseBtn"
          class="xy-dialog__btn xy-dialog__footer-confirm xy-dialog__btn-confirm-left"
          :style="{ color: confirmColor }"
          :class="[isShowCancel ? '' : 'xy-dialog__btn-row']"
          @click="clickConfirm"
        >
          <slot name="confirmBtn">{{ confirmText }}</slot>
        </view>

        <view
          v-if="isShowCancel"
          class="xy-dialog__btn xy-dialog__footer-cancel g-bold"
          :style="{ color: cancelColor }"
          @click="clickCancel"
        >
          <slot name="cancelBtn">{{ cancelText }}</slot>
        </view>
        <view
          v-if="!isReverseBtn"
          class="xy-dialog__btn xy-dialog__footer-confirm"
          :style="{ color: confirmColor }"
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
  export default {
    props: {
      // 标题
      title: {
        type: String,
        default: '',
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

      // 确定文字颜色
      confirmColor: {
        type: String,
        default: '#296FFF',
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
          this.clickCancel();
        }
      },

      // 取消方法
      clickCancel() {
        setTimeout(() => {
          this.$emit('cancelButton');
        }, 200);
        this.closeDialog();
      },

      // 确定方法
      clickConfirm() {
        setTimeout(() => {
          this.$emit('confirmButton');
        }, 200);
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
    z-index: 3000;
    transition: visibility 200ms ease-in;
    &.xy-dialog__show {
      visibility: visible;
    }

    &__container {
      position: absolute;
      z-index: 1010;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -75%);
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
      .xy-dialog__btn {
        width: 50%;
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
          color: #296fff;
          font-weight: bold;
        }
        &.xy-dialog__btn-row {
          width: 100%;
          text-align: center;
          padding: 20upx 0;
          &.xy-dialog__footer-confirm {
            color: #296fff;
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
