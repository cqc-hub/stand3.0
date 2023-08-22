<template>
  <view>
    <view
      id="_drag_button"
      class="drag"
      :style="right?'right: ' + right + 'px; top:' + top + 'px;':'left: ' + left + 'px; top:' + top + 'px;'"
      @touchstart="touchstart"
      @touchmove.stop.prevent="touchmove"
      @touchend="touchend"
      @click.stop.prevent="click"
      :class="{ transition: isDock && !isMove }"
    >
      <slot>
        <text>{{ text }}</text>
      </slot>
    </view>
    <view
      :class="{
        'mask-active': maskActive,
      }"
      class="mask"
      @touchmove.stop.prevent="() => {}"
    ></view>
  </view>
</template>

<script>
  import { setLocalStorage, getLocalStorage } from '@/common';

  const DRAG_LOCATION_KEY = 'DRAG_LOCATION_KEY';
  export default {
    name: 'drag-button',
    props: {
      isDock: {
        type: Boolean,
        default: false,
      },
      existTabBar: {
        type: Boolean,
        default: false,
      },

      scrollY: {
        type: Boolean,
        default: false,
      },

      zid: {
        type: String,
        default: '',
      },

      edge: {
        type: Number,
        default: 10,
      },

      right:{
        type: Number,
        default: 0,
      }
    },
    data() {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        windowWidth: 0,
        windowHeight: 0,
        isMove: true,
        text: '按钮',
        maskActive: true,
      };
    },
    mounted() {
      const sys = uni.getSystemInfoSync();

      this.windowWidth = sys.windowWidth;
      this.windowHeight = sys.windowHeight;

      // #ifdef APP-PLUS
      this.existTabBar && (this.windowHeight -= 50);
      // #endif
      if (sys.windowTop) {
        this.windowHeight += sys.windowTop;
      }

      const query = uni.createSelectorQuery().in(this);
      query
        .select('#_drag_button')
        .boundingClientRect((data) => {
          this.width = data.width;
          this.height = data.height;
          // this.offsetWidth = data.width / 2;
          this.offsetHeight = data.height / 2;

          const hisLocation = getLocalStorage(DRAG_LOCATION_KEY + this.zid);
          if (hisLocation) {
            this.left = hisLocation.left;
            this.top = hisLocation.top;
          } else {
            this.left = this.windowWidth - this.width - this.edge;
            this.top = (this.windowHeight - this.height) / 2 - this.edge;
          }
        })
        .exec();
    },
    methods: {
      click() {
        this.$emit('btnClick');
      },
      touchstart(e) {
        this.maskActive = false;
        this.$emit('btnTouchstart');
      },
      touchmove(e) {
        // 单指触摸
        if (e.touches.length !== 1) {
          return false;
        }

        this.isMove = true;

        if (!this.scrollY) {
          this.left = e.touches[0].clientX - this.offsetWidth;
        }

        let clientY = e.touches[0].clientY - this.offsetHeight;
        // #ifdef H5
        clientY += this.height;
        // #endif
        let edgeBottom = this.windowHeight - this.height - this.edge;

        // 上下触及边界
        if (clientY < this.edge) {
          this.top = this.edge;
        } else if (clientY > edgeBottom) {
          this.top = edgeBottom;
        } else {
          this.top = clientY;
        }
      },
      touchend(e) {
        this.maskActive = true;

        if (this.isDock) {
          let edgeRigth = this.windowWidth - this.width - this.edge;

          if (this.left < this.windowWidth / 2 - this.offsetWidth) {
            this.left = this.edge;
          } else {
            this.left = edgeRigth;
          }
        }

        this.isMove = false;

        this.$emit('btnTouchend');

        setLocalStorage({
          [DRAG_LOCATION_KEY + this.zid]: {
            top: this.top,
            left: this.left,
          },
        });
      },
    },
  };
</script>

<style lang="scss">
  .drag {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 999999;

    &.transition {
      transition: left 0.3s ease, top 0.3s ease;
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    // pointer-events: none;
    // -webkit-user-drag: none;

    &.mask-active {
      pointer-events: none;
    }
  }
</style>
