interface ISConfig {
  // 有药品配送功能?
  isDrugDelivery?: '1';
  //底部是否放开互联网医院?
  isOpenButtom?: '1';
  //首页是否隐藏搜索框?
  isHideHomeSearch?: '1';
  //是否开启助老版
  isOpenHelpOld?:'1'
}

const scJson: {
  [key: string]: ISConfig;
} = {
  1001052: {
    isDrugDelivery: '1',
  },

  1001054: {
    isOpenButtom: '1',
    isHideHomeSearch: '1',
  },

  1001033: {
    isDrugDelivery: '1',
    isOpenHelpOld:'1'
  },
};

const getSConfig = (sysCode: string) => {
  return <ISConfig>(scJson[sysCode] || {});
};

export { scJson, getSConfig };
