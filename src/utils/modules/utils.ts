import { useRouterStore, useMessageStore } from '@/stores';
import { ServerStaticData } from './serverStaticData';
import { useCommonTo } from '@/common/checkJump';

export const wait = (wait: number) => new Promise((r) => setTimeout(r, wait));

const getMenuById = (_id: string, _list: any[]) => {
  const deepSearch = (id: string, list: any[], source) => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.id == id) {
        source.value = item;
        break;
      } else {
        const { functionList, leftFunctionList, typeList } = item;

        const children: any[] = [];

        if (functionList) {
          children.push(...functionList);
        }

        if (leftFunctionList) {
          children.push(...leftFunctionList);
        }

        if (typeList) {
          children.push(...typeList);
        }

        if (children.length) {
          deepSearch(id, children, source);
        }
      }
    }
  };

  const result: { value?: {} } = {};

  deepSearch(_id, _list, result);
  return result.value;
};

export const routerJump = async (url?: `/${string}`) => {
  const routerStore = useRouterStore();
  const messageStore = useMessageStore();

  if (routerStore.isWork) {
    console.log('routerStore.isWork-------');

    const _p = routerStore._p;
    if (!_p) {
      uni.redirectTo({
        url: routerStore.fullUrl
      });
    } else {
      const menus = await ServerStaticData.getHomeConfig();

      const menuItem = getMenuById(routerStore._id, menus);
      console.log(menuItem, 'menuItem', routerStore._id, routerStore);

      if (menuItem) {
        useCommonTo(menuItem);
      } else {
        messageStore.showMessage('未找到对应menuId 的 menu：' + routerStore._id);
      }
    }

    routerStore.clear();
  } else {
    if (url) {
      uni.redirectTo({
        url
      });
    }
  }
};
