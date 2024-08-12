export interface ITab {
  typeId: string;
  typeName: string;
}
export interface ICms {
  createTime: string;
  informationLink: string;
  source: string;
  title: string;
  titleImg: string;
  typeId: string;
  typeName?: string;
  id: string;
  fileUrl?: string;
  isVideo?: number; // 当前视频的时长
}
