import { useRouterStore } from '@/stores';
import { ServerStaticData } from './serverStaticData';
import { useCommonTo } from '@/common/checkJump';
import { IsAny } from '@/typeUtils';
import { intersectionWith, isEqual, mergeWith, unionWith } from 'lodash';
import { isArray, isObject } from './is';

type NeverTurnsAny<T> = T extends never ? any : T;

//获取随机id
export const generateUuid = function (len = 36, binary = 16) {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, (c) => {
      const r = (Math.random() * binary) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;

      return v.toString(binary);
    })
    .substring(0, len);
};

export const compose =
  (...fns) =>
  (arg) =>
    fns.reduce((acc, fn) => fn(acc), arg);

export const wait = (wait: number) => new Promise((r) => setTimeout(r, wait));

export const apiAsync: <
  T extends {
    (
      opt: { success(any): void; fail(any): any; [key: string]: any },
      ...restOpt: any[]
    ): any;
  }
>(
  api: T,
  opt: BaseObject,
  ...otherOpts: any[]
) => Promise<
  NeverTurnsAny<
    IsAny<T> extends true ? any : Parameters<Parameters<T>[0]['success']>[0]
  >
> = (api, opt, ...otherOpts) => {
  return new Promise((success: any, fail) => {
    api(
      {
        ...opt,
        success,
        fail,
      },
      ...otherOpts
    );
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

  if (routerStore.isWork) {
    const _p = routerStore._p;
    if (_p) {
      const menus = await ServerStaticData.getHomeConfig();

      const menuItem = getMenuById(routerStore._id, menus);
      menuItem && useCommonTo(menuItem, { type: 'reLaunch' });

      routerStore.clear();
    } else {
      if (routerStore.fullUrl.startsWith('/pages/login/h5')) {
        uni.reLaunch({
          url: '/pages/home/home',
        });
      } else {
        uni.reLaunch({
          url: routerStore.fullUrl,
        });
      }
    }
    routerStore.clear();
  } else {
    url &&
      uni.reLaunch({
        url,
      });
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

export const getMiniProgramEnv = async function (): Promise<
  '' | 'develop' | 'trial' | 'release'
> {
  let containerEnv = 'h5';

  // #ifdef MP-WEIXIN
  containerEnv = 'wx';
  // #endif

  // #ifdef MP-ALIPAY
  containerEnv = 'alipay';
  // #endif

  switch (containerEnv) {
    case 'wx':
      return __wxConfig.envVersion;

    case 'alipay':
      const { envVersion } = await apiAsync(my.getRunScene, {});
      return envVersion;

    default:
      return '';
  }
};

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export const deepMerge = function <
  T extends object | null | undefined,
  U extends object | null | undefined
>(
  source: T,
  target: U,
  mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace'
): T & U {
  if (!target) {
    return source as T & U;
  }
  if (!source) {
    return target as T & U;
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual);
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual);
        case 'concat':
          return sourceValue.concat(targetValue);
        case 'replace':
          return targetValue;
        default:
          throw new Error(
            `Unknown merge array strategy: ${mergeArrays as string}`
          );
      }
    }
    if (isObject(targetValue) && isObject(sourceValue)) {
      return deepMerge(sourceValue, targetValue, mergeArrays);
    }
    return undefined;
  });
};
