<template>
  <view class="g-page">
    <view class="g-container">
      <block v-if="isComplete && list.length">
        <Record-Apply-List :list="list" @item-click="goApplyDetail" />
        <view class="no-more g-flex-rc-cc color-888 f24">没有更多了</view>
      </block>

      <view class="empty-list" v-else-if="isComplete">
        <g-empty :current="1" />
      </view>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { GStores, ServerStaticData, IHosInfo } from '@/utils';
  import { defineComponent, ref } from 'vue';
  import { CaseCopyItem, isExpress1 } from './utils/recordApply';

  import RecordApplyList from './components/recordApplyList.vue';

  import api from '@/service/api';
  import dayjs from 'dayjs';
  import { joinQuery } from '@/common';

  const props = defineProps<{
    hosId: string;
  }>();

  const gStores = new GStores();
  const list = ref<CaseCopyItem[]>([]);

  const isComplete = ref(false);

  const getListData = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const arg = {
      patientId,
    };

    isComplete.value = false;
    const { result } = await api
      .getCaseCopyList<CaseCopyItem[]>(arg)
      .finally(() => {
        isComplete.value = true;
      });

    if (result && result.length) {
      result.map((o) => {
        const { expressParam, acceptTime, outInfo } = o;

        // if (expressParam) {
        //   try {
        //     o._expressParam = JSON.parse(expressParam);
        //   } catch (error) {
        //     gStores.messageStore.showMessage('expressParam 字段格式错误', 1500);
        //   }
        // }

        // if (o._expressParam) {
        //   if (isExpress1(o._expressParam)) {
        //     const { opTime, opDesc } = o._expressParam;

        //     o._expressTime = dayjs(opTime).format('MM-DD');
        //     o._expressDesc = opDesc;
        //   } else {
        //     const { accept_date, remark } = o._expressParam;

        //     o._expressDesc = remark;
        //     o._expressTime = dayjs(accept_date).format('MM-DD');
        //   }
        // }

        if (outInfo) {
          try {
            o._outInfo = JSON.parse(outInfo);
            o._outInfo.map((o) => {
              const { outTime, admissionTime } = o;
              o.outTime = dayjs(outTime).format('YYYY-MM-DD');
              o.admissionTime = dayjs(admissionTime).format('YYYY-MM-DD');
            });
            console.log(o._outInfo);
          } catch (error) {
            gStores.messageStore.showMessage('outInfo 字段格式错误', 1500);
          }
        }

        if (o.expressParam) {
          o._expressTime = dayjs(o.acceptTime).format('MM-DD');
          o._expressDesc = expressParam;
        }

        o._createTime = dayjs(o.createTime).format('YYYY-MM-DD');
      });
    }

    list.value = result || [];
  };

  const goApplyDetail = (item: CaseCopyItem) => {
    uni.navigateTo({
      url: joinQuery('/pagesC/medRecordApply/_recordApplyDetail', {
        phsOrderNo: item.phsOrderNo,
        hosId: props.hosId,
      }),
    });
  };

  const init = () => {
    getListData();
  };

  init();
</script>

<style lang="scss" scoped>
  .g-container {
    padding: 0 32rpx;
  }

  .no-more {
    margin: 80rpx 0;
  }
</style>
