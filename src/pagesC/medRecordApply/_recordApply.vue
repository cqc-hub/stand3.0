<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <g-choose-pat @choose-pat="refreshListData" />

    <scroll-list
      :option="scrollOpt"
      @load="getListData"
      @refresh="refreshListData"
      ref="scrollist"
      class="g-container"
    >
      <block v-if="isComplete && list.length">
        <Record-Apply-List
          :list="list"
          :systemModeOld="gStores.globalStore.modeOld"
          @item-click="goApplyDetail"
          @express-click="expressClick"
        />
      </block>
    </scroll-list>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onShow } from '@dcloudio/uni-app';

  import { GStores, type TButtonConfig, useTBanner } from '@/utils';
  import { CaseCopyItem, isExpress1 } from './utils/recordApply';
  import { joinQuery } from '@/common';

  import globalGl from '@/config/global';
  import api from '@/service/api';
  import dayjs from 'dayjs';

  import RecordApplyList from './components/RecordApplyList.vue';

  const props = defineProps<{
    hosId?: string;
  }>();

  const gStores = new GStores();
  const list = ref<CaseCopyItem[]>([]);
  const scrollist = ref<any>('');
  const scrollOpt = ref({
    auto: true,
    size: 1,
    emptyText: '暂未查到相关信息',
  });

  const isComplete = ref(false);

  let _count = 0;
  const getListData = async () => {
    _count++;
    try {
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
        // result.length = 0
        result.map((o) => {
          const { expressParam, acceptTime, outInfo } = o;

          if (outInfo) {
            try {
              o._outInfo = JSON.parse(outInfo);
              o._outInfo.map((o) => {
                const { outTime, admissionTime } = o;
                o.outTime = dayjs(outTime).format('YYYY-MM-DD');
                o.admissionTime = dayjs(admissionTime).format('YYYY-MM-DD');
              });
            } catch (error) {
              gStores.messageStore.showMessage('outInfo 字段格式错误', 3000);
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

      scrollist.value.refreshSuccess({
        list: list.value,
        total: list.value.length || 1,
      });
    } catch (error) {
      scrollist.value.loadFail();
      return Promise.reject(void 0);
    }
  };

  const refreshListData = async () => {
    await getListData();
    scrollist.value.refreshSuccess({
      list: list.value,
      total: list.value.length || 1,
    });
  };

  const goApplyDetail = (item: CaseCopyItem) => {
    uni.navigateTo({
      url: joinQuery('/pagesC/medRecordApply/_recordApplyDetail', {
        phsOrderNo: item.phsOrderNo,
        hosId: item.hosId,
      }),
    });
  };

  const expressClick = (item: CaseCopyItem) => {
    const { expressNo, expressCompany } = item;
    const args: TButtonConfig = {
      type: 'h5',
      path: 'pagesC/myExpress/expressDetail',
      text: '',
      isSelfH5: '1',
      extraData: {
        sysCode: globalGl.SYS_CODE,
        expressNo,
        expressCompany,
      },
      addition: {
        token: 'token',
      },
    };

    useTBanner(args);
  };

  // const init = () => {
  //   getListData();
  // };
  // init();

  onShow(() => {
    if (_count) {
      refreshListData();
    }
  });
</script>

<style lang="scss" scoped>
  .g-container {
    padding: 0 32rpx;
  }

  .no-more {
    margin: 80rpx 0;
  }
</style>
