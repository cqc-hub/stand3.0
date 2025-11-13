import { defineStore } from 'pinia';
import { ServerStaticData, GStores } from '@/utils';
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
    async init(source = '') {
      if (!this.viewConfig.length) {
        this.version = '';
      }

      this.getVersion(source);
    },

    async getViewConfig(source = '') {
      this.loading = true;
      this.viewConfig = await ServerStaticData.getHomeConfig()
        .catch((e) => {
          this.clearStore();
          console.error(e);
          throw new Error('获取首页配置错误');
        })
        .finally(() => {
          this.loading = false;
        });

      // 新增公告展示判断 showFlag为1展示
      if (this.viewConfig[1].showFlag === '1') {
        this.getHomeNotice();
      }
    },

    async getHomeNotice() {
      const { result } = await api.getAnnouncementCms({});
      this.homeNoticeMenu = result;
    },
    async getMyOralCellMessage() {
      try {
        const { result } = await api.getOrderCnt({
          openId: JSON.parse(uni.getStorageSync('global')).openId,
          source: '19', //微信环境
        });

        if (result) {
          const { waitPayNum, waitWriteOff } = result;

          this.myMenuCellList.map((item) => {
            const query = item.query && JSON.parse(item.query);
            if (query?.key === 'myOralCell-waitPayNum') {
              item.messageNum = waitPayNum || 0;
            } else if (query?.key === 'myOralCell-waitWriteOff') {
              item.messageNum = waitWriteOff || 0;
            }
            return item;
          });
        }
      } catch (error) {
        console.error('获取订单统计失败:', error);
        this.clearMyMenuCellMessage();
      }
    },
    clearMyMenuCellMessage() {
      this.myMenuCellList.forEach((item) => {
        item.messageNum = 0;
      });
    },
    async getVersion(source = '') {
      const oldVersion = this.version;
      if (!oldVersion) {
        this.loading = true;
      }
      const { result } = await api.searchFunctionConfig({
        functionType: '2', //首页配置
      });

      if (oldVersion !== result) {
        this.clearStore();
        await this.getViewConfig(source);
      }

      this.version = result;
    },
    clearStore() {
      this.$reset();
    },
  },

  getters: {
    homeTopMenuList(): any[] {
      return this.viewConfig[0]?.functionList || [];
    },

    homeSearchPlaceholder(): string {
      const gStores = new GStores();
      const sysCode = gStores.globalStore.sysCode;
      return this.viewConfig[8]?.showFlag == 1
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

    homeBallList(): any[] {
      return this.viewConfig[9]?.functionList || [];
    },

    myBallList(): any[] {
      return this.viewConfig[10]?.functionList || [];
    },

    myPersonRecordList(): any[] {
      // return [this.viewConfig[4]?.functionList[0]];
      return this.viewConfig[4]?.functionList || [];
    },

    myMenu1List(): any[] {
      return (
        this.viewConfig[5]?.functionList?.filter((item) => {
          try {
            const query = item.query && JSON.parse(item.query);
            if (query && typeof query === 'object' && query.key) {
              return !query.key.startsWith('myOralCell-');
            }
            return true;
          } catch (e) {
            console.error('Failed to parse query:', e);
            return true; // 如果解析失败，保留该元素
          }
        }) || []
      );
    },
    myMenu2List(): any[] {
      return this.viewConfig[6]?.functionList || [];
    },

    myMenu3List(): any[] {
      return this.viewConfig[7]?.functionList || [];
    },
    myMenuCellList(): any[] {
      return (
        this.viewConfig[5]?.functionList
          ?.filter((item) => {
            try {
              const query = item.query && JSON.parse(item.query);
              if (query && typeof query === 'object' && query.key) {
                return query.key.startsWith('myOralCell-');
              }
              return false;
            } catch (e) {
              console.error('Failed to parse query:', e);
              return false;
            }
          })
          .sort((a, b) => {
            try {
              const queryA = JSON.parse(a.query);
              const queryB = JSON.parse(b.query);
              // 确保 queryA 和 queryB 是对象
              if (
                queryA &&
                typeof queryA === 'object' &&
                queryB &&
                typeof queryB === 'object'
              ) {
                return (queryA.sort || 0) - (queryB.sort || 0);
              }
              return 0;
            } catch (e) {
              console.error('Failed to parse query during sorting:', e);
              return 0;
            }
          }) || []
      );
    },
  },
});

export const useViewerStore = function () {
  return viewerStore();
};
