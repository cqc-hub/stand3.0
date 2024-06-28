import { GStores } from '@/utils';
export class FileUtil {
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
}
