<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="page g-page"
  >
    <g-flag typeFg="41" isShowFg />
    <g-choose-pat @choose-pat="choosePat" />
    <g-tbanner v-if="isShowYunBanner" :config="yunBannerConfig" />

    <g-message />
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

    <swiper
      v-if="tabs.length"
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
            <view v-if="pageList[tab.typeId] && pageList[tab.typeId].length" class="list-block">
              <template
                v-for="(item, index) in pageList[tab.typeId]"
                :key="index"
              >
                <view class="date" :class="{ dateFirst: index == 0 }">
                  <view class="iconfont date-icon">&#xe6c6;</view>
                  <view class="date-number">{{ item.date }}</view>
                  <text style="color: #e6e6e6">|</text>
                  <view class="address">
                    {{ item.reportHosNameResults[0].hosName }}
                  </view>
                </view>
                <view
                  class="advisoryItem"
                  :class="{ advisoryItemFirst: index == 0 }"
                >
                  <template
                    v-for="(data, i) in item.reportHosNameResults[0].reportList"
                    :key="i"
                  >
                    <view @tap="goDetail(data)">
                      <advisoryItem :data="data" :type="tab.headerType" />
                    </view>
                  </template>
                </view>
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

    <view v-if="footBtns.length" class="g-footer">
      <button
        v-for="(btn, bi) in footBtns"
        :key="btn.text + tabCurrent"
        @click="useTBanner(btn)"
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
  </view>
</template>
<script lang="ts" setup>
  import { ref, nextTick, computed } from 'vue';
  import { ITab, ICms } from './utils';
  import advisoryItem from './components/advisoryItem.vue';
  import { onLoad } from '@dcloudio/uni-app';
  import {
    GStores,
    ServerStaticData,
    wait,
    ISystemConfig,
    TBannerConfig,
    TButtonConfig,
    useTBanner,
  } from '@/utils';
  import { joinQueryForUrl } from '@/common';
  import api from '@/service/api';
  import { deQueryForUrl } from '@/common/utils';

  interface IPageProps {
    tabIndex: number;
  }
  const pageProps = ref(<IPageProps>{});

  const tabs = ref<ITab[]>([]);
  const tabCurrent = ref(0);
  const pageList = ref<Record<string, ICms[]>>({});
  const _typeId = ref(0);
  const slist = ref<any>('');
  const loading = ref(true);
  const isShowYunBanner = ref(false);
  const yunBannerConfig = ref(<TBannerConfig>{});
  const gStores = new GStores();
  const init = async () => {
    tabs.value = reportConfig.value.reportTab.map((item, index) => {
      item.typeId = index;
      return item;
    });
    if (tabs.value.length) {
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
  const totalList = ref([0, 0, 0]);

  let listLenHis = 0;
  const load = async (pageInfo) => {
    let listNowLen = 0;
    await wait(600);
    const currentTabValue = tabCurrent.value;
    const typeId = tabs.value[tabCurrent.value].typeId;
    const { headerType, headerName } = tabs.value[tabCurrent.value];
    const { page, size } = pageInfo;
    const { cardNumber, patientId, idCardEncry } = gStores.userStore.patChoose;
    let params = {
      headerType: headerType,
      headerName: headerName,
      patientId,
      cardNumber,
      pageNumber: page,
      pageSize: size,
      idCardEncry,
    };
    loading.value = true;
    const { result } = await api
      .getReportsReportList(params)
      .finally(async () => {
        loading.value = false;
      });

    const currentResult = JSON.parse(JSON.stringify(result));
    if (result && result.length) {
      let array = JSON.parse(JSON.stringify(pageList.value[typeId]));
      if (array.length && result[0].date == array[array.length - 1].date) {
        array[array.length - 1].reportHosNameResults[0].reportList = array[
          array.length - 1
        ].reportHosNameResults[0].reportList.concat(
          result[0].reportHosNameResults[0].reportList
        );
        if (result.shift().length == 0) {
          pageList.value[typeId] = [...array];
        } else {
          pageList.value[typeId] = [...array, ...result];
        }
      } else {
        pageList.value[typeId] = [...pageList.value[typeId], ...result];
      }
    }
    let list: any[] = [];
    let arr = JSON.parse(JSON.stringify(pageList.value[typeId]));
    arr.map((item1) => {
      item1.reportHosNameResults.map((item2) => {
        item2.reportList.map((item3) => {
          list.push(item3);
        });
      });
    });

    if (currentResult && currentResult.length > 0) {
      const currentCount = ref(0);
      currentResult.map((item1) => {
        item1.reportHosNameResults.map((item2) => {
          currentCount.value += item2.reportList.length;
          totalList.value[typeId] += item2.reportList.length;
        });
      });

      currentResult.map((o) => {
        const { reportHosNameResults } = o;
        if (reportHosNameResults && reportHosNameResults.length) {
          reportHosNameResults.map((o1) => {
            const { reportList } = o1;

            if (reportList && reportList.length) {
              reportList.map(() => {
                listNowLen++;
              });
            }
          });
        }
      });
    }

    const returnArg = {
      total: listNowLen < size ? 1 : listNowLen + 1,
      list,
    };

    if (listLenHis !== list.length) {
      listLenHis = list.length;
    }

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

  const refresh = async (e) => {
    const currentTabValue = tabCurrent.value;
    const tabIdNow = tabs.value[tabCurrent.value].typeId;
    pageList.value[tabIdNow] = [];
    totalList.value = [0, 0, 0];
    const returnArg = await load(e);
    slist.value[currentTabValue].refreshSuccess(returnArg, 'refresh');
  };
  const isRefresh = ref([true, true, true]);
  const tabChange = async (e: number, type: string) => {
    tabCurrent.value = e;
    if (
      !pageList.value[tabCurrent.value].length &&
      type == 'click' &&
      isRefresh.value[tabCurrent.value]
    ) {
      getCurrentLoadScrollInstance()?.refresh();
      nextTick(() => {
        if (pageList.value[tabCurrent.value].length == 0) {
          isRefresh.value[tabCurrent.value] = false;
        }
      });
    }
  };
  const goDetail = (data) => {
    const { isDoctorCard, isDownloadRepor, isGraphic, isWatermark } =
      reportConfig.value;
    const mq1 = {
      repId: data.repId || '',
      repType: data.repType || '',
      reportType: data.reportType || '',
      hosId: data.hosId || '',
      extend: data.extend || '',
      isDoctorCard,
      isWatermark,
      isDownloadRepor,
      isGraphic,
    };

    const mq: any = {};
    for (const key in mq1) {
      const v = mq1[key];
      mq[key] = typeof v === 'string' ? encodeURIComponent(v) : v;
    }

    if (tabCurrent.value == 0) {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesB/reportQuery/InspectionDetails', mq),
      });
    } else if (tabCurrent.value == 1) {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesB/reportQuery/inspectionReport', mq),
      });
    }
  };

  const scrollOption = ref({
    auto: false,
    size: 15,
    loadFailText: '加载失败',
    noMoreText: '没有更多了',
  });
  //切换就诊人
  const choosePat = ({ item }) => {
    pageList.value = { '0': [], '1': [], '2': [] };
    totalList.value = [0, 0, 0];
    isRefresh.value = [true, true, true];
    nextTick(() => {
      getYunBannerData();
      getCurrentLoadScrollInstance()?.refresh();
    });
  };

  const footBtns = computed<TButtonConfig[]>(() => {
    const tabNow = tabs.value[tabCurrent.value];
    const headerType = tabNow && tabNow.headerType;

    const arrFactory = function <T>(obj: T) {
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
        return arrFactory(reportConfig.value.jyListFooterBtn || []);

      case 'jc':
        return arrFactory(reportConfig.value.jcListFooterBtn || []);

      default:
        return [];
    }
  });

  //根据系统码查询对应医院报告参数
  const reportConfig = ref(<ISystemConfig['reportQuery']>{});

  const getYunBannerData = async () => {
    const { listYun } = reportConfig.value;
    isShowYunBanner.value = false;

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
          isShowYunBanner.value = true;

          yunBannerConfig.value = {
            path: result,
            type: 'h5',
            src: imgUrl as any,
          };
        }
      }
    }
  };

  onLoad(async (p) => {
    const config = await ServerStaticData.getSystemConfig('reportQuery');
    reportConfig.value = config;

    pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));

    getYunBannerData();

    init();
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

    .container {
      flex: 1;
      background-color: #f6f6f6;
      .container-scroll {
        height: 100%;
        .empty-box {
          position: relative;
          transform: translateY(100%);
        }
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
</style>
