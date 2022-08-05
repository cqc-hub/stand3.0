// import uniCrazyRouter, {
//   beforeEach,
//   afterEach,
//   onError,
//   afterNotNext
// } from '@/js_sdk/crazy-router';

// import { bindInterceptLogin, destroyInterceptLogin } from './interceptLogin';

// // 开放给main.js
// export function setupRouter(app) {
//   // 接收vue3的实例
//   app.use(uniCrazyRouter);

//   // 启用登录页的拦截
//   bindInterceptLogin();

//   beforeEach(async (to, from, next) => {
//     if (to.url === 'pages/index/index') {
//       afterNotNext(() => {
//         uni.navigateTo({
//           url: '/pages/routerTest/routerTest',
//           passedParams: {
//             info: '因为page2不存在，拦截跳转到此'
//           }
//         });
//       });
//       return;
//     }

//     // 逻辑代码
//     if (to.url === 'pages/index/page2') {
//       afterNotNext(() => {
//         uni.navigateTo({
//           url: '/pages/index/page1',
//           passedParams: {
//             info: '因为page2不存在，拦截跳转到此'
//           }
//         });
//       });
//       return;
//     }

//     next();
//   });

//   afterEach((to, from) => {
//     // 逻辑代码
//     // console.log('after', {
//     // 	to,
//     // 	from
//     // 	});
//   });

//   // 除了在beforeEach钩子里没有使用next导致的无法跳转的情况外，其他情况导致的跳转失败都会触发onError
//   onError((to, from) => {
//     uni.showToast({
//       title: `${to.url} 不存在1111`,
//       icon: 'none'
//     });
//   });
// }

import { createRouter, BeforeEachResult } from '@gowiny/uni-router'
import PAGE_DATA from '@/pages.json';
import global from '@/config/global'
import GS from '@/common/globalState'
import { IPageRoute, IExtend } from './type'
import { pagesInterceptEveryone } from './intercept'

const mapRouterPages = new Map()
const routerPages = PAGE_DATA.pages;
const newPages = routerPages.map(o => {
  mapRouterPages.set('/' + o.path, o)
})
//获取路由extend额外参数的方法
const mapCurrentRoute = (path: String | undefined) => {
  return mapRouterPages.get(path).extends
}

//初始化
const router = createRouter({
  pageData: PAGE_DATA
})

//全局路由前置守卫
router.beforeEach(async (to, from) => {

  console.log('beforeEach----守卫', to, from)
  //判断是否是该项目对应的sysCode，否则清除缓存
  // if (!uni.getStorageSync('sysCode') || (uni.getStorageSync('sysCode') != global.SYS_CODE)) {
  //   GS.clearData();
  // }
  // //设置全局状态
  // GS.setState()

  const pageIntercept = mapCurrentRoute(to.path)
  //统一拦截方法

  pagesInterceptEveryone(pageIntercept)

})

router.afterEach(async (to, from) => {
  // console.log('afterEach 2 ,', to, from)
  // return new Promise<BeforeEachResult>((success, fail) => {
  //   setTimeout(function () {
  //     console.log('afterEach 已等待3秒，开始下一步')
  //     success(true)
  //   }, 100)
  // })

})

export default router
