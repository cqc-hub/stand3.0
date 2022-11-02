import api from '@/service/api';
import { GStores } from '@/utils';

export interface IProps {
  deptName: string;
  docName: string;
  hosDocId: string;
  hosId: string;
  clinicalType: string;

  // firstHosDeptId: string;
  // secondHosDeptId: string;
  hosDeptId: string;
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
    const { deptName, docName, hosDeptId, hosDocId, hosId } = this.props;
    const { herenId } = this.globalStore;

    const args = {
      deptName,
      docName,
      hosDeptId,
      hosDocId,
      hosId,
      herenId,
    };

    const { result } = await api.findByDocId(args);
    this.docDetail = result;

    return this.docDetail;
  }

  async getDocSch() {
    const { clinicalType, docName, hosDeptId, hosDocId, hosId } = this.props;
    const { source } = this.globalStore.browser;

    const args = {
      clinicalType,
      docName,
      hosDeptId,
      hosDocId,
      hosId,
      source,
    };

    const { result } = await api.getDocSch(args);

    if (result && result.length) {
    }
  }
}
