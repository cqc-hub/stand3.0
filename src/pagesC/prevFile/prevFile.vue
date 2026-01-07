<template>
  <view class=""></view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';
  import { useCacheStore } from '@/stores';

  let n = 0;
  const cacheStore = useCacheStore();

  onShow(() => {
    if (n) {
      uni.navigateBack({
        delta: 1,
      });
    } else {
      n++;
    }
  });

  // @ts-expect-error
  let uPath = uni.env?.USER_DATA_PATH;
  onLoad(async (opt) => {
    let { url, name, type, _type } = deQueryForUrl(deQueryForUrl(opt));
    if (_type === 'cache') {
      url = cacheStore.cacheData;
    }
    console.log('获取到url----');
    console.log(url);

    // #ifdef MP-WEIXIN
    uPath = wx.env.USER_DATA_PATH;
    // #endif

    // #ifdef MP-ALIPAY
    uPath = my.env.USER_DATA_PATH;
    // #endif

    uni.showLoading({
      title: '',
    });
    if (type === 'cache') {
      downWithStream(cacheStore.cacheData, name);
    } else if (type == 'base64') {
      downWithBase64(url, name);
    } else {
      downWithStream(url, name);
    }
  });
  const downWithBase64 = (url: string, name) => {
    let filePath = wx.env.USER_DATA_PATH + '/' + new Date().getTime() + '.pdf';

    const handleBase = (base64) => {
      let base64buffer = uni.base64ToArrayBuffer(base64);
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
    };

    if (!url.startsWith('http')) {
      handleBase(url);
      return;
    }

    uni.request({
      url,
      success: (resp: any) => {
        handleBase(resp.data);
      },
      fail(e) {
        console.log(e);
      },
    });
  };
  const downWithStream = (url, name) => {
    name = new Date().getTime() + '';
    uni.showLoading({ title: '加载中' });

    console.log(url, '-----url');
    // name = new Date().getTime() + '';
    uni.downloadFile({
      // url: 'https://xinjiang.eheren.com/image?uid=8d74fcdb5c33a273f4398750c334138a1b67f770e74dcd54fd8883c42031483e', //自定义的文件地址
      // url: 'https://hrsms.wzhealth.com/phs/pro/v3/phoenix-wz/image?uid=HlWMHi2cnDqTjKpSipDFgNT712DVuGX7NbYiFMt%2FLpU%3D',
      // url: 'https://hrsms.wzhealth.com/phs/pro/v3/phoenix-wz/image?uid=JR%2B2rwT0%2FFQlxXU7C0yqm3ztZHZEKzQ0xt6zmf60kXs%3D'
      url,
      // filePath: uPath + '/' + name, //设置文件名
      filePath: `${uPath}/${name}.pdf`, //设置文件名
      success: function (res) {
        console.log('下载成功-----');
        console.log(res);
        const filePath = res.filePath || res.tempFilePath;
        uni.openDocument({
          filePath,
          fileType: 'pdf',
          showMenu: true,
          complete(e) {
            console.log('预览文件--', filePath);
            console.log(e);
          },
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
