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
      medicalHelpSelList: <any[]>[],
      hosId: '',
      isShowChooseHos: ['1001063','1001066'].includes(globalGl.SYS_CODE), // 杭口用. 部分场景下选择医院展示的组件; hodId 的传入
    };
  },

  actions: {
    changeMedicalHelpSelList(list) {
      this.medicalHelpSelList = list;
    },

    changeHosId(hosId: string) {
      this.hosId = hosId;
    },
  },
});

export const useCacheStore = function () {
  return cacheStore();
};
