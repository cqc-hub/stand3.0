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
        v-if="visitList.length && tabCurrentKey === '0'"
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
        <view class="empty-list" v-if="isShowEmpty">
          <g-empty :current="1" />
        </view>

        <Guide-Content-List
          v-if="visitList.length && tabCurrentKey === '0'"
          :list="visitInfoList"
          :mzqhBtns="mzqhBtns"
          @btn-click="btnClick"
          @go-report="goReport"
          @go-address-map="handlerAddressMap"
          @go-pay-page="goPagePage"
          @go-take-number="goTakeNumber"
          @open-hos-location="openHosLocation"
        />

        <GuideOrderList
          v-if="orderList.length && tabCurrentKey === '1'"
          :list="orderList"
          :config="orderConfig"
          @ywz-click="ywzClick"
          @refound-order="orderRefound"
        />

        <GuideHisList
          v-if="hisList.length && tabCurrentKey === '2'"
          :list="hisList"
          :mzqhBtns="mzqhBtns"
          @btn-click="btnClick"
          @go-report="goReport"
          @go-address-map="handlerAddressMap"
          @go-pay-page="goPagePage"
          @go-take-number="goTakeNumber"
          @open-hos-location="openHosLocation"
        />
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
  import { computed, ref } from 'vue';

  import { onLoad, onShow } from '@dcloudio/uni-app';
  import {
    debounce,
    generateUuid,
    GStores,
    ISystemConfig,
    openLocation,
    ServerStaticData,
    TButtonConfig,
    useTBanner,
    wait,
  } from '@/utils';

  import { titleMap, TVisitInfo, TVisitRecord } from './guide';
  import {
    deQueryForUrl,
    getLocalStorage,
    joinQueryForUrl,
    setLocalStorage,
  } from '@/common';
  import { IRegistrationCardItem } from '../MyRegistration/utils/MyRegistration';
  import {
    getOrderStatusTitle,
    RegDetailUtil,
  } from '../MyRegistration/utils/regDetail';

  import api from '@/service/api';
  import dayjs from 'dayjs';

  import GuidePatChoose from './components/GuidePatChoose.vue';
  import GuideVisitList from './components/GuideVisitList.vue';
  import GuideContentList from './components/GuideContentList.vue';
  import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';
  import GuideOrderList from './components/GuideOrderList.vue';
  import GuideHisList from './components/GuideHisList.vue';

  const pageProps = ref(
    {} as {
      tabKey: '0' | '1' | '2';

      // 未来就诊用 授权返回
      orderId?: string;
      // refoundOrder 取消预约
      type?: 'refoundOrder';
    }
  );
  const gStores = new GStores();
  const tabCurrent = ref(0);
  const tabField = [
    {
      label: '今日就诊',
      key: '0',
    },
    {
      label: '未来就诊',
      key: '1',
    },
    {
      label: '历史就诊',
      key: '2',
    },
  ];
  const tabCurrentKey = computed(() => tabField[tabCurrent.value]?.key || '');
  const orderConfig = ref({} as ISystemConfig['order']);

  const isComplete = ref(false);
  let tabChange = (idx: number) => {
    tabCurrent.value = idx;
    patChange();

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

  // 门诊取号下面的按钮
  const mzqhBtns = computed<TButtonConfig[]>(() => {
    return [
      {
        type: 'h5',
        isSelfH5: '1',
        // path: 'pages/inquiries/inquiries3',
        path: 'pagesC/inquiries/inquiriesRes1',
        text: '预问诊',
        extraData: {
          // orderId: "24121324832100498"
        },
        addition: {
          token: 'token',
          herenId: 'herenId',
          orderId: 'orderId',
          patientId: 'patientId',
          hosDeptId: 'hosDeptId',
          hosOrderId: 'hosOrderId',
        },
      },
      {
        type: 'self',
        path: 'pagesC/takeNumber/takeNumber',
        addition: {
          patientId: 'patientId',
        },
        text: '在线取号',
      },
      {
        type: 'self',
        path: 'pagesA/MyRegistration/MyRegistration',
        addition: {
          patientId: 'patientId',
        },
        text: '取消预约',
      },
    ];
  });

  const visitList = ref(<TVisitRecord[]>[]);
  const visitItemSel = ref(<TVisitRecord>{});
  const visitInfoList = ref(<TVisitInfo[]>[]);
  const visitItemClick = async (item: TVisitRecord) => {
    const { patientId } = gStores.userStore.patChoose;
    const { visitNo } = item;

    visitItemSel.value = item;
    visitInfoList.value = [];
    isComplete.value = false;
    const { result } = await api
      .getIntelligenceVisit({
        patientId,
        visitNo,
      })
      .finally(() => {
        isComplete.value = true;
      });

    // const result = {
    //   node1Info: {
    //     completionStatus: 1,
    //     hosId: '13001',
    //     hosName: '乐清市人民医院',
    //     visitNo: '20241203004201',
    //     date: '2024-12-03',
    //     categorName: null,
    //     deptName: '心血管内科',
    //     appointmentTime: '2024-12-03  上午09:15-09:30  11号',
    //     docName: null,
    //     areaName: '3楼C区',
    //     areaId: '3C',
    //   },
    //   node2Info: {
    //     completionStatus: 1,
    //     hosId: '13001',
    //     hosName: '乐清市人民医院',
    //     visitNo: '20241203004201',
    //     date: '2024-12-03',
    //     categorName: null,
    //     deptName: '心血管内科',
    //     appointmentTime: '2024-12-03  上午09:15-09:30  11号',
    //     docName: null,
    //     areaName: '3楼C区',
    //     areaId: '3C',
    //   },
    //   node3Info: {
    //     completionStatus: 1,
    //     no: '08',
    //     curNo: '02',
    //     beforeNum: '06',
    //     docName: 'docName',
    //     site: 'site',
    //   },
    //   node4Info: {
    //     completionStatus: 0,
    //   },

    //   node5Info: {
    //     completionStatus: 1,
    //     exams: [
    //       {
    //         isEmptyStomach: '0',
    //         itemName: '常规心电图[常规心电图(心脏)]',
    //         itemAddress: '心电图室',
    //         isDeptStorage: null,
    //         status: '3',
    //         disposeStatus: null,
    //         appointIndicator: '0',
    //         itemTime: '2024-12-03 14:09:00.0039',
    //         remark: null,
    //         orderId: '2024120300133878',
    //         billDeptName: '心血管内科',
    //         billDocName: null,
    //         performDeptCode: 'A0103006',
    //         reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
    //         beforeNum: null,
    //         curNo: null,
    //         no: '039',
    //         visitNo: null,
    //       },
    //     ],
    //   },
    //   node6Info: {
    //     completionStatus: 1,
    //     labs: [
    //       {
    //         isEmptyStomach: null,
    //         itemName: '门诊肾功能 [血液]',
    //         itemAddress: '检验科',
    //         isDeptStorage: null,
    //         status: '3',
    //         disposeStatus: null,
    //         appointIndicator: null,
    //         itemTime: 'nullnull',
    //         remark: null,
    //         orderId: '2024120300150065',
    //         billDeptName: '心血管内科',
    //         billDocName: null,
    //         performDeptCode: 'A0103008',
    //         reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
    //         beforeNum: null,
    //         curNo: null,
    //         no: null,
    //         visitNo: null,
    //       },
    //       {
    //         isEmptyStomach: null,
    //         itemName: '血常规 [血液]',
    //         itemAddress: '检验科',
    //         isDeptStorage: null,
    //         status: '3',
    //         disposeStatus: null,
    //         appointIndicator: null,
    //         itemTime: 'nullnull',
    //         remark: null,
    //         orderId: '2024120300150064',
    //         billDeptName: '心血管内科',
    //         billDocName: null,
    //         performDeptCode: 'A0103008',
    //         reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
    //         beforeNum: null,
    //         curNo: null,
    //         no: null,
    //         visitNo: null,
    //       },
    //       {
    //         isEmptyStomach: null,
    //         itemName: '甲状腺功能测定 [血液]',
    //         itemAddress: '检验科',
    //         isDeptStorage: null,
    //         status: '3',
    //         disposeStatus: null,
    //         appointIndicator: null,
    //         itemTime: 'nullnull',
    //         remark: null,
    //         orderId: '2024120300150067',
    //         billDeptName: '心血管内科',
    //         billDocName: null,
    //         performDeptCode: 'A0103008',
    //         reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
    //         beforeNum: null,
    //         curNo: null,
    //         no: null,
    //         visitNo: null,
    //       },
    //       {
    //         isEmptyStomach: null,
    //         itemName: '电解质组合 [血液]',
    //         itemAddress: '检验科',
    //         isDeptStorage: null,
    //         status: '3',
    //         disposeStatus: null,
    //         appointIndicator: null,
    //         itemTime: 'nullnull',
    //         remark: null,
    //         orderId: '2024120300150066',
    //         billDeptName: '心血管内科',
    //         billDocName: null,
    //         performDeptCode: 'A0103008',
    //         reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
    //         beforeNum: null,
    //         curNo: null,
    //         no: null,
    //         visitNo: null,
    //       },
    //       {
    //         isEmptyStomach: null,
    //         itemName: '心肌酶谱 [血液]',
    //         itemAddress: '检验科',
    //         isDeptStorage: null,
    //         status: '3',
    //         disposeStatus: null,
    //         appointIndicator: null,
    //         itemTime: 'nullnull',
    //         remark: null,
    //         orderId: '2024120300150068',
    //         billDeptName: '心血管内科',
    //         billDocName: null,
    //         performDeptCode: 'A0103008',
    //         reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
    //         beforeNum: null,
    //         curNo: null,
    //         no: null,
    //         visitNo: null,
    //       },
    //     ],
    //   },
    //   node7Info: {
    //     completionStatus: 1,
    //     others: [
    //       {
    //         isEmptyStomach: null,
    //         itemName: '西药',
    //         itemAddress: '门诊一楼 门诊西药房',
    //         isDeptStorage: '0',
    //         status: null,
    //         disposeStatus: '2',
    //         appointIndicator: null,
    //         itemTime: '2024-12-03',
    //         remark: null,
    //         orderId: null,
    //         billDeptName: '心血管内科',
    //         billDocName: null,
    //         performDeptCode: 'A0103022',
    //         reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
    //         beforeNum: null,
    //         curNo: null,
    //         no: null,
    //         visitNo: null,
    //       },

    //       {
    //         isEmptyStomach: null,
    //         itemName: '心肌酶谱 [血液]',
    //         itemAddress: '检验科',
    //         isDeptStorage: null,
    //         status: '3',
    //         disposeStatus: null,
    //         appointIndicator: null,
    //         itemTime: 'nullnull',
    //         remark: null,
    //         orderId: '2024120300150068',
    //         billDeptName: '心血管内科',
    //         billDocName: null,
    //         performDeptCode: 'A0103008',
    //         reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
    //         beforeNum: null,
    //         curNo: null,
    //         no: null,
    //         visitNo: null,
    //       },
    //     ],
    //   },
    //   node8Info: {
    //     completionStatus: 1,
    //     drugs: [
    //       {
    //         isEmptyStomach: null,
    //         itemName: '西药',
    //         itemAddress: '门诊一楼 门诊西药房',
    //         isDeptStorage: '0',
    //         status: null,
    //         disposeStatus: '2',
    //         appointIndicator: null,
    //         itemTime: '2024-12-03',
    //         remark: null,
    //         orderId: null,
    //         billDeptName: '心血管内科',
    //         billDocName: null,
    //         performDeptCode: 'A0103022',
    //         reportPlace: '您可以在线查报告,或到“自助报告打印机”进行打印',
    //         beforeNum: null,
    //         curNo: null,
    //         no: null,
    //         visitNo: null,
    //       },
    //     ],
    //   },
    // };

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

    let isBreak = false;
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
      .filter((o, i) => {
        // 1-4 需要过滤  5-8 固定都有
        if (i < 4) {
          if (isBreak) {
            return false;
          }

          if (o.completionStatus === 0) {
            isBreak = true;
          }
        }
        return true;
      })
      .reverse();

    visitInfoList.value = rList;
    // visitInfoList.value = visitInfoList.value.filter((o) => {
    //   const { title, others = [] } = o;

    //   if (title === '其他项目' && !others.length) {
    //     return false;
    //   }

    //   return o;
    // });
  };

  const isShowEmpty = computed(() => {
    if (isComplete.value) {
      if (tabCurrentKey.value === '0') {
        return !visitInfoList.value.length;
      }

      if (tabCurrentKey.value === '1') {
        return !orderList.value.length;
      }

      if (tabCurrentKey.value === '2') {
        return !hisList.value.length;
      }
    }

    return false;
  });

  const getToday = async () => {
    const { patientId } = gStores.userStore.patChoose;
    visitList.value = [];
    visitInfoList.value = [];
    isComplete.value = false;
    let { result = [] } = await api
      .getTodayVisit({
        patientId,
      })
      .finally(() => {
        isComplete.value = true;
      });

    if (!(result && result.length)) {
      // result = [
      //   {
      //     deptName: '甲状腺外科门诊',
      //     date: '09-25',
      //     visitNo: '233456',
      //   },
      //   {
      //     deptName: '甲状腺外科门诊',
      //     date: '09-27',
      //     visitNo: '233456222',
      //   },
      //   {
      //     deptName: '甲状腺外科门诊',
      //     date: '09-28',
      //     visitNo: '2334561',
      //   },
      // ];
    }

    if (result && result.length) {
      visitList.value = result;
      visitItemClick(result[0]);
    }
  };

  const hisList = ref<any[]>([]);
  const getHistory = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const toDay = dayjs().format('YYYY-MM-DD');

    //
    hisList.value = [];
    isComplete.value = false;
    let { result = [] } = await api
      .getHosGuideSheet({
        patientId,
      })
      .finally(async () => {
        isComplete.value = true;
      });

    if (result && result.length) {
      result = result
        .filter((o) => o.disposeTime !== toDay)
        .map((t) => {
          const { processResultList } = t;
          t.itemList = [];
          t.uuid = generateUuid();

          if (processResultList && processResultList.length) {
            processResultList.map((q) => {
              // q.title =
              const {
                orderClass, // 1药品 2检验 3检查
                disposeStatus, // 1 未执行 2部分执行 3已执行
                reportPlace,
              } = q;
              // let status = '1';
              // if (disposeStatus === '3') {
              //   status = '4';
              // }
              // if (disposeStatus === '2') {
              //   status = '4';
              // }

              // q.title = '';
              const typeMap = {
                1: {
                  title: '门诊取药',
                  key: 'drugs',
                },
                2: {
                  title: '检验项目',
                  key: 'labs',
                },
                3: {
                  title: '检查项目',
                  key: 'exams',
                },
              };
              const { title, key } = typeMap[orderClass] || {
                title: '其他项目',
                key: 'others',
              };

              let item = t.itemList.find((o) => o.title === title);
              if (!item) {
                item = {
                  title,
                  [key]: [],
                  completionStatus: 1,
                };
                t.itemList.push(item);
              }

              if (item.completionStatus === 1) {
                item.completionStatus = (disposeStatus === '3' && 1) || 0;
              }

              if (reportPlace && !item.reportPlace) {
                item.reportPlace = reportPlace;
              }

              item[key].push({
                ...q,
                itemAddress: q.address,
              });
            });
          }

          return t;
        });
    }
    hisList.value = result;
    console.log(result);
  };

  const orderList = ref<IRegistrationCardItem[]>([]);
  const getOrderList = async () => {
    const { patientId } = gStores.userStore.patChoose;

    isComplete.value = false;
    orderList.value = [];
    const { result = [] } = await api
      .getRegOrderList<IRegistrationCardItem[]>({
        source: gStores.globalStore.browser.source,
        herenId: gStores.globalStore.herenId,
        patientId,
      })
      .finally(() => {
        isComplete.value = true;
      });

    orderList.value = result.filter((o) =>
      dayjs(o.appointmentDate).isAfter(dayjs())
    );

    orderList.value.map((o) => {
      o._statusLabel = getOrderStatusTitle(
        o.orderStatus,
        orderConfig.value.isOrderPay,
        false
      );

      if (o._statusLabel.startsWith('未知')) {
        // @ts-expect-error
        o.orderStatus = '--';
      }
    });
  };
  const ywzClick = async (item: IRegistrationCardItem) => {
    if (orderConfig.value.preConsultationBtn) {
      //指定的预问诊跳转
      useTBanner(orderConfig.value.preConsultationBtn, 'navigateTo', item);
    } else {
      const { orderId, hosDeptId, hosOrderId, hosData } = item;
      const patientId = gStores.userStore.patChoose.patientId;
      const preConsultation: TButtonConfig = {
        type: 'h5',
        isSelfH5: '1',
        // path: 'pages/inquiries/inquiries3',
        path: 'pagesC/inquiries/inquiriesRes1',
        text: '预问诊',
        extraData: {
          orderId,
          hosDeptId,
          hosOrderId,
          hosData,
          patientId,
        },
        addition: {
          token: 'token',
          herenId: 'herenId',
        },
      };
      useTBanner(preConsultation);
    }
  };
  const orderRefound = async (item: IRegistrationCardItem) => {
    const regDetailUtil = RegDetailUtil.getInstance(
      {
        prop: ref({
          orderId: item.orderId,
          hosOrderId: item.hosOrderId,
        } as any),
        orderConfig,
      },
      true
    );

    await regDetailUtil.getDataDetail();
    await regDetailUtil.refoundOrder({
      returnUrl: joinQueryForUrl('pagesA/guide/guide', {
        ...pageProps.value,
        orderId: item.orderId,
        type: 'refoundOrder',
      }),
    });

    patChange();

    // uni.navigateTo({
    //   url: joinQueryForUrl('/pagesA/MyRegistration/RegDetail', {
    //     // ...item,
    //     orderId: item.orderId,
    //     hosOrderId: item.hosOrderId,
    //     preWz: item.orderStatus === '10' && '1',
    //   }),
    // });
  };

  const patChange = async ({ item } = {} as any) => {
    if (item) {
      gStores.userStore.updatePatChoose(item);
    }

    if (tabCurrentKey.value === '0') {
      await getToday();
    }

    if (tabCurrentKey.value === '1') {
      await getOrderList();
    }

    if (tabCurrentKey.value === '2') {
      await getHistory();
    }
  };

  const handlerAddressMap = (item) => {
    useTBanner(
      {
        type: 'otherProgram',
        path: 'pages/index?id=QFadbKUMCl',
        text: '院内导航',
        appId: 'wx0fb39a1dc27c5e6d',
      },
      'navigateTo',
      item
    );
  };

  const goPagePage = (item) => {
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/clinicPay/clinicPayDetail', {
        tabIndex: (item.completionStatus === 1 && '1') || '0',
      }),
    });
  };

  const goTakeNumber = () => {
    useTBanner({
      isSelfH5: '1',
      type: 'h5',
      path: 'pagesC/queueNumber/queueNumber',
      addition: {
        token: 'token',
        herenId: 'herenId',
      },
    });
  };

  const goReport = ({ tabIndex }) => {
    uni.navigateTo({
      url: joinQueryForUrl('/pagesB/reportQuery/reportQuery', { tabIndex }),
    });
  };

  const btnClick = ({ btn, item }) => {
    const { patChoose } = gStores.userStore;

    useTBanner(btn, 'navigateTo', {
      ...patChoose,
      ...item,
    });
  };

  const openHosLocation = async ({ hosId }) => {
    const hosInfo = (await ServerStaticData.getHosList()).find(
      (o) => o.hosId === hosId
    );

    if (hosInfo) {
      const { gisLat, gisLng, hosName, address } = hosInfo;

      openLocation([gisLat!, gisLng!], {
        name: hosName,
        address,
      });
    } else {
      gStores.messageStore.showMessage('院区查找失败', 1500);
    }
  };

  const getConfig = async () => {
    orderConfig.value = await ServerStaticData.getSystemConfig('order');
  };

  const init = async () => {
    await getConfig();
    patChange();
  };

  const checkCb = async () => {
    if (getLocalStorage('reg-detail-init') === '1') {
      const { type, orderId } = pageProps.value;
      setLocalStorage({
        'reg-detail-init': '',
      });

      await patChange();

      if (type === 'refoundOrder' && orderId && orderList.value.length) {
        const orderItem = orderList.value.find((o) => o.orderId === orderId);
        if (orderItem) {
          orderRefound(orderItem);
        }
      }
    }
  };

  let rCount = 0;
  onShow(async () => {
    if (rCount) {
      checkCb();
    }
    // dealContinueMedicalNationAuth();
  });

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));

    await init();
    await checkCb();
    rCount++;
    // visitItemClick({} as any);
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
