export type ApiParamsConfig = {
  // 健康档案
  HealthRecord: {
    // pagesC/healthRecord/healthRecordDetail
    tabs?: { name: string; key: string }[];
  };

  // 便民服务  pagesC/convenienceService/convenienceService
  ConvenienceService: {
    isOpenTopBtnOrder?: '1'; // 顶部 我的订单 按钮
  };

  // 小程序登录相关
  Login: {
    // 本系统不需要完善
    isSkipPerfect?: '1';
    // 支付宝, 自主开发模式(默认代开发)
    isAliIndependentDev?: '1';
    // 支付宝, 仅手机号授权(无身份证)
    isAliAuthBase?: '1';
  };
};
