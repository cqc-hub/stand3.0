/**
 * FIXME: 配置太过杂乱不好控制了, 乘着还没完全寄之前说明下
 *
 * sConfig.ts 这个文件往后尽量不在拓展**非插件配置参数**以外的数据
 *
 * ? 新的系统参数直接配置到 apiConfig.ts
 */

export interface ISConfig {
  // 小程序登录相关 ----------------------------
  login?: {
    /** 本系统不需要完善 */
    isSkipPerfect?: '1';
    /** 支付宝, 仅手机号授权(无身份证) */
    isAliAuthBase?: '1';

    /**
     * 使用 openId 授权模式登录(wx, ali)
     *  免完善
     */
    isLoginByOpenId?: '1';
  };

  // 就诊人 ----------------------------
  // 添加就诊人查询院内可能存在多张卡(濮阳人民)?
  isSearchHosForAddPatHasMoreThanOneCard?: '1';
  /**
   *  就诊卡详情 卡包按钮跳转对应的域名
   *  - [document](https://open.tengmed.com/openAccess/ability/detail?sceneId=0&catalogId=20&serviceId=93&docContentKey=detail)
   *  - defaultValue:  https://03-h5-health.tengmed.com
   *
   * */
  medicalCardDetailPackageDomain?: `http${string}`;

  // 首页 ----------------------------
  /** 替换首页标题(图片) */
  homeNavTitleLogo?: string;
  /** 首页顶部背景(图片) */
  homeTopBg?: string;
  // 隐藏首页底部和仁logo
  isHideHomeLogo?: '1';
  //底部是否放开互联网医院?
  isOpenHomeTabBarNetWorkBtn?: '1';
  //底部是否放开消息通知
  isOpenHomeTabBarMessageBtn?: '1';
  //消息通知是否提示新消息
  isMessageBtnShowNew?: '1';
  //首页是否支持消息授权——支付宝
  isOpenMessageAuth?: '1';
  //首页是否隐藏搜索框?
  isHideHomeSearch?: '1';
  //是否开启助老版
  isOpenHelpOld?: '1';
  /** 维吾尔语切换 */
  isLangUygur?: '1';
  //是否开启健康科普
  isOpenPopularSci?:
    | '1'
    | {
        wx?: '1';
        alipay?: '1';
      };
  //首页是否展示支付宝的关注组件
  isOpenAlipayFollow?: string;
  //首页是否支持展示咨询文章
  isOpenHomeArticle?: string;
  //首页banner置顶
  homeTopBanner?: {
    topShow?: boolean;
    bannerHeight?: number;
  };

  //是否对接支付宝的智能分诊插件-开启这个表示支付宝的智能导诊配置zndz 跳转去插件了
  isOpenAlipayZndz?: boolean;
  //付宝的智能分诊插件 https://opendocs.alipay.com/pre-open/03l73o#4.2%20%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6
  //是否开启微信同声传译插件 https://mp.weixin.qq.com/wxopen/pluginbasicprofile?action=intro&appid=wx069ba97219f66d99&token=699624033&lang=zh_CN
  isOpenWechatSI?: boolean;

  // 门诊缴费 ----------------------------
  // 医保(各个平台之间最多存在一种医保模式)? 如果是 his 结算模式直接维护后台配置即可
  medicalMHelp?: {
    /** 开启就诊人更新患者医保 */
    isOpenPatToMedicalPat?: {
      /** 需要获取授权? */
      needAuth?: '1';
    };

    alipay?: {
      /** [医保插件模式](https://adccloud.yuque.com/adccloud/abilitywarehouse/kc7ro5?#AbvRt)
       *  省内项目 都是医保插件模式
       * 踩坑
       * - 体验环境验证正常后准备发布生产务必 环境切换后重新启动项目(否则不会自动切换插件环境)
       */
      medicalPlugin?: {
        // 机构id  各个院区都需要提供
        orgId: {
          [hosId: string]: string;
        };
        //多院区同一个orgid的情况传入appId
        appId?: {
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

      /** 医保开启亲情付 */
      isFamilyPayment?: '1';
      /** 医保开启亲情付 */
      isGbFamilyPayment?: '1';

      /** 医保建档 */
      medicalFiling?: '1';

      // /** 门诊缴费跳转浙里医保小程序 */
      navgateToZLminiProm?: {
        orgId: {
          [hosId: string]: string;
        };
      };

      pathExtraData?: BaseObject;
    };

    wx?: {
      /** 医保插件模式 (微信医保插件仅 弹窗二维码支付宝医保小程序) */
      medicalPlugin?: '1';
      // 医保国标模式  https://iheren.feishu.cn/docs/doccngcVdD0Wt1kgIgKUDaizWRe
      // https://docs.qq.com/doc/DV3lxV3hSbXFudVBE
      // 第三方提供的链接拼接工具(参数查看 测试环境反馈单) https://yb.qq.com/yibao-payment/doc/generateLink?nodeId=2
      /**
       * cityCode、channel 在邮件里面看
       */
      // auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=cityCode&channel=渠道号&orgChnlCrtfCodg=机构渠道认证编码&orgCodg=定点医疗机构编码&orgAppId=定点医疗机构小程序/H5应用ID
      medicalNation?: {
        appId: string;
        path: string;

        pathExtraData?: {
          // 拼接到授权时候path - 东软医保模式必有以下可选字段
          /** 固定值 getAuthCode */
          openType: 'getAuthCode';
          /** 固定值 04107 */
          bizType: '04107';
          /** 城市编码 */
          cityCode: string;
          /** 渠道号 */
          channel: string;
          /** 机构渠道认证编码 */
          orgChnlCrtfCodg: string;
          /** 定点医疗机构编码 */
          orgCodg: string;
          /** 定点医疗机构小程序/H5应用ID */
          orgAppId: string;
        } & BaseObject;
        // 走东软医保模式
        dongRuanMedicalInfo?: {
          h5BaseUrl: string;
        };
      };
      //微信跨端插件(微信吱口令跳支付宝) https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx12cec70855c0cacf&token=&lang=zh_CN
      crossProgramBizType?: {
        reg?: string;
        clinic?: string;
      };

      /** 默认是医保? (个别项目后端不能返回 医保标签, 前端数据手动加上但是页面不显示医保标签) */
      medicalDefault?: '1';

      /** 挂号医保 */
      isMedicalOrder?: '1';

      /** 医保开启亲情付 */
      isGbFamilyPayment?: '1';

      /**
       * wx省中智捷付
       */
      medical1001035?: {
        // 授权地址
        auth: {
          appId: string;
          path: string;
          envVersion?: 'release' | 'trial';
          extraData: {
            appid: string;
            userName?: string;
            idCard?: string;
            [key: string]: any;
          };
        };
        // 支付地址
        pay: {
          appId: string;
          path: string;
          envVersion?: 'release' | 'trial';
          extraData: {
            // 静态数据
            appid: string;
            channel_code: string;
            fixmedinsCode: string;
            fixmedinsName: string;

            octoken?: string;
            payAuthno?: string;
            orderId?: string;
            orderIdSM4?: string;
            medOrgOrd?: string;
            sourcebusinessBj?: '11' | '12'; // 业务类别 12 门诊缴费11医保挂号
            familyName?: string;
            familyIdNo?: string;
            [key: string]: any;
          };
        };
      };
    };
  };

  // 其他 ----------------------------
  // 有药品配送功能?
  isDrugDelivery?: '1';
}

const scJson: Record<string, ISConfig> = {
  /**
   * 温二附
   */
  1001067: {
    login: {
      // isAliIndependentDev: '1',
      isSkipPerfect: '1',
      isAliAuthBase: '1',
      isLoginByOpenId: '1',
    },
    isOpenHelpOld: '1',
    isOpenMessageAuth: '1',
    isOpenWechatSI: true,
    // isOpenHomeTabBarMessageBtn: '1',
    // isOpenHomeTabBarNetWorkBtn: '1'

    medicalMHelp: {
      alipay: {
        medicalPlugin: {
          orgId: {
            13012: 'H33030200034',
            13013: 'H33030200034',
            13009: 'H33030200034',
            13011: 'H33030200034',
          },
          cardType: '01',
        },
      },
    },
  },

  /**
   * 杭州口腔医院
   */
  1001063: {
    login: {
      isSkipPerfect: '1',
      isAliAuthBase: '1',
    },
    isOpenAlipayFollow: '81fa167551234b1f8585325f56bd6726',
    isOpenWechatSI: true,
    // isOpenHomeTabBarNetWorkBtn: '1',
  },

  1001065: {
    login: {
      isSkipPerfect: '1',
    },
  },

  /**
   * 宁波耳鼻喉医院
   */
  1001068: {
    isOpenWechatSI: true,
  },

  /**
   * 濮阳市人民医院
   */
  1001058: {
    isOpenWechatSI: true,
    login: {
      isAliAuthBase: '1',
    },
    isSearchHosForAddPatHasMoreThanOneCard: '1',

    medicalMHelp: {
      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=410901&channel=AAESBm3dgscMbm3owOheQVk0&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtJRKQswprsB52V1kSQVkyD&orgCodg=H41090200004&orgAppId=1HPSM9AQ20183F60C80A000061EF761F',
        },
        isMedicalOrder: '1',
      },
    },
  },

  /**
   * 濮阳市第五人民医院
   */
  1001059: {
    isSearchHosForAddPatHasMoreThanOneCard: '1',
  },

  1001066: {
    isOpenWechatSI: true,
    login: {
      isSkipPerfect: '1',
      isAliAuthBase: '1',
    },
  },

  /**
   * 绍兴第二医院
   */
  1001060: {
    isOpenHelpOld: '1',
    login: {
      // isAliAuthBase: '1',
    },
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
    isOpenWechatSI: true,
    medicalMHelp: {
      wx: {
        crossProgramBizType: {
          clinic: '6vtqCjFiWg',
        },
        medicalPlugin: '1',
      },
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
    homeNavTitleLogo:
      'https://phsdevoss.eheren.com/pcloud/phs3.0/xianyannavtitle.png',

    isOpenHomeTabBarNetWorkBtn: '1',
    isHideHomeSearch: '1',
    isOpenWechatSI: true,
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
    isOpenWechatSI: true,
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
    isOpenWechatSI: true,
    medicalMHelp: {
      wx: {
        crossProgramBizType: {
          clinic: 'iAZhaFg90P',
        },
        medicalPlugin: '1',
      },

      alipay: {
        medicalPlugin: {
          orgId: { 1279: 'H33100300340' },
          cardType: '01',
        },
        medicalFiling: '1',
        isFamilyPayment: '1',
      },
    },
  },

  /**
   * 西安红会
   */
  1001057: {
    isOpenPopularSci: '1',
    isOpenWechatSI: true,
    medicalCardDetailPackageDomain: 'https://01-h5-health.tengmed.com',
    medicalMHelp: {
      isOpenPatToMedicalPat: {},

      alipay: {
        // medicalDefault: '1',
        medicalNation: {},
        isMedicalOrder: '1',
        isGbFamilyPayment: '1',
      },

      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          // path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610100&channel=AAFCflpRouGx9rzCduR7IDwV&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxveJKftoNCw+TCAqUwy6fwh&orgCodg=H61010300557&orgAppId=1G8FTSHFR0F63F60C80A00003310E195',
          // 生产
          path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610100&channel=AAFCflpRouGx9rzCduR7IDwV&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxveJKftoNCw+TCAqUwy6fwh&orgCodg=H61010300557&orgAppId=1H39F4EL9015E2470B0A000095823F28',
        },
        crossProgramBizType: {
          clinic: 'mAuUBT4u0E',
          reg: 'w4XIxwNWzW',
        },

        // medicalDefault: '1',
        isMedicalOrder: '1',
        isGbFamilyPayment: '1',
      },
    },
    isOpenHomeArticle: '1',
  },

  /**
   * 郸城县人民医院
   */
  1001045: {
    medicalMHelp: {
      alipay: {
        medicalDefault: '1',
        medicalNation: {},
      },
    },
  },

  /**
   * 联勤保障部队第987医院
   */
  1001055: {
    isOpenAlipayZndz: true,
    isHideHomeLogo: '1',
  },

  1001099: {},

  /**
   * 大医二院普湾院区
   */
  1001041: {
    isOpenHomeTabBarMessageBtn: '1',
  },

  1001086: {
    homeNavTitleLogo:
      'https://phsdevoss.eheren.com/pcloud/phs3.0/xinjiangzhongyinavtitle.png',
  },

  /**
   * 湖州三院
   */
  1001040: {
    isOpenHomeTabBarNetWorkBtn: '1',
    isOpenHelpOld: '1',
    isOpenWechatSI: true,
    medicalMHelp: {
      isOpenPatToMedicalPat: {},

      wx: {
        medicalPlugin: '1',
      },

      alipay: {
        medicalPlugin: {
          orgId: { 12694: 'H33050200031' },
          cardType: '01',
        },
        medicalFiling: '1',
      },
    },
  },

  /**
   * 绍兴人民
   */
  1001046: {
    // isMessageBtnShowNew: '1',
    isOpenWechatSI: true,
    isOpenHomeTabBarMessageBtn: '1',
    login: {
      isAliAuthBase: '1',
    },
    medicalMHelp: {
      isOpenPatToMedicalPat: {},
      wx: {
        crossProgramBizType: {
          clinic: '6f8FEzfB6q',
        },
        medicalPlugin: '1',
      },
      alipay: {
        medicalPlugin: {
          orgId: { 12930: 'H33060200131', 13178: 'H3306020013120' },
          appId: { 13178: '20' },
          cardType: '01',
        },
        medicalFiling: '1',
      },
    },

    isOpenHelpOld: '1',
  },

  /**
   * 嘉兴第二互联网医院
   */
  1001038: {
    isMessageBtnShowNew: '1',
    isOpenHelpOld: '1',
    isOpenHomeTabBarNetWorkBtn: '1',
    medicalMHelp: {
      wx: {
        medicalPlugin: '1',
      },
      // isOpenPatToMedicalPat: {},
      alipay: {
        medicalPlugin: {
          orgId: { 13014: 'H33040200352' },
          cardType: '01',
        },
      },
    },
  },
  /*浙江省人民医院毕节医院金海湖院区 */
  1001069: {
    isOpenWechatSI: true,
    medicalMHelp: {
      // alipay: {
      // medicalNation: {},
      // },
      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          //测试
          path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=520500&channel=AAEBc2RH-gUYFz7T2U2NVQhi&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxuumfluttL87+gDtSEtCYLx&orgCodg=H52050200015&orgAppId=1HN2UHLM80083F60C80A0000448F840F',
          // 生产
          // path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610100&channel=AAFCflpRouGx9rzCduR7IDwV&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxveJKftoNCw+TCAqUwy6fwh&orgCodg=H61010300557&orgAppId=1H39F4EL9015E2470B0A000095823F28',
          // path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=551700&channel=&orgChnlCrtfCodg=&orgCodg=H5205020001&orgAppId=1HN2UHLM80083F60C80A0000448F840F',
        },
        isMedicalOrder: '1',
        // medicalPlugin: '1',
      },
    },
  },
  /**
   * 杭口未来医院
   */
  1001071: {
    // isOpenHomeTabBarNetWorkBtn: '1',
  },

  /**
   * 天水市第一人民医院
   */
  1001074: {
    // isOpenHomeTabBarNetWorkBtn: '1',
    isHideHomeLogo: '1',
    isOpenWechatSI: true,
    login: {
      // isAliAuthBase: '1',
      // isLoginByOpenId:"1",
    },
    medicalMHelp: {
      isOpenPatToMedicalPat: {},
      alipay: {
        // medicalNation: {},
      },
      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          //测试
          // path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=620500&channel=AAF-qIZucnqdnk72zjYzIJ38&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtjvE9yjYec3Tmc/8KSGSL7&orgCodg=H62050200075&orgAppId=1IC2S3ORH0H04460C80A0000210115A3',
          // 生产
          path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=620500&channel=AAF-qIZucnqdnk72zjYzIJ38&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtjvE9yjYec3Tmc/8KSGSL7&orgCodg=H62050200075&orgAppId=1IC2S44OQ0028C430B0A0000A6FDEDE9',
        },
        // medicalPlugin: '1',
      },
    },
  },

  /**
   * 昆明口腔医院
   */
  1001076: {
    login: {
      isSkipPerfect: '1',
    },
  },

  1001077: {
    login: {
      isAliAuthBase: '1',
    },
    medicalMHelp: {
      isOpenPatToMedicalPat: {},
      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          // 生产
          path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610101&channel=AAEoVvqZuWU8BNSYVtMM15px&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxv2/NlHf1H5KZT+T46wCMi1&orgCodg=H61010400913&orgAppId=1IPJEE9D306C8C430B0A000022532554',

          //测试
          // path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610101&channel=AAEoVvqZuWU8BNSYVtMM15px&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxv2/NlHf1H5KZT+T46wCMi1&orgCodg=H61010400913&orgAppId=1IOS9I97D1CO4460C80A00004B82B3CD',
        },
        isMedicalOrder: '1',
        isGbFamilyPayment: '1',
        // medicalPlugin: '1',
      },
    },
  },

  1001048: {
    // isOpenWechatSI: true,
    isOpenHelpOld: '1',
    medicalMHelp: {
      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          // path: `auth/pages/bindcard/auth/index?openType=getAuthCode&cityCode=${'320200'}&channel=${'AAGDjhBtPzo4LJTh9gCenRkB'}&orgChnlCrtfCodg=${'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxvGdh09Ghvhyk/swHL2NBPe'}&orgCodg=${'H32028200358'}&bizType=04107&orgAppId=${'1GU9S5QVB01M76430B0A000038F064B8'}`,
          path: `auth/pages/bindcard/auth/index`,
          pathExtraData: {
            openType: 'getAuthCode',
            cityCode: '320200',
            channel: 'AAGDjhBtPzo4LJTh9gCenRkB',
            orgChnlCrtfCodg:
              'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxvGdh09Ghvhyk/swHL2NBPe',
            orgCodg: 'H32028200358',
            bizType: '04107',
            orgAppId: '1GU9S5QVB01M76430B0A000038F064B8',
          },
          dongRuanMedicalInfo: {
            h5BaseUrl: 'https://ybj.jszwfw.gov.cn/mms/hsa-tiap-ui',
          },
        },
        isMedicalOrder: '1',
        isGbFamilyPayment: '1',
      },
    },
  },

  /**
   * 智领医院
   */
  1001080: {
    login: {
      isSkipPerfect: '1',
      isAliAuthBase: '1',
      isLoginByOpenId: '1',
    },
    isOpenHelpOld: '1',
    isOpenMessageAuth: '1',
    isOpenWechatSI: true,
    isOpenHomeTabBarNetWorkBtn: '1',
  },

  /**
   * 浙江省健康人才发展协会
   */
  1001081: {
    login: {
      isSkipPerfect: '1',
      isAliAuthBase: '1',
      isLoginByOpenId: '1',
    },
  },

  /**
   * 南京金陵口腔医院
   */
  1001078: {
    login: {
      isSkipPerfect: '1',
    },
  },

  /**
   * 健康温州
   */
  1001082: {
    isOpenPopularSci: '1',
    // isOpenHomeTabBarMessageBtn: '1',
    login: {
      isAliAuthBase: '1',
    },
    isOpenWechatSI: true,
  },
  /**
   * 温州人民
   */
  1001083: {
    login: {
      isSkipPerfect: '1',
    },
  },
  1001084: {
    login: {
      isAliAuthBase: '1',
      isLoginByOpenId: '1',
    },

    medicalMHelp: {
      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          path: 'auth/pages/bindcard/auth/index',
          pathExtraData: {
            openType: 'getAuthCode',
            cityCode: '320400',
            orgCodg: 'H32048100095',
            orgChnlCrtfCodg:
              'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxvXg/++7e1yfc/kbkno5H2B',
            bizType: '04107',
            orgAppId: '1I4IKUE4808A8C430B0A000072CBC284',
            channel: 'AAGIeU0wtURqrsaTlQYAvi6z',
          },
          dongRuanMedicalInfo: {
            h5BaseUrl: 'https://ybj.jscz.org.cn/cashierui',
            // h5BaseUrl: 'https://ybj.jscz.org.cn/tiap/hsa-pmc-tiap-ui',
          },
        },
        isMedicalOrder: '1',
        isGbFamilyPayment: '1',
        // medicalDefault: '1',
      },
    },
  },
  1001085: {
    login: {
      isSkipPerfect: '1',
    },
  },
  /**
   * 江苏省中医院
   */
  1001035: {
    homeNavTitleLogo:
      'https://phsdevoss.eheren.com/pcloud/phs3.0/jiangsushengzhonnavtitle.png',
    isOpenMessageAuth: '1',
    isMessageBtnShowNew: '1',
    isOpenPopularSci: {
      wx: '1',
    },
    isOpenWechatSI: true,
    isOpenHelpOld: '1',
    homeTopBanner: {
      topShow: true,
    },
    medicalMHelp: {
      wx: {
        isMedicalOrder: '1',

        isGbFamilyPayment: '1',

        // 测试
        // medical1001035: {
        //   auth: {
        //     //
        //     appId: 'wxfde9fffbfa82be54',
        //     path: 'pages/allOutPayCashier/authUniPro/authUni',
        //     extraData: {
        //       appid: 'c4097ed72fc64e71818e6990dc6f9512',
        //     },
        //   },
        //   pay: {
        //     appId: 'wxfde9fffbfa82be54',
        //     path: 'pages/allOutPayCashier/cashierUniPro/cashierUni',
        //     extraData: {
        //       appid: 'c4097ed72fc64e71818e6990dc6f9512',
        //       channel_code: 'f6cd425b461444f3907808719fd30011',
        //       fixmedinsCode: 'H32010400468',
        //       fixmedinsName: '江苏省中医院',
        //     },
        //   },
        // },

        // 正式
        medical1001035: {
          auth: {
            appId: 'wxfde9fffbfa82be54',
            path: 'pages/allOutPayCashier/authUniPro/authUni',
            extraData: {
              appid: '96391c9afe2c46b3bba52436351dd418',
            },
          },
          pay: {
            appId: 'wxfde9fffbfa82be54',
            path: 'pages/allOutPayCashier/cashierUniPro/cashierUni',
            extraData: {
              appid: '96391c9afe2c46b3bba52436351dd418',
              channel_code: 'b756bf71948144f993bcc768fe7b0910',
              fixmedinsCode: 'H32010400468',
              fixmedinsName: '江苏省中医院',
            },
          },
        },
      },
    },
  },
  /**
   * 东部战区总医院医院
   */
  1001036: {
    // isOpenHomeTabBarNetWorkBtn: '1',
    // isOpenPopularSci: '1',
    homeNavTitleLogo:
      'https://phsdevoss.eheren.com/pcloud/image/1001036logo3.png',

    homeTopBanner: {
      topShow: true,
      bannerHeight: 230,
    },
  },
  /**
   * 安康中医医院
   */
  1001044: {
    homeNavTitleLogo:
      'https://phsdevoss.eheren.com/pcloud/phs3.0/ankangzhongnavtitle.png',

    login: {},
    medicalMHelp: {
      isOpenPatToMedicalPat: {},
      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          // 生产
          path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610900&channel=AAEfZXu8U-gLigchujuuMHOR&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxv7ltjDddRhreS6tc6M0416&orgCodg=H61090200044&orgAppId=1GTNPT4M90H576430B0A0000D5352BB7',

          //测试
          // path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610101&channel=AAEoVvqZuWU8BNSYVtMM15px&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxv2/NlHf1H5KZT+T46wCMi1&orgCodg=H61010400913&orgAppId=1IOS9I97D1CO4460C80A00004B82B3CD',
        },
        // isMedicalOrder: '1',
      },
    },
  },

  1001092: {
    isOpenHelpOld: '1',
    login: {
      isAliAuthBase: '1',
      isSkipPerfect: '1',
    },

    medicalMHelp: {
      wx: {
        // 测试
        // medicalNation: {
        //   appId: 'wxe183cd55df4b4369',
        //   path: 'auth/pages/bindcard/auth/index',
        //   pathExtraData: {
        //     openType: 'getAuthCode',
        //     bizType: '04107',
        //     cityCode: '610600', // ?
        //     channel: 'AAFjWNlsD_YjoGPGECfQP-LW', // ?
        //     orgChnlCrtfCodg:
        //       'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtVok110ttUbcrc5BbIj9rW',
        //     orgCodg: 'H61060200365',
        //     orgAppId: '1J600B2FR08K4460C80A00004B274D74',
        //   },
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          path: 'auth/pages/bindcard/auth/index',
          pathExtraData: {
            openType: 'getAuthCode',
            bizType: '04107',
            cityCode: '610600',
            channel: 'AAFjWNlsD_YjoGPGECfQP-LW',
            orgChnlCrtfCodg:
              'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtVok110ttUbcrc5BbIj9rW',
            orgCodg: 'H61060200365',
            orgAppId: '1JAQFM29V01U8C430B0A0000C1B4E028',
          },
        },
        isMedicalOrder: '1',
      },
    },
  },
  1001093: {
    isOpenHelpOld: '1',
    login: {
      isAliAuthBase: '1',
      isSkipPerfect: '1',
    },
    homeTopBanner: {
      topShow: true,
      bannerHeight: 230,
    },
    homeTopBg:
      'https://phsdevoss.eheren.com/pcloud/phs3.0/stand3-1001094-home-topbg.png',
    homeNavTitleLogo:
      'https://phsdevoss.eheren.com/pcloud/phs3.0/zhejiangshenzhongliunavtitle-white.png',
  },
  1001094: {
    homeNavTitleLogo:
      'https://phsdevoss.eheren.com/pcloud/phs3.0/xinjiangzhongyinavtitle.png',

    isOpenHelpOld: '1',
    // isLangUygur: '1',
    isOpenPopularSci: '1',
    isOpenWechatSI: true,
    homeTopBanner: {
      topShow: true,
      bannerHeight: 200,
    },

    login: {
      isSkipPerfect: '1',
    },
    medicalMHelp: {
      wx: {
        medicalNation: {
          appId: 'wxe183cd55df4b4369',
          path: 'auth/pages/bindcard/auth/index',
          pathExtraData: {
            openType: 'getAuthCode',
            bizType: '04107',
            cityCode: '650100',
            channel: 'AAEZDc60WgTiVxo5xtoqTx-g',
            orgChnlCrtfCodg:
              'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxsNriL3sY3GfFVjZHL7b0de',
            orgCodg: 'H65010300208',
            orgAppId: '1GJ8TA8QI0IE75430B0A0000F938BFC7',
            sourceapp: 'wx081a6fb9ee8778e4-1',
          },
        },
      },
    },
  },
  1001097: {
    isDrugDelivery: '1',
  },
};

const getSConfig = (sysCode: string) => {
  return scJson[sysCode] || {};
};

export { scJson, getSConfig };
