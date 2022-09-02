import { useRouterStore } from '@/stores';

export const wait = (wait: number) => new Promise((r) => setTimeout(r, wait));

export const routerJump = (url?: `/${string}`) => {
  const routerStore = useRouterStore();

  if (routerStore.isWork) {
    if (!routerStore.backRoute._p) {
      uni.redirectTo({
        url: routerStore.fullUrl
      });
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
