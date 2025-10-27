import { GStores } from '@/utils';

export const langMap = {
  zh: {
    'home-tabbar': {},
  },
  uygur: {
    'home-tabbar': {
      '就诊码/医保码': 'دوختۇرخانا كودى/ ساغلاملىق كودى',
      首页: 'باش بەت',
      互联网医院: 'تور دوختۇرخانىسى',
      我的: 'مەن',
      云诊室: 'بۇلۇت دوختۇرخانا',
      健康商城: 'ساغلاملىق بازىرى',
      健康管理: 'ساغلاملىق باشقۇرۇش',
      口腔商城: 'ئېغىز بازىرى',
      服务: 'خىزمەت',
      消息中心: 'ئۇچۇر مەركىزى',
    },
  },
};

/**
 *
 * @param key home-tabbar:key
 */
export const getLangLabel = (key: string) => {
  const gStores = new GStores();
  const { lang } = gStores.globalStore;
  const langMapItem = langMap[lang] || langMap.zh;
  const [iblock, ilKey] = key.split(':');

  const lmap = langMapItem[iblock];

  if (!lmap) {
    return key;
  }

  return lmap[ilKey] || ilKey;
};
