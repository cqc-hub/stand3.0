interface ISConfig {
  // 有药品配送功能?
  isDrugDelivery?: '1';
  //底部是否放开互联网医院?
  isOpenButtom?: '1';
  //首页是否隐藏搜索框?
  isHideHomeSearch?: '1';

  // 医保? 如果是 his 结算模式直接维护后台配置即可
  medicalMHelp?: {
    alipay?: {
      // 医保插件模式
      medicalPlugin?: {
        // 机构id  各个院区都需要提供
        orgId: {
          [hosId: string]: string;
        };
        // 院内卡类型
        cardType: string;
      };
    };
  };

  //是否开启助老版
  isOpenHelpOld?: '1';
}

const scJson: {
  [key: string]: ISConfig;
} = {
  1001052: {
    isDrugDelivery: '1',
    medicalMHelp: {
      alipay: {
        medicalPlugin: {
          orgId: { 13001: 'H33038200118' },
          cardType: '01',
        },
      },
    },
  },

  1001054: {
    isOpenButtom: '1',
    isHideHomeSearch: '1',
  },

  1001033: {
    isDrugDelivery: '1',
    isOpenHelpOld: '1',
  },
};

const getSConfig = (sysCode: string) => {
  return <ISConfig>(scJson[sysCode] || {});
};

export { scJson, getSConfig };
