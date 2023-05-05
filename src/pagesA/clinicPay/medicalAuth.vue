<template>
  <view class="g-page color-111">
    <view class="g-container">
      <view class="head-bg" />

      <view class="box-layout">
        <view class="box box-fg mb16">
          <image
            class="power-hos-img"
            mode="widthFix"
            :src="$global.BASE_IMG + 'codePopup_img_@2x.png'"
          />

          <view class="box-fg-1">
            <g-flag typeFg="1102">
              <template #default="{ title, text }">
                <view class="f40 g-bold mb16">{{ title }}</view>

                <view class="color-444 f28">
                  <rich-text :nodes="text" />
                </view>
              </template>
            </g-flag>
          </view>
        </view>

        <view class="box">
          <view class="flex-between mb16">
            <view class="label text-no-wrap">授权给</view>
            <view class="value g-bold">湖州市中心医院</view>
          </view>

          <view class="flex-between">
            <view class="label text-no-wrap">项目</view>
            <view class="value g-bold">门诊医保支付</view>
          </view>
        </view>
      </view>
    </view>

    <view class="g-footer">
      <button @click="submit" class="btn btn-primary flex1">立即授权</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { joinQueryForUrl, setLocalStorage, getLocalStorage } from '@/common';

  import { usePayPage, TWxAuthorize } from './utils/clinicPayDetail';

  const { wxPayMoneyMedicalPlugin } = usePayPage();

  const submit = () => {
    // #ifdef  MP-WEIXIN
    wxPayMoneyMedicalPlugin(submitAction);
    // #endif
  };

  const submitAction = (auth: TWxAuthorize) => {
    console.log(auth);
  };

  onLoad(() => {});
</script>

<style lang="scss" scoped>
  .head-bg {
    position: absolute;
    left: 0;
    right: 0;
    z-index: -1;
    pointer-events: none;

    &::after {
      content: '';
      display: block;
      height: 400rpx;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      background: linear-gradient(
        0deg,
        rgba(41, 111, 255, 0) 1%,
        #296fff 38%,
        #296fff 96%
      );
    }
  }

  .box {
    background: #ffffff;
    border: 0.5px solid #e6e6e6;
    border-radius: 8px;
    min-height: 100rpx;
    position: relative;
    padding: 32rpx;
  }

  .box-fg {
    margin-top: 174rpx;
    .power-hos-img {
      width: 200rpx;
      height: 200rpx;
      position: absolute;
      top: 0;
      z-index: 1;
      transform: translate(-50%, -150rpx);
      left: 50%;
    }
  }

  .box-fg-1 {
    position: relative;
    z-index: 1;
  }

  .box-layout {
    padding: 32rpx;
  }
</style>
