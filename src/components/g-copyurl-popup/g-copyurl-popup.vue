<template>
  <view class="">
    <g-popup :title="title" @hide="hide" zIndex="20" ref="popup">
      <view class="pop-container flex-normal flex-column">
        <view class="flex1 dialog-container g-break-word color-444 f32">
          <text class="mr12">链接:</text>
          <text>{{ copyDataUrl }}</text>
        </view>

        <view class="footer pr12">
          <button
            v-if="!isCopySuccess"
            @click="copyUrlLink"
            class="btn btn-primary flex-normal"
          >
            <view class="text-no-wrap flex-normal">
              <view class="iconfont color-fff g-bold-normal"> &#xe716; </view>
              <view>点击复制链接</view>
            </view>
          </button>

          <view v-else class="g-flex-rc-cc color-blue f36 text-no-wrap">
            <text class="iconfont color-blue f40">&#xe6c7;</text>
            <text class="g-bold">复制成功 去浏览器粘贴</text>
          </view>
        </view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';

import { GStores } from '@/utils';

const props = defineProps<{
  copyDataUrl: string;
  title: string;
}>();
const isCopySuccess = ref(false);
const gStores = new GStores();
const popup = ref<any>('');

const copyUrlLink = () => {
  uni.setClipboardData({
    data: props.copyDataUrl,
    success: function () {
      isCopySuccess.value = true;

      gStores.messageStore.showMessage('复制链接成功!', 3000, {
        uniToast: true,
      });
    },

    fail() {
      gStores.messageStore.showMessage('剪贴失败!!', 3000);
    },
  });
};

const show = () => {
  popup.value.show();
};

const hide = () => {
  isCopySuccess.value = false;
};

defineExpose({
  show,
});
</script>

<style lang="scss" scoped>
.pop-container {
  height: 700rpx;
  padding: 0 32rpx;
  align-items: flex-start;

  .dialog-container {
    padding: 32rpx 0;
  }

  .footer {
    width: 100%;
    padding-bottom: 20rpx;
    margin-bottom: 20rpx;
  }
}
</style>
