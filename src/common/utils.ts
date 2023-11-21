//公用方法
/**
 * 加载动画
 * @param tips 提示语句
 * @returns 关闭loading
 */
export const showLoading = (tips: string = '加载中...') => {
  uni.showLoading({
    title: tips,
    // #ifndef MP-ALIPAY
    mask: true,
    // #endif
  });
  uni.showNavigationBarLoading();
};
export const hideLoading = () => {
  uni.hideLoading();
  uni.hideNavigationBarLoading();
};

export function cloneUtil<T>(target): T {
  // [object Array]  [object Object]  [object Function]
  const type = Object.prototype.toString.call(target);
  let res;
  if (type.includes('Array')) {
    res = [];
  } else if (type.includes('Object')) {
    res = {};
  } else {
    res = target;
  }

  for (let i in target) {
    if (typeof target[i] === 'object') {
      res[i] = cloneUtil(target[i]);
    } else {
      res[i] = target[i];
    }
  }

  return res;
}
/**
 *
 * @param url 拼接之前的数据
 * @param query 对象
 * @returns 对象数据拼接在参数上
 */
export const joinQuery = function (url: string, query = {}) {
  const strQuery = Object.entries(query)
    .map(([key, value]) => `${key}=${value ?? ''}`)
    .join('&');

  if (url.includes('?')) {
    return url + '&' + strQuery;
  } else {
    return url + '?' + strQuery;
  }
};

export const joinQueryForUrl = (url: string, pageArg) => {
  const p = Object.entries(pageArg)
    .filter(([key, value]) => value || value === 0)
    .map(([key, value]) => {
      return [key, encodeURIComponent(value! + '')];
    });

  const unpackArg = Object.fromEntries(p);

  return joinQuery(url, unpackArg);
};

export const deQueryForUrl = <T = BaseObject>(props): T => {
  if (props) {
    try {
      const dePropList =
        (props && Object.entries(props)).map(([key, value]) => [
          key,
          (value && decodeURIComponent(value)) || value,
        ]) || [];

      return <T>Object.fromEntries(dePropList);
    } catch (error) {
      console.error('deQueryForUrl 序列化数据 失败', error);

      return props;
    }
  } else {
    return <T>{};
  }
};

/**
 *
 * @param func 支付宝、微信获取地址
 * @param wait
 * @returns
 */
export const getChooseAddress = function (): Promise<UniApp.ChooseAddressRes> {
  return new Promise((resolve, reject) => {
    uni.chooseAddress({
      success(res) {
        // #ifdef MP-ALIPAY
        if ((res as any).resultStatus == '9000') {
          // 针对支付宝单独处理
          res.countyName = (res as any).result.area;
          res.detailInfo = res.detailInfo.split('-').pop() as string;
          resolve(res);
        } else {
          reject('未选择地址');
        }
        // #endif
        // #ifdef MP-WEIXIN
        resolve(res);
        // #endif
      },
      fail(err) {
        console.error(err);
        reject(err);
      },
    });
  });
};

//授权选取地址
export const getScopeAddress = (): Promise<UniApp.ChooseAddressRes> => {
  //获取用户的当前设置
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success: async (res) => {
        if (res.authSetting['scope.address']) {
          const data = await getChooseAddress();
          resolve(data);
        } else {
          //未授权 取消地址授权 需要打开设置
          if (res.authSetting['scope.address'] == false) {
            wx.openSetting({
              fail: (err) => {
                reject(err);
              },
            });
          } else {
            //第一次打开
            const data = await getChooseAddress();
            resolve(data);
          }
        }
      },
    });
  });
};

/**
 * 节流函数
 */
export const throttle = function (func: Function, wait: number) {
  let context, args;
  let previous = 0;

  return function () {
    const now = +new Date();
    // @ts-ignore
    context = this;
    args = arguments;

    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
};

export const getQueryUrl = function (url: string): BaseObject {
  const aUrl = [...url];
  const aArg = aUrl
    .slice(aUrl.findIndex((o) => o === '?') + 1)
    .join('')
    .split('&')
    .map((o) => {
      const [key, value] = o.split('=');
      return [key, value];
    });

  return Object.fromEntries(aArg);
};

/**
 * target.a.b.c = opt.value
 * @param opt
 * @param target
 * @returns target
 */
export const insertObject = <
  T extends { key: string; value: any },
  K extends BaseObject
>(
  opt: T,
  target: K
): K => {
  const { key, value } = opt;
  const keySlice = key.split('.');
  const len = keySlice.length;
  let valueCache: any = {};

  while (keySlice.length) {
    const lenNow = keySlice.length;
    const keyItem = keySlice.shift();
    if (!keyItem) {
      break;
    }

    if (lenNow === len) {
      if (target[keyItem]) {
        valueCache = target[keyItem];
      } else {
        if (len === 1) {
          // @ts-expect-error
          valueCache = target[keyItem] = value;
        } else {
          // @ts-expect-error
          valueCache = target[keyItem] = {};
        }
      }
    } else {
      // end loop
      if (lenNow === 1) {
        valueCache[keyItem] = value;
      } else {
        if (!valueCache[keyItem]) {
          valueCache[keyItem] = {};
          valueCache = valueCache[keyItem];
        } else {
          valueCache = valueCache[keyItem];
        }
      }
    }
  }

  return target;
};

export const insertsObject = function <
  T extends BaseObject,
  K extends BaseObject
>(source: T, target: K): K {
  for (const key in source) {
    insertObject(
      {
        key,
        value: source[key],
      },
      target
    );
  }
  return target;
};

//获取URL 携带的对应参数
export const getQueryString = (url: string, key: string): string => {
  const after = url.split('?')[1];
  if (after) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    var r = after.match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    } else {
      return '';
    }
  } else {
    return '';
  }
};
