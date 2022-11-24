<template>
  <view>
    <view class="banner-grid">
      <!-- 首页一个入口  leftFunctionList >0 且  functionList =0 -->
      <view
        class="uni-margin-wrap"
        v-if="
          props.leftFunctionList.length > 0 && props.functionList.length == 0
        "
      >
        <swiper
          class="swiper"
          circular
          :autoplay="autoplay"
          :indicator-dots="props.leftFunctionList.length > 0 ? true : false"
        >
          <swiper-item
            v-for="(item, i) in props.leftFunctionList"
            :key="i"
            @tap="gotoPath(item)"
          >
            <image mode="scaleToFill" :src="item.iconfont" />
          </swiper-item>
        </swiper>
      </view>
      <!-- 常规banner+三个入口 首页 三个纯入口 支持第一个是否是banner -->
      <view class="banner2" v-if="props.functionList.length > 0">
        <view :class="props.functionList.length > 2 ? 'parent1' : 'parent'">
          <!-- 只有一个入口 -->
          <!-- 左边是一个的时候根据是否有图片来判断展示入口还是banner -->
          <view
            :class="`banner-back2 ${
              props.functionList.length > 2 ? 'view1' : 'view6'
            } ${props.leftFunctionList[0].iconfont ? 'no-border' : 'banner-common2'}`"
            :style="props.functionList.length == 1 ? '' : 'height:auto'"
            v-if="props.leftFunctionList.length == 1"
            @tap="gotoPath(props.leftFunctionList[0])"
          >
            <block v-if="props.leftFunctionList[0].iconfont">
              <image
                mode="scaleToFill"
                :src="props.leftFunctionList[0].iconfont"
              />
            </block>
            <block v-else>
              <view class="flex-between">
                <text class="text-ellipsis">
                  {{ props.leftFunctionList[0].title }}
                </text>
                <view class="iconfont icon-size2">&#xe6ca;</view>
              </view>
              <text class="text-ellipsis details">
                {{ props.leftFunctionList[0].detail }}
              </text>
              <view class="iconfont icon-size-back1">&#xe6a5;</view>
            </block>
          </view>
          <!-- 第一组是多个banner -->
          <view v-else class="view1">
            <swiper
              class="swiper"
              circular
              :autoplay="autoplay"
              indicator-dots="true"
            >
              <swiper-item
                v-for="(item, i) in props.leftFunctionList"
                :key="i"
                @tap="gotoPath(item)"
              >
                <image mode="scaleToFill" :src="item.iconfont" />
              </swiper-item>
            </swiper>
          </view>
          <!-- 右边是一个数据还是多个数据 -->
          <block v-if="props.functionList.length == 1">
            <view
              v-for="(item, i) in props.functionList"
              :key="i"
              :class="`view5 banner-back${i + 1} banner-common2`"
              @tap="gotoPath(item)"
            >
              <view class="flex-between">
                <text class="text-ellipsis">{{ item.title }}</text>
                <view :class="`iconfont icon-size${i + 1}`">&#xe6ca;</view>
              </view>
              <text class="text-ellipsis details">
                {{ item.detail }}
              </text>
              <view :class="`iconfont icon-size-back${i + 1}`">&#xe6a5;</view>
            </view>
          </block>
          <block v-else>
            <view
              v-for="(item, i) in props.functionList"
              :key="i"
              :class="`view${i + 2} banner-back${i + 1} banner-common`"
              :style="
                props.leftFunctionList.length == 1 &&
                props.functionList.length == 2
                  ? 'margin-top:0'
                  : ''
              "
              @tap="gotoPath(item)"
            >
              <view class="flex-between">
                <text>{{ item.title }}</text>
                <view :class="`iconfont icon-size${i + 1}`">&#xe6ca;</view>
              </view>
              <view :class="`iconfont icon-size-back${i + 1}`">&#xe6a5;</view>
            </view>
          </block>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { withDefaults, ref, computed } from 'vue';
  import { useCommonTo } from '@/common/checkJump';
  // 2/3
  // const type = ref(2);

  const props = withDefaults(
    defineProps<{
      leftFunctionList: IRoute[];
      functionList: IRoute[];
    }>(),
    {
      //左侧轮播数组
      leftFunctionList: () => [
        {
          title: '住院助手',
          url: '/xxx',
          iconfont: 'ico_sy_calendar1',
        },
      ],
      //右侧数组
      functionList: () => [
        {
          title: '住院助手',
          url: '/xxx',
          iconfont: 'ico_sy_calendar1',
        },
      ],
    }
  );
  const autoplay = ref(true);
  //跳转对应地址
  const gotoPath = (item) => {
    useCommonTo(item);
  };
</script>

<style lang="scss" scoped>
  .banner-grid {
    .uni-margin-wrap {
      width: 100%;
      height: 160rpx;
    }

    swiper-item {
      display: block;

      image {
        width: 100%;
        will-change: transform;
      }
    }

    // 公用样式
    .flex-between{
      width: 100%;
    }

    .swiper {
      height: 100%;
      border-radius: 16rpx;

      image {
        height: 100%;
        will-change: transform;
      }
    }
    //2倍高度
    .banner-common2 {
      height: 160rpx;
      box-sizing: border-box;
      border-radius: 16rpx;
      font-size: var(--hr-font-size-s);
      font-weight: var(--h-weight-2);
      color: var(--hr-neutral-color-10);
      padding: 32rpx 16rpx 32rpx 32rpx;
    } 
    //标准高度
    .banner-common {
      height: 91rpx;
      box-sizing: border-box;
      border-radius: 16rpx;
      font-size: var(--hr-font-size-s);
      font-weight: var(--h-weight-2);
      color: var(--hr-neutral-color-10);
      padding: 0 16rpx 0 32rpx;
      display: flex;
      overflow: hidden;
    }
    // 蓝色
    .icon-size1 {
      font-size: var(--h-size-46);
      color: var(--hr-brand-color-6);
      font-weight: 400;
    }
    .banner-back1 {
      background: #eef3ff;
      border: 2rpx solid #d9e5ff;
    }
    // 绿色
    .icon-size2 {
      font-size: var(--h-size-46);
      color: var(--hr-success-color-6);
      font-weight: 400;
    }
    .icon-size3 {
      font-size: var(--h-size-46);
      color: var(--hr-brand-color-6);
      font-weight: 400;
    }
    .banner-back2 {
      background: #effbfa;
      border: 2rpx solid #cfeae6;
    } 
    .banner-back3 {
      background: #eef3ff;
      border: 2rpx solid #d9e5ff;
    }
    // 背景样式
    .icon-size-back1 {
      color: var(--hr-brand-color-6);
      font-size: 90rpx;
      font-weight: 400;
      opacity: 0.15;
      position: absolute;
      right: 0;
      bottom: -6rpx;
    }
    .icon-size-back2 {
      color: var(--hr-success-color-6);
      font-size: 90rpx;
      font-weight: 400;
      opacity: 0.15;
      position: absolute;
      right: 0;
      bottom: -6rpx;
    }

    .icon-size-back3 {
      color: var(--hr-brand-color-6);
      font-size: 90rpx;
      font-weight: 400;
      opacity: 0.15;
      position: absolute;
      right: 0;
      bottom: -6rpx;
    }

    // 副标题
    .details {
      font-size: var(--hr-font-size-xxxs) !important;
      color: var(--hr-neutral-color-7);
      margin-top: 12rpx;
    }
    .text-ellipsis {
      -webkit-line-clamp: 2;
      font-size: 32rpx;
    }

    .banner2 {
      image {
        width: 100%;
        height: 100%;
        will-change: transform;
      }
      .parent {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, 1fr);
        grid-column-gap: 12rpx;
        grid-row-gap: 0;
      }

      //  3个的样式
      .parent1 {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(3, 1fr);
        grid-column-gap: 12rpx;
        grid-row-gap: 0;
      }

      .view1 {
        grid-area: 1 / 1 / 4 / 3;
        position: relative;
      }
      .view2 {
        grid-area: 1 / 3 / 2 / 5;
        margin-bottom: 6rpx;
        position: relative;
      }
      .view3 {
        margin-top: 6rpx;
        grid-area: 2 / 3 / 3 / 5;
        position: relative;
      }
      .view4 {
        margin-top: 12rpx;
        grid-area: 3 / 3 / 4 / 5;
        position: relative;
      }
      //右边只有一个数据的时候 2行四列
      .view5 {
        grid-area: 1 / 3 / 3 / 5;
        position: relative;
      }
      .view6 {
        grid-area: 1 / 1 / 3 / 3;
        margin-bottom: 6rpx;
        position: relative;
      }
    }
    .no-border{
      background: transparent;
      border: none;
    }
  }
</style>
