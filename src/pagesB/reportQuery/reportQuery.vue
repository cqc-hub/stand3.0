<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="page g-page"
  >
    <g-flag typeFg="41" isShowFg />
    <g-selhos
      v-if="cacheStore.isShowChooseHos"
      v-model:hosId="hosId"
      :autoGetData="false"
      @change="choosePat"
      ref="selHosRef"
    />
    <g-choose-pat @choose-pat="choosePat" />
    <g-tbanner
      v-if="gStores.userStore.patChoose.patientId"
      :config="yunBannerConfig"
      @click="getYunBannerData"
      disabled
    />

    <g-message />
    <TimeChoosePopup
      :dateRange="dateRange"
      :timeBtnOpt="timeBtnOpt"
      @time-change="dateRangeChange"
      ref="refTimeChoose"
    />
    <view class="tab-box">
      <g-tabs
        v-model:value="tabCurrent"
        :tabs="tabs"
        :line-scale="0.8"
        field="headerName"
        all-blod
        @change="(e) => tabChange(e, 'click')"
      />
    </view>

    <view
      v-if="isOpenFilterTime"
      @click="refTimeChoose.show"
      class="filter-time p32 pt24 pb24 flex-between"
    >
      <view class="color-888 f28">{{ showTimeLabel }}</view>
      <view
        class="bg-white p24 pt8 pb8 rounded f26 font-semibold flex items-center"
      >
        <text class="mr6">
          {{ dayjs(dateRange[0]).format('YYYY/MM/DD') }} ~
          {{ dayjs(dateRange[1]).format('YYYY/MM/DD') }}
        </text>
        <text class="icon-font ico_triangle_down" />
      </view>
    </view>

    <swiper
      v-if="tabs.length"
      v-show="!(isHealthCardNewMode && isHealthCardButton)"
      :current="tabCurrent"
      @change="(e) => tabChange(e.detail.current, '')"
      class="container g-container"
    >
      <swiper-item v-for="tab in tabs" :key="tab.typeId">
        <scroll-list
          :option="scrollOption"
          @handleInit="loadScrollList"
          @refresh="refresh"
          @load="load"
          ref="slist"
          class="container-scroll"
        >
          <template #default>
            <view
              v-if="pageList[tab.typeId] && pageList[tab.typeId].length"
              class="list-block"
            >
              <template
                v-for="(item, index) in pageList[tab.typeId]"
                :key="index"
              >
                <template
                  v-for="(report, reportIndex) in item.reportHosNameResults"
                  :key="`reportHosNameResults${reportIndex}`"
                >
                  <view class="date" :class="{ dateFirst: index == 0 }">
                    <view class="iconfont date-icon">&#xe6c6;</view>
                    <view class="date-number">{{ item.date }}</view>
                    <text style="color: #e6e6e6">|</text>
                    <view class="address">
                      {{ report.hosName }}
                    </view>
                  </view>
                  <view
                    class="advisoryItem"
                    :class="{ advisoryItemFirst: index == 0 }"
                  >
                    <template v-for="(data, i) in report.reportList" :key="i">
                      <view @tap="goDetail(data)">
                        <advisoryItem :data="data" :type="tab.headerType" />
                      </view>
                    </template>
                  </view>
                </template>
              </template>
              <view class="safe-height"></view>
              <view class="safe-height"></view>
            </view>
          </template>

          <template #empty>
            <!-- v-if="!loading" -->
            <view v-if="!loading" class="empty-box">
              <g-empty :current="1" />
            </view>
          </template>
        </scroll-list>
      </swiper-item>
    </swiper>
    <view
      v-show="isHealthCardNewMode && isHealthCardButton"
      class="container g-container"
    >
      <view class="empty-box">
        <g-empty :current="2" text="请验证身份信息" />
      </view>
    </view>

    <view v-if="footBtns.length" class="g-footer">
      <button
        v-for="(btn, bi) in footBtns"
        :key="btn.text + tabCurrent"
        @click="handleButonClick(btn)"
        :class="{
          flex1: bi,
          'btn-plain ': bi % 2,
          flex2: !bi,
          ml12: bi,
        }"
        class="btn btn-primary btn-border"
      >
        {{ btn.text }}
      </button>
    </view>
    <repShare ref="repShareRef" :current-data="currentTjData" />
  </view>
</template>
<script lang="ts" setup>
  import { ref, nextTick, computed } from 'vue';
  import { ITab, ICms } from './utils';
  import advisoryItem from './components/advisoryItem.vue';
  import repShare from './components/repShare.vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import {
    GStores,
    ServerStaticData,
    wait,
    ISystemConfig,
    TBannerConfig,
    TButtonConfig,
    useTBanner,
  } from '@/utils';
  import globalGl from '@/config/global';
  import { joinQueryForUrl } from '@/common';
  import { deepClone, deQueryForUrl } from '@/common/utils';

  import api from '@/service/api';
  import { useCacheStore } from '@/stores';
  import TimeChoosePopup from './components/TimeChoosePopup.vue';
  import dayjs from 'dayjs';

  interface IPageProps {
    tabIndex: number;
    hosId: string;
  }
  const pageProps = ref(<IPageProps>{});

  const tabs = ref<ITab[]>([]);
  const tabCurrent = ref(0);
  const hosId = ref('');
  const selHosRef = ref(<any>'');
  const pageList = ref<Record<string, ICms[]>>({});
  const _typeId = ref(0);
  const slist = ref<any>('');
  const loading = ref(true);
  const yunBannerConfig = ref(<TBannerConfig>{});
  const gStores = new GStores();
  const cacheStore = useCacheStore();
  const repShareRef = ref<any>('');
  const currentTjData = ref();
  const isOpenFilterTime = computed(
    () => pageConfig.value.isOpenFilterReportByTime === '1'
  );
  const refTimeChoose = ref('' as any);
  const timeBtnOpt = ref(
    [
      {
        label: '近一个月',
        _value: 'month-1',
      },
      {
        label: '近三个月',
        _value: 'month-3',
      },
      {
        label: '近半年',
        _value: 'month-6',
      },
      {
        label: '近一年',
        _value: 'month-12',
      },
    ].map((o) => {
      const [util, _value] = o._value.split('-') as any;
      const format = 'YYYY-MM-DD';
      const [start, end] = [
        dayjs()
          .subtract(_value * 1, util)
          .format(format),
        dayjs().format(format),
      ];
      return {
        ...o,
        value: [start, end].join(','),
      };
    })
  );
  const isHealthCardButton = ref<boolean>(false);
  const isHealthCardNewMode = ref<boolean>(false);
  const showTimeLabel = computed(() => {
    const timeRangeStr = dateRange.value.join(',');

    return timeBtnOpt.value.find((o) => o.value === timeRangeStr)?.label || '';
  });
  const dateRange = ref<[string, string]>([
    dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);
  const dateRangeChange = (range) => {
    dateRange.value = range;
    // tabChange(tabCurrent.value, '');
    // #ifdef MP-WEIXIN
    if (isHealthCardNewMode.value) {
      isHealthCardButton.value = true;
      return;
    }
    // #endif
    getCurrentLoadScrollInstance()?.refresh();
  };

  const init = async () => {
    const { listYun, reportTab } = pageConfig.value;

    if (listYun) {
      const { imgUrl } = listYun;

      yunBannerConfig.value = {
        path: '',
        type: 'h5',
        src: imgUrl as any,
      };
    }

    tabs.value = reportTab.map((item, index) => {
      item.typeId = index;
      return item;
    });

    if (tabs.value?.length) {
      tabs.value.map(({ typeId }, i) => {
        pageList.value[typeId] = [];
        if (typeId == _typeId.value) {
          //查找当前对应的tabCurrent
          tabCurrent.value = i;
        }
      });

      if (pageProps.value.tabIndex) {
        tabCurrent.value = pageProps.value.tabIndex * 1;
      }
    }

    uni.showLoading({});
  };

  let listLenHis = 0;
  const load = async (pageInfo) => {
    // #ifdef MP-WEIXIN
    if (isHealthCardButton.value) {
      return;
    }
    // #endif
    let listNowLen = 0;
    await wait(600);
    const currentTabValue = tabCurrent.value;
    const { isCheckThirdParty } = pageConfig.value;
    const typeId = tabs.value[tabCurrent.value].typeId;
    const { headerType, headerName } = tabs.value[tabCurrent.value];
    const { page, size } = pageInfo;
    const { cardNumber, patientId, idCardEncry } = gStores.userStore.patChoose;
    const [startDate, endDate] = dateRange.value;
    let params = {
      headerType: headerType,
      headerName: headerName,
      patientId,
      cardNumber,
      pageNumber: page,
      pageSize: size,
      idCardEncry,
      hosId: hosId.value,
      startDate: '',
      endDate: '',
    };
    loading.value = true;
    let count = 0;
    let listTotal = [] as any[];
    if (isOpenFilterTime.value) {
      params.endDate = endDate;
      params.startDate = startDate;
    }

    if (currentTabValue === 1 && isCheckThirdParty === '1') {
      getThirdPartyReportUrl();
    } else {
      let { result } = await api
        .getReportsReportList<ICms[]>(params)
        .catch((e) => {
          slist.value[currentTabValue].loadFail(returnArg);

          throw new Error(e);
        })
        .finally(async () => {
          loading.value = false;
        });
      result = deepClone(result);
      const willChangeList = pageList.value[typeId];
      if (page === 1) {
        willChangeList.length = 0;
      }
      console.log('willChangeList', willChangeList);
      if (result && result.length) {
        if (willChangeList.length) {
          result.map((o) => {
            const { date, reportHosNameResults } = o;

            if (reportHosNameResults && reportHosNameResults.length) {
              reportHosNameResults.map((p) => {
                const { hosName, reportList } = p;

                if (reportList && reportList.length) {
                  reportList.map((item) => {
                    const findItemSameDate = willChangeList.find((fItem) => {
                      return fItem.date === date;
                    });

                    if (findItemSameDate) {
                      if (findItemSameDate.reportHosNameResults?.length) {
                        findItemSameDate.reportHosNameResults.map((fHItem) => {
                          if (fHItem.hosName === hosName) {
                            if (fHItem.reportList) {
                              if (!fHItem.reportList.includes(item)) {
                                fHItem.reportList.push(item);
                              }
                            } else {
                              fHItem.reportList = [item];
                            }
                          }
                        });
                      }
                    } else {
                      willChangeList.push({
                        date,
                        reportHosNameResults: [
                          {
                            hosName,
                            reportList,
                          },
                        ],
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          willChangeList.push(...result);
        }

        result.map(({ reportHosNameResults }) => {
          reportHosNameResults?.map(({ reportList }) => {
            count += reportList?.length || 0;
          });
        });
      }
      willChangeList.map(({ reportHosNameResults }) => {
        reportHosNameResults?.map(({ reportList }) => {
          if (reportList?.length) {
            listTotal.push(...reportList);
          }
        });
      });
    }

    const returnArg = {
      total: count < size ? 1 : listTotal.length + 1,
      list: listTotal,
    };

    slist.value[currentTabValue].loadSuccess(returnArg);

    return returnArg;
  };
  const loadScrollList = () => {
    if (tabs.value.length) {
      getCurrentLoadScrollInstance()?.load();
    }
  };
  const getCurrentLoadScrollInstance = () => {
    if (tabs.value.length) {
      return slist.value[tabCurrent.value];
    }
  };

  const handleButonClick = (btn) => {
    const pat = gStores.userStore.patChoose;
    const { idType } = pat;
    if (btn.type === 'button' && idType === '01') {
      handleFacility();
    } else {
      useTBanner(btn);
    }
  };
  const handleFacility = async () => {
    // #ifdef MP-WEIXIN
    uni.showLoading({});
    //分包B引入分包A中的方法，且该方法中“使用在分包A中单独引入的插件”中的方法
    // @ts-expect-error
    require('../../pagesA/medicalCardMan/utils/index', async (utils) => {
      const { success, res } = await utils.getHealthCardCode();
      if (success) {
        const {
          result: { wechatCode },
        } = res;
        const args={
          patientId: gStores.userStore.patChoose.patientId,
          wechatCode,
          herenId: gStores.globalStore.herenId,
          openId: gStores.globalStore.openId,
          source: gStores.globalStore.browser.source,
          sysCode: globalGl.SYS_CODE,
          hospitalId: globalGl.systemInfo.isOpenHealthCard!.hospitalId,
        }
        const { result } = await api.registerUniformVerifyOrder(args);
        const {
          patAndOrderId,
          verifyType,
          verifyOrderId,
          verifyData,
          protectState,
        } = result;
        if (verifyType !== 0) {
          nextTick(() => {
            pageList.value = { '0': [], '1': [], '2': [] };
            isRefresh.value = [true, true, true];
            getCurrentLoadScrollInstance()?.refresh();
            isHealthCardButton.value = false;
            uni.hideLoading();
          });
        } else {
          const {
            result: { userData, userIdKey },
          } = await api.getOrderInfoByOrderId({ ...args, verifyType: '1' });
          const { verifyResult } = await utils.wxFacialVerifyByKey(userIdKey);
          console.log('verifyResult', verifyResult);
          if(verifyResult){
            const { result } = await api.registerUniformVerifyOrder({
              ...args,
              verifyType: '2',
              verifyOrderId,
              patAndOrderId,
              verifyResult
            });
          }
        }
      }
    }, ({ mod, errMsg }) => {
      console.error('分包异步化——跨分包引入JS错误', `path: ${mod}, ${errMsg}`);
      isHealthCardButton.value = false;
      uni.hideLoading();
    });
    // #endif
  };

  const refresh = async (e) => {
    const currentTabValue = tabCurrent.value;
    const returnArg = await load(e);
    slist.value[currentTabValue].refreshSuccess(returnArg, 'refresh');
  };
  const isRefresh = ref([true, true, true]);
  const tabChange = async (e: number, type: string) => {
    const { isCheckThirdParty } = pageConfig.value;
    tabCurrent.value = e;
    if (
      !pageList.value[tabCurrent.value].length &&
      type == 'click' &&
      isRefresh.value[tabCurrent.value]
    ) {
      if (isCheckThirdParty === '1' && e === 1) {
        getThirdPartyReportUrl();
      } else {
        getCurrentLoadScrollInstance()?.refresh();
        nextTick(() => {
          if (pageList.value[tabCurrent.value].length == 0) {
            isRefresh.value[tabCurrent.value] = false;
          }
        });
      }
    }
  };
  const goDetail = (data) => {
    const {
      isDoctorCard,
      isDownloadRepor,
      isGraphic,
      isWatermark,
      jcBottomNav,
      jyBottomNav,
    } = pageConfig.value;
    const mq1 = {
      repId: data.repId || '',
      repType: data.repType || '',
      reportType: data.reportType || '',
      hosId: data.hosId || '',
      extend: data.extend || '',
      isDoctorCard,
      isWatermark,
      isDownloadRepor: isDownloadRepor === '1' || '',
      isGraphic,
    };
    const mq: any = {
      // #ifdef MP-WEIXIN
      _local: '1',
      // #endif
    };
    for (const key in mq1) {
      const v = mq1[key];
      // mq[key] = typeof v === 'string' ? encodeURIComponent(v) : v;
      mq[key] = v;
    }

    if (tabCurrent.value == 0) {
      if (jyBottomNav) {
        Object.keys(jyBottomNav).map((key) => {
          mq[key] = jyBottomNav[key] === '1' ? '1' : '';
        });
      }

      uni.navigateTo({
        url: joinQueryForUrl('/pagesB/reportQuery/InspectionDetails', mq),
      });
    } else if (tabCurrent.value == 1) {
      if (jcBottomNav) {
        Object.keys(jcBottomNav).map((key) => {
          mq[key] = jcBottomNav[key] === '1' ? '1' : '';
        });
      }
      uni.navigateTo({
        url: joinQueryForUrl('/pagesB/reportQuery/inspectionReport', mq),
      });
    } else if (tabCurrent.value == 2) {
      //体检报告给的链接形式
      if (data.url) {
        repShareRef.value.show();
        currentTjData.value = data;
      } else {
        uni.navigateTo({
          url: joinQueryForUrl('/pagesB/reportQuery/InspectionMedical', mq),
        });
      }
    }
  };

  const scrollOption = ref({
    auto: false,
    size: 15,
    loadFailText: '加载失败',
    noMoreText: '没有更多了',
  });
  //切换就诊人
  const choosePat = () => {
    pageList.value = { '0': [], '1': [], '2': [] };
    isRefresh.value = [true, true, true];
    nextTick(() => {
      // #ifdef MP-WEIXIN
      if (isHealthCardNewMode.value) {
        isHealthCardButton.value = true;
        return;
      }
      // #endif
      getCurrentLoadScrollInstance()?.refresh();
    });
  };

  const footBtns = computed<TButtonConfig[]>(() => {
    const tabNow = tabs.value[tabCurrent.value];
    const headerType = tabNow && tabNow.headerType;

    const arrFactory = function <T>(obj: T) {
      const healthCodeButton = {
        type: 'button',
        text: '验证身份并查询报告',
      };
      if (isHealthCardButton.value) {
        return [healthCodeButton];
      }
      if (obj) {
        if (Array.isArray(obj)) {
          return obj;
        } else {
          return [obj];
        }
      } else {
        return [] as any;
      }
    };

    switch (headerType) {
      case 'jy':
        return arrFactory(pageConfig.value.jyListFooterBtn || []);

      case 'jc':
        return arrFactory(pageConfig.value.jcListFooterBtn || []);

      default:
        return arrFactory(pageConfig.value.defaultListFooterBtn || []);
    }
  });

  //根据系统码查询对应医院报告参数
  const pageConfig = ref(<ISystemConfig['reportQuery']>{});

  const getYunBannerData = async () => {
    const { listYun } = pageConfig.value;

    if (listYun) {
      const { imgUrl } = listYun;
      const pat = gStores.userStore.patChoose;

      if (Object.keys(pat).length) {
        const { cardNumber, patientId } = pat;

        const { result } = await api.getCloudReportUrl({
          cardNumber,
          patientId,
        });

        if (result) {
          yunBannerConfig.value = {
            path: result,
            type: 'h5',
            src: imgUrl as any,
          };

          useTBanner(yunBannerConfig.value);
        } else {
          gStores.messageStore.showMessage('未获取到云影像数据', 3000);
        }
      }
    }
  };

  //查询第三方检查报告地址
  const getThirdPartyReportUrl = async () => {
    const pat = gStores.userStore.patChoose;

    if (Object.keys(pat).length) {
      const { patientId } = pat;

      const { result } = await api.getCloudImageInfo({
        patientId,
        hosId: hosId.value,
      });
      loading.value = false;
      if (result?.inspectUrl) {
        uni.navigateTo({
          url: `/pagesA/webView/webView?https=${encodeURIComponent(
            result.inspectUrl!
          )}`,
        });
      } else {
        pageList.value[tabCurrent.value] = [];
      }
    }
  };

  onShow(() => {
    const { isCheckThirdParty } = pageConfig.value;
    if (isCheckThirdParty === '1') {
      tabCurrent.value = 0;
      tabChange(0, 'click');
    }
  });

  onLoad(async (p) => {
    pageConfig.value = await ServerStaticData.getSystemConfig('reportQuery');

    pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
    pageProps.value.hosId && cacheStore.changeHosId(pageProps.value.hosId);
    if (cacheStore.isShowChooseHos) {
      await wait(300);
      await selHosRef.value.init();
    }

    init();
    // #ifdef MP-WEIXIN
    if (
      globalGl.systemInfo?.isOpenHealthCard &&
      globalGl.systemInfo.isOpenHealthCard?.isNewMode
    ) {
      isHealthCardNewMode.value = true;
      isHealthCardButton.value = true;
      uni.hideLoading();
    }
    // #endif
  });
</script>
<style lang="scss" scoped>
  .page {
    background-color: #ffffff;
    touch-action: none;
    .tab-box {
      padding: 0 10rpx;
      :deep(.v-tabs__container-item) {
        flex: 1;
        justify-content: center;
      }
    }

    .filter-time {
      background-color: #f6f6f6;
    }

    .container {
      flex: 1;
      background-color: #f6f6f6;
      .container-scroll {
        height: 100%;

        .list-block {
          border-left: 2rpx dashed #dddddd;
          margin: 0 32rpx;
          padding-bottom: 22rpx;
          .date {
            min-height: 44rpx;
            width: calc(100% - 32rpx);
            color: #888888;
            font-size: var(--hr-font-size-xs);
            line-height: 44rpx;
            margin-top: 40rpx;
            margin-left: -18rpx;
            display: flex;
            align-items: center;
            .date-number {
              margin-right: 12rpx;
            }
            .address {
              margin-left: 12rpx;
            }
            &.dateFirst {
              padding-top: -5rpx;
            }
            .date-icon {
              font-size: var(--hr-font-size-base);
              margin-right: 20rpx;
              color: #dddddd;
              // position: relative;
              // top: -8rpx;
              // z-index: 999;
            }
            .advisoryItem {
              width: 100%;
              &.advisoryItemFirst {
                padding-top: -5rpx;
              }
            }
          }
        }
      }
    }
    :deep(.pull-up-wrap) {
      margin-bottom: 80rpx;
    }
  }
  :deep(.pull-up-wrap) {
    padding-bottom: 80rpx;
  }

  .g-footer {
    transition: all linear;
  }
  .empty-box {
    position: relative;
    transform: translateY(100%);
  }
</style>
