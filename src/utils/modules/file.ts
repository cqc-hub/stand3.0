export class FileUtil {
  downLoadFileBase64(base64: string, fileName: string) {
    // #ifdef H5
    let aLink = document.createElement('a');
    let blob = this.base64ToBlob(base64); //new Blob([content]);

    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);

    aLink.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
    ); //兼容火狐
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
}
