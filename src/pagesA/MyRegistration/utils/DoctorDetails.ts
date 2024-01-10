import { computed, ref } from 'vue';
import { GStores } from '@/utils';
import { TSchInfo } from './index';

import api from '@/service/api';

api.getExtHosDocSch = () =>
  Promise.resolve({
    result: [
      {
        schHosList: [
          {
            schDate: '2024-01-11',
            schDateList: [
              {
                deptName: '咽喉科专病门诊',
                goodAt: '暂无介绍',
                ampm: '1',
                hosDeptId: '7587',
                ampmName: '上午',
                hosId: '13028',
                schStateName: '正常',
                schDate: '2024-01-11',
                schId: '2692743',
                docName: '王吉喆',
                categorName: '专家门诊诊察费(市级名专家)',
                numHadReg: '24',
                schState: '0',
                intro: '暂无介绍',
                categor: '专家',
                hosDocId: '260',
                numRemain: '6',
                hosName: '大连二院钻石湾院区',
                docTitleName: '主任医师',
              },
            ],
          },
          {
            schDate: '2024-01-15',
            schDateList: [
              {
                deptName: '咽喉科专病门诊',
                goodAt: '暂无介绍',
                ampm: '1',
                hosDeptId: '7587',
                ampmName: '上午',
                hosId: '13028',
                schStateName: '正常',
                schDate: '2024-01-15',
                schId: '2702802',
                docName: '王吉喆',
                categorName: '专家门诊诊察费(市级名专家)',
                numHadReg: '9',
                schState: '0',
                intro: '暂无介绍',
                categor: '专家',
                hosDocId: '260',
                numRemain: '21',
                hosName: '大连二院钻石湾院区',
                docTitleName: '主任医师',
              },
              {
                deptName: '咽喉科专病门诊',
                goodAt: '暂无介绍',
                ampm: '2',
                hosDeptId: '7587',
                ampmName: '下午',
                hosId: '13028',
                schStateName: '正常',
                schDate: '2024-01-15',
                schId: '2702801',
                docName: '王吉喆',
                categorName: '专家门诊诊察费(市级名专家)',
                numHadReg: '1',
                schState: '0',
                intro: '暂无介绍',
                categor: '专家',
                hosDocId: '260',
                numRemain: '29',
                hosName: '大连二院钻石湾院区',
                docTitleName: '主任医师',
              },
            ],
          },
        ],
        hosId: '13028',
        hosName: '大连二院钻石湾院区',
      },
      {
        schHosList: [],
        hosId: '130218',
        hosName: '大连二院钻石湾院区222',
      },
      {
        schHosList: [
          {
            schDate: '2024-01-11',
            schDateList: [
              {
                deptName: '咽喉科专病门诊',
                goodAt: '暂无介绍',
                ampm: '1',
                hosDeptId: '7587',
                ampmName: '上午',
                hosId: '13028',
                schStateName: '正常',
                schDate: '2024-01-11',
                schId: '2692743',
                docName: '王吉喆',
                categorName: '专家门诊诊察费(市级名专家)',
                numHadReg: '24',
                schState: '0',
                intro: '暂无介绍',
                categor: '专家',
                hosDocId: '260',
                numRemain: '6',
                hosName: '大连二院钻石湾院区',
                docTitleName: '主任医师',
              },
            ],
          },
          {
            schDate: '2024-01-15',
            schDateList: [
              {
                deptName: '咽喉科专病门诊',
                goodAt: '暂无介绍',
                ampm: '1',
                hosDeptId: '7587',
                ampmName: '上午',
                hosId: '13028',
                schStateName: '正常',
                schDate: '2024-01-15',
                schId: '2702802',
                docName: '王吉喆',
                categorName: '专家门诊诊察费(市级名专家)',
                numHadReg: '9',
                schState: '0',
                intro: '暂无介绍',
                categor: '专家',
                hosDocId: '260',
                numRemain: '21',
                hosName: '大连二院钻石湾院区',
                docTitleName: '主任医师',
              },
              {
                deptName: '咽喉科专病门诊',
                goodAt: '暂无介绍',
                ampm: '2',
                hosDeptId: '7587',
                ampmName: '下午',
                hosId: '13028',
                schStateName: '正常',
                schDate: '2024-01-15',
                schId: '2702801',
                docName: '王吉喆',
                categorName: '专家门诊诊察费(市级名专家)',
                numHadReg: '1',
                schState: '0',
                intro: '暂无介绍',
                categor: '专家',
                hosDocId: '260',
                numRemain: '29',
                hosName: '大连二院钻石湾院区',
                docTitleName: '主任医师',
              },
            ],
          },
        ],
        hosId: '130238',
        hosName: '大连二院钻石湾院区333',
      },
    ],
    timeTaken: 6807,
    code: 0,
    functionVersion:
      '[{"functionType":"2","version":"V0.0.63"},{"functionType":"1","version":"V0.0.941"}]',
    innerMessage: '成功',
    message: '成功',
    respCode: 0,
  });

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

export interface IDocSchOutHosItem {
  enabledDays: Record<string, string>;
  hosId: string;
  hosName: string;
  schList: IDocSchListItem[];
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
      return await originImpl.apply(this, args);
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

  dealSchList(schList: IDocSchListItem[]) {
    let enabledDays: Record<string, string> = {};

    if (schList && schList.length) {
      schList.map((schByDate) => {
        const { schDateList } = schByDate;

        const _cache: BaseObject = {};
        const _netHos: BaseObject = {};
        if (schDateList.length) {
          schDateList.map((o) => {
            const { hosId, clinicalType } = o;
            const cache = clinicalType === '4' ? _netHos : _cache;
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

      const eDaysEnabled: string[] = [];
      const _enabledDays: Record<string, string> = {};

      schList.map((o) => {
        const { schDate } = o;

        o.schDateList.map((p, i) => {
          const { schState } = p;
          const enabledDaysValue = _enabledDays[schDate];

          if (enabledDaysValue !== '0') {
            _enabledDays[schDate] = schState;
          }
        });

        if (!eDaysEnabled.includes(schDate)) {
          eDaysEnabled.push(schDate);
        }
      });

      schList = schList;
      enabledDays = _enabledDays;
    }

    return { schList, enabledDays };
  }

  async getDocSch() {
    const { clinicalType, docName, hosDeptId, hosDocId, hosId } = this.props;
    const { source } = this.globalStore.browser;
    let schList: IDocSchListItem[] = [],
      enabledDays: Record<string, string> = {};

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
      const { schList: _schList, enabledDays: _enabledDays } =
        this.dealSchList(result);

      schList = _schList;
      enabledDays = _enabledDays;
    }

    return { schList, enabledDays };
  }

  async getOutHosSchData() {
    const { result } = await api.getExtHosDocSch({
      ...this.props,
      source: this.globalStore.browser.source,
    });

    console.warn(result);
    if (result && result.length) {
      result.map((o) => {
        const { schList, enabledDays } = this.dealSchList(o.schHosList);

        o.schList = schList;
        o.enabledDays = enabledDays;
      });
    }

    return <IDocSchOutHosItem[]>result;
  }
}
