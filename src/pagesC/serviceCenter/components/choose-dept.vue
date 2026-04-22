<template>
  <view class="pop">
    <Gl-Popup
      ref="popup"
      :type="type"
      :title="title"
      @hide="hide"
      :showCloseIcon="false"
    >
      <template v-if="$slots.header" #header>
        <slot name="header" />
      </template>

      <view>
        <Department-List
          v-if="depList.length"
          :list="depList"
          :level="depLevel"
          :active-lv1="deptStore.activeLv1"
          :active-lv2="deptStore.activeLv2"
          :active-lv3="deptStore.activeLv3"
          @item-click-lv1="itemClickLv1"
          @item-click-lv2="itemClickLv2"
          @item-click-lv3="itemClickLv3"
          @handleCustomize="handleCustomize"
        ></Department-List>
        <view v-else class="nodata">
          <g-empty />
        </view>
      </view>
      <view class="footer flex">
        <view
          @click="reSet"
          class="btn btn-plain flex1 btn-border btn-normal  m12 mb32 ml32"
        >
          {{ '重置' }}
        </view>
        <view
          @click="deptSure"
          class="btn btn-primary flex1  m12 mb32 mr32"
        >
          {{ '确定' }}
        </view>
      </view>
    </Gl-Popup>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, onMounted } from 'vue';
  import GlPopup from '@/components/g-popup/g-popup.vue';
  import {
    IDeptLv1,
    IDeptLv2,
    IDeptLv3,
    isLev1,
    isLev2,
    loopDeptList,
    useCacheStore,
    useDeptStore,
  } from '@/stores';
  import DepartmentList from './DepartmentList.vue';
  import { GStores } from '@/utils';
  import api from '@/service/api';

  const props = withDefaults(
    defineProps<{
      show: boolean;
      title?: string;
      type?: 'top' | 'bottom';
      value: any;
      pageType?: '2' | '3';
    }>(),
    {
      title: '',
      type: 'bottom',
      show:false
    }
  );

  const pageProps = ref(<typeof props>{});

  const depList = ref<IDeptLv1[]>([]);
  const depLevel = ref('1');
  const gStores = new GStores();
  const deptStore = useDeptStore();
  const cacheStore = useCacheStore();
  const hosList = ref<any[]>([]);
  const deptListLevel1 = ref('2');
  const celebratedDeptData = ref<Array<string>>([]);
  let deptStep: any[] = [];

  const _id = new Date().getTime() + 213;

  const popup = ref<InstanceType<typeof GlPopup>>();
  const emits = defineEmits(['update:show', 'update:value', 'change']);

  const isActive = (item) => {};

  const hide = () => {
    emits('update:show', false);
  };

  const change = (item) => {
    emits('change', {
      item,
    });
  };

  uni.$on('_CloseGlobalSelector', (e) => {
    if (_id !== e) {
      close();
    }
  });

  const close = () => {
    popup.value?.hide();
  };

  const show = async () => {
    uni.$emit('_CloseGlobalSelector', _id);
    popup.value?.show();
    if (props.value.hosId) {
      if (
        depList.value &&
        depList.value.length > 0 &&
        depList.value[0].hosId === props.value.hosId
      ) {
      } else {
        await getDepList();
      }
    }
  };

  watch(
    () => props.show,
    () => {
      console.log(999999,);
      
      if (props.show) {
        show();
      } else {
        close();
      }
    }
  );

  const handleCustomize = async (value) => {
    depList.value = depList.value.map((item, index) => {
      if (depList.value.length - 1 === index) {
        // 如果是最后一个部门，添加自定义部门
        let items = {
          secondDeptName: value,
          secondDefaultShowDept: '0',
          secondShowNo: '9999',
          hosId: props.value.hosId,
          secondHosDeptId: generateUuid(),
          secondVisitingArea: '',
          secondStandardDeptCode: '',
          deptName: value,
          hosDeptId: generateUuid(),
          showNo: '9999',
          standardDeptCode: '',
          uuid: generateUuid(),
        };
        if (item?.children) {
          item.children = [items, ...item.children];
        } else {
          item.children = [items];
        }
      }
      return item;
    });
  };
  const getDepList = async () => {
    const requestArg: any = {
      source: 19,
      hosId: props.value.hosId,
      clinicalType: 15,
      sysCode:1001017,
    };
    // props.value?.sysCode && (requestArg.sysCode = props.value.sysCode);
    const getDeptListApi = api.getHisDeptList;
    // const res = await api.getDeptList(requestArg).finally(() => {});
    const { result } = await getDeptListApi(requestArg)
    const { firstDeptList } = result;
    firstDeptList.push({
      firstDefaultShowDept: '0',
      firstDeptName: '其他',
      firstHosDeptId: 'customize',
      firstShowNo: '9999',
      firstStandardDeptCode: '',
      hosId: props.value.hosId,
    });
    deptListLevel1.value = '2';
    let deptListLevel = '2';
    loopDeptList(firstDeptList, deptListLevel);
    _loopDeptList(firstDeptList);
    depList.value = firstDeptList;
    depLevel.value = deptListLevel;
  };

  const _loopDeptList = (list: any[]) => {
    list.map((o) => {
      const { children } = o;

      if (children && children.length) {
        _loopDeptList(children);
      }

      o.uuid = generateUuid();
    });
  };

  const generateUuid = function (len = 36, binary = 16) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, (c) => {
        const r = (Math.random() * binary) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;

        return v.toString(binary);
      })
      .substring(0, len);
  };

  const itemClickLv1 = (item: IDeptLv1) => {
    console.log('111111', item);

    deptStore.changeActiveLv1(item);
    deptStep = [item];
  };

  const itemClickLv2 = (item: IDeptLv2) => {
    if (deptListLevel1.value == '2') {
      let Arr = deptStore.activeLv2;
      deptStore.changeActiveLv2(updateArray(Arr, item));
      deptStep = [...deptStep.slice(0, 1), item];
    } else {
      deptStore.changeActiveLv2(item);
      deptStep = [...deptStep.slice(0, 1), item];
    }
  };

  const itemClickLv3 = (item: IDeptLv3) => {
    // console.log(deptStore.activeLv3);
    let Arr = deptStore.activeLv3;
    // deptStore.activeLv3.fin

    deptStore.changeActiveLv3(updateArray(Arr, item));
    deptStep = [...deptStep.slice(0, 2), item];
  };

  const deptSure = async () => {
    // const {result} = await api.getHospitalDocsOld({
    //   sysCode:props.value.sysCode,
    //   hosId:props.value.hosId
    // })
    if (deptListLevel1.value == '2') {
      change(deptStore.activeLv2);
    } else {
      change(deptStore.activeLv3);
    }
    close();
  };
  const reSet = () => {
    deptStep = [];
    deptStore.changeActiveLv1({});
    deptStore.changeActiveLv2({});
    deptStore.changeActiveLv3({});
  };

  function updateArray(array, obj) {
    // 查找数组中是否有与 obj.hosDeptId 相同的对象
    const index = array.findIndex((item) => item.hosDeptId === obj.hosDeptId);
    if (index !== -1) {
      // 如果找到，删除该对象
      array.splice(index, 1);
    } else {
      // 如果没有找到，将对象加入数组
      array.push(obj);
    }
    return array;
  }
</script>

<style lang="scss" scoped>
  .popup-row {
    display: grid;
    align-items: center;
    padding: 32rpx 32rpx;
    height: 200rpx;
    width: 85vw;
    margin: auto;
    margin-top: 16rpx;
    border: 1rpx solid #e6e6e6;
    border-radius: 16rpx;
    // grid-template-columns: 1fr 270rpx;

    color: var(--hr-neutral-color-10);

    &-active {
      border: 3rpx solid #296fff;
    }

    &:last-child {
      margin-bottom: 50rpx;
    }

    .ico-check {
      position: absolute;
      right: 60rpx;
      transform: translateY(-80rpx);
      font-size: var(--hr-font-size-xl);
      font-weight: normal;
      color: #fff;
      background-color: $uni-color-primary;
      border-radius: 50%;
      border: 6rpx solid $uni-color-primary;
      width: var(--hr-font-size-xl);
      height: var(--hr-font-size-xl);
    }
  }
  .item {
    .title {
    }
    .detail {
      .line {
        display: flex;
        margin-bottom: 16rpx;
        .sub-title {
          flex: 0 0 150rpx;
          color: #888;
        }
        .content {
          flex: 1 1 auto;
          color: #444;
        }
      }
    }
  }
  .footer {
    height: 180rpx;
    // position: fixed;
    // bottom: 0;
    width: 100%;
    background-color: var(--h-color-white);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .nodata {
    padding-top: 200rpx;
  }
</style>
