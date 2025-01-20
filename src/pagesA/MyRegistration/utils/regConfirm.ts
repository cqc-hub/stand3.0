export interface IPageProps {
  disNo: string;
  numId: string;
  timeDesc: string;
  ampmName: string;
  ampm: string;
  categor: string;
  categorName: string;
  deptName: string;
  docName: string;
  docTitleName: string;
  docPhoto: string;
  fee: string;
  hosDeptId: string;
  hosDocId: string;
  hosId: string;
  visitingArea: string;
  schDate: string;
  schId: string;
  schQukCategor: string;
  clinicalType: string;
  promptMessage?: string; // 就诊提示
  thRegisterId?: string;
  addedNum?: number;
  /** 医生挂号验证方式 1:验证码 2:实名认证 */
  regVerificationMode?: '1' | '2';
  schState?: string;
}

export interface IPrePageProps
  extends Pick<
    IPageProps,
    | 'categorName'
    | 'fee'
    | 'deptName'
    | 'docName'
    | 'docPhoto'
    | 'docTitleName'
    | 'hosDeptId'
    | 'hosDocId'
    | 'hosId'
  > {
  categorNamePY: string;
  regNumber: string;
  residueNumber: string;
}
