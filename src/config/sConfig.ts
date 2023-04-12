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
      /** [医保插件模式](https://adccloud.yuque.com/adccloud/abilitywarehouse/kc7ro5?#AbvRt)
       *
       * 踩坑
       * - 体验环境验证正常后准备发布生产务必 环境切换后重新启动项目(否则不会自动切换插件环境)
       */
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
      /** 医保插件模式 (微信医保插件仅 弹窗二维码支付宝医保小程序) */
      medicalPlugin?: '1';
      // 医保国标模式  https://iheren.feishu.cn/docs/doccngcVdD0Wt1kgIgKUDaizWRe
      // https://docs.qq.com/doc/DV3lxV3hSbXFudVBE
      // 第三方提供的链接拼接工具(参数查看 测试环境反馈单) https://yb.qq.com/yibao-payment/doc/generateLink?nodeId=2
      medicalNation?: {
        appId: string;
        path: string;
      };

      /** 默认是医保? (个别项目后端不能返回 医保标签, 前端数据手动加上但是页面不显示医保标签) */
      medicalDefault?: '1';
    };
  };

  //是否开启助老版
  isOpenHelpOld?: '1';
  //首页开启智能问答——微信
  isOpenIntelQA?: {
    appId: string;
    path: string;
  };
}

const scJson: Record<string, ISConfig> = {
  /**
   * 乐清市人民医院
   */
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

  /**
   * 咸阳市第一人民医院
   */
  1001054: {
    isOpenButtom: '1',
    isHideHomeSearch: '1',
  },

  /**
   * 中国人民解放军新疆军区总医院
   */
  1001056: {
    medicalMHelp: {
      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=650100&channel=AAHXJbrzmhk_q05MEUW1ioQn&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxuHF+LhHk733m/BRrPGb2V8&orgCodg=H65010300478&orgAppId=1G8G3JJRB0043F60C80A0000EBD85252',
        },
        medicalDefault: '1',
      },
    },
  },

  /**
   * 台州第一人民医院
   */
  1001033: {
    isDrugDelivery: '1',
    isOpenHelpOld: '1',
    medicalMHelp: {
      wx: {
        medicalPlugin: '1',
      },
    },
  },

  /**
   * 西安红会
   */
  1001057: {
    isOpenIntelQA: {
      appId: 'wxba22f1a66a3af7aa',
      path: 'pages/index?appid=wx7b1baac614ebed72&configure=intelligent',
    },
  },
};

const getSConfig = (sysCode: string) => {
  return scJson[sysCode] || {};
};

export { scJson, getSConfig };
