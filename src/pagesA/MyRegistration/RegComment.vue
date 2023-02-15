<template>
  <view class="g-page">
    <scroll-view :scroll-into-view="scrollTo" class="g-container" scroll-y>
      <view class="pt24">
        <view class="comment-card">
          <view id="rate_doc" class="f36 g-bold pb32 g-border-bottom mb16">
            您对就诊医生满意吗？
          </view>

          <view>
            <Reg-Comment-Doc-Card
              :item="docDetail"
              :appointmentDate="pageProps.appointmentDate"
              @avatar-click="goDoctorCard"
            />
          </view>

          <view class="mb40">
            <Reg-Comment-Rate v-model:value="docGrade" :disabled="isForShow" />
          </view>

          <view
            v-if="DOC_EVALUATION_CONTENT && DOC_EVALUATION_CONTENT.length"
            class="mb40"
          >
            <g-select-flatten
              v-if="isRender(docEvlContentList)"
              :selectLength="99"
              :list="DOC_EVALUATION_CONTENT"
              :field="flattenField"
              :column="3"
              :disabled="isForShow"
              v-model:value="docEvlContentList"
              multiple
            />
          </view>

          <view class="comment-input">
            <uni-easyinput
              type="textarea"
              v-if="isRender(adviseForDoc)"
              v-model="adviseForDoc"
              autoHeight
              :disabled="isForShow"
              :maxlength="200"
              :inputBorder="false"
              :placeholderStyle="'color: var(--hr-neutral-color-5);font-size: var(--hr-font-size-base);'"
              placeholder="说说您对医生的意见和建议"
            />
          </view>
        </view>
      </view>

      <view class="comment-card mt24">
        <view id="rate_hos" class="f36 g-bold pb32 mb16">
          您对就医服务满意吗？
        </view>

        <view class="mb40">
          <Reg-Comment-Rate
            v-model:value="serviceSatisfactionGrade"
            v-if="isRender(serviceSatisfactionGrade)"
            :disabled="isForShow"
          />
        </view>

        <view
          v-if="
            DOC_SERVICE_SATISFACTION_CONTENT &&
            DOC_SERVICE_SATISFACTION_CONTENT.length &&
            serviceSatisfactionGrade &&
            serviceSatisfactionGrade < 3 &&
            isRender(rateInfoList)
          "
          class="mb40"
        >
          <g-select-flatten
            :selectLength="99"
            :list="DOC_SERVICE_SATISFACTION_CONTENT"
            :field="flattenField"
            :column="2"
            :disabled="isForShow"
            v-model:value="rateInfoList"
            multiple
          />
        </view>

        <view class="comment-input mb32">
          <uni-easyinput
            type="textarea"
            v-if="isRender(adviseForHos)"
            v-model="adviseForHos"
            autoHeight
            :disabled="isForShow"
            :maxlength="200"
            :inputBorder="false"
            :placeholderStyle="'color: var(--hr-neutral-color-5);font-size: var(--hr-font-size-base);'"
            placeholder="说说您对医院的意见和建议"
          />
        </view>

        <view class="comment-input height-href">
          <uni-easyinput
            type="textarea"
            v-model="otherSuggestions"
            v-if="isRender(otherSuggestions)"
            :disabled="isForShow"
            :maxlength="200"
            :inputBorder="false"
            :placeholderStyle="'color: var(--hr-neutral-color-5);font-size: var(--hr-font-size-base);'"
            placeholder="其他意见和建议"
            autoHeight
          />
        </view>
      </view>

      <view class="safe-height" />
    </scroll-view>

    <g-message />

    <view v-if="!isForShow" class="footer g-border-top">
      <button @click="submitComment" class="btn g-border btn-primary">
        提交评价
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, computed } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';

  import { deQueryForUrl, joinQuery, joinQueryForUrl } from '@/common';
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
    rateFlag?: '0';
  };
  type TFalttenList = {
    label: string;
    code: string;
  }[];

  const pageProps = ref({} as TPageProp);
  const gStores = new GStores();

  const docDetail = ref({} as IDocDetail);

  const flattenField = {
    label: 'label',
    value: 'code',
  };
  const DOC_EVALUATION_CONTENT = ref([] as TFalttenList);
  const DOC_SERVICE_SATISFACTION_CONTENT = ref([] as TFalttenList);
  const docEvlContentList = ref([] as string[]);
  const rateInfoList = ref([] as string[]);

  const docGrade = ref(0);
  const serviceSatisfactionGrade = ref(0);
  const adviseForDoc = ref('');
  const adviseForHos = ref('');
  const otherSuggestions = ref('');
  const scrollTo = ref('');
  watch(
    () => scrollTo.value,
    () => {
      setTimeout(() => {
        scrollTo.value = '';
      }, 100);
    }
  );

  const isForShow = computed(() => {
    return pageProps.value.rateFlag === '0';
  });
  const isRender = (v: any) => {
    if (isForShow.value) {
      if (typeof v === 'object') {
        return !!v.length;
      } else {
        return !!v;
      }
    } else {
      return true;
    }
  };

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

  const getConfig = async () => {
    const { result } = await api.getTermsBySysAndCode({
      domainCode: 'DOC_EVALUATION_CONTENT|DOC_SERVICE_SATISFACTION_CONTENT',
    });

    if (result && result.length) {
      const [EVALUATION, SERVICE] = result;

      EVALUATION.terms.map((o) => {
        o.code = o.code * 1;
      });
      SERVICE.terms.map((o) => {
        o.code = o.code * 1;
      });

      DOC_EVALUATION_CONTENT.value = EVALUATION.terms;
      DOC_SERVICE_SATISFACTION_CONTENT.value = SERVICE.terms;
    }
  };

  const goShowPage = () => {
    const args = {
      docGrade: docGrade.value,
      docEvlContentList: docEvlContentList.value,
      adviseForDoc: adviseForDoc.value,
      serviceSatisfactionGrade: serviceSatisfactionGrade.value,
      rateInfoList: rateInfoList.value,
      adviseForHos: adviseForHos.value,
      otherSuggestions: otherSuggestions.value,
    };

    uni.redirectTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/RegCommentRes', {
        para: JSON.stringify(args),
      }),
    });
  };

  const getCommentHis = async () => {
    const { orderId } = pageProps.value;
    const {
      browser: { source },
    } = gStores.globalStore;

    const { result } = await api.findSatisfactionInfo({
      orderId,
      source,
    });

    if (result) {
      const {
        adviseForDoc: _adviseForDoc,
        adviseForHos: _adviseForHos,
        docEvlContentList: _docEvlContentList,
        docGrade: _docGrade,
        otherSuggestions: _otherSuggestions,
        rateInfoList: _rateInfoList,
        serviceSatisfactionGrade: _serviceSatisfactionGrade,
      } = result;

      adviseForDoc.value = _adviseForDoc;
      adviseForHos.value = _adviseForDoc;
      docEvlContentList.value = _docEvlContentList;
      docGrade.value = _docGrade;
      otherSuggestions.value = _otherSuggestions;
      rateInfoList.value = _rateInfoList;
      serviceSatisfactionGrade.value = _serviceSatisfactionGrade;
    }
  };

  const goDoctorCard = () => {
    const { deptName, docName, hosDocId, hosId, hosDeptId } = docDetail.value;
    if (hosDocId) {
      uni.navigateTo({
        url: joinQuery('/pagesA/MyRegistration/DoctorDetails', {
          deptName,
          docName,
          hosDocId,
          hosId,
          hosDeptId,
        }),
      });
    }
  };

  const init = async () => {
    await getConfig();
    getDocDetail();

    if (isForShow.value) {
      getCommentHis();
    }
  };

  const submitComment = async () => {
    const { orderId } = pageProps.value;
    const {
      browser: { source },
    } = gStores.globalStore;

    if (!docGrade.value) {
      scrollTo.value = '"rate_doc';
      gStores.messageStore.showMessage('请选择医生评分', 3000);

      return;
    }

    if (!serviceSatisfactionGrade.value) {
      gStores.messageStore.showMessage('请选择就医服务评分', 3000);
      scrollTo.value = '"rate_hos';

      return;
    } else {
      if (serviceSatisfactionGrade.value < 3) {
        if (!rateInfoList.value.length) {
          scrollTo.value = '"rate_hos';
          gStores.messageStore.showMessage(
            '请选择本次就医服务不满意的地方',
            3000
          );

          return;
        }
      }
    }

    const requestArg = {
      orderId,
      adviseForDoc: adviseForDoc.value,
      adviseForHos: adviseForHos.value,
      otherSuggestions: otherSuggestions.value,
      docEvlContentList: docEvlContentList.value,
      docGrade: docGrade.value,
      rateInfoList: rateInfoList.value,
      serviceSatisfactionGrade: serviceSatisfactionGrade.value,
      source,
    };

    await api.addRegSatisfaction(requestArg);

    gStores.messageStore.showMessage(
      '您的评价已提交，请等待系统审核通过',
      3000,
      {
        closeCallBack() {
          goShowPage();
        },
      }
    );
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

    .footer {
      background-color: var(--h-color-white);
      padding: 24rpx 32rpx 48rpx;
      position: reactive;
      z-index: 1;
      gap: 18rpx;
    }
  }
</style>
