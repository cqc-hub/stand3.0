import { defineStore } from 'pinia';
import { joinQuery } from '@/common';
import { LoginUtils } from '@/utils';
import { useGlobalStore, useUserStore } from '@/stores';

const spliceUrl = (prop: Required<Pick<ILoginBack, '_url' | '_query'>>) => {
  const { _url, _query } = prop;

  const dealQuery = Object.fromEntries(
    Object.entries(_query).filter(([key, value]) => value)
  );

  if (_url.includes('?')) {
    return _url + '&' + joinQuery('', dealQuery).slice(1);
  } else {
    return joinQuery(_url, dealQuery);
  }
};

const routerStore = defineStore('router', {
  persist: {
    key: '__ROUTER',
    paths: ['_id', 'fullUrl', 'backRoute', '_p', '_url'],
  },

  state: () => {
    return {
      _p: '',
      _id: '',
      _url: '',
      fullUrl: '',

      backRoute: <ILoginBack>{},
    };
  },

  actions: {
    update_P() {
      this._p = '1';
    },

    update_url(url: string) {
      this._url = url;
    },

    updateId(id) {
      this._id = id;
    },

    updateFullUrl(url: string) {
      // token 过期可能会跳过来
      if (
        url.startsWith('/pagesA/medicalCardMan/perfectReal') ||
        url.startsWith('/pagesA/medicalCardMan/addMedical')
      ) {
        return;
      }

      this.fullUrl = url;
    },

    receiveQuery(prop: ILoginBack) {
      if (!(prop._p || prop._url)) return;

      if (prop._isOutLogin) {
        useGlobalStore().clearStore();
        useUserStore().clearStore();
      }

      this.backRoute = prop;

      if (prop._url) {
        const { _url, _query } = prop;

        let fullUrl = decodeURIComponent(<string>_url);

        if (fullUrl) {
          if (_query) {
            fullUrl = spliceUrl({
              _url: fullUrl,
              _query,
            });
          }

          this.fullUrl = fullUrl;
        }
      } else {
        this.update_P();
      }
    },

    clear() {
      this.$reset();
    },
  },

  getters: {
    isWork(): boolean {
      return !!(this.backRoute._p || this.backRoute._url);
    },
  },
});

export const useRouterStore = function () {
  return routerStore();
};
