export type ApiParamsConfig = {
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
};
