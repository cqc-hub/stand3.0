import PAGE_DATA from '@/pages.json';
import { useGlobalStore } from '@/stores';
import { joinQuery } from '@/common';

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

routerPages.map((o) => {
  pageAdmin.set('/' + o.path, o);
});

//获取路由extend额外参数的方法
const getCurrentRoute = (path: String | undefined) => {
  return pageAdmin.get(path);
};

export const beforeEach = async (
  options: UniNamespace.ReLaunchOptions &
    UniNamespace.ReLaunchOptions &
    UniApp.RedirectToOptions
) => {
  const fullUrl = options.url;
  const url = fullUrl.split('?')[0];
  const currentRoute = getCurrentRoute(url);
  const globalStore = useGlobalStore();

  if (currentRoute) {
    const { extend } = currentRoute;

    if (extend) {
      const { login } = extend;

      if (login) {
        if (!globalStore.isLogin) {
          // return jumpRouter({
          //   navType: 'replace',
          //   url: '/pages/home/my',
          //   query: {
          //     isWarningLogin: '1',
          //     _url: encodeURIComponent(<string>fullUrl)
          //   }
          // });

          uni.reLaunch({
            url: joinQuery('/pages/home/my', {
              isWarningLogin: '1',
              _url: encodeURIComponent(<string>fullUrl)
            })
          });

          return Promise.reject('需要登录----');
        }
      }
    }
  }
};
