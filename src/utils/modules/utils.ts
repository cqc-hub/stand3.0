import { useRouterStore, useUserStore } from '@/stores';
import { ServerStaticData } from './serverStaticData';
import { useCommonTo } from '@/common/checkJump';
import { IsAny } from '@/typeUtils';
import { useCacheStore } from '@/stores';
import { GStores } from '@/utils';
import { toPayPull } from '@/components/g-pay';
import api from '@/service/api';
import globalGl from '@/config/global';
import { deQueryForUrl, joinQueryForUrl } from '@/common';

type NeverTurnsAny<T> = T extends never ? any : T;

export const getSystemSafeBottom = async () => {
  const e = await uni.getSystemInfo({});
  const { safeAreaInsets, screenWidth } = e;
  let bottomInsetPx = safeAreaInsets?.bottom || 20;
  bottomInsetPx = bottomInsetPx > 44 ? 44 : bottomInsetPx;
  const pxToRpx = 750 / screenWidth;

  const bottomPadding = bottomInsetPx * pxToRpx;

  return bottomPadding;
};

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

//获取随机数字长度的id
export const generateRandomUserId = (length: number = 17): string => {
  // 获取当前时间戳（毫秒级）
  const timestamp = Date.now().toString();

  // 计算需要生成的随机数长度
  const randomLength = Math.max(0, length - timestamp.length);

  // 生成指定长度的随机数字
  let randomPart = '';
  for (let i = 0; i < randomLength; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    randomPart += randomDigit;
  }

  // 组合时间戳和随机数
  let userId = timestamp + randomPart;

  // 确保不超过指定长度
  userId = userId.substring(0, length);

  return userId;
};

export const compose =
  (...fns) =>
  (arg) =>
    fns.reduce((acc, fn) => fn(acc), arg);

export const wait = (wait: number, cb: (...args: any[]) => any = () => {}) =>
  new Promise((r) =>
    setTimeout(() => {
      r(void 0);
      cb();
    }, wait)
  );

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
  },
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
export const routerJump = async (url?: `/${string}`, type?: string) => {
  const gStores = new GStores();

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

/**
 *
 * 脱敏-phone
 * @returns string
 */
export const phoneConvert = (phone: string) => {
  if (phone) {
    return phone.replace(/(\d{3})\d*(\d{4})/, '$1******$2');
  }

  return '';
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
export const getLocation = async function (
  isForce?: boolean,
  opt: {
    timeoutMs?: number;
    hasGetNumber: number;
  } = {
    hasGetNumber: 0,
  }
): Promise<{
  latitude: string;
  longitude: string;
}> {
  return new Promise(async (success, fail) => {
    !isForce &&
      setTimeout(() => {
        fail(
          new Error(`非强制定位在${opt?.timeoutMs || 5000}毫秒后自动超时报错`)
        );
      }, opt?.timeoutMs || 5000);
    const res: any = await apiAsync(uni.getLocation, {}).catch((err) => {
      console.error('getLocation', err);

      if (err?.errCode === 2 || err?.extError === 12) {
        const gStores = new GStores();
        gStores.messageStore.showMessage('请检查设备是否开启定位', 1500, {
          closeCallBack: () => {
            fail(err);
          },
        });
      } else {
        fail(err);
      }
    });
    console.log('res', res);
    // 授权成功
    if (res) {
      const { latitude, longitude } = res;
      res.longitude = longitude + '';
      res.latitude = latitude + '';

      success(res as any);
    } else {
      const reAuth = async function () {
        // #ifdef MP-WEIXIN
        const { authSetting } = await apiAsync(uni.getSetting, {});
        const qx = authSetting['scope.userLocation'];
        if (qx) {
          opt.hasGetNumber++;
          if (opt.hasGetNumber > 10) {
            const { confirm } = await apiAsync(uni.showModal, {
              content: '获取定位失败, 请检查设备是否开启定位',
              confirmText: '再次获取',
            });
            if (!confirm) {
              throw new Error('获取定位失败,用户取消定位');
            }
          }

          isForce && success(await getLocation(isForce, opt));
        } else {
          const { confirm } = await apiAsync(uni.showModal, {
            content: '获取定位失败, 请重新授权',
            showCancel: !isForce,
          });
          if (confirm) {
            await apiAsync(uni.openSetting, {});
            isForce && reAuth();
          }
        }

        // #endif

        // #ifndef MP-WEIXIN
        isForce && success(await getLocation(isForce, opt));
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

/**第三方自费支付 兼容2.0数据 */
export const thirdWxPay = (V3PageData) => {
  if (V3PageData && V3PageData.paymentData) {
    // 2.0 支付参数
    V3PageData = {
      ...V3PageData.paymentData,
      miniUrl: V3PageData.returnUrl?.successUrl || '',
      successUrl: V3PageData.returnUrl?.errorUrl || '',
    };
  }
  const {
    nonceStr,
    paySign,
    signType,
    timeStamp,
    miniUrl = '',
    successUrl = '',
  } = V3PageData;
  !miniUrl && successUrl && (V3PageData.miniUrl = successUrl);
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
export const throughCharacterLineFeed = (
  str: string,
  replaceStr = '<div />'
) => {
  if (str) {
    str = str.replace(/[\r\n]/g, replaceStr);
  }

  return str;
};

/**
 * 获取当前运行平台
 */
export const getPlatform = (): 'wx' | 'alipay' | 'h5' | 'tt' => {
  // #ifdef MP-WEIXIN
  return 'wx';
  // #endif

  // #ifdef MP-ALIPAY
  return 'alipay';
  // #endif

  // #ifdef H5
  return 'h5';
  // #endif

  // #ifdef MP-TOUTIAO
  return 'tt';
  // #endif

  return 'wx'; // 默认值
};

/**
 * 判断功能是否在当前平台开启
 * @param config 配置项，可以是 '1' 或平台配置对象
 * @returns boolean 是否开启
 */
export const isFeatureEnabled = (
  config: '1' | { wx?: '1'; alipay?: '1'  ; tt?: '1' } | undefined
): boolean => {
  // 未配置则不开启
  if (!config) return false;

  // 简单配置方式：'1' 表示所有平台都开启
  if (config === '1') return true;

  // 对象配置方式：按平台判断
  const platform = getPlatform();
  // 检查对应平台是否开启
  if (platform === 'wx' && config.wx === '1') return true;
  if (platform === 'alipay' && config.alipay === '1') return true;
  if (platform === 'tt' && config.tt === '1') return true;

  return false;
};

export const getShareTotalUrl = (query, path) => {
  // const source = getBrowser().source;
  query = deQueryForUrl(deQueryForUrl(query));

  // const data = cloneUtil(query);
  const args: any = {};
  for (const key in query) {
    const v = query[key];
    args[key] = v;
  }
  const data = {
    ...args,
    // #ifdef MP-WEIXIN
    _scan: '1',
    // #endif
  };
  const bUrl =
    (globalGl.env as string) === 'prod'
      ? 'https://h5.eheren.com/note'
      : 'https://health.eheren.com/note';

  const outTime = 7;
  const _query = joinQueryForUrl('', data).slice(1);

  return new Promise((resolve, reject) => {
    const envWx = (globalGl.env as string) === 'prod' ? 'release' : 'trial'; // develop | release | trial
    uni.showLoading({
      title: '请求中..',
      mask: true,
    });
    // if (source == 19) {
    // }
    api
      .getScheme({
        days: outTime,
        envVersion: envWx,
        path,
        // query: 'mq' + encodeURIComponent(JSON.stringify(data)),
        query: _query,
      })
      .then(({ result, message }) => {
        uni.hideLoading();
        if (result) {
          resolve(bUrl + '?' + result.split('?')[1]);
          // resolve(result);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const setDefaultPatient = async (patientId: string) => {
  const userStore = useUserStore();

  const pat = userStore.patList.find((o) => o.patientId === patientId);
  if (pat) {
    userStore.updatePatChoose(pat);
  }
};

interface CacheData {
  result: any;
  timestamp: number;
  argsHash?: string;
}

/**
 * 在指定时间内确保方法只被调用一次并返回相同结果
 * @param {Function} fn - 需要调用的方法
 * @param {number} time - 时间限制（毫秒）
 * @returns {Function} 包装后的方法
 */
export const createSingleCallInTime = (
  fn: Function,
  time: number,
  cacheKey: string
) => {
  // 1. 读取缓存：从本地存储（uni.getStorageSync）读取指定key的缓存，解析为对象
  const getCache = (): CacheData | null => {
    try {
      const cached = uni.getStorageSync(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to read cache:', error);
      return null;
    }
  };

  // 2. 写入缓存：将数据序列化后存入本地存储（异步存储，避免阻塞）
  const setCache = (data: CacheData) => {
    try {
      uni.setStorage({ key: cacheKey, data: JSON.stringify(data) });
    } catch (error) {
      console.warn('Failed to save cache:', error);
    }
  };

  // 3. 清除缓存
  const clearCache = () => {
    try {
      uni.removeStorageSync(cacheKey);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  };

  // 4. 生成参数哈希：将函数入参序列化为字符串，用于判断“参数是否变化”
  const generateArgsHash = (args: any[]): string => {
    // 简单的参数哈希生成，可以根据需要改进
    try {
      return JSON.stringify(args);
    } catch {
      return '';
    }
  };

  return async function A(this: any, ...args: any[]) {
    const currentTime = Date.now();
    const cached = getCache();

    // 检查是否有有效缓存
    if (cached && currentTime - cached.timestamp < time) {
      // 如果提供了参数哈希，检查参数是否匹配
      if (
        cached.argsHash === undefined ||
        cached.argsHash === generateArgsHash(args)
      ) {
        return cached.result;
      }
    }

    // 调用原始函数
    const result = await fn.apply(this, args);

    // 保存到缓存
    setCache({
      result,
      timestamp: currentTime,
      argsHash: generateArgsHash(args),
    });

    return result;
  };
};

/**
 * 根据经纬度计算两点之间的距离（使用Haversine公式）
 * @param lat1 第一个点的纬度
 * @param lon1 第一个点的经度
 * @param lat2 第二个点的纬度
 * @param lon2 第二个点的经度
 * @returns 距离（米）
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // 地球半径，单位：米

  // 将角度转换为弧度
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
};
