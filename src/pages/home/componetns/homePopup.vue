<template>
  <view>
    <g-popup title="长辈模式" ref="refOldDialog">
      <view class="g-page modeOld">
        <view class="g-container">
          <view class="old-bg">
            <img :src="$global.BASE_IMG + 'img_old@3x.png'" alt="" />
          </view>
          <view class="old-title" v-if="!gStores.globalStore.modeOld">
            <text>欢迎使用长辈模式</text>
            <view>预约挂号、门诊缴费、报告查询 等主要功能更加简单好用</view>
          </view>
          <view class="old-title" v-if="gStores.globalStore.modeOld">
            <text>长辈模式已开启</text>
            <view>关闭后，字号放大和 功能简化效果将会解除</view>
          </view>
          <button @tap="switchModeOld" class="btn g-border btn-primary dialog-btn">
            {{ gStores.globalStore.modeOld ? "关闭" : "开启" }}长辈模式
          </button>
        </view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { GStores } from "@/utils";

export default defineComponent({
  emits: ["open-old"],

  props: {
    autoStore: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, ctx) {
    const refOldDialog = ref();
    const gStores = new GStores();

    const switchModeOld = () => {

      gStores.globalStore.setModeOld(!gStores.globalStore.modeOld);
      refOldDialog.value.hide();

    //   ctx.emit("choose-pat", e);
    };

    const show = () => {
      if (refOldDialog.value) {
        refOldDialog.value.show();
      }
    };

    return {
      refOldDialog,
      switchModeOld,
      gStores,
      show,
    };
  },
});
</script> 

<style lang="scss" scoped>
.modeOld {
  margin: 0 auto;
  .old-bg {
    text-align: center;
    image {
      margin-top: 80rpx;
      width: 304rpx;
      height: 610rpx;
    }
  }
  .old-title {
    margin-top: 56rpx;
    text-align: center;
    text {
      font-size: 36rpx;
      color: #111;
      line-height: 50rpx;
      font-weight: bold;
      margin-bottom: 16rpx;
      display: inline-block;
    }
    view {
      color: #444;
      width: 448rpx;
      font-size: 32rpx;
      line-height: 48rpx;
      margin: 0 auto;
    }
  }
  .btn {
    width: 90%;
    margin-top: 58px;
  }
}
</style>
