import { defineStore } from 'pinia';

//页面存储token brower等
const routerStore = defineStore('router', {
  persist: {
    key: 'router',
    paths: ['itemUrl']
  },

  state: () => {
    return {
      itemUrl: ''
    };
  },

  actions: {
    updateItemUrl(itemUrl) {
      this.itemUrl = itemUrl
    }
  }
});

export const useRouterStore = function () {
  return routerStore();
};
