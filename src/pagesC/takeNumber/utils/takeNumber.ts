export type TTakeNumberListItem = {
  deptName: string;
  docName: string;
  reportFlag: '0' | '1'; // 0-待取号 1-已取号
  ampmName: string;
  visitDate: string;
  timeDesc: string;
  signIn: boolean; // 是否允许签到
  visitId: string;
  queueNum: string;
};
