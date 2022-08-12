/// <reference path="@dcloudio/types/uni-app/uni.d.ts" />


declare var wx: any;
declare var my: any;

interface IOptions {
  label: string;
  value: any;
  [key: string]: any;
}
interface BaseObject {
  [key: string]: any;
}

interface IRouteBase {
  id?: number;
  showNo?: number;//后端的排序
  title: string;//主标题
  detail?: string;//副标题
  iconfont?: string;//图标
  terminalType?: string;//终端类型 h5:三方h5 mini:三方微信小程序 alipay:三方支付宝小程序 my:自研
  appId?: string;//appid
  path?: string;//路径
  // query?: BaseObject;//参数
  query?: string;//参数
  isRotation?: string,  //是否是轮播图 0 1
  loginInterception?: string,  //是否登录拦截 1拦截 0 不拦截
  patientInterception?: string,//就诊人拦截  1拦截 0 不拦截
  selectPatientPage?: string,//跳转第三方是否需要就诊人选择页面
  gridLabel?: string,//角标 0 默认无角标 1 绿色能量 2 立减五元 3 维护中
}


// interface IRouterLocal extends IRouteBase {
//   isNet?: false,
//   url: `/${string}`;
// }

// interface IRouterNet extends IRouteBase {
//   isNet: true,
//   url: `http${string}`;
// }

// type IRoute = IRouterNet | IRouterLocal
type IRoute = IRouteBase



// declare namespace UniNamespace {
// 	interface NavigateToOptions {
// 		passedParams?: {
// 			[key: string]: any;
// 		};
// 	}
// }
