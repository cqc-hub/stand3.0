export type TDeptItem = {
  deptName: string;
  id: string;
};

export type ListItem = TDeptItem & {
  deptList: TDeptItem[];
  showNo: number;
};

export type TDepartmentDocItem = {
  docName: string;
  docPhoto: string;
  docTitle: string;
  docTitleName: string;
  intro: string;
  showNo: string;
  hosDocId: string;
  isCharge: '0' | '1';
};

export type TDepartmentDetail = {
  deptId: string;
  deptName: string;
  deptPhoto: string;
  docList: TDepartmentDocItem[];
  netHosUrl: string;
  recommendation: string;
};
