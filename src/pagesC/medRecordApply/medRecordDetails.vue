<template>
  <view class="g-page">
    <view class="g-container">
      <view class="container-box g-border mb16">
        <Address-Box />
      </view>

      <view class="container-box g-border mb16 box-padding">
        <view class="g-bold f36">请上传本人身份证</view>

        <view class="mt24 flex-normal">
          <view
            @click="chooseIdCardFront"
            class="up-idcard g-border g-flex-rc-cc"
          >
            <image v-if="idCardImg.front" :src="dealImg(idCardImg.front)" />
            <view v-else class="g-flex-rc-cc flex-column f24">
              <view class="iconfont camera-icon">&#xe6be;</view>
              <view>身份证人像页</view>
            </view>
          </view>

          <view
            @click="chooseIdCardBack"
            class="up-idcard g-border g-flex-rc-cc"
          >
            <image v-if="idCardImg.back" :src="dealImg(idCardImg.back)" />

            <view v-else class="g-flex-rc-cc flex-column f24">
              <view class="iconfont camera-icon">&#xe6be;</view>
              <view>身份证国徽页</view>
            </view>
          </view>
        </view>
      </view>

      <view class="container-box g-border mb16 box-padding">
        <view class="g-bold f36">住院记录</view>

        <view class="flex-normal patient-info color-light-dark f28">
          <text class="patient-name g-border-right">
            {{ getUserShowLabel(gStores.userStore.patChoose) }}
          </text>

          <text>朝晖院区</text>
        </view>

        <view class="add-btn color-blue g-flex-rc-cc">
          <view class="iconfont add-icon">&#xe6fb;</view>
          <view class="f28 g-bold">手动添加记录</view>
        </view>
      </view>
    </view>

    <view class="g-footer">
      <button class="btn g-border btn-primary dialog-btn">我知道了</button>
    </view>

    <canvas
      v-show="false"
      :width="imgCanvas.imgWidth"
      :height="imgCanvas.imgHeight"
      style="opacity: 0; position: absolute; pointer-events: none"
      id="canvasForBase64"
    />

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import AddressBox from './components/addressBox.vue';
  import { chooseImg, GStores } from '@/utils';
  import { getUserShowLabel } from '@/stores';

  const gStores = new GStores();
  const imgCanvas = ref({
    imgWidth: 0,
    imgHeight: 0,
  });

  const idCardImg = ref({
    front: '',
    back: '',
  });

  const chooseIdCardFront = async () => {
    const res = await chooseImg({ imgCanvas });

    if (res.success) {
      idCardImg.value.front = res.base64;
    }
  };

  const chooseIdCardBack = async () => {
    const res = await chooseImg({ imgCanvas });

    if (res.success) {
      idCardImg.value.back = res.base64;
    }
  };

  const dealImg = (img: string) => {
    if (img.startsWith('http')) {
      return img;
    } else {
      return 'data:image/png;base64,' + img;
    }
  };
</script>

<style lang="scss" scoped>
  .g-container {
    padding: 0 32rpx;

    .container-box {
      border-radius: 8px;
      background-color: #fff;

      &:first-child {
        margin-top: 24rpx;
      }

      .up-idcard {
        flex: 1;
        height: 180rpx;
        border-radius: 8px;

        border-style: dashed;

        &:first-child {
          margin-right: 16rpx;
        }

        .camera-icon {
          font-size: 60rpx;
          line-height: 55rpx;
        }

        image {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
      }

      .patient-info {
        .patient-name {
          padding-right: 12rpx;
          margin-right: 12rpx;
        }
      }

      .add-btn {
        padding: 14rpx 0;
        margin-top: 16rpx;
        .add-icon {
          font-size: var(--hr-font-size-xl);
          margin-right: 5rpx;
        }
      }
    }
  }

  .box-padding {
    padding: 32rpx;
  }

  .g-footer {
    display: flex;

    .btn {
      flex: 1;
    }
  }
</style>
