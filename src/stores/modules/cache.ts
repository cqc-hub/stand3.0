import { joinQuery } from '@/common';
import globalGl from '@/config/global';
import { defineStore } from 'pinia';

//页面存储token brower等
const cacheStore = defineStore('cache', {
  persist: {
    key: 'cache',
    paths: ['medicalHelpSelList'],
  },

  state: () => {
    return {
      medicalPathArg: <Record<string, string>>{},
      medicalAuthArg: <Record<string, any>>{},
      healthCardCache: <any>{},
      cacheData: <any>{},
      medicalHelpSelList: <any[]>[],
      hosId: '',
      isShowChooseHos: ['1001063', '1001066'].includes(globalGl.SYS_CODE), // 杭口用. 部分场景下选择医院展示的组件; hodId 的传入
      flagList: [
        {
          label: '用户条款',
          flag: '1212',
        },
        {
          label: '隐私条款',
          flag: '1213',
        },
        {
          label: '个人信息清单',
          flag: '1210',
        },
        {
          label: '第三方信息共享清单',
          flag: '1211',
        },
      ],
    };
  },

  actions: {
    changeMedicalHelpSelList(list) {
      this.medicalHelpSelList = list;
    },
    changeHealthCardCache(healthCardData: any) {
      this.healthCardCache = healthCardData;
    },
    changeHosId(hosId: string) {
      this.hosId = hosId;
    },

    changeCacheData(data) {
      this.cacheData = data;
    },

    changeMedicalPathArg(arg: Record<string, string>) {
      this.medicalPathArg = arg;
    },

    changeMedicalAuthArg(arg: Record<string, any>) {
      this.medicalAuthArg = arg;
    },
    changeFlagList(arg?: any[], isOpenAIPolicy?: boolean) {
      let flagList = arg || [
        {
          label: '用户条款',
          flag: '1212',
        },
        {
          label: '隐私条款',
          flag: '1213',
        },
        {
          label: '个人信息清单',
          flag: '1210',
        },
        {
          label: '第三方信息共享清单',
          flag: '1211',
        },
      ];
      isOpenAIPolicy &&
        flagList.push({
          label: 'AI助手用户协议',
          flag: '1240',
        });
      this.flagList = flagList;
    },
  },
});

export const useCacheStore = function () {
  return cacheStore();
};
