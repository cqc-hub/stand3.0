import { TButtonConfig } from './serverStaticData';

export type ApiParamsConfig = {
  HomeTabBar: {
    tabs: string[];
  };

  //pagesA/guide/guide
  GuideConfig: {
    // 检验下面按钮
    jyBtns: TGuideButtonConfig[];
    // 检查下面按钮
    jcBtns: TGuideButtonConfig[];
    // 门诊取号下面按钮
    mzqhBtns: TGuideButtonConfig[];
    // 门诊就诊下面的按钮
    mzjzBtns: TGuideButtonConfig[];
    // 诊区签到下面的按钮
    zqqdBtns: TGuideButtonConfig[];
    // 门诊取药下面按钮
    takeDrugBtns: TGuideButtonConfig[];
    // 门诊缴费下面按钮
    mzjfBtns: TGuideButtonConfig[];
    // 就诊完成下面按钮
    jzwcBtns: TGuideButtonConfig[];

    // 检查tip
    jcTip?: string;
    // 检验tip
    jyTip?: string;
    // 门诊取药 tip
    tabDrugTip?: string;
    // 门诊取号tip
    mzqhTip?: string;
    // 门诊签到 tip
    mzqdTip?: string;
    // 门诊就诊
    mzjzTip?: string;
    // 门诊缴费
    mzjfTip?: string;
    // 其他项目
    otherTip?: string;
    // 复诊签到
    fzqdTip?: string;
  };

  // 健康档案
  HealthRecord: {
    // pagesC/healthRecord/healthRecordDetail
    tabs?: { name: string; key: string }[];
    hotFeatures?: {
      label: string;
      ico: string;
      url: string;
      terminalType: string;
    }[];
    isRecordFlag?: '1';
  };

  // h5 页面中的公众号配置(目前主要是语音转文字配置)
  WxOfficialAccount: {
    appId: string;
  };

  // pagesC/queryCase/queryCase  病历查询
  CASE_HISTORY_CONFIG: {
    // 列表页 tab 0 门诊病历 1 出院小结
    tab?: { label: string; value: '0' | '1' }[];

    /** 门诊病历详情 */
    // 底部按钮
    clinicDetailBtns?: {
      value: 'preview' | 'down';
      label: string;
    }[];
    // 开放收藏按钮
    isOpenCollect?: '1';
  };

  // 便民服务  pagesC/convenienceService/convenienceService
  ConvenienceService: {
    isOpenTopBtnOrder?: '1'; // 顶部 我的订单 按钮
  };

  // 杭口配置 pagesC/choosePat/choosePat
  ChoosePatJump: any;

  // pagesC/myDoctor/myCollect 我的收藏
  MyCollect: {
    // 我的医生 2 我的报告 4 我的病历 5
    tabs: { label: string; value: 2 | 4 | 5 }[];
  };

  GlobalConfig: {
    // path[]  path 内的二维码支持刷新 码值固定通过接口 (rePat/patDynamicCode 院内患者ID加密动态码)
    refreshQrCode?: string[];
  };

  MedicalHelp: {
    // 目前只支持配置 value 值 0 待取药 1 已取药
    tabs: IOptions<'0' | '1'>[];
  };
};

// 陪诊页面使用
export type TGuideButtonConfig = TButtonConfig & {
  // 最小项状态
  labStatus?: string[];
  // 历史才有 1 未执行 2部分执行 3已执行
  disposeStatus?: string[];
  // 子项状态 1 已完成  历史中是 -1
  completionStatus?: number[];
  // 其他状态
  otherStatus?: IOptions<any[]>[];

  // 按钮样式
  btnClass?: string;
};
