<template>
  <view class="g-page">
    <view class="header-bg">
      <image
        v-if="detailInfo.deptPhoto"
        :src="detailInfo.deptPhoto"
        @click="previewImage([detailInfo.deptPhoto])"
      />
    </view>

    <view class="container">
      <view class="g-bold f48">{{ pageProps.deptName }}</view>

      <view class="flex-normal doc-goodat">
        <view class="color-444 f32 doc-goodat-content text-ellipsis">
          <image
            :src="$global.BASE_IMG + 'department-intro-text.png'"
            class="doc-major-goodat mr12"
            mode="widthFix"
          />
          <text>
            {{ detailInfo.recommendation }}
          </text>

          <view
            v-if="detailInfo.recommendation"
            @click="regDialogConfirm.show"
            class="doc-show-intro f26 color-blue"
          >
            <text>更多</text>
            <text class="iconfont">&#xe66b;</text>
          </view>
        </view>
      </view>

      <view class="department-pro">
        <view
          @click="goZiXun"
          class="g-flex-rc-cc g-border department-pro-item"
        >
          <view class="icon-font ico_sy_paper4" />
          <view class="f32 g-bold">健康科普</view>
        </view>

        <view
          @click="goDiseaseCyclopedia"
          class="g-flex-rc-cc g-border department-pro-item"
        >
          <view class="icon-font ico_sy_search" />
          <view class="f32 g-bold">疾病知识库</view>
        </view>

        <view
          v-if="detailInfo.netHosUrl"
          @click="goOrder"
          class="g-flex-rc-cc g-border department-pro-item"
        >
          <view class="icon-font ico_sy_dialogue" />
          <view class="f32 g-bold">在线咨询</view>
        </view>
      </view>

      <block v-if="detailInfo.docList && detailInfo.docList.length">
        <view class="department-doc-title g-bold f36">
          科室医生({{ detailInfo.docList.length }})
        </view>

        <view class="mt16">
          <Department-Doc-List
            :list="detailInfo.docList"
            @item-click="docItemClick"
          />
        </view>
      </block>
    </view>

    <Order-Reg-Confirm
      :headerIcon="$global.BASE_IMG + 'v3-order-reg-confirm-add.png'"
      :title="pageProps.deptName"
      isHideFooter
      ref="regDialogConfirm"
    >
      <view>
        <view class="mb16 flex-normal">
          <text class="ico_doctor-hat icon-font intro-popup-logo"></text>
          <text class="f36 g-bold">科室介绍</text>
        </view>

        <view class="color-444 f32">
          <text>
            {{ detailInfo.recommendation }}
          </text>
        </view>
      </view>
    </Order-Reg-Confirm>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad, onReady } from '@dcloudio/uni-app';

  import { deQueryForUrl, joinQueryForUrl } from '@/common';
  import {
    type TDepartmentDetail,
    type TDepartmentDocItem,
  } from './utils/DepartmentCard';
  import {
    type TBannerConfig,
    useTBanner,
    GStores,
    previewImage,
  } from '@/utils';

  import api from '@/service/api';
  import globalGl from '@/config/global';

  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import DepartmentDocList from './components/DepartmentCard/departmentDocList.vue';

  const pageProps = ref({
    id: '',
    deptName: '',
    hosId: '',
  });
  const isComplete = ref(false);
  const regDialogConfirm = ref<any>('');
  const detailInfo = ref({} as TDepartmentDetail);
  const gStores = new GStores();

  const getDetailData = async () => {
    const { id } = pageProps.value;
    isComplete.value = false;

    const { result } = await api
      .getDeptCardDetail({
        id,
      })
      .finally(() => {
        isComplete.value = true;
      });

    detailInfo.value = result;
  };

  const docItemClick = (item: TDepartmentDocItem) => {
    const { docName, hosDocId } = item;
    const { deptName, hosId } = pageProps.value;

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/DoctorDetails', {
        docName,
        deptName,
        hosId,
        hosDocId,
      }),
    });
  };

  const goOrder = () => {
    // const { deptName, hosId } = pageProps.value;

    // const queryArg = {
    //   deptName,
    //   hosId,
    // };
    // uni.navigateTo({
    //   url: joinQueryForUrl('/pagesA/MyRegistration/order', queryArg),
    // });

    uni.navigateTo({
      url:
        '/pagesA/webView/webView?https=' +
        encodeURIComponent(detailInfo.value.netHosUrl),
    });
  };

  const goZiXun = () => {
    const { sysCode } = gStores.globalStore;
    const { deptId } = detailInfo.value;

    const arg: TBannerConfig = {
      type: 'h5',
      isSelfH5: '1',
      extraData: {
        sysCode,
        entranceType: '2',
        deptId,
      },
      path: 'pagesA/healthAdvisory/healthAdvisory',
      src: 'https://phsdevoss.eheren.com/pcloud/image/jbbk-index.png',
      // isLocal: '1',
    };

    useTBanner(arg);
  };

  const goDiseaseCyclopedia = () => {
    const { sysCode } = gStores.globalStore;

    const arg: TBannerConfig = {
      type: 'h5',
      extraData: {
        sysCode,
      },
      path:
        'https://' +
        ((globalGl.env as string) === 'prod' ? 'h5' : 'health') +
        '.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/index',
      src: 'https://phsdevoss.eheren.com/pcloud/image/jbbk-index.png',
    };

    useTBanner(arg);
  };

  const init = async () => {
    await getDetailData();
  };

  onLoad((opt) => {
    try {
      pageProps.value = deQueryForUrl(opt);
      pageProps.value = deQueryForUrl(pageProps.value);
    } catch (error) {
      console.error('prop 解析报错');
    }

    init();
  });

  onReady(() => {
    uni.setNavigationBarTitle({
      title: pageProps.value.deptName,
    });
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: #fff;

    .header-bg {
      width: 100%;
      height: 422rpx;

      image {
        width: 100%;
        height: 422rpx;
      }
    }

    .container {
      padding: 48rpx 32rpx;
      background: #fff;
      border-radius: 12px 12px 0px 0px;

      transform: translateY(-88rpx);

      .doc-goodat {
        align-items: flex-start;
        transform: translateY(24rpx);
        .doc-major-goodat {
          width: 126rpx;
        }

        .doc-goodat-content {
          -webkit-line-clamp: 4;
          flex: 1;

          .doc-show-intro {
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: 2;
            display: flex;
            padding-left: 1.5em;
            align-items: center;
            justify-content: flex-end;
            background: linear-gradient(
              270deg,
              #fff 0,
              #fff 80%,
              rgba(255, 255, 255, 0.3) 100%
            );
          }
        }
      }

      .department-pro {
        margin-top: 58rpx;

        display: grid;
        grid-template: 204rpx / repeat(3, 1fr);
        gap: 16rpx;

        .department-pro-item {
          flex-direction: column;
          border-radius: 8px;
          box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.04);

          .icon-font {
            width: 56rpx;
            height: 56rpx;
            margin-bottom: 24rpx;
          }
        }
      }

      .department-doc-title {
        margin-top: 64rpx;
      }
    }
  }

  .intro-popup-logo {
    width: 48rpx;
    height: 48rpx;
    margin-right: 12rpx;
    position: relative;
    top: -5rpx;
  }
</style>
