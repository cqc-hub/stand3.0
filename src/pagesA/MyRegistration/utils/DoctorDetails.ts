import api from '@/service/api';
import { GStores } from '@/utils';
import { TSchInfo } from './index';

export interface ICommentItem {
  adviseForDoc: string;
  createTime: string;
  deptName: string;
  docEvlContentList: number[];
  docGrade: number;
  docName: string;
  patName: string;
}

export interface IProps {
  deptName: string;
  docName: string;
  hosDocId: string;
  hosId: string;
  clinicalType: string;
  docTitleName?: string;
  hosDeptId: string;
  q?: string;
}

export interface IDocDetail {
  academicAchievements: string;
  collectState: string;
  deptName: string;
  docJobName: string;
  docName: string;
  docPhoto: string;
  docTitleName: string;
  goodAt: string;
  hosDeptId: string;
  hosDocId: string;
  hosId: string;
  intro: string;
  clinicTime: string;
  hosName?: string;
  multiplePracticeLocation: string;
  preStatus?: '1';
}

export interface IDocSchListItem {
  schDate: string;
  schByHos: {
    [x: string]: TSchInfo[];
  };
  schByNetHos: {
    [x: string]: TSchInfo[];
  };

  schDateList: TSchInfo[];
}

export type TDocServiceItem = {
  checked: number;
  limitedQuantity: number;
  servicePrice: number;
  surplusCount: number;
  registerCategory: string;
  registerCategoryId: string;
};

export interface IDocService {
  jsonParam?: TDocServiceItem;
  pictureParam?: TDocServiceItem;
  phoneParam?: TDocServiceItem;
  videoParam?: TDocServiceItem;
}

const GetDocInfo = (): MethodDecorator => {
  return (target, propKey, desc) => {
    const originImpl = desc.value!;

    // @ts-expect-error
    desc.value = async function (...args: unknown[]) {
      // @ts-expect-error
      const res = await originImpl.apply(this, args);
      return res;
    };
  };
};

export class UseDoctorDetail extends GStores {
  docDetail = <IDocDetail>{};

  constructor(public props: IProps) {
    super();
  }

  async init() {
    await Promise.allSettled([this.getDoctorDetail()]);
  }

  @GetDocInfo()
  async getDoctorDetail() {
    const { deptName, docName, hosDeptId, hosDocId, hosId, docTitleName } =
      this.props;
    const { herenId } = this.globalStore;

    const args = {
      deptName,
      docName,
      hosDeptId,
      hosDocId,
      hosId,
      herenId,
      docTitleName,
    };

    const { result } = await api.findByDocId(args);
    result.hosDocId = result.hosDocId || hosDocId;
    this.docDetail = result;
    this.props.docName = docName;

    return this.docDetail;
  }

  async getDocSch(): Promise<IDocSchListItem[]> {
    const { clinicalType, docName, hosDeptId, hosDocId, hosId } = this.props;
    const { source } = this.globalStore.browser;

    const args = {
      clinicalType, // 4 网络
      docName,
      hosDeptId,
      hosDocId,
      hosId,
      source,
    };

    const { result } = await api.getDocSch(args);

    if (result && result.length) {
      result.map((schByDate) => {
        const { schDateList } = schByDate;

        const _cache: BaseObject = {};
        const _netHos: BaseObject = {};
        if (schDateList.length) {
          schDateList.map((o) => {
            const { hosId, clinicalType } = o;
            const cache = clinicalType == 4 ? _netHos : _cache;
            const schByHosId = cache[hosId];

            if (schByHosId) {
              schByHosId.push(o);
            } else {
              cache[hosId] = [o];
            }
          });
        }

        schByDate.schByHos = _cache;
        schByDate.schByNetHos = _netHos;
      });
    }

    return result;
  }
}
