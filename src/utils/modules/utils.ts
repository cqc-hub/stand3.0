import {
  useRouterStore,
  useMessageStore,
  useGlobalStore,
  useUserStore,
} from '@/stores';
import { ServerStaticData } from './serverStaticData';
import { useCommonTo } from '@/common/checkJump';
import { IsAny } from '@/typeUtils';

type NeverTurnsAny<T> = T extends never ? any : T;
export const compose =
  (...fns) =>
  (arg) =>
    fns.reduce((acc, fn) => fn(acc), arg);

export const wait = (wait: number) => new Promise((r) => setTimeout(r, wait));

export const apiAsync: <
  T extends {
    (opt: { success(any): void; fail(any): any; [key: string]: any }): any;
  }
>(
  api: T,
  opt: BaseObject
) => Promise<
  NeverTurnsAny<
    IsAny<T> extends true ? any : Parameters<Parameters<T>[0]['success']>[0]
  >
> = (api, opt) => {
  return new Promise((success: any, fail) => {
    api({
      ...opt,
      success,
      fail,
    });
  });
};

export const debounce = function (func, wait = 1000, immediate = true): any {
  let timer;
  return function () {
    // @ts-ignore
    let context = this,
      args = arguments;
    if (timer) clearTimeout(timer);
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timer = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
};

export const throttle = (func, wait = 1000, type = 1) => {
  let previous = 0;
  let timeout;
  return function () {
    // @ts-ignore
    let context = this;
    let args = arguments;
    if (type === 1) {
      let now = Date.now();

      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    }
  };
};

const getMenuById = (_id: string, _list: any[]) => {
  const deepSearch = (id: string, list: any[], source) => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.id == id) {
        source.value = item;
        break;
      } else {
        const { functionList, leftFunctionList, typeList } = item;

        const children: any[] = [];

        if (functionList) {
          children.push(...functionList);
        }

        if (leftFunctionList) {
          children.push(...leftFunctionList);
        }

        if (typeList) {
          children.push(...typeList);
        }

        if (children.length) {
          deepSearch(id, children, source);
        }
      }
    }
  };

  const result: { value?: {} } = {};

  deepSearch(_id, _list, result);
  return result.value;
};

export const routerJump = async (url?: `/${string}`) => {
  const routerStore = useRouterStore();
  const messageStore = useMessageStore();
  const globalStore = useGlobalStore();
  const userStore = useUserStore();
  if (routerStore.isWork) {
    const _p = routerStore._p;
    if (!_p) {
      uni.reLaunch({
        url: routerStore.fullUrl,
      });
    } else {
      const menus = await ServerStaticData.getHomeConfig();

      const menuItem = getMenuById(routerStore._id, menus);
      if (menuItem) {
        useCommonTo(menuItem, { type: 'reLaunch' });
      } else {
        // messageStore.showMessage(
        //   '未找到对应menuId 的 menu：' + routerStore._id
        // );
      }

      routerStore.clear();
    }
    routerStore.clear();
  } else {
    if (url) {
      uni.reLaunch({
        url,
      });
    }
  }
};

export const openLocation = async (
  [latitude, longitude]: number[],
  opt = {
    name: '',
    address: '',
  }
) => {
  const { name, address } = opt;

  uni.openLocation({
    latitude,
    longitude,
    name,
    address,
  });
};

/**
 * 脱敏-name
 */
export const nameConvert = (name: string) => {
  if (!name) {
    return '';
  }
  let userName = '';
  if (name.length == 1) {
    userName = '*';
  } else if (name.length > 1) {
    userName = '';
    for (let i = 1; i < name.length; i++) {
      userName += '*';
    }
    userName += name.slice(-1);
  }
  return userName;
};

export const previewImage = (
  urls: string[],
  payload: {
    current?: number;
    indicator?: 'none' | 'default' | 'number';
    loop?: boolean;
  } = {}
) => {
  uni.previewImage({
    urls,
    ...payload,
  });
};

export const downFile = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url,
      success(e) {
        resolve(e.tempFilePath);
      },
      fail(e) {
        console.error(`Download file error: ${url}`, 'reason:', e);
        reject(e);
      },
    });
  });
};

//获取当前时间戳方法
export const getTimeStamp = (num?: number) => {
  var dateTime = JSON.stringify(new Date().getTime());
  if (num) {
    return dateTime.substring(Number(dateTime.length) - num);
  } else {
    return dateTime;
  }
};
