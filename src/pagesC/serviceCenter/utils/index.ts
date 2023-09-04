interface IComPlain {
  id: number;
  feedbackContent: string;
  replayState: '0' | '1'; // 1 已回复
  createTime: string;
}

export type TListComPlain = IComPlain[];
