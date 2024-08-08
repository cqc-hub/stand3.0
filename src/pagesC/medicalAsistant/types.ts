import dayjs from 'dayjs';
export class HosGuideParams {
  endTime: string;
  startTime: string;
  patientId: string;
  visitNo?: string;
  type?: string;
  constructor(patientId: string, visitNo?: string, type?: string) {
    this.endTime = dayjs().format('YYYY-MM-DD');
    this.startTime = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    this.patientId = patientId;
    this.visitNo = visitNo;
    this.type = type;
  }
  setPat(pat) {
    this.patientId = pat;
  }
}
export interface GuideContent {
  list: any[];
  navigationCode: object;
  tabValue: string;
  disposeTime: string;
}
export interface HosGuideSheet {
  deptName: string;
  disposeTime: string;
  hosId: string;
  hosName: string;
  navigationCodeJson: string;
  clinicalType?: string;
  deptId?: string;
  visitNo?: string;
  processResultList?: Array<HosGuideList>;
}
export interface HosGuideList {
  deptName: string;
  address: string;
  billDeptName: string;
  appointIndicator?: string;
  appointTime?: string;
  beforeNum?: string;
  billDeptId?: string;
  clinicalType?: string;
  curNo?: string;
  deptId?: string;
  disposeStatus?: string;
  disposeTime?: string;
  hosId?: string;
  hosName?: string;
  isAppoint?: string;
  isDeptStorage?: string;
  isEmptyStomach?: string;
  itemName?: string;
  navigationCodeJson?: string;
  no?: string;
  orderClass?: string;
  orderId?: string;
  performDeptCode?: string;
  prescNo?: string;
  remark?: string;
  scheduledDateTime?: string;
  sortDate?: string;
  sortNum?: string;
  visitNo?: string;
  uuid?: string;
}
