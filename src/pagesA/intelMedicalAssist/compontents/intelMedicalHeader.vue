<template>
  <view
    class="header-area"
    :class="{
      'simple-header': !headerConfig?.showHeader,
      transition: headerConfig?.transition,
      'simple-mess': headerConfig?.isMessage || headerConfig?.historyMess,
    }"
  >
    <!-- #ifdef MP-WEIXIN -->
    <view class="navBar">
      <GCustomNavbar
        :title="headerConfig?.headerLineMenu !== 'homePage' ? '智能医助' : ''"
        :showBack="headerConfig?.headerLineMenu !== 'homePage'"
      >
        <template v-if="headerConfig?.headerLineMenu === 'homePage'">
          <g-tabs
            v-model:value="tabCurrent"
            :tabs="tabField"
            @change="tabChange"
            :bgColor="'#0000'"
            :lineScale="0"
            :allBlod="false"
            :transitionDuration="'0'"
          />
          <!--  <g-tabs
          v-show="tabField.length && tabField.length > 1 && !isModeMedicalHelp"
          v-model:value="tabCurrent"
          :tabs="tabField"
          :scroll="false"
          @change="tabChange"
          field="label"
          style="width: 100%"
        /> -->
        </template>
      </GCustomNavbar>
    </view>
    <!-- #endif -->

    <img
      :src="globalGl.BASE_IMG + 'intelMedicalAssist_bg.png'"
      class="w-full bg-img relative"
      id="bg-img"
    />
    <!-- <view class="wihite-mask"></view> -->
    <view class="person-img relative">
      <img
        v-if="gStores.globalStore.sysCode === '1001017'"
        :src="globalGl.BASE_IMG + 'intelMedicalAssist_person_1001017.png'"
        class="img-1001017"
      />
      <img
        v-else
        :src="globalGl.BASE_IMG + 'intelMedicalAssist_person.png'"
        class="w-full"
      />
    </view>

    <view class="header-hello">
      <view class="en f32 pb24 flex-normal">
        <!-- {{ `Hi,亲爱的用户` }} -->
        <view>
          {{
            `Hi,${gStores?.userStore?.patChoose?.patientName || '亲爱的用户'}`
          }}
        </view>
        <view
          @click="chooseAction"
          v-if="gStores?.userStore?.patChoose?.patientName"
        >
          <img
            :src="globalGl.BASE_IMG + 'intelMedica-swich.png'"
            class="w-full ml8"
          />
        </view>
      </view>
      <view class="cn f26">智能医助为您服务~</view>
    </view>
    <view class="person-say pt12 pb12 pl32 pr32">
      <view class="key-in">
        <text>您可以说出您的问题，我将为您解答哦</text>
      </view>
    </view>
    <view class="guess">
      <view
        class="f26 sroll-title"
        :style="{ opacity: !headerConfig?.historyMess ? 1 : 0 }"
      >
        <!-- 下拉查看历史消息 -->
      </view>
      <view class="guess-title pt24 pb12 pl24 f26">猜你想问的</view>
      <view class="guess-content">
        <view
          class="scroll"
          v-for="(askItem, index) in askArray"
          :key="index + 'scroll'"
        >
          <view class="scroll-row">
            <view
              @click="handleClickGuess(item)"
              class="row-item f28"
              v-for="(item, index) in askItem"
              :key="item.value + index + 'scroll-row'"
            >
              {{ item.value }}
            </view>
            <view
              @click="handleClickGuess(item)"
              class="row-item f28"
              v-for="(item, index) in askItem"
              :key="item.value + index + 'scroll-row2'"
            >
              {{ item.value }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <choose-pat-action ref="actionSheet" @choose-pat="choosePatHandler" />
  </view>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useTBanner, GStores } from '@/utils';
  import { joinQueryForUrl } from '@/common';
  import globalGl from '@/config/global';
  import { type StyleConfigType } from '../utils/types';
  import { popipHasShow, isPhoto, initWithMess } from '../utils/utils';
  import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';
  import GCustomNavbar from '@/components/g-custom-navbar/g-custom-navbar.vue';

  const gStores = new GStores();
  const actionSheet = ref<any>({});
  const props = defineProps<{
    guessAskList?: Array<{ label: string; value: string }>;
    headerConfig: StyleConfigType;
    isMess?: string;
  }>();
  const tabField = ['首页', '服务','我的'];
  const tabCurrent = ref(0);
  const emits = defineEmits(['click-guess']);

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

  const tabChange = (value) => {
    tabCurrent.value = value;
    if (value === 1) {
      let url = 'pages/home/home';
      useTBanner({
        type: 'self',
        path: url,
      });
    }else if (value === 2) {
      let url = 'pages/home/my';
      useTBanner({
        type: 'self',
        path: url,
      });
    }
  };
  const handleClickGuess = (guessItem) => {
    emits('click-guess', guessItem);
  };

  const chooseAction = () => {
    console.log('actionSheet', actionSheet.value);

    if (actionSheet.value) {
      actionSheet.value.show();
    }
  };

  const choosePatHandler = ({ item }) => {
    gStores.userStore.updatePatChoose(item);
    popipHasShow.value = false;
    isPhoto.value = true;
    props?.isMess && props?.isMess == '1' && initWithMess();
  };
</script>
<style lang="scss" scoped>
  .simple-header {
    /* #ifndef H5 */
    height: 590rpx !important;
    /* #endif */
    /* #ifdef H5 */
    height: 430rpx !important;
    /* #endif */
    // .wihite-mask {
    //   top: 310rpx !important;
    //   height: 130rpx !important;
    // }
    .bg-img {
      z-index: 1;
      /* #ifdef H5 */
      height: 410rpx !important;
      /* #endif */
      /* #ifndef H5 */
      height: 570rpx !important;
      /* #endif */
    }
    .person-img {
      /* #ifndef H5 */
      top: 180rpx !important ;
      /* #endif */
      /* #ifdef H5 */
      top: 20rpx !important ;
      /* #endif */
      width: 140rpx !important;
      height: 300rpx !important;
      left: 100% !important;
      overflow: hidden;
      transform: translateX(-150%) !important;
      image {
        width: 140rpx !important;
        height: 300rpx !important;
      }
      .img-1001017 {
        width: 140rpx !important;
        height: 160rpx !important;
        position: absolute;
        left: 4px !important;
        bottom: 16px !important;
      }
    }

    .header-hello {
      z-index: 2;
      /* #ifndef H5 */
      top: 180rpx !important ;
      /* #endif */
      /* #ifdef H5 */
      top: 20rpx !important ;
      /* #endif */
    }
    .person-say {
      display: none;
    }
    .guess {
      /* #ifndef H5 */
      top: 320rpx !important;
      /* #endif */
      /* #ifdef H5 */
      top: 160rpx !important ;
      /* #endif */
    }
  }
  .simple-mess {
    /* #ifndef H5 */
    height: 390rpx !important;

    /* #endif */
    /* #ifdef H5 */
    height: 240rpx !important;
    /* #endif */
    // .wihite-mask {
    //   top: 310rpx !important;
    //   height: 130rpx !important;
    // }
    .bg-img {
      /* #ifndef H5 */
      height: 370rpx !important;

      /* #endif */
      /* #ifdef H5 */
      height: 220rpx !important;
      /* #endif */
    }
    .person-img {
      /* #ifndef H5 */
      top: 180rpx !important ;
      /* #endif */
      /* #ifdef H5 */
      top: 20rpx !important ;
      /* #endif */
      width: 140rpx !important;
      height: 200rpx !important;
      overflow: hidden;
      left: 100% !important;
      transform: translateX(-150%) !important;
      image {
        width: 140rpx !important;
        height: 300rpx !important;
      }
      // .img-1001017{
      //   width: 140rpx !important;
      //   height: 140rpx !important;
      // }
    }
    .header-hello {
      /* #ifndef H5 */
      top: 180rpx !important ;
      /* #endif */
      /* #ifdef H5 */
      top: 50rpx !important ;
      /* #endif */
    }
    .person-say {
      display: none;
    }
    .guess {
      /* #ifdef H5 */
      top: 180rpx !important;
      /* #endif */
      /* #ifndef H5 */
      top: 340rpx !important;
      /* #endif */
      height: 50rpx !important;
      .sroll-title {
        transition: 0.5s;
        display: flex !important;
        font-weight: 600;
        line-height: 50rpx;
        justify-content: center;
        opacity: 1;
      }
    }
    .guess-content {
      display: none !important;
    }
    .guess-title {
      display: none !important;
    }
  }
  .header-area {
    top: 0;
    left: 0;
    width: 100vw;
    height: 800rpx;
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
    .navBar {
      position: fixed;
      top: 0;
      height: 160rpx;
      width: 100vh;
      z-index: 5;
    }
    .bg-img {
      width: 100vw;
      position: fixed;
      /* #ifndef H5 */
      height: 790rpx;
      /* #endif */
      /* #ifdef H5 */
      height: 630rpx;
      /* #endif */
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
      /* #ifdef H5 */
      top: 20rpx;
      /* #endif */
      /* #ifndef H5 */
      top: 180rpx;
      /* #endif */
      image {
        width: 240rpx;
        height: 500rpx;
      }
      .img-1001017 {
        width: 330rpx;
        height: 400rpx;
        position: absolute;
        left: -30rpx;
        bottom: 40px;
      }
    }
    .header-hello {
      position: fixed;
      left: 50rpx;
      /* #ifdef H5 */
      top: 50rpx;
      /* #endif */
      /* #ifndef H5 */
      top: 210rpx;
      /* #endif */
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
      image {
        width: 0.8em;
        height: 0.8em;
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
      /* #ifdef H5 */
      top: 250rpx;
      /* #endif */
      /* #ifndef H5 */
      top: 410rpx;
      /* #endif */

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
        height: 1.2em;
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
      // border-bottom-left-radius: 24rpx;
      backdrop-filter: blur(5px);
      background-color: rgba(255, 255, 255, 0.2);
      position: fixed;
      z-index: 3;
      height: 270rpx;
      /* #ifdef H5 */
      top: 390rpx;
      /* #endif */
      /* #ifndef H5 */
      top: 550rpx;
      /* #endif */

      width: 100vw;
      .sroll-title {
        display: none;
      }
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
            border: 2rpx solid rgba(255, 255, 255, 0.5);
            background: rgba(255, 255, 255, 0.2);
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
            animation: animate 20s linear infinite;
          }
        }
      }
    }
  }
  .transition {
    transition: 0.5s;
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
      image {
        transition: 0.5s;
      }
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
