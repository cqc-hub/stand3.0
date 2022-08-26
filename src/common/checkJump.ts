import { GStores } from '@/utils';
const gStores = new GStores();

// //拦截-登录
export const checkLogin = () => {
  if (!gStores.globalStore.isLogin) {
    gStores.messageStore.showMessage('未登录，请先登录', 1000);
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/home/my'
      })
    }, 1200);
  }
}

//拦截-就诊人
export const checkPatient = () => {
  if (!gStores.globalStore.herenId) {
    gStores.messageStore.showMessage('未完善，请先完善', 1000);
    setTimeout(() => {
      uni.reLaunch({
        url: '/pagesA/medicalCardMan/perfectReal?pageType=perfectReal'
      });
    }, 1200);
  } else {
    const patList = gStores.userStore.patList;
    if (!patList.length) {
      gStores.messageStore.showMessage('暂无就诊人， 请先添加就诊人');
      return;
    }
  }
}

// grid配置化拦截判断
// loginInterception?: string,  //是否登录拦截 1拦截 0 不拦截
//   patientInterception?: string,//就诊人拦截  1拦截 0 不拦截
//   selectPatientPage?: string,//跳转第三方是否需要就诊人选择页面

export const checkGrid = (item: IRoute) => {
  if (item.loginInterception) {
    checkLogin()
  }
  if (item.patientInterception) {
    checkPatient()
  }
  if (item.selectPatientPage) {
    //跳转my-h5选择就诊人页面

  }
}

//公用的跳转方法 
export const useCommonTo = (item) => {
  console.log('跳转入参', item);
  //拦截判断 
  checkGrid(item)
  switch (item.terminalType) {
    case 'h5':
      uni.navigateTo({
        url: '/pagesC/cloudHospital/myPath?type=1&path=' + item.path
      });
      break;
    case 'mini':
      uni.navigateToMiniProgram({
        appId: item.appId,
        path: item.url,
        extraData: JSON.parse(item.query)
      });
      break;
    case 'alipay':
      uni.navigateToMiniProgram({
        appId: item.appId,
        path: item.path,
        extraData: JSON.parse(item.query)
      });
      break;
    case 'my-h5':
      uni.navigateTo({
        url: '/pagesC/cloudHospital/myPath?path=' + item.path
      });
      break;
    case 'netHospital':
      uni.navigateTo({
        url: '/pagesC/cloudHospital/cloudHospital?path=' + item.path
      });
      break;
    default:
      //自研或者其他直接跳转的
      uni.navigateTo({
        url: item.path
      });
      break;
  }
}
