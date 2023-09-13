import { defineStore } from 'pinia';

//页面存储token brower等
const cacheStore = defineStore('cache', {
  persist: {
    key: 'cache',
    paths: [],
  },

  state: () => {
    return {
      medicalHelpSelList: <any[]>[],
    };
  },

  actions: {
    changeMedicalHelpSelList(list) {
      this.medicalHelpSelList = list;
    },
  },
});

export const useCacheStore = function () {
  return cacheStore();
};
