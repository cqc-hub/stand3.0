import { defineStore } from 'pinia';

//页面存储token brower等
const globalStore = defineStore('global', {
  persist: {
    key: 'global',
    paths: ['token']
  },

  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      token: {
        accessToken: ''
      },
      //来源
      browser: {
        source: 4,
        accountType: 2,
        payType: 'ALI_WAP'
      }
    }
  },
  getters: {
    getToken(): any {
      return this.token
    },
    getBrowser(): any {
      return this.browser
    }
  },
  actions: {
    updateToken(token) {
      this.token = token;
    },
    updateBrowser(browser) {
      this.browser = browser;
    }
  },
})

export const useGlobalStore = function () {
  return globalStore()
}