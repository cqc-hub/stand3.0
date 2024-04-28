import { defineStore } from 'pinia';

type TDialogOpt = {
  title?: string;
  isShowCancel?: boolean; // 默认 false
  isMaskClick?: boolean; // 默认 true
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  cancelColor?: string;
};

let timer: null | number = null;
const messageStore = defineStore('message', {
  state() {
    return {
      isShow: false,
      msg: '',

      useDialog: false,
      isDialogConfirm: false,
      dialogOpt: <TDialogOpt>{},

      duration: 0,
      popupDuration: 500,
      maskClickCallBack: () => {},
      closeCallBack: (args: any) => {},
    };
  },

  actions: {
    toggleDialogConfirm(confirm: boolean) {
      this.isDialogConfirm = confirm;
    },

    showMessage(
      message: string,
      duration = 0,
      options: Partial<{
        maskClickCallBack: () => void;
        closeCallBack: (args: {
          /** useDialog true 时候点了确认还是取消 */
          confirm: boolean;
        }) => void;
        uniToast: boolean;
        useDialog: boolean;
        dialogOpt: TDialogOpt;
      }> = {}
    ) {
      const {
        maskClickCallBack,
        closeCallBack,
        uniToast,
        useDialog,
        dialogOpt,
      } = options;

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
      this.dialogOpt = dialogOpt || {};

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
      this.closeCallBack({
        confirm: this.isDialogConfirm,
      });
    },
  },
});

export const useMessageStore = function () {
  return messageStore();
};
