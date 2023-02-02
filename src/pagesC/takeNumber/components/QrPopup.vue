<template>
  <view class="">
    <My-Popup :value="show" @update:value="changeShow">
      <view class="whole-box">
        <image
          :src="$global.BASE_IMG + 'stand3-take-number-robot.png'"
          class="robot-icon my-disabled"
        />

        <view class="box">
          <view
            class="content"
            :class="{
              'my-display-none': isHide,
            }"
          >
            <view class="color-888 f32 g-flex-rc-cc tip">请凭就诊码签到</view>

            <view class="qr-code g-flex-rc-cc flex-column">
              <w-barcode :options="barCodeOpt" />
              <view class="color-888 f28 mb40 mt16">{{ qrValue }}</view>
            </view>

            <view class="qr-code g-flex-rc-cc">
              <w-qrcode :options="qrCodeOpt" />
            </view>
          </view>
        </view>

        <view @click="changeShow(false)" class="g-flex-rc-cc">
          <view class="iconfont close-icon">&#xe6d5;</view>
        </view>
      </view>
    </My-Popup>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';

  import MyPopup from '@/components/uni-my-popup/uni-my-popup.vue';

  const props = defineProps<{
    qrValue: string;
    show: boolean;
  }>();
  const isHide = ref(true);

  const emits = defineEmits(['update:show']);

  const changeShow = (v) => {
    emits('update:show', v);
  };

  const qrCodeOpt = computed(() => {
    return {
      size: 320,
      code: props.qrValue,
    };
  });

  const barCodeOpt = computed(() => {
    return {
      width: 600, // 宽度 单位rpx
      height: 180, // 高度 单位rpx
      code: props.qrValue,
    };
  });

  watch(
    () => props.show,
    (v) => {
      if (v) {
        setTimeout(() => {
          isHide.value = !v;
        }, 300);
      } else {
        isHide.value = !v;
      }
    }
  );
</script>

<style lang="scss" scoped>
  .whole-box {
    position: relative;
  }

  .robot-icon {
    width: 260rpx;
    height: 260rpx;
    position: absolute;
    z-index: 2;
    top: -200rpx;
    left: 50%;
    transform: translateX(-50%);
  }

  .box {
    width: calc(100vw - 64rpx);
    background-color: #fff;
    border-radius: 8px;

    .content {
      position: relative;
      padding: 44rpx;

      .tip {
        margin-top: 30rpx;
        margin-bottom: 40rpx;
      }
    }
  }

  .close-icon {
    color: #fff;
    font-size: 70rpx;
    margin-top: 74rpx;
  }

  .qrcode-img {
    width: 320rpx;
    height: 320rpx;
  }
</style>
