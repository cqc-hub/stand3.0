export type StyleConfigType = {
  transition: boolean;
  showHeader: boolean;
  isMessage: boolean;
  simpleHeadInit?: boolean;
  historyMess?: boolean;
};

export type MsgListType = {
  msgLoad?: boolean;
  my?: boolean;
  msg?: string;
  type: number;
  boldMsg?: string;
  requestId?: string;
  addRessList?: any[];
  addRessInfo?: object;
  homeMenuConfig?: any[];
  firstCommendList?: any[];
  imgUrl?: string;
};

export type MsgStatusType = {
  msgLoad: boolean;
  lastChatId?: string;
  msg?: string;
  focus: boolean;
};

export type MessFormListType = {
  appointmentTime?: string;
  areaId?: string;
  areaName?: string;
  cardNumber?: string;
  categorName?: string;
  date?: string;
  deptId?: string;
  deptName?: string;
  docId?: string;
  docName?: string;
  hosId?: string;
  hosName?: string;
  orderId?: string;
  visitNo?: string;
  a?: string;
  b?: string;
  c?: string;
  orderStauts?: string;
  statusName?: string;
  statusDesciption?: string;
  gisLng?: string;
  gisLat?: string;
  address?: string;
};
export enum OrderStatusName {
  orderStatus_000 = '预约成功',
  orderStatus_001 = '取号成功',
  orderStatus_011 = '已就诊',
  orderStatus_111 = '缴费成功',
}

export enum OrderStatusDescript {
  orderStatus_000 = '预约成功,请在就诊前完成缴费取号。',
  orderStatus_001 = '取号成功,请前往诊区签到。',
  orderStatus_011 = '已就诊,请及时缴费。',
  orderStatus_111 = '缴费成功。',
}
