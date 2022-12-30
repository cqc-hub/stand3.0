<template>
  <view class="page g-page">
    <g-flag typeFg="41" isShowFg />
    <g-choose-pat @choose-pat="choosePat" />
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
      v-if="tabs.length > 0"
      :current="tabCurrent"
      @change="(e) => tabChange(e.detail.current, '')"
      class="container"
    >
      <swiper-item v-for="tab in tabs" :key="tab.typeId">
        <view class="container-scroll">
          <scroll-list
            :option="scrollOption"
            @refresh="refresh"
            @load="load"
            ref="slist"
          >
            <template #default>
              <view class="list-block">
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
                      v-for="(data, i) in item.reportHosNameResults[0]
                        .reportList"
                      :key="i"
                    >
                      <view @tap="goDetail(data)">
                        <advisoryItem :data="data" :type="tab.headerType" />
                      </view>
                    </template>
                  </view>
                </template>
              </view>
            </template>

            <template #empty>
              <view class="empty-box">
                <g-empty v-if="!loading" :current="1" />
              </view>
            </template>
          </scroll-list>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { ITab, ICms } from './utils';
  import advisoryItem from './components/advisoryItem.vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { GStores, ServerStaticData } from '@/utils';
  import { joinQuery, joinQueryForUrl } from '@/common';
  import api from '@/service/api';

  const tabs = ref<ITab[]>([]);
  const tabCurrent = ref(0);
  const pageList = ref<Record<string, ICms[]>>({});
  const _typeId = ref('');
  const slist = ref<any>('');
  const loading = ref(false);
  const gStores = new GStores();
  const patList = ref();
  const init = async () => {
    tabs.value = reportConfig.value.reportTab.map((item, index) => {
      item.typeId = index;
      return item;
    });
    console.log(tabs.value, 'tabs.value ', slist.value);
    if (tabs.value.length) {
      tabs.value.map(({ typeId }, i) => {
        pageList.value[typeId] = [];
        if (typeId == _typeId.value) {
          //查找当前对应的tabCurrent
          tabCurrent.value = i;
        }
      });
    }
    setTimeout(() => {
      loadScrollList();
    }, 500);
  };
  const totalList = ref([0, 0, 0]);
  const load = async (pageInfo) => {
    const typeId = tabs.value[tabCurrent.value].typeId;
    const { headerType, headerName } = tabs.value[tabCurrent.value];
    const { page, size } = pageInfo;
    let params = {
      headerType: headerType,
      headerName: headerName,
      patientId: patList.value.patientId,
      cardNumber: patList.value.cardNumber,
      pageNumber: page,
      pageSize: size,
      //检查传参
      // headerType: headerType,
      // headerName: headerName,
      // sysCode: '1001033',
      // patientId: '10221065',
      // cardNumber: '10763642',
      // pageNumber: page,
      // pageSize: 1,
      //检验传参
      // headerType: headerType,
      // headerName: headerName,
      // patientId: '52299028211',
      // cardNumber: '00545696',
      // pageNumber: page,
      // pageSize: size,
    };
    let returnArg;
    loading.value = true;
    const result = await api.getReportsReportList(params);
    const currentResult = JSON.parse(JSON.stringify(result));
    loading.value = false;
    if (result.result && result.result.length) {
      let array = JSON.parse(JSON.stringify(pageList.value[typeId]));
      if (
        array.length != 0 &&
        result.result[0].date == array[array.length - 1].date
      ) {
        array[array.length - 1].reportHosNameResults[0].reportList = array[
          array.length - 1
        ].reportHosNameResults[0].reportList.concat(
          result.result[0].reportHosNameResults[0].reportList
        );
        if (result.result.shift().length == 0) {
          pageList.value[typeId] = [...array];
        } else {
          pageList.value[typeId] = [...array, ...result.result];
        }
      } else {
        pageList.value[typeId] = [...pageList.value[typeId], ...result.result];
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
    if (currentResult.result && currentResult.result.length > 0) {
      const currentCount = ref(0);
      currentResult.result.map((item1) => {
        item1.reportHosNameResults.map((item2) => {
          currentCount.value += item2.reportList.length;
          totalList.value[typeId] += item2.reportList.length;
        });
      });
      if (currentCount.value < size) {
        returnArg = {
          total: totalList.value[typeId],
          list: list,
        };
      } else {
        returnArg = {
          total: 999999,
          list: list,
        };
      }
    } else {
      returnArg = {
        total: 999999,
        list: list,
      };
    }
    getCurrentLoadScrollInstance()?.loadSuccess(returnArg);
    return returnArg;
  };
  const loadScrollList = () => {
    if (tabs.value.length) {
      getCurrentLoadScrollInstance()?.load();
    }
  };
  const getCurrentLoadScrollInstance = () => {
    console.log(' slist.valu', slist.value);
    if (tabs.value.length) {
      return slist.value[tabCurrent.value];
    }
  };

  const refresh = async (e) => {
    const tabIdNow = tabs.value[tabCurrent.value].typeId;
    pageList.value[tabIdNow] = [];
    totalList.value = [0, 0, 0];
    const returnArg = await load(e);
    getCurrentLoadScrollInstance()?.refreshSuccess(returnArg, 'refresh');
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
    const {
      isDoctorCard,
      isDownloadRepor,
      isGraphic,
      isWatermark,
      watermarkText,
    } = reportConfig.value;
    const mq = {
      repId: data.repId && encodeURIComponent(data.repId) || '',
      repType: data.repType || '',
      reportType: data.reportType || '',
      hosId: data.hosId || '',
      extend: data.extend && encodeURIComponent(data.extend) || '',
      isDoctorCard,
      isWatermark,
      watermarkText,
      isDownloadRepor,
      isGraphic,
    };

    if (tabCurrent.value == 0) {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesB/reportQuery/InspectionDetails', mq),
      });
      // uni.navigateTo({
      //   url: `/pagesB/reportQuery/InspectionDetails?mq=${JSON.stringify(mq)}`,
      // });
    } else if (tabCurrent.value == 1) {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesB/reportQuery/inspectionReport', mq),
      });
      // uni.navigateTo({
      //   url: `/pagesB/reportQuery/inspectionReport?mq=${JSON.stringify(mq)}`,
      // });
    } else {
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
    patList.value = item;
    pageList.value = { '0': [], '1': [], '2': [] };
    totalList.value = [0, 0, 0];
    isRefresh.value = [true, true, true];
    nextTick(() => {
      getCurrentLoadScrollInstance()?.refresh();
    });
  };
  //根据系统码查询对应医院报告参数
  const reportConfig = ref();

  const getParamsMoreBySysCode = async () => {
    reportConfig.value = await ServerStaticData.getSystemConfig('reportQuery');
  };

  // const getParamsMoreBySysCode = async () => {
  //   const { result } = await api.getParamsMoreBySysCode3({
  //     hostId: getHosId(),
  //     paramCode: 'REPORT_QUERY_CONFIG',
  //   });
  //   reportConfig.value = JSON.parse(result.REPORT_QUERY_CONFIG);
  //   console.log(reportConfig.value, 'reportConfig');
  // };
  onLoad(async () => {
    // await gStores.userStore.getPatList();
    await getParamsMoreBySysCode();
    patList.value = gStores.userStore.patChoose;
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
      overflow: hidden;
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
            font-size: 28rpx;
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
              font-size: 32rpx;
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
</style>
