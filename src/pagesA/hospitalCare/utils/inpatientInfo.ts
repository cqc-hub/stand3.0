//获取住院信息 入参类型
export interface getInHospitalInfoParam {
  cardNumber?: string;
  hosId?: string;
  idCard?: string;
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
  phoneNumber?: string;
  sysCode?: string;
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
  cardNumber?: string;
  patientNameDes?: string;
}
//获取住院费用日清单列表
export interface dailyParam {
  costType: string;
  inHospitalId?: string;
  patientId: string;
  sysCode: string;
  timesHospitalization?: string;
  hosId?: string;
}
//预缴记录
export interface hospitalPayResult {
  hospitalPayResultList: dailyList[];
}
//获取住院费用日清单列表 出参
// type IRoute = dailyResult;
export interface dailyResult {
  inHospitalDailyCostsResultList: dailyList[];
}
export interface dailyList {
  date: string;
  costSecondaries?: dailyLists[];
  hospitalPay?: dailyLists[];
}
export interface dailyLists {
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
  endTime?: string;
  startTime?: string;
  totalCost?: string;
}
//创建住院订单 出参
export interface payOrderResult {
  phsOrderNo: string;
  paySign: string;
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
export interface inHospitalCostInfoParam {
  costDay?: string;
  costType: string;
  hosId: string;
  hospitalId?: string;
  patientId: string;
  sysCode: string;
  timesHospitalization?: string;
  isHosTotallist?: string;
  isHosDaylist?: string;
  startTime?: string;
  endTime?: string;
}
export interface inHospitalCostInfo {
  balance?: string;
  //余额
  costDay?: string;
  //支付时间/创建时间
  costList: costList[];
  costTypeCode?: string;
  //费用分类编码
  costTypeName?: string;
  //费用分类名称
  deptId?: string;
  //入院科室编号
  deptName?: string;
  //入院科室名称
  hosName?: string;
  //院区
  hospitalDate?: string;
  //入院日期2015-07-01
  hospitalWard?: string;
  //住院病区
  inpatientBed?: string;
  //床位号
  inpatientNo?: string;
  //住院号
  patName?: string;
  //患者姓名
  patientId?: string;
  //院内患者ID
  prepaidPayment?: string;
  //预交金
  totalCost?: string;
  //总费用 
}
export interface costList {
  category?: string;
  //费用类别注射费、西药费、检查费等
  categoryCost?: string;
  //类别费用
  subCostList: subCostList[];
}
export interface subCostList {
  costName?: string;
  //费用名称
  quantity?: string;
  //数量
  unit?: string;
  //单位
  unitPrice?: string;
  //单价
  valuationAmount?: string;
  //计价金额
}
