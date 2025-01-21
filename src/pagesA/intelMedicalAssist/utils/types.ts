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
  visitNo: 'string';
};
