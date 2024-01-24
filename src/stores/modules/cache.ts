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
      isShowChooseHos: globalGl.SYS_CODE === '1001063',
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
