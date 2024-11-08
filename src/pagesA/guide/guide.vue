<template>
  <view class="g-page page-bg">
    <view class="bg-white">
      <view class="fix-top">
        <Guide-Pat-Choose @choose-pat="handlerChoosePatAction" />
      </view>
      <view class="g-border-bottom fix-top z-1">
        <g-tabs
          v-model:value="tabCurrent"
          :tabs="tabField"
          :scroll="false"
          @change="tabChange"
          field="label"
          style="width: 100%"
        />
      </view>

      <scroll-view
        v-if="visitList.length"
        scroll-x
        class="pt16 pb16 fix-top z-1 bg-white"
      >
        <Guide-Visit-List :list="visitList" />
      </scroll-view>

      <view class="page-bg relative pl32 pr32">
        <view class="my-hide f24">占位</view>
        <Guide-Content-List />
        <view class="safe-height" />
        <view class="safe-height" />
      </view>
    </view>

    <Choose-Pat-Action
      @choose-pat="patChange"
      :pat="gStores.userStore.patChoose"
      ref="actionSheet"
    />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { debounce, GStores } from '@/utils';

  import TagStatus from './components/TagStatus.vue';
  import GuidePatChoose from './components/GuidePatChoose.vue';
  import GuideVisitList from './components/GuideVisitList.vue';
  import GuideContentList from './components/GuideContentList.vue';
  import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';

  const gStores = new GStores();
  const tabCurrent = ref(0);
  const tabField = [
    {
      label: '今日就诊',
      key: 0,
    },
    {
      label: '未来就诊',
      key: 1,
    },
    {
      label: '历史就诊',
      key: 2,
    },
  ];
  let tabChange = (idx: number) => {
    tabCurrent.value = idx;

    // getListData();
  };
  tabChange = debounce(tabChange, 80, false);

  const actionSheet = ref<InstanceType<typeof ChoosePatAction>>();
  const handlerChoosePatAction = () => {
    const patList = gStores.userStore.patList;
    if (!patList.length) {
      gStores.messageStore.showMessage('暂无就诊人， 请先添加就诊人');
      return;
    }

    if (actionSheet.value) {
      actionSheet.value.show();
    }
  };

  const visitList = ref([
    {
      label: '甲状腺外科门诊',
      time: '09-25',
    },
    {
      label: '甲状腺外科门诊',
      time: '04-25',
    },
    {
      label: '甲状腺外科门诊',
      time: '03-25',
    },
  ]);

  const patChange = () => {
    console.log(gStores.userStore.patChoose);
  };

  onLoad(async () => {});
</script>

<style lang="scss" scoped>
  .page-bg {
    background: #e9f0ff;
  }

  .fix-top {
    position: sticky;
    top: 0;
  }
</style>
