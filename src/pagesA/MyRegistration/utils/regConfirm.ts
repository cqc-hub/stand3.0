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
  schDate: string;
  schId: string;
  schQukCategor: string;
  clinicalType: string;
  promptMessage?: string; // 就诊提示
  thRegisterId?: string;
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
