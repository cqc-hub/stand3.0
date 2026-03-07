<template>
  <scroll-view
    class="scroll-view"
    :scroll-x="true"
    v-if="messList && messList.length"
    :class="messList.length > 1 ? '' : 'w100'"
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
      >
        <view class="assist-card animate__animated animate__fadeIn">
          <view class="flex-normal-between">
            <view class="flex p24v f32">
              <text class="iconfont icon-location ml24 f40">&#xe6d7;</text>
              <view class="hos p12c">{{ messData.hosName }}</view>
              <view class="dept p12c">{{ messData.deptName }}</view>
            </view>
            <view class="color-666 flex pr24 more">
              <text class="f28">详情</text>
              <text class="iconfont f48">&#xe66b;</text>
            </view>
          </view>
          <view class="info-area">
            <view class="p24 f28 flex-normal-between">
              <view class="flex text-ellipsis">
                <text class="name pr24" v-if="messData.patientName">
                  {{ messData.patientName }}
                </text>
                <text class="date pr24" v-if="messData.appointmentDate">
                  {{ dayjs(messData.appointmentDate).format('MM-DD') }}
                </text>
                <text class="time pr24" v-if="messData.timeDesc">
                  {{ messData.timeDesc }}
                </text>
                <text class="number pr24" v-if="messData.disNo">
                  {{ messData.disNo }}号
                </text>
              </view>
              <view class="tag f24 text-ellipsis">
                {{
                  getDaysFromTodayEnhanced(messData?.appointmentDate) == 0
                    ? '当日'
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
                          (item) => item.value == messData.orderStatus
                        )
                      ] + '%',
                  }"
                ></view>
                <view class="dots">
                  <view
                    class="dot"
                    :class="{
                      active: item.value * 1 <= messData.orderStatus * 1,
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
                    class="name text-ellipsis"
                    :class="{ active: item.value === messData.orderStatus }"
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
                  <text class="iconfont color-warn mr12">&#xe6d1;</text>
                  <text class="color-warn f26 mr12 text-ellipsis">
                    就诊提示 :
                  </text>
                </view>
                <view class="content color-888 f26 marquee-container">
                  <view class="marquee-seamless">
                    <view class="marquee-content">
                      <span class="marquee-text">{{ messData.notice }}</span>
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
  import { ref, onMounted, defineExpose } from 'vue';
  import { GStores } from '@/utils';
  import { joinQuery } from '@/common';
  const messData = ref<any>({});
  const gStores = new GStores();
  onMounted(() => {
    // #ifndef MP-TOUTIAO
    
    reLoad();
    // #endif
  });
  const messList = ref([] as any[]);
  const list = ref([10, 36.4, 63.4, 90] as any[]);
  const reLoad = async () => {
    const { result } = await api.hpCalendar({});
    messList.value = result;
    messList.value.map((item) => {
      item.statusList = [];
      if (item.process) {
        const [listStr, orderStatus] = item.process.split(',');
        item.orderStatus = orderStatus;
        const statusArray = listStr.split('/');
        item.statusList = statusArray.map((status) => ({
          label: status,
          value: status,
        }));
      }
    });
  };

  const gotoHisMess = async () => {};

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
      includeToday = false,
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
    const targetIndex = arr.findIndex((item) => item.value === targetValue);

    // 如果找不到目标值，从头开始取4个
    if (targetIndex === -1) {
      return arr.slice(0, 4);
    }

    // 根据目标值的位置决定如何截取
    if (targetIndex < 2) {
      // 目标值在前两个位置，从开头取
      return arr.slice(0, 4);
    } else if (targetIndex > arr.length - 3) {
      // 目标值在倒数三个位置，从末尾取
      return arr.slice(arr.length - 4, arr.length);
    } else {
      // 目标值在中间位置，尽量让它作为第三项
      return arr.slice(targetIndex - 2, targetIndex + 2);
    }
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
            width: 8rpx;
            height: 8rpx;
            background-color: var(--hr-brand-color-6);
            border-radius: 50%;
          }
          .active {
            background-color: #ffffff !important;
            border: 4rpx solid var(--h-qrcode-1) !important;
            top: -4rpx;
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
            transform: translate(-30%, 20rpx);
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
