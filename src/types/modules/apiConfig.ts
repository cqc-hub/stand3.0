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
    isRecordFlag?: '1'; //就诊记录页面是否展示协议
  };

  // 便民服务  pagesC/convenienceService/convenienceService
  ConvenienceService: {
    isOpenTopBtnOrder?: '1'; // 顶部 我的订单 按钮
  };

  // 杭口配置 pagesC/choosePat/choosePat
  ChoosePatJump: any;

  GlobalConfig: {
    // path[]  path 内的二维码支持刷新 码值固定通过接口 (rePat/patDynamicCode 院内患者ID加密动态码)
    refreshQrCode?: string[];
  };
};
