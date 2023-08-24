import globalGl from '@/config/global';
import { useGlobalStore, useMessageStore } from '@/stores';
import { ServerStaticData } from './serverStaticData';
import { ISelectOptions } from '@/components/g-form';
import api from '@/service/api';
import _env from '@/config/env';
import { XOR } from '../../typeUtils/obj';

type TChooseImgBase64Res = XOR<
  {
    success: true;
    base64: string;
  },
  {
    success: false;
    evt: any;
  }
>;

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

const getAliPayBase64ImageByUrl = function (
  imagePath,
  imgCanvas
): Promise<TChooseImgBase64Res> {
  // 支付宝需要手动添加
  /*
  const imgCanvas = ref({
    imgWidth: 0,
    imgHeight: 0,
  });

  <canvas
    v-show="false"
    :width="imgWidth"
    :height="imgHeight"
    style="opacity: 0; position: absolute;pointer-events: none;"
    id="canvasForBase64"
  />
  */

  return new Promise((resolve, reject) => {
    my.getImageInfo({
      src: imagePath,
      success: async (res) => {
        const { width, height } = res;

        imgCanvas.value.imgWidth = width;
        imgCanvas.value.imgHeight = height;
        let canvas = my.createCanvasContext('canvasForBase64');
        canvas.drawImage(imagePath, 0, 0, width, height); // 1. 绘制图片至canvas
        // 绘制完成后执行回调
        canvas.draw(false, async () => {
          let base64 = await canvas.toDataURL({
            width,
            height,
            quality: 1,
          });

          resolve({
            success: true,
            base64: base64.split(',')[1],
          });

          // base64 = base64.replace("data:image/png;base64,", "");
          // await this.uploadImageRequest(base64);
        });
      },

      fail(e) {
        resolve({
          success: false,
          evt: e,
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
  payload: {
    extension?: ('jpg' | 'jpeg' | 'image')[];
    fileSize?: number;
    imgCanvas?: any; // 支付宝必传
  } = {}
): Promise<TChooseImgBase64Res> => {
  // const imgCanvas = ref({
  //   imgWidth: 0,
  //   imgHeight: 0,
  // });

  const { extension, fileSize, imgCanvas } = payload;

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

          // #ifdef MP-ALIPAY
          return resolve(
            await getAliPayBase64ImageByUrl(tempFilePaths[0], imgCanvas)
          );
          // #endif

          reject({
            success: false,
            evt: '未定义的类型',
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

const ocrForWX = async (imageOutput = false) => {
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

    const { result } = await api.ocrIdCard<any>(requestData);

    if (result.type === 'Front') {
      const { address, idCard, nation, patientName, patientSex } = result;
      return await findSuccess({
        ...result,
        name: patientName,
        sex: patientSex,
        nation,
        address,
        idCard,
        image: e.base64,
      });
    } else {
      throw new Error('请使用身份证正面');
    }
  } else {
    throw new Error(e.evt);
  }
};

const findSuccess = async ({
  name,
  sex,
  nation,
  birth,
  idCard,
  address,
  image,
  idCardOcrEn,
  patientNameOcrEn,
}: {
  name: string;
  sex: string;
  nation: string;
  birth?: string;
  idCard: string;
  address: string;
  image?: string;
  idCardOcrEn?: string; // wx
  patientNameOcrEn?: string; // wx
}) => {
  if (nation) {
    if (!nation.includes('族')) {
      nation += '族';
    }
  }

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
    idCardOcrEn,
    patientNameOcrEn,
    image,
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

const ocrForAlipay = async (imageOutput = false) => {
  const messageStore = useMessageStore();
  const ocrPlugin = requirePlugin('ocrPlugin');

  if (!ocrPlugin) {
    messageStore.showMessage('请先在支付宝后台订购 ocr 插件', 3000);

    return;
  }

  const { readIDCard, IDCardTypes } = ocrPlugin;
  const bizId = 'emblem';

  const res = await readIDCard({
    bizId,
    type: IDCardTypes.FRONT,
    imageOutput: imageOutput ? 'global' : undefined,
  });
  const { error, data, image } = res;

  if (error) {
    const msg = error.errorMessage;
    if (msg && typeof msg === 'string') {
      messageStore.showMessage(error.errorMessage, 3000);
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
      image,
    });
  }
};

type TGetPromiseType<T> = T extends Promise<infer R> ? R : any;
export type OcrFindRes = TGetPromiseType<ReturnType<typeof findSuccess>>;

export const useOcr = async (imageOutput = false): Promise<OcrFindRes> => {
  // const messageStore = useMessageStore();

  // #ifdef MP-WEIXIN
  return await ocrForWX(imageOutput);
  // #endif

  // #ifdef MP-ALIPAY
  // @ts-expect-error
  return await ocrForAlipay(imageOutput);
  // #endif

  return Promise.reject('未定义的 ocr');
};

// 图片上传
export const upImgOss = (
  filePath: string,
  payload: {
    header?: BaseObject;
    data?: {
      // 问卷WJ,病案复印BAFY
      functionType?: 'WJ' | 'BAFY';
    } & BaseObject;
  } = {},
  url = _env.baseApi + '/phs-base/upload/imageUpload'
) => {
  const globalStore = useGlobalStore();
  const messageStore = useMessageStore();

  return new Promise<{
    url: string;
  }>((resolve, reject) => {
    uni.uploadFile({
      url,
      filePath,
      name: 'file',
      fileType: 'image',
      header: {
        ...(payload.header || {}),
      },
      formData: {
        imageName: filePath,
        sysCode: globalGl.SYS_CODE,
        Authorization: globalStore.getToken,
        ...(payload.data || {}),
      },
      success: function (res) {
        const { errMsg, data, statusCode } = res as any;

        if (statusCode == 200 && data) {
          const { result, message } = JSON.parse(data);

          if (result) {
            resolve({
              url: result,
            });
          } else {
            messageStore.showMessage(message || '上传图片失败', 3000);
            reject(void 0);
          }
        } else {
          messageStore.showMessage('上传图片失败', 3000);
          reject(void 0);
        }
      },

      fail: reject,
    });
  });
};

// export const baseToUrl = async (base64data: string) => {
//   return new Promise((resolve, reject) => {
//     const [, format, bodyData] =
//       /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
//     if (!format) {
//       return new Error('ERROR_BASE64SRC_PARSE');
//     }

//     const fsm = uni.getFileSystemManager();
//     const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名

//     const { microapp, common } = uni.getEnvInfoSync();
//     uni.getAppBaseInfo
//     const filePath = `${common.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
//     const buffer = uni.base64ToArrayBuffer(bodyData);

//     fsm.writeFile({
//       filePath,
//       data: buffer,
//       encoding: 'binary',
//       success() {
//         resolve(filePath)
//       },
//       fail() {
//         return new Error('ERROR_BASE64SRC_WRITE');
//       },
//     });
//   });
// };

export const wxBase64src = async (base64data) => {
  const base64 = base64data;
  const time = new Date().getTime();
  const imgPath = wx.env.USER_DATA_PATH + '/poster' + time + 'share' + '.png';
  const imageData = base64.replace(/^data:image\/\w+;base64,/, '');
  const file = wx.getFileSystemManager();
  file.writeFileSync(imgPath, imageData, 'base64');

  return imgPath;
};

export const base64Src = async (base64data: string) => {
  // #ifdef MP-WEIXIN
  return await wxBase64src(base64data);
  // #endif
};
