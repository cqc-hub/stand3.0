<template>
  <view class="topnav-container ">
    <view class="smartChatRoom">
      <view class="smartChatRomm-content">
        <!-- hearder区域 -->
        <intel-medical-header
          :guessAskList="guessAskList"
          :headerConfig="styleConfig"
        />
        <!-- content区域 -->
        <intalMedicalContent/>
        <!-- fotter区域 -->
        <intalMedicalFooter
          :guessServerList="guessServerList"
          :headerConfig="styleConfig"
        />
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import { computed, ref, reactive } from 'vue';
  import { onLoad, onPageScroll } from '@dcloudio/uni-app';
  import IntelMedicalHeader from './compontents/intelMedicalHeader.vue';
  import intalMedicalFooter from './compontents/intalMedicalFooter.vue';
  import intalMedicalContent from './compontents/intalMedicalContent.vue';
  import { type StyleConfigType } from './utils/types';
  import { debounce } from '@/utils';

  const animationData = ref<UniNamespace.Animation>();
  const msg = ref<string>();
  const msgLoad = ref<boolean>(false);
  const focus = ref<boolean>(false);
  const styleConfig = ref<StyleConfigType>({
    transition: true,
    showHeader: true,
    isMessage: false,
  });
  const guessAskList = ref([
    {
      label: '不知道挂什么号',
      value: '不知道挂什么号',
    },
    {
      label: '感冒要可以买那些',
      value: '感冒要可以买那些',
    },
    {
      label: '帮我解读预先这份报告',
      value: '帮我解读预先这份报告',
    },
    {
      label: '不知道挂什么号',
      value: '不知道挂什么号',
    },
    {
      label: '感冒要可以买那些',
      value: '感冒要可以买那些',
    },
    {
      label: '帮我解读预先这份报告',
      value: '帮我解读预先这份报告',
    },
    {
      label: '不知道挂什么号',
      value: '不知道挂什么号',
    },
    {
      label: '感冒要可以买那些',
      value: '感冒要可以买那些',
    },
    {
      label: '帮我解读预先这份报告',
      value: '帮我解读预先这份报告',
    },
  ]);
  const guessServerList = ref([
    {
      icon: 'intelMedicalAssist_zhgl.png',
      label: '智能导诊',
      type: 'self',
      path: 'pagesB/reportQuery/reportQuery',
      addition: { orderClassTabIndex: 'tabIndex' },
    },
    {
      icon: 'intelMedicalAssist_chuan card.png',
      label: '预约挂号',
      type: 'self',
      path: 'pagesB/reportQuery/reportQuery',
      addition: { orderClassTabIndex: 'tabIndex' },
    },
    {
      icon: 'intelMedicalAssist_search.png',
      label: '报告查询',
      type: 'self',
      path: 'pagesB/reportQuery/reportQuery',
      addition: { orderClassTabIndex: 'tabIndex' },
    },
    {
      icon: 'intelMedicalAssist_dbsj.png',
      label: '门诊缴费',
      type: 'self',
      path: 'pagesB/reportQuery/reportQuery',
      addition: { orderClassTabIndex: 'tabIndex' },
    },
    {
      icon: 'intelMedicalAssist_ssjj.png',
      label: '治疗预约',
      type: 'self',
      path: 'pagesB/reportQuery/reportQuery',
      addition: { orderClassTabIndex: 'tabIndex' },
    },
    {
      icon: 'intelMedicalAssist_document.png',
      label: '病案复印',
      type: 'self',
      path: 'pagesB/reportQuery/reportQuery',
      addition: { orderClassTabIndex: 'tabIndex' },
    },
    {
      icon: 'intelMedicalAssist_card.png',
      label: '在线取号',
      type: 'self',
      path: 'pagesB/reportQuery/reportQuery',
      addition: { orderClassTabIndex: 'tabIndex' },
    },
    {
      icon: 'intelMedicalAssist_hljl.png',
      label: '满意度调查',
      type: 'self',
      path: 'pagesB/reportQuery/reportQuery',
      addition: { orderClassTabIndex: 'tabIndex' },
    },
    {
      icon: 'intelMedicalAssist_rypg.png',
      label: '门诊签到',
      type: 'self',
      path: 'pagesB/reportQuery/reportQuery',
      addition: { orderClassTabIndex: 'tabIndex' },
    },
  ]);
  const sendMsg = () => {};
  const onBlur = () => {};
  let scrollChangeView = (e) => {
    if (e.scrollTop <= 100) {
      styleConfig.value.showHeader = true;
    } else {
      styleConfig.value.showHeader = false;
    }
  };
  scrollChangeView = debounce(scrollChangeView, 500);
  onPageScroll((e) => {
    styleConfig.value.transition = true;
    scrollChangeView(e);
  });

  animationData.value = uni.createAnimation({});
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
        background-color:#fff;
        min-height: 100vh;
        position: relative;
        top: -12upx;
        // display: flex;
      }
    }
  }
  //通用样式
</style>
