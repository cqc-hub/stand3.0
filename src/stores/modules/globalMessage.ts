import { defineStore } from 'pinia';

let timer: null | number = null;
const messageStore = defineStore('message', {
  state() {
    return {
      isShow: false,
      msg: '',

      useDialog: false,
      dialogTitle: '',

      duration: 0,
      popupDuration: 500,
      maskClickCallBack: () => {},
      closeCallBack: () => {},
    };
  },

  actions: {
    showMessage(
      message: string,
      duration = 0,
      options: Partial<{
        maskClickCallBack: () => void;
        closeCallBack: () => void;
        uniToast: boolean;
        useDialog: boolean;
        dialogTitle: string;
      }> = {}
    ) {
      const { maskClickCallBack, closeCallBack, uniToast, useDialog } = options;

      if (uniToast) {
        uni.showToast({
          title: message,
          icon: 'none',
          duration,
        });

        return;
      }

      this.isShow = true;
      this.useDialog = useDialog!;
      this.duration = useDialog ? 0 : duration;
      this.msg = message;

      uni.$emit('showMessage');

      if (timer) {
        clearTimeout(timer);
      }

      if (duration) {
        timer = setTimeout(() => {
          this.closeMessage();
        }, duration);
      }

      this.maskClickCallBack = maskClickCallBack || (() => {});
      this.closeCallBack = closeCallBack || (() => {});
      uni.hideLoading();
    },

    closeMessage() {
      if (timer) {
        clearTimeout(timer);
      }
      this.isShow = false;
      uni.$emit('closeMessage');
      this.closeCallBack();
    },
  },
});

export const useMessageStore = function () {
  return messageStore();
};
