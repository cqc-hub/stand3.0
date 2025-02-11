<template>
  <g-popup title="报告解读" ref="reportPopupRef">
    <view
      class="reportList-container page g-page"
      :class="{
        'system-mode-old': gStores.globalStore.modeOld,
      }"
    >
      <view v-if="isPhoto" class="photo-container">
        <view class="form-textarea">
          <view class="title">
            <label></label>
            {{ ImgUploadOption.title }}
          </view>
          <view>
            <view class="list-cell">
              <view
                hover-class="uploader-hover"
                v-for="(item, index) in uploadImgList"
                :key="index"
                class="uploader-inputbox show-img"
              >
                <image class="show-image" :src="item"></image>
                <text class="show-text" @click="deleteImage(index)">x</text>
              </view>
              <view
                v-if="uploadImgList.length < ImgUploadOption.count"
                hover-class="uploader-hover"
                class="uploader-inputbox camera-photo"
                @tap="addPhoto"
              >
                <image
                  class="camera-image"
                  :src="ImgUploadOption.cameraPhoto"
                ></image>

                <view class="text">上&nbsp;&nbsp;传</view>
              </view>
            </view>
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

      <view class="g-footer">
        <button class="btn btn-border btn-normal" @click="isPhoto = !isPhoto">
          {{ isPhoto ? '选择本院报告' : '选择上传报告' }}
        </button>
        <button class="btn btn-primary btn-border" @click="inspectionAnalysis">
          进行报告解读
        </button>
      </view>
    </view>
  </g-popup>
</template>
<script setup lang="ts">
  import { ref, nextTick, computed, onMounted, onUpdated } from 'vue';
  import { reportPopupRef } from '../utils/utils';
  import { ServerStaticData, ISystemConfig, wait, GStores,apiAsync } from '@/utils';
  import { deepClone, deQueryForUrl } from '@/common/utils';
  import advisoryItem from './advisoryItem.vue';
  import env from '@/config/env';
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
  const ImgUploadOption = ref<any>({});
  const isPhoto = ref(true);
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
    height: 840,
    loadFailText: '加载失败',
    noMoreText: '没有更多了',
  });

  const emits = defineEmits(['inspection-analysis']);

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
              console.log('_____________item', item);
              return item;
            });
          }
        });
      }
    });
  };

  const inspectionAnalysis = () => {
    emits('inspection-analysis', checkedList.value);
  };
  const init = async () => {
    if (tabs.value?.length) {
      tabs.value.map(({ typeId }, i) => {
        pageList.value[typeId] = [];
      });
    }
  };
  const addPhoto = async () => {
    const { tempFilePaths } = await apiAsync(uni.chooseImage, {
      count: ImgUploadOption.value.count - uploadImgList.value.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    });
    for (let i = 0, len = tempFilePaths?.length; i < len; i++) {
       // @ts-expect-error
       const { data} = await apiAsync(uni.uploadFile, {
        url: ImgUploadOption.value.uploadUrl,
        filePath: tempFilePaths[i],
        name: 'file',
        fileType: 'image',
        formData: {
          imageName: `${ImgUploadOption.value.imageName}_${new Date().getTime()}${tempFilePaths[
            i
          ].slice(tempFilePaths[i].lastIndexOf('.'))}`,
          sysCode: gStores.globalStore.sysCode,
          Authorization: gStores.globalStore.token.accessToken,
          phsId:81681688
        },
      });
      var jsonData = JSON.parse(data) as {
        code: number;
        result: string;
        message: string;
      };
    }
  };
  const deleteImage = async (index) => {
    let tempData = { ...uploadImgList.value };
    uploadImgList.value = tempData
      .slice(0, index)
      .concat(tempData.slice(index + 1));
  };

  onMounted(async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('reportQuery');
    ImgUploadOption.value = {
      count: 3,
      title: '选择我的报告',
      uploadUrl: `${env.baseApi}/phs-extend/customer/picTrans?sysCode=${gStores.globalStore.sysCode}`,
    };
    init();
  });
</script>
<style lang="scss" scoped>
  .reportList-container {
    min-height: calc(800upx + 200rpx);
    height: calc(800upx + 200rpx);
  }
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
      max-height: calc(800upx + 200rpx);
      height: calc(800upx + 200rpx);
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

  .empty-box {
    position: relative;
    transform: translateY(100%);
  }
  .g-footer {
    display: flex;
    button {
      flex: 1;
    }
  }
  .photo-container {
    height: 840rpx;
  }

  .form-textarea {
    padding: 20rpx 30rpx;

    .title {
      color: #666;
      margin-bottom: 10rpx;
      label {
        color: #e5493b;
        margin-left: 10px;
      }
    }
    .list-cell {
      display: flex;
      .uploader-hover {
      }
      .uploader-inputbox {
        position: relative;
        margin-bottom: 16rpx;
        box-sizing: border-box;
        background-color: #ededed;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;

        .uploader-img-wrap {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
      }
      .show-img {
        width: 162rpx;
        height: 162rpx;
        margin-right: 20rpx;
        .show-image {
          width: 162rpx;
          height: 162rpx;
          border-radius: 8rpx;
        }
        .show-text {
          position: absolute;
          right: 20rpx;
          top: -5rpx;
          color: #fff;
        }
      }
      .camera-photo {
        width: 162rpx;
        height: 162rpx;
        .camera-image {
          width: 100rpx;
          height: 100rpx;
        }
        .text {
          color: #666;
          font-size: 28rpx;
          position: relative;
          top: 0rpx;
        }
      }
    }
  }
</style>
