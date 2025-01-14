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
        class="flex-column smartChatRoom-item"
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
              <text v-else class="g-break-word">{{ msgItem.msg }}</text>
            </view>
          </view>
        </view>
      </view>
      <view
        v-else
        :id="`smartChatRoomItem_${msgIndex}`"
        class="flex-column smartChatRoom-item"
      >
        <view
          class="flex justify-start padding-right one-show align-start padding-top"
        >
          <view class="flex justify-start">
            <view
              v-if="msgItem.type === 4"
              class="chat-system-item e margin-left by-cyan"
            >
              <!-- <text class="g-break-word">{{ msgItem.msg }}</text> -->
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
            <view
              v-else
              :class="{
                ['flex1']: msgItem.type === 3,
              }"
              class="chat-system-item margin-left padding-chat by-cyan"
            >
              <!-- <text v-if="msgItem.type === 1" class="g-break-word">
                {{ msgItem.msg }}
              </text> -->
              <view
                :class="{ 'b-bottom': msgItem.type.type === 2 }"
                class="flex"
              >
                <view class="flex1">
                  <text
                    :style="
                      msgItem.type === 2
                        ? 'color: #838383; padding: 8rpx 0;word-break: break-all'
                        : ''
                    "
                    :class="{
                      ['color-888 f28']: msgItem.type === 3,
                    }"
                    class="f32"
                  >
                    <text
                      v-if="msgItem.boldMsg"
                      class="g-bold mr12 pb12 lineH64"
                    >
                      {{ msgItem.boldMsg }}\n
                    </text>

                    <text>
                      {{ msgItem.msg }}
                    </text>
                  </text>
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

                  <Evaluate-Btn1
                    v-if="msgItem.requestId"
                    :requestId="msgItem.requestId"
                    @askAgain="clearChatId"
                  />
                  <!--  -->
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>
    <view
      v-if="msgState.msgLoad"
      :id="`smartChatRoomItem_load`"
      class="flex-column smartChatRoom-item"
    >
      <view
        class="flex justify-start padding-right one-show align-start padding-top"
      >
        <view class="flex justify-start">
          <view class="chat-system-item margin-left padding-chat by-cyan">
            <text class="g-break-word">智慧服务大模型生成中</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import { ref, computed, getCurrentInstance, onMounted } from 'vue';
  import { type StyleConfigType } from '../utils/types';
  import SecondRecommend from './SecondRecommend.vue';
  import HomeMenuItemRecommend from './HomeMenuItemRecommend.vue';
  import EvaluateBtn1 from './EvaluateBtn1.vue';
  import RecommendAddress from './RecommendAddress.vue';
  import RecommendInfo from './RecommendInfo.vue';
  import RecommendMenu from './RecommendMenu.vue';
  import { msgState, clearChatId } from '../utils/utils';
  const props = defineProps<{
    msgList: any[];
    headerConfig: StyleConfigType;
  }>();
  const previewImage = (url) => {
    uni.previewImage({
      urls: [url],
    });
  };
  const viewHeight = ref(0);
  onMounted(() => {
    console.log('msgList', props.msgList);
  });
  const getViewHeight = () => {};
</script>
<style lang="scss" scoped>
  @import './intalMedicalAssists.scss';
  .content-area {
    z-index: 0;
    padding-top: 40rpx;
    min-height: calc(100vh - 590rpx - 390rpx - 40rpx);
    padding-bottom: 390rpx;
    .my-width {
      width: 80vw;
    }
    .chat-my-item {
      border-radius: 8px 0px 8px 8px;
      background-color: #296fff;
      color: #fff;
    }
    .chat-system-item {
      border-radius: 0px 8px 8px 8px;
      background-color: #e8f4ff;
      color: #111111;
      max-width: 80vw;
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
    z-index: -1;
  }
</style>
