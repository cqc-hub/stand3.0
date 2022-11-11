<template>
  <view class="">
    <view
      :class="{
        'my-display-none': hosList.length < 2,
      }"
      class="bread-crumbs"
      @click="toggleHos"
    >
      <view class="hos-label">当前医院：</view>
      <view class="hos-name text-ellipsis">{{ getHosName }}</view>
      <view class="iconfont ico-arrow">&#xe66b;</view>
    </view>

    <g-select
      :value="hosId"
      v-model:show="isToggleDialogShow"
      :option="hosList"
      :field="{
        label: 'hosName',
        value: 'hosId',
      }"
      @update:value="changeValue"
      @change="change"
      title="切换医院"
    />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue';
  import { GStores, ServerStaticData, IHosInfo } from '@/utils';

  const gStores = new GStores();
  const hosList = ref<IHosInfo[]>([]);
  const isToggleDialogShow = ref(false);
  const props = defineProps<{
    hosId: string;
    type?: 'selDepartment';
  }>();
  const emits = defineEmits(['update:hosId', 'get-list', 'change']);

  const getHosName = computed(() => {
    if (hosList.value.length) {
      const item = hosList.value.find((o) => o.hosId == props.hosId);
      if (item) {
        return item.hosName;
      } else {
        return props.hosId;
      }
    } else {
      return '';
    }
  });

  const change = (e) => {
    emits('change', e);
  };

  const toggleHos = () => {
    const len = hosList.value.length;
    if (len) {
      if (len === 1) {
        gStores.messageStore.showMessage('没有可切换的院区', 3000);
      } else {
        isToggleDialogShow.value = true;
      }
    } else {
      gStores.messageStore.showMessage('请求医院列表中， 请稍后点击', 3000);
    }
  };

  const getHosList = async () => {
    let list = await ServerStaticData.getHosList();

    if (props.type === 'selDepartment') {
      list = list.filter((o) => o.ifClick !== '1');
    }

    hosList.value = list;
    emits('get-list', {
      list,
    });
  };

  const changeValue = (v) => {
    emits('update:hosId', v);
  };

  const init = async () => {
    getHosList();
  };

  onMounted(() => {
    init();
  });
</script>

<style lang="scss" scoped>
  .bread-crumbs {
    display: flex;

    font-size: var(--hr-font-size-xs);
    color: var(--hr-neutral-color-7);
    align-items: center;
    padding: 14rpx 30rpx;

    .hos-name {
      color: var(--hr-neutral-color-10);
    }

    .ico-arrow {
      font-size: var(--hr-font-size-xl);
    }

    .hos-label {
      white-space: nowrap;
    }
  }
</style>
