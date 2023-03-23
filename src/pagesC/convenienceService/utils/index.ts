export interface IServiceList {
  itemName: string;
  fee: string;
  tips: string;
  [propName: string]: any;
}

export interface IConfirmList {
  itemName: string;
  fee: string;
  tips: string;
  itemId: string;
  num: number;
  [propName: string]: any;
}
