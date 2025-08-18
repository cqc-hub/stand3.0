<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="page"
    scroll-y="true"
  >
    <!--  #ifdef MP-WEIXIN -->
    <view class="placeholder" v-if="queryCompData.isShowHealthCardMode">
      <health-card-query-comp
        :scene="queryCompData.scene"
        :openId="queryCompData.openId"
        :hospitalId="queryCompData.hospitalId"
        :healthCardId="queryCompData.healthCardId"
        pos="top"
        channel="0402"
      />
    </view>
    <!--  #endif -->
    <view class="watermarkView">
      <canvas canvas-id="watermarkCanvas"></canvas>
    </view>

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
          :class="{
            containerBlockFirst: index == 0 && btnNumber.length > 0,
            [pageConfig.isOpenCollect === '1' &&
            gStores.globalStore.isLogin &&
            Object.keys(examineReportList).length
              ? 'mt48'
              : 'mt24']: 1,
          }"
        >
          <view class="container-block-top">
            <view class="container-top-click" @click="more(index)">
              <view class="flex-between flex-start">
                <view class="title flex1">{{ item.repName }}</view>

                <view
                  v-if="
                    pageConfig.isOpenCollect === '1' &&
                    gStores.globalStore.isLogin &&
                    Object.keys(examineReportList).length &&
                    !pageProps.params
                  "
                  class="pr24 pt40"
                >
                  <CollectBtn
                    :info="{
                      ...pageProps,
                      ...examineReportList,
                    }"
                  />
                </view>
              </view>
              <ReportDetailPatInfo
                :page-props="pageProps"
                :reportInfo="examineReportList"
              />

              <!-- <view class="patient-information">
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

                    <text class="mr12 pr12 iconfont icon-resize">
                      {{ isClose ? '&#xe6d4;' : '&#xe6db;' }}
                    </text>

                    <block
                      v-if="
                        !pageProps.patientName &&
                        (examineReportList.sex || pat.patientSex)
                      "
                    >
                      <text class="g-split-line mr12 pr12">
                        {{ examineReportList.sex || pat.patientSex }}
                      </text>

                      <text class="text-no-wrap">
                        {{ examineReportList.age || pat.patientAge }}岁
                      </text>
                    </block>
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
              </view> -->
            </view>
            <view class="button-list mt32 flex relative flex-between pr32 pl32">
              <button
                class="button flex-1"
                :class="{ onlyOneButton: !item.dicomList }"
                @click="goReportPdf(item)"
                v-if="
                  (pageProps.isDownloadRepor === '1' &&
                    pageProps.isGraphic == 1 &&
                    gStores.globalStore.sysCode !== '1001035') ||
                  item?.pdfPath
                "
              >
                <view class="icon-font ico_sy_paper1"></view>
                图文报告
              </button>
              <button
                v-if="item.yunUrl || examineReportList.yunUrl"
                class="button flex-1"
                @click="gotoMedical((item.yunUrl || examineReportList.yunUrl)!)"
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
              v-if="item.diacrisis || examineReportList.diacrisis"
            >
              <view class="title">病理诊断</view>
              <view class="content">
                {{ item.diacrisis || examineReportList.diacrisis }}
              </view>
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
      <rich-text :nodes="tips.content" />
    </view>

    <Bottom-Nav
      v-if="!pageProps.useCacheData && !pageProps.params"
      :addition="{
        ...pat,
        ...pageProps,
        ...examineReportList,
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

  <view class="z-999 relative">
    <g-copyurl-popup
      :copyDataUrl="copyDataUrl"
      title="下载链接"
      ref="popupCopy"
      class=""
    />
  </view>
  <g-message />
</template>
<script lang="ts" setup>
  import { onLoad, onPageScroll } from '@dcloudio/uni-app';
  import { ref, onMounted, computed, nextTick, onUpdated } from 'vue';

  import {
    examineReportDetails,
    getShareTotalUrl,
    addWatermark,
  } from './utils';
  import {
    GStores,
    nameConvert,
    wait,
    throttle,
    ISystemConfig,
    ServerStaticData,
    apiAsync,
    useTBanner,
    ImageDownloader,
  } from '@/utils';
  import { joinQuery, encryptDes, getSysCode, joinQueryForUrl } from '@/common';
  import { deQueryForUrl } from '@/common';
  import { useReportPowerEnerg } from '@/components/greenPower';
  import { getOpenId } from '@/components/g-pay/index';
  import global from '@/config/global';
  import api from '@/service/api';
  import dayjs from 'dayjs';
  import env from '@/config/env';

  import GreenToast from '@/components/greenPower/greenToast.vue';
  import BottomNav from './components/BottomNav.vue';
  import CollectBtn from './components/CollectBtn.vue';
  import { payMoneyOnline, toPayPull } from '@/components/g-pay';
  import { useCacheStore } from '@/stores';
  import ReportDetailPatInfo from './components/reportDetailPatInfo.vue';

  const pageConfig = ref(<ISystemConfig['reportQuery']>{});
  const alipayPid = global.systemInfo.alipayPid;
  const cacheStore = useCacheStore();

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

  const queryCompData = ref(<
    {
      isShowHealthCardMode: boolean;
      hospitalId: string;
      openId: string;
      healthCardId?: string;
      scene: string;
    }
  >{
    isShowHealthCardMode: false,
    hospitalId: '',
    openId: '',
    healthCardId: '',
    scene: '0101081',
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

  const btnClick = ({ key }) => {
    switch (key) {
      case 'shareReport':
        shareReport();
        break;

      case 'downReport':
        downloadReport();
        break;

      case 'askDoc':
        goDoctor();
        break;

      default:
        break;
    }
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
  const getTips = async (typeFlag) => {
    const { result } = await api.getSysAppMore({
      typeFlag,
    });
    tips.value = result;
  };
  const pageProps = ref(
    <
      {
        // 分享进来
        s?: '1';
        params?: string;
        [key: string]: any;
      }
    >{}
  );

  const gStores = new GStores();
  const pat = gStores.userStore.patChoose;
  const patName = computed(() => {
    return (
      pageProps.value.patientName ||
      examineReportList.value.patientName ||
      pat.patientName
    );
  });
  const patCardNumber = computed(() => {
    return (
      pageProps.value.cardNumber ||
      examineReportList.value.cardNumber ||
      pat.cardNumber
    );
  });

  const getInspectionReportList = async () => {
    const {
      repId,
      examClassName,
      hosId,
      extend,
      useCacheData,
      params: _params,
    } = pageProps.value;

    let result: any;

    if (useCacheData) {
      result = gStores.globalStore.cacheData;
    } else {
      if (_params) {
        // 扫码进入
        const { result: _result } = await api.getExamineReportDetailsNoLogin({
          desSecret: _params,
        });
        result = _result;
      } else {
        // 正常进入
        let params = {
          hosId: hosId,
          patientId: pat.patientId,
          repId: repId,
          examClassName: examClassName,
          extend: decodeURIComponent(extend),
        };
        const { result: _result } = await api.getExamineReportDetails(params);

        result = _result;
      }
    }
    examineReportList.value = result;
    if (
      gStores.globalStore.sysCode === '1001035' &&
      result.examClass === '病理'
    ) {
      getTips(661);
    } else {
      getTips(6);
    }

    btnNumber.value = examineReportList.value.detailsResult?.length;
    for (var i = 0; i < btnNumber.value; i++) {
      isShow.value.push(0);
    }
    if (alipayPid) {
      getPowerEnerg(repId);
    }
  };

  const goReportPdf = (item) => {
    let { repId, repName, pdfPath } = item;
    const { pdfPath: pdfPath1001035, pdfType } = examineReportList.value;

    if (['1001035'].includes(gStores.globalStore.sysCode) && pdfPath1001035) {
      if (pdfType === 'JPG') {
        uni.previewImage({
          urls: [pdfPath1001035],
        });
        return;
      }
      cacheStore.changeCacheData(pdfPath1001035);

      uni.navigateTo({
        url: joinQueryForUrl('/pagesC/prevFile/prevFile', {
          name: '',
          type: 'cache',
        }),
      });
      return;
    }

    if (pdfPath) {
      if (['1001048'].includes(gStores.globalStore.sysCode)) {
        useTBanner({
          type: 'h5',
          path: pdfPath,
        });
        return;
      }
      uni.navigateTo({
        url: joinQueryForUrl('/pagesC/prevFile/prevFile', {
          // url: 'https://hrsms.wzhealth.com/phs/pro/v3/phoenix-wz/image?uid=HlWMHi2cnDqTjKpSipDFgNT712DVuGX7NbYiFMt%2FLpU%3D',
          url: encodeURIComponent(pdfPath as string),
          name: repName,
          type: 'base64',
        }),
      });
      return;
    }
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
        s: '1',
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
      gStores.userStore.patChoose.patientName
    }的检查报告,分享链接有效期至${shareEndTime.value || 'YYYY-MM-DD'}。 ${
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
  const copyDataUrl = ref('');
  const popupCopy = ref('' as any);

  const downloadReport = async () => {
    if (['1001035'].includes(gStores.globalStore.sysCode)) {
      const { pdfPath: pdfPath1001035, pdfType } = examineReportList.value;
      if (!pdfPath1001035) {
        return;
      }

      if (pdfType === 'JPG') {
        uni.showLoading({});
        try {
          const msg = await ImageDownloader.downloadAndSaveImage(
            pdfPath1001035
          );
          gStores.messageStore.showMessage(msg, 1500);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : '保存失败';
          gStores.messageStore.showMessage(errorMessage, 1500);
        } finally {
          uni.hideLoading();
        }
        return;
      }

      copyDataUrl.value = pdfPath1001035!;
      popupCopy.value.show();
      return;
    }
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
        gStores.messageStore.showMessage('复制链接成功!', 3000, {
          uniToast: true,
        });
      },
      fail() {
        gStores.messageStore.showMessage('剪贴失败!!', 3000);
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

  const gotoMedical = async (url: string) => {
    const { _extend = {} } = pageProps.value;

    // 需要缴费
    if (_extend?.yunUrlNeedPay === '1') {
      // if (isJcYunPay === '1' && isContinuePay) {
      // examineReportList.value.repId = '202410011703';
      const { cardNumber, repId, hosId, hosName, patientName } =
        examineReportList.value;
      let viewType = '2';
      // #ifdef MP-ALIPAY
      viewType = '1';
      // #endif

      const { result } = await api.queryImgStatus({
        viewType,
        cardNumber,
        repId,
        dicomId: repId,
        hosId: pageProps.value.hosId || hosId,
      });

      // const result: any = {
      //   needReChargeStatus: '1',
      //   paid: '0',
      //   price: '0.01',
      // };

      const {
        // 根据此字短判断是否要去确认页面（存在）
        needReChargeStatus, // 是否需要调用支付平台 1-需要 0-不需要
        paid, // 是否已经支付 0未支付 1已支付
        price,
        amountPrice, // 账户抵扣
        totalPrice, // 总金额
      } = result;
      const _hosId =
        pageProps.value.hosId ||
        result.hosId ||
        examineReportList.value.hosId ||
        '';

      if (paid === '0') {
        const { confirm } = await apiAsync(uni.showModal, {
          content: `该云影像需要支付${totalPrice}元才能查看，是否继续？`,
          cancelText: '取消',
          confirmText: '继续',
        });

        if (!confirm) {
          return;
        }
        cacheStore.changeCacheData({
          ...examineReportList.value,
          hosId: _hosId,
          needReChargeStatus,
          totalNeedSelfpay: price,
          totalCharges: totalPrice,
          accountMoney: amountPrice,
          payAmount: price,
        });

        if (needReChargeStatus) {
          uni.navigateTo({
            url: joinQueryForUrl('/pagesA/clinicPay/payConfirm', {
              _type: 'yunUrl',
              hosId: _hosId,
            }),
          });
        }
        return;
        // else {
        //   // 不需要去确认页面， 当前页直接支付
        //   gStores.messageStore.showMessage('未开发', 1500);
        //   return;
        // }

        if (needReChargeStatus === '0') {
          const source = gStores.globalStore.browser.source;

          const {
            result: { paySign, phsOrderNo },
          } = await api.createInHospitalPayOrder({
            cardNumber,
            dicomId: repId,
            fee: price,
            hosId,
            hosName,
            orderType: '6',
            patientName,
            source,
          });

          const payRes = await payMoneyOnline({
            paySign,
            phsOrderNo,
            totalFee: price,
            source,
            phsOrderSource: 6,
            hosId,
            patientName,
          });

          await toPayPull(payRes, '门诊缴费');
          yunPayAfter(url);
        }

        if (needReChargeStatus === '0') {
          await api.imgHosSettle({
            cardNumber,
            hosId,
            dicomId: repId,
            viewType,
          });
        }
      }
    }

    if (gStores.globalStore.sysCode === '1001048') {
      // uni.navigateTo({
      //   url: `/pagesA/webView/webView?https=${url}`,
      // });
      useTBanner({
        type: 'h5',
        path: url,
      });
    } else {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesA/webView/webView', {
          https: url,
        }),
      });
    }
  };

  const yunPayAfter = (url) => {
    gotoMedical(url);
  };

  const getqueryCompData = async () => {
    if (
      global.systemInfo.isOpenHealthCard?.isCardQueryComp &&
      gStores.userStore.patChoose?.healthQrCodeText
    ) {
      queryCompData.value.openId = await getOpenId();
      queryCompData.value.hospitalId =
        global.systemInfo.isOpenHealthCard!.hospitalId;
      queryCompData.value.healthCardId =
        gStores.userStore.patChoose.healthQrCodeText;
      queryCompData.value.isShowHealthCardMode = true;
    }
  };

  onLoad(async (opt) => {
    const queryParams = gStores.globalStore.appLaunchData?.query?.qrCode;

    uni.showLoading({});

    if ((queryParams && !opt?.params) || opt?.q) {
      return;
    }
    await wait(600);

    pageConfig.value = await ServerStaticData.getSystemConfig('reportQuery');
    pageProps.value = deQueryForUrl(deQueryForUrl(deQueryForUrl(opt)));
    pageProps.value._extend = {};
    if (pageProps.value.extend) {
      try {
        pageProps.value._extend = JSON.parse(pageProps.value.extend);
      } catch (error) {}
    }
    windowInfo.value = uni.getSystemInfoSync();
    getInspectionReportList();
    if (pageProps.value.isWatermark === '1') {
      addWatermark(global.systemInfo.name);
    }
    // #ifdef MP-WEIXIN
    getqueryCompData();
    // #endif
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
          color: var(--hr-brand-color-6);
          border: 2rpx solid var(--hr-brand-color-6);
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
        .container-block-top {
          // width: calc(100% - 64rpx);
          background: linear-gradient(0deg, #ffffff, var(--hr-brand-color-1));
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
      color: var(--hr-brand-color-6);
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
  .placeholder {
    height: 12vw;
  }
</style>
