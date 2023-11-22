export type TTakeNumberListItem = {
  deptName: string;
  docName: string;
  reportFlag: '0' | '1'; // 0-待取号 1-已取号
  ampmName: string;
  ampm: string;
  visitDate: string;
  timeDesc: string;
  signIn: boolean; // 是否允许签到
  visitId: string;
  queueNum: string;
  hosId: string;
  qrValue?: string;
};

export type _TTakeNumberListItem = {
  signIn: boolean; // 是否允许签到
  status: boolean; // 已签到?
  disabled?: boolean;
  uuid: string;
  label: string;
};
