import { defineStore } from 'pinia';
import { joinQuery } from '@/common';
import { useGlobalStore, useUserStore } from '@/stores';
import { TBannerConfig } from '@/types';
import { routerJump } from '@/utils';

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
    paths: ['_id', 'fullUrl', 'backRoute', '_p', '_url', 'tbConfig'],
  },

  state: () => {
    return {
      _p: '',
      _id: '',
      _url: '',
      fullUrl: '',

      tbConfig: <TBannerConfig>{},
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

    receiveQuery(prop = {} as ILoginBack) {
      prop = {
        ...prop,
      };
      const {
        _url,
        _query,
        _p,
        _isOutLogin,
        _type,
        extraData,
        addition,
        immed,
      } = prop;

      if (_isOutLogin) {
        useGlobalStore().clearStore();
        useUserStore().clearStore();
      }

      // TBanner
      if (_type === 'useTBanner') {
        if (extraData) {
          try {
            prop.extraData = JSON.parse(extraData);
          } catch (error) {
            console.log('extraData 序列化失败----', extraData);
          }
        }

        if (addition) {
          try {
            prop.addition = JSON.parse(addition);
          } catch (error) {
            console.log('addition 序列化失败----', addition);
          }
        }

        this.tbConfig = prop as any;
        if (immed === '1') {
          routerJump();
        }
      }

      if (!(_p || _url)) return;

      if (_url) {
        if (
          [
            '/pagesA/medicalCardMan/addMedical',
            '/pagesA/medicalCardMan/perfectReal',
            '/pages/home/home',
            '/pages/home/my',
          ].includes(_url)
        ) {
          return;
        }

        let fullUrl = decodeURIComponent(_url);

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

      this.backRoute = prop;
    },

    clear() {
      this.$reset();
    },
  },

  getters: {
    isWork(): boolean {
      return !!(
        this.backRoute._p ||
        this.backRoute._url ||
        Object.keys(this.tbConfig).length
      );
    },
  },
});

export const useRouterStore = function () {
  return routerStore();
};
