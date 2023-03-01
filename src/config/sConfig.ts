interface ISConfig {
  // 有药品配送功能?
  isDrugDelivery?: '1';
  //底部是否放开互联网医院?
  isOpenButtom?: '1';
  //首页是否隐藏搜索框?
  isHideHomeSearch?: '1';

  // 医保(各个平台之间最多存在一种医保模式)? 如果是 his 结算模式直接维护后台配置即可
  medicalMHelp?: {
    alipay?: {
      // 医保插件模式  https://adccloud.yuque.com/adccloud/abilitywarehouse/kc7ro5?#AbvRt
      medicalPlugin?: {
        // 机构id  各个院区都需要提供
        orgId: {
          [hosId: string]: string;
        };
        // 院内卡类型
        cardType: string;
      };

      medicalDefault?: '1';
    };

    wx?: {
      // 医保插件模式 (微信医保插件仅 弹窗二维码支付宝医保小程序)
      medicalPlugin?: '1';
      // 医保国标模式
      medicalNation?: {
        cityCode: string;
        channel: string; // 渠道号
      };

      // 默认是医保? (个别项目后端不能返回 医保标签, 前端数据手动加上但是页面不显示医保标签)
      medicalDefault?: '1';
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

  1001056: {
    medicalMHelp: {
      wx: {
        medicalNation: {
          cityCode: '650100',
          channel: 'AAHXJbrzmhk_q05MEUW1ioQn',
        },
        medicalDefault: '1',
      },
    },
  },

  1001033: {
    isDrugDelivery: '1',
    isOpenHelpOld: '1',
    medicalMHelp: {
      wx: {
        medicalPlugin: '1',
      },
    },
  },
};

const getSConfig = (sysCode: string) => {
  return <ISConfig>(scJson[sysCode] || {});
};

export { scJson, getSConfig };
