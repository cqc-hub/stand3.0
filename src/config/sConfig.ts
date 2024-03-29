interface ISConfig {
  // 添加就诊人查询院内可能存在多张卡(濮阳人民)?
  isSearchHosForAddPatHasMoreThanOneCard?: '1';
  // 有药品配送功能?
  isDrugDelivery?: '1';
  //底部是否放开互联网医院?
  isOpenHomeTabBarNetWorkBtn?: '1';
  //底部是否放开消息通知
  isOpenHomeTabBarMessageBtn?: '1';
  //首页是否隐藏搜索框?
  isHideHomeSearch?: '1';
  // 医保(各个平台之间最多存在一种医保模式)? 如果是 his 结算模式直接维护后台配置即可
  medicalMHelp?: {
    /** 开启就诊人更新患者医保 */
    isOpenPatToMedicalPat?: {
      /** 需要获取授权? */
      needAuth?: '1';
    };

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

      /**
       * 国标医保
       */
      medicalNation?: {};

      medicalDefault?: '1';

      /** 挂号医保 */
      isMedicalOrder?: '1';
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

      /** 挂号医保 */
      isMedicalOrder?: '1';
    };
  };

  //是否开启助老版
  isOpenHelpOld?: '1';
  //首页开启智能问答——微信
  isOpenIntelQA?: {
    appId: string;
    path: string;
  };
  //是否对接支付宝的智能分诊插件-开启这个表示支付宝的智能导诊配置zndz 跳转去插件了
  isOpenAlipayZndz?: boolean;
  //付宝的智能分诊插件 https://opendocs.alipay.com/pre-open/03l73o#4.2%20%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6

  /**
   *  就诊卡详情 卡包按钮跳转对应的域名
   *  - [document](https://open.tengmed.com/openAccess/ability/detail?sceneId=0&catalogId=20&serviceId=93&docContentKey=detail)
   *  - defaultValue:  https://03-h5-health.tengmed.com
   *
   * */
  medicalCardDetailPackageDomain?: `http${string}`;
}

const scJson: Record<string, ISConfig> = {
  /**
   * 濮阳市人民医院
   */
  1001058: {
    isSearchHosForAddPatHasMoreThanOneCard: '1',
  },

  /**
   * 绍兴第二医院
   */
  1001060: {
    medicalMHelp: {
      // isOpenPatToMedicalPat: {},
      alipay: {
        medicalPlugin: {
          orgId: { 13060: 'H33060300001' },
          cardType: '01',
        },
      },
    },
  },

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
    isOpenHomeTabBarNetWorkBtn: '1',
    isHideHomeSearch: '1',
    medicalMHelp: {
      isOpenPatToMedicalPat: {},

      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610400&channel=AAFwLnLNBzDZNXVZVKdvs0v_&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtn+S/XPoOIr53u3xRWP6xq&orgCodg=H61040200092&orgAppId=1GLE8RTS20N376430B0A0000CAE3B2A4',
        },
        // medicalDefault: '1',
        isMedicalOrder: '1',
      },
    },
  },

  /**
   * 中国人民解放军新疆军区总医院
   */
  1001056: {
    isOpenAlipayZndz: true,
    medicalMHelp: {
      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=650100&channel=AAHXJbrzmhk_q05MEUW1ioQn&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxuHF+LhHk733m/BRrPGb2V8&orgCodg=H65010300478&orgAppId=1GU9PR6L900C76430B0A00006D4C0BE7',
        },
        // medicalDefault: '1',
      },
    },
  },

  /**
   * 台州第一人民医院
   */
  1001033: {
    isOpenAlipayZndz: true,
    isDrugDelivery: '1',
    isOpenHelpOld: '1',
    medicalMHelp: {
      wx: {
        medicalPlugin: '1',
      },

      alipay: {
        medicalPlugin: {
          orgId: { 1279: 'H33100300340' },
          cardType: '01',
        },
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
    medicalCardDetailPackageDomain: 'https://01-h5-health.tengmed.com',
    medicalMHelp: {
      isOpenPatToMedicalPat: {},

      alipay: {
        medicalDefault: '1',
        medicalNation: {},
      },

      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          // path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610100&channel=AAFCflpRouGx9rzCduR7IDwV&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxveJKftoNCw+TCAqUwy6fwh&orgCodg=H61010300557&orgAppId=1H2Q26JL901M3F60C80A0000C5174FDB',
          path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610100&channel=AAFCflpRouGx9rzCduR7IDwV&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxveJKftoNCw+TCAqUwy6fwh&orgCodg=H61010300557&orgAppId=1H39F4EL9015E2470B0A000095823F28',
        },
        medicalDefault: '1',
        isMedicalOrder: '1',
      },
    },
  },

  /**
   * 联勤保障部队第987医院
   */
  1001055: {
    isOpenAlipayZndz: true,
  },

  /**
   * 大医二院普湾院区
   */
  1001041: {
    isOpenHomeTabBarMessageBtn: '1',
  },
};

const getSConfig = (sysCode: string) => {
  return scJson[sysCode] || {};
};

export { scJson, getSConfig };
