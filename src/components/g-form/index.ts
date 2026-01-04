import { XOR } from '@/typeUtils/obj';
import {
  ServerStaticData,
  generateUuid,
  wait,
  type ISystemConfig,
} from '@/utils';
import { computed, ref } from 'vue';

type TInputType =
  | 'text'
  | 'textarea'
  | 'password'
  | 'number'
  | 'idcard'
  | 'digit';

export interface ISelectOptions {
  label: string;
  value: any;
  [key: string]: any;

  children?: ISelectOptions[];
}

export interface IRule {
  rule: RegExp;
  message: string;
}

/**
 * rowStyle: 'margin-bottom: 16rpx;'
 */
interface IBaseInstance {
  key: string;
  label: string;
  subLabel?: string;
  placeholder?: string;
  required?: boolean;
  showRequireIcon?: boolean;
  ocr?: boolean;
  ocrDisabled?: boolean;
  emptyMessage?: string;
  disabled?: boolean;
  rule?: IRule | IRule[];
  showSuffixArrowIcon?: boolean;
  rowStyle?: string | BaseObject;
  showBodyStyle?: string;
  labelStyle?: string | BaseObject;
  bodyStyle?: string | BaseObject;
  isHideRowBorder?: boolean;
  labelWidth?: string;
  isForShow?: boolean;
  direction?: 'vertical' | 'horizontal';
  validator?: (
    v: any,
    item: TInstance,
    formData: BaseObject
  ) => Promise<
    | {
        success: false;
        message: string;
      }
    | {
        success: true;
        message?: string;
      }
  >;
  inputMask?: (v: string, item: TInstance) => string;
}

interface IInputInstance extends IBaseInstance {
  field: 'input-text';
  inputType?: TInputType;
  maxlength?: number;
}

export interface ISwitchInstance extends IBaseInstance {
  field: 'switch';
  /**
   *  对齐方式 默认 右对齐
   */
  align?: 'left' | 'right';
  labelFormatter?: (v: boolean) => any;
}

/**
 * 一组最多一个验证码
 *
 * verifySecond  倒计时 s
 * submitVerify 自定义发送短信
 */
export interface IInputVerifyInstance extends Omit<IInputInstance, 'field'> {
  field: 'input-verify';
  verifyBtnText: string;
  verifySecond: number;
  submitVerify?: (phone: string) => Promise<any>;
  phoneKey: string;
}

/**
 * @autoOptions 快速获取服务器上的静态列表数据
 */
export interface ISelectInstance extends IBaseInstance {
  field: 'select';
  options: ISelectOptions[];
  autoOptions?:
    | string
    | 'nationTerms'
    | 'patientTypeTerms'
    | 'idTypeTerms'
    | 'countries';
  filterOptions?: (
    options: ISelectOptions[],
    search: string
  ) => ISelectOptions[];
}

interface IAddressInstance extends IBaseInstance {
  field: 'address';
  options?: ISelectOptions[];
}

interface ITimePickerInstance extends IBaseInstance {
  field: 'time-picker';
  type: 'date' | 'daterange' | 'datetime' | 'datetimerange';
  start?: string | number;
  end?: string | number;
}

export interface IImgInstance extends IBaseInstance {
  field: 'file-image';
  imgLimit?: number;
}

export type TInstance =
  | IImgInstance
  | IInputInstance
  | ISelectInstance
  | IAddressInstance
  | IInputVerifyInstance
  | ITimePickerInstance
  | ISwitchInstance;

export type TAddress = {
  divisionType: '1' | '2' | '3'; // 1.省、2.市、3.县
  postalCode: string;
  upDivision: string;
  pyCode: string;
  id: string;
  uuid: string;
} & IOptions;

export const useAddress = () => {
  const addressMap = new Map<string | undefined, TAddress[]>();
  const provinces = ref(<TAddress[]>[]);
  const citys = ref(<TAddress[]>[]);
  const areas = ref(<TAddress[]>[]);
  const addressLoading = ref(false);
  const refAddressPicker = ref(<any>'');
  const personConfig = ref(<ISystemConfig['person']>{});
  const addressList = computed(() => [
    provinces.value,
    citys.value,
    areas.value,
  ]);

  const cacheData = (list, uuid?: string) => {
    if (list?.length) {
      addressMap.set(uuid, list);
    }
  };

  const _getList = async (payload = {} as TAddress) => {
    const listHis = addressMap.get(payload?.uuid);
    const { divisionType } = payload;
    if (listHis) {
      return listHis;
    }

    const list = await ServerStaticData.getAddressByLevel(
      payload?.id || '',
      divisionType as any
    );

    list.map((o) => {
      o.uuid = generateUuid();
    });

    cacheData(list, payload?.uuid);

    return list;
  };

  const getProvinces = async () => {
    personConfig.value = await ServerStaticData.getSystemConfig('person');
    citys.value = [];
    areas.value = [];
    await wait(80);
    const list = await _getList();
    provinces.value = list;
    personConfig.value?.defaultAddress?.provinces &&
      (provinces.value = moveObjectToFirstByNameInPlace(
        list,
        personConfig.value?.defaultAddress?.provinces
      ));

    if (list.length) {
      await getCitys(list[0]);
    }
  };

  const getCitys = async (payload: TAddress) => {
    citys.value = [];
    areas.value = [];
    const list = await _getList(payload);
    citys.value = list;
    personConfig.value?.defaultAddress?.citys &&
      (citys.value = moveObjectToFirstByNameInPlace(
        list,
        personConfig.value?.defaultAddress?.citys
      ));
    if (list.length) {
      refAddressPicker.value?.setColumnValues(1, list);
      await getAreas(list[0]);
    }
  };

  const getAreas = async (payload: TAddress) => {
    areas.value = [];
    const list = await _getList(payload);
    if (list.length) {
      areas.value = list;
      personConfig.value?.defaultAddress?.areas &&
        (areas.value = moveObjectToFirstByNameInPlace(
          list,
          personConfig.value?.defaultAddress?.areas
        ));
      refAddressPicker.value?.setColumnValues(2, list);
    }
  };

  const getAddressList = async (payload?: TAddress) => {
    const { divisionType } = payload || {};

    addressLoading.value = true;
    if (!payload) {
      if (provinces.value.length) {
        addressLoading.value = false;
        return;
      }
      await getProvinces();
    } else {
      if (divisionType === '1') {
        await getCitys(payload);
      } else if (divisionType === '2') {
        await getAreas(payload);
      }
    }

    addressLoading.value = false;
  };
  const moveObjectToFirstByNameInPlace = (arr, nameValue) => {
    const index = arr.findIndex((obj) => obj.label === nameValue);
    if (index !== -1) {
      const [target] = arr.splice(index, 1);
      arr.unshift(target);
    }
    return arr;
  };

  const init = async () => {
    await getProvinces();
  };

  return {
    provinces,
    citys,
    areas,
    addressList,
    addressLoading,
    getAddressList,
    refAddressPicker,
    init,
  };
};
