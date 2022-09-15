import { defineStore } from 'pinia';

export interface IDeptLv1 extends IDeptLv3 {
  firstDeptName: string;
  firstHosDeptId: string;
  firstRecommendation: string; // 科室推介信息
  firstShowNo: string;
  firstStandardDeptCode: string;
  firstStandardDeptName: string;
  isExpertDeptId: string; // 是否是专家科室（0否 1是） 是：按一级科室ID查询排班 否：按二级科室ID查询排班
  secondDeptList?: IDeptLv2[];
  children?: IDeptLv2[];
}

export interface IDeptLv2 extends IDeptLv3 {
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
  children?: IDeptLv3[];
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

export const isLev1 = (item): item is IDeptLv1 => {
  return !!item.firstHosDeptId;
};

export const isLev2 = (item): item is IDeptLv2 => {
  return !!item.secondHosDeptId;
};

export const isLev3 = (item): item is IDeptLv3 => {
  return !!item.hosDeptId;
};

export const loopDeptList = (list: IDeptLv1[] | IDeptLv2[] | IDeptLv3[], deptListLevel) => {
  list.map((o) => {
    if (isLev1(o)) {
      const _list = o.secondDeptList;

      o.deptName = o.firstDeptName;
      o.hosDeptId = o.firstHosDeptId;
      o.recommendation = o.firstRecommendation;
      o.showNo = o.firstShowNo;
      o.standardDeptCode = o.firstStandardDeptCode;
      o.standardDeptName = o.firstStandardDeptName;

      if (_list && _list.length) {
        if (deptListLevel == 3 || deptListLevel == 2) {
          o.children = _list;
          loopDeptList(_list, deptListLevel);
        }
      }
    } else if (isLev2(o)) {
      const _list = o.thirdDeptList;

      o.deptName = o.secondDeptName;
      o.hosDeptId = o.secondHosDeptId;
      o.recommendation = o.secondRecommendation;
      o.showNo = o.secondShowNo;
      o.standardDeptCode = o.secondStandardDeptCode;
      o.standardDeptName = o.secondStandardDeptName;

      if (_list && _list.length) {
        if (deptListLevel == 3) {
          o.children = _list;
          loopDeptList(_list, deptListLevel);
        }
      }
    }
  });
};

const deptStore = defineStore('_dept', {
  persist: {
    key: '_dept',
    paths: []
  },

  state: () => {
    return {
      activeLv1: <IDeptLv1>{},
      activeLv2: <IDeptLv2>{},
      activeLv3: <IDeptLv3>{}
    };
  },

  actions: {
    changeActiveLv1(item: IDeptLv1) {
      this.activeLv1 = item;
    },

    changeActiveLv2(item: IDeptLv2) {
      this.activeLv2 = item;
    },

    changeActiveLv3(item: IDeptLv3) {
      this.activeLv3 = item;
    }
  }
});

export const useDeptStore = function () {
  return deptStore();
};
