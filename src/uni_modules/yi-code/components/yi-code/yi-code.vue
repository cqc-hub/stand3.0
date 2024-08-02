<template>
  <view class="yi-code" :style="'width: ' + width + 'rpx;'">
    <view class="yi-code-show" :style="'width: ' + width + 'rpx;'">
      <block v-for="i in numberArr" :key="i">
        <view
          :class="{
            ['yi-code-show-item' +
            (codes.length === i && isFocus ? ' yi-code-show-active' : '')]: 1,
            'yi-border': border,
          }"
          :style="
            `background-color: ${itemBg}; width:${itemSize}rpx;height:${itemSize}rpx;` +
            (type !== 'block'
              ? type === 'line'
                ? 'border-top: 0; border-left: 0; border-right: 0; border-radius: 0; border-width: 2px;'
                : 'border-style: dashed;'
              : '')
          "
					class="g-bold f48"
        >
          {{ showVal(codes[i]) }}
        </view>
      </block>
    </view>
    <view
      class="yi-code-hide"
      :style="'width: ' + width * 2 + 'rpx;left: -' + width + 'rpx;'"
    >
      <input
        v-model="value"
        :style="'width: ' + width * 2 + 'rpx;'"
        :focus="focus"
        @focus="onFocus"
        @blur="onBlur"
        :type="inputType"
        @input="onChange"
        :maxlength="maxlength"
      />
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      /**
       * @description 宽度 rpx
       */
      width: {
        type: Number,
        default: 600,
      },

			itemSize: {
				type: Number,
				default: 120
			},

      /**
       * @description 是否自动聚焦
       */
      focus: {
        type: Boolean,
        default: true,
      },
      /**
       * @description 隐藏字符（密码效果）
       */
      hide: {
        type: String,
        default: '',
      },
      /**
       * @description 验证码长度
       */
      maxlength: {
        type: Number,
        default: 6,
      },
      /**
       * @description 样式类型 block 方框, dashed 虚线方框，line 线
       */
      type: {
        type: String,
        default: 'block',
      },
      /**
       * @description text | number
       */
      inputType: {
        type: String,
        default: 'number',
      },

      border: {
        type: Boolean,
        default: true,
      },

      itemBg: {
        type: String,
        default: 'transparent',
      },
    },
    created() {
      let arr = [];
      for (let i = 0; i < this.$props.maxlength; i++) {
        arr.push(i);
      }
      this.numberArr = arr;
    },
    data() {
      return {
        numberArr: [], //
        codes: [],
        value: '',
        isFocus: false,
      };
    },
    methods: {
      clear() {
        this.codes = [];
        this.value = '';
      },
      onFocus() {
        this.isFocus = true;
      },
      onBlur() {
        this.isFocus = false;
      },
      showVal(v) {
        return v ? this.hide || v : '';
      },
      // vue3版本可直接采用此函数替代上方style的三元表达式
      inputStyle() {
        if (this.$props.type === 'line') {
          return 'border-top: 0; border-left: 0; border-right: 0; border-radius: 0; border-width: 2px;';
        }
        if (this.$props.type === 'dashed') {
          return 'border-style: dashed;';
        }
        return '';
      },
      onChange(e) {
        this.codes = e.detail.value.toString().split('');
        this.$emit('onChange', e.detail.value);
        if (this.codes.length === this.$props.maxlength) {
          this.$emit('onComplete', e.detail.value);
        }
      },
    },
  };
</script>

<style lang="scss">
  .yi-code {
    position: relative;
    overflow: hidden;
    text-align: unset;

    .yi-border {
      border: 1px solid #777;
    }

    .yi-code-show {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .yi-code-show-item {
        box-sizing: border-box;
        border-radius: 6rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .yi-code-show-active {
        border-color: #ff5500;
        border-width: 2px;
        animation: myfirst 400ms infinite;
				animation-direction: alternate;
        @keyframes myfirst {
          0% {
            opacity: 0.1;
          }
          100% {
            opacity: 1;
          }
        }
      }
    }

    .yi-code-hide {
      position: absolute;
      z-index: 99;
      left: 0;
      top: 0;
      height: 80rpx;
      opacity: 0;
      text-align: unset;

      input {
        height: 80rpx;
        text-align: unset;
      }
    }
  }
</style>
