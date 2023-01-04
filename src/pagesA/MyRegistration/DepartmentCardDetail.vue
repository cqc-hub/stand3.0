<template>
  <view class="g-page">
    <view class="header-bg">
      <image v-if="detailBg" :src="detailBg" />
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
            {{
              '心血管内科一病区是以冠心病、心律失常、难治性心衰、难治性高血压病、心肌病、心脏瓣膜病、代谢性疾病及心血管介入为专业的临床综合学科。国家高血压医联体咸阳分中心，心血管内科一病区是以冠心病、心律失常、难治性心衰、难治性高血压病、心肌病、心脏瓣膜病、代谢性疾病及心血管介入为专业的临床综合学科。国家高血压医联体咸阳分中心，'
            }}
          </text>

          <view
            @click="regDialogConfirm.show"
            class="doc-show-intro f26 color-blue"
          >
            <text>更多</text>
            <text class="iconfont">&#xe66b;</text>
          </view>
        </view>
      </view>

      <view class="department-pro">
        <view class="g-flex-rc-cc g-border department-pro-item">
          <view class="icon-font ico_sy_paper4" />
          <view class="f32 g-bold">健康科普</view>
        </view>

        <view class="g-flex-rc-cc g-border department-pro-item">
          <view class="icon-font ico_sy_search" />
          <view class="f32 g-bold">疾病知识库</view>
        </view>

        <view class="g-flex-rc-cc g-border department-pro-item">
          <view class="icon-font ico_sy_dialogue" />
          <view class="f32 g-bold">在线咨询</view>
        </view>
      </view>

      <block v-if="detailInfo.docList && detailInfo.docList.length">
        <view class="department-doc-title g-bold f36">
          科室医生({{ detailInfo.docList.length }})
        </view>

        <view class="mt16">
          <Department-Doc-List :list="detailInfo.docList" />
        </view>
      </block>
    </view>

    <Order-Reg-Confirm
      :headerIcon="$global.BASE_IMG + 'v3-order-reg-confirm-add.png'"
      :title="pageProps.deptName"
      isHideFooter
      ref="regDialogConfirm"
    >
      <view>233</view>
    </Order-Reg-Confirm>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad, onReady } from '@dcloudio/uni-app';

  import { deQueryForUrl } from '@/common';
  import { TDepartmentDetail } from './utils/DepartmentCard';

  import api from '@/service/api';

  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import DepartmentDocList from './components/DepartmentCard/departmentDocList.vue';

  const pageProps = ref({
    id: '',
    deptName: '',
  });
  const isComplete = ref(false);
  const detailBg = ref(
    'https://phs-v3-dev.oss-cn-hangzhou.aliyuncs.com/phs-images/image1667555460090-164027.jpg'
  );
  const regDialogConfirm = ref<any>('');
  const detailInfo = ref({} as TDepartmentDetail);

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
        height: 100%;
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
</style>
