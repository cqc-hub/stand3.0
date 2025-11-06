<template>
  <view class=""></view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';
  import { useTBanner, wait } from '@/utils';

  const pageProps = ref(
    <
      {
        admissionTime: string;
        category: string;
        deptName: string;
        docName: string;
        hosName: string;
        patientName: string;
        patientPhone: string;
        visitNo: string;
        hosId: string;
        hosDeptId: string;
        hosDocId: string;
      }
    >{}
  );

  onLoad(async (opt) => {
    uni.showLoading({ title: '加载中'});;
    await wait(500);
    uni.hideLoading();
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    console.log(pageProps.value, ' pageProps.value pageProps.value');
    const { patientPhone, admissionTime } = pageProps.value;
    if (patientPhone) {
      const [visitDate, visitTime] = admissionTime.split(' ');

      useTBanner({
        path: 'pagesC/question/questionAfterVisit2',
        type: 'h5',
        isSelfH5: '1',
        extraData: {
          ...pageProps.value,
          visitDate,
          visitTime,
        },
      });
    } else {
      useTBanner({
        path: 'pagesC/question/questionAfterVisit',
        type: 'h5',
        isSelfH5: '1',
        addition: {
          patientId: '_p',
        },
        extraData: {
          type: 'hk',
        },
      });
    }
    return;
    // useTBanner({
    //   path: 'pagesC/question/questionAfterVisit2',
    //   type: 'h5',
    //   isSelfH5: '1',
    //   addition: {
    //     patientId: '_p',
    //   },
    //   extraData: {
    //     category: '51',
    //     hosName: '就诊院区',
    //     deptName: '就诊科室',
    //     docName: '就诊医生',
    //     visitDate: '2024-06-01',
    //     visitTime: '9:00-10:00',
    //     hosId: 'hosId',
    //     hosDeptId: 'hosDeptId',
    //     hosDocId: 'hosDocId',
    //     visitNo: '11231',
    //   },
    // });

    useTBanner({
      path: 'pagesC/question/questionAfterVisit',
      type: 'h5',
      isSelfH5: '1',
      addition: {
        patientId: '_p',
      },
      extraData: {
        type: 'hk',
      },
    });
  });
</script>

<style lang="scss" scoped></style>
