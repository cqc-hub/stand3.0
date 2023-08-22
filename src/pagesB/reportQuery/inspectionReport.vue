<template>
  <view
    :class="{
      'system-mode-old': gStore.globalStore.modeOld,
    }"
    class="page"
    scroll-y="true"
  >
    <view class="watermarkView">
      <canvas canvas-id="watermarkCanvas"></canvas>
    </view>

    <!-- <view
      class="block-top"
      @click="gotoMedical"
      v-if="examineReportList.yunUrl"
    >
      <image class="nav" :src="$global.BASE_IMG + 'yun_banner.png'" />
    </view> -->
    <view class="top bgc" v-if="btnNumber && btnNumber > 1">
      <scroll-view
        class="scroll-view_H"
        scroll-x="true"
        :scroll-into-view="toView"
      >
        <template v-for="(item, index) in btnNumber" :key="index">
          <view :id="'item' + index" class="scroll-view-item">
            <button
              class="reportButton"
              :class="{
                chooseBtn: chooseBtn == index,
                finallyBtn: index == btnNumber - 1,
              }"
              @click="choose(index)"
            >
              报告{{ chnNumChar[index] }}
            </button>
          </view>
        </template>
      </scroll-view>
    </view>
    <view class="container" :class="{ isShowTop: btnNumber && btnNumber > 1 }">
      <template
        v-for="(item, index) in examineReportList.detailsResult"
        :key="index"
      >
        <view
          class="container-block"
          :class="{ containerBlockFirst: index == 0 && btnNumber.length > 0 }"
        >
          <view class="container-block-top">
            <view class="container-top-click" @click="more(index)">
              <view class="title">{{ item.repName }}</view>
              <view class="patient-information">
                <view
                  v-if="pageProps._scan !== '1'"
                  @click.stop="isClose = !isClose"
                  class="subhead"
                >
                  患者信息
                  <view class="subhead-detail">
                    <text class="mr12">
                      {{ isClose ? nameConvert(patName) : patName }}({{
                        patCardNumber
                      }})
                    </text>

                    <text
                      :class="`iconfont icon-resize`"
                      class="g-split-line mr12 pr12"
                    >
                      {{ isClose ? '&#xe6d4;' : '&#xe6db;' }}
                    </text>

                    <text class="g-split-line mr12 pr12">
                      {{ examineReportList.sex || pat.patientSex }}
                    </text>

                    <text class="text-no-wrap">
                      {{ examineReportList.age || pat.patientAge }}岁
                    </text>
                  </view>
                </view>
                <view class="subhead">
                  报告单号
                  <view class="subhead-detail">{{ item.repId }}</view>
                  <button
                    v-if="isShow[index] == 0"
                    class="more-button g-border"
                  >
                    <template>
                      <view class="more">更多</view>
                      <text class="iconfont">&#xe6c4;</text>
                    </template>
                  </button>
                </view>
                <!-- <view v-if="item.diagnosis" class="subhead">检验提示<view style="color:#296FFF;width: calc(60%);" class="subhead-detail">{{item.diagnosis}}
                </view>
              </view> -->
                <view
                  class="hidden-patient-information"
                  v-show="isShow[index] == 1"
                >
                  <view class="subhead" v-if="item.regTime">
                    采集时间
                    <view class="subhead-detail">{{ item.regTime }}</view>
                  </view>
                  <view v-if="item.repTime" class="subhead">
                    报告时间
                    <view class="subhead-detail">{{ item.repTime }}</view>
                  </view>
                  <view class="subhead" v-if="item.serialNo">
                    申请单号
                    <view class="subhead-detail">{{ item.serialNo }}</view>
                  </view>
                  <view v-if="item.applyDoc" class="subhead">
                    申请医生
                    <view class="subhead-detail">{{ item.applyDoc }}</view>
                  </view>
                  <view v-if="item.reportDoc" class="subhead">
                    报告医生
                    <view class="subhead-detail">{{ item.reportDoc }}</view>
                  </view>
                  <view class="subhead">
                    <text v-if="item.passDoc">审核医生</text>
                    <view v-if="item.passDoc" class="subhead-detail">
                      {{ item.passDoc }}
                    </view>
                    <button class="more-button g-border">
                      <template v-if="isShow[index] != 0">
                        <view class="more">收起</view>
                        <text class="iconfont">&#xe6c5;</text>
                      </template>
                    </button>
                  </view>
                </view>
              </view>
            </view>
            <view class="button-list">
              <button
                class="button"
                :class="{ onlyOneButton: !item.dicomList }"
                @click="goReportPdf(item)"
                v-if="
                  pageProps.isDownloadRepor == 1 && pageProps.isGraphic == 1
                "
              >
                <view class="icon-font ico_sy_paper1"></view>
                图文报告
              </button>
              <button
                class="button"
                v-if="examineReportList.yunUrl"
                @click="gotoMedical"
              >
                <view class="icon-font ico_cloud"></view>
                云影像
              </button>
            </view>
          </view>
          <view class="container-block-bottom">
            <view class="seen" v-if="item.description">
              <view class="title">所见</view>
              <view class="content">{{ item.description }}</view>
            </view>
            <view
              class="seen"
              v-if="item.diagnosis || examineReportList.diagnosis"
            >
              <view class="title">印象</view>
              <view class="content">
                {{ item.diagnosis || examineReportList.diagnosis }}
              </view>
            </view>
            <view class="seen" v-if="item.suggest">
              <view class="title">建议</view>
              <view class="content">{{ item.suggest }}</view>
            </view>
          </view>
        </view>
      </template>
    </view>
    <view class="tips">
      <view>{{ tips.title }}：</view>
      <view>{{ tips.content }}</view>
    </view>
    <view class="footer">
      <button
        class="footer-button"
        v-if="pageProps.isDownloadRepor == 1 && pageProps.isGraphic == 1"
        @click="downloadReport"
      >
        <view class="icon-font ico_download-blue"></view>
        <view class="title">下载报告</view>
      </button>
      <!-- #ifdef MP-WEIXIN -->
      <block v-if="pageProps._scan !== '1'">
        <text style="color: #e6e6e6">|</text>
        <button class="footer-button" @click="shareReport">
          <view class="icon-font ico_share-blue"></view>
          <view class="title">分享报告</view>
        </button>
      </block>
      <!-- #endif -->
      <text
        style="color: #e6e6e6"
        v-if="
          pageProps.isDoctorCard &&
          examineReportList.applyDocId &&
          examineReportList.deptId
        "
      >
        |
      </text>
      <button
        v-if="
          pageProps.isDoctorCard &&
          examineReportList.applyDocId &&
          examineReportList.deptId
        "
        class="footer-button"
        @click="goDoctor"
      >
        <view class="icon-font ico_doctor-blue"></view>
        <view class="title">咨询医生</view>
      </button>
    </view>
  </view>

  <!--  #ifdef MP-ALIPAY -->
  <template v-if="alipayPid">
    <Green-Toast
      :contentTitle="contentTitle"
      :duration="greenToastDuration"
      v-model:content="greenToastContent"
    />
  </template>
  <!--  #endif -->

  <g-popup title="分享报告" ref="isDialogShow">
    <view v-if="qrVal" class="popup-content">
      <view class="title">截图保存二维码或复制链接分享报告</view>
      <view class="popup-tki">
        <w-qrcode :options="options" />
      </view>
      <view class="popup-href">
        <text>检验报告链接有效期至{{ shareEndTime || 'YYYY-MM-DD' }}。</text>
        <text>\n链接：{{ qrVal }}</text>
      </view>

      <view class="popup-operator">
        <view v-if="isOperation" class="popup-un-operator">
          <text class="iconfont color-blue">&#xe6c7;</text>
          复制成功 去分享
        </view>

        <button
          v-else
          @click="forShare"
          style="width: 100%"
          class="btn btn-primary flex-normal"
        >
          <text class="iconfont color-fff">&#xe716;</text>
          点击复制链接
        </button>
      </view>
    </view>
  </g-popup>
  <wyb-action-sheet
    ref="actionSheet"
    :options="actionSheetOpt"
    :showCancel="false"
    :duration="100"
    @itemclick="actionItemClick"
    title="选择报告"
  />
  <g-popup title="复制链接下载报告" ref="popup">
    <view class="pop-container flex-normal flex-column">
      <view class="flex1 dialog-container g-break-word color-444 f32">
        <text class="mr12">链接:</text>
        <text>{{ getPdfUrl(downloadRepId) }}</text>
      </view>

      <button
        v-if="!isCopySuccess"
        @click="copyUrlLink"
        style="width: 100%"
        class="btn btn-primary flex-normal"
      >
        <view class="text-no-wrap flex-normal">
          <text class="iconfont color-fff g-bold-normal mr12">&#xe716;</text>
          <view>点击复制链接</view>
        </view>
      </button>

      <view v-else class="g-flex-rc-cc color-blue f36 text-no-wrap">
        <text class="iconfont color-blue f40 mr12">&#xe6c7;</text>
        <text class="g-bold">复制成功 去浏览器粘贴</text>
      </view>
    </view>
  </g-popup>
  <g-message />
</template>
<script lang="ts" setup>
  import { onLoad, onPageScroll } from '@dcloudio/uni-app';
  import { ref, onMounted, computed, nextTick, onUpdated } from 'vue';

  import global from '@/config/global';
  import api from '@/service/api';
  import dayjs from 'dayjs';
  import env from '@/config/env';

  import {
    examineReportDetails,
    getShareTotalUrl,
    addWatermark,
  } from './utils';
  import { GStores, nameConvert, wait, throttle } from '@/utils';
  import { joinQuery, encryptDes, getSysCode } from '@/common';
  import { deQueryForUrl } from '@/common';
  import { useReportPowerEnerg } from '@/components/greenPower';

  import GreenToast from '@/components/greenPower/greenToast.vue';

  const alipayPid = global.systemInfo.alipayPid;
  let isScrollCheck = true;

  const { contentTitle, greenToastContent, greenToastDuration, getPowerEnerg } =
    useReportPowerEnerg();
  const isDialogShow = ref();
  const isOperation = ref(false);
  const isClose = ref(true);

  const btnNumber = ref();
  var chnNumChar = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const top = ref(0);
  const isShow = ref<number[]>([]);
  const windowInfo = ref();
  const examineReportList = ref<examineReportDetails>({} as any);
  const qrVal = ref();

  const options = ref({
    // 二维码
    size: 400,
    code: '',
  });

  const more = (index) => {
    // boxTop.value=[]
    // nextTick(()=>{
    //   getBoxTop()
    // })
    if (isShow.value[index] == 0) {
      isShow.value[index] = 1;
    } else {
      isShow.value[index] = 0;
    }
  };
  const item = ref();
  const result = ref();
  const chooseBtn = ref(0);
  const toView = ref('item0');
  const choose = (index) => {
    if (chooseBtn.value === index) {
      return;
    }
    chooseBtn.value = index;
    toView.value = 'item' + index;
    //按钮锚点
    //页面锚点实现
    uni
      .createSelectorQuery()
      .selectAll('.container-block')
      .boundingClientRect((data) => {
        item.value = data[index]; //目标位置的节点：类class或者id

        uni
          .createSelectorQuery()
          .select('.page')
          .boundingClientRect((res) => {
            result.value = res; //最外层盒子的节点：类class或者id
            const scrollTop = boxTop.value.reduce((p, c, idx) => {
              if (idx < index) {
                p += c.height;
              }

              return p;
            }, 0);

            isScrollCheck = false;
            uni.pageScrollTo({
              duration: 0,
              // scrollTop:data.top-50 - res.top,//到达距离顶部的top值 根据自己情况可调
              scrollTop,
            });
            getBoxTop();

            setTimeout(() => {
              isScrollCheck = true;
            }, 100);
          })
          .exec();
      })
      .exec();
  };
  const domData = ref();
  let dealScroll = (e) => {
    if (!isScrollCheck) {
      return;
    }
    top.value = e.scrollTop;
    if (top.value > 0) {
      uni
        .createSelectorQuery()
        .selectAll('.container-block')
        .boundingClientRect((data) => {
          domData.value = data;

          let heightNow = 0;
          const offTops: number[] = [];
          for (let i = 0; i < domData.value.length; i++) {
            const el = domData.value[i];
            offTops.push(Math.abs(top.value - heightNow));
            heightNow += el.height;
          }

          const minValue = Math.min(...offTops);
          const minIdx = offTops.findIndex((o) => o === minValue);

          chooseBtn.value = minIdx;
          toView.value = 'item' + minIdx;
        })
        .exec();
    }
  };

  dealScroll = throttle(dealScroll, 300);

  onPageScroll((e) => {
    dealScroll(e);
  });
  const boxTop = ref();
  const getBoxTop = () => {
    nextTick(() => {
      uni
        .createSelectorQuery()
        .selectAll('.container-block')
        .boundingClientRect((data) => {
          boxTop.value = data;
        })
        .exec();
    });
  };
  const tips = ref({
    title: '',
    content: '',
  });
  const getTips = async () => {
    const { result } = await api.getSysAppMore({
      typeFlag: 6,
    });
    tips.value = result;
  };
  const pageProps = ref(<any>{});


  const gStore = new GStores();
  const pat = gStore.userStore.patChoose;
  const patName = computed(() => {
    return examineReportList.value.patientName || pat.patientName
  })
  const patCardNumber = computed(() => {
    return examineReportList.value.cardNumber || pat.cardNumber
  })

  onLoad((p) => {
    pageProps.value = deQueryForUrl(p);
    pageProps.value = deQueryForUrl(pageProps.value);
    pageProps.value = deQueryForUrl(pageProps.value);
  });

  const getInspectionReportList = async () => {
    const { repId, examClassName, hosId, extend } = pageProps.value;
    let params = {
      hosId: hosId,
      patientId: pat.patientId,
      repId: repId,
      examClassName: examClassName,
      extend: decodeURIComponent(extend),
    };
    const { result } = await api.getExamineReportDetails(params);
    examineReportList.value = result;
    btnNumber.value = examineReportList.value.detailsResult?.length;
    for (var i = 0; i < btnNumber.value; i++) {
      isShow.value.push(0);
    }
    if (alipayPid) {
      getPowerEnerg(repId);
    }
  };
  const goReportPdf = (item) => {
    let { repId, repName } = item;
    const { reportType } = pageProps.value;
    repId = encodeURIComponent(encryptDes(repId + '', 'phsDesKey'));
    uni.navigateTo({
      url: joinQuery(
        '/pagesC/cloudHospital/myPath?path=/pagesB/reportQuery/reportPdf',
        {
          repName,
          repId,
          reportType,
        }
      ),
    });
  };
  const dateNow = ref();
  const my_endDate = ref();
  const shareEndTime = ref();
  const shareReport = () => {
    isOperation.value = false;
    getShareTotalUrl(
      {
        ...pageProps.value,
        watermarkText: undefined,
      },
      'pagesB/reportQuery/inspectionReport'
    ).then((url) => {
      qrVal.value = url;
      options.value.code = url as string;
      dateNow.value = new Date().getTime();
      my_endDate.value = 1000 * 60 * 60 * 24 * 7 + dateNow.value;
      shareEndTime.value = dayjs(my_endDate.value).format('YYYY-MM-DD');
      isDialogShow.value.show();
    });
  };
  const forShare = () => {
    const data = `${
      gStore.userStore.patChoose.patientName
    }的检查报告,分享链接有效期至${shareEndTime.value || 'YYYY-MM-DD'}。 ${
      qrVal.value
    }`;
    uni.setClipboardData({
      data,
      success: () => {
        isOperation.value = true;
        uni.getClipboardData({
          success: function (res) {
            gStore.messageStore.showMessage('内容已复制');
          },
        });
      },
      fail: () => {
        gStore.messageStore.showMessage('复制失败');
        isOperation.value = false;
      },
    });
  };
  const goDoctor = () => {
    const path = '/pagesA/MyRegistration/DoctorDetails';
    uni.navigateTo({
      url: joinQuery(path, {
        hosDocId: examineReportList.value.applyDocId,
        hosDeptId: examineReportList.value.deptId,
      }),
    });
  };
  const actionSheet = ref();
  const downloadReport = () => {
    if (btnNumber.value && btnNumber.value > 1) {
      actionSheet.value.showActionSheet();
    } else {
      let data = examineReportList.value.detailsResult;
      goReportPdf(data![0]);
    }
  };
  const actionSheetOpt = computed(() => {
    return examineReportList.value.detailsResult?.map((item, index) => {
      return {
        label: `报告${chnNumChar[index]}`,
        value: item,
      };
    });
  });

  const getPdfUrl = (repId) => {
    const { reportType } = pageProps.value;
    return joinQuery(env.baseApi + `/phs-query/examine/getPdf`, {
      sysCode: getSysCode(),
      fileName: 'bg',
      reportType,
      repId,
    });
  };
  const isCopySuccess = ref(false);

  const copyUrlLink = () => {
    uni.setClipboardData({
      data: getPdfUrl(downloadRepId.value),
      success: function () {
        isCopySuccess.value = true;
        gStore.messageStore.showMessage('复制链接成功!', 3000, {
          uniToast: true,
        });
      },
      fail() {
        gStore.messageStore.showMessage('剪贴失败!!', 3000);
      },
    });
  };
  const downloadRepId = ref();
  const popup = ref();
  const actionItemClick = ({ item }) => {
    downloadRepId.value = encodeURIComponent(
      encryptDes(item.repId + '', 'phsDesKey')
    );
    getPdfUrl(downloadRepId.value);
    // #ifdef H5
    location.href = getPdfUrl(downloadRepId.value);
    // #endif
    // #ifndef H5
    popup.value.show();
    // #endif
    // if (isH5()) {
    //   location.href = getPdfUrl(downloadRepId.value);
    // } else {
    //   popup.value.show();
    // }
  };

  const gotoMedical = () => {
    uni.navigateTo({
      url: `/pagesA/webView/webView?https=${encodeURIComponent(
        examineReportList.value.yunUrl!
      )}`,
    });
  };

  onMounted(async () => {
    await wait(600);

    windowInfo.value = uni.getSystemInfoSync();
    getTips();
    getInspectionReportList();
    if (pageProps.value.isWatermark === '1') {
      addWatermark(global.systemInfo.name);
    }
  });
  onUpdated(() => {
    getBoxTop();
  });
</script>
<style lang="scss" scoped>
  .page {
    // height: auto;
    width: 100%;
    flex-direction: column;
    background-color: #f6f6f6;
    position: relative;
    .watermarkView {
      position: absolute;
      z-index: 1;
      opacity: 0.9;
      top: 0rpx;
      width: 100%;
      canvas {
        width: 100%;
        height: 100vh;
        bottom: 96rpx;
      }
    }
    .top {
      height: 96rpx;
      width: 100%;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 999;
      &.bgc {
        background-color: #fff;
      }
      .scroll-view_H {
        white-space: nowrap;
        width: 100%;
        margin-left: 16rpx;
      }
      .scroll-view-item {
        display: inline-block;
      }
      .reportButton {
        margin-left: 16rpx;
        height: 64rpx;
        width: 164rpx;
        font-size: var(--hr-font-size-xs);
        text-align: center;
        line-height: 64rpx;
        margin-top: 16rpx;
        background-color: #fff;
        border-radius: 16rpx;
        border: 2rpx solid #cccccc;
        &.chooseBtn {
          background-color: #ebf1ff;
          color: #296fff;
          border: 2rpx solid #296fff;
        }
        &.finallyBtn {
          margin-right: 32rpx;
        }
      }
    }
    .container {
      margin: 0 auto;
      width: 686rpx;
      &.isShowTop {
        margin-top: 96rpx;
      }
      .container-block {
        width: 100%;
        height: 100%;
        margin-top: 24rpx;
        .container-block-top {
          // width: calc(100% - 64rpx);
          background: linear-gradient(0deg, #ffffff, #e9f0ff);
          border-radius: 16rpx 16rpx 0rpx 0rpx;
          box-shadow: 0rpx 1rpx 0rpx 0rpx #e6e6;
          border: 1rpx solid #e6e6e6;
          padding-bottom: 40rpx;
          .container-top-click {
            position: relative;
            width: 100%;
            height: 100%;
            z-index: 50;
          }
          .title {
            // width: calc(100% - 32rpx);
            font-size: 44rpx;
            font-weight: 600;
            margin-left: 32rpx;
            padding-top: 40rpx;
          }
          .patient-information {
            // width: calc(100% - 32rpx);
            margin-left: 32rpx;
            margin-top: 16rpx;
            font-size: var(--hr-font-size-xs);
            .subhead {
              margin-top: 8rpx;
              color: #888888;
              display: flex;
              position: relative;
              .subhead-detail {
                margin-left: 16rpx;
                color: #444444;
                max-width: 400rpx;
                word-wrap: break-word;
              }
              .more-button {
                height: 40rpx;
                position: absolute;
                right: 0rpx;
                background-color: rgb(0, 0, 0, 0);
                line-height: 40rpx;
                display: flex;
                z-index: 99;
                text-align: left;
                justify-content: center;
                align-items: center;
                .more {
                  height: 40rpx;
                  font-size: var(--hr-font-size-xxxs);
                  color: #888888;
                }
                .iconfont {
                  font-size: var(--hr-font-size-base);
                }

                &::after {
                  border: none;
                }
              }
            }
            // .hidden-patient-information {
            //   opacity: 0;
            //   height: 0rpx;
            //   &.showPatientInformation {
            //     height: auto;
            //     opacity: 1;
            //   }
            // }
          }
          .button-list {
            margin-top: 32rpx;
            display: flex;
            position: relative;
            justify-content: space-evenly;
            z-index: 99;
            .button {
              border-radius: 16rpx;
              height: 80rpx;
              width: 304rpx;
              border: 2rpx solid #cccccc;
              background-color: #fff;
              line-height: 80rpx;
              font-size: var(--hr-font-size-xs);
              font-weight: 600;
              display: flex;
              justify-content: center;
              margin: 0 !important;
              .icon-font {
                width: 32rpx;
                height: 32rpx;
                margin-top: 24rpx;
                margin-right: 10rpx;
              }
            }
          }
        }
        .container-block-bottom {
          // width: calc(100% - 64rpx);
          border-radius: 0rpx 0rpx 16rpx 16rpx;
          background-color: #fff;
          border-left: 1rpx solid #e6e6e6;
          border-right: 1rpx solid #e6e6e6;
          border-bottom: 1rpx solid #e6e6e6;
          padding-bottom: 48rpx;
          .seen {
            padding-top: 40rpx;
            margin-left: 32rpx;
            white-space: pre-wrap;
            .title {
              font-size: var(--hr-font-size-xl);
              font-weight: 600;
            }
            .content {
              margin-top: 16rpx;
              width: calc(100% - 64rpx);
              white-space: pre-wrap;
              line-height: 48rpx;
              color: #444;
              word-break: break-all;
            }
          }
        }
      }
      .containerBlockFirst {
        padding-top: 96rpx;
        width: 100%;
        height: 100%;
      }
    }
    .tips {
      margin-left: 32rpx;
      // width: calc(100% - 64rpx);
      color: #888888;
      margin-top: 40rpx;
      font-size: var(--hr-font-size-xs);
      padding-bottom: 206rpx;
    }
    .footer {
      height: 96rpx;
      // padding-bottom: 68rpx;
      width: 100%;
      display: flex;
      background-color: #fff;
      line-height: 96rpx;
      position: fixed;
      z-index: 99;
      left: 0;
      bottom: 0;
      .footer-button {
        height: 96rpx;
        width: 100%;
        line-height: 96rpx;
        display: flex;
        justify-content: center;
        background-color: #fff;
        border-radius: 0rpx;
        .title {
          font-size: var(--hr-font-size-base);
          text-align: center;
        }
        .icon-font {
          width: 44rpx;
          height: 44rpx;
          margin-top: 28rpx;
        }
      }
    }
  }
  .popup-content {
    position: relative;
    z-index: 666;
    padding: 40rpx 32rpx;
    .title {
      text-align: center;
      margin-bottom: 40rpx;
      font-size: var(--hr-font-size-base);
      color: #444444;
    }
    .popup-tki {
      display: flex;
      justify-content: center;
    }

    .popup-href {
      margin: 24rpx 0 80rpx 0;
      font-size: var(--hr-font-size-xs);
      color: #888888;
      white-space: normal;
      word-break: break-all;

      overflow-y: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }

    .popup-operator {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #296fff;
      font-size: var(--hr-font-size-xl);
      .popup-un-operator {
        display: flex;
        align-items: center;
        height: 96rpx;
      }
      .iconfont {
        font-size: 46rpx;
        margin-right: 22rpx;
      }
    }
  }
  .pop-container {
    height: 400rpx;
    padding: 32rpx 0;

    .dialog-container {
      margin: 0 32rpx;
      width: calc(100vw - 64rpx);
    }
  }
  .onlyOneButton {
    width: 622rpx !important;
  }

  .block-top {
    margin-top: -20rpx;
    position: relative;
    z-index: 10;

    image {
      width: 100%;
      height: 200rpx;
    }
  }
</style>
