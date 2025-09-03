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
    :class="{
      'container-doc': !is1001035,
    }"
    class="bg flex flex-col"
  >
    <view class="pt32 pl32 pb30 flex items-center justify-between">
      <view class="flex items-center">
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

        <text v-if="is1001035" class="f36 font-semibold">名医推荐</text>
        <text v-else class="f36 font-semibold">热门医生推荐</text>
      </view>

      <view v-if="is1001035" @click="goDocList" class="color-666 f28 pr32">
        <text>查看全部</text>
        <text class="iconfont">&#xe66b;</text>
      </view>
    </view>

    <scroll-view v-if="is1001035" scroll-x class="">
      <view class="flex pb32">
        <view
          v-for="(item, index) in list"
          :key="index"
          :class="{
            pl16: !index,
            pr16: index === list.length - 1,
          }"
          class="mr36"
          @click="docCLick(item)"
        >
          <image
            :src="
              item.docPhoto ||
              `/static/image/order/order-doctor-avatar${
                gStores.globalStore.isTcmStyle ? '-tcm' : ''
              }.png`
            "
            lazy-load
            class="doc-info-avatar-1"
            mode="aspectFill"
          />

          <view class="font-semibold text-center">
            {{ item.docName }}
          </view>

          <view
            v-if="item.docTitleName || item.docJobName"
            class="f24 text-center doc-title-name-1"
          >
            <text
              v-for="n in getNameArr(item.docJobName || item.docTitleName)"
              :key="n"
              class="text-no-wrap"
            >
              {{ n }}
            </text>
          </view>

          <view v-if="item.deptName" class="f28 text-center color-444">
            {{ item.deptName }}
          </view>
        </view>
      </view>
    </scroll-view>
    <swiper
      v-else
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
  import { computed, ref } from 'vue';

  import globalGl from '@/config/global';
  import { joinQueryForUrl } from '@/common';
  import { GStores } from '@/utils';

  defineProps<{
    list: any[];
  }>();

  const current = ref(0);
  const swiperDotIndex = ref(0);
  const gStores = new GStores();
  const is1001035 = computed(() => gStores.globalStore.sysCode === '1001035');

  const change = (e) => {
    current.value = e;
  };

  const goDocList = () => {
    uni.navigateTo({
      url: '/pagesD/recommendDocList/recommendDocList',
    });
  };

  const getNameArr = (name: string) => {
    if (!name) {
      return [];
    }

    return name.split(' ');
  };

  const docCLick = (item) => {
    const { hosDocId, hosId, hosDeptId } = item;
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/DoctorDetails', {
        hosDocId,
        // hosId,
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

  .doc-info-avatar-1 {
    border-radius: 500px;
    width: 64px;
    height: 64px;
    border: 0.5px solid #dddddd;
  }
  .doc-title-name-1 {
    color: #a4695b;
    border: 0.5px solid #a4695b;
    border-radius: 2px;
  }
</style>
