<template>
  <view class="box">
    <uni-popup :isMaskClick="false" @change="popChange" ref="popup">
      <view class="power-dialog">
        <view class="power-hos-bg">
          <image
            class="power-hos-img"
            mode="widthFix"
            :src="imgUrl + 'codePopup_img_@2x.png'"
          />
        </view>

        <view class="power-dialog-title color-888 f32">请凭就诊码签到</view>

        <view class="power-dialog-content">
          <view v-if="value && code" class="card-qrcode">
            <!-- 条形码 -->
            <view class="bar-code">
              <tkiBarcode
                cid="code128"
                :loadMake="false"
                :opations="barCodeOpt"
                :val="code"
                format="code128"
                ref="code128"
                onval
              />
            </view>
            <!-- 卡号 -->
            <view class="mt16">{{ code }} </view>
            <!-- 二维码 -->
            <view class="card-code">
              <tki-qrcode
                ref="qrcode"
                :val="code"
                :size="options.size"
                :lv="3"
                :usingComponents="false"
                loadMake
                onval
              />
            </view>
          </view>
        </view>
      </view>
      <view class="power-dialog-foot">
        <slot name="footer"> </slot>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import tkiBarcode from "@/components/tki-barcode/tki-barcode.vue";

  export default {
    props: {
      value: {
        type: Boolean,
        default: false,
      },

      code: String,
    },

    data() {
      return {
        options: {},
        barCodeOpt: {},
        imgUrl: this.$GLOBAL.BASE_IMG3,
      };
    },

    methods: {
      open() {
        this.$refs.popup?.open("center");
      },

      close() {
        this.$emit("update:value", false);
        this.$refs.popup.close();
      },

      popChange({ show }) {
        if (!show) {
          this.$emit("update:value", false);
        }
      },

      init() {
        this.options = {
          // 二维码
          size: 350,
          // 条形码
          width: 600, // 宽度 单位rpx
          height: 184, // 高度 单位rpx
          code: this.code,
          img: "",
        };
        this.barCodeOpt = {
          width: 5, //设置条之间的宽度
          height: 150, //高度
          background: "#FFFFFF",
          displayValue: false,
          text: this.code
        };

        if (this.value && this.code) {
          this.open();
          setTimeout(() => {
            this.$refs.code128._makeCode();
            this.$refs.qrcode._makeCode();
          }, 80);
        } else {
          this.close();
        }
      },
    },

    watch: {
      value: {
        handler: function () {
          this.init();
        },
      },

      code: {
        handler: function () {
          this.init();
        },
      },
    },

    components: {
      tkiBarcode,
    },
  };
</script>

<style lang="scss" scoped>
  .box {
    position: relative;
    z-index: 19;
  }

  .power-dialog {
    width: calc(100vw - 100upx);
    min-height: 400upx;
    background-color: #ffffff;
    border-radius: 16px;
    position: relative;
    // top: -100upx;

    .power-hos-bg {
      height: 62rpx;
      width: calc(100%);
      position: relative;
      display: flex;
      justify-content: center;

      .power-hos-img {
        width: 260rpx;
        height: 260rpx;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        margin: 0 auto;
      }
    }

    .power-dialog-title {
      margin-top: 20rpx;
      width: 100%;
      text-align: center;
    }

    .power-dialog-content {
      .card-qrcode {
        margin: 40rpx 44rpx 0 44rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .card-code {
          color: var(--hr-neutral-color-7);
          font-size: var(--hr-font-size-xs);
          margin: 40rpx 0 100rpx 0;
        }
      }
    }
  }
  .power-dialog-foot {
    margin-top: 48rpx;
    display: flex;
    justify-content: center;
  }
</style>
