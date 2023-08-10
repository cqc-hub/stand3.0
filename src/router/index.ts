import PAGE_DATA from '@/pages.json';
import globalGl from '@/config/global';
import { useGlobalStore, useUserStore } from '@/stores';
import { joinQuery } from '@/common';

const pageAdmin = new Map();
const routerPages = [...PAGE_DATA.pages];
const subPackages = PAGE_DATA.subPackages;

if (subPackages) {
  subPackages.map(({ root, pages }) => {
    pages.map((o) => {
      routerPages.push(<any>{
        ...o,
        path: root + '/' + o.path,
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

type TRoute = {
  _isLogin?: boolean;
  _isPatient?: boolean;
  _isHerenId?: boolean;
};
export const beforeEach = async (
  options: UniNamespace.ReLaunchOptions &
    UniNamespace.ReLaunchOptions &
    UniApp.RedirectToOptions &
    TRoute
) => {
  const fullUrl = options.url;
  const url = fullUrl.split('?')[0];
  const currentRoute = getCurrentRoute(url);

  if (currentRoute) {
    const globalStore = useGlobalStore();
    const userStore = useUserStore();

    const { extend } = currentRoute;
    let [login, patient, herenId] = [false, false, false];

    if (extend) {
      let { login: _login, patient: _patient, herenId: _herenId } = extend;

      login = _login;
      patient = _patient;
      herenId = _herenId;
    }

    if (options._isLogin) {
      login = true;
    }

    if (options._isHerenId) {
      herenId = true;
    }

    if (options._isPatient) {
      patient = true;
    }

    if (patient) {
      herenId = true;
      login = true;
    } else if (herenId) {
      login = true;
    }

    if (patient) {
      herenId = true;
      login = true;
    } else if (herenId) {
      login = true;
    }

    if (login) {
      if (!globalStore.isLogin) {
        uni.reLaunch({
          url: joinQuery('/pages/home/my', {
            isWarningLogin: '1',
            _url: encodeURIComponent(<string>fullUrl),
          }),
        });

        return Promise.reject('需要登录----');
      }

      if (herenId) {
        if (!globalStore.herenId) {
          uni.reLaunch({
            url: joinQuery(globalGl.addPersonUrl + '', {
              pageType: 'perfectReal',
              _url: encodeURIComponent(<string>fullUrl),
            }),
          });

          return Promise.reject('需要完善----');
        }
      }

      if (patient) {
        if (!userStore.patList.length) {
          uni.reLaunch({
            url: joinQuery(globalGl.addPersonUrl + '', {
              _url: encodeURIComponent(<string>fullUrl),
            }),
          });

          return Promise.reject('需要就诊人----');
        }
      }
    }

    // #ifdef MP-WEIXIN
    if (
      [
        '/pagesA/medicalCardMan/perfectReal',
        '/pagesA/medicalCardMan/addMedical',
      ].includes(url)
    ) {
      if (!globalStore.h5OpenId && globalGl.h5AppId) {
        uni.reLaunch({
          url: '/pages/home/startCome',
        });
        return Promise.reject('需要 h5openid');
      }
    }
    // #endif
  }
};
