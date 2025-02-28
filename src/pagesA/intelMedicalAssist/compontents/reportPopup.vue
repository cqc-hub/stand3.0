<template>
  <g-popup isHideNav ref="reportPopupRef">
    <view
      class="reportList-container page g-page"
      :class="{
        'system-mode-old': gStores.globalStore.modeOld,
      }"
    >
      <view class="title">
        <view class="flex-between">
          <view class="popup-title text-ellipsis f48 pt32 pb32">
            报告AI解读
          </view>
          <view @click="reportPopupRef.hide" class="iconfont ico-close f48 p24">
            &#xe6cd;
          </view>
        </view>
      </view>
      <view v-if="isPhoto" class="photo-container">
        <view class="sub-title-line flex-normal pl24 pr24 relative">
          <view class="sub-title f28 color-444">
            <text>上传</text>
            <text style="color: #296fff">检验报告</text>
            <text>，智能医助将为您解读报告~</text>
          </view>
          <view class="report-img relative">
            <img :src="globalGl.BASE_IMG + 'znyz_jxw.png'" class="w-full" />
          </view>
        </view>
        <view class="content relative">
          <view class="upload-description pt32 p48c">
            <text class="color-444 f28">图片上传示例</text>
            <text class="color-888 f26">请上传图文清晰、边框完整的图片</text>
          </view>
          <view class="report-img flex-normal p32c pt48">
            <img :src="globalGl.BASE_IMG + 'znyz_jc.png'" class="w-full" />
            <img :src="globalGl.BASE_IMG + 'znyz_jy.png'" class="w-full" />
          </view>
        </view>
      </view>
      <!-- <view class="tab-box">
        <g-tabs
          v-model:value="tabCurrent"
          :tabs="tabs"
          :line-scale="0.8"
          field="headerName"
          all-blod
          @change="(e) => tabChange(e, 'click')"
        />
      </view> -->
      <swiper
        v-else
        :current="tabCurrent"
        @change="(e) => tabChange(e.detail.current, '')"
        class="container g-container pt32"
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
                      class="advisoryItem pb40"
                      :class="{ advisoryItemFirst: index == 0 }"
                    >
                      <template v-for="(data, i) in report.reportList" :key="i">
                        <view @tap="changeCheck(data)">
                          <advisoryItem
                            :data="data"
                            :type="tab.headerType"
                            :checked="data.checked"
                          />
                        </view>
                      </template>
                    </view>
                  </template>
                </template>
                <view class="safe-height"></view>
                <!-- <view class="safe-height"></view> -->
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

      <view class="footer f32">
        <button class="btn btn-primary btn-border" @click="addPhoto">
          上传报告图片
        </button>
        <button class="btn btn-border btn-primary" @click="changeTtype">
          {{ isPhoto ? '解读本院报告' : '进行报告解读' }}
        </button>
      </view>
    </view>
  </g-popup>
</template>
<script setup lang="ts">
  import { ref, nextTick, computed, onMounted, onUpdated } from 'vue';
  import { reportPopupRef ,isPhoto} from '../utils/utils';
  import {
    ServerStaticData,
    ISystemConfig,
    wait,
    GStores,
    apiAsync,
  } from '@/utils';
  import globalGl from '@/config/global';
  import { deepClone, deQueryForUrl } from '@/common/utils';
  import advisoryItem from './advisoryItem.vue';
  // import { isOpenSm4 } from '@/service';
  // import env from '@/config/env';
  import api from '@/service/api';
  import dayjs from 'dayjs';

  const pageConfig = ref(<ISystemConfig['reportQuery']>{});
  const pageList = ref<Record<string, any[]>>({});
  const tabCurrent = ref(0);
  const tabs = ref<any[]>([
    {
      headerName: '检验',
      headerType: 'jy',
      typeId: 0,
    },
  ]);
  const uploadImgList = ref<any[]>([]);
  // const ImgUploadOption = ref<any>({});
 
  const isRefresh = ref([true, true, true]);
  const slist = ref<any>('');
  const loading = ref(true);
  const gStores = new GStores();
  const hosId = ref('');
  const checkedList = ref<any[]>([]);
  const dateRange = ref<[string, string]>([
    dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);
  const scrollOption = ref({
    auto: false,
    size: 15,
    height: 650,
    loadFailText: '加载失败',
    noMoreText: '没有更多了',
  });

  const emits = defineEmits(['inspection-analysis', 'send-img']);

  const changeTtype = () => {
    if (isPhoto.value) {
    isPhoto.value = !isPhoto.value;
    checkedList.value = [];
      pageList.value[0] = [];
    } else {
      handleAnalysis();
    }
  };

  const tabChange = async (e: number, type: string) => {
    const { isCheckThirdParty } = pageConfig.value;
    tabCurrent.value = e;
    if (
      !pageList.value[tabCurrent.value].length &&
      type == 'click' &&
      isRefresh.value[tabCurrent.value]
    ) {
      if (isCheckThirdParty === '1' && e === 1) {
        //暂不支持第三方
        // getThirdPartyReportUrl();
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
    const returnArg = await load(e);
    slist.value[currentTabValue].refreshSuccess(returnArg, 'refresh');
  };

  const load = async (pageInfo) => {
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
    // if (isOpenFilterTime.value) {
    //   params.endDate = endDate;
    //   params.startDate = startDate;
    // }

    if (currentTabValue === 1 && isCheckThirdParty === '1') {
      //暂不支持第三方
      // getThirdPartyReportUrl();
    } else {
      let { result } = await api
        .getReportsReportList<any[]>(params)
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
      if (result && result.length) {
        if (willChangeList.length) {
          result.map((o) => {
            const { date, reportHosNameResults } = o;

            if (reportHosNameResults && reportHosNameResults.length) {
              reportHosNameResults.map((p) => {
                const { hosName, reportList } = p;

                if (reportList && reportList.length) {
                  reportList.map((item) => {
                    item.checked = false;
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

  const changeCheck = (data) => {
    checkedList.value = [];
    pageList.value[tabCurrent.value].map((o) => {
      const { date, reportHosNameResults } = o;

      if (reportHosNameResults && reportHosNameResults.length) {
        reportHosNameResults.map((p) => {
          const { hosName, reportList } = p;

          if (reportList && reportList.length) {
            reportList.map((item) => {
              // item.checked = false;
              if (data.repId === item.repId) {
                item.checked = !item.checked;
              }
              if (item.checked) {
                checkedList.value.push(item);
              }
              return item;
            });
          }
        });
      }
    });
  };
  const addPhoto = () => {
    emits('send-img');
  };
  const handleAnalysis = () => {
    if (checkedList.value?.length) {
      emits('inspection-analysis', checkedList.value);
    }
  };

  const init = async () => {
    if (tabs.value?.length) {
      tabs.value.map(({ typeId }, i) => {
        pageList.value[typeId] = [];
      });
    }
  };

  onMounted(async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('reportQuery');
    // ImgUploadOption.value = {
    //   count: 3,
    //   title: '选择我的报告',
    //   uploadUrl: `${env.baseApi}/phs-extend/customer/picTrans?sysCode=${gStores.globalStore.sysCode}`,
    //   // uploadUrl: 'http://10.10.76.236:9907/customer/picTrans?sysCode=1001052',
    // };
    init();
  });
</script>
<style lang="scss" scoped>
  .reportList-container {
    min-height: calc(800upx + 200rpx);
    height: calc(800upx + 200rpx);
    background: linear-gradient(180deg, #c8eaff 1%, #e8fcff);
    border-radius: 24rpx 24rpx 0px 0px;
    transition: 0.5s;
  }
  .page {
    // background-color: #ffffff;
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
      // min-height: calc(800upx + 100rpx);
      // height: calc(800upx + 100rpx);;
      background: linear-gradient(180deg, #f2faff 3%, #ffffff);
      width: 90%;
      margin: auto;
      border-radius: 40rpx;
      box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.06);
      .container-scroll {
        height: 100%;

        .list-block {
          border-left: 2rpx dashed #dddddd;
          margin: 0 32rpx;
          padding: 18rpx;
          .date {
            min-height: 44rpx;
            width: calc(100% - 32rpx);
            color: #888888;
            font-size: var(--hr-font-size-xs);
            line-height: 44rpx;
            // margin-top: 40rpx;
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

  .empty-box {
    position: relative;
    transform: translateY(100%);
  }
  .footer {
    padding: 24rpx 32rpx 48rpx;
    position: relative;
    z-index: 1;
    display: flex;
    gap: 18rpx;
    button {
      flex: 1;
      border-radius: 36rpx;
      margin: 0 10rpx;
    }
  }
  .photo-container {
    height: 700rpx;

    width: 90%;
    margin: auto;
    .sub-title-line {
      top: -70rpx;
      .sub-title {
        flex: 1 1 auto;
      }
      .report-img {
        flex: 0 0 200rpx;
        top: 40rpx;
        image {
          width: 200rpx;
          height: 240rpx;
        }
      }
    }
    .content {
      width: 100%;
      background: linear-gradient(180deg, #f2faff 3%, #ffffff);
      height: calc(100% - 160rpx);
      min-height: 400rpx;
      min-width: 350rpx;
      z-index: 999;
      border-radius: 40rpx;
      box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.06);
      top: -120rpx;

      .upload-description {
        // width: fit-content;
        // margin: auto;
      }
      .report-img {
        justify-content: space-between;
        image {
          width: 290rpx;
          height: 360rpx;
        }
      }
    }
  }

  ::v-deep .popup-container {
    border-radius: 54rpx 54rpx 0px 0px !important ;
  }
  .title {
    .popup-title {
      width: calc(100% - 48rpx);
      text-align: center;
      transform: translateX(24rpx);
    }
  }
</style>
