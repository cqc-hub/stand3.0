<template>
  <view class="">
    <uni-popup ref="popup" @change="change">
      <view class="popup-content">
        <image
          :src="$global.BASE_IMG + 'v3_doctor_bg_share.png'"
          class="head-bg"
          :style="{
            height: bgHeadHeight,
          }"
        />

        <view class="p32 content">
          <view class="head flex-between">
            <view class="doc-info">
              <view class="g-bold f48 mb12">王柏恒</view>

              <view class="doc-honor flex-normal">
                <view class="doc-honor-item text-no-wrap f24 color-blue">
                  副主任医师
                </view>

                <view class="doc-honor-item text-no-wrap f24 color-blue">
                  副主任
                </view>

                <view class="doc-honor-item text-no-wrap f24 color-blue">
                  副主任医师副主任医师副主任医师
                </view>
              </view>
            </view>

            <image
              :src="'/static/image/order/order-doctor-avatar.png'"
              class="doc-avatar"
              mode="aspectFill"
            />
          </view>

          <view class="f24 g-break-word text-ellipsis doc-pos">
            浙江省人民医院·口腔科
          </view>

          <view id="doc-goodat" class="doc-goodat p32 g-border mt24">
            <view
              class="g-break-word text-ellipsis doc-goodat-content color-444 f28"
            >
              <image
                :src="$global.BASE_IMG + 'v3_doctor_card_major.png'"
                class="doc-major-goodat"
                mode="widthFix"
              />
              <text>
                口腔科副主任，2002年毕业于浙江大学口腔系，口腔正畸硕士，副主任医师，硕士生导师，浙江省
                口腔科副主任，2002年毕业于浙江大学口腔系，口腔正畸硕士，副主任医师，硕士生导师，浙江省
              </text>
            </view>
          </view>
        </view>

        <!--  transform: ` translateY(-${bgHeadHeight})`, -->
        <view class="p32 content-tail">
          <view class="tail-container g-flex-rc-cc">
            <view class="g-border qr-code">
              <w-qrcode :options="options" />
            </view>

            <view class="color-888 f24 mt16 share-label">
              用微信/支付宝扫描二维码 关注我吧
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref, nextTick } from 'vue';

  const change = () => {};
  const popup = ref<any>('');
  const bgHeadHeight = ref('400rpx');

  const show = () => {
    popup.value.open('center');
  };

  const options = ref({
    // 二维码
    size: 200,
    code: 'cqc233fkjls',
  });

  defineExpose({
    show,
  });
</script>

<style lang="scss" scoped>
  .popup-content {
    width: calc(100vw - 90rpx);
    transform: translateY(-200rpx);
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);

    .head-bg {
      width: 100%;
      position: absolute;
      z-index: 2;
    }

    .content {
      position: relative;
      z-index: 2;
      padding-top: 80rpx !important;

      .head {
        align-items: flex-start;

        .doc-info {
          flex: 1;

          .doc-honor {
            flex-wrap: wrap;

            .doc-honor-item {
              padding: 5rpx 12rpx;
              background: var(--hr-brand-color-2);
              border-radius: 4rpx;
              margin-right: 8rpx;
              margin-bottom: 8rpx;
            }
          }
        }

        .doc-avatar {
          width: 123rpx;
          height: 123rpx;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid rgba(255, 255, 255, 0.5);
        }
      }

      .doc-pos {
        -webkit-line-clamp: 2;
      }

      .doc-goodat {
        // min-height: 120rpx;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
        .doc-goodat-content {
          -webkit-line-clamp: 3;
        }
      }
    }

    .content-tail {
      transform: translateY(-200rpx);
      background-color: #fff;
      min-height: 420rpx;
      position: absolute;
      right: 0;
      left: 0;
      z-index: 1;
      border-radius: 0 0 12px 12px;

      .tail-container {
        position: relative;
        top: 180rpx;
        flex-direction: column;

        .qr-code {
          padding: 12rpx;
          border-radius: 16rpx;
          // #ifdef MP-ALIPAY
          padding-bottom: 3rpx;
          // #endif
        }

        .share-label {
          padding-bottom: 64rpx;

          &::after {
            content: '';
            display: block;
            height: 64px;
            width: 1px;
          }
        }
      }
    }
  }

  .doc-major-goodat {
    width: 60rpx;
    position: relative;
    // #ifdef MP-ALIPAY
    margin-right: 12rpx;
    // #endif
  }
</style>
