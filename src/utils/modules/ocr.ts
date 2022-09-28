import { useMessageStore } from '@/stores/modules/globalMessage';
import { useGlobalStore } from '@/stores/modules/global';
import { ServerStaticData } from './serverStaticData';
import { ISelectOptions } from '@/components/g-form';
import api from '@/service/api';

type GreaterThan<
  T extends number,
  U extends number,
  R extends any[] = []
> = T extends R['length']
  ? false
  : U extends R['length']
  ? true
  : GreaterThan<T, U, [...R, 1]>;

type TChooseImgBase64Res =
  | {
      success: true;
      base64: string;
    }
  | {
      success: false;
      evt: any;
    };

const wxDownFileToLocal = function (url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      success(e) {
        const { tempFilePath } = e;
        resolve(tempFilePath);
      },

      fail(e) {
        reject(e);
      },
    });
  });
};

const getWeChatBase64ImageByUrl = function (
  url: string
): Promise<TChooseImgBase64Res> {
  return new Promise(async (r, j) => {
    // 确认是本地是还是网络的url
    if (url.startsWith('http')) {
      const _url = await wxDownFileToLocal(url);

      if (_url) {
        url = _url;
      }
    }

    wx.getFileSystemManager().readFile({
      filePath: url, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: ({ data }) => {
        r({
          success: true,
          base64: data,
          // base64: 'data:image/jpg;base64,' + data
        });
      },
      fail: (evt) => {
        j({
          success: false,
          evt,
        });
      },
    });
  });
};

const checkFileSize = ({
  filePath,
  fileSize,
}: {
  filePath: string;
  fileSize: number;
}) => {
  const messageStore = useMessageStore();

  return new Promise((resolve, reject) => {
    uni.getFileInfo({
      filePath,
      fail: reject,
      complete: (res) => {
        const { size } = res;

        if (size < fileSize) {
          resolve(res);
        } else {
          // showMessage('请选择小于 2M 的相片');
          const str = `请选择小于 ${(fileSize / 1024 / 1024).toFixed(
            1
          )}M 的相片`;
          messageStore.showMessage(str);
          reject(str);
        }
      },
    });
  });
};

// 获取 base64
export const chooseImg = (
  payload: Partial<{
    extension: ('jpg' | 'jpeg' | 'image')[];
    fileSize?: number;
  }> = {}
): Promise<TChooseImgBase64Res> => {
  const { extension, fileSize } = payload;

  return new Promise((resolve, reject) => {
    uni.chooseImage({
      extension,
      count: 1,
      sizeType: 'compressed',
      async success(e) {
        const { tempFilePaths, tempFiles } = e;

        if (tempFilePaths.length) {
          if (fileSize) {
            await checkFileSize({
              filePath: tempFilePaths[0],
              fileSize,
            });
          }

          // #ifdef MP-WEIXIN
          return resolve(await getWeChatBase64ImageByUrl(tempFilePaths[0]));
          // #endif

          reject({
            success: false,
            evt: '当前只有微信',
          });
        } else {
          reject({
            success: false,
            evt: '获取图片失败',
          });
        }
      },

      fail() {},
    });
  });
};

const ocrForWX = async () => {
  const globalStore = useGlobalStore();
  const e = await chooseImg({
    extension: ['image', 'jpeg', 'jpg'],
    fileSize: 2 * 1024 * 1024,
  });

  if (e.success) {
    const requestData = {
      source: globalStore.browser.source,
      fileName: 'cssc',
      base64: e.base64,
    };

    await api.ocrIdCard(requestData);
  } else {
    throw new Error(e.evt);
  }
};

const findSuccess = async ({ name, sex, nation, birth, idCard, address }) => {
  if (nation) {
    if (!nation.includes('族')) {
      nation += '族';
    }
  }

  console.log({
    name,
    sex,
    nation,
    birth,
    idCard,
    address,
  });

  const { result } = await api.getAddress({
    allAddress: address,
  });

  if (result && Object.keys(result).length) {
    const { city, county, detailedAddress, province } = result;
    const allAddressListData = await ServerStaticData.getAddressData();

    const provinceItem = allAddressListData.find((o) => o.label === province);
    if (provinceItem) {
      const cityItem = provinceItem.children?.find((o) => o.label === city);
      result.lastAddressItem = provinceItem;
      if (cityItem) {
        result.lastAddressItem = cityItem;
        const countyItem = cityItem.children?.find((o) => o.label === county);
        if (countyItem) {
          result.lastAddressItem = countyItem;
        }
      }
    }
  }

  return {
    name,
    sex,
    nation,
    birth,
    idCard,
    address,
    findResult: result as {
      city: string;
      county: string;
      detailedAddress: string;
      province: string;
      lastAddressItem?: ISelectOptions;
    },
  };
};

const ocrForAlipay = async () => {
  const messageStore = useMessageStore();

  const { readIDCard, IDCardTypes } = requirePlugin('ocrPlugin');
  const bizId = 'emblem';

  const res = await readIDCard({ bizId, type: IDCardTypes.FRONT });
  const { error, data } = res;

  if (error) {
    const msg = error.errorMessage;
    if (msg && typeof msg === 'string') {
      messageStore.showMessage(error.errorMessage, 1500);
    }

    return Promise.reject(error);
  } else {
    const { name, sex, nationality, birth, num: idCard, address } = data;

    return await findSuccess({
      name: name.data,
      sex: sex.data,
      nation: nationality.data,
      birth: birth.data,
      idCard: idCard.data,
      address: address.data,
    });
  }
};

type TGetPromiseType<T> = T extends Promise<infer R> ? R : any;
export type OcrFindRes = TGetPromiseType<ReturnType<typeof findSuccess>>;

export const useOcr = async (): Promise<OcrFindRes> => {
  const messageStore = useMessageStore();

  // #ifdef MP-WEIXIN
  await ocrForWX();
  // #endif

  // #ifdef MP-ALIPAY
  return await ocrForAlipay();
  // #endif
};
