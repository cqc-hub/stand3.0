import { ref } from 'vue';
import { wait } from '@/utils';

let pageLen = 0;
export const useWxAuthorizationHook = () => {
  const isShowAgreeDialog = ref(false);
  /** 是否主动触发标记 */
  let isInitiative = false;
  const pages = getCurrentPages();
  pageLen = pages?.length || 0;
  const privacyContractName = ref('');

  let wxAgreeButtonCB = (payload: {
    buttonId: string;
    event: 'agree' | 'disagree';
  }): void => {};

  // 被动执行
  const wxOnNeedPrivacyAuthorization = () => {
    // #ifdef  MP-WEIXIN
    wx.onNeedPrivacyAuthorization &&
      wx.onNeedPrivacyAuthorization(async (resolve) => {
        wxAgreeButtonCB = resolve;
        await wait(500);
        wxOnNeedPrivacyAuthorizationInit(false);
      });
    // #endif
  };

  /**
   * 主动执行 - _isInitiative = true
   * 应当执行的时机: 页面进入就自动调用微信的授权街口的情况
   */
  const wxOnNeedPrivacyAuthorizationInit = (_isInitiative = true) => {
    // #ifdef  MP-WEIXIN
    isInitiative = _isInitiative;
    wx.getPrivacySetting &&
      wx.getPrivacySetting({
        success(e) {
          const {
            needAuthorization,
            privacyContractName: _privacyContractName,
          } = e;

          if (needAuthorization && pageLen === pages?.length) {
            isShowAgreeDialog.value = true;
            privacyContractName.value = _privacyContractName;
          }
        },
      });
    // #endif
  };

  // 处理被动触发 点击同意
  const handlerPassiveAgree = () => {
    isShowAgreeDialog.value = false;
    wxAgreeButtonCB({
      buttonId: 'agree-btn',
      event: 'agree',
    });
  };

  // 处理主动触发 点击同意
  const handlerInitiativeAgree = async () => {
    if (pages.length) {
      const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;
      uni.reLaunch({
        url: fullUrl,
      });
    }
  };

  const handlerAgree = () => {
    if (isInitiative) {
      handlerInitiativeAgree();
    } else {
      handlerPassiveAgree();
    }
  };

  const handlerPassiveDisagree = () => {
    isShowAgreeDialog.value = false;
    wxAgreeButtonCB({
      buttonId: 'disagree-btn',
      event: 'disagree',
    });
  };

  // 处理主动触发 点击拒绝
  const handlerInitiativeDisagree = () => {
    if (pages.length) {
      uni.navigateBack({
        delta: 1,
      });
    } else {
      uni.reLaunch({
        url: '/pages/home/home',
      });
    }
  };

  const handlerDisagree = () => {
    if (isInitiative) {
      handlerInitiativeDisagree();
    } else {
      handlerPassiveDisagree();
    }
  };

  return {
    isShowAgreeDialog,
    wxOnNeedPrivacyAuthorization,
    handlerAgree,
    handlerDisagree,
    wxOnNeedPrivacyAuthorizationInit,
    privacyContractName,
  };
};
