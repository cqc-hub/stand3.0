import service from './index'

interface IResData<T> {
  code: string;
  message: string;
  respCode: string;
  result: T;
  timeTaken: number;
}

interface ISysAppMore {
  content: string;
  title: string;
}


/**
 * @method 接口
 */
export function testGet(data: any) {
  return service.get('/testGet', data)
}

export function testPost(data: any) {
  return service.post('/testPost', data, options)
}

export function testPut(data: any) {
  return service.post('/testPut', data)
}

export function testDelete(data: any) {
  return service.delete('/testDelete', data)
}


// 查询服务
const queryApi = {
  // 获取填写过问卷
  getRiskCode<T = any>(data): Promise<IResData<T>> {
    return req.post('/phs-query/escort/getRiskCode', parm(data));
  },

  // 发送产科问卷
  sendQuestionnaireInfo<T = any>(data): Promise<IResData<T>> {
    return req.post('/phs-query/hospital/sendObstetricsQuestionnaire', parm(data));
  },
};