<template>
  <view class="g-page">
    <scroll-view class="g-container" scroll-y>
      <view class="pt24">
        <view class="comment-card">
          <view class="f36 g-bold pb32 g-border-bottom mb16">
            您对就诊医生满意吗？
          </view>

          <view>
            <Reg-Comment-Doc-Card :item="docDetail" />
          </view>

          <view class="mb40">
            <Reg-Comment-Rate v-model:value="r" />
          </view>

          <view>
            <g-select-flatten
              :selectLength="99"
              :list="aimList"
              v-model:value="aimValue"
              multiple
            />
          </view>

          <view class="comment-input mb32">
            <uni-easyinput
              type="textarea"
              v-model="b"
              autoHeight
              :maxlength="200"
              :inputBorder="false"
              :placeholderStyle="'color: var(--hr-neutral-color-5);font-size: var(--hr-font-size-base);'"
              placeholder="请输入您对医院的建议和意见"
              disabled
            />
          </view>

          <view class="comment-input height-href">
            <uni-easyinput
              type="textarea"
              v-model="b"
              :maxlength="200"
              :inputBorder="false"
              :placeholderStyle="'color: var(--hr-neutral-color-5);font-size: var(--hr-font-size-base);'"
              placeholder="请输入您的其他意见或建议"
              autoHeight
            />
          </view>
        </view>
      </view>
    </scroll-view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';

  import { deQueryForUrl } from '@/common';
  import { GStores } from '@/utils';
  import { type IDocDetail } from './utils/DoctorDetails';

  import api from '@/service/api';

  import RegCommentRate from './components/RegComment/RegCommentRate.vue';
  import RegCommentDocCard from './components/RegComment/RegCommentDocCard.vue';

  type TPageProp = {
    orderId: string;
    deptName: string;
    docName: string;
    appointmentDate: string;
    hosDocId: string;
    hosId: string;
    hosDeptId: string;
    rateFlag: '0' | string;
  };
  const pageProps = ref({} as TPageProp);
  const gStores = new GStores();

  const docDetail = ref({} as IDocDetail);

  const _aimList = [''];
  const aimList = ref([]);
  const aimValue = ref('');

  const a = ref(false);
  const r = ref(5);
  const b = ref('');

  const getDocDetail = async () => {
    const { deptName, docName, hosDeptId, hosDocId, hosId } = pageProps.value;

    const args = {
      deptName,
      docName,
      hosDeptId,
      hosDocId,
      hosId,
    };

    const { result } = await api.findByDocId(args);
    docDetail.value = result;
  };

  const init = async () => {
    getDocDetail();
  };

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    init();

    console.log(pageProps.value);
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: var(--hr-neutral-color-1);

    .g-container {
      width: calc(100% - 64rpx);
      padding-left: 32rpx;
    }

    .comment-card {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.04);
      padding: 32rpx;

      .comment-input {
        background-color: var(--hr-neutral-color-1);
        padding: 12rpx 24rpx;
        padding-right: 0;
        border: 1px solid var(--hr-neutral-color-11);
        border-radius: 8px;

        :deep(.uni-easyinput__content.is-textarea) {
          background-color: var(--hr-neutral-color-1) !important;

          .uni-easyinput__content-textarea {
            background-color: transparent;
            font-size: var(--hr-font-size-base);
            color: var(--hr-neutral-color-9);
          }
        }

        &.height-href {
          :deep(.uni-easyinput__content.is-textarea) {
            .uni-easyinput__content-textarea {
              min-height: 85rpx;
              height: auto;
            }
          }
        }
      }
    }
  }
</style>
