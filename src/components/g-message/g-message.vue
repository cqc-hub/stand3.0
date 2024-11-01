<template>
  <view
    :style="{
      zIndex: messageStore.dialogOpt.zIndex || 10076,
    }"
    class="g-message"
  >
    <!-- #ifdef  MP-WEIXIN -->
    <xy-dialog title="小程序隐私保护指引" :show="isShowAgreeDialog">
      <scroll-view scroll-y class="reg-tip" >
        <view class="g-break-word color-888">
          感谢您使用本小程序, 您使用本小程序前应当阅井同意,
          <text @click="goAgreement" class="fg-agree-name">
            {{ privacyContractName }}
          </text>
          <view>
            当您点击同意并开始使用产品服务时，即表示你已理解并同息该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法正常使用小程序。
          </view>
        </view>
      </scroll-view>

      <template #confirmBtn>
        <button
          id="agree-btn"
          open-type="agreePrivacyAuthorization"
          class="login-btn btn btn-primary"
          @agreeprivacyauthorization="handlerAgree"
        >
          同意
        </button>
      </template>

      <template #cancelBtn>
        <button id="disagree-btn" class="login-btn" @click="handlerDisagree">
          拒绝
        </button>
      </template>
    </xy-dialog>
    <!-- #endif -->

    <xy-dialog
      :show="messageStore.isShow && messageStore.useDialog"
      :title="messageStore.dialogOpt.title"
      :zIndex="messageStore.dialogOpt.zIndex"
      :confirmColor="messageStore.dialogOpt.confirmColor"
      :cancelColor="messageStore.dialogOpt.cancelColor"
      :confirmText="messageStore.dialogOpt.confirmText"
      :cancelText="messageStore.dialogOpt.cancelText"
      :isShowCancel="messageStore.dialogOpt.isShowCancel ?? false"
      :isMaskClick="messageStore.dialogOpt.isMaskClick ?? true"
      :maxHeight="(messageStore.dialogOpt.maxHeight??550)+50"
      @confirmButton="messageStore.toggleDialogConfirm(true)"
      @cancelButton="messageStore.toggleDialogConfirm(false)"
      @maskClose="messageStore.dialogMaskClose"
      @close="messageStore.closeMessage"
    >
      <scroll-view scroll-y class="reg-tip" :style="{'max-height':`${messageStore.dialogOpt.maxHeight??550}rpx`}">
        <view class="g-break-word color-888 f32">
          <rich-text :nodes="getContent()" />
        </view>
      </scroll-view>
    </xy-dialog>

    <view class="popup">
      <uni-popup
        :duration="messageStore.popupDuration"
        @maskClick="maskClick"
        ref="popup"
        mask-background-color="rgba(0,0,0,0)"
      >
        <view
          :style="containerStyle"
          class="popup-content uni-popup__wrapper center"
        >
          <text class="text">{{ messageStore.msg }}</text>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, nextTick, onMounted } from 'vue';
  import { useMessageStore } from '@/stores';

  import { useWxAuthorizationHook } from './index';
  import HTMLParser from '@/common/html-parser';

  const props = defineProps<{
    isWxAuthInit?: boolean;
  }>();
  const messageStore = useMessageStore();
  const popup = ref();
  const {
    isShowAgreeDialog,
    wxOnNeedPrivacyAuthorization,
    handlerAgree,
    handlerDisagree,
    wxOnNeedPrivacyAuthorizationInit,
    privacyContractName,
  } = useWxAuthorizationHook();

  const usePopup = function (show: boolean) {
    if (messageStore.useDialog) {
      return;
    }

    nextTick(() => {
      const popupRef = popup.value;
      if (!popupRef) return;

      if (show) {
        popupRef.open('center');
      } else {
        popup.value.close();
      }
    });
  };

  const goAgreement = () => {
    // #ifdef  MP-WEIXIN
    wx.openPrivacyContract();
    // #endif
  };

  const getContent = () => {
    const msg = messageStore.msg;
    if (Array.isArray(msg)) {
      return msg;
    } else if (msg) {
      return HTMLParser(msg);
    } else {
      return '';
    }
  };

  uni.$on('showMessage', function () {
    usePopup(messageStore.isShow);
  });

  uni.$on('closeMessage', function () {
    usePopup(messageStore.isShow);
  });

  const maskClick = function () {
    messageStore.closeMessage();
    messageStore.maskClickCallBack();
  };

  const containerStyle = `
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 40rpx;
    color: #fff;
    border-radius: 10rpx;
    background-color: rgba(0, 0, 0, 0.6);
    overflow: hidden;
    max-width: 450rpx;
    position: relative;
    top: -160rpx;
    word-break: break-all;
    z-index: 9999;
    `;

  onMounted(async () => {
    // #ifdef  MP-WEIXIN
    wxOnNeedPrivacyAuthorization();
    // #endif

    if (props.isWxAuthInit) {
      wxOnNeedPrivacyAuthorizationInit();
    }
  });
</script>

<style lang="scss" scoped>
  .popup,
  .g-message {
    position: relative;
    z-index: 10076;
  }
  .text {
    font-size: var(--hr-font-size-base);
    word-break: break-all;
  }

  .login-btn {
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;

    display: inline-block;
    line-height: inherit;
    height: 100%;
    width: 100%;
    vertical-align: middle;
    font-size: var(--hr-font-size-base);
    color: var(--hr-neutral-color-10);

    &::after {
      border: none;
    }
  }

  .fg-agree-name {
    color: var(--hr-brand-color-6);
  }
</style>
