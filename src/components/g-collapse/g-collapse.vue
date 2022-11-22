<template>
  <view
    class="collapse-box"
    :class="{ boxShadow: boxShadow, borderRadius: borderRadius }"
  >
    <view
      class="title f32"
      :class="{
        border,
        borderRadius,
        activeTitleShadow: activeTitleShadow && isShow,
        'title-stick': isTitleSticky,
      }"
      :style="{
        backgroundColor: !disabled && isShow ? activebg : '',
        color: !disabled && isShow ? activeColor : '',
        background: titleBackGroundColor || '',
        padding: titlePadding,
      }"
      @click.stop="disabled ? '' : show()"
    >
      <slot name="title">
        <text>{{ title }}</text>
      </slot>

      <view
        v-if="!disabled"
        :class="{
          arrowBottom: isShow,
        }"
        class="iconfont right-icon color-888"
      >
        &#xe66b;
      </view>
    </view>

    <slot name="title-next" />

    <view
      class="content-box"
      :style="{ height: isShow ? contentHeight + 'px' : '0' }"
    >
      <view id="content" class="content">
        <slot>{{ content }}</slot>
      </view>
    </view>
  </view>
</template>

<script>
  /**
   * collapse 手风琴
   * @property {String} title 面板标题
   * @property {String} content 内容
   * @property {Boolean} open 设置某个面板的初始状态是否打开（默认false）
   * @property {Boolean} disabled 面板是否可以打开或收起（默认false）
   * @property {String} activebg 面板打开时，标题的背景颜色（默认#fff）
   * @property {String} fontSize 标题的文字大小，单位为rpx（默认28）
   * @property {String} height 标题的高度，单位为rpx（默认90）
   * @property {String} rightIcon 标题右侧图标（默认右箭头>）
   * @property {Boolean} boxShadow 面板是否有阴影（默认false）
   * @property {Boolean} borderRadius 面板是否有圆角（默认false）
   * @property {String} activeColor 面板打开时标题的颜色（默认#333）
   * @property {Boolean} border 标题是否显示下边框（默认true）
   */

  import { debounce } from '@/utils';

  export default {
    props: {
      title: {
        type: String,
        default: '标题',
      },
      content: {
        type: String,
        default: '内容',
      },

      titlePadding: String,

      titleBackGroundColor: {
        type: String,
        default: '',
      },

      isTitleSticky: {
        type: Boolean,
        default: false,
      },

      // 手风琴模式 (必传 accordionId)
      accordion: {
        type: Boolean,
        default: false,
      },

      accordionId: {
        type: String,
        default: '',
      },

      activeTitleShadow: {
        type: Boolean,
        default: false,
      },
      open: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      activebg: {
        type: String,
        default: '#fff',
      },
      fontSize: {
        type: String,
        default: '28',
      },
      rightIcon: {
        type: String,
        default: '',
      },
      boxShadow: {
        type: Boolean,
        default: false,
      },
      borderRadius: {
        type: Boolean,
        default: false,
      },
      activeColor: {
        type: String,
        default: '#333',
      },
      border: {
        type: Boolean,
        default: true,
      },

      offsetContentHeight: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        isShow: this.open,
        contentHeight: '',
        img_url: this.$global.BASE_IMG,
      };
    },
    mounted() {
      this.init();

      this.show = debounce(this.show, 80);

      uni.$on('_close_collapse', (e) => {
        if (this.accordionId === e) {
          this.show(false, 'no-emit');
        }
      });
    },
    methods: {
      // 异步获取内容，或者动态修改了内容时，需要重新初始化
      init() {
        this.$nextTick(() => {
          this.queryRect();
        });
      },
      // 查询内容高度
      queryRect() {
        this.$nextTick(() => {
          const query = uni.createSelectorQuery().in(this);
          query
            .select('#content')
            .boundingClientRect((res) => {
              this.contentHeight = res.height + this.offsetContentHeight;
            })
            .exec();
        });
      },
      show(type, status) {
        if (type != undefined) {
          this.isShow = type;
        } else {
          this.isShow = !this.isShow;
        }
        if (status !== 'no-emit') {
          this.$emit('change', this.isShow);
        }

        if (this.isShow) {
          uni.$emit('_close_collapse', this.accordionId);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .boxShadow {
    box-shadow: 0 4rpx 6rpx rgba($color: #bbb, $alpha: 0.6);
  }

  .borderRadius {
    border-radius: 16upx;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding: 0 24rpx;
    transition: 0.8s linear transform;
    position: relative;
    &.activeTitleShadow {
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 16rpx;
        bottom: 0;
        background: linear-gradient(0, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.02));
      }
    }

    &.borderRadius {
      border-radius: 16upx;
    }

    .right-icon {
      transform: rotate(90deg);
      transition: 0.4s all;
      position: relative;
      // right: 0upx;
      font-size: 48rpx;

      &.arrowBottom {
        transform: rotate(-90deg);
      }
    }
  }

  .border {
    border-bottom: 2rpx solid #eee;
  }

  .content-box {
    transition: 0.4s all;
    overflow: hidden;
  }

  .title-stick {
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>
