export type ApiParamsConfig = {
  // 健康档案
  HealthRecord: {
    // pagesC/healthRecord/healthRecordDetail
    tabs?: { name: string; key: string }[];
  };


  // 便民服务  pagesC/convenienceService/convenienceService
  ConvenienceService: {
    isOpenTopBtnOrder?: '1'; // 顶部 我的订单 按钮
  }
};

