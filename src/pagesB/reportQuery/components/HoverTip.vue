<template>
  <view v-if="btns.length">
    <view class="ask-doc">
      <view class="content">
        <view>报告看不懂？结果有疑问？</view>
        <view class="btn-primary" @click="askDoc">咨询医生</view>
      </view>
    </view>

    <Popup-Select
      :list="btns"
      :field="{
        label: 'text',
        value: 'text',
      }"
      :title="selectTitle"
      @item-click="btnClick"
      ref="refSel"
      autoInOne
    >
      <view class="p32c">
        <g-flag
          v-model:title="selectTitle"
          typeFg="770"
          isShowFgTip
          isHideTitle
          aaa
        />
      </view>
    </Popup-Select>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { ISystemConfig } from '@/utils';
  import { type TButtonConfig, useTBanner } from '@/utils';

  import PopupSelect from '@/pagesB/components/popupSelect/PopupSelect.vue';

  const props = defineProps<{
    config: ISystemConfig['reportQuery'];
    type: 'jc' | 'jy';
    addition: BaseObject;
  }>();
  const refSel = ref(<any>'');
  const selectTitle = ref('');

  const btns = computed(() => {
    const btns =
      props.type === 'jy'
        ? props.config.jyHoverTipBtns
        : props.config.jcHoverTipBtns;

    if (btns) {
      return (Array.isArray(btns) && btns) || [btns];
    } else {
      return [];
    }
  });

  const askDoc = () => {
    // btn.type === 'self'
    refSel.value?.show();
  };

  const btnClick = (btn: TButtonConfig) => {
    useTBanner(btn, 'navigateTo', props.addition);
  };
</script>

<style lang="scss" scoped>
  .ask-doc {
    padding: 64upx 32upx;
    position: fixed;
    bottom: 66rpx;
    right: 0;
    left: 0;
    color: #fff;
    z-index: 5;

    .content {
      display: flex;
      justify-content: space-between;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 8px;
      padding: 26upx 32upx;
      align-items: center;

      .btn-primary {
        background: var(--hr-brand-color-6);
        border-radius: 6px;
        padding: 10upx 16upx;
      }
    }
  }
</style>
