import { defineStore } from 'pinia';
import { ServerStaticData } from '@/utils';
import api from '@/service/api';

const viewerStore = defineStore('viewer', {
  persist: {
    key: '_viewer',
    paths: ['viewConfig', 'version', 'homeNoticeMenu'],
  },

  state: () => {
    return {
      viewConfig: <any>[],
      homeNoticeMenu: <IRoute[]>[],
      version: '',
      loading: false,
    };
  },

  actions: {
    async init() {
      this.getVersion();
    },

    async getViewConfig() {
      this.loading = true;
      this.viewConfig = await ServerStaticData.getHomeConfig().finally(() => {
        this.loading = false;
      });

      // 新增公告展示判断 showFlag为1展示
      if (this.viewConfig[1].showFlag) {
        this.getHomeNotice();
      }
    },

    async getHomeNotice() {
      const { result } = await api.getAnnouncementCms({});
      this.homeNoticeMenu = result;
    },

    async getVersion() {
      const oldVersion = this.version;
      if (!oldVersion) {
        this.loading = true;
      }
      const { result } = await api.searchFunctionConfig({
        functionType: '2', //首页配置
      });

      if (oldVersion !== result) {
        this.getViewConfig();
      }

      this.version = result;
    },
  },

  getters: {
    homeTopMenuList(): any[] {
      return this.viewConfig[0]?.functionList || [];
    },

    homeSearchPlaceholder(): string {
      return this.viewConfig[0]?.showFlag == 1
        ? '搜索科室、医生或疾病'
        : '搜索疾病、症状或药品';
    },

    homeBannerFunctionList(): any[] {
      return this.viewConfig[2]?.functionList || [];
    },

    homeBannerLeftFunctionList(): any[] {
      return this.viewConfig[2]?.leftFunctionList || [];
    },

    homeMenuList(): any[] {
      return this.viewConfig[3]?.typeList || [];
    },

    homeNoticeText(): string {
      const len = this.homeNoticeMenu.length;
      if (len) {
        return this.homeNoticeMenu.map((o) => o.title).join('     ');
      } else {
        return '';
      }
    },

    myPersonRecordList(): any[] {
      return this.viewConfig[4]?.functionList || [];
    },

    myMenu1List(): any[] {
      return this.viewConfig[5]?.functionList || [];
    },

    myMenu2List(): any[] {
      return this.viewConfig[6]?.functionList || [];
    },

    myMenu3List(): any[] {
      return this.viewConfig[7]?.functionList || [];
    },
  },
});

export const useViewerStore = function () {
  return viewerStore();
};
