<template>
  <view class=""></view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';

  let n = 0;
  onShow(() => {
    if (n) {
      uni.navigateBack({
        delta: 1,
      });
    } else {
      n++;
    }
  });
  onLoad(async (opt) => {
    const { url, name, type } = deQueryForUrl(deQueryForUrl(opt));
    // @ts-expect-error
    let uPath = uni.env?.USER_DATA_PATH;
    // #ifdef MP-WEIXIN
    uPath = wx.env.USER_DATA_PATH;
    // #endif

    // #ifdef MP-ALIPAY
    uPath = my.env.USER_DATA_PATH;
    // #endif

    uni.showLoading({
      title: '',
    });
    if (type && type == 'base64') {
      downWithBase64(url, name);
    } else {
      downWithStream(url, name);
    }
  });
  const downWithBase64 = (url, name) => {
    let filePath =
      wx.env.USER_DATA_PATH +
      '/' +
      name +
      '图文报告' +
      new Date().getTime() +
      '.pdf';
    uni.request({
      url,
      success: (resp: any) => {
        let base64buffer = uni.base64ToArrayBuffer(resp.data);
        uni.getFileSystemManager().writeFile({
          filePath: filePath,
          data: base64buffer,
          encoding: 'binary', // 指定二进制格式
          success: (res) => {
            console.log('writeFile成功', res);
            // 打开文件
            uni.hideLoading();
            uni.openDocument({
              filePath: filePath,
              fileType: 'pdf', //指定为pdf文件
              // @ts-expect-error
              showMenu: true, //true 可以右上角转发和分享
              fail: function (res) {
                uni.hideLoading();
                console.log('文件打开失败', res);
                uni.showToast({
                  title: '文件打开失败',
                  icon: 'none',
                });
              },
            });
          },
          fail: (res) => {
            console.error('写入文件失败：', res);
          },
        });
      },
    });
  };
  const downWithStream = (url, name) => {
    uni.downloadFile({
      // url: 'https://xinjiang.eheren.com/image?uid=8d74fcdb5c33a273f4398750c334138a1b67f770e74dcd54fd8883c42031483e', //自定义的文件地址
      // url: 'https://hrsms.wzhealth.com/phs/pro/v3/phoenix-wz/image?uid=HlWMHi2cnDqTjKpSipDFgNT712DVuGX7NbYiFMt%2FLpU%3D',
      // url: 'https://hrsms.wzhealth.com/phs/pro/v3/phoenix-wz/image?uid=JR%2B2rwT0%2FFQlxXU7C0yqm3ztZHZEKzQ0xt6zmf60kXs%3D'
      url,
      // @ts-expect-error
      filePath: uPath + '/' + name, //设置文件名
      success: function (res) {
        // @ts-expect-error
        const filePath = res.filePath || res.tempFilePath;
        uni.openDocument({
          filePath: filePath,
          fileType: 'pdf',
          fail(e) {
            console.log('prev fail', e);
          },
        });
      },

      complete() {
        uni.hideLoading();
      },

      fail(e) {
        console.log('down fail', e);
      },
    });
  };
</script>

<style lang="scss" scoped></style>
