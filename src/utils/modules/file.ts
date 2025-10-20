import { apiAsync, GStores } from '@/utils';
import { getCurrentInstance } from 'vue';
export class FileUtil extends GStores {
  downLoadFileBase64(base64: string, fileName: string) {
    // #ifdef H5
    const aLink = document.createElement('a');
    const blob = this.base64ToBlob(base64); //new Blob([content]);

    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);

    aLink.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
    );
    // #endif
  }

  base64ToBlob(base64: string) {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  //使用小程序文件管理器下载并展示base64流pdf文件
  downLoadAndShowPdf = (base64buffer: string, filePath: string) => {
    const gStores = new GStores();
    // #ifdef  MP-WEIXIN
    wx.getFileSystemManager().writeFile({
      filePath: filePath,
      data: base64buffer,
      encoding: 'binary', // 指定二进制格式
      success: (res) => {
        console.log('writeFile成功', res);
        // 打开文件
        uni.hideLoading();
        wx.openDocument({
          filePath: filePath,
          fileType: 'pdf', //指定为pdf文件
          showMenu: true, //true 可以右上角转发和分享
          fail: function (res) {
            uni.hideLoading();
            gStores.messageStore.showMessage('文件打开失败', 3000, {
              uniToast: true,
            });
          },
        });
      },
      fail: (res) => {
        console.error('写入文件失败：', res);
        gStores.messageStore.showMessage('下载文件失败', 3000, {
          uniToast: true,
        });
      },
    });
    // #endif
    // #ifdef  MP-ALIPAY
    my.getFileSystemManager().writeFile({
      filePath: filePath,
      data: base64buffer,
      encoding: 'utf8',
      success: (res) => {
        console.log('writeFile成功', res);
        uni.hideLoading();
        my.openDocument({
          filePath: filePath,
          fileType: 'pdf', //指定为pdf文件
          showMenu: true, //true 可以右上角转发和分享
          fail: function (res) {
            uni.hideLoading();
            console.log('文件打开失败', res);
            gStores.messageStore.showMessage('文件打开失败', 3000, {
              uniToast: true,
            });
          },
        });
      },
      fail: (res) => {
        console.error('写入文件失败：', res);
        gStores.messageStore.showMessage('下载文件失败', 3000, {
          uniToast: true,
        });
      },
    });
    // #endif
  };

  /*
  const imgCanvas = ref({
    imgWidth: 0,
    imgHeight: 0,
  });

  <canvas
      v-show="false"
      :width="imgCanvas.imgWidth"
      :height="imgCanvas.imgHeight"
      style="opacity: 0; position: absolute; pointer-events: none"
      id="canvasForBase64"
    />
  */
  convertToJPG({ filePath, imgCanvas, canvasId = 'canvasForBase64' }) {
    if (this.globalStore.ev !== 'alipay') {
      throw '仅支付宝';
    }
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src: filePath,
        success: async (res) => {
          const { width, height } = res;

          if (imgCanvas.value) {
            imgCanvas.value.imgWidth = width;
            imgCanvas.value.imgHeight = height;
          } else {
            imgCanvas.imgWidth = width;
            imgCanvas.imgHeight = height;
          }

          const canvas = uni.createCanvasContext(canvasId);
          canvas.clearRect(0, 0, width, height);
          canvas.drawImage(filePath, 0, 0); // 1. 绘制图片至canvas

          // 绘制完成后执行回调
          canvas.draw(false, async () => {
            uni.canvasToTempFilePath({
              canvasId,
              fileType: 'jpg',
              quality: 0.9,
              success: (res) => {
                resolve(res.tempFilePath);
              },
              fail: (err) => {
                reject('转换 JPG 失败：' + err.errMsg);
              },
            });
          });
        },

        fail(e) {
          reject(e);
        },
      });
    });
  }

  /**
   * 图片压缩
   *
   *  <canvas
        v-show="false"
        :width="imgCanvas.imgWidth"
        :height="imgCanvas.imgHeight"
        id="canvasForBase64"
        canvas-id="canvasForBase64"
        class="my-display-none"
      />


     const imgCanvas = ref({
        imgWidth: 0,
        imgHeight: 0,
      });
   */
  async compressImage({
    filePath,
    imgCanvas,
    quality = 80,
    canvasId = 'canvasForBase64',
  }): Promise<string> {
    const info: any = await uni.getFileInfo({
      filePath,
    });

    // 小于500k 直接返回
    if (info.size < 500000) {
      return filePath;
    }
    if (this.globalStore.ev === 'alipay') {
      filePath = await this.convertToJPG({
        filePath,
        imgCanvas,
        canvasId,
      });
    }

    const r: any = await uni.compressImage({
      src: filePath,
      quality,
    });

    return r.tempFilePath;
  }
}

/**
 * 图片下载与保存工具类
 * 支持微信小程序、H5、App等多端
 */
export class ImageDownloader {
  /**
   * 下载图片并保存到相册
   * @param {string} imageUrl - 图片地址
   * @returns {Promise<string>} 操作结果
   */
  static async downloadAndSaveImage(imageUrl: string): Promise<string> {
    try {
      // 检查权限
      await this.checkPermission();

      // 下载图片
      const tempFilePath = await this.downloadImage(imageUrl);

      // 保存到相册
      await this.saveToAlbum(tempFilePath);

      return '图片已成功保存到相册';
    } catch (error) {
      console.error('下载保存失败:', error);
      const errorMessage =
        error instanceof Error ? error.message : '图片保存失败，请稍后重试';
      return errorMessage;
    }
  }

  /**
   * 检查保存图片权限
   */
  static async checkPermission(): Promise<void> {
    // #ifdef MP-WEIXIN
    const setting = await apiAsync(uni.getSetting, {});

    if (!setting.authSetting['scope.writePhotosAlbum']) {
      try {
        await uni.authorize({ scope: 'scope.writePhotosAlbum' });
      } catch (err) {
        // 引导用户打开权限设置
        const modalRes = await uni.showModal({
          title: '权限申请',
          content: '需要获取保存图片到相册的权限，请在设置中开启',
          confirmText: '去设置',
          cancelText: '取消',
        });

        // @ts-expect-error
        if (modalRes.confirm) {
          await uni.openSetting();
          const newSetting = await await apiAsync(uni.getSetting, {});
          if (!newSetting.authSetting['scope.writePhotosAlbum']) {
            throw new Error('未获得保存权限，无法保存图片');
          }
        } else {
          throw new Error('取消保存图片');
        }
      }
    }
    // #endif

    // #ifdef APP-PLUS
    // @ts-ignore
    const perm = await plus.android.requestPermissions([
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ]);
    if (perm[0].granted !== true) {
      throw new Error('未获得存储权限，无法保存图片');
    }
    // #endif

    // H5通常不需要特殊权限
  }

  /**
   * 下载图片
   * @param {string} url - 图片地址
   * @returns {Promise<string>} 临时文件路径
   */
  static async downloadImage(url: string): Promise<string> {
    // 处理跨域问题，H5可能需要后端代理
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url,
        success: (res) => {
          if (res.statusCode === 200 && res.tempFilePath) {
            resolve(res.tempFilePath);
          } else {
            reject(new Error('图片下载失败'));
          }
        },
        fail: (err) => {
          reject(new Error(`下载失败: ${err.errMsg}`));
        },
      });
    });
  }

  /**
   * 保存图片到相册
   * @param {string} tempFilePath - 临时文件路径
   */
  static async saveToAlbum(tempFilePath: string): Promise<void> {
    let isH5 = false;
    // #ifdef H5
    isH5 = true;
    // #endif

    if (isH5) {
      // H5通过创建a标签下载
      const link = document.createElement('a');
      link.href = tempFilePath;
      link.download = `image_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // 小程序和App使用官方API
    return new Promise((resolve, reject) => {
      uni.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          resolve();
        },
        fail: (err) => {
          reject(new Error(`保存失败: ${err.errMsg}`));
        },
      });
    });
  }
}
