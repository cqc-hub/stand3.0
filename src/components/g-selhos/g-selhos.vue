<template>
  <view class="">
    <view
      :class="{
        'my-display-none': hosList.length < 2 || isHide,
      }"
      class="bread-crumbs flex-between"
      @click="toggleHos"
    >
      <view class="flex-normal">
        <image
          :src="$global.BASE_IMG + 'v3-gsel-hos-icon.png'"
          class="hos-icon mr24"
          lazy-load
        />
        <view class="f32 text-ellipsis">{{ getHosName }}</view>
      </view>

      <text :class="`icon-font icon-resize ico_arrow f48`" />
    </view>

    <g-select
      v-model:show="isToggleDialogShow"
      :value="hosId || cacheStore.hosId"
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
  import {
    GStores,
    ServerStaticData,
    IHosInfo,
    getLocation,
    wait,
  } from '@/utils';
  import { useCacheStore } from '@/stores';

  const gStores = new GStores();
  const cacheStore = useCacheStore();
  const hosList = ref<IHosInfo[]>([]);
  const isToggleDialogShow = ref(false);
  const props = withDefaults(
    defineProps<{
      hosId: string;
      type?: 'selDepartment';
      autoGetData?: boolean;
      unNeedPosition?: boolean;
      isHide?: boolean;
      // 新增属性：只显示指定hosId的医院
      visibleHosIds?: string[];
    }>(),
    {
      autoGetData: true,
      isHide: false,
      visibleHosIds: () => []
    }
  );
  const emits = defineEmits(['update:hosId', 'get-list', 'change']);

  const getHosName = computed(() => {
    if (hosList.value.length) {
      const currentHosId = cacheStore.hosId || props.hosId;
      const item = hosList.value.find(
        (o) => o.hosId === currentHosId
      );
      if (item) {
        return item.hosName;
      } 
         return hosList.value[0]?.hosName || '';
        // return cacheStore.hosId;
        // return props.hosId;
      
    } else {
      return '';
    }
  });

  const change = (e) => {
    const { item } = e;

    cacheStore.changeHosId(item.hosId);
    emits('update:hosId', item.hosId);
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
    await wait(20);
    const location: any = props.unNeedPosition
      ? {}
      : await getLocation().catch((err) => {
          console.error(err);
        });

    let list = await ServerStaticData.getHosList(
      {
        gisLng: location?.longitude,
        gisLat: location?.latitude,
      },
      {
        noCache: true,
      }
    );

    if (props.type === 'selDepartment') {
      list = list.filter((o) => o.ifClick !== '1');
    }
       
    // 新增：如果传入了visibleHosIds，则只显示这些医院
    if (props.visibleHosIds && props.visibleHosIds.length > 0) {
      list = list.filter((item) => props.visibleHosIds.includes(item.hosId));
    }

    hosList.value = list;
 

    if (list && list.length) {
        let hosItem;
        const currentHosId = props.hosId || cacheStore.hosId;
        if (currentHosId) {
           hosItem = list.find((o) => o.hosId === currentHosId);
        }
        if (!hosItem) {
          hosItem = list[0];
        }
          
        if (props.autoGetData) {
          change({ item: hosItem });
        } else {
          emits('update:hosId', hosItem.hosId);
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
  }
</style>
