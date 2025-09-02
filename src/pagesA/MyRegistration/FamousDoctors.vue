<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <view
      class="bg"
      :style="{
        'background-image': `url(${$global.BASE_IMG + 'mingyi@3x.png'})`,
      }"
    >
      <view class="g-container">
        <view class="p16 text-box">
          为了让温州市民更加全面知晓并享受到优质的医疗资源，我们精心遴选温州各级公立医院的知名专家，并邀请杭州、上海以及国内其他地区知名医院的专家
          (团队)，通过定期在市、区县各公立医院线下坐诊，或开通线上诊疗、会诊等形式
          (具体出诊地点，详见专家详情页)，竭力为广大市民提供专业、贴心的医疗服务。
        </view>

        <view class="button-box">
          <view
            class="button-box-item"
            v-for="(btn, index) in doctorList"
            :key="`doctorBtn${index}`"
            @click="clickBtn(btn)"
            :class="index === 0 ? 'btn-plain' : 'confirm-btn'"
          >
            <view class="flex space-between items-center">
              <img class="icon" :src="$global.BASE_IMG + 'ico_sy_doctor@3x.png'" alt="" />
              <text class="f30">
                {{ btn.label }}
              </text>
            </view>
            <view class="iconfont icon-size2">&#xe6ca;</view>
          </view>
        </view>

        <view class="flex justify-center">
        <!-- <view class="submit-btn flex">
          <view class="iconfont">&#xe6b9;</view>
          <text>提出优化建议</text>
        </view> -->
     <view class="flex items-center bottom-box">
          <image :src="$global.BASE_IMG + 'jkwz_logo.png'" alt="" />
          <text class="ml8">温州市卫生健康委</text>
        </view>
        </view>

   
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
 import {
   type TBannerConfig,
   useTBanner,
   wait,
   GStores,
   previewImage,
   getSystemConfig,
 } from '@/utils';

   const gStores = new GStores();
   const doctorList = ref([
   {
     label: '温州名医',
     key: '11',
   },
   {
     label: '北京名医',
     key: '7',
   },
   {
     label: '上海名医',
     key: '8',
   },{
     label: '杭州名医',
     key: '9',
   },
   {
     label: '其他地区名医',
     key: '10',
   },
 ] as const);

  const clickBtn = async (btn) => {
    uni.navigateTo({
      url:`/pagesA/MyRegistration/DepartmentHosCard?famousDoctorType=${btn.key}`,
    });
 };
</script>

<style lang="scss" scoped>
.g-container {
  height: 100vh;
  padding: 32rpx;
  position: relative;
  z-index: 9;
  box-sizing: border-box;
}
.text-box {
  margin-top: 240rpx;
  background-color: #fff;
  color: #00194c;
  padding: 32rpx;
  border-radius: 16rpx;
  line-height: 60rpx;
  text-align: left;
  font-size: 32rpx;
}
.bg {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: right 0 bottom 0;
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 0;
}
.button-box {
  margin-top: 32rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.button-box-item {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 32rpx 24rpx;
  align-items: center;
  justify-content: space-between;
  height: 112rpx;
  box-sizing: border-box;
  background: #e9f0ff;
  border-radius: 16rpx;
  width: calc(50% - 20rpx);
  overflow: hidden;
  z-index: 1;

  text {
    color: #00194c;
    font-weight: bold;
    position: relative;
    z-index: 2;
  }
}

.button-box-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16rpx;
  background: linear-gradient(270deg, #ab51f5, #296fff);
  z-index: 0;
}

.button-box-item::after {
  content: '';
  position: absolute;
  top: 2rpx;
  left: 2rpx;
  right: 2rpx;
  bottom: 2rpx;
  border-radius: 14rpx;
  background: #e9f0ff;
  z-index: 1;
}

.icon {
  width: 48rpx;
  height: 48rpx;
  margin-right: 16rpx;
  z-index: 2;
}
.icon-size2 {
  font-size: 30rpx;
  color: var(--hr-brand-color-6);
  font-weight: 400;
    z-index: 2;
}
.submit-btn {
  width: 280rpx;
  height: 64rpx;
  background: #e9f0ff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 100rpx;
  box-sizing: border-box;

  .iconfont {
    font-size: 32rpx;
    color: var(--hr-brand-color-6);
    margin-right: 4px;
  }
  text {
    color: #296fff;
    line-height: 40rpx;
    font-size: 28rpx;
  }
}
.bottom-box {
  width: 100%;
  font-size: 24rpx;
  color: #999999;
  line-height: 34rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 30rpx;
  image {
    width: 48rpx;
    height: 48rpx;
  }
}
</style>
