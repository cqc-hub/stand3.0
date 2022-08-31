import { defineStore } from 'pinia';

let timer: null | number = null;
const messageStore = defineStore('message', {
  state() {
    return {
      isShow: false,
      msg: '',
      duration: 0,
      popupDuration: 500,
      maskClickCallBack: () => { },
      closeCallBack: () => { }
    };
  },

  actions: {
    showMessage(
      message: string,
      duration = 0,
      options: Partial<{
        maskClickCallBack: () => void;
        closeCallBack: () => void;
      }> = {}
    ) {
      const { maskClickCallBack, closeCallBack } = options;
      this.isShow = true;
      this.duration = duration;
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

      this.maskClickCallBack = maskClickCallBack || (() => { });
      this.closeCallBack = closeCallBack || (() => { });

    },

    closeMessage() {
      if (timer) {
        clearTimeout(timer);
      }
      this.isShow = false;
      uni.$emit('closeMessage');
      this.closeCallBack();
    }
  }
});

export const useMessageStore = function () {
  return messageStore();
};
