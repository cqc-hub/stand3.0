export type StyleConfigType = {
  transition: boolean;
  showHeader: boolean;
  isMessage: boolean;
  simpleHeadInit?: boolean;
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
  imgUrl?:string;
};

export type MsgStatusType = {
  msgLoad: boolean;
  lastChatId?: string;
  msg?: string;
  focus: boolean;
};
