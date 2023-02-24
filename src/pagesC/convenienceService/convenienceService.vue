<template>
  <view class="g-page page">
    <g-flag typeFg="1008" isShowFg />
    <view class="container">
      <view class="content mt16" v-if="isComplete && lists?.length">
        <Service-List :list="lists" @update:value="changeNum" />
      </view>
      <view class="empty-list" v-else-if="isComplete">
        <g-empty :current="1" />
      </view>
    </view>

    <g-message />
    <view class="footer">
      <view class="amount" @click="regDialogConfirm.show">
        <view class="iconfont">
          <text
            :class="{
              'uni--disabled': totalNum == 0,
            }"
            >&#xe70a;</text
          >
          <view v-if="totalNum != 0" class="num">{{ totalNum }}</view></view
        >

        <text class="add f28">合计</text>

        <text class="money f36 color-error g-bold">{{ totalMoney }}元</text></view
      >
      <button class="btn g-bord btn-primary f36" @click="confirm">
        <text>确定</text>
      </button>
    </view>
    <view v-if="chooseItem?.length">
      <Choose-Popup
        title="已选项目"
        :totalNum="totalNum"
        :list="chooseItem"
        @item-click="changeNum2"
        ref="regDialogConfirm"
      >
        <template #footer>
          <view class="footer2">
            <view class="amount" @click="regDialogConfirm.show">
              <view class="iconfont">
                <text
                  :class="{
                    'uni--disabled': totalNum == 0,
                  }"
                  >&#xe70a;</text
                >
                <view v-if="totalNum != 0" class="num">{{ totalNum }}</view></view
              >

              <text class="add f28">合计</text>

              <text class="money f36 color-error g-bold">{{ totalMoney }}元</text></view
            >
            <button class="btn g-bord btn-primary f36" @click="confirm">
              <text>确定</text>
            </button>
          </view>
        </template>
      </Choose-Popup>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import ChoosePopup from './components/choosePopup.vue';
import { onLoad, onPullDownRefresh, onShow } from "@dcloudio/uni-app";
import { GStores, debounce, ServerStaticData } from "@/utils";
import api from "@/service/api";
import { joinQuery } from '@/common';
import { deQueryForUrl} from '@/common/utils';
import ServiceList from "./components/serviceList.vue";

import { type IServiceList } from './utils/index';
interface IPageProps {
  hosId: string;
  hosName: string;
}
const pageProps = ref(<IPageProps>{});
const gStores = new GStores();
const confirmFgTitle = ref('');
const isComplete = ref(false);
const totalNum = ref(0);
const totalMoney = ref(0);
const lists = ref<IServiceList[]>([]);
const regDialogConfirm = ref<any>('')
const chooseItem = ref<any[]>([])

let getListData = async () => {
  const arg = {
  };
  isComplete.value = false;
  const { result } = await api.getConvenientServiceList(arg).finally(() => {
    isComplete.value = true;
  });
  lists.value = result || [];
  lists.value.map((item, n)=>{
    lists.value[n].num = 0
  })
};

getListData = debounce(getListData, 80);

const changeNum = (o) =>{
  totalNum.value = 0
  totalMoney.value = 0
  o.map((item: any)=>{
    totalNum.value += item.num

    totalMoney.value = Number(((totalMoney.value + item.num * Number(item.fee)) * 100).toFixed(2)) / 100
  })
  lists.value = o
  chooseItem.value = o.filter((item: any) => item.num != 0);
}

const changeNum2 = (o) =>{
  totalNum.value = 0
  totalMoney.value = 0
  o.map((item: any)=>{
    totalNum.value += item.num
    totalMoney.value = totalMoney.value + item.num * Number(item.fee)
  })
  chooseItem.value = o.filter((item: any) => item.num != 0);
  // console.log("1111",o, chooseItem.value)
}

const confirm = () =>{
  // const { patientId } = gStores.userStore.patChoose;
  // const { cardNumber, patientName } = lists.value;
  // 多个项目算n份不合并
  let newChooseItemobj:any[] = [];
  chooseItem.value.map((item: any) =>{
    for(let i= 0; i < item.num; i++){
      newChooseItemobj.push({
        ...item,
        num: 1
      })
    }
  })
  const { hosId, hosName } = pageProps.value
  uni.navigateTo({
    url: joinQuery("/pagesC/convenienceService/confirmOrder", {
      totalNum: totalNum.value,
      totalMoney: totalMoney.value,
      lists: JSON.stringify(newChooseItemobj),
      hosId,
      hosName
    }),
  });
}

const init = async () => {
  await getListData();
};

onLoad((p) => {
  pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
});

onShow(() => {
  init();
});
</script>

<style lang="scss" scoped>
.page {
  background-color: var(--h-color-white);
  .container {
    width: calc(100% - 64rpx);
    margin-left: 32rpx;
    margin-bottom: 24rpx;
    .f-button {
      margin-top: 104rpx;
      display: flex;
      .f-b1 {
        background: #e9f0ff;
        color: #296fff;
        width: 100%;
      }
      .f-b2 {
        width: 100%;
      }
    }
  }
  .sec-con {
    width: calc(100% - 64rpx);
    margin-left: 32rpx;
    margin-top: 24rpx;
    background: #ffffff;
    border: 1rpx solid #e6e6e6;
    border-radius: 8rpx;
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10rpx 24rpx;
      .con-flex {
        display: flex;
        justify-content: space-between;
        align-content: center;
      }
      .icon-color {
        font-size: 40rpx;
        color: var(--hr-warning-color-6);
      }
    }
  }
}
.footer {
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  background-color: var(--h-color-white);
  border-top: 1rpx solid var(--hr-neutral-color-2);
  .amount {
    display: flex;
    align-items: center;
    margin: 24rpx 32rpx 68rpx 32rpx;
    .iconfont {
      color: var(--hr-brand-color-6);
      font-size: 80rpx;
      position: relative;
      .num {
        font-size: 24rpx;
        position: absolute;
        text-align: center;
        line-height: 32rpx;
        right: 0;
        top: 0;
        width: 32rpx;
        height: 32rpx;
        background: var(--hr-error-color-6);
        border: 1rpx solid var(--h-color-white);
        border-radius: 50%;
        color: var(--h-color-white);
      }
    }

    .add {
      color: var(--hr-neutral-color-8);
    }
  }
  .btn {
    width: 40%;
    margin: 24rpx 32rpx 68rpx 32rpx;
  }
}
.footer2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--h-color-white);
  .amount {
    display: flex;
    align-items: center;
    margin: 24rpx 32rpx 68rpx 0rpx;
    .iconfont {
      color: var(--hr-brand-color-6);
      font-size: 80rpx;
      position: relative;
      .num {
        position: absolute;
        text-align: center;
        line-height: 32rpx;
        right: 0;
        top: 0;
        font-size: 24rpx;
        width: 32rpx;
        height: 32rpx;
        background: var(--hr-error-color-6);
        border: 1rpx solid var(--h-color-white);
        border-radius: 50%;
        color: var(--h-color-white);
      }
    }

    .add {
      color: var(--hr-neutral-color-8);
    }
  }
  .btn {
    width: 40%;
    margin: 24rpx 32rpx 68rpx 32rpx;
  }
}
.uni--disabled {
  color: #c0c0c0 !important;
  /* #ifdef H5 */
  cursor: not-allowed;
  /* #endif */
}
:deep(.wyb-popup-box) {
  height: 100vh !important;
}
</style>
