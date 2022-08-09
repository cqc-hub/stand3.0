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
  console.log(88, pageIntercept);

  pagesInterceptEveryone(pageIntercept, to)

})

// router.beforeEach((to, from) => {
//   console.log('beforeEach 2 begin', to, from)
//   if (to.path != '/pages/login/login') { //如果返回的是Promise，则会等待执行完成才进行下一步
//     return new Promise((success, fail) => {
//       setTimeout(function () {
//         console.log('beforeEach 2 end')
//         success({ path: '/pages/login/login' })
//       }, 1000)
//     })
//   }
// })

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
