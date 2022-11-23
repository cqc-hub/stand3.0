
export interface IRequest extends UniApp.RequestOptions {
  hideLoading?: boolean;
  showMessage?: boolean;
  isAuth?: boolean;
  baseURL?: string;
  monitorName?: string;
  reportCmPV_YLName?: string;
}
interface IdDtaType {
  code: number;
  message: string;
  respCode: number;
  timeTaken: number;
  functionVersion:string;
  signContent:string;
  result:any
}

interface IResponse extends UniApp.RequestSuccessCallbackResult {
  data: IdDtaType;
}
export interface IResponseWrapper<T = any> {
  options?: IRequest,
  res: IResponse;
}

