import { type XOR } from '@/typeUtils/obj';

export type TConfigEnv = 'inWx' | 'inAlipay';
/**
 *  未指定说明的 '0' 均为 false '1' true
 */
export interface ISystemConfig_ {
  // 预约挂号
  order: {
    /** 科室列表页面 */
    // 选科室上面 banner
    bannerOrder?: TBannerConfig;
    //选科室上面 banner-支付宝
    bannerOrderAlipay?: TBannerConfig;
    /** 预约挂号温馨提示 */
    deptDialogBtnCannel?: {
      label: string;
      // '0' 门诊充值
      key: '0';
    };

    /** 挂号页面 */
    /** 挂号模式(挂号排序,显示等医院定制) 1 西安红会 */
    orderMode?: '1';
    // 选择科室医生页面顶部可选择的天数， chooseDay > 20 出现组件 ‘日历’
    chooseDay: number;
    // 选择号源时候显示几列
    selOrderColumn: number;
    // 精确号源?
    isOrderBlur: '0' | '1';
    // 展示号源数不为空的，超过当前时间的号源是否展示
    isHideOutTimeOrderSource?: '0' | '1';
    // 预约挂号时候付钱?
    isOrderPay: '0' | '1';
    // 挂号成功后预问诊?
    isOpenPreConsultation?: '1';

    /** 医生名片 */
    // 对应网络医院那边维护的 hosId， 他们不用区分院区的吗？
    netHosId?: string; // isOpenDocCardOnlineService === '1' 时候必给
    // 开启在线服务?
    isOpenDocCardOnlineService?: '1';
    // 近一年大数据
    isOpenBigDataNearlyYear?: '1';
    // 评论
    isOpenComment?: '1';
    //排班页面是否隐藏号源的总量余量
    isHideNumberSourceTotalRemain?: '1';

    /** 挂号记录 */
    // 显示院内导航按钮? 挂号状态 string
    isHosNavigation?: string[];
    // 排队叫号?
    isQueuing?: string[];
    // 服务评价?
    isFWBtn?: string[]; // 需要服务评价的订单状态码
    // 已就诊、已结束订单状态显示“复诊预约”按钮
    isOpenReOrder?: '1';
    // 自定义列表子项底部按钮功能
    regListItemCustomButtons: TRegListButtonItem[];
    // 可以筛选 在线/全部 挂号?
    isCanSelOrderStatus?: '1';

    /** 搜索 */
    // 热门搜索
    hosRegHistory?: IRegSearchHistoryItem[];

    /** 门诊取号 */
    takeNumberQueueBtn?: '1'; // 门诊取号列表页面是否显示排队叫号入口按钮
    takeNumberAfterBtnForGoQueueNumber?: '1'; // 取号后  按钮变成 '查看排队信息': 跳 排队叫号; 默认 '刷码签到'
  };

  /** 移动端伦理委员会(h5) */
  LUN_LI?: {
    // 对应科室id
    [key: string]: {
      entranceType: string;
      iconfont: string;
      title: string;
    };
  };

  /** 就诊人 */
  person: {
    /** 新增就诊人页面 (medicalCardMan/perfectReal)页面是否有 '就诊人类型' 一行 */
    isHidePatientTypeInPerfect?: '0' | '1';
    /** 开启短信验证？ 完善时候没有 */
    isSmsVerify?: '0' | '1';
    /** 新增、完善就诊人时候 根据监护人证件号（身份证）判断监护人（至少 guardianAge 岁） */
    ageGuardian: number;
    /** 新增、完善就诊人时候 根据 生日｜身份证 判断 新生儿（至多 ageChildren 月） */
    ageChildren: number;

    /** 新增就诊人页面有证件且证件类型 身份证时候  小于默认isGuardianWithIdCardAge(6)岁 是否监护人 ？ */
    isGuardianWithIdCard?: number;

    /** 仅微信, 支付宝 手动 config.json 配置 */
    ocr?: '0' | '1';
    isFace?: '1';
  };

  // 病案
  medRecord: {
    /**
     * 身份证上传要求 （人像、 背面、 手持）
     * 后端说 人像、 背面 必填 设置时候每次都加下
     */
    sfz: TMedRecordSfz[];
    /** sfz 配置中 front 的进行 ocr认证 */
    isOcrSfz?: '1';
    /** 不配置时候 sfz 中所有图片必须上传, 配置时候对应字段必须上传 可以使用 ['front|hkb'] 这样的格式 */
    requireSfz?: string[];
    /** 复印目的 不配置使用原来的那几个目的 */
    purpose?: string[];
    /** 可选择的复印目的长度 默认 3 */
    selPurposeLen?: number;
    /** 目的有没有份数可以选择 */
    isPurposeRadio?: '1';

    /** 收钱方式 0 预收 1 按项目、目的 */
    isItemCount?: '0' | '1';

    /**  收钱方式预收的金额 ｜ 单个项目金额 */
    fee: number;
    hosId: string;

    /** 是否支持自定义住院记录 */
    isCustomPatRecord?: '0' | '1';

    /** 手动添加记录里面是否可以切换院区 */
    isToggleHos?: '0' | '1';

    /** 快递公司 */
    company?: IOptions[];
  }[];

  //住院服务
  hospitalCare: {
    //顶部tab
    tab: IConfigTab[];
    //配置的预缴金额 [500,1000,2000,3000,5000,10000]
    inPatientPrePay: string[];
    /** 共3种模式：默认 1 不限制金额，2 仅支持整数金额，3 仅支持百倍金额输入  */
    isMode: '1' | '2' | '3';
    //列表1 详情2 住院总计清单
    isHosTotallist: '1' | '2';
    //列表1 详情2 日费用清单模式
    isHosDaylist: '1' | '2';
    //0否 1 是 是否支持预交金记录查询
    isQueryPreRecord?: '0' | '1';
  };

  // 门诊缴费
  pay: {
    /**
     * 列表页
     */
    /** 可以切换院区? */
    isListToggleHos?: '1';

    /** 门诊类型  网络医院/线下门诊 (是否展示) */
    isListShowClinicType?: '1';
    /** 待缴费点击缴费时候提示的协议编号 (不配没有) */
    confirmPayFg?: string;
    // 已缴费底部的按钮
    payedFooterBtn?: TButtonConfig;
    /** 预结算 */
    isPreSettle?: '1';
    // 扫码缴费是否隐藏列表金额
    isScanListHideMoney?: '1';

    /** 页面顶部 banner */
    bannerPay?: TBannerConfig;

    /**
     * 详情页
     */

    /** 待缴费详情页面 的费用总额是否可以让用户选择缴费 */
    isSubitemPay?: '1';
    // 申请退单
    isOpenChargeback?: '1';
    // 已缴费详情页面对某一条具体的费用进行申请退费
    isPayedItemDetailRefund?: '1';

    // 缴费完成后跳转
    /**
     * prop 对应缴费列表 clinicType 值
     * 1-线下就诊
     * 2-网络问诊
     * 3-会诊
     */
    pageNextAdress?: Record<
      '1' | '2' | '3',
      {
        /**
         * @mode
         * 1-电子导诊单
         * 2-药品助手
         */
        mode: '1' | '2';
      }
    >;
  };

  //报告查询
  reportQuery: {
    //顶部tab
    reportTab: IReportConfigTab[];
    //0否 1 是 是否显示水印
    isWatermark: '0' | '1';
    //水印文案 (二维码不支持中文 取消该字段, 取医院名字)
    // watermarkText?: string;
    //0否 1 是 是否开启医生名片入口
    isDoctorCard: '0' | '1';
    //0否 1 是 是否开启支持下载报告 开启这个配置且有图文的前提 页面才会实现
    isDownloadRepor?: '0' | '1';
    //0否 1 是 是否支持查看图文报告 有图文必有下载功能
    isGraphic?: '0' | '1';

    /** 报告查询列表云影像链接 */
    listYun?: {
      imgUrl: string;
    };

    jyListFooterBtn?: TButtonConfig[] | TButtonConfig;
    jcListFooterBtn?: TButtonConfig[] | TButtonConfig;
  };

  /** 药品配送 */
  drugDelivery: {
    company?: IOptions[];

    /** 中药代煎外配详情 内跳快递小程序的appid*/
    deliveryFired?: {
      wx?: string;
      alipay?: string;
    };
  };

  /** 病历查询 */
  CASE_HISTORY_CONFIG: {
    //  列表页tab
    tab: IOptions[];
    // 门诊病历详情底部按钮
    clinicDetailBtns: IOptions<'preview' | 'down'>[];
  };

  /** 健康咨询 */
  HEALTH_COUNSEL: {
    // '' 咨询  '1' 视频
    listTopTab: IOptions<'' | '1'>[];
  };

  /** 自助开单 */
  selfBilling: {
    footerBtn?: TButtonConfig;
  };

  /** 电子导诊单 */
  Electronic_Consultation_Sheet: {
    toLocationMiniProgram?: {
      appId: string;
      path: string;
      // 会拼接到path中, 但需要取点击到当前行中存在的数据
      myExtraData: BaseObject;
    };
  };
}

type TInsertEnv<T extends BaseObject, S extends keyof any> = {
  [K in keyof T]: T[K] & { [P in S]?: T[K] };
};

export type ISystemConfig = TInsertEnv<ISystemConfig_, TConfigEnv>;

export interface IHosInfo {
  address: string;
  aliasName: string;
  hosId: string;
  hosName: string;
  hosLevel: number;
  hosLevelName: string;
  hosPhoto: string;
  hosType: string;
  ifClick: string;
  intro: string;
  sender: string;
  senderAddress: string;
  senderPhone: string;
  distance?: number; // 距离 （m）
  distanceFormat?: string; // 距离 （km）
  gisLat?: number; // 经度
  gisLng?: number; // 纬度
  label: string;
  value: string;
}

export type TBannerConfigBase = {
  src: `http${string}`;
  /** 会添加到path 后面的 query 里面 */
  extraData?: BaseObject;
  /** h5 跳转完整路径 其他跳转 如 home/my */
  path: string;
  /** 我们的 h5 (v3) 跳自己h5 必设置(参数加密.....) */
  isSelfH5?: '1';
  /**  固定的附加参数(动态值) 键值为新的键名 */
  addition?: {
    token?: string;
    patientId?: string;
    cardNumber?: string;
    herenId?: string;
  };
};

type TBannerConfigH5 = {
  type: 'h5';
  isLocal?: '1'; // 当他不存在
} & TBannerConfigBase;

type TBannerConfigSelf = {
  type: 'self';
} & TBannerConfigBase;

type TBannerConfigOtherProgram = {
  type: 'otherProgram';
  appId: string;
} & TBannerConfigBase;

export type TBannerConfig = XOR<
  TBannerConfigOtherProgram,
  XOR<TBannerConfigSelf, TBannerConfigH5>
>;

export type TButtonConfig = Omit<TBannerConfig, 'src'> & {
  text: string;
};

/** 挂号记录*/
type TRegListButtonItem = {
  /** 哪些环境显示, 不配全显 */
  env?: ('wx' | 'alipay' | 'h5')[];
  /** 哪些状态时候显示, 不配全显 */
  orderStatus?: string[];
} & TButtonConfig;

export interface IRegSearchHistoryItem {
  label: string;
  hot?: '1'; // 标记 🔥
}

export interface IConfigTab {
  label: string;
  value: string;
}

export interface IReportConfigTab {
  headerType: string;
  headerName: string;
  typeId: number;
}

type TMedRecordSfz = 'front' | 'end' | 'handler' | 'handlerBack' | 'hkb';
