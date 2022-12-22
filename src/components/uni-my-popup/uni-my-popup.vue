<template>
  <view class="">
    <uni-popup
      @change="change"
      :maskBackgroundColor="maskBackgroundColor"
      :mask-click="maskClick"
      ref="popup"
    >
      <slot />
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'my-hren-popup',

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    maskBackgroundColor: {
      type: String,
      default: 'rgba(0, 0, 0, 0.4)',
    },

    title: {
      type: String,
      default: '提示',
    },

    maskClick: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['input'],

  methods: {
    getInstance() {
      const inst = this.$refs.popup;

      return (
        inst || {
          open() {},
          close() {},
        }
      );
    },

    open() {
      // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
      this.getInstance().open('center');
    },

    close() {
      this.getInstance().close();
    },

    change({ show }) {
      this.changeType(show);
    },

    changeType(type) {
      this.$emit('update:value', type);
    },
  },

  watch: {
    value: {
      handler: function (v) {
        const { open, close } = this;

        if (v) {
          this.$nextTick(() => {
            open();
          });
        } else {
          close();
        }
      },

      immediate: true,
    },
  },
};
</script>
