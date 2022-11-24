//获取住院信息 入参类型
export interface getInHospitalInfoParam {
  cardNumber?: string;
  hosId?: string;
  idCard?: string;
  patientId: string;
  patientName?: string;
  patientPhone?: string;
  phoneNumber?: string;
  sysCode: string;
}
//获取住院信息 出参类型
export interface getInHospitalInfoResult {
  accountBalance?: string;
  beHosDate?: string;
  clinicDiagnosis?: string;
  costTypeCode?: string;
  costTypeName?: string;
  defrayFee?: string;
  hosId?: string;
  hosName?: string;
  hosOrderState?: string;
  inHospitalId?: string;
  inpatientBed?: string;
  inpatientWard?: string;
  insuranceFee?: string;
  needPay?: string;
  orderBedDept?: string;
  patientName?: string;
  prepaidCost: string;
  queryDate?: string;
  sex?: string;
  sexCode?: string;
  timesHospitalization?: string;
  totalCost?: string;
  treatDoc?: string;
  visitNo?: string;
}
//获取住院费用日清单列表
export interface dailyParam {
  inHospitalId?: string;
  patientId: string;
  sysCode: string;
  timesHospitalization?: string;
  hosId?: string;
}

//获取住院费用日清单列表 出参
export interface dailyResult {
  date?: string;
  costSecondaries?: dailyList[];
  hospitalPay?: dailyList[];
}
export interface dailyList {
  hosName?: string;
  costListResultList: dailySecList[];
}
export interface dailySecList {
  cost?: string;
  costDate?: string;
  hosId?: string;
  hosName?: string;
  inHospitalId?: string;
  moneyType?: string;
  payTime?: string;
  paymentAmount?: string;
}
//创建住院订单 出参
export interface payOrderResult {
  phsOrderNo: string;
}
//和仁支付 入参
export interface payParam {
  hosId: string;
  patientId: string;
  phsOrderSource: string;
  source: string;
  sysCode: string;
  totalFee: string;
}
