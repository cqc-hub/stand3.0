import { IPageRoute, IExtend } from './type'
import { getToken } from "@/common";

export function pagesInterceptEveryone(route: IPageRoute) {
  console.log('route', route);


  //   return {
  //     to: {//需要跳转的新页面
  //       path: '/pages/home/my',
  //       query: {
  //         url: to.fullPath
  //       }
  //     },
  //     navType: 'push'//跳转方式

  //   }
}



