<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="choose-pat"
  >
    <g-popup title="更换就诊人" ref="actionSheet">
      <view class="choose-pat-container g-flex-rc-cc">
        <view style="width: 100%">
          <Pat-List
            :showPat="pat"
            :isShowAll="isShowAll"
            @choose-pat="actionSheetItemClick"
          />
        </view>

        <view class="add-pat-box">
          <view class="add-pat g-flex-rc-cc" @click="goAddPat">
            <view class="iconfont icon-resize f48">&#xe6ab;</view>
            <text class="f32">添加就诊人</text>
          </view>
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

  import PatList from './choose-pat-list.vue';

  export default defineComponent({
    emits: ['choose-pat'],

    props: {
      autoStore: {
        type: Boolean,
        default: false,
      },

      isShowAll: {
        type: Boolean,
        default: false,
      },

      pat: {
        type: Object as PropType<IPat>,
      },
    },

    components: {
      PatList,
    },

    setup(props, ctx) {
      const actionSheet = ref();
      const gStores = new GStores();
      const actionSheetItemClick = (e: { index: number; item: IPat }) => {
        actionSheet.value.hide();

        if (props.autoStore && e.item.patientId) {
          gStores.userStore.updatePatChoose(e.item);
        }
        ctx.emit('choose-pat', e);
      };

      const show = () => {
        if (actionSheet.value) {
          actionSheet.value.show();
        }
      };

      const goAddPat = () => {
        actionSheet.value.hide();
        const pages = getCurrentPages();
        const fullPathNow = (pages[pages.length - 1] as any).$page
          .fullPath as string;

        uni.navigateTo({
          url:
            globalGl.addPersonUrl + '?_url=' + encodeURIComponent(fullPathNow),
        });
      };

      return {
        actionSheet,
        actionSheetItemClick,
        show,
        gStores,
        goAddPat,
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
