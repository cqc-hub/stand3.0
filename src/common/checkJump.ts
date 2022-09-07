import { GStores } from '@/utils';
import { useRouterStore } from '@/stores';

const routerStore = useRouterStore();

// //拦截-登录
export const checkLogin = (item: IRoute) => {
	const gStores = new GStores();
	const routerStore = useRouterStore();
	return new Promise((resolve, reject) => {
		uni.reLaunch({
			url: '/pages/home/my?isWarningLogin=1&_p=1'
		});
		reject('未登录');
	});
};

//拦截-就诊人
export const checkPatient = (item: IRoute) => {
	const gStores = new GStores();
	return new Promise((resolve, reject) => {
		if (!gStores.globalStore.herenId) {
			gStores.messageStore.showMessage('未完善，请先完善', 1000, {
				closeCallBack: () => {
					uni.reLaunch({
						url: '/pagesA/medicalCardMan/perfectReal?pageType=perfectReal&_p=1'
					});
				}
			});
			reject('未完善，请先完善');
		} else {
			const patList = gStores.userStore.patList;
			if (!patList.length) {
				gStores.messageStore.showMessage(
					'暂无就诊人， 请先添加就诊人',
					1000,
					{
						closeCallBack: () => {
							uni.reLaunch({
								url: '/pagesA/medicalCardMan/perfectReal&_p=1'
							});
						}
					}
				);
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
export const checkGrid = async (item: IRoute) => {
	const gStores = new GStores();
	if (item.gridLabel === '3') {
		return;
	} else {
		routerStore.updateId(item.id);
	}
	if (item.loginInterception === '1' && !gStores.globalStore.isLogin) {
		await checkLogin(item);
		return;
	}
	if (item.patientInterception === '1') {
		await checkPatient(item);
	}
	// if (item.selectPatientPage === '1') {
	//   //跳转my-h5选择就诊人页面
	// }
};

//grid的登录完善就诊人的拦截跳转方法
export const useCommonTo = (item) => {
	//拦截判断
	checkGrid(item).then(() => {
		useToPath(item);
	});
};

// 登录 完善 添加就诊人页面 带回调的跳转方法
export const toRouterPath = () => {
	// if (routerStore.itemUrl) {
	//   useCommonTo(routerStore.itemUrl)
	//   //清除回调url
	//   routerStore.updateItemUrl('')
	// } else {
	//   //没有回调 跳home
	//   uni.reLaunch({
	//     url: '/pages/home/home'
	//   });
	// }
};
//不拦截 直接跳转的方法
export const useToPath = (item) => {
	switch (item.terminalType) {
		case 'h5':
			uni.navigateTo({
				url:
					'/pagesC/cloudHospital/myPath?type=1&path=' +
					item.path +
					'&p=' +
					item.id
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
				url:
					'/pagesC/cloudHospital/myPath?path=' +
					item.path +
					'&p=' +
					item.id
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
};
