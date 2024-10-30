<template>
  <view
    class="header-area"
    :class="{
      'simple-header': !headerConfig?.showHeader,
      transition: headerConfig?.transition,
    }"
  >
    <img
      :src="globalGl.BASE_IMG + 'intelMedicalAssist_bg.png'"
      class="w-full bg-img relative"
    />
    <!-- <view class="wihite-mask"></view> -->

    <img
      :src="globalGl.BASE_IMG + 'intelMedicalAssist_person.png'"
      class="w-full person-img relative"
    />
    <view class="header-hello">
      <view class="en f32 pb24">
        {{ `Hi,${gStores.userStore.patChoose.patientName || '用户'}` }}
      </view>
      <view class="cn f26">智能医助为您服务~</view>
    </view>
    <view class="person-say pt12 pb12 pl32 pr32">
      <view class="key-in">
        <text>您可以说出您的问题，我将为您解答哦</text>
      </view>
    </view>
    <view class="guess" :class="{ 'simple-mess': headerConfig?.isMessage }">
      <view class="guess-title pt24 pb12 pl24 f26">猜你想问的</view>
      <view class="guess-content">
        <view
          class="scroll"
          v-for="(askItem, index) in askArray"
          :key="index + 'scroll'"
        >
          <view class="scroll-row">
            <view
              class="row-item  f28"
              v-for="(item, index) in askItem"
              :key="item.value + index + 'scroll-row'"
            >
              {{ item.label }}
            </view>
            <view
              class="row-item  f28"
              v-for="(item, index) in askItem"
              :key="item.value + index + 'scroll-row2'"
            >
              {{ item.label }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import { computed, } from 'vue';
  import { GStores } from '@/utils';

  import globalGl from '@/config/global';
  import { type StyleConfigType } from '../utils/types';
  const gStores = new GStores();
  const props = defineProps<{
    guessAskList: any[];
    headerConfig: StyleConfigType;
  }>();
  const askArray = computed(() => {
    if (props.guessAskList && props.guessAskList.length) {
      return [
        props.guessAskList.filter((item, index) => {
          return index % 2 == 0;
        }),
        props.guessAskList.filter((item, index) => {
          return index % 2 == 1;
        }),
      ];
    } else {
      return [[], []];
    }
  });
</script>
<style lang="scss" scoped>
  .simple-header {
    height: 430rpx !important;
    // .wihite-mask {
    //   top: 310rpx !important;
    //   height: 130rpx !important;
    // }
    .bg-img {
      height: 410rpx !important;
    }
    .person-img {
      top: 20rpx !important ;
      width: 140rpx !important;
      height: 300rpx !important;
      left: 100% !important;
      transform: translateX(-150%) !important;
    }
    .header-hello {
      top: 20rpx !important;
    }
    .person-say {
      display: none;
    }
    .guess {
      top: 160rpx !important;
    }
    .simple-mess {
      .guess-content {
        display: none;
      }
      .guess-title {
        display: none;
      }
    }
  }
  .header-area {
    top: 0;
    left: 0;
    width: 100vw;
    height: 670rpx;
    // position: fixed;
    // .wihite-mask {
    //   z-index: 3;
    //   background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 20%, #fff);
    //   width: 100vw;
    //   position: fixed;
    //   top: 560rpx;
    //   left: 0;
    //   height: 140rpx;
    // }
    .bg-img {
      width: 100vw;
      position: fixed;
      height: 640rpx;
    }
    .person-img {
      width: 240rpx;
      height: 500rpx;
      // max-width: 250rpx;
      // max-height: 550rpx;
      position: fixed;
      z-index: 2;
      left: 50%;
      transform: translateX(-50%);
      top: 20rpx;
    }
    .header-hello {
      position: fixed;
      left: 50rpx;
      top: 50rpx;
      .en {
        text-align: left;
        color: #00194c;
        line-height: 50rpx;
      }
      .cn {
        color: #00194c;
        text-align: left;
        line-height: 28rpx;
      }
    }
    .person-say {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 24rpx;
      backdrop-filter: blur(10px);
      font-size: 1em;
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      top: 250rpx;
      z-index: 3;
      color: #000;
      //   font-weight: 600;
      @keyframes typing {
        from {
          width: 0rpx;
        }
      }
      @keyframes blink-caret {
        50% {
          border-color: transparent;
        }
      }
      .key-in {
        height: 1.1em;
        overflow: hidden;
        white-space: nowrap;
        width: 17em;
        animation: typing 2s steps(17) infinite,
          blink-caret 0.5s steps(1) infinite;
        animation-iteration-count: 1 !important;
      }
    }
    .guess {
      border-top-right-radius: 24rpx;
      border-top-left-radius: 24rpx;
      backdrop-filter: blur(10px);
      position: fixed;
      z-index: 2;
      height: 270rpx;
      top: 390rpx;
      width: 100vw;
      .guess-title {
      }
      .guess-content {
        height: 250rpx;
        .scroll {
          position: relative;
          display: flex;
          width: 100vw;
          overflow: hidden;
          height: 80rpx;
          .paused {
            animation-play-state: paused;
          }
          @keyframes animate {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .row-item {
            border: 2rpx solid rgba(255,255,255,0.50);
            background: rgba(255,255,255,0.20);
            display: inline-block;
            margin: 15rpx;
            padding: 10rpx 20rpx;
            z-index: 4;
            border-radius: 24rpx;
            backdrop-filter: blur(20px);
          }
          :active {
            animation-play-state: paused;
          }
          .scroll-row {
            width: fit-content;
            white-space: nowrap;
            left: 0;
            position: absolute;
            animation: animate 10s linear infinite;
          }
        }
      }
    }
  }
  .transition {
    .simple-header {
      transition: 0.5s;
    }
    .wihite-mask {
      transition: 0.5s;
    }
    .bg-img {
      transition: 0.5s;
    }
    .person-img {
      transition: 0.5s;
    }
    .header-hello {
      transition: 0.5s;
    }
    .person-say {
      transition: 0.5s;
    }
    .guess {
      transition: 0.5s;
    }
    .guess-content {
      transition: 0.5s;
    }
    .guess-title {
      transition: 0.5s;
    }
  }
</style>
