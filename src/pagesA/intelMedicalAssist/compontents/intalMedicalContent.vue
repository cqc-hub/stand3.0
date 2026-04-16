<template>
  <view
    class="content-area"
    :class="{
      transition: headerConfig?.transition,
      'show-mess': headerConfig?.isMessage,
    }"
  >
    <!-- <p v-for="item in 200" :key="item">{{ item }}</p> -->
    <template
      v-for="(msgItem, msgIndex) in msgList"
      :key="`smartChatRoomItem_${msgIndex}`"
    >
      <view
        v-if="msgItem.my"
        :id="`smartChatRoomItem_${msgIndex}`"
        class="flex-column smartChatRoom-item float-from-top"
      >
        <view
          class="flex justify-end padding-right one-show align-start padding-top"
        >
          <view class="flex justify-end my-width">
            <view class="chat-my-item e margin-left padding-chat by-cyan">
              <image
                @click="previewImage(msgItem.imgUrl)"
                v-if="msgItem.type === 5"
                :src="msgItem.imgUrl"
                mode="aspectFill"
                class="chat-img"
              ></image>
              <text user-select selectable v-else class="g-break-word">
                {{ msgItem.msg }}
              </text>
            </view>
          </view>
        </view>
      </view>
      <view
        v-else
        :id="`smartChatRoomItem_${msgIndex}`"
        class="flex-column smartChatRoom-item float-from-top"
      >
        <view
          class="flex justify-start padding-right one-show align-start padding-top"
        >
          <view class="flex justify-start">
            <view
              v-if="msgItem.type === 4"
              class="chat-system-item e margin-left by-cyan"
            >
              <!-- <text user-select  selectable class="g-break-word">{{ msgItem.msg }}</text> -->
              <!-- 更多推荐 -->
              <Second-Recommend
                v-if="msgItem.secondCommendList"
                :list="msgItem.secondCommendList"
                :x="msgItem"
              />

              <!-- 首页菜单的样式 (占一行) -->
              <Home-Menu-Item-Recommend
                v-if="msgItem.homeMenuConfig"
                :list="msgItem.homeMenuConfig"
                :x="msgItem"
              />
            </view>
            <!-- <view v-else-if="msgItem.type === 6">
              <Recommend-Card />
            </view> -->
            <view v-else-if="msgItem.type === 6 && messFormData.length">
              <Recommend-Remind />
            </view>

            <view v-else-if="msgItem.type === 63">
              <Recommend-Remind />
            </view>
            <view v-else-if="msgItem.type === 61">
              <Doc-Scheduling
                :list="msgItem.addRessList"
                :msg="msgItem.msg"
                :source="props.source"
              />
            </view>

            <view v-else-if="msgItem.type === 62">
              <Recommend-Dept
                :list="msgItem.addRessList"
                :msg="msgItem.msg"
                :hosData="msgItem?.hosData"
                :source="props.source"
              />
            </view>
            <view
              v-else-if="msgItem.type === 99 && msgItem.msg"
              class="chat-system-item margin-left padding-chat by-cyan"
            >
              <view>
                <view class="report-header">
                  好的，已收到报告单，以下是详细的报告解读:
                </view>
                <ua-markdown :source="msgItem.msg" />
                <view class="report-declare">
                  结果仅供参考，具体诊断和治疗应以医生的纸质检查单为准,请及时与医生沟通，以便获得专业的医疗建议和治疗方案。
                </view>
              </view>
            </view>
            <view v-else-if="msgItem.type === 64 && messFormData.length">
              <Recommend-Mess />
            </view>

            <view
              v-else
              :class="{
                ['flex1']: msgItem.type === 3,
              }"
              class="chat-system-item margin-left padding-chat by-cyan"
            >
              <!-- <text user-select  selectable v-if="msgItem.type === 1" class="g-break-word">
                {{ msgItem.msg }}
              </text> -->
              <view
                :class="{ 'b-bottom': msgItem.type.type === 2 }"
                class="flex"
              >
                <view class="flex1 auto">
                  <text
                    user-select
                    selectable
                    v-if="msgItem.boldMsg"
                    :style="
                      msgItem.type === 2
                        ? 'color: #838383; padding: 8rpx 0;word-break: break-all'
                        : ''
                    "
                    :class="{
                      ['color-888 f32']: msgItem.type === 3,
                    }"
                    class="f32"
                  >
                    <text
                      user-select
                      selectable
                      class="g-bold mr12 pb12 lineH64"
                    >
                      {{ msgItem.boldMsg }}\n
                    </text>

                    <!-- <text user-select  selectable>
                      {{ msgItem.msg }}
                    </text> -->
                  </text>
                  <view
                    :style="
                      msgItem.type === 2
                        ? 'color: #838383; padding: 8rpx 0;word-break: break-all'
                        : ''
                    "
                    :class="{
                      ['color-888 f32']: msgItem.type === 3,
                    }"
                    class="f32 mWidth80"
                  >
                    <ua-markdown :source="msgItem.msg" />
                  </view>
                  <view
                    v-if="msgItem.type === 1 && msgItem?.isSysAppMore"
                    class="sysAppMore"
                  >
                    <rich-text :nodes="sysAppMore"></rich-text>
                  </view>

                  <view v-if="msgItem.firstCommendList" class="pt20">
                    <!-- 第一个推荐 -->
                    <Recommend-Menu :list="msgItem.firstCommendList" />
                  </view>

                  <view v-if="msgItem.addRessList">
                    <Recommend-Address :list="msgItem.addRessList" />
                  </view>

                  <view v-if="msgItem.addRessInfo">
                    <Recommend-Info :item="msgItem.addRessInfo" />
                  </view>
                  <!-- #ifndef H5 -->
                  <Evaluate-Btn1
                    v-if="msgItem.requestId && msgIndex >= msgList.length - 2"
                    :requestId="msgItem.requestId"
                    @askAgain="clearChatId"
                  />
                  <!-- #endif -->
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>

    <view :id="`smartChatRoomItem_load`" key="smartChatRoomItem_load">
      <view
        v-show="msgState.msgLoad && !chunkStatus.isTyping"
        class="flex-column smartChatRoom-item"
      >
        <view
          class="flex justify-start padding-right one-show align-start padding-top"
        >
          <view class="flex justify-start">
            <view
              class="chat-system-item margin-left padding-chat by-cyan flex-normal smartChatRoomItem_load"
            >
              <text user-select selectable class="g-break-word g-blod">
                {{ msgState.msgText ? msgState.msgText : '正在理解您的问题' }}
              </text>
              <text class="progress-text">{{ progressWidth }}%</text>
              <view
                class="loading-cricle relative"
                v-for="(item, index) in 4"
                :key="`loading-cricle${index}`"
                :class="`loading-cricle${index}`"
              />
            </view>
          </view>
        </view>
      </view>
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
    onUnmounted,
  } from 'vue';
  import { type StyleConfigType } from '../utils/types';
  import {
    msgState,
    clearChatId,
    messFormData,
    chunkStatus,
  } from '../utils/utils';
  import { GStores } from '@/utils';
  import HTMLParser from '@/common/html-parser';

  import HomeMenuItemRecommend from './HomeMenuItemRecommend.vue';
  import RecommendAddress from './RecommendAddress.vue';
  import RecommendRemind from './RecommendRemind.vue';
  import RecommendMess from './RecommendMess.vue';
  import SecondRecommend from './SecondRecommend.vue';
  import RecommendInfo from './RecommendInfo.vue';
  import RecommendMenu from './RecommendMenu.vue';
  import RecommendCard from './RecommendCard.vue';

  import EvaluateBtn1 from './EvaluateBtn1.vue';
  import uaMarkdown from './ua-markdown/ua-markdown.vue';
  import DocScheduling from './DocScheduling.vue';
  import RecommendDept from './RecommendDept.vue';

  const props = defineProps<{
    msgList: any[];
    headerConfig: StyleConfigType;
    source?: string;
  }>();

  const sysAppMore = ref('');
  let progressTimer: number | null = null;
  const progressWidth = ref(0);

  watch(
    () => msgState.value.msgLoad,
    (newVal) => {
      if (newVal) {
        // 重置进度条
        progressWidth.value = 0;

        // 清除之前的进度定时器
        if (progressTimer) {
          clearInterval(progressTimer);
        }

        // 启动进度条动画
        progressTimer = setInterval(() => {
          // 模拟不规律的进度增长
          const increment = Math.random() * 4 + 2; // 2-10之间的随机数
          progressWidth.value = Math.floor(
            Math.min(progressWidth.value + increment, 95)
          );
        }, 400);
      } else {
        // 清除进度条定时器并完成进度
        if (progressTimer) {
          clearInterval(progressTimer);
          progressTimer = null;
        }

        // 瞬间完成进度条
        progressWidth.value = 100;
      }
    }
  );

  onMounted(async () => {
    const gStores = new GStores();
    const { title, content } = await gStores.getSysAppMore('1222');
    sysAppMore.value = content;
  });

  onUnmounted(() => {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  });

  const previewImage = (url) => {
    uni.previewImage({
      urls: [url],
    });
  };
</script>
<style lang="scss" scoped>
  @use './intalMedicalAssists.scss';
  .smartChatRoom-item {
    font-size: 28rpx;
  }
  .content-area {
    z-index: 0;
    // padding-top: 40rpx;
    min-height: calc(100vh - 590rpx - 210rpx - 40rpx);
    padding-bottom: 200rpx;
    .my-width {
      width: 80vw;
    }
    .chat-my-item {
      border-radius: 8px 0px 8px 8px;
      background-color: var(--hr-brand-color-6);
      color: #fff;
      line-height: 60rpx;
    }
    .chat-system-item {
      border-radius: 0px 8px 8px 8px;
      background-color: #e8f4ff;
      color: #111111;
      max-width: 80vw;
      line-height: 60rpx;
      .sysAppMore {
        line-height: 40rpx;
        color: #888;
      }
    }
    .padding-chat {
      padding: 17rpx 20rpx;
    }
  }
  .transition {
    transition: 0.1s;
  }
  .show-mess {
    padding-top: 0rpx !important;
    // min-height: calc(100vh - 390rpx) !important;
  }
  .flex1 {
    flex: 1 !important;
  }
  .chat-img {
    max-width: 240px;
    // z-index: -1;
  }
  .report-header {
    color: #444;
  }
  .report-declare {
    color: #444;
    font-size: 28rpx;
    line-height: 48rpx;
  }

  .smartChatRoomItem_load {
    align-items: center;

    .progress-text {
      font-size: 24rpx;
      color: var(--hr-brand-color-6);
      margin: 0 6px;
    }

    .loading-cricle {
      width: 16rpx;
      height: 16rpx;
      top: 4rpx;
      margin: 0 0 0 8rpx;
      border-radius: 100%;
      background: var(--hr-brand-color-6);
    }
    $opacity: 1 0.8 0.5 0.3 0.1 0.3 0.5 0.8 1 0.8 0.5 0.3 0.1 0.3;
    @for $i from 0 through 3 {
      $remainder1: ($i + 1) % 4;
      $remainder2: ($i + 2) % 4;
      $remainder3: ($i + 3) % 4;
      $remainder4: ($i + 4) % 4;
      @keyframes change#{$i} {
        100% {
          opacity: nth($opacity, $i + 1);
        }
        85% {
          opacity: nth($opacity, $i + 2);
        }
        60% {
          opacity: nth($opacity, $i + 3);
        }
        45% {
          opacity: nth($opacity, $i + 4);
        }
        30% {
          opacity: nth($opacity, $i + 5);
        }
        15% {
          opacity: nth($opacity, $i + 6);
        }
        0% {
          opacity: nth($opacity, $i + 7);
        }
      }
      .loading-cricle#{$i} {
        // opacity: nth($opacity, $i + 1);
        animation: change#{$i} 2s infinite;
      }
    }
  }
  .mWidth80 {
    min-width: 80vw;
  }
  .auto {
    overflow: auto;
  }
</style>
