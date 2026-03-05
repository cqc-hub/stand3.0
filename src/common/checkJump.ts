import { assignType } from '@/typeUtils';
import {
  GStores,
  useTBanner,
  TBannerConfig,
  packageAuthParams,
  LoginUtils,
  getLocation,
  TBannerHomeMenuConfig,
  getMiniProgramEnv,
} from '@/utils';
import { useRouterStore } from '@/stores';
import { joinQuery } from '@/common';
import globalGl from '@/config/global';
import api from '@/service/api';
// #ifdef H5
import wxH5 from 'weixin-js-sdk';
// #endif

//拦截-登录
export const checkLogin = (item?: IRoute) => {
  const gStores = new GStores();
  const routerStore = useRouterStore();
  //获取当前的来源地址
  const pages = getCurrentPages();
  const fullPathNow = (pages[pages.length - 1] as any).$page.fullPath as string;
  return new Promise((resolve, reject) => {
    if (
      fullPathNow === '/pages/home/my' ||
      fullPathNow === '/pages/home/home'
    ) {
      routerStore.receiveQuery({
        _p: '1',
      });
      gStores.messageStore.showMessage('未登录,请先登录', 3000);
    } else {
      uni.reLaunch({
        url: '/pages/home/my?isWarningLogin=1&_p=1',
      });
    }
    reject('未登录');
  });
};

//拦截-就诊人
export const checkPatient = (item?: IRoute) => {
  const gStores = new GStores();
  return new Promise((resolve, reject) => {
    if (!gStores.globalStore.herenId) {
      gStores.messageStore.showMessage('未完善，请先完善', 3000, {
        closeCallBack: () => {
          uni.reLaunch({
            url: globalGl.addPersonUrl + '?pageType=perfectReal&_p=1',
          });
        },
      });
      reject('未完善，请先完善');
    } else {
      const patList = gStores.userStore.patList;
      if (!patList.length) {
        gStores.messageStore.showMessage('暂无就诊人， 请先添加就诊人', 3000, {
          closeCallBack: () => {
            if (
              globalGl.systemInfo?.isOpenHealthCard &&
              globalGl.systemInfo.isOpenHealthCard?.isNewMode
            ) {
              uni.reLaunch({
                url: '/pagesA/medicalCardMan/medicalCardMan' + '?_p=1',
              });
            } else {
              uni.reLaunch({
                url: globalGl.addPersonUrl + '?_p=1',
              });
            }
          },
        });
        reject('暂无就诊人， 请先添加就诊人');
      }
      resolve('成功');
    }
  });
};

// grid配置化拦截判断
// loginInterception?: string,  //是否登录拦截 1拦截 0 不拦截
//   patientInterception?: string,//就诊人拦截  1拦截 0 不拦截
//   selectPatientPage?: string,//跳转第三方是否需要就诊人选择页面
// gridLabel?: string,//角标 0 默认无角标 1 绿色能量 2 医保 3 维护中
export const checkGrid = (item: IRoute) => {
  return new Promise(async (resolve, reject) => {
    const routerStore = useRouterStore();
    const gStores = new GStores();
    if (item.gridLabel == '3') {
      reject('维护中');
    } else {
      routerStore.updateId(item.id);
      if (item.loginInterception === '1' && !gStores.globalStore.isLogin) {
        await checkLogin(item);
      }
      if (item.patientInterception === '1') {
        await checkPatient(item);
      }
      resolve('成功');
    }
  });

  // if (item.selectPatientPage === '1') {
  //   //跳转my-h5选择就诊人页面
  // }
};
// 判断登录是否过期
export const checkLoginExpired = async (): Promise<boolean> => {
  try {
    const { source } = new GStores().globalStore.browser;
    const result = await api.allinoneAuthApi(
      packageAuthParams({ source }, '/modifyUserInfo/userInfoByToken', {})
    );
    if (result && result.code == '0') {
      return false; // 没有过期
    } else {
      return true;
    }
  } catch (error) {
    console.error('检查登录状态失败:', error);
    return true; // 网络错误也视为过期
  }
};
const interceptorRoute = async function (item: any) {
  const gStores = new GStores();
  let query = item.query;

  if (query) {
    try {
      query = JSON.parse(query);
    } catch (e) {
      // console.log(e);
    }

    if (query?._type === 'useTBanner') {
      if (query?.isExpired) {
        // 新增第三方过期拦截判断
        const isExpired = await checkLoginExpired();
        if (isExpired) {
          // 登录过期，引导重新登录
          uni.reLaunch({
            url: '/pages/home/my?setOutLogin=1',
          });
          throw new Error('登录已过期，请重新登录');
        }
      }
      assignType<TBannerHomeMenuConfig>(query);
      const { _disabled, _tip } = query;

      if (_tip) {
        await new Promise((closeCallBack) =>
          gStores.messageStore.showMessage(_tip, 0, {
            closeCallBack,
            useDialog: true,
            dialogOpt: {
              isShowCancel: false,
            },
          })
        );
      }

      if (_disabled === '1') {
        throw new Error('禁用 useTBanner函数跳转');
      }
      useTBanner(query, 'navigateTo', gStores.globalStore.h5MenuExtraData);
      throw new Error('使用 useTBanner函数跳转');
    }
  }
};

//grid的登录完善就诊人的拦截跳转方法
export const useCommonTo = async (item, payload: IPayLoad = {}) => {
  await interceptorRoute(item);

  //拦截判断
  if (item.path != '') {
    //判断授权消息提醒
    if (item.query && JSON.parse(item.query).templateId) {
      //用药提醒
      sendMeg(item, payload);
    }
    //  else if (item.query && JSON.parse(item.query).questionId) {
    //   //跳转问卷页面-h5
    //  uni.navigateTo( {
    //   url: '/pagesC/cloudHospital/myPath?path=/pagesC/question/normalQuestion' + item.path,
    // })
    // }
    else {
      checkGrid(item).then(async () => {
        //判断携带位置信息
        if (item.query && JSON.parse(item.query).location) {
          await getAddress(item);
        }
        useToPath(item, payload);
      });
    }
  } else {
    checkGrid(item).then(async () => {
      useToPath(item, payload);
    });
  }
};

export const isSubscribeWx = async () => {
  const gStores = new GStores();
  if (!gStores.globalStore.h5OpenId && globalGl.h5AppId) {
    if ((await getMiniProgramEnv()) === 'develop' && globalGl.env !== 'prod') {
      return;
    }
    uni.reLaunch({
      url: '/pages/home/startCome',
    });
  } else {
    const { source } = gStores.globalStore.browser;

    uni.showLoading({
      title: '加载中',
      mask: true,
    });
    const res = await api
      .judgeSubscribeWxAccount({
        source,
        openId: gStores.globalStore.h5OpenId,
      })
      .catch(() => {});
    uni.hideLoading();
    if (res?.result?.subscribe === 0) {
      //没关注过
      return false;
    }
    return true;
  }
};

// 回调 h5跳转的方法
export const typeNavigate = (obj, type) => {
  if (type == 'reLaunch') {
    uni.reLaunch(obj);
  } else if (type == 'redirectTo') {
    uni.redirectTo(obj);
  } else {
    uni.navigateTo(obj);
  }
};
interface IPayLoad {
  type?: 'reLaunch' | 'redirectTo' | '';
}

//不拦截 直接跳转的方法
export const useToPath = async (item, payload: IPayLoad = {}) => {
  const gStores = new GStores();
  const type = payload.type;
  switch (item.terminalType) {
    case 'h5':
      // #ifndef H5
      let query = '';
      item.query & ((query = `&query=${item.query}`) as any);
      const obj = {
        url:
          '/pagesC/cloudHospital/myPath?type=1' +
          query +
          '&path=' +
          encodeURIComponent(item.path),
        fail: () => {
          gStores.messageStore.showMessage(
            `请确认跳转地址正确性${item.path}`,
            3000
          );
        },
      };
      typeNavigate(obj, type);
      // #endif

      // #ifdef H5
      location.href = item.path;
      // #endif

      break;
    case 'mini':
      uni.navigateToMiniProgram({
        appId: item.appId,
        path: item.path,
        extraData: item.query && JSON.parse(item.query),
      });
      break;
    case 'alipay':
      //支付宝有几种跳转方法 routeType openURL 官网地址 https://opendocs.alipay.com/mini/04iy2y?pathHash=e5ca38e0
      if (item.query && JSON.parse(item.query).routeType) {
        my.ap[JSON.parse(item.query).routeType]({
          url: item.path,
          success: (res) => {
            console.log('openURL success', res);
          },
          fail: (err) => {
            console.log('openURL success', err);
          },
        });
      } else {
        const arg = {
          appId: item.appId,
          path: item.path,
          extraData: (item.query && JSON.parse(item.query)) || undefined,
        };

        //跳转小程序
        uni.navigateToMiniProgram(arg);
      }

      break;
    case 'my-h5':
      const obj1 = {
        url: '/pagesC/cloudHospital/myPath?path=' + item.path,
        fail: () => {
          gStores.messageStore.showMessage(
            `请确认跳转地址正确性${item.path}`,
            3000
          );
        },
      };
      typeNavigate(obj1, type);
      break;
    case 'netHospital':
      let obj2 = {};
      if (item.query && JSON.parse(item.query)._type == '1') {
        //网络医院外部携带路径和参数
        obj2 = {
          url: item.path,
          fail: () => {
            gStores.messageStore.showMessage(
              `请确认跳转地址正确性${item.path}`,
              3000
            );
          },
        };
      } else {
        obj2 = {
          url: joinQuery(
            '/pagesC/cloudHospital/cloudHospital',
            item.query && JSON.parse(item.query)
          ),
          fail: () => {
            gStores.messageStore.showMessage(
              `请确认跳转地址正确性${item.path}`,
              3000
            );
          },
        };
      }
      typeNavigate(obj2, type);
      break;
    default:
      //自研或者其他直接跳转的
      // #ifndef H5
      if (item.path == 'scanCode') {
        //扫一扫
        scanCode();
      } else if (item.path == 'makePhone') {
        //拨打电话
        makePhone(item.query);
      } else {
        const obj3 = {
          url: item.path,
          fail: (e) => {
            console.log('跳转失败', e);
            gStores.messageStore.showMessage(
              `请确认跳转地址正确性${item.path}`,
              3000
            );
          },
        };
        typeNavigate(obj3, type);
      }
      // #endif

      // 为了智能助医h5使用
      // #ifdef H5
      try {
        wxH5.miniProgram.navigateTo({
          url: item.path,
        });
        my.navigateTo({
          url: item.path,
        });
      } catch (error) {
        uni.navigateTo({
          url: item.path,
        });
      }
      // #endif

      break;
  }
};

const makePhone = (query) => {
  uni.makePhoneCall({
    phoneNumber: JSON.parse(query).phone,
    fail(res) {
      console.warn('拨打电话失败原因', res);
    },
  });
};

//扫一扫功能
const scanCode = () => {
  const gStores = new GStores();
  return new Promise((resolve) => {
    uni.scanCode({
      success(res) {
        console.warn('扫码内容', res);
        if (res.result.indexOf('https://') != -1) {
          uni.navigateTo({
            url: '/pagesC/cloudHospital/myPath?type=1&path=' + res.result,
          });
        } else {
          gStores.messageStore.showMessage(`扫码内容:${res.result}`);
        }
        resolve(res.result);
      },
      fail() {
        console.warn('获取失败');
        gStores.messageStore.showMessage('获取失败', 3000);
      },
    });
  });
};

//打开企微
export const openServicesChat = (query) => {
  wx.openCustomerServiceChat({
    extInfo: { url: JSON.parse(query).extInfo },
    corpId: JSON.parse(query).corpId,
    complete(res) {
      console.log('打开企业微信', res);
    },
  });
};

//授权小程序消息推送模板
const sendMeg = (item, payload) => {
  const gStores = new GStores();
  uni.requestSubscribeMessage({
    tmplIds: JSON.parse(item.query).templateId,
    success(res) {
      //成功之后处理业务
      checkGrid(item).then(() => {
        useToPath(item, payload);
      });
    },
    fail(res) {
      gStores.messageStore.showMessage(res.errMsg, 3000);
    },
  });
};
//获取地理位置
const getAddress = async (item) => {
  const { longitude, latitude } = await getLocation(true);

  item.path +=
    '&' +
    joinQuery('', {
      longitude,
      latitude,
    }).slice(1);

  // return new Promise((resolve) =>
  //   uni.getLocation({
  //     complete: resolve,
  //     success: function (res) {
  //       const obj = {
  //         latitude: res.latitude.toFixed(6),
  //         longitude: res.longitude.toFixed(6),
  //       };
  //       item.path += '&' + joinQuery('', obj).slice(1);
  //     },
  //   })
  // );
};
