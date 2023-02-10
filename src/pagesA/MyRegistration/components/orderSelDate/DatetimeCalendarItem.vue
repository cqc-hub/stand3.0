<template>
  <view
    v-if="dateShow.includes(weeks.fullDate)"
    class="uni-calendar-item__weeks-box"
    :class="{
      'uni-calendar-item--disable': weeks.disable || !isHasOrder,
      'uni-calendar-item--before-checked-x': weeks.beforeMultiple,
      'uni-calendar-item--multiple': weeks.multiple,
      'uni-calendar-item--after-checked-x': weeks.afterMultiple,
      'system-mode-old': systemModeOld,
    }"
    @click="choiceDate(weeks)"
    @mouseenter="handleMousemove(weeks)"
  >
    <view
      class="uni-calendar-item__weeks-box-item"
      :class="{
        'uni-calendar-item--checked': weeks.fullDate === value,
        'uni-calendar-item--checked-range-text': checkHover,
        'uni-calendar-item--before-checked': weeks.beforeMultiple,
        'uni-calendar-item--multiple': weeks.multiple,
        'uni-calendar-item--after-checked': weeks.afterMultiple,
        'uni-calendar-item--disable': weeks.disable,
      }"
    >
      <text
        v-if="selected && weeks.extraInfo"
        class="uni-calendar-item__weeks-box-circle"
      />
      <view
        class="uni-calendar-item__weeks-box-text uni-calendar-item__weeks-box-text-disable uni-calendar-item--checked-text g-flex-rc-cc item-content"
      >
        <view>{{ addPlaceHolder(weeks.date, weeks) }}</view>
        <view
          :class="{
            'item-content-order-active': isHasOrder,
          }"
          class="item-content-order"
        >
          {{ isHasOrder ? '有号' : '无号' }}
        </view>
      </view>
    </view>
    <!-- <view :class="{'uni-calendar-item--isDay': weeks.isDay}"></view> -->
  </view>
</template>

<script>
  import dayjs from 'dayjs';

  export default {
    props: {
      enableDays: {
        type: Object,
        default: () => ({}),
      },
      systemModeOld: {
        type: Boolean,
        default: false,
      },
      weeks: {
        type: Object,
        default() {
          return {};
        },
      },
      dateShow: {
        type: Array,
        default: () => [],
      },
      calendar: {
        type: Object,
        default: () => {
          return {};
        },
      },
      selected: {
        type: Array,
        default: () => {
          return [];
        },
      },
      lunar: {
        type: Boolean,
        default: false,
      },
      checkHover: {
        type: Boolean,
        default: false,
      },
      value: {
        type: String,
        default: '',
      },
    },

    computed: {
      isHasOrder() {
        // return this.enableDays.includes(this.weeks.fullDate);
        return this.enableDays[this.weeks.fullDate] === '0';
      },
    },

    methods: {
      choiceDate(weeks) {
        this.$emit('change', weeks);
      },
      handleMousemove(weeks) {
        this.$emit('handleMouse', weeks);
      },
      addPlaceHolder(text, weeks) {
        if (weeks.isDay) {
          return '今天';
        } else {
          const _text = '00' + text;
          return _text.slice((text + '').length);
        }
      },
    },
  };
</script>

<style lang="scss">
  .uni-calendar-item__weeks-box {
    flex: 1;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1px 0;
    position: relative;
    margin-bottom: 24rpx;
  }

  .uni-calendar-item__weeks-box-text {
    font-size: var(--hr-font-size-xs);
    // font-family: Lato-Bold, Lato;
    font-weight: bold;
    // color: #455997;
  }

  .uni-calendar-item__weeks-lunar-text {
    font-size: var(--hr-font-size-xxxs);
    color: #333;
  }

  .uni-calendar-item__weeks-box-item {
    position: relative;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    /* #ifdef H5 */
    cursor: pointer;
    /* #endif */
  }

  .uni-calendar-item__weeks-box-circle {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background-color: #dd524d;
  }

  .uni-calendar-item__weeks-box .uni-calendar-item--disable {
    // background-color: rgba(249, 249, 249, $uni-opacity-disabled);
    cursor: default;
  }

  .uni-calendar-item--disable .uni-calendar-item__weeks-box-text-disable {
    color: #d1d1d1;
    // pointer-events: none;
  }

  .uni-calendar-item--isDay {
    position: absolute;
    top: 10px;
    right: 17%;
    background-color: #dd524d;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .uni-calendar-item--extra {
    color: #dd524d;
    opacity: 0.8;
  }

  .uni-calendar-item__weeks-box .uni-calendar-item--checked {
    background-color: var(--hr-brand-color-1);
    border-radius: 8rpx;
    box-sizing: border-box;
    // border: 3px solid #fff;
  }

  .uni-calendar-item--checked .uni-calendar-item--checked-text {
    // color: #fff;
  }

  .uni-calendar-item--multiple .uni-calendar-item--checked-range-text {
    color: #333;
  }

  .uni-calendar-item--multiple {
    background-color: #f6f7fc;
    // color: #fff;
  }

  .uni-calendar-item--multiple .uni-calendar-item--before-checked,
  .uni-calendar-item--multiple .uni-calendar-item--after-checked {
    background-color: #409eff;
    border-radius: 50%;
    box-sizing: border-box;
    border: 3px solid #f6f7fc;
  }

  .uni-calendar-item--before-checked .uni-calendar-item--checked-text,
  .uni-calendar-item--after-checked .uni-calendar-item--checked-text {
    color: #fff;
  }

  .uni-calendar-item--before-checked-x {
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    box-sizing: border-box;
    background-color: #f6f7fc;
  }

  .uni-calendar-item--after-checked-x {
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    background-color: #f6f7fc;
  }

  .item-content {
    flex-direction: column;

    &-order {
      font-weight: 400;
      font-size: var(--hr-font-size-xxxs);
      margin-top: 4rpx;

      &-active {
        color: var(--hr-brand-color-6);
      }
    }
  }

  .system-mode-old {
    .item-content {
      &-order {
        margin-top: -6rpx;
      }
    }
  }
</style>
