export type TVisitRecord = {
  date: string;
  deptName: string;
  visitNo: string;
};

export const titleMap = {
  1: '门诊取号',
  2: '诊区签到',
  3: '门诊就诊',
  4: '门诊缴费',
  5: '检查项目',
  6: '检验项目',
  7: '其他项目',
  8: '门诊取药',
  9: '复诊签到',
} as const;

type TTitleMap = typeof titleMap;

export type TVisitInfo = {
  title: TTitleMap[keyof TTitleMap];
  appointmentTime: string;
  areaId: string;
  areaName: string;
  categorName: string;
  /** 完成状态 0未完成 1全部完成 */
  completionStatus: 0 | 1;
  docName: string;
  hosId: string;
  hosName: string;
  reportPlace: string;

  /** 门诊取药 */
  drugs: {
    itemName: string;
    itemAddress: string;
    disposeStatus: string;
    [key: string]: any;
  }[];

  /** 检验 */
  labs: {
    itemName: string;
    itemAddress: string;
    status: string;
    orderId: string;
    billDeptName: string;
    performDeptCode: string;
    reportPlace: string;
    isEmptyStomach: string;
    isDeptStorage: string;
    appointIndicator: string;
  }[];
  /** 检查 */
  exams: TVisitInfo['labs'];
  /** 其他 */
  others: TVisitInfo['labs'];
};
