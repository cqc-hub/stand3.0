<template>
  <view class="topnav-container">
    <view class="smartChatRoom" >
      <view class="smartChatRomm-content">
        <!-- hearder区域 -->
        <intel-medical-header
          :guessAskList="guessAskList"
          :headerConfig="styleConfig"
          @click-guess="handleGuess"
        />
        <!-- content区域 -->
        <intalMedicalContent
          :msgList="msgList"
          :headerConfig="styleConfig"
          id="pageScroll"
        />
        <!-- fotter区域 -->
        <intalMedicalFooter
          :guessServerList="guessServerList"
          :headerConfig="styleConfig"
          @click-server="handleServer"
          @on-blur="onBlur"
          @send-msg="sendMsg"
        />
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import { computed, ref, reactive, onMounted } from 'vue';
  import { onLoad, onPageScroll } from '@dcloudio/uni-app';
  import IntelMedicalHeader from './compontents/intelMedicalHeader.vue';
  import intalMedicalFooter from './compontents/intalMedicalFooter.vue';
  import intalMedicalContent from './compontents/intalMedicalContent.vue';
  import {
    styleConfig,
    guessAskList,
    guessServerList,
    handleServer,
    handleGuess,
    onBlur,
    sendMsg,
    msgList,
  } from './utils/utils';
  import { throttle } from '@/utils';

  const scrollChangeView = (e) => {
    console.log('e.scrollTop,styleConfig.value.showHeader',e.scrollTop,styleConfig.value.showHeader)
    if (e.scrollTop <= 20 && styleConfig.value.showHeader === false&& (!msgList.value.length&&!styleConfig.value.isMessage)) {
      changeShowHeader('2');
    } else if (e.scrollTop > 20 && styleConfig.value.showHeader === true&& msgList.value.length&&!styleConfig.value.isMessage) {
      changeShowHeader('1');
    }
  };
  let changeShowHeader = (flag?:'1'|'2') => {
    if (styleConfig.value.simpleHeadInit) {
      styleConfig.value.simpleHeadInit = false;
      return;
    }
    if(styleConfig.value.isMessage){
      styleConfig.value.showHeader = false;
      return
    }
    if(flag){
      styleConfig.value.showHeader = (flag==='1')
    }
    styleConfig.value.showHeader = !styleConfig.value.showHeader;
  };
  changeShowHeader = throttle(changeShowHeader, 1000);

  onMounted(() => {
    // if (styleConfig.value.isMessage && !styleConfig.value.showHeader) {
    //   styleConfig.value.showHeader = true;
    //   styleConfig.value.transition = false
    //   return;
    // }
  });
  onPageScroll((e) => {
    styleConfig.value.transition = true;
    scrollChangeView(e);
  });
</script>
<style lang="scss" scoped>
  .topnav-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .offset_topccc {
      position: relative;
      padding-top: 88upx;
    }
    .smartChatRoom {
      color: #333;
      $NavHeight: 116upx;
      width: 100%;

      .smartChatRomm-content {
        background-color: #fff;
        min-height: 100vh;
        position: relative;
        top: -12upx;
        // display: flex;
      }
    }
  }
  //通用样式
</style>
