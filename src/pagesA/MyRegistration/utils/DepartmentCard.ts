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
  hosDeptId: string;
  deptName: string;
  deptPhoto: string;
  docList: TDepartmentDocItem[];
  netHosUrl: string;
  recommendation: string;
};

export type THosItem = {
  hosId: string;
  hosName: string;
  hosIntroduce?: string;
};

export type hosListItem =  {
  hosInfoList: THosItem[];
  famousDoctorType: string;
  hosDeptIntroduce?: string;
};
