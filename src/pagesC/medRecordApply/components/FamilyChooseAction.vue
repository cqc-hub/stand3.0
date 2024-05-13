<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="choose-pat"
  >
    <g-popup :title="title" ref="actionSheet">
      <view class="choose-pat-container g-flex-rc-cc">
        <view style="width: 100%">
          <Family-Choose-Pat-List @choose-pat="actionSheetItemClick" />
        </view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts">
  import { PropType, defineComponent, ref } from 'vue';
  import { GStores } from '@/utils';
  import { IPat } from '@/stores';
  import globalGl from '@/config/global';

  import FamilyChoosePatList from './FamilyChoosePatList1.vue';

  export default defineComponent({
    emits: ['choose-pat'],

    props: {
      title: {
        type: String,
        default: '更换就诊人',
      },

      pat: {
        type: Object as PropType<IPat>,
      },
    },

    components: {
      // PatList,
      FamilyChoosePatList,
    },

    setup(props, ctx) {
      const actionSheet = ref();
      const gStores = new GStores();
      const actionSheetItemClick = (e: { index: number; item: IPat }) => {
        actionSheet.value.hide();

        ctx.emit('choose-pat', e);
      };

      const show = () => {
        if (actionSheet.value) {
          actionSheet.value.show();
        }
      };


      return {
        actionSheet,
        actionSheetItemClick,
        show,
        gStores,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .choose-pat {
    .choose-pat-container {
      margin-top: 32rpx;
      flex-direction: column;
    }

    .add-pat-box {
      margin: 0 32rpx;
      padding: 40rpx 0;
      padding-bottom: 50rpx;
      border-radius: 16rpx;
      color: var(--hr-brand-color-6);
      font-weight: var(--h-weight-2);

      .icon-resize {
        margin-right: 10rpx;
        font-weight: 500;
        color: var(--hr-brand-color-6);
      }
    }
  }
</style>
