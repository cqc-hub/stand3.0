
export interface IRequest extends UniApp.RequestOptions {
  hideLoading?: boolean;
  hideMessage?: boolean;
}
interface IdDtaType {
  code: number;
  message: string;
  respCode: number;
  timeTaken: number;
}

interface IResponse extends UniApp.RequestSuccessCallbackResult {
  data: IdDtaType;
}
export interface IResponseWrapper<T = any> {
  options?: IRequest,
  res: IResponse;
}

