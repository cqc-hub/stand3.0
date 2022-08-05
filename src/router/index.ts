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

const router = createRouter({
  pageData: PAGE_DATA
})

router.beforeEach(async (to, from) => {
  console.log('PAGE_DATA', PAGE_DATA);

  console.log('beforeEach 2 ,', to, from)

  // if (!state.user.logined && to.path?.startsWith("/pages/user/")) {
  //   console.log('您还未登录，请先登录')
  //   return {
  //     to: {//需要跳转的新页面
  //       path: '/pages/login/login',
  //       query: {
  //         url: to.fullPath
  //       }
  //     },
  //     navType: 'push'//跳转方式

  //   }
  // }

})


// router.afterEach((to, from) => {
//   console.log('afterEach 1 ,', to, from)
// })

router.afterEach(async (to, from) => {
  console.log('afterEach 2 ,', to, from)
  // return new Promise<BeforeEachResult>((success, fail) => {
  //   setTimeout(function () {
  //     console.log('afterEach 已等待3秒，开始下一步')
  //     success(true)
  //   }, 100)
  // })

})

export default router
