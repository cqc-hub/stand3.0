<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="page f32"
  >
    <view class="watermarkView">
      <canvas canvas-id="watermarkCanvas"></canvas>
    </view>
    <view class="container">
      <view class="container-block mt24">
        <view class="container-block-top" @click="more">
          <view class="flex-between flex-start">
            <view class="title flex1">{{ checkoutReportList.repName }}</view>

            <view
              v-if="
                pageConfig.isOpenCollect === '1' &&
                gStores.globalStore.isLogin &&
                Object.keys(checkoutReportList).length
              "
              class="pr24 pt40"
            >
              <CollectBtn
                :info="{
                  ...pageProps,
                  ...checkoutReportList,
                }"
              />
            </view>
          </view>
          <reportDetailPatInfo
            :page-props="pageProps"
            :reportInfo="checkoutReportList"
          />
          <view class="button-list mt32 flex relative flex-between pr32 pl32">
            <button
              v-if="
                gStores.globalStore.sysCode === '1001093' &&
                checkoutReportList.url
              "
              @click="reviewPdf"
              class="button flex-1"
            >
              <view class="icon-font ico_sy_paper1"></view>
              查看报告
            </button>
          </view>
          <!-- <view class="patient-information">
            <view
              v-if="pageProps._scan !== '1' && patName"
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

                <block v-if="!pageProps.patientName">
                  <text class="g-split-line mr12 pr12">
                    {{ checkoutReportList.sex || pat.patientSex }}
                  </text>
                  <text>{{ checkoutReportList.age || pat.patientAge }}岁</text>
                </block>
              </view>
            </view>
            <view class="subhead">
              报告单号
              <view
                class="subhead-detail"
                style="width: calc(60%); white-space: wrap"
              >
                {{ checkoutReportList.repId }}
              </view>
            </view>
            <view class="subhead">
              报告时间
              <view class="subhead-detail">
                {{ checkoutReportList.repTime }}
              </view>
            </view>
            <view class="hidden-patient-information" v-show="isShow">
              <view v-if="checkoutReportList.regTime" class="subhead">
                采集时间
                <view class="subhead-detail">
                  {{ checkoutReportList.regTime }}
                </view>
              </view>

              <view v-if="checkoutReportList.serialNo" class="subhead">
                申请单号
                <view class="subhead-detail">
                  {{ checkoutReportList.serialNo }}
                </view>
              </view>
              <view v-if="checkoutReportList.applyDoc" class="subhead">
                申请医生
                <view class="subhead-detail">
                  {{ checkoutReportList.applyDoc }}
                </view>
              </view>
              <view v-if="checkoutReportList.reportDoc" class="subhead">
                报告医生
                <view class="subhead-detail">
                  {{ checkoutReportList.reportDoc }}
                </view>
              </view>


              <view class="subhead">
                <block v-if="checkoutReportList.passDoc">
                  <text>审核医生</text>
                  <view class="subhead-detail">
                    {{ checkoutReportList.passDoc }}
                  </view>
                </block>

              </view>
            </view>

          </view> -->
        </view>
        <view class="container-block-bottom">
          <view class="seen" v-if="checkoutReportList.conclusion">
            <view class="title">总检结论</view>
            <view class="content">
              <text>{{ checkoutReportList.conclusion }}</text>
            </view>
          </view>
          <view class="seen" v-if="checkoutReportList.collect">
            <view class="title">检查汇总</view>
            <view class="content">
              <text>{{ checkoutReportList.collect }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="tips">
      <view>{{ tips.title }}：</view>
      <view>{{ tips.content }}</view>
    </view>
    <Bottom-Nav
      v-if="!pageProps.useCacheData"
      :addition="{
        ...pat,
        ...pageProps,
        ...checkoutReportList,
      }"
      @btn-click="btnClick"
    />
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
        <text>体检报告链接有效期至{{ shareEndTime || 'YYYY-MM-DD' }}。</text>
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

  <Hover-Tip
    :config="pageConfig"
    :addition="{
      ...pat,
      ...pageProps,
      ...checkoutReportList,
    }"
    type="jy"
  />
  <g-message />
</template>
<script lang="ts" setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { onMounted, ref, computed } from 'vue';

  import { medicalReportDetails, addWatermark } from './utils';
  import {
    GStores,
    nameConvert,
    wait,
    ServerStaticData,
    ISystemConfig,
    getShareTotalUrl,
  } from '@/utils';
  import { joinQuery, encryptDes, joinQueryForUrl } from '@/common';
  import { deQueryForUrl } from '@/common';
  import { useReportPowerEnerg } from '@/components/greenPower';

  import dayjs from 'dayjs';
  import api from '@/service/api';
  import global from '@/config/global';

  import GreenToast from '@/components/greenPower/greenToast.vue';
  import HoverTip from './components/HoverTip.vue';
  import BottomNav from './components/BottomNav.vue';
  import CollectBtn from './components/CollectBtn.vue';
  import reportDetailPatInfo from './components/reportDetailPatInfo.vue';
  import { storeToRefs } from 'pinia';
  import { useCacheStore } from '@/stores';

  const alipayPid = global.systemInfo.alipayPid;

  const { contentTitle, greenToastContent, greenToastDuration, getPowerEnerg } =
    useReportPowerEnerg();
  const isClose = ref(true);

  const isShow = ref(false);
  const checkoutReportList = ref<medicalReportDetails>({} as any);
  const more = () => {
    isShow.value = !isShow.value;
  };
  const tips = ref({
    title: '',
    content: '',
  });
  const getTips = async () => {
    const { result } = await api.getSysAppMore({
      typeFlag: 7,
    });
    tips.value = result;
  };

  const gStores = new GStores();
  const pageConfig = ref(<ISystemConfig['reportQuery']>{});

  const { patChoose: pat } = storeToRefs(gStores.userStore);
  const pageProps = ref(<any>{});
  const patName = computed(() => {
    return (
      pageProps.value.patientName ||
      checkoutReportList.value.patientName ||
      pat.value.patientName
    );
  });
  const patCardNumber = computed(() => {
    return (
      pageProps.value.cardNumber ||
      checkoutReportList.value.cardNumber ||
      pat.value.cardNumber
    );
  });

  const btnClick = ({ key }) => {
    switch (key) {
      case 'shareReport':
        shareReport();
        break;

      case 'downReport':
        goReportPdf();
        break;

      case 'askDoc':
        goDoctor();
        break;

      default:
        break;
    }
  };
  const cacheStore = useCacheStore();

  const reviewPdf = () => {
    const url = checkoutReportList.value.url;
    const sysCode = gStores.globalStore.sysCode;
    if (url) {
      if (sysCode === '1001093') {
        cacheStore.changeCacheData(url);
        uni.navigateTo({
          url: joinQueryForUrl('/pagesC/prevFile/prevFile', {
            // url: 'https://hrsms.wzhealth.com/phs/pro/v3/phoenix-wz/image?uid=HlWMHi2cnDqTjKpSipDFgNT712DVuGX7NbYiFMt%2FLpU%3D',
            // url: encodeURIComponent(checkoutReportList.value.pdfUrl as string),
            type: 'base64',
            _type: 'cache',
          }),
        });
      }
    }
  };

  onLoad(async (p) => {
    pageConfig.value = await ServerStaticData.getSystemConfig('reportQuery');

    pageProps.value = deQueryForUrl(deQueryForUrl(deQueryForUrl(p)));
  });

  const getmedicalReportDetails = async () => {
    const { repId, repType, hosId, extend, useCacheData } = pageProps.value;
    let result: any;

    if (useCacheData) {
      result = gStores.globalStore.cacheData;
    } else {
      let params = {
        hosId: hosId,
        patientId: pat.value.patientId,
        repId: repId,
        repType: repType,
        extend,
      };
      const { result: _result } = await api.getMedicalReportDetails(params);
      result = _result;
    }
    checkoutReportList.value = result;
    if (alipayPid) {
      getPowerEnerg(repId);
    }
  };
  const goDoctor = () => {
    const path = '/pagesA/MyRegistration/DoctorDetails';
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
      {
        ...pageProps.value,
        watermarkText: undefined,
      },
      'pagesB/reportQuery/InspectionDetails'
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
      gStores.userStore.patChoose.patientName
    }的检验报告,分享链接有效期至${shareEndTime.value || 'YYYY-MM-DD'}。 ${
      qrVal.value
    }`;
    uni.setClipboardData({
      data,
      success: () => {
        isOperation.value = true;
        uni.getClipboardData({
          success: function (res) {
            gStores.messageStore.showMessage('内容已复制');
          },
        });
      },
      fail: () => {
        gStores.messageStore.showMessage('复制失败');
        isOperation.value = false;
      },
    });
  };
  const goReportPdf = () => {
    let { repId, repName } = checkoutReportList.value;

    repId = encodeURIComponent(encryptDes(repId + '', 'phsDesKey'));
    const { reportType } = pageProps.value;
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
  onMounted(async () => {
    await wait(600);
    getTips();
    getmedicalReportDetails();
    if (pageProps.value.isWatermark === '1') {
      addWatermark(global.systemInfo.name);
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
        .container-block-top {
          // width: calc(100% - 64rpx);
          background: linear-gradient(0deg, #ffffff, var(--hr-brand-color-1));
          border-radius: 16rpx 16rpx 0rpx 0rpx;
          box-shadow: 0rpx 1rpx 0rpx 0rpx #e6e6;
          border: 1rpx solid #e6e6e6;
          padding-bottom: 40rpx;
          position: relative;
          z-index: 99;
          .title {
            // width: calc(100% - 32rpx);
            font-size: var(--hr-font-size-xxl);
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
        }
        .container-block-bottom {
          // width: calc(100% - 32rpx);
          border-radius: 0rpx 0rpx 16rpx 16rpx;
          background-color: #fff;
          border-left: 1rpx solid #e6e6e6;
          border-right: 1rpx solid #e6e6e6;
          border-bottom: 1rpx solid #e6e6e6;
          padding-bottom: 16rpx;
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
              width: calc(100% - 32rpx);
              white-space: pre-wrap;
              .item {
                height: auto;
                width: calc(100% - 32rpx);
                margin-bottom: 32rpx;
                .item-title {
                  font-size: var(--hr-font-size-base);
                  font-weight: 600;
                }
                .item-content {
                  margin-top: 8rpx;
                  white-space: pre-wrap;
                }
              }
            }
          }
        }
      }
    }
    .tips {
      margin-left: 32rpx;
      // width: calc(100% - 64rpx);
      color: #888888;
      margin-top: 40rpx;
      font-size: var(--hr-font-size-xs);
      padding-bottom: 192rpx;
    }
    .footer {
      height: 96rpx;
      // padding-bottom: 68rpx;
      width: 100%;
      background-color: #fff;
      line-height: 96rpx;
      // position: fixed;
      left: 0;
      bottom: 0;
      display: flex;
      z-index: 1;
      .footer-button {
        height: 96rpx;
        width: 100%;
        line-height: 96rpx;
        display: flex;
        justify-content: center;
        background-color: #fff;
        border-radius: 0rpx;
        .title {
          font-size: var(--hr-font-size-xs);
          text-align: center;
        }
        .icon-font {
          width: 40rpx;
          height: 40rpx;
          margin-top: var(--hr-font-size-xs);
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
      color: var(--hr-brand-color-6);
      font-size: var(--hr-font-size-xl);
      .popup-un-operator {
        display: flex;
        align-items: center;
        height: 96rpx;
      }
      .iconfont {
        font-size: var(--hr-font-size-xxl);
        margin-right: 22rpx;
      }
    }
  }
  uni-button::after {
    display: none;
    width: 0px;
    height: 0px;
  }

  .button-list {
    z-index: 99;
    gap: 32rpx;
    .button {
      border-radius: 16rpx;
      height: 80rpx;
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
</style>
