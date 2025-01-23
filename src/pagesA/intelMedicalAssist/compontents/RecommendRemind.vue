<template>
  <view class="mess-history float-from-top" v-show="styleConfig?.historyMess">
    <view v-for="(card, cardIndex) in messHisFormData[navIndex]" :key="`card${cardIndex}`">
      <view v-if="cardIndex == messHisFormData[navIndex]?.length" id="scroll-active"></view>
      <Recommend-Card :formData="card" :formList="formList" />
    </view>
  </view>

  <swiper
    class="swiper"
    :style="{ height: swiperHeight + 'px' }"
    :current="navIndex"
    ref="swiper"
    indicator-active-color="var(--hr-brand-color-6)"
    @change="tabChange"
  >
    <swiper-item v-for="(item, index) in messFormData" :key="`swiper-item${index}`">
      <view class="card-wrapper" :id="`swiper-item-${index}`">
        <view
          class="mess-now"
          @touchstart="touchStart"
          @touchmove="touchMove"
          @touchend="touchend"
        >
          <Recommend-Card
            :formData="item"
            :formList="formList"
          />
        </view>
      </view>
    </swiper-item>
  </swiper>

  <!-- 轮播指示点样式修改 -->
  <view class="dots">
    <block v-for="(item, index) in messFormData.length" :key="item">
      <view class="dot" :class="index == navIndex ? ' active' : ''"></view>
    </block>
  </view>
</template>
<script setup lang="ts">
  import { nextTick, ref, onMounted, getCurrentInstance, watch } from 'vue';
  import {
    changeShowHistory,
    styleConfig,
    messHisFormData,
    messFormData,
  } from '../utils/utils';
  import type { TInstance } from '@/components/g-form/index';
  import RecommendCard from './RecommendCard.vue';
  const swiperHeight = ref('300');
  const pressTouchData = ref({
    clientY: 0,
    isMoveUp: false,
  });
  const navIndex = ref(0);
  const inst = getCurrentInstance();
  const query = uni.createSelectorQuery().in(inst);
  const formData = ref([
    {
      hosName: '朝晖院区',
      deptName: '皮肤-脱发专科',
      appointmentTime: '2022-09-15  下午16:00  24号',
      docName: '王嘉博 / 主任医师',
      patientNameEncry: '陈伟',
      areaName: '门诊三楼A区',
    },
    {
      hosName: '朝晖院区',
      deptName: '皮肤-脱发专科',
      appointmentTime: '2022-09-15  下午16:00  24号',
      docName: '王嘉博 / 主任医师',
      patientNameEncry: '陈伟',
      areaName: '门诊三楼A区',
      cs: 'cs',
    },
  ]);
  const formList = ref<TInstance[]>([
    {
      label: '院区',
      key: 'hosName',
      field: 'input-text',
    },
    {
      label: '科室名称',
      field: 'input-text',
      key: 'deptName',
    },
    {
      label: '预约时间',
      key: 'appointmentTime',
      field: 'input-text',
    },
    {
      label: '医生',
      field: 'input-text',
      key: 'docName',
    },
    {
      label: '就诊人',
      field: 'input-text',
      key: 'patientNameEncry',
      rowStyle: 'border-radius: 8px;',
    },
    {
      label: '就诊地点',
      key: 'areaName',
      field: 'input-text',
    },
  ]);
  const touchStart = (e) => {
    pressTouchData.value.clientY = e.changedTouches[0].clientY; //手指按下时的Y坐标
  };
  // watch(
  //   () => styleConfig.value.historyMess,
  //   (v) => {
  //     styleConfig.value.historyMess;
  //     getHeight();
  //     nextTick(() => {
  //       scrollToNewMsg(`#pageScroll >>> #scroll-active`, 10);
  //     });
  //     return;
  //   }
  // );

  const touchMove = (e) => {
    let touchData = e.touches[0]; //滑动过程中，手指滑动的坐标信息 返回的是Objcet对象
    let moveY = touchData.clientY - pressTouchData.value.clientY;
    if (moveY > 150) {
      pressTouchData.value.isMoveUp = true;
      changeShowHistory(true);
    } else {
      pressTouchData.value.isMoveUp = false;
    }
  };
  const touchend = (e) => {
    pressTouchData.value.clientY = 0;
  };
  const getHeight = () => {
    setTimeout(() => {
      query
        .selectAll(`#swiper-item-${navIndex.value}`)
        .boundingClientRect((data: any) => {
          swiperHeight.value = data[0].height + 10;
        })
        .exec();
    }, 0);
  };
  onMounted(() => {
    getHeight();
    setTimeout(() => {
      getHeight();
    }, 500);
  });

  const tabChange = (e) => {
    changeShowHistory(false);
    navIndex.value = e.detail.current;
    getHeight();
  };
</script>
<style lang="scss" scoped>
  .swiper {
    width: 100vw;
    transition: 0.5s;
    .card-wrapper {
      transition: 0.5s;
    }
  }
  .dots {
    transition: 0.5s;
    position: absolute;
    left: 50%;
    // 这里一定要注意兼容不然很可能踩坑
    transform: translate(-50%, -60rpx);
    -webkit-transform: translate(-50%, -60rpx);
    z-index: 99;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .dot {
      width: 24rpx;
      height: 8rpx;
      transition: all 0.6s;
      background: rgba(0, 0, 0, 0.3);
      margin-right: 10rpx;
    }

    .active {
      width: 24rpx;
      height: 8rpx;
      background: var(--hr-brand-color-6);
    }
  }
  .mess-history {
    transition: 0.5s;
  }
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
