<template>
  <g-selhos
    v-if="cacheStore.isShowChooseHos"
    v-model:hosId="hosId"
    :autoGetData="false"
    @change="getHospitalGuidelines(hosId)"
    ref="selHosRef"
  />

  <view class="page" v-if="dataList">
    <scroll-view
      class="scroll-view"
      scroll-y="true"
      :scroll-into-view="toView"
      scroll-with-animation="true"
    >
      <view v-if="dataList.bannerList">
        <swiper
          class="swiper"
          :autoplay="true"
          circular
          interval="3000"
          :indicator-dots="dataList.bannerList.length > 1 ? true : false"
        >
          <swiper-item
            class="bg_image"
            id="hosIntroduce"
            v-for="item in dataList.bannerList"
            :key="item.id"
          >
            <image
              mode="widthFix"
              :src="item.iconfont"
              @click="gotoPath(item)"
            />
          </swiper-item>
        </swiper>
      </view>

      <view class="page-content">
        <view>
          <view class="card">
            <view class="card-top flex-between">
              <text>{{ dataList.address }}</text>
              <view @tap="gotoLocation">
                <image :src="$global.BASE_IMG + 'ico_daohang@3x.png'" />
                <text class="tip">到这去</text>
              </view>
              <text class="label"></text>
              <view @tap="clickPhone(dataList.tel)">
                <image :src="$global.BASE_IMG + 'ico_telephone@3x.png'" />
                <text class="tip">打电话</text>
              </view>
            </view>
            <view class="card-phone" v-if="dataList.clinicTime">
              <text>门诊时间:{{ dataList.clinicTime }}</text>
            </view>
          </view>
        </view>
        <view v-if="!isLoading" @tap="gotoGuide">
          <view class="main-text">
            <view class="details">
              <image
                class="text-top"
                :src="$global.BASE_IMG + 'img_yyjs@3x.png'"
              />
              {{ dataList.intro }}
            </view>
            <view class="more flex-normal">
              <view class="iconfont icon-resize">&#xe66b;</view>
              <text>更多</text>
            </view>
          </view>
        </view>
        <view class="hosButton">
          <view class="hosBar">
            <view
              class="hosBarItem"
              @tap="useCommonTo(item)"
              v-for="item in gridBar"
              :key="item.id"
            >
              <text :class="item.iconfont" class="icon-font" />
              <view class="title">
                <text>{{ item.title }}</text>
              </view>
            </view>
          </view>

          <view class="GridDataList">
            <homeGrid :list="gridList" :type="2" />
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
  <homeH5SharePopup
    ref="homeH5SharePopupRef"
    :configData="h5QrCodeData || undefined"
  />
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { onLoad, onReady, onShareTimeline } from '@dcloudio/uni-app';
  import api from '@/service/api';
  import { joinQuery } from '@/common';
  import { wait, openLocation, GStores } from '@/utils';
  import { useCacheStore } from '@/stores';
  import { useCommonTo, openServicesChat } from '@/common/checkJump';
  import homeGrid from '@/pages/home/componetns/homeGrid.vue';
  import homeH5SharePopup from '@/pages/home/componetns/homeH5SharePopup.vue';
  import { deQueryForUrl } from '@/common/utils';

  const selHosRef = ref<any>();
  const toView = ref('hosIntroduce'); // 初始化跳转的视图
  const centerHeight = ref(0); //中线的高度
  const homeH5SharePopupRef = ref('' as any);
  const h5QrCodeData = ref();
  const hosId = ref<any>('');
  const cacheStore = useCacheStore();
  const gStores = new GStores();
  const dataList = ref<any>();
  //是否展示更多的按钮
  const isMore = ref(false);
  const isLoading = ref(true); //骨架屏

  const emits = defineEmits(['open-share']);

  //写死内容
  const gridBar = [
    {
      functionIntroduce: '',
      iconfont: 'ico_sy_yygh',
      query: '',
      selectPatientPage: '0',
      title: '预约挂号',
      terminalType: 'my',
      gridLabel: '0',
      path: '/pagesA/MyRegistration/selDepartment?clinicalType=1',
      appId: '',
      id: 49794,
      detail: '',
      patientInterception: '0',
      loginInterception: '0',
    },
    {
      iconfont: 'ico_sy_dzjkk',
      appId: '',
      query: '',
      id: 42887,
      detail: '',
      selectPatientPage: '0',
      title: '就诊档案',
      terminalType: 'my-h5',
      gridLabel: '0',
      path: '/pagesC/healthRecord/healthRecordHis&query=["token"]',
      patientInterception: '1',
      loginInterception: '1',
    },
  ];
  const gridList = [
    {
      functionIntroduce: '',
      iconfont: 'ico_sy_doctor',
      query: '',
      selectPatientPage: '0',
      title: '智能导诊',
      terminalType: 'my-h5',
      gridLabel: '0',
      path: '/pagesC/IntelligentGuidance/select&channel=3&level=1',
      showNo: 1,
      appId: '',
      id: 49616,
      detail: '',
      patientInterception: '0',
      loginInterception: '0',
    },
    {
      functionIntroduce: '',
      iconfont: 'ico_sy_medication-manager',
      query: '',
      selectPatientPage: '0',
      title: '我的预约',
      terminalType: 'my',
      gridLabel: '0',
      path: '/pagesA/MyRegistration/MyRegistration',
      showNo: 1,
      appId: '',
      id: 49615,
      detail: '',
      patientInterception: '1',
      loginInterception: '1',
    },
    {
      functionIntroduce: '',
      iconfont: 'ico_sy_bgcx',
      query: '',
      selectPatientPage: '0',
      title: '报告查询',
      terminalType: 'my',
      gridLabel: '0',
      path: '/pagesB/reportQuery/reportQuery',
      showNo: 3,
      appId: '',
      id: 49612,
      detail: '检验检查报告',
      patientInterception: '1',
      loginInterception: '1',
    },
    {
      functionIntroduce: '基础',
      iconfont: 'ico_sy_patient',
      query: '',
      selectPatientPage: '0',
      title: '排队叫号',
      terminalType: 'my-h5',
      gridLabel: '0',
      path: '/pagesC/queueNumber/queueNumber&query=["token"]',
      showNo: 3,
      appId: '',
      id: 49617,
      detail: '',
      patientInterception: '1',
      loginInterception: '1',
    },
    {
      functionIntroduce: '电子发票',
      iconfont: 'ico_sy_orderbeifen',
      query: '',
      selectPatientPage: '0',
      title: '电子发票',
      terminalType: 'my-h5',
      gridLabel: '0',
      path: '/pagesC/healthRecord/healthRecordHis&query=["token"]',
      appId: '',
      id: 53871,
      detail: '',
      patientInterception: '1',
      loginInterception: '1',
    },
    {
      functionIntroduce: '自研原生门诊缴费',
      iconfont: 'ico_sy_mzjf',
      query: '',
      selectPatientPage: '0',
      title: '门诊缴费',
      terminalType: 'my',
      gridLabel: '3',
      path: '/pagesA/clinicPay/clinicPayDetail',
      appId: '',
      id: 53464,
      detail: '',
      patientInterception: '1',
      loginInterception: '1',
    },
    {
      functionIntroduce: '',
      iconfont: 'ico_sy_paper7',
      query: '',
      selectPatientPage: '0',
      title: '种植档案',
      terminalType: 'my-h5',
      gridLabel: '0',
      path: '/pagesB/toothRecord/index&query=["token"]',
      showNo: 4,
      appId: '',
      id: 49622,
      detail: '',
      patientInterception: '1',
      loginInterception: '1',
    },
    {
      functionIntroduce: '',
      iconfont: 'ico_sy_paper1',
      query: '',
      selectPatientPage: '0',
      title: '牙周档案',
      terminalType: 'my-h5',
      gridLabel: '0',
      path: '/pagesC/periodArchives/periodArchives&query=["token"]',
      showNo: 4,
      appId: '',
      id: 49625,
      detail: '',
      patientInterception: '1',
      loginInterception: '1',
    },
    {
      functionIntroduce: '',
      iconfont: 'ico_sy_birthcertificate',
      query: '',
      selectPatientPage: '0',
      title: '初诊报告',
      terminalType: 'my-h5',
      gridLabel: '0',
      path: '/pagesC/periodArchives/diagnosisReport&query=["token"]',
      appId: '',
      id: 49623,
      detail: '',
      patientInterception: '1',
      loginInterception: '1',
    },
    {
      functionIntroduce: '',
      iconfont: 'ico_sy_paper1',
      query: '',
      terminalType: 'my',
      selectPatientPage: '0',
      title: '个人中心',
      gridLabel: '0',
      path: '/pages/home/my',
      showNo: 3,
      appId: '',
      id: 49624,
      detail: '',
      patientInterception: '0',
      loginInterception: '0',
    },
    {
      functionIntroduce: '',
      iconfont: 'ico_sy_diabetes',
      query: '',
      selectPatientPage: '0',
      title: '家庭成员',
      terminalType: 'my',
      gridLabel: '0',
      path: '/pagesA/medicalCardMan/medicalCardMan',
      appId: '',
      id: 49621,
      detail: '',
      patientInterception: '1',
      loginInterception: '1',
    },
    {
      functionIntroduce: '',
      iconfont: 'ico_sy_hospital',
      query: '',
      selectPatientPage: '0',
      title: '集团首页',
      terminalType: 'my',
      gridLabel: '0',
      path: '/pages/home/home',
      appId: '',
      id: 49620,
      detail: '',
      patientInterception: '0',
      loginInterception: '0',
    },
  ];
  const row: number = 3;

  const pageProps = ref<any>();
  interface IPageProps {
    hosId?: string;
  }
  onLoad(async (p) => {
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true,
    });
    // #endif

    pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
    hosId.value =
      pageProps.value.hosId && cacheStore.changeHosId(pageProps.value.hosId);

    if (!hosId.value) {
      const { result } = await api.getHospital({});
      // hosId.value = result[0].hosId;
    }
    if (cacheStore.isShowChooseHos) {
      await wait(300);
      await selHosRef.value.init();
    }
    getHospitalGuidelines(hosId.value);
  });
  // #ifdef MP-WEIXIN
  //分享到朋友圈
  onShareTimeline(() => {
    return {
      title: dataList.value.aliasName,
      query: 'hosId=' + hosId.value,
      summary: '',
    };
  });
  // #endif
  const gotoGuide = () => {
    uni.navigateTo({
      url: joinQuery(
        '/pagesC/cloudHospital/myPath?path=/pages/hospitalGuide/hospitalGuide',
        {
          hosId: hosId.value,
        }
      ),
    });
  };
  //打开关注框
  const openShare = (item) => {
    h5QrCodeData.value = {
      theme: '客服助手',
      title: '欢迎添加',
      // #ifdef MP-WEIXIN
      subTitle: '长按识别，添加客服',
      // #endif
      // #ifdef MP-ALIPAY
      subTitle: '保存扫一扫，添加客服',
      // #endif
      isHideInfo: true,
      imageCode: JSON.parse(item).imageCode,
      name: dataList.value.aliasName,
    };
    homeH5SharePopupRef.value.show();
  };
  const gotoPath = (item) => {
    if (item.path && item.path == 'showCareModel') {
      //关注组件拦截跳转 弹框
      openShare(item.query);
    } else if (item.path == 'openWxService') {
      openServicesChat(item.query);
    } else {
      useCommonTo(item);
    }
  };

  //获取屏幕可视区域高度
  onReady(() => {
    uni.getSystemInfo({
      success: function (res) {
        centerHeight.value = res.windowHeight / 2 - 100;
        console.log(res.windowHeight, centerHeight.value);
      },
    });
  });
  onMounted(() => {
    //获取.details的高度 处理是否展示更多按钮
  });

  //点击拨打电话
  const clickPhone = (phoneNumber: any) => {
    uni.makePhoneCall({
      phoneNumber,
      success: () => {
        console.log('成功拨打电话');
      },
    });
  };
  //点击打开地理位置
  const gotoLocation = () => {
    const { gisLat, gisLng, hosName, address } = dataList.value;

    if (gisLat) {
      openLocation([gisLat!, gisLng!], {
        name: hosName,
        address,
      });
    } else {
      gStores.messageStore.showMessage('暂不支持导航(无该医院位置信息)', 3000);
    }
  };
  //获取医院介绍的高度
  const getDetailHeight = () => {
    isMore.value = true;
    isLoading.value = false;
  };
  //根据hosid查询医院指南
  const getHospitalGuidelines = async (hosId) => {
    dataList.value = [];
    isLoading.value = true;
    const res = await api.getHospitalGuidelines({ hosId: hosId });
    dataList.value = res.result;

    uni.setNavigationBarTitle({
      title: dataList.value.aliasName,
    });
    if (dataList.value.bannerJson) {
      dataList.value.bannerList = JSON.parse(dataList.value.bannerJson) || [];
    }

    setTimeout(() => {
      getDetailHeight();
    }, 1000);
  };
</script>

<style lang="scss" scoped>
  .page {
    color: $hr-neutral-color-10;
    background: $uni-bg-color;
    .iconfont {
      color: #888;
    }

    .scroll-bar {
      position: fixed;
      top: 0;
      width: 100%;
      background: #fff;
      z-index: 1;

      ::v-deep .uni-tab-item {
        width: 25%;
        text-align: center;
      }
    }
    .swiper {
      height: 160rpx;
    }

    .bg_image {
      width: 100vw;
      height: 160rpx;

      image {
        width: 100vw;
        height: 160rpx;
      }

      .mask {
        // width: 100vh;
        background-color: rgba(0, 0, 0, 0.2);
        position: fixed;
        top: 0;
      }
    }

    .scroll-view {
      height: calc(100vh - 50px);
      touch-action: none;
    }

    .page-content {
      background: $uni-bg-color;
      padding: 0 $uni-spacing-row-32;
      position: relative;
      padding-top: 10rpx;

      .logo {
        width: 100rpx;
        height: 98rpx;
        position: absolute;
        top: -50rpx;
      }

      .hos-title {
        display: inline-block;
        margin: 68rpx 0 8rpx 0;
        font-size: $uni-font-size-48;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        text-align: left;
        line-height: 66rpx;
      }

      .tips {
        margin-bottom: 40rpx;
      }

      .isMaxHeight {
        max-height: 192rpx;
        overflow: hidden;
      }

      .main-text {
        position: relative;
        margin-top: 24rpx;
        background-color: #fff;

        .text-top {
          margin-right: 20rpx;
          width: 124rpx;
          height: 24rpx;
        }

        .more {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 160rpx;
          height: 48rpx;
          flex-direction: row-reverse;
          background: linear-gradient(
            270deg,
            #ffffff 45%,
            rgba(255, 255, 255, 0) 100%
          );

          text {
            color: $uni-color-primary;
            font-size: 26rpx;
            font-weight: 600;
            line-height: 36rpx;
          }

          .iconfont {
            color: $uni-color-primary;
          }
        }

        .details {
          font-size: $uni-font-size-32;
          color: $uni-text-hr-main-color;
          line-height: 48rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .card {
        border: 2rpx solid #f3f3f3;
        border-radius: 16rpx;
        box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.06);
        padding: 40rpx $uni-spacing-row-32;
        box-sizing: border-box;

        .card-top {
          text {
            width: 400rpx;
            font-size: 30rpx;
            color: $uni-text-hr-main-color;
            line-height: 42rpx;
          }

          .label {
            width: 2rpx;
            height: 72rpx;
            background: #e6e6e6;
          }

          view {
            width: 66rpx;
            text-align: center;

            image {
              width: 48rpx;
              height: 48rpx;
              text-align: center;
              display: inline-block;
            }

            .tip {
              display: inline-block;
              text-align: left;
              margin-top: 4rpx;
              line-height: 32rpx;
              font-size: 22rpx;
              color: $uni-text-hr-main-color;
            }
          }
        }

        .card-phone {
          text {
            font-size: $uni-font-size-24;
            color: $uni-text-hr-grey-color;
            line-height: 34rpx;
          }
        }
      }

      // 通用的标题样式
      .title-text {
        box-sizing: border-box;
        padding: 64rpx 0 24rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        text {
          height: 44rpx;
          font-size: $uni-font-size-32;
          font-weight: 600;
          line-height: 44rpx;
        }

        view.title-right {
          display: flex;
          align-items: center;
          font-size: 26rpx;
          color: $uni-text-hr-main-color;
          line-height: 36rpx;

          .icon-font {
            display: inline-block;
          }
        }
      }

      .want {
        .want-box {
          view.support1 {
            width: 100%;
            height: 172rpx;
            border: 2rpx solid #f3f3f3;
            border-radius: 16rpx;
            box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.06);
            padding: 40rpx;
            box-sizing: border-box;

            .icon {
              font-size: 80rpx;
            }

            view.left {
              view {
                display: flex;
                margin-bottom: 8rpx;

                text {
                  font-size: $uni-font-size-36;
                  font-weight: 600;
                  text-align: left;
                  color: $hr-neutral-color-10;
                  line-height: 50prx;
                  margin-right: 16rpx;
                }

                .icon-font {
                  // font-size: 32rpx;
                  width: 32rpx;
                  height: 32rpx;
                }
              }

              text {
                text-align: left;
                color: $uni-text-hr-grey-color;
                line-height: 34rpx;
              }
            }
          }

          view.support2 {
            width: 100%;
            height: 184rpx;
            border: 2rpx solid #f3f3f3;
            border-radius: 16rpx;
            box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.06);
            padding: 0 24rpx;
            box-sizing: border-box;
            text-align: center;
            margin-right: 8rpx;

            .icon {
              font-size: 64rpx;
            }

            img {
              width: 64rpx;
              height: 64rpx;
            }

            view.right {
              margin-left: 16rpx;

              text {
                display: block;
                text-align: left;

                &:first-child {
                  font-size: $uni-font-size-36;
                  line-height: 50rpx;
                  margin-bottom: 4rpx;
                  color: $hr-neutral-color-10;
                  font-weight: 600;
                }

                font-size: $uni-font-size-24;
                color: $uni-text-hr-grey-color;
                line-height: 34rpx;
              }
            }
          }

          view.supportMore {
            padding: 38rpx 0 30rpx;
            width: 100%;
            height: 220rpx;
            border: 2rpx solid #f3f3f3;
            border-radius: 16rpx;
            box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.06);
            box-sizing: border-box;
            text-align: center;
            margin-right: 8rpx;

            &:last-child {
              margin-right: 0;
            }

            .icon {
              font-size: 80rpx;
            }

            text {
              margin-top: 16rpx;
              display: block;
              font-size: $uni-font-size-32;
              font-weight: 600;
              text-align: center;
              line-height: 44rpx;
            }
          }
        }
      }

      .hos {
        .hos-content {
          border: 2rpx solid #f3f3f3;
          border-radius: 16rpx;
          box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.06);

          .list {
            margin-top: 24rpx;

            ::v-deep .uni-collapse {
              border-bottom: 2rpx solid #e6e6e6;
              border-radius: 0.5rem;
              .uni-collapse-item-border {
                border: none;
              }

              .uni-collapse-item__title-box {
                height: 104rpx;
                border-bottom: 2rpx solid #f3f3f3;
                margin: 0 15px;
                padding: 0;
              }

              .uni-collapse-item__title-text {
                font-weight: 600;
                text-align: left;
                font-size: 36rpx;
                color: $hr-neutral-color-10;
                // color:#007aff
              }

              .introd {
                background: #f6f6f6;
                padding: 40rpx 30rpx 32rpx;

                .introd-info {
                  display: inline-block;
                  font-size: $uni-font-size-32;
                  text-align: left;
                  color: $uni-text-hr-main-color;
                  line-height: 48rpx;
                  margin-bottom: 32rpx;
                }
              }
            }

            ::v-deep .uni-collapse .select {
              .uni-collapse-item__title-text {
                color: var(--hr-brand-color-6);
              }
            }
          }
        }
      }

      .fuwu-phone {
        .content {
          border: 2rpx solid #f3f3f3;
          border-radius: 16rpx;
          box-shadow: 0px 4rpx 24rpx 0px rgba(0, 0, 0, 0.06);
          height: 65vh;
        }
      }
    }

    .padd {
      padding: 40rpx 32rpx 0;
    }

    .hosButton {
      padding: 40rpx 0;
      box-sizing: border-box;

      .hosBar {
        display: flex;
        :nth-child(0) {
          margin-left: 15rpx;
        }
        :nth-child(1) {
          margin-right: 15rpx;
        }
        .hosBarItem {
          padding: 30rpx 25rpx;
          flex: 1 1 auto;
          display: flex;
          border: 2rpx solid #f3f3f3;
          border-radius: 16rpx;
          box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.06);
          .icon-font {
            width: 100upx;
            height: 100upx;
            position: relative;
            flex: 0 0 auto;
          }
          .title {
            // font-size: $uni-font-size-32;
            flex: 1 1 auto;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      .GridDataList {
        margin-top: 20rpx;
        border: 2rpx solid #f3f3f3;
        border-radius: 16rpx;
        box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.06);
        position: relative;
        // display: flex;
        flex-direction: row;
        .listItem {
          display: flex;
          position: relative;
          flex-direction: column;
          flex: 1;
        }
        .listItem:before {
          display: block;
          content: ' ';
          padding-bottom: 90%;
        }

        .listItem:after {
          content: '';
          position: absolute;
          z-index: 1;
          transform-origin: center;
          box-sizing: border-box;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          border-color: #c8c7cc;
          border-style: solid;
          border-width: 1px;
          -webkit-transform: scale(0.5);
          transform: scale(0.5);
          border-top-width: 0;
          border-left-width: 0;
        }
      }
    }
    .icon-resize {
      font-size: 40rpx;
      color: $uni-color-primary;
    }
  }
</style>
