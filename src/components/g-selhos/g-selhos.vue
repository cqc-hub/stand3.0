<template>
  <view class="">
    <view
      :class="{
        'my-display-none': hosList.length < 2,
      }"
      class="bread-crumbs flex-between"
      @click="toggleHos"
    >
      <view class="flex-normal">
        <image
          :src="$global.BASE_IMG + 'v3-gsel-hos-icon.png'"
          class="hos-icon mr24"
        />
        <view class="f32 text-ellipsis">{{ getHosName }}</view>
      </view>

      <text :class="`icon-font icon-resize ico_arrow`" />
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
  const props = withDefaults(
    defineProps<{
      hosId: string;
      type?: 'selDepartment';
      autoGetData?: boolean;
    }>(),
    {
      autoGetData: true,
    }
  );
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

    if (list && list.length) {
      if (!props.hosId) {
        emits('update:hosId', list[0].hosId);
      }

      emits('get-list', {
        list,
      });
    }
  };

  const changeValue = (v) => {
    emits('update:hosId', v);
  };

  const init = async () => {
    await getHosList();
  };

  onMounted(() => {
    if (props.autoGetData) {
      init();
    }
  });

  defineExpose({
    init,
  });
</script>

<style lang="scss" scoped>
  .bread-crumbs {
    display: flex;

    font-size: var(--hr-font-size-xs);
    color: var(--hr-neutral-color-7);
    align-items: center;
    padding: 22rpx 30rpx;
    padding-right: 20rpx;
    background-color: #fff;
    box-shadow: 0px -0.5px 0px 0px #e6e6e6 inset;
  }

  .hos-icon {
    width: 48rpx;
    height: 48rpx;
  }

  .icon-resize {
    width: 48rpx;
    height: 48rpx;
    font-size: 48rpx;
  }
</style>
