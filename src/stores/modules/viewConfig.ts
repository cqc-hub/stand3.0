import { defineStore } from 'pinia';
import api from '@/service/api';


//页面通过接口获取配置化的数据

const viewConfigStore = defineStore('viewConfig', {
  persist: {
    key: 'viewConfig',
    paths: ['homeConfig']
  },

  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      homeConfig: []
    };
  },
  getters: {
    getHomeConfig(): any {
      return this.homeConfig;
    },
  },
  actions: {
    // 获取首页+个人中心配置
    async updateHomeConfig() {
      const { result } = await api.queryHospitalPattern({
        version: '',
        source: 1
      });
      this.homeConfig = result;
    },
  }
});

export const useViewConfigStore = function () {
  return viewConfigStore();
};
