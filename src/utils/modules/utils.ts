import { useRouterStore } from '@/stores';
import { ServerStaticData } from './serverStaticData';
import { useCommonTo } from '@/common/checkJump';
import { IsAny } from '@/typeUtils';
import { useCacheStore } from '@/stores';
import { GStores } from '@/utils';
import { toPayPull } from '@/components/g-pay';

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

export const callBackAsync = (fn: Function) => {
  return new Promise((r) => fn(r));
};

type TFirstParams<T> = T extends [infer K] ? K : any;
export const apiAsync: <
  T extends {
    (
      opt: { success(any): any; fail(any): any; [key: string]: any },
      ...restOpt: any[]
    ): any;
  }
>(
  api: T,
  opt: Omit<TFirstParams<Parameters<T>>, 'success' | 'fail'>,
  ...otherOpts: Parameters<T> extends [infer P, ...infer K] ? K : any[]
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

export const debounce2 = function (func, wait = 1000, immediate = true): any {
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

export const debounce = function <T = any>(
  fn: T,
  wait: number,
  immediate = true
): T {
  let timer: null | number = null;

  // @ts-expect-error
  return function (...args) {
    return new Promise((resolve) => {
      if (timer) clearTimeout(timer);
      if (immediate) {
        // @ts-expect-error
        resolve(fn.apply(this, args));
      } else {
        // 延迟执行
        timer = setTimeout(() => {
          // @ts-expect-error
          resolve(fn.apply(this, args));
          timer = null;
        }, wait);
      }
    });
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

// 存在回调情况下 跳某个地址(回调优先)
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

export const isTypeofIdCard = (idCard: string) =>
  /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/.test(
    idCard
  );

export const idCardConvert = (idCard: string) => {
  if (isTypeofIdCard(idCard)) {
    return idCard.replace(/^(.{4})(?:\d+)(.{4})$/, '$1******$2');
  }
  return idCard;
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

// 获取当前执行环境
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
 *
 * @param isForce 强制获取定位?
 * @returns
 */
export const getLocation = async function (isForce?: boolean): Promise<{
  latitude: string;
  longitude: string;
}> {
  return new Promise(async (success, fail) => {
    const res = await apiAsync(uni.getLocation, {}).catch((err) => {
      if (err?.errCode === 2 || err?.extError === 12) {
        const gStores = new GStores();
        gStores.messageStore.showMessage('请检查设备是否开启定位', 5000, {
          uniToast: true,
        });
        throw new Error(err);
      }
      if (!isForce) {
        fail(err);
        throw new Error(err);
      }
    });

    // 授权成功
    if (res) {
      const { latitude, longitude } = res;
      // @ts-expect-error
      res.longitude = longitude + '';
      // @ts-expect-error
      res.latitude = latitude + '';

      success(res as any);
    } else {
      const reAuth = async function () {
        // #ifdef MP-WEIXIN
        const { authSetting } = await apiAsync(uni.getSetting, {});
        const qx = authSetting['scope.userLocation'];
        if (qx) {
          success(await getLocation(isForce));
        } else {
          await apiAsync(uni.showModal, {
            content: '获取定位失败, 请重新授权',
            showCancel: false,
          });

          await apiAsync(uni.openSetting, {});
          reAuth();
        }

        // #endif

        // #ifndef MP-WEIXIN
        success(await getLocation(isForce));
        // #endif
      };

      reAuth();
    }
  });
};

//拼接path的方法
export const addHosIdForSelfH5Path = (path: string) => {
  const cacheStore = useCacheStore();
  if (
    cacheStore.isShowChooseHos &&
    cacheStore.hosId !== '' &&
    !path.includes('hosId')
  ) {
    let connector = path.includes('?') ? '&' : '?';
    path += `${connector}hosId=${cacheStore.hosId}`;
  }
  return path;
};

/**第三方自费支付 */
export const thirdWxPay = (V3PageData) => {
  const { nonceStr, paySign, signType, timeStamp } = V3PageData;
  const invokeData = {
    nonceStr,
    packAge: V3PageData.package,
    paySign,
    signType,
    timeStamp,
  };
  console.warn('V3PageData', V3PageData);
  const gStores = new GStores();
  //拉起支付
  // @ts-expect-error
  toPayPull({ invokeData: invokeData })
    .then((res: any) => {
      // #ifdef MP-ALIPAY
      if (res.payedRes.resultCode == '9000') {
        //支付宝成功支付
        if (V3PageData.miniUrl) {
          uni.navigateTo({
            url:
              '/pagesC/cloudHospital/myPath?type=1&path=' +
              encodeURIComponent(V3PageData.miniUrl),
          });
        }
      } else {
        gStores.messageStore.showMessage('取消支付', 1500, {
          uniToast: true,
        });
      }
      // #endif

      // #ifdef MP-WEIXIN
      //处理跳转
      if (V3PageData.miniUrl) {
        uni.navigateTo({
          url:
            '/pagesC/cloudHospital/myPath?type=1&path=' +
            encodeURIComponent(V3PageData.miniUrl),
        });
      }
      // #endif
    })
    .catch((err) => {
      let msg = err.errMsg.indexOf('cancel') != '-1' ? '取消支付' : err.errMsg;
      gStores.messageStore.showMessage(msg, 2000, {
        closeCallBack: () => {
          if (V3PageData.cancelUrl) {
            uni.navigateTo({
              url:
                '/pagesC/cloudHospital/myPath?type=1&path=' +
                encodeURIComponent(V3PageData.cancelUrl),
            });
          }
        },
      });
    });
};


/**
 * 修改 \n 成换行 -> rich-text
 */
export const throughCharacterLineFeed = (str: string, replaceStr = '<div />') => {
  if (str) {
    str = str.replaceAll('\\n', replaceStr)
  }

  return str
}