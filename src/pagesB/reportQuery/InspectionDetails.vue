<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="page f32"
  >
    <drag-button
      v-if="
        pageConfig.reportAnalysis === '1' &&
        gStores.globalStore.sysCode != '1001038'
      "
      :right="1"
      :edge="100"
      :offsetHeight="0"
      zid="33"
      @btnClick="reportAnalysisFun(pageProps)"
      isDock
      scrollY
    >
      <view class="auto-person g-fade-in">
        <text>AI解读</text>
        <image
          :src="global.BASE_IMG + pageConfig.reportAnalysisImg"
          mode="heightFix"
        ></image>
      </view>
    </drag-button>
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
    <view class="container">
      <view class="container-block mt24">
        <view class="container-block-top" @click="more">
          <view
            v-if="hosInfo.hosName"
            class="pt40 pr32 pl32 color-444 f32 text-ellipsis"
          >
            <image
              :src="globalGl.BASE_IMG + 'report-hos-icon.png'"
              :style="{
                width: `${20}px`,
                height: `${20}px`,
                top: '3px',
              }"
              class="relative"
            />
            {{ hosInfo.hosName }}
          </view>
          <view class="flex-between flex-start">
            <view class="ml32 pt32 flex1 f48 font-semibold">
              {{ checkoutReportList.repName }}
            </view>

            <view
              v-if="
                pageProps.hideCollect !== '1' &&
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
          <ReportDetailPatInfo
            :page-props="pageProps"
            :reportInfo="checkoutReportList"
          />

          <view
            v-if="
              checkoutReportList.pdfUrl ||
              (checkoutReportList.pdfUrls && checkoutReportList.pdfUrls.length)
            "
            class="button-list mt32 flex relative flex-between pr32 pl32"
          >
            <button
              class="button flex-1"
              :class="{ onlyOneButton: 1 }"
              @click="goPdfUrl"
            >
              <view class="icon-font ico_sy_paper1"></view>
              图文报告
            </button>
          </view>
        </view>
        <view class="container-block-bottom">
          <template
            v-if="
              checkoutReportList.antiItemResult &&
              checkoutReportList.antiItemResult.length
            "
          >
            <view class="seen">
              <view class="title">细菌培养</view>
              <view
                v-for="(_item, i) in checkoutReportList.antiItemResult"
                :key="i"
              >
                <template v-if="_item.antiList">
                  <view class="seen">
                    <view class="title">
                      {{
                        `${_item.bioName}${_item.bioNum ? _item.bioNum : ''}`
                      }}
                    </view>
                    <view
                      v-if="
                        _item.antiList.length &&
                        !(
                          _item.antiList.length == 1 &&
                          JSON.stringify(_item.antiList[0]) == '{}'
                        )
                      "
                      class="table table-scroll"
                    >
                      <view class="table-title">
                        <view
                          class="table-title-auto table-title1 table-title-first"
                          v-if="
                            allNotHasData(
                              checkoutReportList.antiItemResult[i].antiList,
                              'antiName'
                            )
                          "
                        >
                          {{
                            getSysCode() === '1001046' ? '抗生素' : '抗菌药物'
                          }}
                        </view>
                        <view
                          class="table-title-auto table-title-common"
                          v-if="
                            getSysCode() !== '1001046' &&
                            allNotHasData(
                              checkoutReportList.antiItemResult[i].antiList,
                              'result'
                            )
                          "
                        >
                          解释
                        </view>
                        <view
                          class="table-title-auto table-title-common"
                          v-if="
                            allNotHasData(
                              checkoutReportList.antiItemResult[i].antiList,
                              'number'
                            )
                          "
                        >
                          数值
                        </view>
                        <view
                          v-if="
                            allNotHasData(
                              checkoutReportList.antiItemResult[i].antiList,
                              'antiResult'
                            )
                          "
                          class="table-title-auto table-title-common"
                        >
                          {{ getSysCode() === '1001046' ? '药敏' : '结果' }}
                        </view>
                        <view
                          class="table-title-auto table-title-common"
                          v-if="
                            allNotHasData(
                              checkoutReportList.antiItemResult[i].antiList,
                              'testRange'
                            )
                          "
                        >
                          折点
                        </view>
                        <view
                          class="table-title-auto table-title1 table-title-common"
                          v-if="
                            allNotHasData(
                              checkoutReportList.antiItemResult[i].antiList,
                              'itemUnits'
                            )
                          "
                        >
                          单位
                        </view>
                        <view
                          class="table-title-auto table-title-common"
                          v-if="
                            allNotHasData(
                              checkoutReportList.antiItemResult[i].antiList,
                              'testMethod'
                            )
                          "
                        >
                          方法
                        </view>
                      </view>
                      <template
                        v-for="(item, index) in checkoutReportList
                          .antiItemResult[i].antiList"
                        :key="index"
                      >
                        <view class="table-content">
                          <view
                            class="table-title-auto table-title1 table-content-first g-break-word"
                          >
                            {{ item.antiName }}
                          </view>
                          <view
                            v-if="
                              getSysCode() !== '1001046' &&
                              allNotHasData(
                                checkoutReportList.antiItemResult[i].antiList,
                                'result'
                              )
                            "
                            class="table-title-auto table-title-common g-break-word"
                          >
                            {{ item.result }}
                          </view>
                          <view
                            v-if="
                              allNotHasData(
                                checkoutReportList.antiItemResult[i].antiList,
                                'number'
                              )
                            "
                            class="table-title-auto table-title-common g-break-word"
                          >
                            {{ item.number }}
                          </view>
                          <view
                            v-if="item.antiResult"
                            class="table-title-auto table-title-common g-break-word"
                          >
                            {{ item.antiResult }}
                          </view>
                          <view
                            v-else
                            class="table-title-auto table-title-common g-break-word"
                          ></view>
                          <view
                            v-if="
                              allNotHasData(
                                checkoutReportList.antiItemResult[i].antiList,
                                'testRange'
                              )
                            "
                            class="table-title-auto table-title-common g-break-word"
                          >
                            {{ item.testRange }}
                          </view>

                          <view
                            v-if="
                              allNotHasData(
                                checkoutReportList.antiItemResult[i].antiList,
                                'itemUnits'
                              )
                            "
                            class="table-title-auto table-title-common g-break-word"
                          >
                            {{ item.itemUnits }}
                          </view>
                          <view
                            v-if="
                              allNotHasData(
                                checkoutReportList.antiItemResult[i].antiList,
                                'testMethod'
                              )
                            "
                            class="table-title-auto table-title-common g-break-word"
                          >
                            {{ item.testMethod }}
                          </view>
                        </view>
                      </template>
                    </view>
                  </view>
                </template>
                <template v-else>
                  <view class="content">未培养出真菌</view>
                </template>
              </view>
            </view>
          </template>

          <template
            v-if="
              checkoutReportList.normalList &&
              checkoutReportList.normalList.length
            "
          >
            <view class="seen">
              <view class="title">检验项目</view>
              <view
                v-if="checkoutReportList.normalList.length != 0"
                class="table keep-normal"
              >
                <view class="table-title">
                  <view class="table-title-auto">检验项目</view>
                  <view class="table-title-auto table-title-common">结果</view>
                  <view class="table-title-auto table-title-common">
                    参考范围
                  </view>
                  <view class="table-title-auto table-title-common">单位</view>
                </view>
                <template
                  v-for="item in checkoutReportList.normalList"
                  :key="item + 'content'"
                >
                  <view class="table-content">
                    <view class="table-title-auto g-break-word">
                      {{ item.itemName }}
                    </view>
                    <view
                      v-if="item.itemVal"
                      class="table-title-auto table-title-common g-break-word"
                      :class="{
                        'color-red': item.flag == 'H' || item.flag === '阳',
                        'color-blue': item.flag === 'L',
                      }"
                    >
                      <text class="g-break-word">{{ item.itemVal }}</text>
                      {{
                        (item.itemVal !== '阳性' &&
                          item.itemVal !== '阳' &&
                          item.flag &&
                          item.flag.includes('阳') &&
                          item.flag) ||
                        ''
                      }}
                      <text class="color-blue" v-if="item.flag == 'L'">↓</text>
                      <text class="color-danger" v-if="item.flag == 'H'">
                        ↑
                      </text>
                    </view>
                    <view
                      v-else
                      class="table-title-auto table-title-common"
                    ></view>
                    <view class="table-title-auto table-title-common">
                      {{ item.normalVal }}
                    </view>
                    <view class="table-title-auto table-title-common">
                      {{ item.itemUnits }}
                    </view>
                  </view>
                </template>
              </view>
              <view class="content" v-else></view>
            </view>
          </template>

          <view v-if="pageProps.repType == 2" class="exegesis">
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
        <text>检查报告链接有效期至{{ shareEndTime || 'YYYY-MM-DD' }}。</text>
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
  <g-pay
    :list="refPayList"
    @pay-click="selVerifyWay"
    ref="refPay"
    title="请选择查看页码"
  ></g-pay>

  <Hover-Tip
    :config="pageConfig"
    :addition="{
      ...pat,
      ...pageProps,
      ...checkoutReportList,
    }"
    type="jy"
  />
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
  import { onLoad } from '@dcloudio/uni-app';
  import { onMounted, ref, computed } from 'vue';
  import {
    checkoutReportDetails,
    addWatermark,
    reportAnalysisFun,
    useHosInfo,
  } from './utils';
  import {
    GStores,
    nameConvert,
    wait,
    ServerStaticData,
    ISystemConfig,
    getShareTotalUrl,
    apiAsync,
  } from '@/utils';
  import { joinQuery, encryptDes, joinQueryForUrl, getSysCode } from '@/common';
  import { deQueryForUrl } from '@/common';
  import { useReportPowerEnerg } from '@/components/greenPower';
  import { getOpenId } from '@/components/g-pay/index';

  import dayjs from 'dayjs';
  import api from '@/service/api';
  import global from '@/config/global';

  import GreenToast from '@/components/greenPower/greenToast.vue';
  import HoverTip from './components/HoverTip.vue';
  import BottomNav from './components/BottomNav.vue';
  import CollectBtn from './components/CollectBtn.vue';
  import { storeToRefs } from 'pinia';
  import ReportDetailPatInfo from './components/reportDetailPatInfo.vue';
  import { useCacheStore } from '@/stores';
  import globalGl from '@/config/global';

  const alipayPid = global.systemInfo.alipayPid;

  const { contentTitle, greenToastContent, greenToastDuration, getPowerEnerg } =
    useReportPowerEnerg();
  const isClose = ref(true);
  const refPay = ref<any>('');
  const isShow = ref(false);
  const checkoutReportList = ref<checkoutReportDetails>({} as any);
  const refPayList = ref([
    {
      label: '第一页',
      key: '',
    },
  ]);
  const { getHosInfo, hosInfo } = useHosInfo();

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
  const pageProps = ref(
    <
      {
        // 分享
        s?: '0';
        // 隐藏收藏
        hideCollect?: '1';
        hosId?: string;

        hidePatInfo?: '1';
        [key: string]: any;
      }
    >{}
  );
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
        if (gStores.globalStore.sysCode === '1001035') {
          copyDataUrl.value = checkoutReportList.value.pdfUrl!;
          popupCopy.value.show();
        } else {
          goReportPdf();
        }
        break;

      case 'askDoc':
        goDoctor();
        break;

      default:
        break;
    }
  };

  onLoad(async (p) => {
    pageConfig.value = await ServerStaticData.getSystemConfig('reportQuery');
    pageProps.value = deQueryForUrl(deQueryForUrl(deQueryForUrl(p)));
    console.log('获取到页面参数---');
    console.log(pageProps.value);
    if (pageProps.value.hosId) {
      getHosInfo(pageProps.value.hosId);
    }
    // #ifdef MP-WEIXIN
    await getqueryCompData();
    // #endif
  });

  const antiList = computed(() => {
    const antiItemResult = checkoutReportList.value?.antiItemResult;
    if (antiItemResult?.length) {
      if (antiItemResult[0].antiList?.length) {
        return antiItemResult[0].antiList.filter((item) => item);
      }
    }
    return [];
  });

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

  const getCheckoutReportDetails = async () => {
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
      const { result: _result } = await api.getCheckoutReportDetails(params);
      result = _result;
    }

    // result.pdfUrl =
      // 'https://nethospital.zchospital.com/phs/switch/encryptImages2pdf?imageUrls=F1DQFpjH9Dbk0NyX3fXAULvceqGzl7xRbTe1lvnV-4UnmXxnQ_PA-L-B_c0-0h9D9NvQy7gAZNu-chRcY11l7qYkF9C2LZ1vPUioSZPHBBxqh3sJt83ow6fIX-xOEeSLm6z9kURQWOpq0PbLdVOxhKrj33TZEFVYrVfZ1CraVyEDzFvJxHzDiGU0rWkO974p_9FG-rzpOCOQtQONnCC0u0nfmrthmztdmgClVRWMl8fgUwvj7FH6Kg0xZ6rvnEtF8QIJw2ZdytZ8QFNMWY5p_J3gs3jkk_SFQUwaKWNlpU7ljaockYeV82kRbMbNEBbH';
    if (result.antiItemResult) {
      checkoutReportList.value = result;
      if (alipayPid) {
        getPowerEnerg(result.repId);
      }
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
        s: '1',
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
        uni.getClipboardData({
          success: function (res) {
            isOperation.value = true;
          },
        });
      },
      fail: () => {
        gStores.messageStore.showMessage('复制失败');
        isOperation.value = false;
      },
    });
  };

  const copyDataUrl = ref('');
  const popupCopy = ref('' as any);
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

  const cacheStore = useCacheStore();
  const goPdfUrl = async () => {
    const { repName } = checkoutReportList.value;
    const { isJYGetImageUrlByH5 } = pageConfig.value;

    if (
      checkoutReportList.value.pdfUrl ||
      checkoutReportList.value.pdfUrls?.length === 1
    ) {
      const pdfUrl =
        checkoutReportList.value.pdfUrl ||
        checkoutReportList.value.pdfUrls?.[0] ||
        '';

      if (isJYGetImageUrlByH5 === '1') {
        copyDataUrl.value = pdfUrl;
        await wait(200);
        popupCopy.value.show();

        return;
      }

      cacheStore.changeCacheData(pdfUrl);
      let params: any = {
        type: 'cache',
      };
      if (
        ['1001083', '1001085', '1001095'].includes(gStores.globalStore.sysCode)
      ) {
        params = {
          type: 'base64',
          url: encodeURIComponent(pdfUrl),
        };
      }
      uni.navigateTo({
        url: joinQueryForUrl('/pagesC/prevFile/prevFile', {
          // url: 'https://hrsms.wzhealth.com/phs/pro/v3/phoenix-wz/image?uid=HlWMHi2cnDqTjKpSipDFgNT712DVuGX7NbYiFMt%2FLpU%3D',
          // url: encodeURIComponent(checkoutReportList.value.pdfUrl as string),
          name: repName,
          ...params,
        }),
      });
    } else {
      refPayList.value =
        checkoutReportList.value?.pdfUrls?.map((item, index) => {
          return {
            label: `第${index + 1}页`,
            key: item,
          };
        }) || [];
      refPay.value.show();
    }
  };

  const allNotHasData = (list, key) => {
    if (!Array.isArray(list) || list.length === 0) {
      return false;
    }
    return list.every((item) => {
      // 检查对象是否存在、是否包含key且值有效
      return (
        item &&
        key in item &&
        item[key] !== undefined &&
        item[key] !== null &&
        item[key] !== ''
      );
    });
  };

  const selVerifyWay = ({ item }) => {
    console.log(item);
    const { repName } = checkoutReportList.value;
    cacheStore.changeCacheData(item.key);
    uni.navigateTo({
      url: joinQueryForUrl('/pagesC/prevFile/prevFile', {
        name: repName,
        type: 'cache',
      }),
    });
  };

  onMounted(async () => {
    await wait(600);
    getTips();
    getCheckoutReportDetails();
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
      pointer-events: none;
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
    .auto-person {
      position: relative;
      z-index: 999;
      text {
        position: absolute;
        bottom: 9px;
        color: #fff;
        font-size: 24rpx;
        left: 23rpx;
        z-index: 999;
      }
      image {
        height: 148rpx;
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
            .title {
              font-size: var(--hr-font-size-xl);
              font-weight: 600;
              margin-left: 24rpx;
              margin-bottom: 16rpx;
            }
            .content {
              margin-top: 16rpx;
              margin-left: 24rpx;
            }
            .table-scroll {
              overflow: scroll;
            }
            .table {
              margin: 0 24rpx;
              box-sizing: border-box;
              .table-title {
                height: 72rpx;
                // width: calc(100% - 16rpx);
                background-color: #f6f6f6;
                font-size: var(--hr-font-size-xs);
                color: #888888;
                display: flex;
                align-items: center;
                padding: 0 16rpx;
                .table-title-auto {
                  display: flex;
                  align-items: center;
                  height: 72rpx;
                  background-color: #f6f6f6;
                  justify-content: center;
                }
              }
              .table-content {
                // width: calc(100% - 16rpx);
                background-color: var(--hr-brand-color-3-light);
                font-size: var(--hr-font-size-xs);
                display: flex;
                align-items: center;
                padding: 0 16rpx;
                .table-title-auto {
                  display: flex;
                  align-items: center;
                  min-height: 72rpx;
                  padding: 10rpx 0;
                  background-color: var(--hr-brand-color-3-light);
                  justify-content: center;
                }
                // width: calc(100% - 16rpx);
              }
              .table-title-common {
                text-align: center;
              }
              .table-title-auto {
                width: auto;
                min-width: 25%;
                width: 25%;
              }

              .table-title1 {
                min-width: 33%;
                display: block;
                text-overflow: ellipsis;
                word-wrap: break-word;
              }
              .table-title2 {
                width: 20%;
              }
              .table-title3 {
                width: 18.5%;
              }
              .table-title4 {
                width: 10%;
              }
              .table-title5 {
                width: 16%;
              }
              .table-title6 {
                width: 31%;
              }
              .down {
                color: var(--hr-brand-color-6);
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
            font-size: var(--hr-font-size-xs);
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
  .placeholder {
    height: 12vw;
  }
</style>
