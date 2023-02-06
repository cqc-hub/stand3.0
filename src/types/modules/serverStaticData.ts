import { type XOR } from '@/typeUtils/obj';

// 未指定说明的 '0' 均为 false '1' true
export interface ISystemConfig {
  // 预约挂号
  order: {
    // 选择科室医生页面顶部可选择的天数， chooseDay > 20 出现组件 ‘日历’
    chooseDay: number;
    // 选择号源时候显示几列
    selOrderColumn: number;
    // 精确号源?
    isOrderBlur: '0' | '1';
    // 选科室上面 banner
    bannerOrder?: TBannerConfig;
    // 展示号源数不为空的，超过当前时间的号源是否展示
    isHideOutTimeOrderSource?: '0' | '1';
    // 预约挂号时候付钱?
    isOrderPay: '0' | '1';

    /** 医生名片 */
    // 对应网络医院那边维护的 hosId， 他们不用区分院区的吗？
    netHosId?: string; // isOpenDocCardOnlineService === '1' 时候必给
    // 开启在线服务?
    isOpenDocCardOnlineService?: '1';
    // 近一年大数据
    isOpenBigDataNearlyYear?: '1';
    // 评论
    isOpenComment?: '1';

    /** 挂号记录 */
    // 显示院内导航按钮? 挂号状态 string
    isHosNavigation?: string[];
    // 排队叫号?
    isQueuing?: string[];
    // 服务评价?
    isFWBtn?: string[];

    /** 搜索 */
    // 热门搜索
    hosRegHistory?: IRegSearchHistoryItem[];

    /** 门诊取号 */
    takeNumberQueueBtn?: '1'; // 门诊取号列表页面是否显示排队叫号入口按钮

  };

  /** 移动端伦理委员会(h5) */
  LUN_LI?: {
    isOpenGzzn?: '1'; // 是否开放规章指南
    isOpenWordDownload?: '1'; // 是否开放文档下载
    isOpenBSZN?: '1';  // 是否开放办事指南
  };

  // 就诊人
  person: {
    // 新增就诊人页面 (medicalCardMan/perfectReal)页面是否有 '就诊人类型' 一行
    isHidePatientTypeInPerfect?: '0' | '1';
    // 开启短信验证？ 完善时候没有
    isSmsVerify?: '0' | '1';
    // 新增、完善就诊人时候 根据监护人证件号（身份证）判断监护人（至少 guardianAge 岁）
    ageGuardian: number;
    // 新增、完善就诊人时候 根据 生日｜身份证 判断 新生儿（至多 ageChildren 月）
    ageChildren: number;

    // 新增就诊人页面有证件且证件类型 身份证时候  小于默认isGuardianWithIdCardAge(6)岁 是否监护人 ？
    isGuardianWithIdCard?: number;

    ocr?: '0' | '1';
    isFace?: '1';
  };

  // 病案
  medRecord: {
    // 身份证上传要求 （人像、 背面、 手持）
    sfz: TMedRecordSfz[]; // 后端说 人像、 背面 必填 设置时候每次都加下
    isOcrSfz?: '1'; // sfz 配置中 front 的进行 ocr认证
    requireSfz?: string[]; // 不配置时候 sfz 中所有图片必须上传, 配置时候对应字段必须上传 可以使用 ['front|hkb'] 这样的格式
    purpose?: string[]; // 复印目的 不配置使用原来的那几个目的
    selPurposeLen?: number; // 可选择的复印目的长度 默认 3
    isPurposeRadio?: '1'; //目的有没有份数可以选择

    // 收钱方式 0 预收 1 按项目、目的
    isItemCount?: '0' | '1';

    // 收钱方式预收的金额 ｜ 单个项目金额
    fee: number;
    hosId: string;

    // 是否支持自定义住院记录
    isCustomPatRecord?: '0' | '1';

    // 手动添加记录里面是否可以切换院区
    isToggleHos?: '0' | '1';
  }[];

  //住院服务
  hospitalCare: {
    //顶部tab
    tab: IConfigTab[];
    //配置的预缴金额 [500,1000,2000,3000,5000,10000]
    inPatientPrePay: string[];
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
    // 可以切换院区?
    isListToggleHos?: '1';

    // 门诊类型  网络医院/线下门诊 (是否展示)
    isListShowClinicType?: '1';
    // 待缴费点击缴费时候提示的协议编号 (不配没有)
    confirmPayFg?: string;
    // 已缴费底部的按钮
    payedFooterBtn?: TButtonConfig;
    // 预结算
    isPreSettle?: '1';
    // 申请退单
    isOpenChargeback?: '1';
    // 扫码缴费是否隐藏列表金额
    isScanListHideMoney?: '1';

    // 页面顶部 banner
    bannerPay?: TBannerConfig;

    /**
     * 详情页
     */

    // 待缴费详情页面 的费用总额是否可以让用户选择缴费
    isSubitemPay?: '1';
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
  };

  // 药品配送
  drugDelivery: {
    company?: IOptions[];
  };
}

export interface IHosInfo {
  address: string;
  aliasName: string;
  hosId: string;
  hosName: string;
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
  extraData?: BaseObject;
  path: string; // h5 跳转完整路径 其他跳转 如 home/my
  isSelfH5?: '1'; // 我们的 h5 (v3) 跳自己h5 必设置(参数加密.....)
  addition?: {
    token?: string;
    patientId?: string;
    herenId?: string;
  }; // 固定的附加参数(动态值) 键值为新的键名
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
}

type TMedRecordSfz = 'front' | 'end' | 'handler' | 'hkb';
