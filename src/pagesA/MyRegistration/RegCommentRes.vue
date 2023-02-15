<template>
  <view class="g-page f32">
    <view class="g-container">
      <image
        :src="$global.BASE_IMG + 'stand3-RegCommentResHeaderBg.png'"
        class="header-bg"
        mode="widthFix"
      />

      <view style="height: 44rpx; width: 1px" />

      <view class="container-box">
        <view class="header-content">
          <image
            :src="$global.BASE_IMG + 'stand3-RegCommentResHeaderBg-top.png'"
            class="header-bg-top"
            mode="widthFix"
          />
        </view>

        <view class="content">
          <view class="container-top mb32">
            <view class="p32">
              <view class="g-bold g-flex-rc-cc mb32">
                您对本次就诊医生的评价
              </view>

              <view class="mb32">
                <Reg-Comment-Rate :value="docGrade" disabled />
              </view>

              <view
                v-if="
                  DOC_EVALUATION_CONTENT &&
                  DOC_EVALUATION_CONTENT.length &&
                  docEvlContentList.length
                "
                class="mb40"
              >
                <g-select-flatten
                  :selectLength="99"
                  :list="DOC_EVALUATION_CONTENT"
                  :field="flattenField"
                  :column="3"
                  v-model:value="docEvlContentList"
                  disabled
                  multiple
                />
              </view>

              <view class="g-bold g-flex-rc-cc mb32">
                您对本次就医服务的评价
              </view>

              <view class="mb32">
                <Reg-Comment-Rate :value="serviceSatisfactionGrade" disabled />
              </view>

              <view v-if="serviceSatisfactionGrade < 3" class="mb40">
                <g-select-flatten
                  :selectLength="99"
                  :list="DOC_SERVICE_SATISFACTION_CONTENT"
                  :field="flattenField"
                  :column="2"
                  v-model:value="rateInfoList"
                  multiple
                  disabled
                />
              </view>
            </view>
          </view>

          <view class="container">
            <view v-if="adviseForDoc" class="row g-border-bottom p24b">
              <view class="color-444 f28 mb8">您对医生的意见和建议</view>
              <view class="g-bold g-break-word">
                {{ adviseForDoc }}
              </view>
            </view>

            <view v-if="adviseForHos" class="row g-border-bottom p24v">
              <view class="color-444 f28 mb8">您对医院的意见和建议</view>
              <view class="g-bold g-break-word">
                {{ adviseForHos }}
              </view>
            </view>

            <view v-if="otherSuggestions" class="row p24v">
              <view class="color-444 f28 mb8">其他意见和建议</view>
              <view class="g-bold g-break-word">
                {{ otherSuggestions }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="safe-height" />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';

  import { deQueryForUrl } from '@/common';

  import api from '@/service/api';

  import RegCommentRate from './components/RegComment/RegCommentRate.vue';

  type TFalttenList = {
    label: string;
    code: string;
  }[];

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

  const init = async () => {
    await getConfig();
  };

  onLoad((opt) => {
    const {
      docGrade: _docGrade,
      docEvlContentList: _docEvlContentList,
      adviseForDoc: _adviseForDoc,
      serviceSatisfactionGrade: _serviceSatisfactionGrade,
      rateInfoList: _rateInfoList,
      adviseForHos: _adviseForHos,
      otherSuggestions: _otherSuggestions,
    } = JSON.parse(deQueryForUrl(deQueryForUrl(opt)).para);

    docGrade.value = _docGrade;
    docEvlContentList.value = _docEvlContentList;
    adviseForDoc.value = _adviseForDoc;
    serviceSatisfactionGrade.value = _serviceSatisfactionGrade;
    rateInfoList.value = _rateInfoList;
    adviseForHos.value = _adviseForHos;
    otherSuggestions.value = _otherSuggestions;

    init();
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: var(--hr-neutral-color-1);
  }

  .header-bg {
    width: 100%;
    position: absolute;
    z-index: 1;
  }

  .container-box {
    position: relative;
    z-index: 2;
  }

  .header-bg-top {
    width: 100%;
  }

  .header-content {
    padding: 0 16rpx;
    transform: translateY(12rpx);
  }

  .content {
    padding: 0 32rpx;
  }

  .container-top {
    background-color: #fff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.04);
    border-radius: 0 0 8px 8px;
  }

  .container {
    @extend .container-top;

    border-radius: 8px;
    padding: 24rpx 32rpx;
  }
</style>
