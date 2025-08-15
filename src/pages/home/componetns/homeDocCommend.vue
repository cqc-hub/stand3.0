<template>
  <view
    :style="{
      'background-image': `url(${
        globalGl.BASE_IMG +
        `stand3-home-doc-recommend-bg${
          gStores.globalStore.isTcmStyle ? '-tcm' : ''
        }.png`
      })`,
    }"
    class="bg container-doc flex flex-col"
  >
    <view class="pt32 pl32 pb30 flex items-center">
      <image
        :src="
          globalGl.BASE_IMG +
          `stand3-home-doc-recommend-icon-bg${
            gStores.globalStore.isTcmStyle ? '-tcm' : ''
          }.png`
        "
        mode="scaleToFill"
        class="icon-bg mr12"
      />

      <text class="f36 font-semibold">热门医生推荐</text>
    </view>

    <swiper
      class="flex-1"
      :indicator-dots="list.length > 1"
      @change="change"
      :current="swiperDotIndex"
      next-margin="40rpx"
      circular
    >
      <view class="pl16 h-full">
        <swiper-item
          v-for="(item, index) in list"
          @click="docCLick(item)"
          :key="index"
          class="h-full"
        >
          <view class="item-doc bg-white mr16 p32">
            <view class="flex items-start mb24 pb24 doc-info">
              <image
                :src="
                  item.docPhoto ||
                  `/static/image/order/order-doctor-avatar${
                    gStores.globalStore.isTcmStyle ? '-tcm' : ''
                  }.png`
                "
                class="doc-info-avatar mr24"
                mode="aspectFill"
              />
              <view>
                <view>
                  <text class="f36 font-semibold mr16">{{ item.docName }}</text>
                  <text class="color-888 f28">{{ item.docTitleName }}</text>
                </view>

                <view class="color-444 f28">{{ item.hosName }}</view>
              </view>
            </view>

            <view class="flex">
              <image
                :src="
                  $global.BASE_IMG +
                  `v3_doctor_card_major${
                    gStores.globalStore.isTcmStyle ? '-tcm' : ''
                  }.png`
                "
                class="doc-major-goodat mr12"
                mode="widthFix"
              />

              <view class="flex-1 text-ellipsis f28 color-888">
                {{ item.goodAt || '暂无数据' }}
              </view>
            </view>
          </view>
        </swiper-item>
      </view>
    </swiper>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import globalGl from '@/config/global';
  import { joinQueryForUrl } from '@/common';
  import { GStores } from '@/utils';

  defineProps<{
    list: any[];
  }>();

  const current = ref(0);
  const swiperDotIndex = ref(0);
  const gStores = new GStores();

  const change = (e) => {
    current.value = e;
  };

  const docCLick = (item) => {
    const { hosDocId, hosId, hosDeptId } = item;
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/DoctorDetails', {
        hosDocId,
        hosId,
        hosDeptId,
      }),
    });
  };
</script>

<style lang="scss" scoped>
  .container-doc {
    height: 428rpx;
  }

  .bg {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: right 0 bottom 0;
  }

  .icon-bg {
    height: 54rpx;
    width: 54rpx;
  }

  .item-doc {
    border: 1px solid #f3f3f3;
    border-radius: 8px;
  }

  .doc-info-avatar {
    width: 48px;
    height: 48px;
    border: 0.5px solid #dddddd;
    border-radius: 50%;
  }

  .doc-major-goodat {
    width: 60rpx;
    position: relative;
    top: 5rpx;
    // #ifdef  MP-WEIXIN
    top: 8rpx;
    // #endif
  }

  .doc-info {
    border-bottom: 1px solid #f3f3f3;
  }
</style>
