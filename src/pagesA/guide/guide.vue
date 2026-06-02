<template>
  <view :class="{}" class="g-page page-bg">
    <g-flag isShowFg typeFg="1221" />

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
          :jyBtns="jyBtns"
          @item-click="visitItemClick"
        />
      </scroll-view>
    </view>

    <view class="g-container page-bg relative pl32 pr32">
      <!-- <view class="my-hide f24">占位</view> -->
      <view v-if="isShowEmpty" class="pt40">
        <g-empty
          :current="1"
          :text="
            tabCurrentKey === '1'
              ? '您还未挂号，可以点击按钮进行预约挂号'
              : '暂未查到相关信息'
          "
          noTransformY
        >
          <template>
            <view
              v-if="tabCurrentKey === '1'"
              @click="goOrder"
              class="btn btn-border color-111 btn-primary text-white f28 pt12 pb12"
            >
              预约挂号
            </view>
          </template>
        </g-empty>
      </view>

      <Guide-Content-List
        v-if="visitList.length && visitInfoList.length && tabCurrentKey === '0'"
        :list="visitInfoList"
        :mzqhBtns="mzqhBtns"
        :config="pageConfig"
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
        @open-hos-location="openHosLocation"
        @go-dept="goDept"
        @go-doc="goDocDetail"
        @go-detail="goRegDetail"
      />

      <GuideHisList
        v-if="hisList.length && tabCurrentKey === '2'"
        :list="hisList"
        :config="pageConfig"
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
    ApiParamsConfig,
    cacheUtil,
    debounce,
    generateUuid,
    GStores,
    ISystemConfig,
    openLocation,
    ServerStaticData,
    setDefaultPatient,
    TButtonConfig,
    useTBanner,
  } from '@/utils';

  import { titleMap, TVisitInfo, TVisitRecord } from './guide';
  import {
    deQueryForUrl,
    getLocalStorage,
    joinQueryForUrl,
    setLocalStorage,
  } from '@/common';
  import {
    IRegistrationCardItem,
    isCanUseCustomGuide,
  } from '../MyRegistration/utils/MyRegistration';
  import {
    getOrderStatusTitle,
    RegDetailUtil,
  } from '../MyRegistration/utils/regDetail';
  import { HosNavData } from '../MyRegistration/utils/MyRegistration';

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
      // 今日就诊定位
      visitNo?: string;
      // 根据就诊时间判断tab
      visitDate?: string;
      // 切换就诊人
      patientId?: string;
    }
  );
  const gStores = new GStores();
  const tabCurrent = ref(0);
  const tabField = ref([
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
  ] as const);
  const tabCurrentKey = computed(
    () => tabField.value[tabCurrent.value]?.key || ''
  );
  const orderConfig = ref({} as ISystemConfig['order']);
  const pageConfig = ref({} as ApiParamsConfig['GuideConfig']);

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
          deptName: 'deptName',
          hosId: 'hosId',
          hosDocId: 'hosDocId',
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

  const jyBtns = computed(() => {
    return [
      {
        labStatus: ['3'],
        type: 'self',
        path: 'pagesC/takeNumber/takeNumber',
        addition: {
          patientId: 'patientId',
        },
        text: '预约查询及改约',
      },
      {
        type: 'self',
        labStatus: ['4'],
        path: 'pagesC/takeNumber/takeNumber',
        addition: {
          patientId: 'patientId',
        },
        text: '在线取号在线取号在线取号在线取号',
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
        path: 'pagesC/takeNumber/takeNumber',
        addition: {
          patientId: 'patientId',
        },
        text: '在线取号',
      },
      {
        type: 'self',
        path: 'pagesC/takeNumber/takeNumber',
        addition: {
          patientId: 'patientId',
        },
        text: '在线取号',
      },
    ];
  });

  const dealItem = (item) => {
    const { deptId, hosDeptId } = item;

    item.hosDeptId = hosDeptId || deptId;
  };

  const dealListWith1001035 = (list: TVisitInfo[]) => {
    if (gStores.globalStore.sysCode === '1001035') {
      const isAllComplete = list.every((o) => {
        if (o) {
          return o.completionStatus === 1;
        }

        return true;
      });

      if (isAllComplete) {
        list.unshift({
          ...list[0],
          title: '诊后管理',
          tip: '您可按需选择签约我院慢病管理服务,为您的健康保驾护航！',
          defaultExpand: true,
          completionStatus: undefined,
        } as any);
      }
    }
  };
  const visitList = ref(<TVisitRecord[]>[]);
  const visitItemSel = ref(<TVisitRecord>{});
  const visitInfoList = ref(<TVisitInfo[]>[]);
  const visitItemClick = async (item: TVisitRecord) => {
    const { patientId } = gStores.userStore.patChoose;
    const { visitNo, areaName = '' } = item;

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
    isComplete.value = true;
    const _regWay = areaName === '网络就诊' ? '1' : areaName;
    // 8个node必定存在
    let rList: any[] = [
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
          o._regWay = _regWay;
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
      .filter((o: any) => {
        const { title, others = [], labs = [] } = o;

        if (title === '其他项目' && !others.length) {
          return false;
        }

        if (title === '检验项目') {
          // return false;
        }

        return true;
      });

    // 新增逻辑：处理复诊签到节点
    const hasNode5To7 = !!(node5Info || node6Info || node7Info);

    if (hasNode5To7) {
      //
      // 如果存在5、6、7中任意一个节点，则添加"复诊签到"节点, 内容同步"诊区签到"
      const reviewSignNode = {
        ...(node2Info || {}),
        title: '复诊签到',
        completionStatus: node8Info ? 1 : 0, // 如果有node8则表示已完成，否则未完成
      };

      // 将复诊签到节点插入到节点8之前
      const node8Index = rList.findIndex((node) => node.title === '门诊取药'); // 节点8是"门诊取药"
      if (node8Index !== -1) {
        rList.splice(node8Index, 0, reviewSignNode);
      } else {
        rList.push(reviewSignNode);
      }
    }

    rList.map((o) => {
      if (o) {
        dealItem(o);
      }
    });

    visitInfoList.value = rList.reverse();
    dealListWith1001035(visitInfoList.value);
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
      const _disposeStatusLabelMap = {
        1: '未执行',
        2: '已执行',
        3: '部分执行',
      };
      result = result
        .filter((o) => o.disposeTime !== toDay)
        .map((t) => {
          const {
            processResultList,
            deptId,
            deptName,
            disposeTime,
            hosId,
            hosName,
            visitNo,
            hosDocId,
          } = t;

          const info = {
            ...t,
            deptId,
            categorName: deptName,
            appointmentTime: disposeTime,
            hosId,
            hosName,
            visitNo,
            hosDocId,
          };
          dealItem(info);
          t.itemList = [
            {
              ...info,
              title: '门诊取号',
              sort: 1,
              completionStatus: (processResultList?.length && 1) || 0,
            },
            {
              ...info,
              title: '诊区签到',
              sort: 2,
              completionStatus: (processResultList?.length && 1) || 0,
            },
            {
              ...info,
              title: '门诊就诊',
              sort: 3,
              completionStatus: (processResultList?.length && 1) || 0,
            },
            //     {
            //   ...info,
            //   title: '就诊完成',
            //   sort: 7,
            //   completionStatus: (processResultList?.length && 1) || 0,
            // },
            // {
            //   ...info,
            //   title: '门诊缴费',
            //   sort: 4,
            //   // completionStatus: (processResultList?.length && 1) || 0,
            // },
          ];
          t.uuid = generateUuid();
          const typeMap = {
            '-1': {
              title: '其他项目',
              key: 'others',
              sort: 7,
            },
            A: {
              title: '门诊取药',
              key: 'drugs',
              sort: 8,
            },
            B: {
              title: '门诊取药',
              key: 'drugs',
              sort: 9,
            },
            C: {
              title: '检验项目',
              key: 'labs',
              sort: 5,
            },
            D: {
              title: '检查项目',
              key: 'exams',
              sort: 6,
            },
          };

          if (processResultList && processResultList.length) {
            processResultList.map((q) => {
              // q.title =
              const {
                orderClass, // A 西药中药 B草药 C检验  D检查  E处置
                disposeStatus, // 1 未执行 2已执行 3 部分执行
                reportPlace,
              } = q;

              const { title, key, sort } = typeMap[orderClass] || typeMap['-1'];

              let item = t.itemList.find((o) => o.title === title);
              if (!item) {
                item = {
                  ...q,
                  title,
                  [key]: [],
                  completionStatus: -1,
                  sort,
                };
                t.itemList.push(item);
              }

              if (item.completionStatus === 1) {
                item.completionStatus = (disposeStatus === '2' && 1) || 0;
              }

              if (reportPlace && !item.reportPlace) {
                item.reportPlace = reportPlace;
              }

              item[key].push({
                ...q,
                itemAddress: q.address,
                _disposeStatusLabel: _disposeStatusLabelMap[disposeStatus],
                labStatus: '-1',
                // 检验、检查转字段
                hosDocId: q.hosDocId || q.billDocId,
                hosDeptId: q.hosDeptId || q.billDeptId,
              });
            });
          }

          if (t.itemList.length) {
            t.itemList.map((o) => {
              const {
                orderClass, //  A 西药中药 B草药 C检查 D检验  E处置
              } = o;

              const { key } = typeMap[orderClass] || typeMap['-1'];
              const itemList = o[key] || [];
              o.completionStatus = o.completionStatus || 0;

              if (itemList.length) {
                o.completionStatus =
                  (itemList.every((p) => p.disposeStatus === '2') && 1) || 0;
              }

              if (t.itemList.some((item) => item.completionStatus === 0)) {
                t.completionStatus = 0;
              } else {
                t.completionStatus = 1;
              }
            });
          }
          if (t.completionStatus === 1) {
            //全部完成添加节点
            t.itemList.push({
              ...info,
              title: '就诊完成',
              sort: 10,
              completionStatus: 1,
            });
          }
          if (t.itemList.length) {
            t.itemList = t.itemList.sort((a, b) => b.sort - a.sort);
          }

          dealListWith1001035(t.itemList);
          return t;
        });
    }
    hisList.value = result;
  };

  const orderList = ref<IRegistrationCardItem[]>([]);
  const getOrderList = async () => {
    const { patientId } = gStores.userStore.patChoose;

    isComplete.value = false;
    orderList.value = [];
    const { result = [] } = await api
      .hosRegOrderList<IRegistrationCardItem[]>({
        // .getRegOrderList<IRegistrationCardItem[]>({
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
        o,
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
      const {
        orderId,
        hosDeptId,
        hosOrderId,
        hosData,
        deptName,
        hosId,
        hosDocId,
      } = item;
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
          hosData: encodeURIComponent(hosData as string),
          patientId,
          deptName,
          hosId,
          hosDocId,
        },
        addition: {
          token: 'token',
          herenId: 'herenId',
        },
      };
      useTBanner(preConsultation);
    }
  };
  const orderRefound = async (item: IRegistrationCardItem, opt = {} as {}) => {
    const regDetailUtil = RegDetailUtil.getInstance(
      {
        prop: ref({
          orderId: item.orderId,
          hosOrderId: item.hosOrderId,
          typeId: '1',
        } as any),
        orderConfig,
      },
      true
    );

    const pageArg = {
      ...pageProps.value,
      orderId: item.orderId,
      type: 'refoundOrder',
      tabKey: tabCurrentKey.value,
    };

    if (tabCurrentKey.value === '0') {
      pageArg.visitNo = visitItemSel.value.visitNo;
    }

    await regDetailUtil.getDataDetail();
    await regDetailUtil.refoundOrder({
      returnUrl: joinQueryForUrl('/pagesA/guide/guide', pageArg),
    });

    patChange();
  };
  const goRegDetail = (item: IRegistrationCardItem) => {
    const { sysCode } = gStores.globalStore;

    const _disabled: string[] = [];

    // 1001094 需要支持退号
    if (!['1001094'].includes(sysCode)) {
      _disabled.push('refound');
    }

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/RegDetail', {
        ...item,
        orderId: item.orderId,
        hosOrderId: item.hosOrderId,
        preWz: item.orderStatus === '10' && '1',
        typeId: '1',
        _type: 'znpz',
        _disabled,
      }),
    });
  };

  const goOrder = async () => {
    const hosList = await ServerStaticData.getHosList();
    if (hosList.length === 1) {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesA/MyRegistration/selDepartment', {
          clinicalType: '1',
          hosId: hosList[0].hosId,
        }),
      });
    } else {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesA/MyRegistration/Register', {
          _url: '/pagesA/MyRegistration/selDepartment?clinicalType=1',
        }),
      });
    }
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
    console.log(item);
    if (
      gStores.globalStore.sysCode === '1001052' &&
      gStores.globalStore.ev === 'wx'
    ) {
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
      return;
    }
    if (gStores.globalStore.sysCode === '1001040') {
      useTBanner(
        {
          type: 'otherProgram',
          path: '/packageNav/pages/nav/nav?mallId=472&uuid=788bbbe89dbb40e3b17506fd0e8198ff&routeId=562',
          text: '院内导航',
          appId: 'wxd7b5b33407656cf7',
        },
        'navigateTo',
        {
          thirdName: item.deptName,
        }
      );
      return;
    }
    if (gStores.globalStore.sysCode === '1001035') {
      item.hosDeptId = item.deptId;
      useTBanner(HosNavData[item.hosId](item), 'navigateTo', item);
      return;
    } else if (
      gStores.globalStore.sysCode === '1001067' &&
      item.hosId === '13009'
    ) {
      if (item.billDeptId) {
        item.extend = JSON.stringify({
          areaId: item.billDeptId,
        });
        useTBanner(HosNavData[item.hosId](item), 'navigateTo', item);
      }
      return;
    }
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

  const openHosLocation = async (item) => {
    const { hosId, deptId, hosDeptId } = item;

    if (gStores.globalStore.sysCode === '1001035') {
      item.hosDeptId = hosDeptId || deptId;
    }

    if (isCanUseCustomGuide(item)) {
      handlerAddressMap(item);
      return;
    }

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

  const goDept = (item) => {
    const { hosId, hosDeptId, deptName } = item;
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/order', {
        hosId,
        hosDeptId,
        deptName,
      }),
    });
  };

  const goDocDetail = (item) => {
    const { hosId, hosDocId } = item;

    if (!hosDocId) {
      throw new Error('未获取到 hosDocId');
    }

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/DoctorDetails', {
        hosId,
        hosDocId,
      }),
    });
  };

  const getConfig = async () => {
    pageConfig.value = (
      await cacheUtil.getSystemConfig('GuideConfig')()
    ).GuideConfig;
    orderConfig.value = await ServerStaticData.getSystemConfig('order');
  };

  const init = async () => {
    await getConfig();
    patChange();
  };

  const checkCb = async () => {
    if (getLocalStorage('reg-detail-init') === '1') {
      const { type, orderId, visitNo } = pageProps.value;
      setLocalStorage({
        'reg-detail-init': '',
      });

      await patChange();

      if (type === 'refoundOrder' && orderId) {
        let orderItem;

        if (tabCurrentKey.value === '0' && visitNo && visitList.value) {
          const visitItem = visitList.value.find((o) => o.visitNo === visitNo);
          if (visitItem) {
            await visitItemClick(visitItem);

            const refoundItem = visitInfoList.value.find(
              (o) => o.title === '门诊取号'
            );

            if (refoundItem) {
            }
          }
        }

        if (tabCurrentKey.value === '1' && orderList.value.length) {
          orderItem = orderList.value.find((o) => o.orderId === orderId);
        }

        if (orderItem) {
          orderRefound(orderItem);
        }
      }
    }
  };

  let rCount = 0;
  onShow(async () => {
    if (rCount) {
      await patChange();
      checkCb();
    }
    // dealContinueMedicalNationAuth();
  });

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    const { tabKey, visitDate, patientId } = pageProps.value;

    if (patientId) {
      setDefaultPatient(patientId);
    }
    if (tabKey) {
      const tabIdx = tabField.value.findIndex((o) => o.key === tabKey);

      if (tabIdx > -1) {
        tabCurrent.value = tabIdx;
      }
    } else if (visitDate) {
      const currentDate = dayjs().format('YYYY-MM-DD');
      const visitDateFormatted = dayjs(visitDate?.substring(0, 10)).format(
        'YYYY-MM-DD'
      );

      if (visitDateFormatted === currentDate) {
        tabCurrent.value = 0; // 当日就诊
      } else if (dayjs(visitDateFormatted).isAfter(currentDate)) {
        tabCurrent.value = 1; // 未来就诊
      } else {
        tabCurrent.value = 2; // 历史就诊
      }
    }
    await init();
    await checkCb();
    rCount++;
    // visitItemClick({} as any);
  });
</script>

<style lang="scss" scoped>
  .page-bg {
    background: var(--hr-brand-color-1);
  }

  .fix-top {
    // position: sticky;
    // top: 0;
  }
</style>
