export type TTakeNumberListItem = {
  categorName?: string;
  deptName: string;
  docName: string;
  reportFlag: any; // 0-待取号 1-已取号 2 无需取号,  在线签到情况直接展示(string)
  ampmName: string;
  ampm: string;
  visitDate: string;
  timeDesc: string;
  signIn: boolean; // 是否允许签到
  visitId: string;
  queueNum: string;
  hosId: string;
  qrValue?: string;
  visitingArea?: string;
  extend?: any;
  tip?:string;
  ifPay:'1'|'0'
};

export type _TTakeNumberListItem = {
  signIn: boolean; // 是否允许签到
  status: boolean; // 已签到?
  disabled?: boolean;
  uuid: string;
  label: string;
};
