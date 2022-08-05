export interface IExtend {
  login: String;
  patient: String;
}

export interface IPageRoute {
  path: String;
  style: any;
  extend: IExtend
}