<template>
  <view class="topnav-container">
    <view class="smartChatRoom">
      <view class="smartChatRomm-content float-from-top">
        <!-- hearder区域 -->
        <intel-medical-header
          :guessAskList="pageConfig?.intelMedicalAssistConfig?.guessAskList"
          :headerConfig="styleConfig"
          :isMess="props?.isMess"
          @click-guess="handleGuess"
        />
        <!-- content区域 -->
        <intalMedicalContent
          :msgList="msgList"
          :headerConfig="styleConfig"
          :source="props.source"
          id="pageScroll"
          @up-med-record="upMedRecord"
        />

        <view v-if="waitUploadFiles.length">
          <view class="safe-height"></view>
          <view class="safe-height"></view>
          <view class="safe-height"></view>
        </view>
        <!-- fotter区域 -->
        <intalMedicalFooter
          :guessServerList="
            pageConfig?.intelMedicalAssistConfig?.guessServerList
          "
          :agentServerList="
            pageConfig?.intelMedicalAssistConfig?.agentServerList
          "
          :waitUploadFiles="waitUploadFiles"
          :source="props.source"
          :headerConfig="styleConfig"
          @click-server="handleServer"
          @on-blur="onBlur"
          @send-msg="sendMsg"
          @send-img="sendImg"
          @click-avatar="handleGuess"
          @report-show="reportShow"
          @stop-chunk="stopChunkRequest"
        />
      </view>
    </view>
    <view v-if="popipHasShow">
      <!-- 报告解读，业务逻辑写在组件中 -->
      <reportPopup
        @inspectionAnalysis="inspectionAnalysis"
        @send-img="sendImg"
        :title="reportPopupRefTitle"
        :type="reportPopupRefType"
      />
    </view>
    <view v-if="showOrder">
      <Doc-Sch-Order :orderInfo="schOrderInfo"></Doc-Sch-Order>
    </view>
    <distinctiveImagePopup />

    <g-message />
  </view>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { deQueryForUrl } from '@/common';
  import {
    onLoad,
    onPageScroll,
    onShow,
    onShareAppMessage,
  } from '@dcloudio/uni-app';
  import IntelMedicalHeader from './compontents/intelMedicalHeader.vue';
  import intalMedicalFooter from './compontents/intalMedicalFooter.vue';
  import intalMedicalContent from './compontents/intalMedicalContent.vue';
  import reportPopup from './compontents/reportPopup.vue';
  // import DocSchOrder from './compontents/DocSchOrder.vue';
  import distinctiveImagePopup from './compontents/distinctiveImagePopup.vue';
  import {
    styleConfig,
    pageConfig,
    handleServer,
    handleGuess,
    onBlur,
    sendMsg,
    sendImg,
    reportShow,
    msgList,
    init,
    popipHasShow,
    inspectionAnalysis,
    stopChunkRequest,
    reload,
    showOrder,
    schOrderInfo,
    reportPopupRef,
    reportPopupRefTitle,
    reportPopupRefType,
    waitUploadFiles,
  } from './utils/utils';
  import { throttle, GStores, wait } from '@/utils';
  import { useCacheStore, type IPat } from '@/stores';

  const props = defineProps<{
    isMess?: string;
    sysCode?: string;
    source?: string;
    herenId?: string; //埋点
    type?: 'report' | 'homePage';
    reportId?: string; //报告id
    reportData?: any;
    setNavBarTitle?: string;
  }>();

  const gStores = new GStores();
  const cacheStore = useCacheStore();

  const upMedRecord = async (item) => {
    popipHasShow.value = true;
    reportPopupRefTitle.value = '病历上传';
    reportPopupRefType.value = '2';

    await wait(200);
    reportPopupRef.value.show();
  };

  const scrollChangeView = (e) => {
    // console.log('e.scrollTop,styleConfig.value.showHeader',e.scrollTop,styleConfig.value.showHeader)

    if (
      e.scrollTop <= 20 &&
      styleConfig.value.showHeader === false &&
      !msgList.value.length &&
      !styleConfig.value.isMessage
    ) {
      changeShowHeader('2');
    } else if (
      e.scrollTop > 20 &&
      styleConfig.value.showHeader === true &&
      msgList.value.length &&
      !styleConfig.value.isMessage
    ) {
      changeShowHeader('1');
    }
  };
  let changeShowHeader = (flag?: '1' | '2') => {
    if (styleConfig.value.simpleHeadInit) {
      styleConfig.value.simpleHeadInit = false;
      return;
    }
    if (styleConfig.value.isMessage) {
      styleConfig.value.showHeader = false;
      styleConfig.value.historyMess = true;
      return;
    }
    if (flag) {
      styleConfig.value.showHeader = flag === '1';
    }
    styleConfig.value.historyMess = !styleConfig.value.historyMess;
    styleConfig.value.showHeader = !styleConfig.value.showHeader;
  };
  changeShowHeader = throttle(changeShowHeader, 1000);
  onShareAppMessage((opt) => {
    return {
      path: '/pagesA/intelMedicalAssist/intelMedicalAssist',
    };
  });
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

  onShow(async () => {
    reload(props?.isMess);

    // await wait(200);
    const evt = cacheStore.webViewCacheData;
    const evtData = evt?.detail?.data?.[0]?.data;
    if (evtData) {
      const { type, value } = evtData;

      if (type === 'aiAskSymptom') {
        const { sliceWorld } = value;

        cacheStore.changeCacheDataWebView({});
        await wait(200);
        sendMsg(sliceWorld);
      }
    }
  });

  onLoad(() => {
    init(props);
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
        // background: rgba(232,252,255,0.20);
        min-height: 100vh;
        position: relative;
        top: -12upx;
        // display: flex;
      }
    }
  }
  //通用样式
  @keyframes floatFromTop {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .float-from-top {
    animation: floatFromTop 1s ease-out forwards;
  }
</style>
