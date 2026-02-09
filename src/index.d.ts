/// <reference types="vite/client" />
/// <reference types="@dcloudio/uni-app" />
/// <reference types="@dcloudio/types" />

declare const wx: any;
declare const my: any;
declare const tt: any;
declare const uni: Uni;
declare const requirePlugin: any;
declare const h5UrlLocal: string;
declare const exports: any;
declare const require: any;

declare const __wxConfig: {
  envVersion: 'develop' | 'trial' | 'release';
};

/**
 * @wxAppid-微信appid
 * @alipayAppid-支付宝appid
 * @h5Appid-公众号appid
 * @name-小程序名字
 * @isSearchInHos-新增、完善就诊人 要跳 perfectReal 页面？
 * @isStartComeTest 欢迎页是否是测试
 *
 * @isOpenHealthCard-wx电子健康卡
 *   - healthCardText 电子健康卡左上角卡面名称
 *   - hospitalId 医院机构id
 *
 * @alipayPid-支付宝云监控的pid
 * @isOpenOcr-支付宝是否注册ocr插件 需要和就诊人配置接口同时设置
 */
interface ISystemGlobalItem {
  wxAppid?: string;
  alipayAppid?: string;
  isvAlipayAppid?: string;
  toutiaoAppid?: string;
  h5Appid?: string;
  h5Appid1?: string;
  h5AppidDisabledInTest?: boolean;
  name: string;
  harmonyBundleName?: string;
  _des?: string;

  // https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wxee969de81bba9a45&token=&lang=zh_CN
  isOpenHealthCard?: {
    healthCardText: string;
    hospitalId: string;
    isCardQueryComp?: boolean; //是否开启报告解读
    isNewMode?: boolean;
  };

  isSearchInHos?: boolean;
  isStartComeTest?: boolean;
  alipayPid?: string;
  // https://open.alipay.com/plugin/order-page?serviceCode=MP2020122300100215
  isOpenOcr?: boolean;

  //首页banner置顶
  homeTopBanner?: {
    topShow?: boolean;
    bannerHeight?: number;
  };

  // 中医样式
  systemStyle?: '1';
  sConfig?: ISConfig;
}

interface ISystemGlobalConfig {
  sysCode: string;
  sysConfig: {
    [key: string]: ISystemGlobalItem;
  };
}

interface IOptions<T = any> {
  label: string;
  value: T;
  [key: string]: any;
}
interface BaseObject {
  [key: string]: any;
}

interface IRouteBase {
  id?: number;
  showNo?: number; //后端的排序
  title: string; //主标题
  detail?: string; //副标题
  engDetail?: string; //副标题
  otherDetail?: string; //副标题
  iconfont?: string; //图标
  terminalType?: string; //终端类型 h5:三方h5 mini:三方微信小程序 alipay:三方支付宝小程序 my:自研 netHospital:网络医院
  appId?: string; //appid
  path?: string; //路径
  // query?: BaseObject;//参数
  query?: string; //参数
  isRotation?: string; //是否是轮播图 0 1
  loginInterception?: string; //是否登录拦截 1拦截 0 不拦截
  patientInterception?: string; //就诊人拦截  1拦截 0 不拦截
  selectPatientPage?: string; //跳转第三方是否需要就诊人选择页面
  gridLabel?: string; //角标 0 默认无角标 1 绿色能量 2 医保 3 维护中
  messageNum?: number; // 消息提醒数量
}

// interface IRouterLocal extends IRouteBase {
//   isNet?: false,
//   url: `/${string}`;
// }

// interface IRouterNet extends IRouteBase {
//   isNet: true,
//   url: `http${string}`;
// }

// type IRoute = IRouterNet | IRouterLocal
type IRoute = IRouteBase;

interface ILoginBack {
  _p?: string; // viewConfig 对应 id
  _url?: string;
  _query?: string; // 额外参数(待定)
  _type?: '1' | '2'; // 1主体 2 h5 (没用上， 待定)
  _isOutLogin?: '1'; // 1 过期
  _pageInfo?: '1' | '2'; // 1 需要完善 2就诊人 (没用上， 待定)
}

interface IAddress {
  city: string;
  county: string;
  createTime: string;
  defaultFlag: 1 | 0;
  detailedAddress: string;
  herenId: string;
  id: number;
  postcode: string;
  province: string;
  senderName: string;
  senderPhone: string;
  sysCode: string;
  updateTime: string;
}

interface IHOptionItem {
  label: string;
  value: string;
  children?: IHOptionItem[];
}

type IHOption = IHOptionItem[];

interface ISConfig {
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
  /**
   * - 1 不展示请登录模块
   */
  homeStyle?: '1';
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
  //首页是否智能消息提醒
  isOpenAssistMessage?: '1';
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

  // pages/home/my
  /** home/my 顶部显示变更为切换就诊人 */
  homeMyShowTogglePatComponent?: '1';

  // 门诊缴费 ----------------------------
  // 医保(各个平台之间最多存在一种医保模式)? 如果是 his 结算模式直接维护后台配置即可
  medicalMHelp?: {
    /** 开启就诊人更新患者医保 */
    isOpenPatToMedicalPat?: {
      /** 需要获取授权? */
      needAuth?: '1';
    };

    alipay?: {
      /** [医保插件模式](https://opendocs.alipay.com/pre-open/0a48vl#3.1.2%20%E6%8F%92%E4%BB%B6%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8)
       *
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

      /**
       *
       * 医保开启亲情付
       * 亲情付需要联系支付宝bd申请 提供 APPID应用渠道id、 appKey应用渠道秘钥
       *  */
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

        pathExtraData?: TMedicalNationWxConfig;
        /**
         * 同 pathExtraData， 用于一家医院有多个医保配置, 没获取到就用 pathExtraData
         */
        pathExtraDataConfig?: {
          [hosId: string]: TMedicalNationWxConfig;
        };

        // 走东软医保模式
        dongRuanMedicalInfo?: {
          h5BaseUrl: string;
        };
      };
      //微信跨端插件(微信吱口令跳支付宝) https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx12cec70855c0cacf&token=&lang=zh_CN
      crossProgramBizType?: {
        // 挂号吱口令（BizType）
        reg?: string;
        // 门诊吱口令
        clinic?: string;
        //医保建档
        medicalFiling?: string;
      };

      /** 默认是医保? (个别项目后端不能返回 医保标签, 前端数据手动加上但是页面不显示医保标签) */
      medicalDefault?: '1';

      /** 挂号医保 */
      isMedicalOrder?: '1';

      /**
       * 医保开启亲情付
       * 亲情付需要联系微信bd申请开通
       *  */
      isGbFamilyPayment?: '1';

      /** 医保建档 */
      medicalFiling?: '1';

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

type TMedicalNationWxConfig = {
  // 拼接到授权时候path - 东软医保模式必有以下可选字段
  /** 固定值 getAuthCode */
  openType: 'getAuthCode';
  bizType: string;
  /** 城市编码(邮件) */
  cityCode: string;
  /** 渠道号(邮件) */
  channel: string;
  /** 机构渠道认证编码 */
  orgChnlCrtfCodg: string;
  /** 定点医疗机构编码 */
  orgCodg: string;
  /** 定点医疗机构小程序/H5应用ID */
  orgAppId: string;
  /** 医保建档代授权字段 */
  relatedType?: string;
  /** 合作方appid */
  sourceapp?: string;
} & BaseObject;

// declare namespace UniNamespace {
// 	interface NavigateToOptions {
// 		passedParams?: {
// 			[key: string]: any;
// 		};
// 	}
// }

namespace UniNamespace {
  type Uni = Omit<UniInterface, 'getSystemInfo'> & {
    getSystemInfo(
      options: UniNamespace.GetSystemInfoOptions
    ): Promise<GetSystemInfoResult>;
  };
}

type PromiseReturnType<T> =
  ReturnType<T> extends Promise<infer R>
    ? R extends Promise<infer S>
      ? PromiseReturnType<() => R>
      : R
    : never;

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;

  export default component;
}
