<template>
  <view class="">
    <uni-popup :duration="50" @maskClick="close" isMaskClick ref="popup">
      <!-- #ifdef MP-WEIXIN || H5 -->
      <view
        :style="{
          'padding-top': `${offsetHeight}px`,
          '--arrow-right': `${arrowOffsetRight}px`,
        }"
        class="flex flex-between pr32"
        @click="hide"
      >
        <view />
        <view
          @click.stop
          class="bg-white rounded container relative f24 color-444"
        >
          <view class="container1 pb32 pr32 pl32 pt32">
            <view class="flex mb24">
              <view
                class="bg-blue text-no-wrap rounded-xl color-fff tag flex items-center justify-center mr16"
              >
                1
              </view>
              <view class="flex-1">
                <view class="font-semibold flex flex-wrap mb20">
                  <text class="mr8">点击右上角</text>
                  <img
                    :style="{
                      width: '28px',
                      height: '20px',
                    }"
                    :src="`${globalGl.BASE_IMG}stand3-wx-home-navmunu-more.png`"
                    class="mr8"
                  />
                  <text class="mr8">选择翻译</text>
                </view>

                <img
                  :src="`${globalGl.BASE_IMG}stand3-wx-home-navmunu-translate1.png`"
                  class="img-width"
                  mode="widthFix"
                />
              </view>
            </view>

            <view class="flex mb24">
              <view
                class="bg-blue text-no-wrap rounded-xl color-fff tag flex items-center justify-center mr16"
              >
                2
              </view>
              <view class="flex-1">
                <view class="flex flex-wrap mb20 font-semibold">
                  <text class="">点击更换语言</text>
                </view>

                <img
                  :src="`${globalGl.BASE_IMG}stand3-wx-home-navmunu-translate2.png`"
                  mode="widthFix"
                  class="img-width"
                />
              </view>
            </view>

            <view class="flex mb24">
              <view
                class="bg-blue text-no-wrap rounded-xl color-fff tag flex items-center justify-center mr16"
              >
                3
              </view>
              <view class="flex-1">
                <view class="flex flex-wrap mb20 font-semibold">
                  <text class="">选择语言，点击完成</text>
                </view>

                <img
                  :src="`${globalGl.BASE_IMG}stand3-wx-home-navmunu-translate3.png`"
                  class="img-width"
                  mode="widthFix"
                />
              </view>
            </view>

            <view class="flex mb24">
              <view
                class="bg-blue text-no-wrap rounded-xl color-fff tag flex items-center justify-center mr16"
              >
                4
              </view>
              <view class="flex-1">
                <view class="font-semibold flex flex-wrap mb20">
                  <text class="mr8">如需切回中文，点击</text>
                  <img
                    :style="{
                      width: '28px',
                      height: '20px',
                    }"
                    :src="`${globalGl.BASE_IMG}stand3-wx-home-navmunu-more.png`"
                    class="mr8"
                  />
                  <text class="mr8">选择取消翻译</text>
                </view>

                <view class="font-semibold flex flex-wrap mb20">
                  <text class="mr8">To switch back to Chinese,tap</text>
                  <img
                    :style="{
                      width: '28px',
                      height: '20px',
                    }"
                    :src="`${globalGl.BASE_IMG}stand3-wx-home-navmunu-more.png`"
                    class="mr8"
                  />
                  <text class="mr8">and choose Cancel Translation</text>
                </view>

                <img
                  :src="`${globalGl.BASE_IMG}stand3-wx-home-navmunu-translate4.png`"
                  class="img-width"
                  mode="widthFix"
                />
              </view>
            </view>

            <view class="">
              <view @click="hide" class="btn btn-primary f28">
                知道了，去试试
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- #endif -->
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import globalGl from '@/config/global';

  const popup = ref('' as any);
  const offsetHeight = ref(120);
  const arrowOffsetRight = ref(35);

  const close = () => {};
  const initPosition = () => {
    // #ifdef MP-WEIXIN
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    console.log(menuButtonInfo);
    const { height, top, width } = menuButtonInfo;

    offsetHeight.value = height + top + 12;
    arrowOffsetRight.value = width - 44;
    // #endif
  };

  const show = () => {
    initPosition();
    popup.value.open('top');
  };

  const hide = () => {
    popup.value.close();
  };

  defineExpose({
    show,
  });

  onLoad(async () => {});
</script>

<style lang="scss" scoped>
  .img-width {
    width: max(70%, 328rpx);
  }
  .container {
    width: 80%;

    &::after {
      content: '';
      position: absolute;
      top: -9px;
      right: var(--arrow-right);
      border-width: 0 15px 10px 15px;
      border-style: solid;
      border-color: transparent transparent #fff transparent;
      border-radius: 12px;
    }

    .container1 {
      max-height: 80vh;
      overflow-y: scroll;
    }

    .tag {
      width: 32rpx;
      height: 32rpx;
    }
  }
</style>
