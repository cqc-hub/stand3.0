<template>
  <view class=""></view>
</template>

<script lang="ts" setup>
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { ref, warn } from 'vue';
  import { apiAsync, useTBanner } from '@/utils';

  import { deQueryForUrl, encryptDes } from '@/common';

  const pageProps = ref(
    <
      {
        /** 场景1 跳转小程序配置 */
        appId: string;
        path: string;

        /** 场景2 专门针对预问诊语音问题 */
        _type: '1';
        patientAge: string;
        patientName: string;
        patientSex: string;
        orderId: string;
        hosDeptId: string;
        hosOrderId: string;
        hosData: string;
        patientId: string;
        extraData: string;
        /** ////使用 useTBanner 函数 */
      }
    >{}
  );
  let count = 0;
  onShow(() => {
    if (count) {
      uni.navigateBack({
        delta: 1,
      });
    } else {
      count++;
    }
  });

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    const { appId, _type } = pageProps.value;

    if (appId) {
      const { confirm } = await apiAsync(uni.showModal, {
        content: '确认跳转第三方小程序?',
      });

      if (confirm) {
        console.log('...pageProps.value', { ...pageProps.value });
        if (pageProps.value?.extraData) {
          try {
            pageProps.value.extraData = JSON.parse(pageProps.value.extraData);
          } catch (e) {
            console.warn('存在extraData但不可序列化', e);
          }
        }
        uni.navigateToMiniProgram({
          ...pageProps.value,
          fail(e) {
            console.log(e);
          },
        });
      } else {
        uni.navigateBack({
          delta: 1,
        });
      }
    } else if (_type === '1') {
      // 预问诊

      // @ts-expect-error
      delete pageProps.value._type;

      useTBanner({
        type: 'h5',
        isSelfH5: '1',
        path: 'pages/inquiries/inquiries3',
        extraData: {
          params: encodeURIComponent(
            encryptDes(
              JSON.stringify({
                ...pageProps.value,
              }),
              'phsDesKe'
            )
          ),
        },
        addition: {
          token: 'token',
          herenId: 'herenId',
        },
      });
    }
  });
</script>

<style lang="scss" scoped></style>
