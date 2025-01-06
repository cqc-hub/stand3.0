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
              <text class="g-break-word">{{ msgItem.msg }}</text>
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
            <view class="chat-system-item margin-left padding-chat by-cyan">
              <text class="g-break-word">{{ msgItem.msg }}</text>
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
              <text class="g-break-word">加载中，请稍等</text>
            </view>
          </view>
        </view>
      </view>
  </view>
</template>
<script setup lang="ts">
  import { ref, computed, getCurrentInstance, onMounted } from 'vue';
  import { type StyleConfigType } from '../utils/types';
  import {msgState} from '../utils/utils'
  const props = defineProps<{
    msgList: any[];
    headerConfig: StyleConfigType;
  }>();
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
      width: 400rpx;
    }
    .chat-my-item {
      border-radius: 8px 0px 8px 8px;
      background-color: #296fff;
      color: #fff;
    }
    .chat-system-item {
      border-radius:8px 8px 8px 0px  ;
      background-color: #E8F4FF;
      color: #111111;
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
    min-height: calc(100vh - 390rpx) !important;
  }
</style>
