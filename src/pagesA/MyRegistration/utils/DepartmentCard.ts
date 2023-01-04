export type TDeptItem = {
  deptName: string;
  id: string;
};

export type ListItem = TDeptItem & {
  deptList: TDeptItem[];
  showNo: number;
};
