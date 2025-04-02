import {
  apiAsync,
  wait,
  cacheUtil,
  callBackAsync,
  packageAuthParams,
  GStores,
} from '@/utils';

import api from '@/service/api';
import { computed, ref } from 'vue';
import wx from 'weixin-js-sdk';

let isWxOfficialAccountAuth = false;
export const useTranslateVoiceHook = () => {
  const isCanUse = ref(false);
  const isListening = ref(false);
  let dateStar = 0;

  const init = async () => {
    // 仅 wx h5
    if (isWxOfficialAccountAuth) {
      isCanUse.value = true;
    } else {
      // 需要设置js接口安全域名
      // 接口权限开启  接收语音识别结果
      const { WxOfficialAccount } = await cacheUtil.getSystemConfig(
        'WxOfficialAccount'
      )();
      const { appId } = WxOfficialAccount;

      if (!appId) {
        return;
      }

      const { result } = await api.allinoneAuthApi(
        packageAuthParams(
          {
            accountType: 1, //微信公众号
            accessUrl: location.href, //与微信公众后台配置js安全域名一直
          },
          '/wx/getSignParamMethod'
        )
      );

      const { jsapi_ticket, nonceStr, signature, timestamp } = result;
      wx.config({
        // debug: true,
        appId, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature, // 必填，签名
        jsApiList: [
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'translateVoice',
        ], // 必填，需要使用的JS接口列表
      });
      await callBackAsync(wx.ready);
      // @ts-expect-error
      const { checkResult } = await apiAsync(wx.checkJsApi, {
        jsApiList: [
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'translateVoice',
        ],
      });

      const { startRecord, stopRecord } = checkResult;

      isCanUse.value = startRecord && stopRecord;
      // isWxOfficialAccountAuth = isCanUse.value;
    }
  };

  setTimeout(init, 200);

  const startRecord = async () => {
    await apiAsync(wx.startRecord, {});
    dateStar = new Date().getTime();
    isListening.value = true;
  };

  const stopRecord = async (): Promise<string> => {
    const gStores = new GStores();
    const dateDuring = new Date().getTime() - dateStar;
    isListening.value = false;
    if (dateDuring < 500) {
      console.log('时间过短, 不进行识别');
      gStores.messageStore.showMessage(
        '诶呀，没听清楚您在说什么，请再说一遍~~~',
        1000
      );
      return '';
    }
    const { localId } = await apiAsync(wx.stopRecord, {});
    // @ts-expect-error
    const { translateResult } = await apiAsync(wx.translateVoice, {
      isShowProgressTips: 1, // 默认为1，显示进度提示
      localId,
    });

    return translateResult;
  };

  return {
    isCanUse,
    open,
    stopRecord,
    startRecord,
    isListening,
  };
};
