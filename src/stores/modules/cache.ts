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

    changeHosId(hosId: string) {
      this.hosId = hosId;
    },

    changeCacheData(data) {
      this.cacheData = data;
    },
  },
});

export const useCacheStore = function () {
  return cacheStore();
};
