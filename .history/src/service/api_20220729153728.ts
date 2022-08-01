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

// 参数的额外配置
const options = {
  // 系统长信息协议详情
  getSysAppMore: <T = ISysAppMore>(data: any) =>
    //  req.post('/phs-base/sysCode/getSysAppMore', parm(data)),
    service.get('/phs-base/sysCode/getSysAppMore', data)
}

/**
 * @method 接口
 */
// 基础服务
const baseApi = {

}
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

export default { ...baseApi, ...queryApi, ...regApi };