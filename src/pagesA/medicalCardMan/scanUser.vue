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
            <view class="f40 g-bold mb16">温馨提示</view>

            <view class="color-444 f28">
              <rich-text
                :nodes="`需要授权信息给${globalGl.systemInfo.name}, 用于添加就诊人`"
              />
            </view>

            <!-- <g-flag typeFg="1102">
              <template #default="{ title, text }">
                <view class="f40 g-bold mb16">{{ title }}</view>

                <view class="color-444 f28">
                  <rich-text :nodes="text" />
                </view>
              </template>
            </g-flag> -->
          </view>
        </view>

        <!-- <view class="box">
          <view class="flex-between mb16">
            <view class="label text-no-wrap">授权给</view>
            <view class="value g-bold">{{ globalGl.systemInfo.name }}</view>
          </view>

          <view class="flex-between">
            <view class="label text-no-wrap">功能</view>
            <view class="value g-bold">添加就诊人</view>
          </view>
        </view> -->
      </view>
    </view>

    <g-message />

    <view class="g-footer">
      <g-login
        @handler-login="
          setLocalStorage({
            getNoPublicOpenIdOnly: '1',
          })
        "
        @handler-next="handlerLoginAfter"
        class="flex1"
        only-login
      >
        <button @click="goAddPage" class="btn btn-primary flex1">
          立即授权
        </button>
      </g-login>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { GStores, LoginUtils, PatientUtils, wait } from '@/utils';
  import globalGl from '@/config/global';
  import { setLocalStorage } from '@/common/useToken';

  const gStores = new GStores();
  const goAddPage = async () => {
    uni.reLaunch({
      url: '/pagesA/medicalCardMan/scanUserAdd',
    });
  };

  const handlerLoginAfter = async () => {
    if (gStores.globalStore.herenId) {
      await new PatientUtils().getPatCardList();
    }

    goAddPage();
  };

  onMounted(async () => {
    await wait(200);
    uni.hideLoading();
    if (gStores.globalStore.isLogin) {
      goAddPage();
    }
  });

  onLoad(() => {
    uni.showLoading({ title: '加载中'});;
  });
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
        var(--hr-brand-color-6) 38%,
        var(--hr-brand-color-6) 96%
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
