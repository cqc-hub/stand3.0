<template>
  <view class="uni-numbox keep-normal">
    <view
      @click="_calcValue('minus')"
      class="uni-numbox__minus uni-numbox-btns"
    >
      <text
        class="uni-numbox--text iconfont"
        :class="{
          'uni-numbox--disabled': inputValue <= min || disabled,
        }"
      >
        <text v-if="icon == 'circle'">&#xe719;</text>
        <text v-else>&#xe6e5;</text>
      </text>
    </view>

    <input
      :disabled="disabled || inputDisabled"
      @focus="_onFocus"
      @blur="_onBlur"
      class="uni-numbox__value"
      type="number"
      v-model="inputValue"
      :style="{ background, color }"
    />
    <view @click="_calcValue('plus')" class="uni-numbox__plus uni-numbox-btns">
      <text
        class="uni-numbox--text iconfont"
        :class="{ 'uni-numbox--disabled': inputValue >= max || disabled }"
      >
        <text v-if="icon == 'circle'">&#xe718;</text>
        <text v-else>&#xe6e9;</text>
      </text>
    </view>
  </view>
</template>
<script>
  /**
   * NumberBox 数字输入框
   * @description 带加减按钮的数字输入框
   * @tutorial https://ext.dcloud.net.cn/plugin?id=31
   * @property {Number} value 输入框当前值
   * @property {Number} min 最小值
   * @property {Number} max 最大值
   * @property {Number} step 每次点击改变的间隔大小
   * @property {String} background 背景色
   * @property {String} icon 图标 可不传！默认方形，传circle为圆形
   * @property {String} color 字体颜色（前景色）
   * @property {Boolean} disabled = [true|false] 是否为禁用状态
   * @event {Function} change 输入框值改变时触发的事件，参数为输入框当前的 value
   * @event {Function} focus 输入框聚焦时触发的事件，参数为 event 对象
   * @event {Function} blur 输入框失焦时触发的事件，参数为 event 对象
   */

  export default {
    name: 'UniNumberBox',
    emits: ['change', 'input', 'update:modelValue', 'blur', 'focus'],
    props: {
      value: {
        type: [Number, String],
        default: 1,
      },
      modelValue: {
        type: [Number, String],
        default: 1,
      },
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 100,
      },
      step: {
        type: Number,
        default: 1,
      },
      background: {
        type: String,
        default: 'transparent',
      },
      icon: {
        type: String,
      },
      color: {
        type: String,
        default: 'var(--hr-neutral-color-9)',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      inputDisabled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        inputValue: 0,
      };
    },
    watch: {
      value(val) {
        this.inputValue = +val;
      },
      modelValue(val) {
        this.inputValue = +val;
      },
    },
    created() {
      if (this.value === 1) {
        this.inputValue = +this.modelValue;
      }
      if (this.modelValue === 1) {
        this.inputValue = +this.value;
      }
    },
    methods: {
      _calcValue(type) {
        if (this.disabled) {
          return;
        }
        const scale = this._getDecimalScale();
        let value = this.inputValue * scale;
        let step = this.step * scale;
        if (type === 'minus') {
          value -= step;
          if (value < this.min * scale) {
            return;
          }
          if (value > this.max * scale) {
            value = this.max * scale;
          }
        }

        if (type === 'plus') {
          value += step;
          if (value > this.max * scale) {
            return;
          }
          if (value < this.min * scale) {
            value = this.min * scale;
          }
        }

        this.inputValue = (value / scale).toFixed(String(scale).length - 1);
        this.$emit('change', +this.inputValue);
        // TODO vue2 兼容
        this.$emit('input', +this.inputValue);
        // TODO vue3 兼容
        this.$emit('update:modelValue', +this.inputValue);
      },
      _getDecimalScale() {
        let scale = 1;
        // 浮点型
        if (~~this.step !== this.step) {
          scale = Math.pow(10, String(this.step).split('.')[1].length);
        }
        return scale;
      },
      _onBlur(event) {
        this.$emit('blur', event);
        let value = event.detail.value;
        if (!value) {
          // this.inputValue = 0;
          return;
        }
        value = +value;
        if (value > this.max) {
          value = this.max;
        } else if (value < this.min) {
          value = this.min;
        }
        const scale = this._getDecimalScale();
        this.inputValue = value.toFixed(String(scale).length - 1);
        this.$emit('change', +this.inputValue);
        this.$emit('input', +this.inputValue);
      },
      _onFocus(event) {
        this.$emit('focus', event);
      },
    },
  };
</script>
<style lang="scss" scoped>
  $box-height: 26px;
  $bg: #f5f5f5;
  $br: 2px;
  $color: #333;

  .uni-numbox {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
  }

  .uni-numbox-btns {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    // background-color: $bg;
    /* #ifdef H5 */
    cursor: pointer;
    /* #endif */
  }

  .uni-numbox__value {
    margin: 0 2px;
    background-color: $bg;
    height: $box-height;
    text-align: center;
    font-size: var(--hr-font-size-xl);
    border-left-width: 0;
    border-right-width: 0;
    color: $color;
    font-weight: 500;
    width: 40px;
  }

  .uni-numbox__minus {
    border-top-left-radius: $br;
    border-bottom-left-radius: $br;
  }

  .uni-numbox__plus {
    border-top-right-radius: $br;
    border-bottom-right-radius: $br;
  }

  .uni-numbox--text {
    // fix nvue
    line-height: 20px;

    font-size: 20px;
    font-weight: 300;
    color: $color;
  }

  .uni-numbox .uni-numbox--disabled {
    color: #c0c0c0 !important;
    /* #ifdef H5 */
    cursor: not-allowed;
    /* #endif */
  }

  .iconfont {
    font-size: var(--h-iconfont-48);
    color: var(--hr-brand-color-6);
  }
</style>
