<template>
  <view class="page">
    <view class="watermarkView">
      <canvas canvas-id="watermarkCanvas"></canvas>
    </view>
    <view class="container">
      <view class="container-block">
        <view class="container-block-top" @click="more">
          <view class="title">{{ checkoutReportList.repName }}</view>
          <view class="patient-information">
            <view class="subhead"
              >患者信息<view class="subhead-detail">
                {{ nameConvert(pat.patientName) }}({{
                  checkoutReportList.cardNumber || pat._showId
                }})&nbsp;&nbsp;<text style="color: #e6e6e6">|</text>&nbsp;&nbsp;{{
                  checkoutReportList.sex || pat.patientSex
                }}&nbsp;&nbsp;<text style="color: #e6e6e6">|</text>&nbsp;&nbsp;{{
                  checkoutReportList.age || pat.patientAge
                }}岁</view
              >
            </view>
            <view class="subhead"
              >报告单号<view
                class="subhead-detail"
                style="width: calc(60%); white-space: wrap"
                >{{ checkoutReportList.repId }}</view
              >
            </view>
            <view class="subhead"
              >报告时间<view class="subhead-detail">{{
                checkoutReportList.repTime
              }}</view>
              <button v-if="!isShow && !checkoutReportList.reminder" class="more-button g-border">
                <template >
                  <view class="more">更多</view>
                  <text class="iconfont">&#xe6c4;</text>
                </template>
              </button>
            </view>
            <view class="hidden-patient-information" v-show="isShow">
              <view v-if="checkoutReportList.regTime" class="subhead"
                >采集时间<view class="subhead-detail">{{
                  checkoutReportList.regTime
                }}</view>
              </view>

              <view v-if="checkoutReportList.serialNo" class="subhead"
                >申请单号<view class="subhead-detail">{{
                  checkoutReportList.serialNo
                }}</view>
              </view>
              <view class="subhead"
                >申请医生<view class="subhead-detail">{{
                  checkoutReportList.applyDoc
                }}</view>
              </view>
              <view class="subhead"
                >报告医生<view class="subhead-detail">{{
                  checkoutReportList.reportDoc
                }}</view>
              </view>
              <view v-if="checkoutReportList.specimen" class="subhead"
                >标本类型<view class="subhead-detail">
                  {{ checkoutReportList.specimen }}
                </view>
              </view>

              <view class="subhead"
                >审核医生<view class="subhead-detail">{{
                  checkoutReportList.passDoc
                }}</view>
                <button class="more-button g-border">
                  <template v-if="isShow && !checkoutReportList.reminder">
                    <view class="more">收起</view>
                    <text class="iconfont">&#xe6c5;</text>
                  </template>
                </button>
              </view>
            </view>
            <view v-if="checkoutReportList.reminder" class="subhead"
              >检验提示<view
                style="color: #296fff; width: calc(60%)"
                class="subhead-detail"
              >
                {{ checkoutReportList.reminder }}
              </view>
              <button class="more-button g-border">
                <template v-if="!isShow">
                  <view class="more">更多</view>
                  <text class="iconfont">&#xe6c4;</text>
                </template>
                <template v-if="isShow">
                  <view class="more">收起</view>
                  <text class="iconfont">&#xe6c5;</text>
                </template>
              </button>
            </view>
          </view>
        </view>
        <view class="container-block-bottom">
          <!-- 细菌培养模块 -->
          <template v-if="checkoutReportList.antiItemResult && checkoutReportList.antiItemResult.length">
            <view class="seen">
              <view class="title">细菌培养</view>
              <!-- 细菌培养存在 -->
              <template v-if="checkoutReportList.antiItemResult[0].antiList">
                <view class="content">{{
                  checkoutReportList.antiItemResult[0].bioName
                }}</view>
                <!-- 抗菌药物内容 -->
                <view class="seen">
                  <view class="title">抗菌药物</view>
                  <view class="table">
                    <view class="table-title">
                      <view class="table-title1 table-title-first">抗菌药物</view>
                      <view class="table-title2 table-title-common">解释</view>
                      <view class="table-title3 table-title-common">结果</view>
                      <view class="table-title4 table-title-common">单位</view>
                      <view class="table-title5 table-title-common">方法</view>
                    </view>
                    <template
                      v-for="(item, index) in checkoutReportList.antiItemResult[0]
                        .antiList"
                      :key="index"
                    >
                      <view class="table-content">
                        <view class="table-title1 table-content-first">{{
                          item.antiName
                        }}</view>
                        <view class="table-title2 table-title-common">{{
                          item.result
                        }}</view>
                        <view
                          v-if="item.antiResult"
                          class="table-title3 table-title-common"
                          >{{ item.antiResult }}</view
                        >
                        <view v-else class="table-title3 table-title-common"
                          ></view
                        >
                        <view class="table-title4 table-title-common">{{
                          item.itemUnits
                        }}</view>
                        <view class="table-title5 table-title-common">{{
                          item.testMethod
                        }}</view>
                      </view>
                    </template>
                  </view>
                </view>
              </template>
              <!-- 细菌培养不存在 -->
              <template v-else>
                <view class="content">未培养出真菌</view>
              </template>
            </view>
          </template>

          <!-- 检验项目模块 -->
          <template v-if="checkoutReportList.normalList && checkoutReportList.normalList.length">
            <view class="seen">
              <view class="title">检验项目</view>
              <view v-if="checkoutReportList.normalList.length != 0" class="table">
                <view class="table-title">
                  <view class="table-title1">检验项目</view>
                  <view class="table-title2 table-title-common">结果</view>
                  <view class="table-title6 table-title-common">参考范围</view>
                  <view class="table-title4 table-title-common">单位</view>
                </view>
                <template v-for="item in checkoutReportList.normalList" :key="item">
                  <view class="table-content">
                    <view class="table-title1">{{ item.itemName }}</view>
                    <view
                      v-if="item.itemVal"
                      class="table-title2 table-title-common"
                      :class="{ down: item.flag == 'L', up: item.flag == 'H' }"
                    >
                      {{ item.itemVal }}<text class="down" v-if="item.flag == 'L'">↓</text
                      ><text class="up" v-if="item.flag == 'H'">↑</text></view
                    >
                    <view v-else class="table-title3 table-title-common"
                      ></view
                    >
                    <view class="table-title6 table-title-common">{{
                      item.normalVal
                    }}</view>
                    <view class="table-title4 table-title-common">{{
                      item.itemUnits
                    }}</view>
                  </view>
                </template>
              </view>
              <view class="content" v-else></view>
            </view>
            <view v-if="pageProps.repType == 1" class="exegesis">
              <view class="exegesis-content">
                <view>注释：</view>
                <view>S表示敏感，SDD表示剂量依赖性敏感</view>
                <view>I表示中介</view>
                <view>R表示耐药</view>
                <view>MIC最低抑菌浓度</view>
                <view>KB琼脂扩散法</view>
                <view>Etest浓度梯度琼脂扩散实验</view>
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>
    <view class="tips">
      <view>{{ tips.title }}：</view>
      <view>{{ tips.content }}</view>
    </view>
    <view class="footer">
        <button class="footer-button"  v-if="pageProps.isDownloadRepor == 1 && pageProps.isGraphic == 1" @click="goReportPdf">
        <view class="icon-font ico_download-blue"></view>
        <view class="title">下载报告</view>
      </button>
      <text style="color: #e6e6e6">|</text>
      <button class="footer-button" @click="shareReport">
        <view class="icon-font ico_share-blue"></view>
        <view class="title">分享报告</view>
      </button>
      <text
        v-if="pageProps.isDoctorCard && checkoutReportList.applyDocId && checkoutReportList.deptId"
        style="color: #e6e6e6"
        >|</text
      >
      <button
        v-if=" pageProps.isDoctorCard && checkoutReportList.applyDocId && checkoutReportList.deptId"
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
        <text> 检查报告链接有效期至{{ shareEndTime || "YYYY-MM-DD" }}。 </text>
        <text> \n链接：{{ qrVal }} </text>
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
  <g-message />
</template>
<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import api from "@/service/api";
import global from '@/config/global';

import {
  checkoutReportDetails,
  getShareTotalUrl,
  addWatermark
} from "./utils";
import { GStores,nameConvert } from "@/utils";
import { joinQuery, encryptDes, getSysCode } from "@/common";
import { deQueryForUrl } from "@/common";
import { useReportPowerEnerg } from "@/components/greenPower";

import GreenToast from '@/components/greenPower/greenToast.vue';

const alipayPid = global.systemInfo.alipayPid;

const {
  contentTitle,
  greenToastContent,
  greenToastDuration,
  getPowerEnerg
} = useReportPowerEnerg();

const isShow = ref(false);
const checkoutReportList = ref<checkoutReportDetails>({});
const more = () => {
  isShow.value = !isShow.value;
};
const tips = ref({
  title: "",
  content: "",
});
const getTips = async () => {
  const { result } = await api.getSysAppMore({
    typeFlag: 7,
  });
  tips.value = result;
};

const gStore = new GStores();
const pat = gStore.userStore.patChoose;
const pageProps = ref(<any>{});

onLoad((p) => {
  pageProps.value = deQueryForUrl(p);
});

const getCheckoutReportDetails = async () => {
  const { repId, repType, hosId, extend } = pageProps.value;
  let params = {
    hosId: hosId,
    patientId: pat.patientId,
    repId: repId,
    repType: repType,
    sysCode: pat.sysCode,
    extend: decodeURIComponent(extend),
  };
  const { result } = await api.getCheckoutReportDetails(params);
  checkoutReportList.value = result;
  if(alipayPid) {
    getPowerEnerg(repId);
  }
  console.log(checkoutReportList.value);
};
const goDoctor = () => {
  const path = "/pagesA/MyRegistration/DoctorDetails";
  uni.navigateTo({
    url: joinQuery(path, {
      hosDocId: checkoutReportList.value.applyDocId,
      hosDeptId: checkoutReportList.value.deptId,
    }),
  });
};
const qrVal = ref();
const dateNow = ref();
const my_endDate = ref();
const shareEndTime = ref();
const isDialogShow = ref();
const isOperation = ref(false);
const options = ref({
  // 二维码
  size: 400,
  code: '',
});
const shareReport = () => {
  isOperation.value = false;
  getShareTotalUrl(
    pageProps.value,
    "pagesB/reportQuery/InspectionDetails"
  ).then((url) => {
    qrVal.value = url;
    options.value.code = url as string
    dateNow.value = new Date().getTime();
    my_endDate.value = 1000 * 60 * 60 * 24 * 7 + dateNow.value;
    shareEndTime.value = dayjs(my_endDate.value).format("YYYY-MM-DD");
    isDialogShow.value.show();
  });
};
const forShare = () => {
  const data = `${checkoutReportList.value.repName}的检查报告,分享链接有效期至${
    shareEndTime.value || "YYYY-MM-DD"
  }。 ${qrVal.value}`;
  uni.setClipboardData({
    data,
    success: () => {
      isOperation.value = true;
      uni.getClipboardData({
        success: function (res) {
          gStore.messageStore.showMessage("内容已复制");
          console.log(res.data);
        },
      });
    },
    fail: () => {
      gStore.messageStore.showMessage("复制失败");
      isOperation.value = false;
    },
  });
};
const goReportPdf = () => {
  let { repId, repName } = checkoutReportList.value;

  repId = encodeURIComponent(encryptDes(repId + "", "phsDesKey"));
  const {reportType} = pageProps.value
  uni.navigateTo({
    url: joinQuery("/pagesC/cloudHospital/myPath?path=/pagesB/reportQuery/reportPdf", {
      repName,
      repId,
      reportType,
    }),
  });
};
onMounted(() => {
  getTips();
  getCheckoutReportDetails();
  if ( pageProps.value.isWatermark &&  pageProps.value.watermarkText) {
    addWatermark( pageProps.value.watermarkText);
  }
});
</script>
<style lang="scss" scoped>
.page {
  height: auto;
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
  .container {
    margin: 0 auto;
    width: 686rpx;
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
        position: relative;
        z-index: 99;
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
          font-size: 28rpx;
          .subhead {
            margin-top: 8rpx;
            color: #888888;
            display: flex;
            position: relative;
            .subhead-detail {
              margin-left: 16rpx;
              max-width: 400rpx;
              color: #444444;
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
                font-size: 24rpx;
                color: #888888;
              }
              .iconfont {
                font-size: 32rpx;
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
          .title {
            font-size: 36rpx;
            font-weight: 600;
            margin-left: 24rpx;
            margin-bottom: 16rpx;
          }
          .content {
            margin-top: 16rpx;
            margin-left: 24rpx;
          }
          .table {
            margin: 0 24rpx;
            box-sizing: border-box;
            .table-title {
              height: 72rpx;
              // width: calc(100% - 16rpx);
              background-color: #f6f6f6;
              font-size: 28rpx;
              color: #888888;
              display: flex;
              align-items: center;
              padding: 0 16rpx;
            }
            .table-content {
              // width: calc(100% - 16rpx);
              background-color: #f5f7ff;
              font-size: 28rpx;
              display: flex;
              margin-top: 8rpx;
              padding: 14rpx 16rpx;
              align-items: center;
            }
            .table-title-common {
              text-align: center;
            }
            .table-title1 {
              width: 33%;
              display: block;
              text-overflow: ellipsis;
              word-wrap: break-word;
            }
            .table-title2 {
              width: 16%;
            }
            .table-title3 {
              width: 18.5%;
            }
            .table-title4 {
              width: 14%;
            }
            .table-title5 {
              width: 16%;
            }
            .table-title6 {
              width: 31%;
            }
            .down {
              color: #296fff;
            }
            .up {
              color: #ff5040;
            }
          }
        }
        .exegesis {
          height: auto;
          // width: calc(100% - 64rpx);
          margin-left: 24rpx;
          color: #888888;
          font-size: 28rpx;
          margin-top: 40rpx;
        }
      }
    }
  }
  .tips {
    margin-left: 32rpx;
    // width: calc(100% - 64rpx);
    color: #888888;
    margin-top: 40rpx;
    font-size: 28rpx;
    padding-bottom: 192rpx;
  }
  .footer {
    height: 96rpx;
    padding-bottom: 68rpx;
    width: 100%;
    background-color: #fff;
    line-height: 96rpx;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    z-index: 99;
    .footer-button {
      height: 96rpx;
      width: 100%;
      line-height: 96rpx;
      display: flex;
      justify-content: center;
      background-color: #fff;
      border-radius: 0rpx;
      .title {
        font-size: 28rpx;
        text-align: center;
      }
      .icon-font {
        width: 40rpx;
        height: 40rpx;
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
    font-size: 32rpx;
    color: #444444;
  }
  .popup-tki {
    display: flex;
    justify-content: center;
  }

  .popup-href {
    margin: 24rpx 0 80rpx 0;
    font-size: 28rpx;
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
    font-size: 36rpx;
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
uni-button::after {
  display: none;
  width: 0px;
  height: 0px;
}
</style>
