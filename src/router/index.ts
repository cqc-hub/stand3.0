import { createRouter, BeforeEachResult } from '@gowiny/uni-router';
import PAGE_DATA from '@/pages.json';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';
import { joinQuery } from '@/common';

import { IPageRoute, IExtend } from './type';

const pageAdmin = new Map();
const routerPages = [...PAGE_DATA.pages];
const subPackages = PAGE_DATA.subPackages;

if (subPackages) {
  subPackages.map(({ root, pages }) => {
    pages.map((o) => {
      routerPages.push({
        ...o,
        path: root + '/' + o.path
      });
    });
  });
}

uni.reLaunch = () => {
  console.log('23333');
};

routerPages.map((o) => {
  pageAdmin.set('/' + o.path, o);
});

//获取路由extend额外参数的方法
const getCurrentRoute = (path: String | undefined) => {
  return pageAdmin.get(path);
};

//初始化
const router = createRouter({
  pageData: PAGE_DATA
});

const jumpRouter = function (route: { url: string; query?: ILoginBack & BaseObject; navType: 'replace' | 'push' }) {
  const { url, query, navType } = route;

  const dUrl = query ? joinQuery(url, query) : url;
  const uniRouteKey = navType === 'replace' ? 'reLaunch' : 'navigateTo';

  // #ifdef MP-WEIXIN
  uni.showLoading({
    title: '加载中...',
    mask: true
  });
  setTimeout(() => {
    uni[uniRouteKey]({
      url: dUrl,
      complete: uni.hideLoading
    });
  }, 500);
  // #endif

  // #ifdef MP-ALIPAY
  return {
    to: {
      path: url,
      query
    },
    navType
  };
  // #endif
};
//全局路由前置守卫
router.beforeEach(async (to, from) => {
  const currentRoute = getCurrentRoute(to.path);
  const globalStore = useGlobalStore();

  // console.log({
  //   to,
  //   from,
  //   currentRoute,
  //   pageAdmin,
  //   globalStore,
  //   isLogin: globalStore.isLogin
  // });

  if (currentRoute) {
    const { extend } = currentRoute;

    if (extend) {
      const { login } = extend;

      if (login) {
        if (!globalStore.isLogin) {
          console.log('需要登录----');
          return jumpRouter({
            navType: 'replace',
            url: '/pages/home/my',
            query: {
              isWarningLogin: '1',
              _url: encodeURIComponent(<string>to.fullPath)
            }
          });
        }
      }
    }
  }
});

router.afterEach(async (to, from) => {});

export default router;
