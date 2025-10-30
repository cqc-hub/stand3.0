import { GStores } from '@/utils';

export const getShowTitle = (item: IRoute, type) => {
  const gStores = new GStores();
  const { engDetail, otherDetail, title } = item;
  const { lang } = gStores.globalStore;

  if ([2, 3].includes(type)) {
    if (lang === 'en' && engDetail) {
      return engDetail;
    } else if (lang === 'uygur' && otherDetail) {
      return otherDetail;
    }
  }

  return `${title}`;
};

export const getSubtitle = (item: IRoute) => {
  const gStores = new GStores();
  const { lang } = gStores.globalStore;
  const { detail, otherDetail, title } = item;

  if (lang === 'uygur' && otherDetail) {
    return otherDetail;
  }

  return detail || '';
};
