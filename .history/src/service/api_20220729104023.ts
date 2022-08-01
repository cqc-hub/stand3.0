import service from './index'

interface IResData<T> {
  code: string;
  message: string;
  respCode: string;
  result: T;
  timeTaken: number;
}

// json形式
const options = {
  header: { contentType: 'application/json' }
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