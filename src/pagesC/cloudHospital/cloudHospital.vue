<template>
  <view class="cache">
    <view class="cache-img-container">
      <image
        mode="aspectFit"
        class="cache-img"
        :src="BASE_IMG + 'img_h5bg@3x.png'"
      />
    </view>
    <view class="cache-fixbottom">浙江和仁科技股份有限公司@技术支持</view>
  </view>
</template>

<script setup lang="ts">
  import { BASE_IMG } from '@/config/global';

  import { onLoad } from '@dcloudio/uni-app';
  import { joinQuery } from '@/common';
  import { useGlobalStore } from '@/stores';

  const globalStore = useGlobalStore();

  const gotoNext = (options) => {
    setTimeout(() => {
      uni.navigateTo({
        url: joinQuery('/pagesC/cloudHospital/cachePage', {
          ...options
        })
      });
    }, 1000);
  };
  onLoad((options) => {
    console.log(333, options);
    //先登录拦截
    if (options.loginInterception == '1') {
      if (!globalStore.isLogin) {
        uni.showToast({
          title: '未登录，请先登录!',
          icon: 'none'
        });
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/home/my'
          });
        }, 1000);
      } else {
        gotoNext(options);
      }
    } else {
      gotoNext(options);
    }
  });
</script>

<style scoped lang="scss">
  .cache {
    width: 100%;
    height: 100vh;
    background-color: #fff;

    .cache-img-container {
      display: flex;
      justify-content: center;
      position: relative;
      top: 240upx;
    }
    .cache-fixbottom {
      position: absolute;
      bottom: 144upx;
      width: 100%;
      text-align: center;

      font-size: 24upx;
      font-weight: 400;
      color: #999;
    }
  }
</style>
