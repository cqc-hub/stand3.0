import { hosData } from './utils';
export type StyleConfigType = {
  transition: boolean;
  showHeader: boolean;
  isMessage: boolean;
  simpleHeadInit?: boolean;
  historyMess?: boolean;
  headerLineMenu?: string; // 'back' | 'homePage' | 'none'
};

export type MsgListType = {
  msgLoad?: boolean;
  my?: boolean;
  msg?: string;
  type: number;
  boldMsg?: string;
  requestId?: string;
  addRessList?: any[];
  addRessInfo?: object;
  homeMenuConfig?: any[];
  firstCommendList?: any[];
  imgUrl?: string;
  isSysAppMore?: boolean;
  chatId?: string;
  hosData?: string;
};

export type MsgStatusType = {
  msgLoad: boolean;
  lastChatId?: string;
  requestId?:string;
  msg?: string;
  focus: boolean;
};

export type MessFormListType = {
  appointmentTime?: string;
  areaId?: string;
  areaName?: string;
  cardNumber?: string;
  categorName?: string;
  date?: string;
  deptId?: string;
  deptName?: string;
  docId?: string;
  docName?: string;
  hosId?: string;
  hosName?: string;
  orderId?: string;
  visitNo?: string;
  a?: string;
  b?: string;
  c?: string;
  orderStauts?: string;
  statusName?: string;
  statusDesciption?: string;
  gisLng?: string;
  gisLat?: string;
  address?: string;
};
export enum OrderStatusName {
  orderStatus_000 = '预约成功',
  orderStatus_001 = '取号成功',
  orderStatus_011 = '已就诊',
  orderStatus_111 = '缴费成功',
}

export enum OrderStatusDescript {
  orderStatus_000 = '预约成功,请在就诊前完成缴费取号。',
  orderStatus_001 = '取号成功,请前往诊区签到。',
  orderStatus_011 = '已就诊,请及时缴费。',
  orderStatus_111 = '缴费成功，请前往检查取药。',
}

export type ChunkStatusType = {
  isWXStreamApi: boolean;
  isTyping: boolean;
  chunkTemp: string;
  newMessage?: any;
};
export class TaskQueue {
  queue: any[];
  isRunning: boolean;
  constructor() {
    this.queue = []; // 任务队列
    this.isRunning = false; // 标记是否正在执行任务
  }

  // 添加任务到队列
  addTask(task, ...args) {
    this.queue.push({ task, args });
    if (!this.isRunning) {
      this.run(); // 如果当前没有任务在执行，则启动任务执行
    }
  }
  clearTask() {
    this.queue = [];
  }

  // 执行任务
  async run() {
    this.isRunning = true; // 标记为正在执行
    while (this.queue.length > 0) {
      const taskItem = this.queue.shift(); // 取出队列中的第一个任务
      try {
        await taskItem.task(...taskItem.args); // 执行任务并等待完成
      } catch (error) {
        console.error('添加失败:', error);
      }
    }
    this.isRunning = false; // 标记为执行完成
  }
}
