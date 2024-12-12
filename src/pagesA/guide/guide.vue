<template>
  <view class="g-page page-bg">
    <view class="bg-white">
      <view class="fix-top">
        <Guide-Pat-Choose @choose-pat="handlerChoosePatAction" />
      </view>
      <view class="g-border-bottom fix-top z-1">
        <g-tabs
          v-model:value="tabCurrent"
          :tabs="tabField"
          :scroll="false"
          @change="tabChange"
          field="label"
          style="width: 100%"
        />
      </view>

      <scroll-view
        v-if="visitList.length"
        scroll-x
        class="pt16 pb16 fix-top z-1 bg-white"
      >
        <Guide-Visit-List
          :list="visitList"
          :selItem="visitItemSel"
          @item-click="visitItemClick"
        />
      </scroll-view>

      <view class="page-bg relative pl32 pr32">
        <view class="my-hide f24">占位</view>
        <Guide-Content-List :list="visitInfoList" />
        <view class="safe-height" />
        <view class="safe-height" />
      </view>
    </view>

    <Choose-Pat-Action
      @choose-pat="patChange"
      :pat="gStores.userStore.patChoose"
      ref="actionSheet"
    />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { debounce, GStores } from '@/utils';

  import TagStatus from './components/TagStatus.vue';
  import GuidePatChoose from './components/GuidePatChoose.vue';
  import GuideVisitList from './components/GuideVisitList.vue';
  import GuideContentList from './components/GuideContentList.vue';
  import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';
  import api from '@/service/api';
  import { titleMap, TVisitInfo, TVisitRecord } from './guide';

  const gStores = new GStores();
  const tabCurrent = ref(0);
  const tabField = [
    {
      label: '今日就诊',
      key: 0,
    },
    {
      label: '未来就诊',
      key: 1,
    },
    {
      label: '历史就诊',
      key: 2,
    },
  ];
  let tabChange = (idx: number) => {
    tabCurrent.value = idx;

    // getListData();
  };
  tabChange = debounce(tabChange, 80, false);

  const actionSheet = ref<InstanceType<typeof ChoosePatAction>>();
  const handlerChoosePatAction = () => {
    const patList = gStores.userStore.patList;
    if (!patList.length) {
      gStores.messageStore.showMessage('暂无就诊人， 请先添加就诊人');
      return;
    }

    if (actionSheet.value) {
      actionSheet.value.show();
    }
  };

  const visitList = ref(<TVisitRecord[]>[]);
  const visitItemSel = ref(<TVisitRecord>{});
  const visitInfoList = ref(<TVisitInfo[]>[]);
  const visitItemClick = async (item: TVisitRecord) => {
    const { patientId } = gStores.userStore.patChoose;
    const { visitNo } = item;

    visitItemSel.value = item;
    visitInfoList.value = [];

    // const { result } = await api.getIntelligenceVisit({
    //   patientId,
    //   visitNo,
    // });

    const result = {
      node1Info: {
        completionStatus: 1,
        hosId: '13001',
        hosName: '乐清市人民医院',
        visitNo: '20241203004201',
        date: '2024-12-03',
        categorName: null,
        deptName: '心血管内科',
        appointmentTime: '2024-12-03  上午09:15-09:30  11号',
        docName: null,
        areaName: '3楼C区',
        areaId: '3C',
      },
      node2Info: {
        completionStatus: 1,
        hosId: '13001',
        hosName: '乐清市人民医院',
        visitNo: '20241203004201',
        date: '2024-12-03',
        categorName: null,
        deptName: '心血管内科',
        appointmentTime: '2024-12-03  上午09:15-09:30  11号',
        docName: null,
        areaName: '3楼C区',
        areaId: '3C',
      },
      node3Info: {
        completionStatus: 0,
        no: '08',
        curNo: '02',
        beforeNum: '06',
        docName: 'docName',
        site: 'site',
      },
      node4Info: {
        completionStatus: 1,
      },

      node5Info: {
        completionStatus: 1,
        exams: [
          {
            isEmptyStomach: '0',
            itemName: '常规心电图[常规心电图(心脏)]',
            itemAddress: '心电图室',
            isDeptStorage: null,
            status: '3',
            disposeStatus: null,
            appointIndicator: '0',
            itemTime: '2024-12-03 14:09:00.0039',
            remark: null,
            orderId: '2024120300133878',
            billDeptName: '心血管内科',
            billDocName: null,
            performDeptCode: 'A0103006',
            reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
            beforeNum: null,
            curNo: null,
            no: '039',
            visitNo: null,
          },
        ],
      },
      node6Info: {
        completionStatus: 0,
        labs: [
          {
            isEmptyStomach: null,
            itemName: '门诊肾功能 [血液]',
            itemAddress: '检验科',
            isDeptStorage: null,
            status: '3',
            disposeStatus: null,
            appointIndicator: null,
            itemTime: 'nullnull',
            remark: null,
            orderId: '2024120300150065',
            billDeptName: '心血管内科',
            billDocName: null,
            performDeptCode: 'A0103008',
            reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
            beforeNum: null,
            curNo: null,
            no: null,
            visitNo: null,
          },
          {
            isEmptyStomach: null,
            itemName: '血常规 [血液]',
            itemAddress: '检验科',
            isDeptStorage: null,
            status: '3',
            disposeStatus: null,
            appointIndicator: null,
            itemTime: 'nullnull',
            remark: null,
            orderId: '2024120300150064',
            billDeptName: '心血管内科',
            billDocName: null,
            performDeptCode: 'A0103008',
            reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
            beforeNum: null,
            curNo: null,
            no: null,
            visitNo: null,
          },
          {
            isEmptyStomach: null,
            itemName: '甲状腺功能测定 [血液]',
            itemAddress: '检验科',
            isDeptStorage: null,
            status: '3',
            disposeStatus: null,
            appointIndicator: null,
            itemTime: 'nullnull',
            remark: null,
            orderId: '2024120300150067',
            billDeptName: '心血管内科',
            billDocName: null,
            performDeptCode: 'A0103008',
            reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
            beforeNum: null,
            curNo: null,
            no: null,
            visitNo: null,
          },
          {
            isEmptyStomach: null,
            itemName: '电解质组合 [血液]',
            itemAddress: '检验科',
            isDeptStorage: null,
            status: '3',
            disposeStatus: null,
            appointIndicator: null,
            itemTime: 'nullnull',
            remark: null,
            orderId: '2024120300150066',
            billDeptName: '心血管内科',
            billDocName: null,
            performDeptCode: 'A0103008',
            reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
            beforeNum: null,
            curNo: null,
            no: null,
            visitNo: null,
          },
          {
            isEmptyStomach: null,
            itemName: '心肌酶谱 [血液]',
            itemAddress: '检验科',
            isDeptStorage: null,
            status: '3',
            disposeStatus: null,
            appointIndicator: null,
            itemTime: 'nullnull',
            remark: null,
            orderId: '2024120300150068',
            billDeptName: '心血管内科',
            billDocName: null,
            performDeptCode: 'A0103008',
            reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
            beforeNum: null,
            curNo: null,
            no: null,
            visitNo: null,
          },
        ],
      },
      node7Info: {
        completionStatus: 1,
        others: [],
      },
      node8Info: {
        completionStatus: 0,
        drugs: [
          {
            isEmptyStomach: null,
            itemName: '西药',
            itemAddress: '门诊一楼 门诊西药房',
            isDeptStorage: '0',
            status: null,
            disposeStatus: '2',
            appointIndicator: null,
            itemTime: '2024-12-03',
            remark: null,
            orderId: null,
            billDeptName: '心血管内科',
            billDocName: null,
            performDeptCode: 'A0103022',
            reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
            beforeNum: null,
            curNo: null,
            no: null,
            visitNo: null,
          },
        ],
      },
    };

    const {
      node1Info,
      node2Info,
      node3Info,
      node4Info,
      node5Info,
      node6Info,
      node7Info,
      node8Info,
    } = result;

    // 8个node必定存在
    const rList: any[] = [
      node1Info,
      node2Info,
      node3Info,
      node4Info,
      node5Info,
      node6Info,
      node7Info,
      node8Info,
    ]
      .filter((o: any, i) => {
        if (o) {
          o.title = titleMap[i + 1];
        }
        return o;
      })
      .reverse();

    visitInfoList.value = rList;
  };

  const patChange = async () => {
    const { patientId } = gStores.userStore.patChoose;
    visitList.value = [];
    let { result = [] } = await api.getTodayVisit({
      patientId,
    });

    if (!(result && result.length)) {
      result = [
        {
          deptName: '甲状腺外科门诊',
          date: '09-25',
          visitNo: '233456',
        },
        {
          deptName: '甲状腺外科门诊',
          date: '09-27',
          visitNo: '233456222',
        },
        {
          deptName: '甲状腺外科门诊',
          date: '09-28',
          visitNo: '2334561',
        },
      ];
    }

    if (result && result.length) {
      visitList.value = result;
      visitItemClick(result[0]);
    }
  };

  onLoad(async () => {
    // patChange();
    visitItemClick({} as any);
  });
</script>

<style lang="scss" scoped>
  .page-bg {
    background: #e9f0ff;
  }

  .fix-top {
    position: sticky;
    top: 0;
  }
</style>
