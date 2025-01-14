<template>
  <view
    class="footer-area"
    :class="{
      transition: headerConfig?.transition,
      'stick-bottom': !headerConfig?.showHeader,
    }"
  >
    <view class="guess-server" :style="{ bottom: guessServerBottom }">
      <view class="guess-title pt24 pb12 pl24 f26">您可能需要以下服务</view>
      <view class="guess-content">
        <view class="guess-grid">
          <view
            class="grid-item"
            v-for="(item, index) in serverArray"
            :key="'grid-item' + index"
            @click="handleClickServer(item)"
          >
            <img :src="globalGl.BASE_IMG + item.icon" alt="" class="icon" />
            <view class="label f28">{{ item.text }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-bg"></view>
    <view
      class="bottom-bg-white"
      :style="{ height: `${whiteAreaHeight}` }"
    ></view>
    <view
      class="flex-column-center footer-area-bottom bg-whit pt32"
      :animation="animationData"
    >
      <view class="bottom-dh-char flex-row-around">
        <view
          class="input-send left"
          :disabled="msgState.msgLoad"
          @click="changeVoiceType"
        >
          <view class="circle">
            <img
              v-if="!isVoice"
              class="bottom-icon"
              :src="globalGl.BASE_IMG + 'intelMedicalAssist_voice.png'"
              alt=""
            />
            <!-- 未提供键盘icon -->
            <img
              v-else
              class="bottom-icon"
              :src="globalGl.BASE_IMG + 'ntelMedicalAssist_keyboard.png'"
              alt=""
            />
          </view>
        </view>
        <view class="bottom-dh-content" v-if="!isVoice">
          <view class="border">
            <input
              v-model="msgState.msg"
              class="dh-input f28"
              type="textarea"
              @confirm="sendMsg"
              :disabled="msgState.msgLoad"
              placeholder-class="my-neirong-sm f28"
              placeholder="  请输入症状/药品/疾病/地点/文章…"
              confirm-type="search"
              :focus="msgState.focus"
              @blur="onBlur"
            />
          </view>
        </view>
        <view
          class="bottom-dh-content"
          v-else
          @longpress="handleVoice"
          @touchstart="touchStart"
          @touchmove="touchMove"
          @touchend="endRecord"
        >
          <view class="border">
            <view class="dh-input f28 voice">按住说话</view>
          </view>
        </view>
        <view
          class="input-send right"
          :disabled="msgState.msgLoad"
          @click="sendImg"
        >
          <view class="circle">
            <img
              class="bottom-icon"
              :src="globalGl.BASE_IMG + 'intelMedicalAssist_image.png'"
              alt=""
            />
          </view>
        </view>
      </view>
    </view>
    <view
      class="voicing-area"
      :style="{ display: voicing ? 'flex' : 'none' }"
      @click="cancleVoice"
    >
      <view class="tap-area">
        <view class="animation">
          <view class="animation-contaner">
            <view
              class="line"
              v-for="item in 15"
              :key="item + 'animation'"
            ></view>
          </view>
        </view>
      </view>
      <view class="title f28">松开发送</view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import {
    ref,
    computed,
    getCurrentInstance,
    onMounted,
    watch,
    nextTick,
  } from 'vue';
  import { type StyleConfigType } from '../utils/types';
  import globalGl from '@/config/global';
  import { type TButtonConfig, debounce } from '@/utils';
  import { msgState } from '../utils/utils';
  let SImanager: any = null;
  const animationData = ref<UniNamespace.Animation>();
  const isVoice = ref<boolean>(false);
  const voicing = ref<boolean>(false);
  const voiceTouchData = ref<any>({
    clientY: 0,
    isMoveUp: false,
  });
  const guessServerBottom = ref<any>('');

  const inst = getCurrentInstance();
  const query = uni.createSelectorQuery().in(inst);
  animationData.value = uni.createAnimation({});

  const props = defineProps<{
    guessServerList?: TButtonConfig[];
    headerConfig: StyleConfigType;
  }>();

  const emits = defineEmits([
    'on-blur',
    'send-msg',
    'click-server',
    'send-img',
  ]);

  watch(
    () => props.headerConfig.showHeader,
    (v) => {
      getGuessServerBottom();
    }
  );

  const whiteAreaHeight = computed(() => {
    if (props.headerConfig.showHeader) {
      return `calc(100vh - 800rpx)`;
    } else {
      return `400rpx`;
    }
  });

  const serverArray = computed(() => {
    if (props.headerConfig.showHeader) {
      return props?.guessServerList?.slice(0, 9);
    } else {
      return props?.guessServerList?.slice(0, 6);
    }
  });

  const hasWechatSI = computed(() => {
    const {
      sConfig: { isOpenWechatSI },
    } = globalGl;
    return isOpenWechatSI;
  });
  const sendImg = () => {
    emits('send-img');
  };

  const sendMsg = (e) => {
    emits('send-msg', e.detail.value);
    nextTick(() => {
      msgState.value.msg = '';
    });
  };

  const onBlur = (e) => {
    emits('on-blur', e.detail.value);
  };

  const handleClickServer = (serverItem) => {
    emits('click-server', serverItem);
  };

  const changeVoiceType = () => {
    if (hasWechatSI.value) {
      isVoice.value = !isVoice.value;
    } else {
      console.log('未配置语音输入插件，暂不支持切换输入方式');
    }
  };

  const handleVoice = (...args) => {
    SImanager.start({
      duration: 60000,
      lang: 'zh_CN',
    });
    setTimeout(() => {
      if (voicing.value) {
        voicing.value = false;
      }
    }, 60000);
  };
  const initRecord = () => {
    if (hasWechatSI.value) {
      if (!SImanager) {
        const plugin = requirePlugin('SIPlugin');
        SImanager = plugin.getRecordRecognitionManager();
      }
      SImanager.onStop = (res) => {
        msgState.value.msg += res.result || '';
        console.log('SImanager.onStop', msgState.value.msg);
        emits('send-msg', msgState.value.msg);
        nextTick(() => {
          msgState.value.msg = '';
        });
      };

      SImanager.onStart = (res) => {
        console.log('SImanager.onStart', res);
      };
      0;

      SImanager.onError = function (res) {
        console.error('error msg', res);
      };
      //有新的识别内容返回，则会调用此事件
      SImanager.onRecognize = (res) => {
        console.log('SImanager..onRecognize', res);
        msgState.value.msg += res.result || '';
      };
      // 识别结束事件
    }
  };

  const cancleVoice = () => {
    SImanager.stop();
    console.log('cancleVoice2');
    voicing.value && (voicing.value = false);
  };

  const touchStart = (e) => {
    voiceTouchData.value.clientY = e.changedTouches[0].clientY; //手指按下时的Y坐标
    !msgState.value.msgLoad && (voicing.value = true);
  };

  let touchMove = (e) => {
    let touchData = e.touches[0]; //滑动过程中，手指滑动的坐标信息 返回的是Objcet对象
    let moveY = touchData.clientY - voiceTouchData.value.clientY;
    if (moveY < -50) {
      // 向上滑动
      voiceTouchData.value.isMoveUp = false;
    } else {
      voiceTouchData.value.isMoveUp = true;
    }
  };
  touchMove = debounce(touchMove, 500, false);

  const endRecord = (e) => {
    if (voiceTouchData.value.isMoveUp) {
      cancleVoice();
      voiceTouchData.value = {
        clientY: 0,
        isMoveUp: false,
      };
    }
    cancleVoice();
    console.log('endRecord', voiceTouchData.value);
  };

  const getGuessServerBottom = () => {
    setTimeout(() => {
      query
        .selectAll(`.guess-server`)
        .boundingClientRect((data: any) => {
          guessServerBottom.value = `calc(100vh - 800rpx - ${data[0].height}px)`;
        })
        .exec();
    }, 0);
  };

  initRecord();
  onMounted(() => {
    getGuessServerBottom();
    initRecord();
  });
</script>
<style lang="scss" scoped>
  .transition {
    transition: 0.5s;
    .guess-server {
      transition: 0.5s;
    }
    .bottom-bg-white {
      transition: 0.5s;
    }
  }
  .stick-bottom {
    .guess-server {
      height: 270rpx !important;
      bottom: 130rpx !important;
      z-index: 4;
    }
  }
  .footer-area {
    // z-index: 4;
    .guess-server {
      z-index: 4;
      position: fixed;
      bottom: calc(100vh - 800rpx - 360rpx);
      .guess-title {
        text-align: left;
        color: #444444;
      }
      .guess-content {
        width: 95vw;
        margin: 0 2.5vw;
        .guess-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          .grid-item {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #e8fcff;
            border: 2rpx solid #baf2fc;
            border-radius: 18rpx;
            padding: 12rpx;
            margin: 12rpx 10rpx;
            .icon {
              width: 45rpx;
              height: 45rpx;
              margin-right: 10rpx;
            }
            .label {
              white-space: nowrap; //不换行
            }
          }
        }
      }
    }
  }
  .footer-area-bottom {
    // background: radial-gradient(#d1fffc, #b3e2ff);
    display: flex;
    position: fixed;
    // background-color: #fff;
    bottom: 0px;
    z-index: 99;
    .bottom-dh-char {
      font-size: 55rpx;
      align-items: center;
      width: 100vw;
    }
    .bottom-dh-content {
      height: 65rpx;
      width: 500rpx;
      //   margin: 0 16upx;
      //   margin-right: 32upx;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 50rpx;
      .border {
        &::before {
          display: block;
          content: '';
          border-radius: 50rpx;
          border: 4rpx solid transparent;
          background: linear-gradient(270deg, #ab51f5, #296fff) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          top: 0;
          position: absolute;
          width: 500rpx;
          height: 65rpx;
          margin-top: 4rpx;
        }
      }

      .input-clear-content {
        width: 38upx;
        height: 38upx;
        margin: 0 12upx;

        // margin-right: 24upx;
        .input-clear {
          width: 100%;
          height: 100%;
        }
      }
    }
    .input-send {
      // padding: 8upx;
      color: #bbbbbb;
      //   width: 100upx;
      // background-color: #fff;
      // margin-right: 20upx;
      font-size: 32upx;
      position: relative;
      //   right: 5upx;
      .circle {
        width: 70rpx;
        height: 70rpx;
        border-radius: 100%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        .bottom-icon {
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
    .right {
      right: 15rpx;
    }
    .left {
      left: 15rpx;
    }
  }
  .dh-input {
    width: 480rpx;
    height: 65rpx;
    border-radius: 10rpx;
    padding-left: 15rpx;
    background-color: inherit;
  }
  .voice {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    padding: 0;
  }
  .my-neirong-sm {
    color: #616161;
  }
  ::v-deep .input-placeholder {
    color: #999999;
    font-size: 28rpx;
    padding: 0 0 0 20rpx;
    text-align: center;
  }
  .flex-column-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .bottom-dh-char {
    // background-color: #fff;
    height: 78rpx;
    width: 100%;
    position: relative;
    margin-bottom: 30rpx;
  }
  .flex-row-around {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .bottom-bg {
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 130rpx;
    background: radial-gradient(#d1fffc, #b3e2ff);
    filter: blur(20px);
    z-index: 2;
  }
  .bottom-bg-white {
    background-color: #fff;
    z-index: 1;
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 450px;
  }
  .voicing-area {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
    display: flex;
    flex-direction: column-reverse;
    .title {
      text-align: center;
      color: #ececec;
      padding-bottom: 10rpx;
    }
    .animation {
      width: 100%;
      height: 150rpx;
      z-index: 999;
      background: linear-gradient(#defffd, #f5fbff);
      // filter: blur(2px);
      border-top: 10rpx solid #f5fbff;
      border-top-left-radius: 40%;
      border-top-right-radius: 40%;
      .animation-contaner {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 50rpx;
        .line {
          display: inline-block;
          width: 10rpx;
          height: 40rpx;
          margin: 0 5rpx;
          background: #296fff;
          transform-origin: center center;
          animation: music 1s 0ms infinite ease-in-out;
        }
        @for $i from 1 through 15 {
          view:nth-child(#{$i}) {
            animation-delay: 0.05s * $i;
          }
        }
        @for $i from 1 through 8 {
          view:nth-child(#{$i}) {
            height: 40rpx + 3rpx * $i;
          }
        }
        @for $i from 8 through 15 {
          view:nth-child(#{$i}) {
            height: 64rpx - 3rpx * ($i - 8);
          }
        }
      }
    }
  }
  @keyframes music {
    0% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(0.2);
    }
    100% {
      transform: scaleY(1);
    }
  }
</style>
