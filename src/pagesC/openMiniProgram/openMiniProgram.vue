<template>
  <view class=""></view>
</template>

<script lang="ts" setup>
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { ref, warn } from 'vue';
  import { apiAsync, GStores, useTBanner } from '@/utils';

  import { deQueryForUrl, encryptDes } from '@/common';

  const gStores = new GStores();

  const pageProps = ref(
    <
      {
        /** 场景1 跳转小程序配置 */
        appId: string;
        path: string;

        /** 场景2 跳转小程序携带登录信息_ type: '2' */
        envVersion?: 'develop' | 'trial' | 'release';
        /** 场景3 专门针对预问诊语音问题   _type: 1 */
        _type: '1' | '2';
        patientAge: string;
        patientName: string;
        patientSex: string;
        orderId: string;
        hosDeptId: string;
        hosOrderId: string;
        hosData: string;
        patientId: string;
        extraData?: Record<string, any>;
        originPath?: string; // 给ai预问诊使用
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
        // 区分是普通跳转小程序还是携带登录信息跳转小程序
        if (pageProps.value?.extraData) {
          try {
            let extraDataStr = pageProps.value.extraData.replace(
              /(\w+):/g,
              '"$1":'
            );
            // 使用正则表达式将单引号替换为双引号
            extraDataStr = extraDataStr.replace(/'/g, '"');
            // 确保整个字符串也被引号包围
            if (!extraDataStr.startsWith('{')) {
              extraDataStr = `{${extraDataStr}}`;
            }
            pageProps.value.extraData = JSON.parse(extraDataStr);
          } catch (e) {
            console.warn('存在extraData但不可序列化', e);
          }
        }
        if (_type === '2') {
          const { extraData } = pageProps.value;
          useTBanner({
            ...pageProps.value,
            type: 'mini',
            addition: { token: 'token', herenId: 'herenId' },
            extraData: {
              source: gStores.globalStore.browser.source,
              sysCode: gStores.globalStore.sysCode,
              reqForward: 'false',
              ...(extraData || {}),
            },
          });
        } else {
          console.log('...pageProps.value', { ...pageProps.value });

          uni.navigateToMiniProgram({
            ...pageProps.value,
            fail(e) {
              console.log(e);
            },
          });
        }
      } else {
        uni.navigateBack({
          delta: 1,
          fail() {
            uni.reLaunch({
            url: '/pages/home/home',
          })
          },
        });
      }
    } else if (_type === '1') {
      // 预问诊

      // @ts-expect-error
      delete pageProps.value._type;
     
      useTBanner({
        type: 'h5',
        isSelfH5: '1',
        path: pageProps.value.originPath ?  pageProps.value.originPath : 'pages/inquiries/inquiries3',
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
    } else {
      useTBanner(pageProps.value as any);
    }
  });
</script>

<style lang="scss" scoped></style>
