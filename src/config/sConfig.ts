interface ISConfig {
  // 有药品配送功能?
  isDrugDelivery?: '1';
  //底部是否放开互联网医院?
  isOpenButtom?: Object; 
  //首页是否隐藏搜索框?
  isHideHomeSearch?: '1';
}

const scJson: {
  [key: string]: ISConfig;
} = {
  1001052: {
    isDrugDelivery: '1',
  },

  1001054: {
    // isDrugDelivery: '1',
    isOpenButtom:{
      appId:'wxdaadb2180235cdcc',
      path:'/pages/index/index'
    },
    isHideHomeSearch:'1'
  },
};

export const getSConfig = (sysCode: string) => {
  return <ISConfig>(scJson[sysCode] || {});
};
