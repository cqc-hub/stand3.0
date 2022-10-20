<template>
  <view class="g-page">
    <view class="g-container">
      <block v-if="isComplete && list.length">
        <Record-Apply-List :list="list" @item-click="goApplyDetail" />
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
        const { expressParam } = o;

        if (expressParam) {
          try {
            o._expressParam = JSON.parse(expressParam);
          } catch (error) {
            gStores.messageStore.showMessage('expressParam 字段格式错误', 1500);
          }
        }

        if (o._expressParam) {
          if (isExpress1(o._expressParam)) {
            const { opTime, opDesc } = o._expressParam;

            o._expressTime = dayjs(opTime).format('MM-DD');
            o._expressDesc = opDesc;
          } else {
            const { accept_date, remark } = o._expressParam;

            o._expressDesc = remark;
            o._expressTime = dayjs(accept_date).format('MM-DD');
          }
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
</style>
