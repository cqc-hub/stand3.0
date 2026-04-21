<template>
  <view class="">
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
      <view class="header">
        <view class="dept-line f28" @click="changeDept">
          <view class="label color-888">当前科室：</view>
          <view class="dept color-111">{{ deptInfo?.deptName }}</view>
          <view class="dept-icon color-111">></view>
        </view>
        <view class="input-line 28">
          <view class="input">
            <input
              class="uni-input line-p10"
              placeholder-style="font-size:28rpx;color:#bbb"
              v-model="searchInput"
              placeholder="请输入需要查询的医生"
            />
          </view>
          <view class="self f28" @click="getSelf"  :style="{'color':isHasAllDoc?'#888':''}">
            <text :class="`iconfont icon-write`">&#xe6b9;</text>
            自定义
          </view>
        </view>
      </view>
      <view>
        <view
          v-if="showOptions?.length"
          v-for="(item, i) in showOptions"
          :key="i"
          :class="{
            'popup-row-active': isActive(item),
            'g-border-top': type === 'top',
          }"
          @click="selectItem(item)"
          class="popup-row"
        >
          <view class="popup-row-label">
            <view class="item">
              <view class="detail f28">
                <view class="line" v-if="item?.docName">
                  <view class="content">
                    <view class="title">{{ item?.docName }}</view>
                    <view class="sub-title">{{ item?.docTitleName }}</view>
                    </view>
                </view>
              </view>
            </view>
          </view>
          <view v-if="isActive(item)" class="iconfont ico-check">&#xe6cc;</view>
          <view v-else="isActive(item)" class="iconfont ico-no-check" :class="{'disabled':isHasAllDoc}"></view>
        </view>
        <view v-else class="nodata">
          <g-empty />
        </view>
      </view>
      <view class="dianpian"></view>
      <view class="footer flex">
        <view
          @click="reSet"
          class="btn btn-plain flex1 btn-border btn-normal p24v m12 mb32 ml32"
        >
          {{ '重置' }}
        </view>
        <view
          @click="deptSure"
          class="btn btn-primary flex1 p24v m12 mb32 mr32"
        >
          {{ '确定' }}
        </view>
      </view>
      <Gl-Popup
        ref="selfpopup"
        type="bottom"
        isHideNav
        @hide="selfhide"
        :showCloseIcon="false"
      >
        <view class="input" style="padding: 32rpx 0; width: 85%; margin: auto">
          <input
            class="uni-input line-p10"
            style="width: initial;"
            placeholder-style="font-size:28rpx;color:#bbb"
            v-model="selfContent"
            placeholder="请输入医生姓名"
          />
        </view>
       
        <view
          class="footer1 flex"
          style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0)"
        >
          <view
            @click="addNew"
            class="btn btn-primary flex1 p24v ml32 mb32 mr32"
          >
            {{ '确定' }}
          </view>
        </view>
      </Gl-Popup>
    </Gl-Popup>
  </view>
  <g-select
    v-model:show="deptShow"
    :value="deptInfo"
    :option="props.value.praiseDeptDocParams"
    :field="{
      label: 'deptName',
      value: 'hosDeptId',
    }"
    @change="pickerChange($event)"
    title="选择科室"
  />
</template>

<script lang="ts" setup>
  import { watch, ref, nextTick } from 'vue';
  import GlPopup from '@/components/g-popup/g-popup.vue';
  import { GStores } from '@/utils';
  const props = withDefaults(
    defineProps<{
      show: boolean;
      title?: string;
      option: any[];
      dept: any;
      value: any;
      type?: 'top' | 'bottom';
      field?: {
        label: string;
        value: string;
      };
    }>(),
    {
      title: '',
      type: 'bottom',
    }
  );
  const gStores = new GStores();

  const selfpopup = ref();
  const docArr = ref<any[]>([]);
  const isHasAllDoc = ref(false);
  const deptInfo = ref<any>({});
  const showOptions = ref<any[]>([]);
  const searchInput = ref<string>('');
  const _id = new Date().getTime();
  const deptShow = ref<boolean>(false);
  const popupSelf = ref();
  const selfContent = ref('');

  const popup = ref<InstanceType<typeof GlPopup>>();
  const emits = defineEmits([
    'update:show',
    'update:value',
    'change',
    'changeDept',
  ]);

  const isActive = (item) => {
    return docArr.value.includes(item.hosDocId);
  };

  const changeDept = () => {
    deptSure('changeDept');
    deptShow.value = true;
    close();
    // popupSelf.value.open()
  };
  const pickerChange = ({ item }) => {
    // console.log('________', e);
    emits('changeDept', item);
  };

  const addNew = () => {
    selfpopup.value.hide();
    const selfDoc={
      docName:selfContent.value,
      hosDocId:'customizedDoc'+new Date().getTime()
    }
    props.option.push(selfDoc)
    showOptions.value= props.option
    docArr.value.push(selfDoc.hosDocId)
    selfContent.value=''

  };
  const selfhide = () => {};
  const hide = () => {
    emits('update:show', false);
  };
  const selectItem = (item) => {
    updateArray(docArr.value, item.hosDocId);
    judgeAllDoc()
  };
  function updateArray(array, obj) {
    // 查找数组中是否有与 obj.hosDeptId 相同的对象
    const index = array.findIndex((item) => item === obj);
    if (index !== -1) {
      // 如果找到，删除该对象
      array.splice(index, 1);
    } else {
      // 如果没有找到，将对象加入数组
      array.push(obj);
    }
    return array;
  }

  const getSelf = () => {
  
    if(isHasAllDoc.value){
      gStores.messageStore.showMessage('已选择全体科室成员，不可自定义输入医护', 3000);
      return
    }
    searchInput.value=''
    selfpopup.value.show();
  };
  const change = (item,type) => {
    const value = props.field ? item[props.field.value] : item;

    if (value === props.value) {
      return;
    }

    close();
    emits('update:value', value);
    emits('change', {
      item,type
    });
  };

  uni.$on('_CloseGlobalSelector', (e) => {
    if (_id !== e) {
      close();
    }
  });
  const judgeAllDoc=()=>{
    let allDoc=showOptions.value.find((item) => {
      return item?.disabled
    });
    if(allDoc&&docArr.value.includes(allDoc.hosDocId)){
      docArr.value=[allDoc.hosDocId]
      isHasAllDoc.value=true
      return
    }
    isHasAllDoc.value=false
  }
  const close = () => {
    popup.value?.hide();
  };

  const show = () => {
    // props.value.praiseDeptDocParams.forEach((element, index) => {

    // });
    searchInput.value = '';
    deptInfo.value = props.dept;
    docArr.value = [];
    deptInfo.value.docList.forEach((item) => {
      docArr.value.push(item.hosDocId);
    });
    showOptions.value = props.option;
    uni.$emit('_CloseGlobalSelector', _id);
    popup.value?.show();
  };

  const reSet = () => {
    docArr.value = [];
  };
  const deptSure = async (type) => {
    const deptData = { ...props.dept };
    deptData.docList = [];
    // docArr.value.forEach
    props.option.forEach((doc) => {
      console.log(doc, docArr.value);
      if (docArr.value.includes(doc.hosDocId)) {
        deptData.docList.push({
          docName: doc.docName,
          hosDocId: doc.hosDocId,
          empNo:doc.empNo||''
        });
      }
    });
    change(deptData,type);
  };
  watch(
    () => props.show,
    () => {
      if (props.show) {
        judgeAllDoc()
        show();
      } else {
        close();
      }
    }
  );

  watch(
    () => searchInput.value,
    () => {
      if (!searchInput?.value || searchInput.value == '') {
        showOptions.value = props.option;
      } else {
        showOptions.value = props.option.filter((item) => {
          return item.docName.includes(searchInput.value);
        });
      }
    }
  );
</script>

<style lang="scss" scoped>
  .popup-row {
    display: grid;
    align-items: center;
    padding: 8rpx 32rpx;
    // height: 200rpx;
    width: 85vw;
    margin: auto;
    margin-top: 16rpx;
    border-bottom: 1rpx solid #e6e6e6;
    font-weight: 600;
    // border-radius: 16rpx;
    // grid-template-columns: 1fr 270rpx;

    color: var(--hr-neutral-color-10);

    &-active {
      // border: 3rpx solid #296fff;
    }

    &:last-child {
      margin-bottom: 50rpx;
    }
    .icon-write {
      color: #296fff;
      margin-top: 3rpx;
    }

    .ico-check {
      position: absolute;
      right: 60rpx;
      // transform: translateY(-80rpx);
      font-size: var(--hr-font-size-xl);
      font-weight: normal;
      color: #fff;
      background-color: $uni-color-primary;
      border-radius: 50%;
      border: 3rpx solid $uni-color-primary;
      width: var(--hr-font-size-xl);
      height: var(--hr-font-size-xl);
    }
    .disabled{
      background-color: #e6e6e6 !important;
      border: 3rpx solid #ccc !important;
    }
    .ico-no-check {
      position: absolute;
      right: 60rpx;
      // transform: translateY(-80rpx);
      font-size: var(--hr-font-size-xl);
      font-weight: normal;
      color: #fff;
      background-color: #fff;
      border-radius: 50%;
      border: 3rpx solid #888888;
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
          display: contents;
          .title{

          }
          .sub-title{
            font-size: 24rpx;
            color: #888;
            margin-left: 32rpx;
            font-weight: 400;
          }
        }
      }
    }
  }
  .nodata {
    padding-top: 200rpx;
  }
  .dianpian{
    height: 180rpx;
  }
  .footer1 {
    // height: 180rpx;
    // position: fixed;
    bottom: 0;
    width: 100%;
    background-color: var(--h-color-white);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .footer {
    height: 180rpx;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: var(--h-color-white);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .header {
    .dept-line {
      display: flex;
      padding: 16rpx 32rpx;
      .dept {
        padding: 0 8rpx;
      }
    }
    .input-line {
      display: flex;
      padding: 16rpx 32rpx;
      .input {
        flex: 1 1 auto;
        .uni-input {
          background: #f6f6f6;
          border-radius: 16rpx;
          width: 100%;
          padding: 16rpx;
        }
      }
      .self {
        flex: 0 0 200rpx;
        color: #296fff;
        text-align: end;
        margin: auto;
      }
    }
  }
  .input {
    flex: 1 1 auto;
    .uni-input {
      background: #f6f6f6;
      border-radius: 16rpx;
      width: 100%;
      padding: 16rpx;
    }
  }
</style>
