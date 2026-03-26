<template>
  <scroll-view
    class="scroll-view"
    :scroll-x="true"
    v-if="messList && messList.length"
    :class="messList.length > 1 ? '' : 'w100'"
    @scroll="handleScroll"
    @touchend="handleTouchend"
    @touchstart="handleTouch"
    :scroll-with-animation="true"
    :scroll-into-view="targetId"
  >
    <view
      class="flex scroll-view1"
      :class="messList.length > 1 ? '' : 'w100'"
      :style="{
        width: `calc(${
          messList.length * 90 + (messList.length > 1 ? 0 : 15) + 'vw'
        } - ${messList.length > 1 ? 40 : 0}rpx)`,
      }"
    >
      <view
        class="flex-start box"
        :key="`scroll-view` + index"
        v-for="(messData, index) in messList"
        :class="messList.length > 1 ? 'mr24 w90' : ''"
        @click="gotoGuide(messData)"
        :id="`scroll-view-targetId-` + index"
      >
        <view class="assist-card animate__animated animate__fadeIn">
          <view class="flex-normal-between">
            <view @click.stop="guideToHos(messData)" class="flex p24v f32">
              <text class="iconfont icon-location ml12 f40">&#xe6d7;</text>
              <view class="hos pr12">{{ messData.hosName }}</view>
              <view class="dept pl12">{{ messData.deptName }}</view>
            </view>
            <view class="color-666 flex pr12 more">
              <text class="f28">详情</text>
              <text class="iconfont f48">&#xe66b;</text>
            </view>
          </view>
          <view class="info-area">
            <view class="p24 f28 flex-normal-between">
              <view class="flex">
                <text class="name pr12" v-if="messData.patientName">
                  {{ messData.patientName }}
                </text>
                <text class="date pr12" v-if="messData.appointmentDate">
                  {{ dayjs(messData.appointmentDate).format('MM-DD') }}
                </text>
                <text class="time pr12" v-if="messData.ampmName">
                  {{ messData.ampmName }}
                </text>
                <text class="time pr12" v-if="messData.timeDesc">
                  {{ messData.timeDesc }}
                </text>
                <text class="number pr12" v-if="messData.disNo">
                  {{ messData.disNo }}号
                </text>
              </view>
              <view class="tag f24">
                {{
                  getDaysFromTodayEnhanced(messData?.appointmentDate) == 0
                    ? '今日'
                    : getDaysFromTodayEnhanced(messData?.appointmentDate, {
                        includeToday: true,
                      }) + '日后'
                }}就诊
              </view>
            </view>
            <view class="dot-area">
              <view class="line">
                <view class="line-background"></view>
                <view
                  class="line-cover"
                  :style="{
                    width:
                      list[
                        getFourItemsSmart(
                          messData.statusList,
                          messData.orderStatus
                        ).findIndex(
                          (item) => item.label == messData.orderStatus
                        )
                      ] + '%',
                  }"
                ></view>
                <view class="dots">
                  <view
                    class="dot"
                    :class="{
                      active: item.value * 1 <= messData.activeStausIndex * 1,
                      [`active-${
                        messData.activeStausIndex * 1 - item.value * 1
                      }`]: true,
                    }"
                    v-for="item in getFourItemsSmart(
                      messData.statusList,
                      messData.orderStatus
                    )"
                    :key="item.value + 'name'"
                  ></view>
                </view>
                <view class="dots-name color-888 f28 g-bold">
                  <view
                    class="name"
                    :class="{ active: item.label === messData.orderStatus }"
                    v-for="item in getFourItemsSmart(
                      messData.statusList,
                      messData.orderStatus
                    )"
                    :key="item.value + 'name'"
                  >
                    {{ item.label }}
                  </view>
                </view>
              </view>
            </view>
            <view
              class="notice flex"
              v-if="messData.notice"
              @click="gotoHisMess"
            >
              <view class="title f24 flex ellipsis-line-clamp2">
                <view class="wxts flex">
                  <text class="iconfont color-warn mr12 f26">&#xe6d1;</text>
                  <text class="color-warn f26 mr12 text-ellipsis">
                    就诊提示 :
                  </text>
                </view>
                <view class="content color-888 f26 marquee-container">
                  <view class="marquee-seamless">
                    <view class="marquee-content">
                      <span class="marquee-text assist-text">
                        {{ messData.notice }}
                      </span>
                      <span class="marquee-text">{{ messData.notice }}</span>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>
<script setup lang="ts">
  import api from '@/service/api';
  import dayjs from 'dayjs';
  import { ref, onMounted, nextTick } from 'vue';
  import { GStores, ServerStaticData, debounce, guideHos } from '@/utils';
  import { joinQuery, setLocalStorage, getLocalStorage } from '@/common';
  const gStores = new GStores();
  onMounted(() => {
    // #ifndef MP-TOUTIAO

    reLoad();
    // #endif
  });
  const messList = ref([] as any[]);
  const list = ref([10, 36.4, 63.4, 90] as any[]);
  const targetId = ref(<string>'scroll-view-targetId-0');
  const isFinishTouch = ref(<number>0);
  const srcollDetail = ref(<any>{});

  const reLoad = async () => {
    //非要加个时间限制缓存，直接写进缓存

    if (
      getLocalStorage('assistMessageTime') &&
      Math.abs(Date.now() - +getLocalStorage('assistMessageTime')) <= 300000
    ) {
      messList.value = getLocalStorage('assistMessageData');
    } else {
      const { result } = await api.hpCalendar({});
      setLocalStorage({
        assistMessageData: result,
        assistMessageTime: new Date().getTime(),
      });
      messList.value = result;
    }

    messList.value.map((item) => {
      item.statusList = [];
      if (item.process) {
        const [listStr, orderStatus] = item.process.split(',');
        item.orderStatus = orderStatus;
        const statusArray = listStr.split('/');
        item.statusList = statusArray.map((status, index) => ({
          label: status,
          value: index,
        }));
        item.activeStausIndex = 0;
        item.statusList.forEach((element, index) => {
          if (element.label === orderStatus) {
            item.activeStausIndex = index;
          }
        });
      }
    });
  };

  const gotoHisMess = async () => {};

  const guideToHos = async (messData) => {
    const { hosId } = messData;

    if (!hosId) {
      return;
    }

    const hosList = await ServerStaticData.getHosList();
    const hosItem = hosList.find((o) => o.hosId === hosId);

    if (hosItem) {
      guideHos(hosItem);
    }
  };

  const gotoGuide = async (messData) => {
    const args: any = {};
    const pat = gStores.userStore.patList.find(
      (item) => item.cardNumber === messData.cardNumber
    );
    pat && gStores.userStore.updatePatChoose(pat);

    if (getDaysFromTodayEnhanced(messData?.appointmentDate) !== 0) {
      args.tabKey = 1;
    }
    uni.navigateTo({
      url: joinQuery('/pagesA/guide/guide', args),
    });
  };

  const getDaysFromTodayEnhanced = (date, options = {}) => {
    const {
      absolute = false,
      includeToday = true,
      unit = 'day',
      precision = 0,
    } = options as any;

    const targetDate = new Date(date);
    const today = new Date();

    // 清除时间部分，只比较日期
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    let timeDiff = targetDate.getTime() - today.getTime();

    // 是否包含今天
    if (!includeToday && timeDiff !== 0) {
      const sign = timeDiff > 0 ? 1 : -1;
      timeDiff = timeDiff - sign * (1000 * 60 * 60 * 24);
    }

    // 根据单位计算
    let result;
    switch (unit) {
      case 'hour':
        result = timeDiff / (1000 * 60 * 60);
        break;
      case 'minute':
        result = timeDiff / (1000 * 60);
        break;
      case 'second':
        result = timeDiff / 1000;
        break;
      case 'day':
      default:
        result = timeDiff / (1000 * 60 * 60 * 24);
    }
    // 取整
    result = Number(result.toFixed(precision));

    // 是否取绝对值
    return absolute ? Math.abs(result) : result;
  };

  const getFourItemsSmart = (arr, targetValue) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return [];
    }

    // 如果数组长度小于等于4，直接返回原数组
    if (arr.length <= 4) {
      return arr.slice(0, 4);
    }

    // 查找目标值在数组中的索引
    const isFinishTouch = arr.findIndex((item) => item.value === targetValue);

    // 如果找不到目标值，从头开始取4个
    if (isFinishTouch === -1) {
      return arr.slice(0, 4);
    }

    // 根据目标值的位置决定如何截取
    if (isFinishTouch < 2) {
      // 目标值在前两个位置，从开头取
      return arr.slice(0, 4);
    } else if (isFinishTouch > arr.length - 3) {
      // 目标值在倒数三个位置，从末尾取
      return arr.slice(arr.length - 4, arr.length);
    } else {
      // 目标值在中间位置，尽量让它作为第三项
      return arr.slice(isFinishTouch - 2, isFinishTouch + 2);
    }
  };

  let handleChangeisFinishTouch = (index) => {
    if (isFinishTouch.value) {
      targetId.value = '';
      nextTick(() => {
        targetId.value = `scroll-view-targetId-${index}`;
      });
    }
  };
  handleChangeisFinishTouch = debounce(handleChangeisFinishTouch, 200, false);

  const handleTouchend = () => {
    isFinishTouch.value = 1;
    handleScroll(srcollDetail.value);
  };

  const handleTouch = () => {
    isFinishTouch.value = 0;
  };

  const handleScroll = ({ detail }) => {
    const { scrollLeft, scrollWidth } = detail;
    let spinWith = scrollWidth / messList.value.length;
    srcollDetail.value = { detail };
    handleChangeisFinishTouch(Math.round(scrollLeft / spinWith));
  };
  defineExpose({ reLoad });
</script>

<style lang="scss" scoped>
  .assist-card {
    width: 100%;
    background: radial-gradient(
      var(--hr-brand-color-4),
      var(--hr-brand-color-5)
    );
    border: 2rpx solid var(--hr-brand-color-3-light);
    border-radius: 24rpx;
    .icon-location {
      color: var(--hr-brand-color-6);
      /* #ifdef MP-ALIPAY */
      transform: translate(0, -5rpx);
      /* #endif */
    }
    .hos {
      color: var(--hr-brand-color-6);
      border-right: 2rpx #cccccc solid;
    }
    .dept {
      color: $hr-neutral-color-10;
    }
    .more {
      justify-content: center;
      align-items: center;
    }
    .info-area {
      background-color: #ffffff;
      border-radius: 24rpx;
      .tag {
        color: var(--hr-brand-color-8);
        background-color: var(--hr-brand-color-8-light);
        padding: 6rpx 12rpx;
      }
    }
    .dot-area {
      padding: 16rpx 24rpx 48rpx;
      .line {
        position: relative;
        padding-bottom: 42rpx;
        .line-background {
          height: 8rpx;
          width: 100%;
          background-color: var(--hr-brand-color-3-light);
          position: absolute;
        }
        .line-cover {
          height: 8rpx;
          width: 10%;
          background: linear-gradient(
            90deg,
            var(--hr-brand-color-6-light-3),
            var(--h-qrcode-1)
          );
          position: absolute;
        }
        .dots {
          view {
            position: absolute;
            width: 10rpx;
            height: 10rpx;
            background-color: var(--hr-brand-color-6-light-4);
            border-radius: 50%;
          }
          .active {
            width: 8rpx !important;
            height: 8rpx !important;
            border: 4rpx solid var(--h-qrcode-1);
            top: -4rpx;
          }
          .active-0 {
            border: 4rpx solid var(--h-qrcode-1) !important;
          }
          .active-1 {
            border: 4rpx solid rgb(175, 94, 69) !important;
          }
          .active-2 {
            border: 4rpx solid rgb(206, 113, 77) !important;
          }
          .active-3 {
            border: 4rpx solid rgb(237, 131, 85) !important;
          }

          :nth-child(1) {
            left: 10%;
          }
          :nth-child(2) {
            left: 36.4%;
          }
          :nth-child(3) {
            left: 63.4%;
          }
          :nth-child(4) {
            left: 90%;
          }
        }
        .dots-name {
          .name {
            position: absolute;
            transform: translate(-50%, 20rpx);
            width: 115rpx;
            text-align: center;
          }

          .active {
            color: var(--hr-brand-color-6) !important;
          }
          :nth-child(1) {
            left: 10%;
          }
          :nth-child(2) {
            left: 36.4%;
          }
          :nth-child(3) {
            left: 63.4%;
          }
          :nth-child(4) {
            left: 90%;
          }
        }
      }
    }
  }
  .notice {
    padding: 0 24rpx 24rpx;
    .title {
      display: contents;
      .wxts {
        width: fit-content;
        flex: 0 0 auto;
      }
    }
    .content {
      overflow: hidden;
      flex: 1 1 auto;
    }
  }
  .scroll-view {
    width: 92vw;
  }
  .box {
    max-width: 92vw;
    width: 100%;
    height: min-content;
  }
  .scroll-view1 {
    width: 100%;
  }
  .w90 {
    width: 90vw;
  }
  .w100 {
    width: 100vw !important;
  }
  .marquee-seamless {
    width: 100%;
    overflow: hidden;
    position: relative;
    border-radius: 20rpx;
    height: 36rpx;
  }

  .marquee-content {
    display: inline-flex;
    white-space: nowrap;
    position: absolute;
    min-width: 200%; /* 至少两倍宽度 */
    animation: marquee-seamless 20s linear infinite;
    align-items: center;
  }

  .marquee-text {
    display: inline-block;
    padding: 0 100rpx;
    letter-spacing: 2rpx;
  }
  .assist-text {
    /* #ifdef MP-ALIPAY */
    transform: translate(0, -10rpx);
    /* #endif */
  }

  /* 使用两个相同内容实现无缝循环 */
  .marquee-content::before,
  .marquee-content::after {
    content: attr(data-text);
    padding: 0 100rpx;
  }

  @keyframes marquee-seamless {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%); /* 移动一半宽度 */
    }
  }

  .marquee-seamless:hover .marquee-content {
    animation-play-state: paused;
  }
</style>
