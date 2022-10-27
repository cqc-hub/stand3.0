import { GStores } from '@/utils';
import { useRouterStore } from '@/stores';
import globalGl from '@/config/global';
import { joinQuery } from '@/common';
import { rejects } from 'assert';

// //拦截-登录
export const checkLogin = (item: IRoute) => {
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
      gStores.messageStore.showMessage('未登录,请先登录', 1500);
    } else {
      uni.reLaunch({
        url: '/pages/home/my?isWarningLogin=1&_p=1',
      });
    }
    reject('未登录');
  });
};

//拦截-就诊人
export const checkPatient = (item: IRoute) => {
  const gStores = new GStores();
  return new Promise((resolve, reject) => {
    if (!gStores.globalStore.herenId) {
      gStores.messageStore.showMessage('未完善，请先完善', 1500, {
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
        gStores.messageStore.showMessage('暂无就诊人， 请先添加就诊人', 1500, {
          closeCallBack: () => {
            uni.reLaunch({
              url: globalGl.addPersonUrl + '?_p=1',
            });
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
// gridLabel?: string,//角标 0 默认无角标 1 绿色能量 2 立减五元 3 维护中
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

//grid的登录完善就诊人的拦截跳转方法
export const useCommonTo = (item, payload: IPayLoad = {}) => {
  console.log(item);
  //拦截判断
  if (item.path != '') {
    //判断授权消息提醒
    if (item.query && JSON.parse(item.query).templateId) {
      sendMeg(item, payload);
    } else {
      checkGrid(item).then(async () => {
        //判断携带位置信息
        if (item.query && JSON.parse(item.query).location) {
          await getAddress(item)
        }
        useToPath(item, payload);
      });
    }
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
      const obj = {
        url: '/pagesC/cloudHospital/myPath?type=1&path=' + item.path,
        fail: () => {
          gStores.messageStore.showMessage(
            `请确认跳转地址正确性${item.path}`,
            1500
          );
        },
      };
      typeNavigate(obj, type);
      break;
    case 'mini':
      uni.navigateToMiniProgram({
        appId: item.appId,
        path: item.url,
        extraData: item.query && JSON.parse(item.query),
      });
      break;
    case 'alipay':
      uni.navigateToMiniProgram({
        appId: item.appId,
        path: item.path,
        extraData: item.query && JSON.parse(item.query),
      });
      break;
    case 'my-h5':
      const obj1 = {
        url: '/pagesC/cloudHospital/myPath?path=' + item.path,
        fail: () => {
          gStores.messageStore.showMessage(
            `请确认跳转地址正确性${item.path}`,
            1500
          );
        },
      };
      typeNavigate(obj1, type);
      break;
    case 'netHospital':
      const obj2 = {
        url: '/pagesC/cloudHospital/cloudHospital?path=' + item.path,
        fail: () => {
          gStores.messageStore.showMessage(
            `请确认跳转地址正确性${item.path}`,
            1500
          );
        },
      };
      typeNavigate(obj2, type);
      break;
    default:
      //自研或者其他直接跳转的
      if (item.path == 'scanCode') {
        //扫一扫
        scanCode();
      } else {
        const obj3 = {
          url: item.path,
          fail: () => {
            gStores.messageStore.showMessage(
              `请确认跳转地址正确性${item.path}`,
              1500
            );
          },
        };
        typeNavigate(obj3, type);
      }

      break;
  }
};

//扫一扫功能
const scanCode = () => {
  uni.scanCode({
    success: function (res) {
      console.log('条码内容：' + res);
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
      gStores.messageStore.showMessage(res.errMsg, 1500);
    },
  });
};
//获取地理位置
const getAddress = (item) => {
  return new Promise((resolve) =>
    uni.getLocation({
      complete: resolve,
      success: function (res) {
        const obj = {
          latitude: res.latitude.toFixed(6),
          longitude: res.longitude.toFixed(6),
        };
        item.path += '&' + joinQuery('', obj).slice(1);
      },
    })
  );
};
