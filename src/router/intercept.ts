import { IPageRoute, IExtend } from './type'
import { getToken } from "@/common";

export function pagesInterceptEveryone(route: IPageRoute, to: any) {
  if (["/pages/home/home", "/pages/home/my", "/"].includes(to.path)) {
    uni.switchTab({
      url: to.path == '/' ? '/pages/home/home' : to.path
    })

  }
  // return {
  //   to: {//需要跳转的新页面
  //     path: '/pages/home/my',
  //     query: {
  //       // url: to.fullPath
  //     }
  //   },
  //   navType: 'push'//跳转方式

  // }
}



