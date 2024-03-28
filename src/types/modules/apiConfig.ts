export type ApiParamsConfig = {
  // 健康档案
  HealthRecord: {
    // pagesC/healthRecord/healthRecordDetail
    tabs?: { name: string; key: string }[];
    hotFeatures?:{
      label: string,
      ico: string,
      url: string,
      terminalType: string,
    }[];
     isRecordFlag?: '1'; //就诊记录页面是否展示协议
  };

  // 便民服务  pagesC/convenienceService/convenienceService
  ConvenienceService: {
    isOpenTopBtnOrder?: '1'; // 顶部 我的订单 按钮
  };
};
