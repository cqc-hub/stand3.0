<template>
  <view class="">
    <view class="flex flex-wrap gap-4">
      <template v-for="(btn, bi) in btns" :key="bi">
        <view
          v-if="
            isRenBtn({
              btn,
              item,
              lab,
            })
          "
          @click="btnClick(btn)"
          :class="btn.btnClass"
          class="flex-1 f28 btn btn-border color-111 btn-default btn-round mt24"
        >
          {{ btn.text }}
        </view>
      </template>

      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { TGuideButtonConfig } from '@/types';

  const props = defineProps<{
    btns: TGuideButtonConfig[];
    item: any;
    // 子
    lab?: any;
  }>();

  const emits = defineEmits(['btn-click']);

  const isRenBtn = (opt: { lab?: any; btn: TGuideButtonConfig; item: any }) => {
    const { btn, lab = {}, item } = opt;
    const { labStatus = [], completionStatus = [], disposeStatus = [] } = btn;

    if (labStatus.length && lab) {
      if (!labStatus.includes(lab.status)) {
        return false;
      }
    }

    //  历史才有 1 未执行 2部分执行 3已执行 ———— 改为只有1未执行  2已执行 和导诊单一致
    if (disposeStatus.length && lab) {
      if (!disposeStatus.includes(lab.disposeStatus)) {
        return false;
      }
    }

    if (completionStatus.length) {
      if (!completionStatus.includes(item.completionStatus)) {
        return false;
      }
    }

    return true;
  };

  const btnClick = (btn: TGuideButtonConfig) => {
    emits('btn-click', {
      btn,
      item: {
        ...props.item,
        ...(props.lab || {}),
      },
    });
  };
</script>

<style lang="scss" scoped>
  .btn-round {
    border-radius: 19px;
  }
</style>
