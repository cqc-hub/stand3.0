export interface IDeptLv1 {
  firstDeptName: string;
  firstHosDeptId: string;
  firstRecommendation: string; // 科室推介信息
  firstShowNo: string;
  firstStandardDeptCode: string;
  firstStandardDeptName: string;
  isExpertDeptId: string; // 是否是专家科室（0否 1是） 是：按一级科室ID查询排班 否：按二级科室ID查询排班
  secondDeptList?: IDeptLv2[];
}

export interface IDeptLv2 {
  promptMessage: string; // 就诊提示
  remark: string;
  secondDeptName: string;
  secondHosDeptId: string;
  secondRecommendation: string; // 科室推介信息
  secondShowNo: string;
  secondStandardDeptCode: string; // 国标科室编码
  secondStandardDeptName: string; // 国标科室名称
  visitingArea: string; // 就诊地址
  thirdDeptList?: IDeptLv3[];
}

export interface IDeptLv3 {
  deptName: string;
  hosDeptId: string;
  promptMessage: string;
  recommendation: string;
  remark: string;
  showNo: string;
  standardDeptCode: string;
  standardDeptName: string;
  visitingArea: string;
}
